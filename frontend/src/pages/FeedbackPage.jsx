import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Import file title/logo chuẩn giống Dashboard và trang Feedback list
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function FeedbackPage() {
  const navigate = useNavigate();
  // State điều khiển đóng/mở menu trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hàm xử lý thông báo khi click vào tính năng lịch sử/kết quả gần nhất
  const handleHistoryClick = () => {
    alert("Tính năng sẽ sớm được cập nhật. Cảm ơn bạn đã tin dùng Aellergis");
  };

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Vui lòng chọn mức độ hài lòng của bạn (đánh giá số sao)!');
      return;
    }

    setIsSubmitting(true);

    const savedUser = localStorage.getItem('mediwise_user') || localStorage.getItem('user');
    let currentUsername = 'Người dùng MediWise';
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const userObj = parsed.data || parsed.user || parsed;
        currentUsername = userObj.fullName || userObj.username || userObj.name || 'Người dùng MediWise';
      } catch (err) {}
    }

    try {
      await api.post('/feedbacks', {
        username: currentUsername,
        rating: Number(rating),
        comment: feedbackText.trim()
      });

      alert('Cảm ơn bạn đã gửi đánh giá!');
      navigate('/feedback'); // Chuyển sang trang xem danh sách tổng hợp
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Không thể gửi đánh giá. Vui lòng kiểm tra kết nối');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI (Ẩn trên mobile, hiện từ màn hình md trở lên) */}
      <aside className="hidden md:flex w-80 bg-white border-r border-gray-100 py-6 px-0 flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header chuẩn vị trí Dashboard */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          {/* Navigation Buttons đồng bộ giao diện */}
          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#c7f2f6] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Về lại trang chủ</span>
            </button>

            <button 
              onClick={handleHistoryClick} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#c7f2f6] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Xem lại kết quả gần nhất</span>
            </button>

            <button 
              onClick={() => navigate('/feedback')} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#c7f2f6] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.107a.75.75 0 01-.725.64h-12.8a.75.75 0 01-.725-.64l-.001-.107v-.003zM16.5 18.375a6.375 6.375 0 0111.419-3.922.75.75 0 01-.118.995l-3.375 2.625a.75.75 0 01-.932 0l-1.688-1.313a.75.75 0 01.932-1.17l1.096.853 2.64-2.052a4.875 4.875 0 00-7.854 2.977.75.75 0 01-.75.75h-.375z" />
              </svg>
              <span>Xem danh sách đánh giá</span>
            </button>

            <button 
              onClick={() => navigate('/profile')} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#c7f2f6] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              <span>Hồ sơ cá nhân</span>
            </button>
          </nav>
        </div>

        {/* Nút Back ở góc dưới sidebar */}
        <div className="px-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-[#326871] hover:bg-[#1f3f45] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 016 6v3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col w-full">
        
        {/* Top Navbar */}
        <header className="h-16 md:h-28 px-4 md:px-10 flex items-center justify-between border-b md:border-none border-gray-100 bg-white md:bg-transparent">
          
          {/* Cụm trái: Nút Menu 3 gạch & Logo thu gọn trên Mobile */}
          <div className="flex items-center space-x-2 overflow-hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#eaf8fb] text-[#326871] shrink-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="flex items-center md:hidden cursor-pointer shrink-0" onClick={() => navigate('/dashboard')}>
              <img src={logoImg} alt="Logo" className="h-7 w-auto object-contain" />
              <img src={brandTextImg} alt="Aellergis" className="h-6 w-auto object-contain max-w-[90px] -ml-1.5" />
            </div>
          </div>

          <div className="hidden md:block">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Cảm ơn bạn đã trải nghiệm Aellergis!
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">
              Vui lòng dành ít phút để chia sẻ trải nghiệm của bạn
            </p>
          </div>

          {/* Nút Đăng xuất */}
          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              navigate('/login');
            }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all cursor-pointer"
          >
            Đăng xuất
          </button>
        </header>

        {/* Tiêu đề chào mừng trên Mobile */}
        <div className="px-4 pt-4 md:hidden">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Cảm ơn bạn đã trải nghiệm Aellergis!
          </h1>
          <p className="text-gray-400 font-medium text-xs mt-0.5">
            Vui lòng dành ít phút để chia sẻ trải nghiệm của bạn
          </p>
        </div>

        {/* MENU THẢ XUỐNG KHI BẤM NÚT 3 GẠCH TRÊN MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3 shadow-md">
            <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Về lại trang chủ
            </button>
            <button onClick={() => { handleHistoryClick(); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Xem lại kết quả gần nhất
            </button>
            <button onClick={() => { navigate('/feedback'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Xem danh sách đánh giá
            </button>
            <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Hồ sơ cá nhân
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-4 md:px-10 py-6 max-w-4xl space-y-6 md:space-y-8 flex-1 flex flex-col justify-between w-full">
          <div className="space-y-6">
            
            {/* Card Chọn sao */}
            <div className="bg-white rounded-[2rem] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 md:space-y-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Bạn hài lòng với Aellergis ở mức nào?
              </h2>

              <div className="flex items-center space-x-2 md:space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-10 h-10 md:w-12 md:h-12 transition-colors duration-200"
                      fill={(hoverRating || rating) >= star ? "#326871" : "none"}
                      stroke="#326871"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.42.877-.84.622l-4.693-2.836a.563.563 0 00-.58 0l-4.693 2.836c-.42.255-.956-.134-.84-.622l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Nhập ý kiến */}
            <div className="bg-white rounded-[2rem] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Bạn có góp ý hoặc mong muốn Aellergis thay đổi điều gì không?
              </h2>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Nhập góp ý của bạn tại đây..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#326871] transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-2 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#326871] hover:bg-[#1f3f45] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all cursor-pointer text-base disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}