import React from 'react';
import { Link } from 'react-router-dom'; // Dùng nếu dự án của bạn dùng react-router-dom

export default function Wiki() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-blue-600">MediWise</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Wiki</span>
          </div>
          <div>
            <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Mục lục */}
        <aside className="w-full md:w-1/4 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-gray-200 sticky top-24 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider">Nội dung Wiki</h3>
            <nav className="space-y-1 text-sm">
              <a href="#tong-quan" className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">1. Tổng quan MediWise</a>
              <a href="#tinh-nang" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">2. Chức năng hệ thống</a>
              <a href="#di-ung-cheo" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">3. Khái niệm dị ứng chéo</a>
              <a href="#ung-dung" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">4. Ứng dụng trên MediWise</a>
            </nav>
          </div>
        </aside>

        {/* Nội dung chính */}
        <main className="w-full md:w-3/4 bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
          
          {/* Mục 1 */}
          <section id="tong-quan">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tổng quan về MediWise</h1>
            <p className="text-gray-600 leading-relaxed">
              <strong>MediWise</strong> là giải pháp công nghệ y tế toàn diện được thiết kế nhằm tối ưu hóa quy trình tra cứu thông tin dược phẩm, quản lý dữ liệu lâm sàng và hỗ trợ ra quyết định điều trị an toàn cho các cơ sở y tế và người hành nghề.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Mục 2 */}
          <section id="tinh-nang">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chức năng chính của trang web</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Tra cứu dược thư:</strong> Cung cấp thông tin chi tiết về hoạt chất, liều lượng, chỉ định và chống chỉ định.</li>
              <li><strong>Cảnh báo tương tác:</strong> Tự động phát hiện các xung đột giữa các loại thuốc trong đơn.</li>
              <li><strong>Quản lý kho dữ liệu cá nhân:</strong> Lưu trữ và tra cứu nhanh các phác đồ thường dùng.</li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* Mục 3 */}
          <section id="di-ung-cheo">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Khái niệm Dị ứng chéo (Cross-Allergy)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dị ứng chéo là hiện tượng hệ thống miễn dịch phản ứng với một chất mới do cấu trúc hóa học của nó tương tự như chất mà cơ thể đã từng sinh kháng thể dị ứng trước đó.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-sm text-amber-800">
                <strong>Ví dụ thực tế:</strong> Một bệnh nhân có tiền sử sốc phản vệ với <strong>Penicillin</strong> sẽ có nguy cơ cao gặp phản ứng dị ứng chéo khi sử dụng một số kháng sinh thuộc nhóm <strong>Cephalosporin</strong> do cấu trúc vòng beta-lactam tương đồng.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Mục 4 */}
          <section id="ung-dung">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ứng dụng cảnh báo dị ứng chéo trên MediWise</h2>
            <p className="text-gray-600 leading-relaxed">
              MediWise tích hợp cơ sở dữ liệu về cấu trúc dị ứng chéo. Khi người dùng nhập tiền sử dị ứng của bệnh nhân và tiến hành kê đơn, hệ thống sẽ ngay lập tức đưa ra cảnh báo màu đỏ nếu phát hiện hoạt chất mới có nguy cơ gây dị ứng chéo, giúp bảo vệ an toàn tối đa cho người bệnh.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}