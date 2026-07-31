import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card } from '../components/UI/Card';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mediwise_user') || localStorage.getItem('user');
    const currentUser = savedUser ? JSON.parse(savedUser) : {};
    
    console.log("Object currentUser hiện tại:", currentUser);

    // Lấy trực tiếp username từ object
    const username = currentUser.username;

    if (!username) {
      console.warn("Không tìm thấy username trong localStorage!");
      setLoading(false);
      return;
    }

    api.get('/user/history', {
      headers: {
        'X-Username': username
      }
    })
      .then(res => setHistories(res.data))
      .catch(err => console.error("Lỗi khi tải lịch sử:", err))
      .finally(() => setLoading(false));
  }, []);
  const formatRiskLabel = (lvl) => {
    if (!lvl) return 'Thấp';
    const level = lvl.toUpperCase();
    if (level === 'CRITICAL' || level === 'HIGH') return 'Cao';
    if (level === 'MEDIUM') return 'Trung bình';
    return 'Thấp';
  };

  const badgeColor = (lvl) => {
    const level = lvl ? lvl.toUpperCase() : '';
    if (level === 'CRITICAL' || level === 'HIGH') return 'bg-red-100 text-red-700 border-red-200';
    if (level === 'MEDIUM') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Sổ tay lịch sử tra cứu dị ứng chéo
          </h2>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all shadow-sm shrink-0"
          >
            ↩ Quay lại trang chủ
          </button>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500">Đang truy xuất dữ liệu lịch sử...</p>
        ) : histories.length === 0 ? (
          <Card className="text-center py-10 text-gray-500">Bạn chưa thực hiện lượt kiểm tra rủi ro nào.</Card>
        ) : (
          <div className="space-y-4">
            {histories.map(h => (
              <Card key={h.id} className="p-6 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">{h.checked_at}</span>
                  <h4 className="text-lg font-bold text-gray-700 mt-1">Thuốc đã kiểm tra: <span className="text-primary">{h.drug_name}</span></h4>
                  <p className="text-sm text-gray-500 mt-1 max-w-xl">
                    <span className="font-semibold">Khuyến cáo:</span> {h.details.recommendations}
                  </p>
                </div>
                
                <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${badgeColor(h.risk_level)} shadow-sm shrink-0`}>
                  {formatRiskLabel(h.risk_level)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}