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
      alert('Vui lòng chọn mức độ hài lòng của bạn!');
      return;
    }

    setIsSubmitting(true);

    // 1. Lấy Token từ localStorage để giải quyết lỗi 401 Unauthorized
    const token = localStorage.getItem('mediwise_token') || localStorage.getItem('token');
    
    // 2. Lấy tên user để hiển thị đúng
    const rawUser = localStorage.getItem('mediwise_user') || localStorage.getItem('user') || localStorage.getItem('username');
    let currentUsername = 'test';
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        currentUsername = parsed.username || parsed.fullName || parsed.name || rawUser;
      } catch (err) {
        currentUsername = rawUser;
      }
    }

    try {
      // 3. Gửi request kèm Authorization header
      await api.post('/feedbacks', {
        username: currentUsername,
        rating: Number(rating),
        comment: feedbackText.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // <-- SỬA LỖI 401 Ở ĐÂY
          'X-Username': currentUsername
        }
      });

      alert('Cảm ơn bạn đã gửi đánh giá!');
      navigate('/feedback'); // Quay về trang cộng đồng
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại!'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar và Header giữ nguyên như code cũ của bạn */}
      <aside className="w-80 bg-white border-r border-gray-100 p-6 flex flex-col justify-between shrink-0">
         {/* ... Nội dung Sidebar ... */}
         <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Mediwise Logo" className="h-14 w-auto object-contain" />
            <img src={brandTextImg} alt="Mediwise" className="h-10 w-auto object-contain" />
          </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-24 px-10 flex items-center justify-between border-b border-transparent">
          <h1 className="text-3xl font-extrabold text-gray-900">Cảm ơn bạn đã trải nghiệm MediWise!</h1>
        </header>

        <form onSubmit={handleSubmit} className="p-10 max-w-4xl space-y-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Bạn hài lòng với MediWise ở mức nào?</h2>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)} className="p-1 focus:outline-none">
                    <svg className={`w-12 h-12 ${ (hoverRating || rating) >= star ? "fill-[#f472b6]" : "fill-none" } stroke-[#f472b6]`} viewBox="0 0 24 24" strokeWidth="1.5">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.42.877-.84.622l-4.693-2.836a.563.563 0 00-.58 0l-4.693 2.836c-.42.255-.956-.134-.84-.622l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Bạn có góp ý gì không?</h2>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 p-4 focus:outline-none focus:border-[#f472b6]"
                rows={4}
              ></textarea>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="bg-[#db2777] text-white py-3.5 px-8 rounded-full shadow-md">
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </main>
    </div>
  );
}