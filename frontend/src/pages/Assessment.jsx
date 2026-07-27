import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    api.get('/api/data-options')
  .then((res) => {
    const data = res.data;
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
      const response = await fetch('http://localhost:5000/api/check-allergy', {
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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#e83e8c', marginBottom: '24px' }}>Kiểm tra dị ứng chéo Thực phẩm & Thuốc</h2>

      {error && <div style={{ color: '#d9534f', backgroundColor: '#fdf7f7', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>1. Chọn Thực phẩm / Dị nguyên:</label>
          <select
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
          >
            <option value="">-- Chọn thực phẩm --</option>
            {allergens.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>2. Chọn Thuốc cần kiểm tra:</label>
          <select
            value={selectedDrug}
            onChange={(e) => setSelectedDrug(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
          >
            <option value="">-- Chọn thuốc --</option>
            {drugs.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#e83e8c',
            color: '#fff',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Đang phân tích...' : 'Phân Tích Nguy Cơ'}
        </button>
      </form>
    </div>
  );
};

export default CheckPage;