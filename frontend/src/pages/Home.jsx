import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b4c9] via-[#468093] to-[#204a5c]">
      
      {/* Khối tổng thể căn giữa màn hình với khoảng cách rất khít (space-y-3) */}
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-3">
        
        {/* Biểu tượng Logo to rõ */}
        <div className="flex justify-center">
          <img 
            src={logoImg} 
            alt="Mediwise Icon" 
            className="w-60 h-60 object-contain filter drop-shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Hình ảnh tên thương hiệu */}
        <div className="flex justify-center w-full">
          <img 
            src={brandTextImg} 
            alt="Mediwise" 
            className="h-auto w-full max-w-xs object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-1"
          />
        </div>

        {/* Slogan */}
        <p className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide mb-2">
          An toàn hôm nay - vững vàng ngày mai
        </p>

        {/* Cụm chức năng đăng ký / đăng nhập (Áp sát ngay phía dưới slogan) */}
        <div className="w-full space-y-3">
          
          {/* Khối 1: Đăng ký */}
          <div className="space-y-1">
            <p className="text-cyan-100/90 font-medium text-xs sm:text-sm tracking-wide">
              Bạn là người mới ?
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-6 rounded-full bg-[#407d8e] hover:bg-[#356877] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-300/30"
            >
              Đăng kí tài khoản
            </button>
          </div>

          {/* Khối 2: Đăng nhập */}
          <div className="space-y-1">
            <p className="text-cyan-100/90 font-medium text-xs sm:text-sm tracking-wide">
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