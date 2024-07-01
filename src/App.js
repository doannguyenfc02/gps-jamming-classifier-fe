import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import UploadFile from './components/UploadFile';
import ManageData from './components/ManageData';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="menu">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/upload">Tải tệp lên</Link></li>
            <li><Link to="/manage">Quản lý dữ liệu</Link></li>
            {isLoggedIn ? (
              <li><button className="menu-button" onClick={handleLogout}>Đăng xuất</button></li>
            ) : (
              <li><Link to="/login">Đăng nhập</Link></li>
            )}
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/upload" element={<PrivateRoute><UploadFile /></PrivateRoute>} />
          <Route path="/manage" element={<PrivateRoute><ManageData /></PrivateRoute>} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
