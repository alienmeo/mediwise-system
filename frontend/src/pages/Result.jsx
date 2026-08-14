import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || { result: null };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f9]">
        <Card className="text-center p-8 max-w-md bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6 font-medium">Không tìm thấy dữ liệu kết quả kiểm tra gần nhất.</p>
          <Button 
            className="w-full bg-[#e68cb5] hover:bg-[#d87ba5] text-white rounded-full py-3 font-semibold shadow-none border-none cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Quay lại trang chính
          </Button>
        </Card>
      </div>
    );
  }

  // Chuyển risk_level về chữ hoa để dễ map
  const rawRisk = (result.risk_level || 'LOW').toUpperCase();

  // Cấu hình hiển thị màu sắc và nhãn nguy cơ
  const riskConfig = {
    LOW: { color: 'text-[#42d134]', label: 'Nguy cơ thấp', dot: 'bg-[#42d134]', alertBg: 'bg-green-50 border-green-200' },
    MEDIUM: { color: 'text-amber-500', label: 'Nguy cơ trung bình', dot: 'bg-amber-500', alertBg: 'bg-amber-50 border-amber-200' },
    HIGH: { color: 'text-red-500', label: 'Nguy cơ cao', dot: 'bg-red-500', alertBg: 'bg-red-50 border-red-200' },
    CRITICAL: { color: 'text-purple-600', label: 'Nguy cơ rất cao', dot: 'bg-purle-600', alertBg: 'bg-purple-100 border-purple-300' }
  };

  const currentRisk = riskConfig[rawRisk] || riskConfig.LOW;

  // Lấy dữ liệu an toàn từ cả cấp độ root lẫn object 'details' do Backend trả về
  const detailsData = result.details || {};
  
  const dangerousList = result.dangerous_ingredients || detailsData.dangerous_ingredients || [];
  const crossList = result.cross_triggers || detailsData.cross_triggers || [];
  const explanationsList = result.explanations || detailsData.explanations || [];
  const recommendationsText = result.recommendations || detailsData.recommendations || '';

  const dangerousText = dangerousList.length > 0 
    ? (Array.isArray(dangerousList) ? dangerousList.join(', ') : dangerousList)
    : 'Không phát hiện';

  const crossText = crossList.length > 0 
    ? (Array.isArray(crossList) ? crossList.join(', ') : crossList)
    : 'Không phát hiện';

  return (
    <div className="min-h-screen bg-[#f7f7f9] py-8 px-4 font-sans text-[#222222]">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Logo MediWise */}
        <div className="mb-6 flex items-center justify-center gap-2 sm:justify-start sm:absolute sm:top-0 sm:left-0 sm:mb-0">
          <img src={logoImg} alt="MediWise Logo" className="h-10 w-auto object-contain" />
          <img src={brandTextImg} alt="MediWise" className="h-8 w-auto object-contain" />
        </div>

        {/* Card Trạng Thái Dị Ứng */}
        <div className="flex justify-center mb-6 pt-2 sm:pt-0">
          <div className="bg-[#f0fafd] rounded-[24px] shadow-sm overflow-hidden text-center w-72 border border-[#e0f3f7]">
            <div className="py-2.5 px-4 text-[#e68cb5] text-lg font-bold">
              Mức độ dị ứng cho: <span className="text-gray-800 font-extrabold">{result.drug_name || 'Thuốc'}</span>
            </div>
            <div className="bg-[#e8f7fa] py-3 px-4 border-t border-[#d8f1f5] flex items-center justify-center gap-2.5">
              <span className={`w-4 h-4 rounded-full ${currentRisk.dot}`}></span>
              <span className={`text-xl font-extrabold ${currentRisk.color}`}>
                {currentRisk.label}
              </span>
            </div>
          </div>
        </div>

        {/* Card Chi Tiết Phân Tích */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          
          {/* Section 1: Chi tiết phân tích thành phần */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chi tiết phân tích thành phần
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1: Thành phần nguy hiểm */}
              <div className="p-5 border-2 border-gray-200 rounded-[20px] bg-white">
                <span className="text-base font-bold text-gray-900 block mb-1">
                  Thành phần nguy hiểm phát hiện
                </span>
                <span className={`text-base font-semibold block ${dangerousList.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {dangerousText}
                </span>
              </div>

              {/* Box 2: Dị ứng chéo / Liên đới */}
              <div className="p-5 border-2 border-gray-200 rounded-[20px] bg-white">
                <span className="text-base font-bold text-gray-900 block mb-1">
                  Thành phần dị ứng chéo liên đới
                </span>
                <span className={`text-base font-semibold block ${crossList.length > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {crossText}
                </span>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-200 -mx-6 sm:-mx-8 my-6"></div>

          {/* Section 2: Giải thích nguyên nhân & Khuyến cáo */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Giải thích nguyên nhân & Khuyến cáo
            </h2>
            
            {recommendationsText && (
              <div className={`p-4 rounded-2xl border mb-4 text-base font-semibold ${currentRisk.alertBg}`}>
                <p>{recommendationsText}</p>
              </div>
            )}

            <div className="text-base text-gray-700 space-y-2">
              {explanationsList.length > 0 ? (
                explanationsList.map((exp, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-[#e68cb5] font-bold">•</span>
                    <span>{exp}</span>
                  </p>
                ))
              ) : (
                <p className="text-gray-400">Không có giải thích chi tiết nào bổ sung cho loại thuốc này.</p>
              )}
            </div>
          </div>

        </div>

        {/* Các nút điều hướng hành động */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link to="/assessment" className="w-full">
            <button className="w-full bg-[#e68cb5] hover:bg-[#d87ba5] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer">
              Kiểm tra loại thuốc khác
            </button>
          </Link>

          <Link to="/dashboard" className="w-full">
            <button className="w-full bg-[#e68cb5] hover:bg-[#d87ba5] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer">
              Quay lại trang chính
            </button>
          </Link>

          <Link to="/feedback" className="w-full">
            <button className="w-full bg-[#e68cb5] hover:bg-[#d87ba5] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer">
              Đánh giá hệ thống
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}