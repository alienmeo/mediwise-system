from flask import Blueprint, jsonify, request
from controllers.user_controller import get_user_history, send_user_feedback, get_public_feedbacks, update_user_feedback
from controllers.auth_controller import token_required
from models.db_models import User # Đảm bảo đã import model User

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

# BỔ SUNG ROUTE /profile CÒN THIẾU Ở ĐÂY ĐỂ TRÁNH LỖI 404 / CORS TRÊN GIAO DIỆN PROFILE
@user_bp.route('/user/profile', methods=['GET', 'OPTIONS'])
@token_required
def get_user_profile(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # current_user được trả về từ decorator @token_required
        return jsonify({
            "username": getattr(current_user, 'username', ''),
            "email": getattr(current_user, 'email', ''),
            "full_name": getattr(current_user, 'full_name', getattr(current_user, 'username', '')),
            "phone": getattr(current_user, 'phone', ''),
            "birthday": getattr(current_user, 'birthday', '')
        }), 200
    except Exception as e:
        print(f"Lỗi lấy thông tin profile: {e}")
        return jsonify({"error": "Lỗi server khi lấy profile"}), 500