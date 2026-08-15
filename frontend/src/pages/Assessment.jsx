import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các file logo và ảnh chuẩn giống hệt dashboard.jsx
import logoImg from './logo.png'; 
import brandTextImg from './title.png'; 

const CheckPage = () => {
  const navigate = useNavigate();
  const [allergens, setAllergens] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách Thực phẩm & Thuốc từ Backend
  useEffect(() => {
    fetch('https://mediwise-system.onrender.com/api/data-options')
      .then((res) => res.json())
      .then((data) => {
        if (data.allergens) setAllergens(data.allergens);
        if (data.drugs) setDrugs(data.drugs);
      })
      .catch((err) => console.error('Lỗi kết nối Backend:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFood || !selectedDrug) {
      setError('Vui lòng chọn đầy đủ Thực phẩm và Thuốc!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://mediwise-system.onrender.com/api/check-allergy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          food_name: selectedFood,
          drug_name: selectedDrug,
        }),
      });

      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        // Chuyển hướng sang trang kết quả và truyền kèm dữ liệu API trả về
        navigate('/result', {
          state: {
            result: resData.data || resData,
          },
        });
      } else {
        setError(resData.error || 'Có lỗi xảy ra khi kiểm tra!');
      }
    } catch (err) {
      setLoading(false);
      setError('Không thể kết nối đến máy chủ Flask!');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      
      {/* 1. SIDEBAR BÊN TRÁI (Giống hệt dashboard.jsx) */}
      <aside className="w-80 bg-white border-r border-gray-100 py-6 px-0 flex flex-col justify-between shrink-0 shadow-sm overflow-hidden">
        <div className="space-y-12">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-start cursor-pointer w-full overflow-hidden -ml-4 pl-3" onClick={() => navigate('/')}>
            <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
            <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
          </div>

          {/* Navigation Buttons */}
          <nav className="space-y-4 px-3">
            <button 
              onClick={() => navigate('/Assessment')} 
              className="w-full py-4 px-6 rounded-full bg-[#144064] hover:bg-[#0f324f] text-white font-bold text-left transition-all text-sm flex items-center space-x-3 shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>Bắt đầu khảo sát mới</span>
            </button>

            <button 
              onClick={() => navigate('/feedback')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.107a.75.75 0 01-.725.64h-12.8a.75.75 0 01-.725-.64l-.001-.107v-.003zM16.5 18.375a6.375 6.375 0 0111.419-3.922.75.75 0 01-.118.995l-3.375 2.625a.75.75 0 01-.932 0l-1.688-1.313a.75.75 0 01.932-1.17l1.096.853 2.64-2.052a4.875 4.875 0 00-7.854 2.977.75.75 0 01-.75.75h-.375z" />
              </svg>
              <span>Đánh giá của người dùng</span>
            </button>

            <button 
              onClick={() => navigate('/history')} 
              className="w-full py-4 px-6 rounded-full bg-[#e3effd] hover:bg-[#d0e5fb] text-[#144064] font-bold text-left transition-all text-sm flex items-center space-x-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Xem lại kết quả gần nhất</span>
            </button>
          </nav>
        </div>

        {/* Nút Back ở góc dưới sidebar */}
        <div className="px-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-[#144064] hover:bg-[#0f324f] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BÊN PHẢI (Căn chỉnh form vào chính giữa màn hình) */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
          
          {/* Tiêu đề trang */}
          <h2 className="text-2xl font-black text-gray-900 text-center uppercase tracking-tight mb-8 leading-tight">
            KIỂM TRA DỊ ỨNG CHÉO<br />THỰC PHẨM & THUỐC
          </h2>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl mb-6 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ô chọn Thực phẩm */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                1. Chọn thực phẩm từ thư viện thực phẩm
              </label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#144064] cursor-pointer"
              >
                <option value="">-- Chọn thực phẩm --</option>
                {allergens.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ô chọn Thuốc */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                2. Chọn thuốc từ thư viện thuốc
              </label>
              <select
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#144064] cursor-pointer"
              >
                <option value="">-- Chọn thuốc --</option>
                {drugs.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút Phân Tích Nguy Cơ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-[#144064] hover:bg-[#0f324f] text-white rounded-full font-bold text-base shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang phân tích...' : 'Phân Tích Nguy Cơ'}
            </button>
          </form>

        </div>
      </main>

    </div>
  );
};

export default CheckPage;