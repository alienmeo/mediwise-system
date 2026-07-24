import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ total_users: 0, total_drugs: 0, total_allergens: 0, total_history: 0 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [newDrug, setNewDrug] = useState({ name: '', utility: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/feedbacks')
      ]);
      setStats(sRes.data);
      setFeedbacks(fRes.data);
    } catch (err) {
      console.error("Lỗi phân quyền hoặc kết nối máy chủ.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrug = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/drugs/create', newDrug);
      alert('Thêm mới bản ghi thuốc vào Database thành công!');
      setNewDrug({ name: '', utility: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleExportDB = async () => {
    try {
      const res = await api.get('/admin/export');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "mediwise_db_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Lỗi xuất dữ liệu.');
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Đang nạp đặc quyền quản trị viên...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-black text-gray-800">Hệ thống quản trị chuyên gia MediWise</h2>
        <Button variant="outline" onClick={handleExportDB}>📤 Xuất bản sao lưu DB (Export JSON)</Button>
      </div>

      {/* Grid thẻ thống kê nhanh số liệu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white text-center"><span className="text-xs font-bold text-gray-400 block">THÀNH VIÊN</span><span className="text-2xl font-bold text-primary">{stats.total_users}</span></Card>
        <Card className="p-4 bg-white text-center"><span className="text-xs font-bold text-gray-400 block">DANH MỤC THUỐC</span><span className="text-2xl font-bold text-secondary">{stats.total_drugs}</span></Card>
        <Card className="p-4 bg-white text-center"><span className="text-xs font-bold text-gray-400 block">TÁC NHÂN DỊ ỨNG</span><span className="text-2xl font-bold text-amber-500">{stats.total_allergens}</span></Card>
        <Card className="p-4 bg-white text-center"><span className="text-xs font-bold text-gray-400 block">LƯỢT KIỂM TRA</span><span className="text-2xl font-bold text-green-500">{stats.total_history}</span></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form thêm thuốc nhanh của Admin */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cập nhật Danh mục Thuốc thành phẩm mới</h3>
          <form onSubmit={handleAddDrug} className="space-y-2">
            <Input label="Tên thuốc thương mại" placeholder="Ví dụ: Cefuroxim 500mg" value={newDrug.name} onChange={e => setNewDrug({...newDrug, name: e.target.value})} required />
            <Input label="Công năng y học chính" placeholder="Ví dụ: Kháng sinh nhiễm khuẩn" value={newDrug.utility} onChange={e => setNewDrug({...newDrug, utility: e.target.value})} required />
            <Button type="submit" className="w-full">Thêm vào Database</Button>
          </form>
        </Card>

        {/* Danh sách Feedback phản hồi của người dùng */}
        <Card className="p-6 bg-white flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ý kiến góp ý & Đánh giá từ người dùng</h3>
          <div className="space-y-3 overflow-y-auto max-h-[300px] flex-1 pr-2">
            {feedbacks.map(f => (
              <div key={f.id} className="p-3 bg-gray-50 rounded-xl border text-sm">
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span>@{f.username}</span>
                  <span className="text-amber-500">{'★'.repeat(f.rating)}</span>
                </div>
                <p className="text-gray-600 italic">"{f.comment || 'Không để lại lời nhắn.'}"</p>
                <span className="text-[10px] text-gray-400 block mt-1 text-right">{f.created_at}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}