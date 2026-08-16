import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các file logo và ảnh icon ở đầu file (chuẩn ES Modules)
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 
import image1 from './image1.png';
import image2 from './image2.png';

export default function Dashboard() {
  const navigate = useNavigate();
  // State để điều khiển việc đóng/mở Sidebar trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI (Ẩn trên mobile, hiện từ màn hình md trở lên) */}
      <aside className="hidden md:flex w-80 bg-white border-r border-gray-100 py-6 px-0 flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/dashboard')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          {/* Navigation Buttons */}
          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/Assessment')} 
              className="w-full py-4 px-6 rounded-full bg-[#326871] hover:bg-[#1f3f45] text-white font-bold text-left transition-all text-sm flex items-center space-x-3 shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Bắt đầu khảo sát mới</span>
            </button>

            <button 
              onClick={() => navigate('/feedback')} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#d0e5fb] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.107a.75.75 0 01-.725.64h-12.8a.75.75 0 01-.725-.64l-.001-.107v-.003zM16.5 18.375a6.375 6.375 0 0111.419-3.922.75.75 0 01-.118.995l-3.375 2.625a.75.75 0 01-.932 0l-1.688-1.313a.75.75 0 01.932-1.17l1.096.853 2.64-2.052a4.875 4.875 0 00-7.854 2.977.75.75 0 01-.75.75h-.375z" />
              </svg>
              <span>Đánh giá của người dùng</span>
            </button>

            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-full bg-[#eaf8fb] hover:bg-[#d0e5fb] text-[#326871] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Xem lại kết quả gần nhất</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col w-full">
        
        {/* Top Navbar */}
        <header className="h-20 px-4 md:px-10 flex items-center justify-between border-b md:border-none border-gray-100 bg-white md:bg-transparent">
          
          {/* Cụm trái: Nút Menu 3 gạch & Logo thu gọn trên Mobile */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#eaf8fb] text-[#326871] cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="flex items-center md:hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img src={logoImg} alt="Logo" className="h-9 w-auto object-contain" />
              <img src={brandTextImg} alt="Aellergis" className="h-7 w-auto object-contain max-w-[110px] -ml-2" />
            </div>
          </div>

          {/* Cụm phải: Các nút chức năng */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* ALG Wiki Button */}
            <button 
              onClick={() => navigate('/wiki')}
              className="bg-[#326871] hover:bg-[#1f3f45] text-white px-3.5 py-2 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all flex flex-col items-center justify-center cursor-pointer leading-tight"
            >
              <span>ALG</span>
              <span>Wiki</span>
            </button>

            {/* Profile Badge */}
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center bg-[#eaf8fb] rounded-full p-2 md:px-5 md:py-2.5 md:space-x-3 cursor-pointer hover:bg-[#d0e5fb] transition-all shadow-sm"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#326871] flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-[#326871] font-bold text-sm hidden md:block">
                <div>Hồ sơ tài khoản</div>
                <div className="text-xs font-semibold opacity-80">user : ...</div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center space-x-1 bg-[#326871] hover:bg-[#1f3f45] text-white p-2.5 md:px-6 md:py-3.5 rounded-full font-bold text-xs md:text-sm shadow-md transition-all cursor-pointer"
            >
              <span className="hidden md:inline">Đăng xuất</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            </button>
          </div>
        </header>

        {/* MENU THẢ XUỐNG KHI BẤM NÚT 3 GẠCH TRÊN MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3 shadow-md">
            <button onClick={() => { navigate('/Assessment'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#326871] text-white font-bold text-sm text-left">
               Bắt đầu khảo sát mới
            </button>
            <button onClick={() => { navigate('/feedback'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Đánh giá của người dùng
            </button>
            <button onClick={() => { navigate('/history'); setIsMobileMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl bg-[#eaf8fb] text-[#326871] font-bold text-sm text-left">
               Xem lại kết quả gần nhất
            </button>
          </div>
        )}

        {/* Content Body */}
        <section className="px-4 md:px-10 py-6 max-w-5xl space-y-8">
          
          {/* Welcome Text */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Chào mừng bạn đã quay lại!
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-xs md:text-sm">
              Aellergis mong rằng mỗi ngày trôi qua bạn sẽ trở nên khoẻ mạnh hơn.
            </p>
          </div>

          {/* Card 1: Kiểm tra nguy cơ */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-[#eaf8fb] flex items-center justify-center text-[#326871] shrink-0 overflow-hidden p-3">
                <img src={image1} alt="Icon 1" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Kiểm tra nguy cơ, đánh giá dị ứng
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Cung cấp thông tin về tiền sử dị ứng và loại thuốc bạn đang sử dụng để nhận kết quả đánh giá phù hợp.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/Assessment')} 
              className="w-full md:w-auto bg-[#326871] hover:bg-[#1f3f45] text-white font-bold py-3.5 px-8 rounded-full shadow-md text-sm transition-all shrink-0 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Bắt đầu ngay!</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: Lịch sử kiểm tra */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-[#eaf8fb] flex items-center justify-center text-[#326871] shrink-0 overflow-hidden p-3">
                <img src={image2} alt="Icon 2" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Lịch sử kiểm tra
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Xem lại các kết quả được lưu trữ trước đó.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/history')} 
              className="w-full md:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3.5 px-10 rounded-full text-sm transition-all shrink-0 cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
            >
              <span>Truy cập</span>
              <span>→</span>
            </button>
          </div>

        </section>
      </main>

    </div>
  );
}