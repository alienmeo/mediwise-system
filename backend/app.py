from flask import Flask, jsonify
from flask_cors import CORS
from models.db_models import db
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.check_routes import check_bp
import json
from flask import request, jsonify
from models.db_models import AssessmentHistory

app = Flask(__name__)

# Bật CORS cho phép toàn bộ phương thức và origin
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

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
def direct_user_history():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        # Lấy user_id từ Token hoặc Header (hoặc xác thực tùy theo hệ thống auth của bạn)
        # Ví dụ lấy thông tin user từ token hoặc header X-User-Id / X-Username tùy cấu trúc app của bạn:
        # Ở đây ta giả sử lấy user_id từ query params hoặc header, hoặc nếu bạn dùng Flask-JWT-Extended:
        
        from flask_jwt_extended import jwt_required, get_jwt_identity
        # Nếu app của bạn dùng JWT, hãy mở dòng decorator @jwt_required() ở trên route này.
        
        # Tạm thời để an toàn, nếu chưa dùng JWT chuẩn ở đây, ta có thể lọc theo user_id được gửi lên từ request headers:
        user_id = request.headers.get('X-User-Id')
        
        if not user_id:
            # Nếu không tìm thấy định danh user, trả về mảng rỗng thay vì lộ dữ liệu chung
            return jsonify([]), 200

        histories = AssessmentHistory.query.filter_by(user_id=int(user_id)).order_by(AssessmentHistory.created_at.desc()).all()
        
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
            
        return jsonify(history_list), 200
    except Exception as e:
        print(f"Lỗi trực tiếp tại app.py: {e}")
        return jsonify([]), 200

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Lỗi hệ thống từ Server", "message": str(e)}), 500

@app.route('/api/feedbacks/<int:feedback_id>', methods=['DELETE', 'OPTIONS'])
def direct_delete_feedback(feedback_id):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        from models.db_models import Feedback
        
        feedback = Feedback.query.get(feedback_id)
        if not feedback:
            return jsonify({"error": "Không tìm thấy đánh giá cần xóa"}), 404
            
        # Lấy thông tin username người gửi yêu cầu từ Header (hoặc query params nếu cần)
        # Frontend có thể truyền username lên qua headers để backend kiểm tra
        requester_username = request.headers.get('X-Username', '').strip().lower()
        
        # Nếu truyền lên đúng username và không phải chính chủ (đồng thời cũng không phải admin nếu có cơ chế)
        # Ta có thể chặn ở đây. (Ở đây ta so sánh trực tiếp với feedback.username)
        if requester_username and feedback.username:
            if requester_username != feedback.username.strip().lower():
                return jsonify({"error": "Bạn không có quyền xóa đánh giá của người khác!"}), 403

        db.session.delete(feedback)
        db.session.commit()
        
        return jsonify({"status": "success", "message": "Đã xóa đánh giá thành công"}), 200
    except Exception as e:
        print(f"Lỗi khi xóa feedback: {e}")
        db.session.rollback()
        return jsonify({"error": "Lỗi server khi xóa", "message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)