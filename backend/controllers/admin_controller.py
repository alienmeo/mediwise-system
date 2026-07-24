from flask import request, jsonify
import json
from models.db_models import db, Drug, Allergen, Feedback, User, AssessmentHistory

def get_admin_stats():
    """Lấy số liệu tổng quan hệ thống hiển thị Dashboard Admin"""
    total_users = db.session.query(User).count()
    total_drugs = db.session.query(Drug).count()
    total_allergens = db.session.query(Allergen).count()
    total_history = db.session.query(AssessmentHistory).count()
    return jsonify({
        'total_users': total_users,
        'total_drugs': total_drugs,
        'total_allergens': total_allergens,
        'total_history': total_history
    }), 200

def manage_feedbacks():
    """Lấy toàn bộ danh sách feedback đóng góp từ người dùng"""
    feedbacks = db.session.query(Feedback).order_by(Feedback.created_at.desc()).all()
    output = []
    for f in feedbacks:
        output.append({
            'id': f.id,
            'username': f.user.username if f.user else "Ẩn danh",
            'rating': f.rating,
            'comment': f.comment,
            'created_at': f.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(output), 200

def create_drug_by_admin():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    utility = data.get('utility', '').strip()
    
    if not name or not utility:
        return jsonify({'message': 'Vui lòng điền đủ tên thuốc và công năng.'}), 400
        
    new_drug = Drug(name=name, utility=utility)
    db.session.add(new_drug)
    db.session.commit()
    return jsonify({'message': 'Thêm mới thuốc vào DB thành công!'}), 201

def export_database_json():
    """Hàm sao lưu (Export) toàn bộ cấu trúc dữ liệu thuốc và dị ứng ra file cấu trúc JSON"""
    drugs = db.session.query(Drug).all()
    allergens = db.session.query(Allergen).all()
    
    data_dump = {
        'drugs': [{'name': d.name, 'utility': d.utility} for d in drugs],
        'allergens': [{'name': a.name, 'category': a.category} for a in allergens]
    }
    return jsonify(data_dump), 200

def import_database_json():
    """Hàm khôi phục hoặc nạp số lượng lớn dữ liệu (Import) từ file JSON do Admin tải lên"""
    data = request.get_json() or {}
    
    if 'drugs' in data:
        for d in data['drugs']:
            # Kiểm tra tránh trùng lặp
            if not db.session.query(Drug).filter(Drug.name == d['name']).first():
                db.session.add(Drug(name=d['name'], utility=d['utility']))
                
    if 'allergens' in data:
        for a in data['allergens']:
            if not db.session.query(Allergen).filter(Allergen.name == a['name']).first():
                db.session.add(Allergen(name=a['name'], category=a['category']))
                
    db.session.commit()
    return jsonify({'message': 'Nhập dữ liệu tích hợp phân tích thành công!'}), 200