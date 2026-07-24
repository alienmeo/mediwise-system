import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import 2 file logo
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* 1. SIDEBAR BÊN TRÁI */}
      <aside className="w-80 bg-white border-r border-gray-100 p-6 flex flex-col shrink-0">
        <div className="space-y-10">
          
          {/* Brand Logo Header */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoImg} alt="Mediwise Logo" className="h-14 w-auto object-contain" />
            <img src={brandTextImg} alt="Mediwise" className="h-10 w-auto object-contain" />
          </div>

          {/* Navigation Buttons  */}
          <nav className="space-y-4">
            <button 
  onClick={() => navigate('/feedback')} 
  className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
>
  Đánh giá của người dùng
</button>

            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-3xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-center transition-all text-base cursor-pointer"
            >
              Xem lại kết quả gần nhất
            </button>
          </nav>
        </div>

       
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI */}
      <main className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-24 px-10 flex items-center justify-end space-x-4 border-b border-transparent">
          {/* Profile Badge */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center bg-[#e0f2fe] rounded-full px-4 py-2 space-x-3 cursor-pointer hover:bg-[#bae6fd] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#fbcfe8] flex items-center justify-center text-[#db2777]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[#0284c7] font-bold text-sm">
              <div>Hồ sơ tài khoản</div>
              <div className="text-xs font-semibold opacity-80">user : ...</div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 my-auto"></div>

          {/* Logout Button */}
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 bg-[#fbcfe8] hover:bg-[#f472b6] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Đăng xuất</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
          </button>
        </header>

        {/* Content Body */}
        <section className="p-10 max-w-5xl space-y-8">
          
          {/* Welcome Text */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Chào mừng bạn đã quay lại!
            </h1>
            <p className="text-gray-400 font-medium mt-2 text-base">
              MediWise mong rằng mỗi ngày trôi qua bạn sẽ trở nên khoẻ mạnh hơn.
            </p>
          </div>

          {/* Card 1: Kiểm tra nguy cơ */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Kiểm tra nguy cơ, đánh giá dị ứng
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cung cấp thông tin về tiền sử dị ứng và loại thuốc bạn đang sử dụng để nhận kết quả đánh giá phù hợp.
              </p>
            </div>
            <button 
              onClick={() => navigate('/Assessment')} 
              className="bg-[#f472b6] hover:bg-[#ec4899] text-white font-bold py-3.5 px-8 rounded-full shadow-sm text-base transition-all shrink-0 cursor-pointer"
            >
              Bắt đầu ngay !
            </button>
          </div>

          {/* Card 2: Lịch sử kiểm tra */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Lịch sử kiểm tra
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Xem lại các kết quả được lưu trữ trước đó.
              </p>
            </div>
            <button 
              onClick={() => navigate('/history')} 
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 font-semibold py-3.5 px-10 rounded-full text-base transition-all shrink-0 cursor-pointer"
            >
              Truy cập
            </button>
          </div>

        </section>
      </main>

    </div>
  );
}