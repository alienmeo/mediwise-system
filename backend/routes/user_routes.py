from flask import Blueprint, jsonify, request
from controllers.user_controller import get_user_history, send_user_feedback, get_public_feedbacks, update_user_feedback
from controllers.auth_controller import token_required
from models.db_models import User, db # Đã bổ sung import db để commit dữ liệu

user_bp = Blueprint('user', __name__)

@user_bp.route('/history', methods=['GET', 'OPTIONS'])
@token_required
def history_proxy(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        return get_user_history(current_user)
    except Exception as e:
        print(f"Lỗi tại route history: {e}")
        return jsonify([]), 200

@user_bp.route('/feedbacks', methods=['POST', 'OPTIONS'])
@token_required
def feed(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    return send_user_feedback(current_user)

@user_bp.route('/feedbacks', methods=['GET', 'OPTIONS'])
@token_required
def get_feeds(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    return get_public_feedbacks(current_user)

@user_bp.route('/feedbacks/<int:feedback_id>', methods=['PUT', 'OPTIONS'])
@token_required
def update_feed(current_user, feedback_id):
    if request.method == 'OPTIONS':
        return '', 200
    return update_user_feedback(current_user, feedback_id)

# ROUTE XỬ LÝ LẤY VÀ CẬP NHẬT PROFILE (GET & PUT)
@user_bp.route('/user/profile', methods=['GET', 'PUT', 'OPTIONS'])
@token_required
def handle_user_profile(current_user):
    if request.method == 'OPTIONS':
        return '', 200
        
    if request.method == 'GET':
        try:
            return jsonify({
                "username": getattr(current_user, 'username', ''),
                "email": getattr(current_user, 'email', ''),
                "fullName": getattr(current_user, 'full_name', getattr(current_user, 'username', '')),
                "phone": getattr(current_user, 'phone', ''),
                "dob": getattr(current_user, 'dob', '') or getattr(current_user, 'birthday', ''),
                "allergyHistory": getattr(current_user, 'allergy_history', '')
            }), 200
        except Exception as e:
            print(f"Lỗi lấy thông tin profile: {e}")
            return jsonify({"error": "Lỗi server khi lấy profile"}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json() or {}
            
            # Cập nhật thông tin từ payload frontend gửi lên
            if 'fullName' in data:
                current_user.full_name = data['fullName']
            if 'email' in data:
                current_user.email = data['email']
            if 'phone' in data:
                current_user.phone = data['phone']
            if 'dob' in data:
                current_user.dob = data['dob']
            if 'allergyHistory' in data:
                current_user.allergy_history = data['allergyHistory']
                
            # Lưu thay đổi vào Database
            db.session.commit()
            
            return jsonify({"message": "Cập nhật thông tin thành công!"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Lỗi cập nhật profile: {e}")
            return jsonify({"error": str(e)}), 500