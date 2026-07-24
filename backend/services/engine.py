from models.db_models import (
    Allergen, Drug, Ingredient, DrugIngredient, 
    CrossAllergy, IngredientGroup, FoodAllergyRule
)
import json

class MedicalRuleEngine:
    def __init__(self, db_session):
        self.session = db_session

    def process_assessment(self, user_allergens_input, target_drug_name):
        """
        Thực thi suy luận Rule-based để tính toán rủi ro dị ứng chéo.
        user_allergens_input: Danh sách các thực thể Allergen đã được xác định của user.
        target_drug_name: Tên loại thuốc người dùng đang muốn kiểm tra uống.
        """
        # Trạng thái ban đầu
        highest_risk = "LOW"
        dangerous_ingredients = []
        cross_allergic_triggers = []
        explanations = []
        alternatives = []

        # 1. Tìm thông tin thuốc đích cần sử dụng
        drug = self.session.query(Drug).filter(Drug.name.ilike(target_drug_name.strip())).first()
        if not drug:
            return {
                "risk_level": "LOW",
                "dangerous_ingredients": [],
                "cross_triggers": [],
                "explanations": [f"Thuốc '{target_drug_name}' không nằm trong danh mục cơ sở dữ liệu bệnh viện. Vui lòng tham khảo ý kiến bác sĩ lâm sàng."],
                "alternatives": []
            }

        # Lấy toàn bộ danh sách các thành phần (hoạt chất + tá dược) của loại thuốc đích này
        drug_ingredients = [di.ingredient for di in drug.drug_ingredients]

        # Duyệt qua từng tác nhân dị ứng trong tiền sử của bệnh nhân
        for user_allergen in user_allergens_input:
            
            # Trường hợp đặc biệt: Allergen có liên kết trực tiếp với một hoạt chất cụ thể trong DB
            mapped_ing = None
            if user_allergen.mapped_ingredient_id:
                mapped_ing = self.session.query(Ingredient).get(user_allergen.mapped_ingredient_id)

            for ing in drug_ingredients:
                
                # LUẬT SỐ 1: TRÙNG KHỚP HOÀN TOÀN TRỰC TIẾP (Nguy cơ rất cao - RED)
                if mapped_ing and mapped_ing.id == ing.id:
                    highest_risk = self._update_risk(highest_risk, "CRITICAL")
                    dangerous_ingredients.append(ing.name)
                    explanations.append(
                        f"Thuốc chứa '{ing.name}', chất này trùng khớp trực tiếp với tiền sử dị ứng '{user_allergen.name}' của bạn."
                    )
                    continue

                # LUẬT SỐ 2: TRÙNG NHÓM HOẠT CHẤT CHUYÊN MÔN (Nguy cơ cao - ORANGE)
                if mapped_ing and mapped_ing.group_id and ing.group_id:
                    if mapped_ing.group_id == ing.group_id:
                        group_name = mapped_ing.group.name if mapped_ing.group else "Cùng phân nhóm"
                        highest_risk = self._update_risk(highest_risk, "HIGH")
                        dangerous_ingredients.append(ing.name)
                        cross_allergic_triggers.append(user_allergen.name)
                        explanations.append(
                            f"Hoạt chất '{ing.name}' thuộc nhóm dược lý '{group_name}', đồng nhóm với chất gây ứng cũ của bạn ({user_allergen.name}). Nguy cơ xảy ra dị ứng chéo hệ thống."
                        )
                        continue

                # LUẬT SỐ 3: CÓ DỮ LIỆU DỊ ỨNG CHÉO TRONG DATABASE (Nguy cơ cao hoặc trung bình dựa trên bằng chứng - ORANGE/YELLOW)
                if mapped_ing:
                    # Kiểm tra cặp dị ứng chéo (A chéo B hoặc B chéo A)
                    cross_link = self.session.query(CrossAllergy).filter(
                        ((CrossAllergy.allergen_id_1 == user_allergen.id) & (CrossAllergy.allergen_id_2 == ing.id)) |
                        ((CrossAllergy.allergen_id_2 == user_allergen.id) & (CrossAllergy.allergen_id_1 == ing.id))
                    ).first()

                    if cross_link:
                        if cross_link.evidence_level == 'high':
                            highest_risk = self._update_risk(highest_risk, "HIGH")
                            explanations.append(
                                f"Cảnh báo lâm sàng: Có bằng chứng y học xác thực về phản ứng dị ứng chéo giữa '{user_allergen.name}' và thành phần '{ing.name}' của thuốc."
                            )
                        else:
                            highest_risk = self._update_risk(highest_risk, "MEDIUM")
                            explanations.append(
                                f"Ghi nhận dịch tễ: Thành phần '{ing.name}' cấu trúc tương đồng với '{user_allergen.name}', tuy bằng chứng lâm sàng còn ít nhưng vẫn cần thận trọng."
                            )
                        dangerous_ingredients.append(ing.name)
                        cross_allergic_triggers.append(user_allergen.name)

                # LUẬT SỐ 4: TÁ DƯỢC CÓ NGUY CƠ TỪ THỰC PHẨM (Ví dụ: dị ứng sữa lo ngại tá dược Lactose)
                if ing.is_excipient and user_allergen.category == 'food':
                    if user_allergen.name.lower() in ["sữa", "milk"] and ing.name.lower() in ["lactose", "tá dược lactose"]:
                        highest_risk = self._update_risk(highest_risk, "MEDIUM")
                        dangerous_ingredients.append(ing.name)
                        explanations.append(
                            f"Thuốc này chứa tá dược '{ing.name}' chiết xuất từ sữa, có thể gây khởi phát triệu chứng do bạn có tiền sử dị ứng với sữa thành phẩm."
                        )

        # 5. TÌM KIẾM SẢN PHẨM THUỐC THAY THẾ AN TOÀN (Alternative Drugs)
        if highest_risk in ["HIGH", "CRITICAL", "MEDIUM"]:
            # Tìm các loại thuốc cùng công dụng chính (utility)
            same_utility_drugs = self.session.query(Drug).filter(
                Drug.utility == drug.utility, 
                Drug.id != drug.id
            ).all()

            for alt_drug in same_utility_drugs:
                is_safe = True
                alt_ingredients = [di.ingredient for di in alt_drug.drug_ingredients]
                
                # Kiểm tra xem thuốc thay thế này có dính vết dị ứng nào không
                for alt_ing in alt_ingredients:
                    for user_allergen in user_allergens_input:
                        # Trùng trực tiếp
                        if user_allergen.mapped_ingredient_id == alt_ing.id:
                            is_safe = False
                            break
                        # Trùng nhóm hóa học nguy hiểm
                        if user_allergen.mapped_ingredient_id:
                            allergen_ing = self.session.query(Ingredient).get(user_allergen.mapped_ingredient_id)
                            if allergen_ing and allergen_ing.group_id and alt_ing.group_id and allergen_ing.group_id == alt_ing.group_id:
                                is_safe = False
                                break
                    if not is_safe:
                        break
                
                if is_safe:
                    alternatives.append(alt_drug.name)

        # Trả về kết cấu cấu trúc dữ liệu tường minh sạch sẽ
        return {
            "risk_level": highest_risk,
            "dangerous_ingredients": list(set(dangerous_ingredients)),
            "cross_triggers": list(set(cross_allergic_triggers)),
            "explanations": explanations if explanations else ["Không tìm thấy mối liên hệ cơ tàng hay dị ứng chéo nào. Thuốc an toàn để sử dụng ở mức độ phân tích dữ liệu."],
            "recommendations": self._generate_recommendation(highest_risk),
            "alternatives": alternatives
        }

    def _update_risk(self, current, new_risk):
        """Hàm so sánh bậc để giữ mức nguy cơ cao nhất quét được"""
        order = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
        if order[new_risk] > order[current]:
            return new_risk
        return current

    def _generate_recommendation(self, risk_level):
        if risk_level == "CRITICAL":
            return "🔴 NGUY CƠ RẤT CAO: Tuyệt đối không tự ý sử dụng loại thuốc này. Thành phần thuốc chứa chất bạn dị ứng cấp tính. Hãy liên hệ ngay với bác sĩ chỉ định để đổi thuốc."
        elif risk_level == "HIGH":
            return "🟠 NGUY CƠ CAO: Khả năng xảy ra dị ứng chéo hệ thống rất rõ ràng do cùng nhóm biệt dược cấu trúc. Khuyến cáo đổi sang nhóm thuốc thay thế có cùng công năng y học."
        elif risk_level == "MEDIUM":
            return "🟡 NGUY CƠ TRUNG BÌNH: Cần thận trọng sử dụng. Có thể test áp da hoặc dùng liều thử nghiệm rất nhỏ dưới sự giám sát chặt chẽ tại cơ sở y tế có trang bị phòng chống sốc phản vệ."
        else:
            return "🟢 NGUY CƠ THẤP: Hệ thống không phát hiện tương tác dị ứng chéo nào với các nhóm thành phần của thuốc này. Bạn có thể sử dụng theo chỉ dẫn nhãn thuốc thông thường."