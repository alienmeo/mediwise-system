import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Feedback() {
  const navigate = useNavigate();

  // Lấy thông tin tài khoản hiện tại từ LocalStorage
  const currentUser = JSON.parse(localStorage.getItem('mediwise_user') || '{}');

  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // State phục vụ Modal Chỉnh sửa
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // 1. Gọi API lấy danh sách từ Backend (Đã thêm /api/)
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedbacks');
      if (res.data) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error('Chưa kết nối được API Backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 2. Xử lý Xóa Đánh giá (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
      try {
        await api.delete(`/feedbacks/${id}`);
        setFeedbacks(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa!');
        console.error(err);
      }
    }
  };

  // 3. Mở Modal Chỉnh sửa
  const handleOpenEdit = (item) => {
    setEditingFeedback(item);
    setEditRating(item.rating);
    setEditComment(item.comment);
  };

  // 4. Lưu Chỉnh sửa (PUT)
  const handleSaveEdit = async () => {
    if (!editingFeedback) return;
    try {
      await api.put(`/feedbacks/${editingFeedback.id}`, {
        rating: editRating,
        comment: editComment
      });

      // Cập nhật lại danh sách trên UI
      setFeedbacks(prev => prev.map(item => 
        item.id === editingFeedback.id 
          ? { ...item, rating: editRating, comment: editComment }
          : item
      ));

      setEditingFeedback(null); // Đóng Modal
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật!');
      console.error(err);
    }
  };

  const avgRating = feedbacks.length 
    ? (feedbacks.reduce((acc, cur) => acc + cur.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const filteredFeedbacks = filterRating === 0 
    ? feedbacks 
    : feedbacks.filter(f => f.rating === filterRating);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* 1. SIDEBAR BÊN TRÁI */}
      <aside className="w-80 bg-white border-r border-gray-100 p-6 flex flex-col shrink-0">
        <div className="space-y-10">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Mediwise Logo" className="h-14 w-auto object-contain" />
            <img src={brandTextImg} alt="Mediwise" className="h-10 w-auto object-contain" />
          </div>

          <nav className="space-y-4">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
            >
              Trang chủ Dashboard
            </button>
            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
            >
              Xem lại kết quả gần nhất
            </button>
            <button 
              onClick={() => navigate('/FeedbackPage')} 
              className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
            >
              Tự gửi đánh giá
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
            >
              Hồ sơ cá nhân
            </button>
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        <header className="h-24 px-10 flex items-center justify-between border-b border-transparent">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tổng Hợp Đánh Giá Của Người Dùng
          </h1>
          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              navigate('/login');
            }}
            className="bg-[#fbcfe8] hover:bg-[#f472b6] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer"
          >
            Đăng xuất
          </button>
        </header>

        <section className="p-10 max-w-5xl space-y-8">
          {/* CARD THỐNG KÊ SAO */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:border-r border-gray-100">
              <span className="text-5xl font-black text-gray-900">{avgRating}</span>
              <div className="flex justify-center text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-6 h-6 ${i < Math.round(avgRating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-400">Dựa trên {feedbacks.length} đánh giá</p>
            </div>

            {/* BỘ LỌC THEO SỐ SAO */}
            <div className="md:col-span-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                onClick={() => setFilterRating(0)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  filterRating === 0 ? 'bg-[#0284c7] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả ({feedbacks.length})
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    filterRating === star ? 'bg-[#0284c7] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{star} sao</span>
                  <span className="text-xs opacity-75">({feedbacks.filter(f => f.rating === star).length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* DANH SÁCH BÌNH LUẬN CỘNG ĐỒNG */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Tất cả nhận xét từ người dùng</h3>

            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium">Đang tải dữ liệu...</div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="bg-white rounded-[32px] p-8 text-center text-gray-400 font-medium">
                Chưa có đánh giá nào cho mức {filterRating} sao.
              </div>
            ) : (
              filteredFeedbacks.map((item) => {
                const isOwner = true; 

                return (
                  <div key={item.id} className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#0284c7] font-bold flex items-center justify-center text-sm">
                          {item.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.username}</h4>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* NÚT SỬA & XÓA */}
                        {isOwner && (
                          <div className="flex space-x-2 text-xs font-bold">
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-all cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">{item.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* 3. MODAL CHỈNH SỬA ĐÁNH GIÁ */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Chỉnh Sửa Đánh Giá</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số sao:</label>
              <select 
                value={editRating} 
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} sao</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung nhận xét:</label>
              <textarea 
                rows={4}
                value={editComment} 
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setEditingFeedback(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-bold cursor-pointer"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}