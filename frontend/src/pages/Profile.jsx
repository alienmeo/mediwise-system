import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Đường dẫn import file api.js của bạn

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Profile() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    dob: '',
    allergyHistory: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- LẤY DỮ LIỆU TỪ BACKEND / LOCALSTORAGE ---
  useEffect(() => {
    const token = localStorage.getItem('mediwise_token');

    if (!token) {
      alert('Vui lòng đăng nhập để xem hồ sơ cá nhân!');
      navigate('/login');
      return;
    }

    // 1. Load nhanh dữ liệu có sẵn từ localStorage
    const savedUserData = localStorage.getItem('mediwise_user') || localStorage.getItem('user');
    if (savedUserData) {
      try {
        const parsedUser = JSON.parse(savedUserData);
        setUserInfo((prev) => ({
          ...prev,
          username: parsedUser.username || '',
          email: parsedUser.email || '',
          fullName: parsedUser.fullName || parsedUser.username || '',
          phone: parsedUser.phone || '',
          dob: parsedUser.dob || '',
          allergyHistory: parsedUser.allergyHistory || '',
        }));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu local:", e);
      }
    }

    // 2. Tự động gọi API lấy Profile mới nhất qua api instance
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile'); // Tự động đính kèm Token qua Interceptor
        if (res.data) {
          setUserInfo(res.data);
        }
      } catch (err) {
        console.warn('Chưa kết nối API Backend Profile, đang dùng dữ liệu đăng nhập.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Gửi cập nhật về Server
      await api.put('/user/profile', userInfo);
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      // Nếu Backend chưa có API này thì lưu tạm ở Local
      localStorage.setItem('mediwise_user', JSON.stringify(userInfo));
      alert('Đã cập nhật thông tin!');
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-bold text-gray-500">
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

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
              Về lại trang chủ
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
              Đánh giá của người dùng
            </button>
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        <header className="h-24 px-10 flex items-center justify-between border-b border-transparent">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hồ Sơ Cá Nhân</h1>
          
          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="flex items-center space-x-2 bg-[#fbcfe8] hover:bg-[#f472b6] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Đăng xuất</span>
          </button>
        </header>

        <section className="p-10 max-w-4xl space-y-8">
          {/* Card Avatar & Header Info */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#fbcfe8] flex items-center justify-center text-[#db2777] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userInfo.fullName || userInfo.username || 'Người dùng MediWise'}
              </h2>
              <p className="text-gray-400 font-medium text-sm mt-1">
                {userInfo.email ? `Email: ${userInfo.email}` : `Tài khoản: ${userInfo.username}`}
              </p>
            </div>
          </div>

          {/* Form Chi Tiết Thông Tin */}
          <form onSubmit={handleSave} className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">Thông tin chi tiết</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold px-6 py-2 rounded-full text-sm transition-all cursor-pointer"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2 rounded-full text-sm transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f472b6] hover:bg-[#ec4899] text-white font-bold px-6 py-2 rounded-full text-sm transition-all cursor-pointer"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên tài khoản (Username)</label>
                <input
                  type="text"
                  name="username"
                  disabled={true}
                  value={userInfo.username || ''}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-100 border border-gray-100 text-gray-500 font-medium text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={userInfo.email || ''}
                  onChange={handleChange}
                  placeholder="Thêm email..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#f472b6] disabled:text-gray-500 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Họ và Tên người dùng</label>
                <input
                  type="text"
                  name="fullName"
                  disabled={!isEditing}
                  value={userInfo.fullName || ''}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#f472b6] disabled:text-gray-500 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={userInfo.phone || ''}
                  onChange={handleChange}
                  placeholder="Chưa cập nhật"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#f472b6] disabled:text-gray-500 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  disabled={!isEditing}
                  value={userInfo.dob || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#f472b6] disabled:text-gray-500 font-medium text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tiền sử dị ứng thuốc / Ghi chú sức khỏe</label>
                <textarea
                  name="allergyHistory"
                  rows={3}
                  disabled={!isEditing}
                  value={userInfo.allergyHistory || ''}
                  onChange={handleChange}
                  placeholder="Ghi chú dị ứng thuốc nếu có..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#f472b6] disabled:text-gray-500 font-medium text-sm leading-relaxed"
                />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}