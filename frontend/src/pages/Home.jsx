import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b4c9] via-[#468093] to-[#204a5c]">
      
      {/* Khối tổng thể căn giữa - ĐÂY LÀ TRÁI TIM CỦA BỐ CỤC GỌN GÀNG */}
      {/* Chỉ dùng space-y-1.5 (khoảng cách siêu nhỏ) cho TOÀN BỘ các thành phần bên trong */}
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-1.5">
        
        {/* 1. Biểu tượng Logo (Vẫn giữ nguyên kích thước to rõ) */}
        <img 
          src={logoImg} 
          alt="Mediwise Icon" 
          className="w-60 h-60 object-contain filter drop-shadow-xl transition-transform duration-300 hover:scale-105"
        />

        {/* 2. Tên thương hiệu (Áp sát ngay dưới logo) */}
        <img 
          src={brandTextImg} 
          alt="Mediwise" 
          className="h-auto w-full max-w-xs object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        />

        {/* 3. Slogan (Áp sát ngay dưới tên thương hiệu) */}
        <p className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide pb-2">
          An toàn hôm nay - vững vàng ngày mai
        </p>

        {/* 4. Cụm chức năng đăng ký / đăng nhập */}
        {/* Khối này cũng nằm trong luồng chính với khoảng cách rất khít */}
        <div className="w-full space-y-2.5"> {/* Khoảng cách giữa 2 nút */}
          
          {/* Nút Đăng ký (Màu nhạt) */}
          <div className="space-y-1"> {/* Khoảng cách giữa chữ và nút */}
            <p className="text-cyan-100/90 font-medium text-sm tracking-wide">
              Bạn là người mới ?
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-6 rounded-full bg-[#407d8e] hover:bg-[#356877] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-300/30"
            >
              Đăng kí tài khoản
            </button>
          </div>

          {/* Nút Đăng nhập (Màu đậm) */}
          <div className="space-y-1"> {/* Khoảng cách giữa chữ và nút */}
            <p className="text-cyan-100/90 font-medium text-sm tracking-wide">
              Bạn đã có tài khoản ?
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-6 rounded-full bg-[#1b4353] hover:bg-[#143340] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-400/20"
            >
              Đăng nhập ngay
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}