from app import app
from models.db_models import db, IngredientGroup, Ingredient, Synonym, Allergen, CrossAllergy, Drug, DrugIngredient

def seed_medical_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # 1. Thêm nhóm hoạt chất hóa học
        g1 = IngredientGroup(name="Beta-lactams (Kháng sinh)")
        g2 = IngredientGroup(name="NSAIDs (Giảm đau kháng viêm phi steroid)")
        g3 = IngredientGroup(name="Sulfonamides (Thuốc chứa gốc Sulfa)")
        db.session.add_all([g1, g2, g3])
        db.session.commit()

        # 2. Thêm Thành phần (Hoạt chất & Tá dược)
        # Kháng sinh nhóm Penicillin
        ing_pen = Ingredient(name="Penicillin G", is_excipient=False, group_id=g1.id)
        ing_amo = Ingredient(name="Amoxicillin", is_excipient=False, group_id=g1.id)
        # Kháng sinh nhóm Cephalosporin (Có khả năng chéo với Penicillin)
        ing_cef = Ingredient(name="Cefalexin", is_excipient=False, group_id=g1.id)
        
        # NSAIDs
        ing_asp = Ingredient(name="Aspirin", is_excipient=False, group_id=g2.id)
        ing_ibu = Ingredient(name="Ibuprofen", is_excipient=False, group_id=g2.id)
        
        # Giảm đau thông thường
        ing_para = Ingredient(name="Paracetamol", is_excipient=False, group_id=None)
        
        # Tá dược đặc biệt
        ing_lac = Ingredient(name="Lactose", is_excipient=True, group_id=None)

        db.session.add_all([ing_pen, ing_amo, ing_cef, ing_asp, ing_ibu, ing_para, ing_lac])
        db.session.commit()

        # 3. Thêm Từ đồng nghĩa (Synonym)
        syn_para = Synonym(name="Acetaminophen", ingredient_id=ing_para.id)
        db.session.add(syn_para)

        # 4. Thêm Allergen gốc
        all_pen = Allergen(name="Penicillin", category="drug", mapped_ingredient_id=ing_pen.id)
        all_asp = Allergen(name="Aspirin", category="drug", mapped_ingredient_id=ing_asp.id)
        all_milk = Allergen(name="Sữa", category="food", mapped_ingredient_id=None)
        all_seafood = Allergen(name="Hải sản", category="food", mapped_ingredient_id=None)
        db.session.add_all([all_pen, all_asp, all_milk, all_seafood])
        db.session.commit()

        # 5. Thêm luật liên quan dị ứng chéo cấu trúc phân tử phức tạp
        # Ví dụ Penicillin và Cefalexin (Cephalosporin) có tỉ lệ phản ứng chéo y học ~5-10%
        cross1 = CrossAllergy(allergen_id_1=all_pen.id, allergen_id_2=ing_cef.id, evidence_level="high", description="Phản ứng chéo xảy ra do cấu trúc vòng Beta-lactam tương đồng.")
        db.session.add(cross1)

        # 6. Thêm Thuốc thương phẩm có sẵn trong nhà thuốc bệnh viện
        drug_aug = Drug(name="Augmentin", utility="Kháng sinh nhiễm khuẩn đường hô hấp")
        drug_cefa = Drug(name="Cefalexin 500mg", utility="Kháng sinh nhiễm khuẩn đường hô hấp")
        drug_pana = Drug(name="Panadol Extra", utility="Hạ sốt, giảm đau đầu")
        db.session.add_all([drug_aug, drug_cefa, drug_pana])
        db.session.commit()

        # 7. Liên kết Thuốc với Thành phần cấu tạo (Bảng trung gian)
        # Augmentin chứa Amoxicillin + tá dược Lactose
        db.session.add(DrugIngredient(drug_id=drug_aug.id, ingredient_id=ing_amo.id))
        db.session.add(DrugIngredient(drug_id=drug_aug.id, ingredient_id=ing_lac.id))
        
        # Cefalexin 500mg chứa hoạt chất Cefalexin
        db.session.add(DrugIngredient(drug_id=drug_cefa.id, ingredient_id=ing_cef.id))
        
        # Panadol chứa Paracetamol
        db.session.add(DrugIngredient(drug_id=drug_pana.id, ingredient_id=ing_para.id))
        
        db.session.commit()
        print("--- ĐÃ KHỞI TẠO THÀNH CÔNG DATABASE CHUẨN LÂM SÀNG MEDIWISE! ---")

if __name__ == "__main__":
    seed_medical_data()