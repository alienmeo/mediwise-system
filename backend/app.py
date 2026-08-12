from flask import Flask, jsonify, request
from flask_cors import CORS
from models.db_models import db, AssessmentHistory, Feedback
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.check_routes import check_bp
import json

app = Flask(__name__)

# Bật CORS cho phép toàn bộ phương thức và origin
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Middleware ép trả về đầy đủ header CORS cho mọi request (kể cả preflight OPTIONS)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Username'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your-secret-key-mediwise'

db.init_app(app)

# Route trang chủ tránh lỗi 404 khi truy cập trực tiếp link Render
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "success",
        "message": "Chào mừng đến với MediWise API Server!",
        "endpoints": {
            "history": "/api/user/history",
            "feedbacks": "/api/feedbacks",
            "auth": "/api/auth"
        }
    }), 200

# Đăng ký Blueprint chuẩn tiền tố
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(check_bp, url_prefix='/api')

# 1. API Lịch sử khảo sát
@app.route('/api/user/history', methods=['GET', 'OPTIONS'])
def direct_user_history():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        histories = AssessmentHistory.query.order_by(AssessmentHistory.created_at.desc()).all()
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
        print(f"Lỗi lấy lịch sử: {e}")
        return jsonify([]), 200

# 2. API Quản lý Feedback (GET công khai hoàn toàn, tránh lỗi 401 Unauthorized)
@app.route('/api/feedbacks', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/feedbacks/<int:feedback_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def manage_feedbacks(feedback_id=None):
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # XEM DANH SÁCH ĐÁNH GIÁ (GET) - Mở công khai không cần token để client luôn lấy được dữ liệu
        if request.method == 'GET':
            feedbacks = Feedback.query.order_by(Feedback.id.desc()).all()
            result = []
            for f in feedbacks:
                result.append({
                    "id": f.id,
                    "rating": f.rating,
                    "comment": f.comment,
                    "username": f.username if f.username else "Người dùng ẩn danh",
                    "date": getattr(f, 'date', 'Gần đây')
                })
            return jsonify(result), 200

        # TẠO ĐÁNH GIÁ MỚI (POST)
        if request.method == 'POST':
            data = request.get_json() or {}
            rating = int(data.get('rating', 5))
            comment = data.get('comment', '').strip()
            username = data.get('username') or request.headers.get('X-Username') or 'Người dùng ẩn danh'
            
            if not comment:
                return jsonify({"error": "Nội dung đánh giá không được để trống"}), 400

            new_feedback = Feedback(
                rating=rating,
                comment=comment,
                username=username
            )
            db.session.add(new_feedback)
            db.session.commit()

            return jsonify({
                "id": new_feedback.id,
                "rating": new_feedback.rating,
                "comment": new_feedback.comment,
                "username": new_feedback.username,
                "date": "Vừa xong"
            }), 201

        # CÁC THAO TÁC CẦN XÁC THỰC THEO ID (PUT, DELETE)
        feedback = Feedback.query.get(feedback_id)
        if not feedback:
            return jsonify({"error": "Không tìm thấy đánh giá"}), 404

        requester_username = request.headers.get('X-Username', '').strip().lower()
        if requester_username and feedback.username:
            if requester_username != feedback.username.strip().lower():
                return jsonify({"error": "Bạn không có quyền thao tác trên đánh giá này!"}), 403

        # CẬP NHẬT (PUT)
        if request.method == 'PUT':
            data = request.get_json() or {}
            if 'rating' in data:
                feedback.rating = int(data['rating'])
            if 'comment' in data:
                feedback.comment = data['comment']
                
            db.session.commit()
            return jsonify({
                "id": feedback.id,
                "rating": feedback.rating,
                "comment": feedback.comment,
                "username": feedback.username
            }), 200

        # XÓA (DELETE)
        if request.method == 'DELETE':
            db.session.delete(feedback)
            db.session.commit()
            return jsonify({"status": "success", "message": "Đã xóa thành công"}), 200

    except Exception as e:
        print(f"Lỗi xử lý feedback API: {e}")
        db.session.rollback()
        return jsonify({"error": "Lỗi server", "message": str(e)}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Lỗi hệ thống từ Server", "message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Đã khởi tạo database thành công!")
    app.run(debug=True, port=5000)