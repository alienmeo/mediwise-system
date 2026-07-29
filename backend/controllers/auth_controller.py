import jwt
import datetime
from flask import request, jsonify, current_app
from functools import wraps
from models.db_models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

# --- DECORATORS XÁC THỰC ---

def token_required(f):
    """Decorator kiểm tra quyền và giải mã JWT từ Request Header"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Bỏ qua xác thực cho request OPTIONS (CORS preflight)
        if request.method == 'OPTIONS':
            return '', 200

        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Mã xác thực không tồn tại. Vui lòng đăng nhập!', 'status': 401}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.session.get(User, data['user_id'])
            if not current_user:
                return jsonify({'message': 'Tài khoản không hợp lệ trên hệ thống.', 'status': 401}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại!', 'status': 401}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Mã token không hợp lệ.', 'status': 401}), 401

        return f(current_user, *args, **kwargs)
    return decorated


def admin_required(f):
    """Decorator kiểm tra đặc quyền Admin cho các API đặc thù"""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if getattr(current_user, 'role', 'user') != 'admin':
            return jsonify({'message': 'Bạn không có đặc quyền truy cập khu vực quản trị này!', 'status': 403}), 403
        return f(current_user, *args, **kwargs)
    return decorated


# --- CONTROLLER CHI TIẾT ---

def register_user():
    try:
        # Hỗ trợ lấy dữ liệu từ cả JSON lẫn Form-data để tránh lỗi 415
        data = request.get_json(silent=True) or request.form
        
        email = data.get('email')
        password = data.get('password')
        username = data.get('username') or (email.split('@')[0] if email else None)

        if not email or not password or not username:
            return jsonify({'error': 'Vui lòng nhập đầy đủ Username, Email và Mật khẩu!'}), 400

        # 1. Kiểm tra trùng email
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email này đã được đăng ký!'}), 400

        # 2. Kiểm tra trùng username
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Tên tài khoản này đã tồn tại!'}), 400

        # Tạo user mới đồng bộ thuật toán hash
        hashed_pw = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_pw
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Đăng ký thành công!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Lỗi hệ thống: {str(e)}'}), 500


def login_user():
    try:
        # Hỗ trợ lấy dữ liệu từ cả JSON lẫn Form-data để tránh lỗi 415
        data = request.get_json(silent=True) or request.form
        
        username_or_email = data.get('username') or data.get('email')
        password = data.get('password')

        if not username_or_email or not password:
            return jsonify({'message': 'Vui lòng nhập tên tài khoản và mật khẩu!'}), 400

        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Sai tài khoản hoặc mật khẩu bảo mật.'}), 401

        secret_key = current_app.config.get('SECRET_KEY', 'mediwise-secret-key-123')
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, secret_key, algorithm="HS256")

        return jsonify({
            'message': 'Đăng nhập thành công!',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username or user.email,
                'email': user.email,
                'role': getattr(user, 'role', 'user')
            }
        }), 200

    except Exception as e:
        print(f"ERROR LOGIN: {str(e)}")
        return jsonify({'message': f'Lỗi hệ thống khi đăng nhập: {str(e)}'}), 500


def change_password(current_user):
    try:
        data = request.get_json(silent=True) or request.form
        old_password = data.get('old_password', '')
        new_password = data.get('new_password', '')

        if not old_password or not new_password:
            return jsonify({'message': 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.'}), 400

        if not check_password_hash(current_user.password_hash, old_password):
            return jsonify({'message': 'Mật khẩu cũ không chính xác.'}), 400

        current_user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({'message': 'Cập nhật thay đổi mật khẩu thành công!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Lỗi hệ thống: {str(e)}'}), 500
