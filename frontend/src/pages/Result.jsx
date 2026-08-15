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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fc]">
        <Card className="text-center p-8 max-w-md bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6 font-medium">Không tìm thấy dữ liệu kết quả kiểm tra gần nhất.</p>
          <Button 
            className="w-full bg-[#144064] hover:bg-[#0f324f] text-white rounded-full py-3 font-semibold shadow-none border-none cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Quay lại trang chính
          </Button>
        </Card>
      </div>
    );
  }

  const rawRisk = (result.risk_level || 'LOW').toUpperCase();

  const riskConfig = {
    LOW: { color: 'text-emerald-500', label: 'Nguy cơ thấp', dot: 'bg-emerald-500', alertBg: 'bg-emerald-50 border-emerald-200' },
    MEDIUM: { color: 'text-amber-500', label: 'Nguy cơ trung bình', dot: 'bg-amber-500', alertBg: 'bg-amber-50 border-amber-200' },
    HIGH: { color: 'text-red-500', label: 'Nguy cơ cao', dot: 'bg-red-500', alertBg: 'bg-red-50 border-red-200' },
    CRITICAL: { color: 'text-purple-600', label: 'Nguy cơ rất cao', dot: 'bg-purple-600', alertBg: 'bg-purple-50 border-purple-200' }
  };

  const currentRisk = riskConfig[rawRisk] || riskConfig.LOW;

  const detailsData = result.details || {};
  const dangerousList = result.dangerous_ingredients || detailsData.dangerous_ingredients || [];
  const crossList = result.cross_triggers || detailsData.cross_triggers || [];
  const explanationsList = result.explanations || detailsData.explanations || [];
  const recommendationsText = result.recommendations || detailsData.recommendations || '';
  const drugName = result.drug_name || detailsData.drug_name || '';

  // Luôn hiển thị tên thuốc hoặc thực phẩm kiểm tra trong mọi trường hợp
  const formatIngredientsWithDrugFirst = (list, drug) => {
    let items = [];
    
    if (Array.isArray(list) && list.length > 0) {
      list.forEach(item => {
        if (typeof item === 'string') {
          items.push(item);
        } else if (item && typeof item === 'object') {
          const val = item.name || item.ingredient || item.food || item.drug;
          if (val) items.push(val);
        }
      });
    } else if (typeof list === 'string' && list.trim() !== '') {
      items.push(list);
    }

    if (drug && !items.includes(drug)) {
      items.push(drug);
    }

    const uniqueItems = [...new Set(items)];
    return uniqueItems.length > 0 ? uniqueItems.join(', ') : (drug || 'Không phát hiện');
  };

  const formattedTargetText = formatIngredientsWithDrugFirst(dangerousList, drugName);

  const formatIngredients = (list) => {
    if (!list) return 'Không phát hiện';
    if (typeof list === 'string') return list;
    if (Array.isArray(list)) {
      if (list.length === 0) return 'Không phát hiện';
      return list.map(item => {
        if (typeof item === 'string') return item;
        return item.name || item.ingredient || item.food || item.drug || JSON.stringify(item);
      }).join(', ');
    }
    return String(list);
  };

  const crossText = formatIngredients(crossList);

  return (
    <div className="min-h-screen bg-[#f4f7fc] py-8 px-6 font-sans text-[#222222]">
      
      {/* Logo MediWise */}
      <div className="flex items-center justify-start cursor-pointer overflow-hidden -ml-4 pl-3 mb-4 w-fit" onClick={() => navigate('/dashboard')}>
        <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
        <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Card Mức độ dị ứng */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-[24px] shadow-sm overflow-hidden text-center w-80 border border-gray-100">
            <div className="py-2.5 px-4 text-[#144064] text-base font-bold">
              Mức độ dị ứng
            </div>
            <div className="bg-[#e3effd]/50 py-3 px-4 border-t border-gray-100 flex items-center justify-center gap-2.5">
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
              
              {/* Box 1: Luôn hiển thị tên thực phẩm/thuốc rõ ràng */}
              <div className="p-5 border-2 border-gray-100 rounded-[20px] bg-white">
                <span className="text-base font-bold text-gray-900 block mb-1">
                  Thực phẩm / Tên thuốc
                </span>
                <span className="text-base font-semibold block text-gray-800">
                  {formattedTargetText}
                </span>
              </div>

              {/* Box 2: Dị ứng chéo */}
              <div className="p-5 border-2 border-gray-100 rounded-[20px] bg-white">
                <span className="text-base font-bold text-gray-900 block mb-1">
                  Thành phần dị ứng chéo liên đới
                </span>
                <span className={`text-base font-semibold block ${crossText !== 'Không phát hiện' ? 'text-amber-600' : 'text-gray-400'}`}>
                  {crossText}
                </span>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-100 -mx-6 sm:-mx-8 my-6"></div>

          {/* Section 2: Giải thích nguyên nhân & Khuyến cáo */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Giải thích nguyên nhân
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
                    <span className="text-[#144064] font-bold">•</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          
          <Link to="/assessment" className="w-full">
            <div className="flex items-center bg-[#d6e4fd] hover:bg-[#c5daf9] rounded-full p-1.5 shadow-sm cursor-pointer border border-blue-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#144064] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <span className="flex-1 text-center text-[#144064] font-bold text-sm sm:text-base pr-4">
                Kiểm tra loại thuốc khác
              </span>
            </div>
          </Link>

          <Link to="/dashboard" className="w-full">
            <div className="flex items-center bg-[#d6e4fd] hover:bg-[#c5daf9] rounded-full p-1.5 shadow-sm cursor-pointer border border-blue-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#144064] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <span className="flex-1 text-center text-[#144064] font-bold text-sm sm:text-base pr-4">
                Quay lại trang chính
              </span>
            </div>
          </Link>

          <Link to="/feedback" className="w-full">
            <div className="flex items-center bg-[#d6e4fd] hover:bg-[#c5daf9] rounded-full p-1.5 shadow-sm cursor-pointer border border-blue-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#144064] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="flex-1 text-center text-[#144064] font-bold text-sm sm:text-base pr-4">
                Đánh giá hệ thống
              </span>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}