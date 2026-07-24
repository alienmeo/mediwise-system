import os
from app import app
from models.db_models import db, Allergen, Drug, AllergyCase, DrugComponent

def reset_and_seed():
    with app.app_context():
        # 1. Xóa file database cũ để làm sạch hoàn toàn (hỗ trợ cả 2 tên phổ biến)
        for db_name in ['database.db', 'mediwise.db']:
            db_file = os.path.join(app.root_path, 'instance', 'database.db')
            if os.path.exists(db_file):
                try:
                    db.session.remove()
                    db.engine.dispose()
                    os.remove(db_file)
                    print(f"🗑️ Đã xóa file cũ: {db_name}")
                except Exception as e:
                    print(f"⚠️ Không thể xóa {db_name}: {e}")

        # 2. Tạo lại toàn bộ cấu trúc bảng
        db.create_all()
        print("📁 Đã tạo cấu trúc bảng mới thành công!")

        # 3. Nạp 6 thực phẩm dị nguyên
        foods = ["Tôm", "Cua", "Cá biển", "Trứng", "Sữa bò", "Đậu nành"]
        for f in foods:
            db.session.add(Allergen(name=f, category='Food'))

        # 4. Nạp 6 loại thuốc kèm thành phần tách riêng chuẩn xác
        drug_data = [
            ("Viatril-S", "Glucosamine chiết xuất từ vỏ tôm, cua (giáp xác)"),
            ("Chitosan STADA", "Chitin/Chitosan chiết xuất từ vỏ tôm, cua (giáp xác)"),
            ("Fish Oil 1000 mg", "Protein cá biển"),
            ("Lactomin Plus", "Men vi sinh nuôi cấy trên môi trường đạm sữa/lactose"),
            ("Vitamin E 400 IU", "Tocopherol tổng hợp (Protein đậu nành)"),
            ("Essentiale Forte N", "Phospholipid chiết xuất từ đậu nành")
        ]

        for name, comp in drug_data:
            d = Drug(name=name)
            # Gán quan hệ thành phần
            d.components = [DrugComponent(ingredient_name=comp)]
            db.session.add(d)

        # 5. Nạp danh sách các Case quy tắc đối chiếu
        cases = [
            AllergyCase(food_name="Tôm", drug_name="Chitosan STADA", risk_level="High", warning_message="Chitosan được chiết xuất từ chitin trong vỏ tôm. Người có tiền sử dị ứng tôm có nguy cơ phản ứng dị ứng nghiêm trọng!"),
            AllergyCase(food_name="Cua", drug_name="Chitosan STADA", risk_level="High", warning_message="Chitosan được chiết xuất từ vỏ cua. Rất nguy hiểm cho người dị ứng hải sản thân vỏ!"),
            AllergyCase(food_name="Tôm", drug_name="Viatril-S", risk_level="Medium", warning_message="Viatril-S chứa Glucosamine chiết xuất từ vỏ giáp xác (tôm, cua). Cần cẩn trọng khi sử dụng."),
            AllergyCase(food_name="Cua", drug_name="Viatril-S", risk_level="Medium", warning_message="Viatril-S chứa Glucosamine chiết xuất từ vỏ giáp xác. Có thể kích ứng người dị ứng cua."),
            AllergyCase(food_name="Cá biển", drug_name="Fish Oil 1000 mg", risk_level="High", warning_message="Dầu cá (Fish Oil) chứa chiết xuất trực tiếp từ cá biển, nguy cơ dị ứng chéo rất cao!"),
            AllergyCase(food_name="Sữa bò", drug_name="Lactomin Plus", risk_level="Medium", warning_message="Lactomin Plus chứa vi khuẩn lên men từ môi trường gốc sữa/lactose, có thể chứa vết đạm sữa bò."),
            AllergyCase(food_name="Đậu nành", drug_name="Essentiale Forte N", risk_level="Medium", warning_message="Essentiale Forte N chứa Phospholipid đậu nành, người dị ứng đậu nành nặng nên tham khảo ý kiến bác sĩ.")
        ]
        db.session.add_all(cases)

        # Lưu thay đổi vào database
        db.session.commit()
        print("✅ ĐÃ NẠP DỮ LIỆU THÀNH CÔNG CHO 6 THUỐC VÀ CÁC CASE!")

if __name__ == '__main__':
    reset_and_seed()