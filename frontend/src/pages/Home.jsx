import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b4c9] via-[#468093] to-[#204a5c]">
      
      {/* Khối tổng thể căn giữa màn hình */}
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-3">
        
        {/* 1. Biểu tượng Logo */}
        <div className="flex justify-center">
          <img 
            src={logoImg} 
            alt="Allergis Icon" 
            className="w-64 h-64 object-contain filter drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 2. Tiêu đề thương hiệu Allergis */}
        <div className="flex justify-center w-full -mt-6">
          <img 
            src={brandTextImg} 
            alt="Allergis" 
            className="h-auto w-full max-w-[280px] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* 3. Slogan */}
        <p className="text-base sm:text-lg font-semibold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide pb-1">
          An toàn hôm nay - vững vàng ngày mai
        </p>

        {/* 4. Cụm chức năng đăng ký / đăng nhập */}
        <div className="w-full space-y-3 pt-2">
          
          {/* Khối Đăng ký */}
          <div className="space-y-1.5">
            <p className="text-white font-medium text-sm tracking-wide drop-shadow-sm">
              Bạn là người mới ?
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-3.5 px-6 rounded-full bg-[#407d8e] hover:bg-[#356877] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-200/40"
            >
              Đăng kí tài khoản
            </button>
          </div>

          {/* Khối Đăng nhập */}
          <div className="space-y-1.5">
            <p className="text-white font-medium text-sm tracking-wide drop-shadow-sm">
              Bạn đã có tài khoản ?
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-6 rounded-full bg-[#1b4353] hover:bg-[#143340] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-300/30"
            >
              Đăng nhập ngay
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}