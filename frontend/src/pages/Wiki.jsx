import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import file title/logo (không dùng logo.png theo yêu cầu)
import brandTextImg from './title.png'; 
import wikiLogoImg from './wiki-logo.png'; 
import image1 from './image1.png'; 
import nguonImg from './nguon.png'; 

export default function Wiki() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col lg:flex-row items-stretch justify-center">
      
      {/* CỘT BÊN TRÁI: Nội dung giới thiệu & Giá trị cốt lõi */}
      <main className="flex-1 px-8 lg:px-16 py-12 max-w-4xl space-y-10">
        
        {/* Tiêu đề chính và đoạn mô tả được căn giữa */}
        <div className="space-y-4 text-center">
          <div>
            <div className="flex items-center justify-center cursor-pointer w-full overflow-hidden" onClick={() => navigate('/dashboard')}>
              <img src={brandTextImg} alt="Aellergis" className="h-16 w-auto object-contain max-w-[280px] shrink-0" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-2xl mx-auto">
            Nền tảng hỗ trợ tra cứu thông tin về thuốc, thành phần và các cảnh báo dị ứng. Website được phát triển với mục tiêu mang đến nguồn thông tin trực quan, dễ tiếp cận và đáng tin cậy cho mọi người.
          </p>
        </div>

        {/* Lý do hình thành */}
        <section className="space-y-3">
          <div className="flex items-center space-x-3 text-[#326871]">
            <div className="w-8 h-8 rounded-full bg-[#eaf8fb] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Lý do hình thành</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed pl-11 text-left">
            Nhận thấy việc tiếp cận thông tin về thuốc và các thành phần có thể gây dị ứng còn gặp nhiều hạn chế, chúng tôi xây dựng Aellergis nhằm hỗ trợ người dùng tra cứu thông tin một cách nhanh chóng và hiệu quả.
          </p>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-[#326871]">
            <div className="w-8 h-8 rounded-full bg-[#eaf8fb] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.07a8.25 8.25 0 1010.512-.765.75.75 0 01.818-.213 9.75 9.75 0 11-12.87 1.455.75.75 0 01.76-.793z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Giá trị cốt lõi</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 lg:pl-11 text-left">
            {/* Badge 1 */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#c7f2f6] to-[#eaf8fb] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 overflow-hidden p-0">
                <img src={image1} alt="Icon Tin cậy" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-[#326871] text-sm">Tin cậy</span>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#c7f2f6] to-[#eaf8fb] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 overflow-hidden p-0">
                <img src={image1} alt="Icon Thuận tiện" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-[#326871] text-sm">Thuận tiện</span>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[#c7f2f6] to-[#eaf8fb] border border-blue-100 px-5 py-3 rounded-full shadow-xs">
              <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 overflow-hidden p-0">
                <img src={image1} alt="Icon An toàn" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-[#326871] text-sm">An toàn</span>
            </div>
          </div>
        </section>

        {/* Khái niệm mở rộng (Dị ứng chéo) */}
        <section className="space-y-3">
          <div className="flex items-center space-x-3 text-[#326871]">
            <div className="w-8 h-8 rounded-full bg-[#eaf8fb] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Để hiểu rõ hơn thì dị ứng chéo là gì?</h2>
          </div>
          <div className="text-gray-600 text-sm leading-relaxed pl-11 space-y-3 text-left">
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
        
        <div className="w-full space-y-8 flex flex-col items-center">
          {/* Logo Wiki bên phải */}
          <div className="w-full max-w-[280px]">
            <img src={wikiLogoImg} alt="Aellergis Wiki Logo" className="w-full h-auto object-contain" />
          </div>

          <div className="w-full border-t border-gray-100 pt-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                Người phát triển :
              </p>
              <div className="text-[#326871] font-bold text-sm tracking-wide space-y-1">
                <div>LƯƠNG HOÀNG THIÊN THANH</div>
                <div>NGÔ LỮ VÂN ANH</div>
              </div>
            </div>

            {/* Đã tăng kích thước max-w từ [200px] lên [280px] cho fit với khung bên phải */}
            <div className="w-full max-w-[280px] mx-auto pt-2">
              <img src={nguonImg} alt="Nguồn thông tin" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>

        {/* Nút Quay lại trang chủ (Dashboard) */}
        <div className="w-full pt-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 px-6 rounded-full bg-[#326871] hover:bg-[#1f3f45] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
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