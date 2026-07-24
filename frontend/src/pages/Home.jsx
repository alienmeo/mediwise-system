import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-r from-pink-200 via-purple-100 to-sky-200">
      
      {/* Khối Logo & Slogan */}
      <div className="text-center space-y-4 max-w-lg mb-8 flex flex-col items-center">
        
        {/* Biểu tượng Logo */}
        <div className="flex justify-center mb-2">
          <img 
            src={logoImg} 
            alt="Mediwise Icon" 
            className="w-32 h-32 object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Hình ảnh tên thương hiệu Mediwise */}
        <div className="flex justify-center w-full">
          <img 
            src={brandTextImg} 
            alt="Mediwise" 
            className="h-auto w-full max-w-sm object-contain filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"
          />
        </div>

        {/* Slogan */}
        <p className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide pt-2">
          An toàn hôm nay - vững vàng ngày mai
        </p>
      </div>

      {/* Cụm chức năng chuyển hướng */}
      <div className="w-full max-w-sm space-y-6 text-center">
        
        {/* Khối 1: Đăng ký (MÀU XANH PASTEL DỊU) */}
        <div className="space-y-2">
          <p className="text-pink-600/90 font-semibold text-sm">
            Bạn là người mới ?
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="w-full py-3.5 px-6 rounded-full bg-sky-300/90 hover:bg-sky-400 text-sky-950 font-bold text-base shadow-sm active:scale-95 transition-all duration-200 border-b-2 border-sky-400/40"
          >
            Đăng kí tài khoản
          </button>
        </div>

        {/* Khối 2: Đăng nhập (MÀU HỒNG PASTEL DỊU) */}
        <div className="space-y-2 pt-2">
          <p className="text-pink-600/90 font-semibold text-sm">
            Bạn đã có tài khoản ?
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-6 rounded-full bg-pink-300/90 hover:bg-pink-400 text-pink-950 font-bold text-base shadow-sm active:scale-95 transition-all duration-200 border-b-2 border-pink-400/40"
          >
            Đăng nhập ngay
          </button>
        </div>

      </div>

    </div>
  );
}