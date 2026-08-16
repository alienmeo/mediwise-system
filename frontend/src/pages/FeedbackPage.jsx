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

          <div className="text-center px-4">
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Khảo sát trải nghiệm<br />người dùng
            </h2>
          </div>

          <div className="relative flex py-2 items-center px-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-2 text-[#326871] text-xs">♥</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <p className="text-gray-400 text-sm text-center px-6 leading-relaxed">
            Ý kiến của bạn là cơ sở giúp Aellergis ngày càng hoàn thiện.
          </p>
        </div>

        {/* Nút Back ở góc dưới sidebar */}
        <div className="px-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-[#326871] hover:bg-[#0f324f] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
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
              Cảm ơn bạn đã trải nghiệm MediWise!
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
            className="flex items-center space-x-1 text-[#326871] hover:text-[#0f324f] font-semibold text-xs md:text-sm transition-colors cursor-pointer"
          >
            <span>Đăng xuất</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
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
            <button onClick={() => { navigate('/history'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
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
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#326871] hover:bg-[#0f324f] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all cursor-pointer text-base disabled:opacity-50"
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