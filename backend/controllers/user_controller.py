import json
from flask import jsonify
from models.db_models import AssessmentHistory
from flask import request, jsonify
from models.db_models import db, Feedback

# Nhận trực tiếp current_user từ file route truyền sang
def get_user_history(current_user):
    try:
        # Lấy user_id an toàn từ current_user
        user_id = getattr(current_user, 'id', None)
        if not user_id and isinstance(current_user, dict):
            user_id = current_user.get('id')
            
        # NẾU KHÔNG CÓ USER ID THÌ TRẢ VỀ MẢNG RỖNG NGAY LẬP TỨC (Không được gán bừa bằng 1)
        if not user_id:
            return jsonify([]), 200

        # Truy vấn lịch sử chính xác theo ID của user đó
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
                except Exception:
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
        print(f"LỖI TẠI GET_USER_HISTORY: {e}")
        return jsonify([]), 200 # Trả về mảng rỗng thay vì lỗi 500 để web không bị crash
def send_user_feedback(current_user):
    try:
        data = request.get_json() or {}
        rating = data.get('rating')
        comment = data.get('comment') or data.get('content', '')

        if not rating:
            return jsonify({'message': 'Vui lòng chọn số sao đánh giá!'}), 400

        user_id = getattr(current_user, 'id', None)
        if not user_id and isinstance(current_user, dict):
            user_id = current_user.get('id')

        new_feedback = Feedback(
            user_id=user_id,
            rating=int(rating),
            comment=comment
        )
        
        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({
            "status": "success", 
            "message": "Gửi đánh giá thành công!"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Lỗi gửi feedback: {e}")
        return jsonify({"status": "error", "message": f"Lỗi hệ thống: {str(e)}"}), 500
    except Exception as e:
        print(f"Lỗi gửi feedback: {e}")
        return jsonify({"status": "error", "message": "Lỗi hệ thống"}), 500
def get_public_feedbacks(current_user):
    try:
        feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
        output = []
        for f in feedbacks:
            # Lấy tên an toàn hơn, tránh chết chương trình nếu quan hệ user chưa chuẩn
            uname = "Ẩn danh"
            try:
                if f.user:
                    uname = getattr(f.user, 'username', None) or getattr(f.user, 'name', None) or "Người dùng"
            except Exception:
                pass

            output.append({
                'id': f.id,
                'username': uname,
                'rating': f.rating,
                'comment': f.comment or getattr(f, 'content', ''),
                'created_at': f.created_at.strftime('%Y-%m-%d %H:%M:%S') if f.created_at else ""
            })
        return jsonify(output), 200
    except Exception as e:
        print(f"Lỗi lấy danh sách feedback: {e}")
        return jsonify([]), 200
def update_user_feedback(current_user, feedback_id):
    try:
        # Tìm đánh giá theo ID
        feedback = db.session.get(Feedback, feedback_id)
        if not feedback:
            return jsonify({'message': 'Không tìm thấy đánh giá cần sửa!'}), 404

        # (Tùy chọn) Kiểm tra xem đánh giá có phải của chính user này không (tránh việc sửa đánh giá của người khác)
        if feedback.user_id and feedback.user_id != current_user.id and getattr(current_user, 'role', 'user') != 'admin':
            return jsonify({'message': 'Bạn không có quyền chỉnh sửa đánh giá này!'}), 403

        data = request.get_json() or {}
        rating = data.get('rating')
        comment = data.get('comment') or data.get('content')

        if rating:
            feedback.rating = int(rating)
        if comment is not None:
            feedback.comment = comment.strip()
            # Nếu database của bạn dùng cột 'content' thay vì 'comment', hãy mở dòng dưới:
            # feedback.content = comment.strip()

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Cập nhật đánh giá thành công!"
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Lỗi cập nhật feedback: {e}")
        return jsonify({"status": "error", "message": f"Lỗi hệ thống: {str(e)}"}), 500
