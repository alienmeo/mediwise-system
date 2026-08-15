import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các file logo và ảnh icon ở đầu file (chuẩn ES Modules)
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
    <div className="flex flex-col min-h-screen bg-[#f4f7fc] relative">
      
      {/* Brand Logo Header ở góc trái trên cùng */}
      <div className="absolute top-6 left-6 z-50 flex items-center justify-start cursor-pointer w-auto overflow-hidden" onClick={() => navigate('/')}>
        <img src={logoImg} alt="Aellergis Logo" className="h-16 w-auto object-contain shrink-0" />
        <img src={brandTextImg} alt="Aellergis" className="h-12 w-auto object-contain max-w-[210px] shrink-0 -ml-3.5" />
      </div>

      {/* Main Content Container căn chính giữa tuyệt đối cả chiều ngang và dọc */}
      <div className="flex-1 flex items-center justify-center p-6">
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
                1.Chọn thực phẩm từ thư viện thực phẩm
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
                2.Chọn thuốc từ thư viện thuốc
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
      </div>

    </div>
  );
};

export default CheckPage;