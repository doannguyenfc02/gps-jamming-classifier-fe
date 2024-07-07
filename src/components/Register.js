import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Xóa nội dung của các trường input khi vào trang đăng ký ban đầu
    setEmail('');
    setPassword('');
    setMessage('');
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://localhost:7162/api/User/register', { username: email, password });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response ? error.response.data : 'Error registering: ' + error.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Tự động load lại trang sau 2 giây
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <input type="text" placeholder="Tên đăng nhập" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Đăng ký</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;
