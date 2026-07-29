from flask import Blueprint, request, jsonify, session
from models.db_models import db, Allergen, Drug, AllergyCase, AssessmentHistory, User
import json

check_bp = Blueprint('check_bp', __name__)

@check_bp.route('/data-options', methods=['GET'])
def get_options():
    allergens = Allergen.query.all()
    drugs = Drug.query.all()
    return jsonify({
        'allergens': [{'id': a.id, 'name': a.name} for a in allergens],
        'drugs': [{'id': d.id, 'name': d.name} for d in drugs]
    })

@check_bp.route('/check-allergy', methods=['POST'])
def check_allergy():
    try:
        data = request.get_json() or {}
        food_name = data.get('food_name')
        drug_name = data.get('drug_name')

        if not food_name or not drug_name:
            return jsonify({'error': 'Vui lòng cung cấp cả tên thực phẩm và tên thuốc'}), 400

        mapping_components = {
            "Viatril-S": "Glucosamine chiết xuất từ vỏ giáp xác (tôm, cua)",
            "Chitosan STADA": "Chitin/Chitosan chiết xuất từ vỏ tôm, cua",
            "Fish Oil 1000 mg": "Tinh chất dầu cá biển trực tiếp",
            "Lactomin Plus": "Men vi sinh nuôi cấy trên môi trường đạm sữa/lactose",
            "Vitamin E 400 IU": "Tocopherol tổng hợp",
            "Essentiale Forte N": "Phospholipid chiết xuất từ đậu nành"
        }

        cross_text = mapping_components.get(drug_name, f"Hoạt chất đặc trị trong {drug_name}")

        # Tìm kiếm case cảnh báo trong DB
        case = AllergyCase.query.filter_by(food_name=food_name, drug_name=drug_name).first()

        if case:
            risk_val = case.risk_level
            response_data = {
                'food_name': case.food_name,
                'drug_name': case.drug_name,
                'risk_level': risk_val, 
                'dangerous_components': case.food_name,
                'cross_components': cross_text, # Chỉ hiển thị khi có nguy cơ
                'warning_message': case.warning_message,
                'details': {
                    'recommendations': case.warning_message,
                    'dangerous_ingredients': [case.food_name],
                    'cross_triggers': [cross_text]
                }
            }
        else:
            risk_val = 'Low'
            response_data = {
                'food_name': food_name,
                'drug_name': drug_name,
                'risk_level': risk_val,
                'dangerous_components': 'Không phát hiện',
                'cross_components': 'Không phát hiện', # Đổi thành không phát hiện khi nguy cơ thấp
                'warning_message': f"Chưa ghi nhận tương tác dị ứng chéo giữa '{food_name}' và '{drug_name}'.",
                'details': {
                    'recommendations': f"Chưa ghi nhận tương tác dị ứng chéo giữa '{food_name}' và '{drug_name}'.",
                    'dangerous_ingredients': [],
                    'cross_triggers': []
                }
            }

        # Lưu lịch sử
        try:
            # 1. Thử lấy user_id từ session
            user_id = session.get('user_id')

            # 2. Nếu không có trong session, thử lấy từ request headers (nếu frontend truyền lên qua header)
            if not user_id:
                user_id = request.headers.get('X-User-Id')

            # 3. Tuyệt đối KHÔNG gán fallback về 1 hay first_user nữa để tránh ghi nhầm lịch sử sang tài khoản khác!
            if user_id:
                new_history = AssessmentHistory(
                    user_id=int(user_id),
                    drug_name=drug_name,
                    risk_level=risk_val,
                    result_json=json.dumps(response_data, ensure_ascii=False)
                )
                db.session.add(new_history)
                db.session.commit()
            else:
                print("Không tìm thấy user_id hợp lệ để lưu lịch sử tra cứu.")
                
        except Exception as db_err:
            print(f"Lỗi lưu lịch sử: {db_err}")
            db.session.rollback()

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Lỗi server check-allergy: {str(e)}")
        return jsonify({'error': f'Lỗi hệ thống từ Server: {str(e)}'}), 500