import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Import file title/logo giống trang Dashboard chuẩn
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Feedback() {
  const navigate = useNavigate();

  // 1. Đọc thông tin user chuẩn xác MỘT LẦN DUY NHẤT ở đầu component
  const currentUser = (() => {
    try {
      const rawData = localStorage.getItem('mediwise_user') || 
                      localStorage.getItem('user') || 
                      localStorage.getItem('userInfo') || '{}';
      return JSON.parse(rawData);
    } catch (e) {
      return {};
    }
  })();

  // Lấy tên user đăng nhập an toàn
  const userObj = currentUser.data || currentUser.user || currentUser;
  const userLoginName = (userObj.username || userObj.name || userObj.fullName || userObj.account || userObj.email || '').trim().toLowerCase();

  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // State phục vụ Modal Chỉnh sửa
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // 2. Gọi API lấy danh sách từ Backend
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

  // 3. Xử lý Xóa Đánh giá (DELETE)
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

  // 4. Mở Modal Chỉnh sửa
  const handleOpenEdit = (item) => {
    setEditingFeedback(item);
    setEditRating(item.rating);
    setEditComment(item.comment);
  };

  // 5. Lưu Chỉnh sửa (PUT)
  const handleSaveEdit = async () => {
    if (!editingFeedback) return;
    try {
      await api.put(`/feedbacks/${editingFeedback.id}`, {
        rating: editRating,
        comment: editComment
      });

      setFeedbacks(prev => prev.map(item => 
        item.id === editingFeedback.id 
          ? { ...item, rating: editRating, comment: editComment }
          : item
      ));

      setEditingFeedback(null);
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
    <div className="flex min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI (Đồng bộ tuyệt đối layout, class và kích thước vị trí Logo/Title với Dashboard) */}
      <aside className="w-80 bg-white border-r border-gray-100 py-6 px-0 flex flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header chuẩn vị trí Dashboard */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          {/* Navigation Buttons */}
          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Về lại trang chủ</span>
            </button>

            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Xem lại kết quả gần nhất</span>
            </button>

            <button 
              onClick={() => navigate('/FeedbackPage')} 
              className="w-full py-4 px-6 rounded-full bg-[#144064] hover:bg-[#0f324f] text-white font-bold text-left transition-all text-sm flex items-center space-x-3 shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.107a.75.75 0 01-.725.64h-12.8a.75.75 0 01-.725-.64l-.001-.107v-.003zM16.5 18.375a6.375 6.375 0 0111.419-3.922.75.75 0 01-.118.995l-3.375 2.625a.75.75 0 01-.932 0l-1.688-1.313a.75.75 0 01.932-1.17l1.096.853 2.64-2.052a4.875 4.875 0 00-7.854 2.977.75.75 0 01-.75.75h-.375z" />
              </svg>
              <span>Tự gửi đánh giá</span>
            </button>

            <button 
              onClick={() => navigate('/profile')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              <span>Hồ sơ cá nhân</span>
            </button>
          </nav>
        </div>

        {/* Nút Back ở góc dưới sidebar giống Dashboard */}
        <div className="px-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-[#144064] hover:bg-[#0f324f] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        <header className="h-28 px-10 flex items-center justify-between border-b border-gray-100 bg-white shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#144064] tracking-tight">
            Tổng Hợp Đánh Giá Của Người Dùng
          </h1>
          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              navigate('/login');
            }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer"
          >
            Đăng xuất
          </button>
        </header>

        <section className="p-10 max-w-5xl space-y-8">
          {/* CARD THỐNG KÊ SAO */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:border-r border-gray-100">
              <span className="text-5xl font-black text-[#144064]">{avgRating}</span>
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
                  filterRating === 0 ? 'bg-[#144064] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả ({feedbacks.length})
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    filterRating === star ? 'bg-[#144064] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <h3 className="text-xl font-bold text-[#144064]">Tất cả nhận xét từ người dùng</h3>

            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium">Đang tải dữ liệu...</div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-8 text-center text-gray-400 font-medium border border-gray-100 shadow-xs">
                Chưa có đánh giá nào cho mức {filterRating} sao.
              </div>
            ) : (
              filteredFeedbacks.map((item) => {
                const itemAuthorName = (item.username || item.author || '').trim().toLowerCase();
                const isOwner = userLoginName !== '' && (userLoginName === itemAuthorName || userObj.role === 'admin');

                return (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-xs border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#e3effd] text-[#144064] font-bold flex items-center justify-center text-sm shadow-inner">
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

                        {isOwner && (
                          <div className="flex space-x-2 text-xs font-bold">
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="px-3 py-1 bg-sky-50 text-[#144064] rounded-lg hover:bg-sky-100 transition-all cursor-pointer"
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

      {/* MODAL CHỈNH SỬA ĐÁNH GIÁ */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-[#144064]">Chỉnh Sửa Đánh Giá</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số sao:</label>
              <select 
                value={editRating} 
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#144064]"
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
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#144064] text-sm"
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
                className="px-4 py-2 rounded-xl bg-[#144064] hover:bg-[#0f324f] text-white text-sm font-bold cursor-pointer"
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