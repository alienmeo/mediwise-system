from app import app, db, Feedback

with app.app_context():
    db.create_all()
    print("===> Đã tạo bảng feedbacks thành công!")