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

  // Chuyển risk_level về chữ hoa để dễ map
  const rawRisk = (result.risk_level || 'LOW').toUpperCase();

  // Cấu hình hiển thị màu sắc và nhãn nguy cơ
  const riskConfig = {
    LOW: { color: 'text-emerald-600', label: 'Nguy cơ thấp', dot: 'bg-emerald-500', alertBg: 'bg-emerald-50 border-emerald-200' },
    MEDIUM: { color: 'text-amber-500', label: 'Nguy cơ trung bình', dot: 'bg-amber-500', alertBg: 'bg-amber-50 border-amber-200' },
    HIGH: { color: 'text-red-500', label: 'Nguy cơ cao', dot: 'bg-red-500', alertBg: 'bg-red-50 border-red-200' },
    CRITICAL: { color: 'text-purple-600', label: 'Nguy cơ rất cao', dot: 'bg-purple-600', alertBg: 'bg-purple-50 border-purple-200' }
  };

  const currentRisk = riskConfig[rawRisk] || riskConfig.LOW;

  // Lấy dữ liệu an toàn từ cả cấp độ root lẫn object 'details' do Backend trả về
  const detailsData = result.details || {};
  
  const dangerousList = result.dangerous_ingredients || detailsData.dangerous_ingredients || [];
  const crossList = result.cross_triggers || detailsData.cross_triggers || [];
  const explanationsList = result.explanations || detailsData.explanations || [];
  const recommendationsText = result.recommendations || detailsData.recommendations || '';

  // Lấy tên thuốc kiểm tra từ result
  const drugName = result.drug_name || detailsData.drug_name || '';

  // Hàm chuẩn hóa hiển thị: Ưu tiên đưa thực phẩm/thành phần nguy hiểm (dangerousList) lên trước, sau đó đến tên thuốc (drug)
  const formatIngredientsWithDrugFirst = (list, drug) => {
    let items = [];
    
    // Đưa danh sách thực phẩm / thành phần nguy hiểm lên trước
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

    // Sau đó đến tên thuốc kiểm tra
    if (drug) {
      items.push(drug);
    }

    // Lọc bỏ trùng lặp nếu có
    const uniqueItems = [...new Set(items)];
    return uniqueItems.length > 0 ? uniqueItems.join(', ') : 'Không phát hiện';
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
      
      {/* Logo MediWise (Cố định góc trên cùng bên trái ngoài cùng màn hình) */}
      <div className="flex items-center justify-start cursor-pointer overflow-hidden -ml-4 pl-3 mb-6 w-fit" onClick={() => navigate('/dashboard')}>
        <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
        <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Card Trạng Thái Dị Ứng */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-[24px] shadow-sm overflow-hidden text-center w-72 border border-gray-100">
            <div className="py-2.5 px-4 text-[#144064] text-lg font-bold">
              Mức độ dị ứng cho: <span className="text-gray-800 font-extrabold">{drugName || 'Thuốc'}</span>
            </div>
            <div className="bg-[#e3effd] py-3 px-4 border-t border-gray-100 flex items-center justify-center gap-2.5">
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
              
              {/* Box 1: Tên thực phẩm, thuốc kiểm tra (Thực phẩm trước, thuốc sau) */}
              <div className="p-5 border-2 border-gray-100 rounded-[20px] bg-white">
                <span className="text-base font-bold text-gray-900 block mb-1">
                  Tên thực phẩm, thuốc kiểm tra
                </span>
                <span className={`text-base font-semibold block ${formattedTargetText !== 'Không phát hiện' ? 'text-gray-800' : 'text-gray-400'}`}>
                  {formattedTargetText}
                </span>
              </div>

              {/* Box 2: Dị ứng chéo / Liên đới */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link to="/assessment" className="w-full">
            <button className="w-full bg-[#144064] hover:bg-[#0f324f] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer shadow-md">
              Kiểm tra loại thuốc khác
            </button>
          </Link>

          <Link to="/dashboard" className="w-full">
            <button className="w-full bg-[#144064] hover:bg-[#0f324f] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer shadow-md">
              Quay lại trang chính
            </button>
          </Link>

          <Link to="/feedback" className="w-full">
            <button className="w-full bg-[#144064] hover:bg-[#0f324f] text-white font-medium py-3.5 px-4 rounded-full transition-colors text-center text-sm sm:text-base cursor-pointer shadow-md">
              Đánh giá hệ thống
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}