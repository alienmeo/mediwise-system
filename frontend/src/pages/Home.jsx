import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b4c9] via-[#468093] to-[#204a5c]">
      
      {/* Khối Logo & Slogan (Căn giữa, khoảng cách dưới giữ nguyên) */}
      <div className="text-center space-y-4 max-w-lg mb-12 flex flex-col items-center">
        
        {/* Biểu tượng Logo */}
        <div className="flex justify-center mb-2">
          <img 
            src={logoImg} 
            alt="Mediwise Icon" 
            className="w-48 h-48 object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Hình ảnh tên thương hiệu */}
        <div className="flex justify-center w-full">
          <img 
            src={brandTextImg} 
            alt="Mediwise" 
            className="h-auto w-full max-w-sm object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Slogan */}
        <p className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide pt-1">
          An toàn hôm nay - vững vàng ngày mai
        </p>
      </div>

      {/* Cụm chức năng chuyển hướng (ĐIỀU CHỈNH KHOẢNG CÁCH TẠI ĐÂY) */}
      <div className="w-full max-w-sm space-y-8 text-center"> {/* Tăng space-y từ 6 lên 8 */}
        
        {/* Khối 1: Đăng ký */}
        <div className="space-y-4"> {/* Tăng space-y từ 2 lên 4 để đẩy chữ ra xa nút */}
          <p className="text-cyan-100/90 font-medium text-sm tracking-wide">
            Bạn là người mới ?
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="w-full py-3.5 px-6 rounded-full bg-[#407d8e] hover:bg-[#356877] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-300/30"
          >
            Đăng kí tài khoản
          </button>
        </div>

        {/* Khối 2: Đăng nhập */}
        <div className="space-y-4"> {/* Tăng space-y từ 2 lên 4 */}
          <p className="text-cyan-100/90 font-medium text-sm tracking-wide">
            Bạn đã có tài khoản ?
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-6 rounded-full bg-[#1b4353] hover:bg-[#143340] text-white font-semibold text-base shadow-lg active:scale-95 transition-all duration-200 border border-cyan-400/20"
          >
            Đăng nhập ngay
          </button>
        </div>

      </div>

    </div>
  );
}