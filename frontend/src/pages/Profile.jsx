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
      <div className="min-h-screen bg-[#f4f7fc] flex items-center justify-center font-bold text-gray-500">
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI */}
      <aside className="w-80 bg-white border-r border-gray-100 py-6 px-0 flex flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-center transition-all text-sm flex items-center justify-center cursor-pointer"
            >
              <span>Về lại trang chủ</span>
            </button>

            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-center transition-all text-sm flex items-center justify-center cursor-pointer"
            >
              <span>Xem lại kết quả gần nhất</span>
            </button>

            <button 
              onClick={() => navigate('/FeedbackPage')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-center transition-all text-sm flex items-center justify-center cursor-pointer"
            >
              <span>Đánh giá của người dùng</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        <header className="h-28 px-10 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hồ Sơ Cá Nhân</h1>
          
          <button 
            onClick={() => {
              localStorage.removeItem('mediwise_token');
              localStorage.removeItem('mediwise_user');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="flex items-center space-x-2 bg-[#144064] hover:bg-[#0f324f] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Đăng xuất</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
          </button>
        </header>

        <section className="px-10 py-6 max-w-4xl space-y-8">
          {/* Card Avatar & Header Info */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#e3effd] flex items-center justify-center text-[#144064] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userInfo.fullName || userInfo.username || 'Người dùng Aellergis'}
              </h2>
              <p className="text-gray-400 font-medium text-sm mt-1">
                {userInfo.email ? `Email: ${userInfo.email}` : `Tài khoản: ${userInfo.username}`}
              </p>
            </div>
          </div>

          {/* Form Chi Tiết Thông Tin */}
          <form onSubmit={handleSave} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">Thông tin chi tiết</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold px-6 py-2 rounded-full text-sm transition-all cursor-pointer"
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
                    className="bg-[#144064] hover:bg-[#0f324f] text-white font-bold px-6 py-2 rounded-full text-sm transition-all cursor-pointer shadow-md"
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
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#144064] disabled:text-gray-500 font-medium text-sm"
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
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#144064] disabled:text-gray-500 font-medium text-sm"
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
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#144064] disabled:text-gray-500 font-medium text-sm"
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
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#144064] disabled:text-gray-500 font-medium text-sm"
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
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#144064] disabled:text-gray-500 font-medium text-sm leading-relaxed"
                />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}