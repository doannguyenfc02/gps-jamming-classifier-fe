import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import UploadFile from './components/UploadFile';
import ManageData from './components/ManageData';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="menu">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/upload">Tải tệp lên</Link></li>
            <li><Link to="/manage">Quản lý dữ liệu</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/manage" element={<ManageData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
