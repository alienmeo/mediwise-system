import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import các file logo và ảnh icon ở đầu file (chuẩn ES Modules)
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 
import image1 from './image1.png';
import image2 from './image2.png';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI */}
      <aside className="w-80 bg-white border-r border-gray-100 py-6 px-0 flex flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          {/* Navigation Buttons */}
          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/Assessment')} 
              className="w-full py-4 px-6 rounded-full bg-[#144064] hover:bg-[#0f324f] text-white font-bold text-left transition-all text-sm flex items-center space-x-3 shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Bắt đầu khảo sát mới</span>
            </button>

            <button 
              onClick={() => navigate('/feedback')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.107a.75.75 0 01-.725.64h-12.8a.75.75 0 01-.725-.64l-.001-.107v-.003zM16.5 18.375a6.375 6.375 0 0111.419-3.922.75.75 0 01-.118.995l-3.375 2.625a.75.75 0 01-.932 0l-1.688-1.313a.75.75 0 01.932-1.17l1.096.853 2.64-2.052a4.875 4.875 0 00-7.854 2.977.75.75 0 01-.75.75h-.375z" />
              </svg>
              <span>Đánh giá của người dùng</span>
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
          </nav>
        </div>

        {/* Nút Back ở góc dưới sidebar */}
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
        
        {/* Top Navbar */}
        <header className="h-28 px-10 flex items-center justify-end space-x-4">
          
          {/* ALG Wiki Button */}
          <button 
            onClick={() => navigate('/wiki')}
            className="bg-[#144064] hover:bg-[#0f324f] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex flex-col items-center justify-center cursor-pointer leading-tight"
          >
            <span>ALG</span>
            <span>Wiki</span>
          </button>

          {/* Profile Badge */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center bg-[#e3effd] rounded-full px-5 py-2.5 space-x-3 cursor-pointer hover:bg-[#d0e5fb] transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#144064] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[#144064] font-bold text-sm">
              <div>Hồ sơ tài khoản</div>
              <div className="text-xs font-semibold opacity-80">user : ...</div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 bg-[#144064] hover:bg-[#0f324f] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Đăng xuất</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
          </button>
        </header>

        {/* Content Body */}
        <section className="px-10 py-6 max-w-5xl space-y-8">
          
          {/* Welcome Text */}
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Chào mừng bạn đã quay lại!
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">
              Aellergis mong rằng mỗi ngày trôi qua bạn sẽ trở nên khoẻ mạnh hơn.
            </p>
          </div>

          {/* Card 1: Kiểm tra nguy cơ */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-[#e3effd] flex items-center justify-center text-[#144064] shrink-0 overflow-hidden p-3">
                <img src={image1} alt="Icon 1" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Kiểm tra nguy cơ, đánh giá dị ứng
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Cung cấp thông tin về tiền sử dị ứng và loại thuốc bạn đang sử dụng để nhận kết quả đánh giá phù hợp.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/Assessment')} 
              className="bg-[#144064] hover:bg-[#0f324f] text-white font-bold py-3.5 px-8 rounded-full shadow-md text-sm transition-all shrink-0 cursor-pointer flex items-center space-x-2"
            >
              <span>Bắt đầu ngay!</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: Lịch sử kiểm tra */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-[#e3effd] flex items-center justify-center text-[#144064] shrink-0 overflow-hidden p-3">
                <img src={image2} alt="Icon 2" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Lịch sử kiểm tra
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Xem lại các kết quả được lưu trữ trước đó.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/history')} 
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3.5 px-10 rounded-full text-sm transition-all shrink-0 cursor-pointer flex items-center space-x-2 shadow-xs"
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