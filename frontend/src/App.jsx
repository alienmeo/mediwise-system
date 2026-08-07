import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import Result from './pages/Result';
import History from './pages/History';
import DashboardAdmin from './pages/admin/DashboardAdmin';

// Import 2 trang đánh giá đúng vai trò:
import FeedbackPage from './pages/FeedbackPage'; // Trang Tự đánh giá cá nhân
import Feedback from './pages/Feedback';        // Trang Tổng hợp đánh giá cộng đồng

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('mediwise_token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login isRegisterMode={true} />} /> 
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* 1. Trang TỰ ĐÁNH GIÁ CÁ NHÂN (FeedbackPage) */}
        <Route path="/FeedbackPage" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        
        {/* 2. Trang TỔNG HỢP TẤT CẢ ĐÁNH GIÁ (Feedback) */}
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        
        {/* Admin Route */}
        <Route path="/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}