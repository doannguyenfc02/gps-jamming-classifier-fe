import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:7162/api/User/login', { username, password });
            localStorage.setItem('token', response.data.Token); // Lưu token vào localStorage
            setMessage("Đăng nhập thành công.");
            onLogin(); // Gọi hàm onLogin khi đăng nhập thành công
        } catch (error) {
            setMessage(error.response ? error.response.data : "Đăng nhập thất bại.");
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://localhost:7162/api/User/register', { username, password });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response ? error.response.data : "Đăng ký thất bại.");
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</h1>
            <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            {isRegistering ? (
                <>
                    <button onClick={handleRegister}>Đăng ký</button>
                    <p>Đã có tài khoản? <span onClick={() => setIsRegistering(false)} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Đăng nhập</span></p>
                </>
            ) : (
                <>
                    <button onClick={handleLogin}>Đăng nhập</button>
                    <p>Chưa có tài khoản? <span className="register-link" onClick={() => setIsRegistering(true)}>Đăng ký tài khoản</span></p>
                </>
            )}
            <p>{message}</p>
        </div>
    );
};

export default Login;
