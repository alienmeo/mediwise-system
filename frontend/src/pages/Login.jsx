import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export default function Login({ isRegisterMode = false }) {
  const [isRegister, setIsRegister] = useState(isRegisterMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Reset state khi chuyển đổi đường dẫn
  useEffect(() => {
    setIsRegister(isRegisterMode);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setEmail('');
  }, [isRegisterMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const inputValue = username.trim();
    const inputPassword = password.trim();

    // 1. VALIDATION ĐẦU VÀO
    if (isRegister) {
      if (!inputValue || !email.trim() || !inputPassword) {
        setError('Vui lòng điền đầy đủ Tên tài khoản, Email và Mật khẩu!');
        return;
      }
    } else {
      if (!inputValue || !inputPassword) {
        setError('Vui lòng nhập đầy đủ Tên tài khoản/Email và Mật khẩu!');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        // --- LUỒNG ĐĂNG KÝ ---
        const regRes = await api.post('/auth/register', {
          username: inputValue,
          email: email.trim(),
          password: inputPassword
        });

        setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...');

        if (regRes.data?.token) {
          localStorage.setItem('mediwise_token', regRes.data.token);
          if (regRes.data.user) {
            localStorage.setItem('user', JSON.stringify(regRes.data.user));
          }
          setTimeout(() => navigate('/dashboard'), 1200);
        } else {
          setTimeout(() => navigate('/login'), 1500);
        }

      // --- Trong Login.jsx -> hàm handleSubmit ---
} else {
  // --- LUỒNG ĐĂNG NHẬP ---
  // Gửi chung giá trị nhập vào cho cả username và email
  // Để Backend tự kiểm tra khớp với trường nào trong Database
  const loginPayload = {
    username: inputValue,
    email: inputValue,
    password: inputPassword
  };

  const res = await api.post('/auth/login', loginPayload);

  if (res.data?.token) {
    localStorage.setItem('mediwise_token', res.data.token);
    if (res.data.user) {
      // Lưu toàn bộ thông tin user trả về từ Backend vào LocalStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    navigate('/dashboard');
  }
}
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error;
      if (backendError) {
        setError(backendError);
      } else {
        setError(isRegister ? 'Đăng ký thất bại, vui lòng thử lại!' : 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-primary-light via-white to-secondary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-soft border border-white bg-white/80 backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {isRegister ? 'TẠO TÀI KHOẢN MỚI' : 'ĐĂNG NHẬP MEDIWISE'}
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-xs font-semibold rounded-xl mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRegister ? 'Tên tài khoản (Username)' : 'Email hoặc Tên tài khoản'}
            </label>
            <input 
              type="text"
              disabled={loading}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-gray-50/50 disabled:opacity-60"
              placeholder={isRegister ? "Nhập tên tài khoản..." : "Nhập Email hoặc Tên tài khoản..."} 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ Email / Gmail
              </label>
              <input 
                type="email"
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-gray-50/50 disabled:opacity-60"
                placeholder="Ví dụ: name@gmail.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu bảo mật
            </label>
            <input 
              type="password"
              disabled={loading}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-gray-50/50 disabled:opacity-60"
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng Ký Ngay' : 'Đăng Nhập'}
          </Button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          {isRegister ? (
            <p className="text-xs text-gray-600">
              Bạn đã có tài khoản rồi?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="text-primary font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
              >
                Đăng nhập tại đây
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-600">
              Thành viên mới?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')} 
                className="text-secondary font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
              >
                Đăng ký tài khoản
              </button>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}