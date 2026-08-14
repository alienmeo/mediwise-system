from flask import Flask, jsonify, request
from flask_cors import CORS
from models.db_models import db, AssessmentHistory, Feedback
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.check_routes import check_bp
import json

app = Flask(__name__)

# Bật CORS
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Username'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-mediwise'

db.init_app(app)

# --- Các route Blueprint ---
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(check_bp, url_prefix='/api')

# --- API Lịch sử khảo sát ---
@app.route('/api/user/history', methods=['GET', 'OPTIONS'])
def direct_user_history():
    if request.method == 'OPTIONS': return '', 200
    try:
        histories = AssessmentHistory.query.order_by(AssessmentHistory.created_at.desc()).all()
        history_list = []
        for h in histories:
            details_obj = {"recommendations": "Chưa có khuyến cáo chi tiết."}
            if h.result_json:
                try:
                    parsed = json.loads(h.result_json)
                    details_obj['recommendations'] = parsed.get('recommendations') or parsed.get('recommendation', "Chưa có khuyến cáo.")
                except: pass
            history_list.append({
                "id": h.id,
                "drug_name": h.drug_name or "Thuốc chưa rõ tên",
                "risk_level": h.risk_level or "LOW",
                "checked_at": h.created_at.strftime("%d/%m/%Y %H:%M") if h.created_at else "Chưa xác định",
                "details": details_obj
            })
        return jsonify(history_list), 200
    except Exception as e:
        return jsonify([]), 200

# --- API Quản lý Feedback (TỐI ƯU HÓA DELETE) ---
@app.route('/api/feedbacks', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/feedbacks/<int:feedback_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def manage_feedbacks(feedback_id=None):
    if request.method == 'OPTIONS': return '', 200
        
    try:
        # GET: Lấy danh sách
        if request.method == 'GET':
            feedbacks = Feedback.query.order_by(Feedback.id.desc()).all()
            return jsonify([{
                "id": f.id, "rating": f.rating, "comment": f.comment,
                "username": f.username or "Người dùng ẩn danh",
                "date": getattr(f, 'date', 'Gần đây')
            } for f in feedbacks]), 200

        # POST: Tạo mới
        if request.method == 'POST':
            data = request.get_json() or {}
            new_f = Feedback(
                rating=int(data.get('rating', 5)),
                comment=data.get('comment', '').strip(),
                username=data.get('username') or request.headers.get('X-Username') or 'Người dùng ẩn danh'
            )
            db.session.add(new_f)
            db.session.commit()
            return jsonify({"id": new_f.id, "rating": new_f.rating, "comment": new_f.comment, "username": new_f.username, "date": "Vừa xong"}), 201

        # CÁC THAO TÁC CẦN ID (PUT/DELETE)
        feedback = Feedback.query.get(feedback_id)
        if not feedback:
            return jsonify({"error": "Không tìm thấy"}), 404

        # Xác thực quyền sở hữu
        req_user = request.headers.get('X-Username', '').strip().lower()
        if req_user and feedback.username and req_user != feedback.username.strip().lower():
            return jsonify({"error": "Bạn không có quyền thao tác!"}), 403

        # PUT: Cập nhật
        if request.method == 'PUT':
            data = request.get_json() or {}
            feedback.rating = int(data.get('rating', feedback.rating))
            feedback.comment = data.get('comment', feedback.comment)
            db.session.commit()
            return jsonify({"id": feedback.id, "rating": feedback.rating, "comment": feedback.comment, "username": feedback.username}), 200

        # DELETE: Xóa (Đã fix lỗi 500)
        if request.method == 'DELETE':
            db.session.delete(feedback)
            db.session.commit()
            return jsonify({"status": "success", "message": "Đã xóa thành công"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Lỗi API Feedback: {e}")
        return jsonify({"error": "Lỗi server", "message": str(e)}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Lỗi hệ thống", "message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)