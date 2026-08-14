from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default='user', nullable=True)

class Allergen(db.Model):
    __tablename__ = 'allergens'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), default='Food')
    mapped_ingredient_id = db.Column(db.Integer, nullable=True)
    components = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)

class Drug(db.Model):
    __tablename__ = 'drugs' # Giữ nguyên tên bảng hiện tại của bạn
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Thêm cột active_ingredient để lưu rõ chất chiết xuất (ví dụ: Dầu cá, Glucosamine, Chitosan...)
    active_ingredient = db.Column(db.String(255), nullable=True)
    
class DrugComponent(db.Model):
    __tablename__ = 'drug_components'
    id = db.Column(db.Integer, primary_key=True)
    drug_id = db.Column(db.Integer, db.ForeignKey('drugs.id'), nullable=False)
    ingredient_name = db.Column(db.String(255), nullable=False) # Tên chất cụ thể (VD: Glucosamine, Chitin...)
    description = db.Column(db.String(255), nullable=True)     # Mô tả chi tiết nếu cần

class AllergyCase(db.Model):
    __tablename__ = 'allergy_cases'
    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(100), nullable=False)
    drug_name = db.Column(db.String(100), nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)  # High, Medium, Low
    warning_message = db.Column(db.Text, nullable=False)
class AssessmentHistory(db.Model):
    __tablename__ = 'assessment_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    drug_name = db.Column(db.String(150), nullable=False)
    risk_level = db.Column(db.String(50), nullable=False)
    result_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    rating = db.Column(db.Integer, nullable=False, default=5)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Quan hệ liên kết với User (nếu bảng User có backref hoặc relationship tương ứng)
    user = db.relationship('User', backref=db.backref('feedbacks', lazy=True))

