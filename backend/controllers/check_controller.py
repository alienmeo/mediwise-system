from flask import request, jsonify
import json
from models.db_models import db, Allergen, AssessmentHistory
from services.normalization import find_closest_ingredient
from services.engine import MedicalRuleEngine

def run_allergy_assessment(current_user):
    data = request.get_json() or {}
    has_test = data.get('has_test', False) # Boolean: True/False
    target_drug = data.get('target_drug', '').strip()

    if not target_drug:
        return jsonify({'message': 'Vui lòng cung cấp tên loại thuốc bạn chuẩn bị dùng!'}), 400

    engine = MedicalRuleEngine(db.session)
    detected_allergens = []

    if has_test:
        # --- TRƯỜNG HỢP 1: ĐÀ XÉT NGHIỆM TẠI BỆNH VIỆN ---
        raw_allergens = data.get('allergens', [])
        
        for raw_text in raw_allergens:
            matched_ingredient = find_closest_ingredient(raw_text, db.session)
            
            if matched_ingredient:
                allg = db.session.query(Allergen).filter(
                    (Allergen.mapped_ingredient_id == matched_ingredient.id) | 
                    (Allergen.name.ilike(matched_ingredient.name))
                ).first()
                if allg and allg not in detected_allergens:
                    detected_allergens.append(allg)
            else:
                allg = db.session.query(Allergen).filter(Allergen.name.ilike(raw_text.strip())).first()
                if allg and allg not in detected_allergens:
                    detected_allergens.append(allg)
    else:
        # --- TRƯỜNG HỢP 2: CHƯA TỪNG XÉT NGHIỆM (Dựa trên hệ luật triệu chứng) ---
        food_history = data.get('food_history', [])      
        checked_boxes = data.get('checked_boxes', [])    
        symptoms = data.get('symptoms', [])              
        anaphylaxis = data.get('anaphylaxis', False)      

        for item in checked_boxes:
            allg = db.session.query(Allergen).filter(Allergen.name.ilike(item.strip())).first()
            if allg and allg not in detected_allergens:
                detected_allergens.append(allg)

        for food in food_history:
            allg = db.session.query(Allergen).filter(Allergen.name.ilike(food.strip())).first()
            if allg and allg not in detected_allergens:
                detected_allergens.append(allg)

    # Thực thi nạp toàn bộ danh sách tác nhân phát hiện vào Bộ quy luật suy luận
    result = engine.process_assessment(detected_allergens, target_drug)

    # ĐẢM BẢO KHỞI TẠO ĐÚNG CẤU TRÚC PHẦN ĐỒNG BỘ VỚI FRONTEND ĐANG ĐỌC (details)
    if 'details' not in result:
        result['details'] = {
            'recommendations': result.get('recommendations', 'Không có khuyến cáo cụ thể.'),
            'dangerous_ingredients': result.get('dangerous_ingredients', []),
            'cross_triggers': result.get('cross_triggers', []),
            'explanations': result.get('explanations', []),
            'alternatives': result.get('alternatives', [])
        }

    # Điều chỉnh mức nguy cơ dựa trên mức độ nghiêm trọng của triệu chứng lâm sàng
    if not has_test:
        symptoms = data.get('symptoms', [])
        anaphylaxis = data.get('anaphylaxis', False)
        
        # Nếu có dấu hiệu khó thở hoặc sốc phản vệ, nâng cấp mức nguy cơ lên mức tối đa
        if (anaphylaxis or "Khó thở" in symptoms) and result['risk_level'] in ["HIGH", "MEDIUM", "LOW"]:
            result['risk_level'] = "CRITICAL"
            msg = "🔴 NGUY CƠ RẤT CAO: Tiền sử lâm sàng ghi nhận triệu chứng đe dọa tính mạng (Khó thở/Sốc phản vệ). Hệ thống tự động nâng cảnh báo lên mức tối đa. Tuyệt đối không tự ý dùng thuốc này!"
            result['recommendations'] = msg
            result['details']['recommendations'] = msg

    # Cập nhật lại các trường ngoài cùng phòng trường hợp Frontend đọc trực tiếp
    result['drug_name'] = target_drug

    # Tiến hành lưu vết vào lịch sử kiểm tra cơ sở dữ liệu (Cách an toàn nhất)
    try:
        # Tự động trích xuất user_id từ mọi nguồn có thể (Object, Dict, hoặc Request Token)
        user_id = None
        if hasattr(current_user, 'id'):
            user_id = current_user.id
        elif isinstance(current_user, dict):
            user_id = current_user.get('id')
        else:
            # Nếu tất cả cách trên không lấy được, thử lấy trực tiếp từ Flask g.current_user nếu có
            from flask import g
            if hasattr(g, 'current_user'):
                user_id = getattr(g.current_user, 'id', None) or (g.current_user.get('id') if isinstance(g.current_user, dict) else None)

        if user_id:
            history_record = AssessmentHistory(
                user_id=int(user_id),
                drug_name=target_drug,
                risk_level=result['risk_level'],
                result_json=json.dumps(result, ensure_ascii=False)
            )
            db.session.add(history_record)
            db.session.commit()
            print("ĐÃ LƯU LỊCH SỬ THÀNH CÔNG CHO USER_ID:", user_id)
        else:
            print("CẢNH BÁO: Không tìm thấy user_id để lưu lịch sử!")
            
    except Exception as e:
        db.session.rollback()
        print(f"Lỗi ngoại lệ khi lưu lịch sử: {e}")