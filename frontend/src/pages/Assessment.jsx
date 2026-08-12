import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import logo và tiêu đề
import titleImg from './title.png'; 
import logoImg from './logo.png'; 

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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3effd 0%, #f4f7fc 100%)', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px',
      position: 'relative'
    }}>
      
      {/* Logo và Tiêu đề ở góc trên bên trái (Logo phóng to cân đối với text) */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '24px', 
          left: '32px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px',
          cursor: 'pointer' 
        }} 
        onClick={() => navigate('/dashboard')}
      >
        <img 
          src={logoImg} 
          alt="Logo" 
          style={{ height: '64px', width: 'auto', objectFit: 'contain' }} 
        />
        <img 
          src={titleImg} 
          alt="aellergis title" 
          style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
        />
      </div>

      <div style={{ 
        width: '100%', 
        maxWidth: '560px', 
        backgroundColor: '#fff', 
        borderRadius: '32px', 
        padding: '40px 32px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)' 
      }}>
        
        <h2 style={{ 
          textAlign: 'center', 
          color: '#111', 
          fontSize: '24px', 
          fontWeight: '900', 
          lineHeight: '1.3', 
          marginBottom: '32px' 
        }}>
          KIỂM TRA DỊ ỨNG CHÉO<br />THỰC PHẨM & THUỐC
        </h2>

        {error && (
          <div style={{ 
            color: '#d9534f', 
            backgroundColor: '#fdf7f7', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            marginBottom: '16px', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Ô chọn Thực phẩm */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#666', 
              fontSize: '15px', 
              fontWeight: '600', 
              marginBottom: '10px' 
            }}>
              1. Chọn thực phẩm từ thư viện thực phẩm
            </label>
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 18px', 
                borderRadius: '16px', 
                border: '1px solid #d1d5db', 
                backgroundColor: '#fff',
                color: selectedFood ? '#111' : '#888', 
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Chọn thực phẩm --</option>
              {allergens.map((item) => (
                <option key={item.id} value={item.name} style={{ color: '#111' }}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ô chọn Thuốc */}
          <div style={{ marginBottom: '36px' }}>
            <label style={{ 
              display: 'block', 
              color: '#666', 
              fontSize: '15px', 
              fontWeight: '600', 
              marginBottom: '10px' 
            }}>
              2. Chọn thuốc từ thư viện thuốc
            </label>
            <select
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 18px', 
                borderRadius: '16px', 
                border: '1px solid #d1d5db', 
                backgroundColor: '#fff',
                color: selectedDrug ? '#111' : '#888', 
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Chọn thuốc --</option>
              {drugs.map((item) => (
                <option key={item.id} value={item.name} style={{ color: '#111' }}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút Phân Tích */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#144064',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(20, 64, 100, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Đang phân tích...' : 'Phân Tích Nguy Cơ'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CheckPage;