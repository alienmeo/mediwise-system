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

    // Lấy thông tin user an toàn từ localStorage
    const rawData = localStorage.getItem('mediwise_user') || 
                    localStorage.getItem('user') || 
                    localStorage.getItem('userInfo') || 
                    localStorage.getItem('username') || '{}';
    
    let currentUsername = 'test';
    try {
      if (!rawData.startsWith('{') && !rawData.startsWith('[')) {
        currentUsername = rawData;
      } else {
        const parsed = JSON.parse(rawData);
        const userObj = parsed.data || parsed.user || parsed;
        currentUsername = userObj.username || userObj.name || userObj.fullName || userObj.account || userObj.email || 'test';
      }
    } catch (err) {
      currentUsername = rawData || 'test';
    }

    try {
      await api.post('/feedbacks', {
        username: currentUsername,
        rating: Number(rating),
        comment: feedbackText.trim()
      }, {
        headers: {
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
      {/* Sidebar bên trái */}
      <aside className="w-80 bg-white border-r border-gray-100 p-6 flex flex-col justify-between shrink-0">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src={logoImg} alt="Mediwise Logo" className="h-14 w-auto object-contain" />
          <img src={brandTextImg} alt="Mediwise" className="h-10 w-auto object-contain" />
        </div>
      </aside>

      {/* Main content bên phải */}
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
                  <button 
                    type="button" 
                    key={star} 
                    onClick={() => setRating(star)} 
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
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
                placeholder="Chia sẻ trải nghiệm của bạn..."
                className="w-full rounded-2xl border border-gray-300 p-4 focus:outline-none focus:border-[#f472b6]"
                rows={4}
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#db2777] hover:bg-[#be185d] text-white py-3.5 px-8 rounded-full shadow-md font-bold transition-all cursor-pointer w-fit"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </main>
    </div>
  );
}