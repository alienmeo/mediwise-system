from models.db_models import db, AllergyCase, AssessmentHistory

def evaluate_risk_service(food_name, drug_name, user_id=None):
    if not food_name or not drug_name:
        return {
            "error": "Tên thực phẩm và thuốc không được trống"
        }

    # 1. Tìm Case khớp trong CSDL (Không phân biệt hoa/thường & bỏ khoảng trắng thừa)
    matched_case = AllergyCase.query.filter(
        AllergyCase.food_name.ilike(food_name.strip()),
        AllergyCase.drug_name.ilike(drug_name.strip())
    ).first()

    # 2. Xử lý mức độ nguy cơ
    if matched_case:
        risk_level = matched_case.risk_level
        warning_msg = matched_case.warning_message
    else:
        risk_level = "Low"
        warning_msg = "Chưa ghi nhận phản ứng dị ứng chéo giữa thực phẩm và loại thuốc này."

    # 3. Ghi nhận lịch sử đánh giá
    try:
        history = AssessmentHistory(
            user_id=user_id,
            food_name=food_name.strip(),
            drug_name=drug_name.strip(),
            risk_level=risk_level
        )
        db.session.add(history)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Lỗi lưu AssessmentHistory:", e)

    return {
        "food_name": food_name.strip(),
        "drug_name": drug_name.strip(),
        "risk_level": risk_level,
        "warning_message": warning_msg
    }