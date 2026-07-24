# MediWise - Hệ thống hỗ trợ phát hiện dị ứng chéo các thành phần trong thuốc

Hệ thống chuyên gia dựa trên dữ liệu (Rule-based) phân tích mối tương quan lâm sàng giữa tiền sử ứng và cấu trúc hoạt chất/tá dược trong thuốc. Dự án nói không với AI, đảm bảo kết quả truy vết 100% minh bạch dựa trên quy luật và cơ sở dữ liệu y tế xác thực.

## Các tính năng cốt lõi
1. Đăng ký/Đăng nhập bảo mật hóa mã Token mã hóa JWT.
2. Khảo sát phân nhánh thông minh theo tình trạng: Đã xét nghiệm lâm sàng và Chưa xét nghiệm lâm sàng (Bảng hỏi triệu chứng).
3. Lõi xử lý chuỗi Levenshtein Distance tự động nhận diện sai sót chính tả và tra cứu bảng từ đồng nghĩa (Synonyms).
4. Phân tích dị ứng chéo bắc cầu liên nhóm dược lý (Beta-lactams, NSAIDs...).
5. Gợi ý danh mục thuốc có cùng công dụng điều trị nhưng an toàn cho bệnh nhân.
6. Trang quản trị Admin: Thống kê số liệu, CRUD nhanh thuốc mới, Sao lưu dự phòng dữ liệu thông qua định dạng JSON.

---

## HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY MÁY TRẠM

### 1. Triển khai máy chủ Backend (Python Flask)
- Di chuyển vào thư mục backend:
  ```bash
  cd backend