from flask import Flask, request, jsonify
from flask_cors import CORS
from models.db_models import db, User, AssessmentHistory
import json
import os

app = Flask(__name__)
# Cấu hình CORS và Secret Key
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Cấu hình Database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mediwise.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# --- IMPORT VÀ ĐĂNG KÝ CÁC BLUEPRINT ---
try:
    from controllers.auth_controller import auth_bp
    from controllers.user_controller import user_bp
    from controllers.admin_controller import admin_bp
    from routes.check_routes import check_bp  # Đã sửa lại đúng đường dẫn vào thư mục routes/
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(check_bp, url_prefix='/api')
except Exception as e:
    print(f"Lỗi import Blueprint: {e}")


# --- API LẤY LỊCH SỬ TRA CỨU ĐÃ ĐƯỢC TÁCH BIỆT THEO USER ---
@app.route('/api/user/history', methods=['GET', 'OPTIONS'])
def direct_user_history():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # Tự động trích xuất user_id từ Token gửi lên trong Header (Bearer Token)
        user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
            import jwt
            try:
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                user_id = payload.get('sub') or payload.get('id')
            except Exception:
                pass

        # Nếu không có token, lấy user đầu tiên làm fallback tạm thời
        if not user_id:
            first_user = User.query.first()
            user_id = first_user.id if first_user else 1

        # Chỉ lọc và lấy lịch sử thuộc về đúng user_id đang đăng nhập
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
                except Exception:
                    pass
            
            history_list.append({
                "id": h.id,
                "drug_name": h.drug_name,
                "risk_level": h.risk_level,
                "created_at": h.created_at.strftime('%Y-%m-%d %H:%M:%S') if h.created_at else None,
                "details": details_obj
            })
            
        return jsonify(history_list), 200
    except Exception as e:
        print(f"Lỗi lấy lịch sử: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/')
def index():
    return jsonify({"message": "MediWise Backend is running successfully!"}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)