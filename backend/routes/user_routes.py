from flask import Blueprint, jsonify, request
from controllers.user_controller import (
    get_user_history, 
    send_user_feedback, 
    get_public_feedbacks, 
    update_user_feedback, 
    delete_user_feedback
)
from controllers.auth_controller import token_required
from models.db_models import db, User
import jwt

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

# Thêm route profile trực tiếp vào đây để khớp hoàn toàn với frontend
@user_bp.route('/profile', methods=['GET', 'PUT', 'OPTIONS'])
@token_required
def profile_proxy(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # Lấy user_id từ current_user do decorator token_required trả về
        user_id = getattr(current_user, 'id', None)
        if not user_id and isinstance(current_user, dict):
            user_id = current_user.get('id')

        user = db.session.get(User, user_id) if hasattr(db.session, 'get') else User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Không tìm thấy người dùng'}), 404

        if request.method == 'GET':
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': getattr(user, 'role', 'user')
            }), 200

        elif request.method == 'PUT':
            req_data = request.get_json() or {}
            if 'username' in req_data:
                user.username = req_data['username']
            db.session.commit()
            return jsonify({'message': 'Cập nhật hồ sơ thành công!'}), 200

    except Exception as e:
        print(f"Lỗi tại profile: {e}")
        return jsonify({'message': f'Lỗi hệ thống: {str(e)}'}), 500

@user_bp.route('/feedbacks', methods=['POST', 'OPTIONS'])
@token_required
def feed(current_user):
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

@user_bp.route('/feedbacks/<int:feedback_id>', methods=['DELETE', 'OPTIONS'])
@token_required
def delete_feed(current_user, feedback_id):
    if request.method == 'OPTIONS':
        return '', 200
    return delete_user_feedback(current_user, feedback_id)