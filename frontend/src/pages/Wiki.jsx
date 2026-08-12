import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import các hình ảnh cần thiết
import wikiLogoImg from './wiki-logo.png'; 
import titleImg from './title.png'; 
import image1 from './image1.png'; 
import image2 from './image1.png'; 
import image3 from './image1.png'; 

export default function Wiki() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col lg:flex-row items-stretch justify-center">
      
      {/* CỘT BÊN TRÁI: Nội dung giới thiệu & Giá trị cốt lõi */}
      <main className="flex-1 px-8 lg:px-16 py-12 max-w-4xl space-y-8">
        
        {/* Tiêu đề chính */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center pt-2">
            <img 
              src={titleImg} 
              alt="aellergis" 
              className="h-14 lg:h-16 w-auto object-contain" 
            />
          </div>
          
          <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-2xl mx-auto pt-2 text-center">
            Nền tảng hỗ trợ tra cứu thông tin về thuốc, thành phần và các cảnh báo dị ứng. Website được phát triển với mục tiêu mang đến nguồn thông tin trực quan, dễ tiếp cận và đáng tin cậy cho mọi người.
          </p>
        </div>

        {/* Lý do hình thành */}
        <section className="space-y-2">
          <div className="flex items-center space-x-3 text-[#144064]">
            <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
              <img src={image1} alt="Lý do hình thành" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-xl font-bold">Lý do hình thành</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed pl-11">
            Nhận thấy việc tiếp cận thông tin về thuốc và các thành phần có thể gây dị ứng còn gặp nhiều hạn chế, chúng tôi xây dựng Aellergis nhằm hỗ trợ người dùng tra cứu thông tin một cách nhanh chóng và hiệu quả.
          </p>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="space-y-3">
          <div className="flex items-center space-x-3 text-[#144064]">
            <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
              <img src={image2} alt="Giá trị cốt lõi" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-xl font-bold">Giá trị cốt lõi</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 lg:pl-11">
            {/* Badge 1: Tin cậy */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#d0e5fb] to-[#e3effd] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
                <img src={image1} alt="Tin cậy" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-bold text-[#144064] text-sm">Tin cậy</span>
            </div>

            {/* Badge 2: Thuận tiện */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#d0e5fb] to-[#e3effd] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
                <img src={image2} alt="Thuận tiện" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-bold text-[#144064] text-sm">Thuận tiện</span>
            </div>

            {/* Badge 3: An toàn */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#d0e5fb] to-[#e3effd] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
                <img src={image3} alt="An toàn" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-bold text-[#144064] text-sm">An toàn</span>
            </div>
          </div>
        </section>

        {/* Khái niệm mở rộng (Dị ứng chéo) */}
        <section className="space-y-2">
          <div className="flex items-center space-x-3 text-[#144064]">
            <div className="w-8 h-8 rounded-full bg-[#144064] flex items-center justify-center shrink-0">
              <img src={image1} alt="Dị ứng chéo" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-xl font-bold">Để hiểu rõ hơn thì dị ứng chéo là gì?</h2>
          </div>
          <div className="text-gray-600 text-sm leading-relaxed pl-11 space-y-2">
            <p>
              Dị ứng xảy ra khi hệ miễn dịch của cơ thể bị "nhầm lẫn" giữa các chất khác nhau nhưng có cấu trúc protein tương tự nhau.
            </p>
            <p>
              Khi bạn đã bị dị ứng với một chất (chất A), hệ miễn dịch sẽ ghi nhớ và tạo ra kháng thể chống lại nó. Đến khi bạn tiếp xúc với một chất khác hoàn toàn (chất B), nhưng vì chất B có hình dáng hoặc cấu trúc hóa học gần giống chất A, cơ thể sẽ nhận diện nhầm và kích hoạt lại phản ứng dị ứng, dù bạn chưa từng bị dị ứng với chất B trước đó.
            </p>
          </div>
        </section>

      </main>

      {/* CỘT BÊN PHẢI: Logo Wiki, Thông tin người phát triển & Nút quay lại */}
      <aside className="w-full lg:w-[420px] bg-white border-l border-gray-200 px-8 py-12 flex flex-col justify-between items-center text-center shrink-0 shadow-sm">
        
        <div className="w-full space-y-6 flex flex-col items-center">
          {/* Logo Wiki bên phải */}
          <div className="w-full max-w-[280px]">
            <img src={wikiLogoImg} alt="Aellergis Wiki Logo" className="w-full h-auto object-contain" />
          </div>

          <div className="w-full border-t border-gray-100 pt-6 space-y-2">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Người phát triển :
            </p>
            <div className="text-[#144064] font-bold text-sm tracking-wide space-y-1">
              <div>LƯƠNG HOÀNG THIÊN THANH</div>
              <div>NGÔ LỮ VÂN ANH</div>
            </div>
          </div>
        </div>

        {/* Nút Quay lại trang chủ (Dashboard) */}
        <div className="w-full pt-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 px-6 rounded-full bg-[#144064] hover:bg-[#0f324f] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span>Quay lại trang chủ</span>
          </button>
        </div>

      </aside>

    </div>
  );
}