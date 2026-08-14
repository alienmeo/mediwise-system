import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function FeedbackPage() {
  const navigate = useNavigate();

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

    // Lấy thông tin user từ mọi key có thể lưu trong localStorage
    const rawUser = localStorage.getItem('mediwise_user') || localStorage.getItem('user') || localStorage.getItem('username');
    let currentUsername = 'test'; // Fallback mặc định khớp với hệ thống của bạn

    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        currentUsername = parsed.username || parsed.fullName || parsed.name || rawUser;
      } catch (err) {
        currentUsername = rawUser; // Trường hợp lưu thẳng chuỗi string (VD: "test")
      }
    }

    try {
      await api.post('/feedbacks', {
        username: currentUsername,
        rating: Number(rating),
        comment: feedbackText.trim()
      }, {
        headers: {
          'X-Username': currentUsername // Đảm bảo gửi kèm header để backend bắt chính xác
        }
      });

      alert('Cảm ơn bạn đã gửi đánh giá!');
      navigate('/feedback'); // Chuyển hướng về trang danh sách đánh giá
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Không thể gửi đánh giá. Vui lòng kiểm tra kết nối với Server Backend!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-100 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Mediwise Logo" className="h-14 w-auto object-contain" />
            <img src={brandTextImg} alt="Mediwise" className="h-10 w-auto object-contain" />
          </div>

          <div className="text-center pt-2">
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              Khảo sát trải nghiệm<br />người dùng
            </h2>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-2 text-[#f472b6] text-xs">♥</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <p className="text-gray-400 text-sm text-center px-2 leading-relaxed">
            Ý kiến của bạn là cơ sở giúp MediWise ngày càng hoàn thiện.
          </p>
        </div>

        <div>
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 016 6v3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <header className="h-24 px-10 flex items-center justify-between border-b border-transparent">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Cảm ơn bạn đã trải nghiệm MediWise!
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">
              Vui lòng dành ít phút để chia sẻ trải nghiệm của bạn
            </p>
          </div>

          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              navigate('/login');
            }}
            className="flex items-center space-x-1 text-[#fbcfe8] hover:text-[#f472b6] font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>Đăng xuất</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 max-w-4xl space-y-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                Bạn hài lòng với MediWise ở mức nào?
              </h2>

              <div className="flex items-center space-x-4">
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
                      className="w-12 h-12 transition-colors duration-200"
                      fill={(hoverRating || rating) >= star ? "#f472b6" : "none"}
                      stroke="#f472b6"
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

            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Bạn có góp ý hoặc mong muốn MediWise thay đổi điều gì không?
              </h2>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Nhập góp ý của bạn tại đây..."
                rows={4}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-[#f472b6] focus:ring-1 focus:ring-[#f472b6] transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-[#db2777] hover:bg-[#be185d] text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all cursor-pointer text-base disabled:opacity-50"
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