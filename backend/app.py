from flask import Flask, jsonify
from flask_cors import CORS
from models.db_models import db
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.check_routes import check_bp
import json
from flask import Flask, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
import jwt
from flask import request, jsonify, current_app
from models.db_models import AssessmentHistory, User
import os

app = Flask(__name__)

# Bật CORS cho phép toàn bộ phương thức và origin
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your-secret-key-mediwise'

db.init_app(app)

# Thêm route trang chủ để tránh lỗi 404 khi truy cập trực tiếp link Render
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "success",
        "message": "Chào mừng đến với MediWise API Server!",
        "endpoints": {
            "history": "/api/user/history",
            "auth": "/api/auth",
            "admin": "/api/admin"
        }
    }), 200

# Đăng ký Blueprint chuẩn tiền tố
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(check_bp, url_prefix='/api')

# Đưa trực tiếp API lịch sử vào app.py để tránh mọi lỗi định tuyến Blueprint/CORS
@app.route('/api/user/history', methods=['GET', 'OPTIONS'])
@app.route('/api/history', methods=['GET', 'OPTIONS'])
def direct_user_history():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # Lấy token từ Header Authorization
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Thiếu mã xác thực'}), 401

        # Giải mã token thủ công bằng SECRET_KEY của ứng dụng
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = data.get('user_id')

        if not user_id:
            return jsonify({'message': 'Token không hợp lệ'}), 401

        # Truy vấn lịch sử từ database
        histories = AssessmentHistory.query.filter_by(user_id=user_id).order_by(AssessmentHistory.created_at.desc()).all()
        
        history_list = []
        for h in histories:
            details_obj = {"recommendations": "Chưa có khuyến cáo chi tiết."}
            if h.result_json:
                try:
                    parsed_result = json.loads(h.result_json)
                    if isinstance(parsed_result, dict):
                        if 'recommendations' in parsed_result:
                            details_obj['recommendations'] = parsed_result['recommendations']
                        elif 'recommendation' in parsed_result:
                            details_obj['recommendations'] = parsed_result['recommendation']
                        elif 'details' in parsed_result and isinstance(parsed_result['details'], dict):
                            if 'recommendations' in parsed_result['details']:
                                details_obj['recommendations'] = parsed_result['details']['recommendations']
                except:
                    pass 

            history_list.append({
                "id": h.id,
                "drug_name": h.drug_name if h.drug_name else "Thuốc chưa rõ tên",
                "risk_level": h.risk_level if h.risk_level else "LOW",
                "checked_at": h.created_at.strftime("%d/%m/%Y %H:%M") if h.created_at else "Chưa xác định",
                "details": details_obj
            })
            
        # ĐẶT LỆNH RETURN RA NGOÀI VÒNG LẶP FOR
        return jsonify(history_list), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Phiên đăng nhập đã hết hạn'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Mã token không hợp lệ'}), 401
    except Exception as e:
        print(f"Lỗi trực tiếp tại app.py: {e}")
        return jsonify([]), 200

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Lỗi hệ thống từ Server", "message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)

from flask import make_response

@app.route('/api/force-wipe-history', methods=['GET'])
def force_wipe_history():
    try:
        num_rows = db.session.query(AssessmentHistory).delete()
        db.session.commit()
        html_content = f"<h1 style='color: green; font-family: sans-serif;'>ĐÃ XÓA THÀNH CÔNG {num_rows} BẢN GHI LỊCH SỬ TRÊN SERVER!</h1>"
        return make_response(html_content, 200)
    except Exception as e:
        db.session.rollback()
        html_content = f"<h1 style='color: red; font-family: sans-serif;'>LỖI: {str(e)}</h1>"
        return make_response(html_content, 500)
@app.route('/api/user/profile', methods=['GET', 'PUT', 'OPTIONS'])
def handle_user_profile():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # Lấy token từ Header Authorization
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Thiếu mã xác thực'}), 401

        # Giải mã token lấy user_id
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = data.get('user_id')

        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'message': 'Không tìm thấy người dùng'}), 404

        if request.method == 'GET':
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': getattr(user, 'role', 'user')
            }), 200

        # Xử lý cập nhật profile nếu frontend gửi phương thức PUT
        elif request.method == 'PUT':
            req_data = request.get_json() or {}
            if 'username' in req_data:
                user.username = req_data['username']
            db.session.commit()
            return jsonify({'message': 'Cập nhật hồ sơ thành công!'}), 200

    except Exception as e:
        print(f"Lỗi tại /api/user/profile: {e}")
        return jsonify({'message': f'Lỗi hệ thống: {str(e)}'}), 500