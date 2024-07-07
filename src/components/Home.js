import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css'; // Đảm bảo đường dẫn đúng tới tệp CSS của bạn

const Home = () => {
  return (
    <div className="center-container">
      <h1>Chào mừng đến với hệ thống Phát hiện, phân loại các bộ phá sóng GPS</h1>
      <p>Hệ thống này cho phép bạn tải lên và phân tích dữ liệu GPS để phát hiện phá sóng.</p>
      <nav>
        <Link to="/upload" className="button">Tải tệp lên</Link>
        <Link to="/manage" className="button">Quản lý dữ liệu</Link>
      </nav>
    </div>
  );
};

export default Home;
