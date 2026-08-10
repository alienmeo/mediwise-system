import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

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
      } else {
        // --- LUỒNG ĐĂNG NHẬP ---
        const loginPayload = {
          username: inputValue,
          email: inputValue,
          password: inputPassword
        };

        const res = await api.post('/auth/login', loginPayload);

        if (res.data?.token) {
          localStorage.setItem('mediwise_token', res.data.token);
          if (res.data.user) {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#76b5c5] via-[#3a7287] to-[#123147]">
      {/* Khung Card trắng bo góc lớn, đổ bóng */}
      <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl">
        
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isRegister ? 'TẠO TÀI KHOẢN AELLERGIS' : 'ĐĂNG NHẬP AELLERGIS'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nhập Email hoặc Tên tài khoản */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              {isRegister ? 'Tên tài khoản (Username)' : 'Email hoặc tên tài khoản'}
            </label>
            <input 
              type="text"
              disabled={loading}
              className="w-full px-5 py-4 bg-gray-50/80 border border-gray-300 rounded-2xl outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 text-sm transition-all disabled:opacity-60"
              placeholder={isRegister ? "Nhập tên tài khoản..." : "Nhập Email hoặc Tên tài khoản"} 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {/* Ô Email riêng khi ở chế độ Đăng ký */}
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Địa chỉ Email / Gmail
              </label>
              <input 
                type="email"
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-50/80 border border-gray-300 rounded-2xl outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 text-sm transition-all disabled:opacity-60"
                placeholder="Ví dụ: name@gmail.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          )}

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Mật khẩu
            </label>
            <input 
              type="password"
              disabled={loading}
              className="w-full px-5 py-4 bg-gray-50/80 border border-gray-300 rounded-2xl outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-400 text-sm transition-all disabled:opacity-60"
              placeholder=". . . . . . . . . ." 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Nút submit dùng button thuần với màu #144064 */}
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl !bg-[#144064] hover:!bg-[#0f324f] text-white font-bold text-base shadow-lg transition-all cursor-pointer disabled:opacity-60" 
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : isRegister ? 'Đăng Ký Ngay' : 'Đăng Nhập'}
            </button>
          </div>
        </form>

        {/* Chuyển đổi giữa Đăng nhập / Đăng ký */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          {isRegister ? (
            <p className="text-xs text-gray-600">
              Bạn đã có tài khoản rồi?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="text-cyan-700 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
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
                className="text-cyan-700 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
              >
                Đăng ký tài khoản
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}