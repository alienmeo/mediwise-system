import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b4c9] via-[#468093] to-[#204a5c]">
      
      {/* Khối tổng thể căn giữa màn hình */}
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-1">
        
        {/* 1. Biểu tượng Logo RẤT TO */}
        <img 
          src={logoImg} 
          alt="Mediwise Icon" 
          className="w-72 h-72 object-contain filter drop-shadow-2xl transition-transform duration-300 hover:scale-105"
        />

        {/* 2. Tên thương hiệu (Kéo sát lên gần logo) */}
        <img 
          src={brandTextImg} 
          alt="Mediwise" 
          className="-mt-4 h-auto w-full max-w-xs object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        />

        {/* 3. Slogan */}
        <p className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide pt-1 pb-2">
          An toàn hôm nay - vững vàng ngày mai
        </p>

        {/* 4. Cụm chức năng đăng ký / đăng nhập (Áp sát ngay dưới slogan) */}
        <div className="w-full space-y-2">
          
          {/* Nút Đăng ký */}
          <div className="space-y-0.5">
            <p className="text-cyan-100/90 font-medium text-xs tracking-wide">
              Bạn là người mới ?
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-6 rounded-full bg-[#407d8e] hover:bg-[#356877] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-300/30"
            >
              Đăng kí tài khoản
            </button>
          </div>

          {/* Nút Đăng nhập */}
          <div className="space-y-0.5">
            <p className="text-cyan-100/90 font-medium text-xs tracking-wide">
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