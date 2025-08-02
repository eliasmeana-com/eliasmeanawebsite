import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, logoutUser } from './LoginFunctions';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginUser(username, password);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    window.location.reload();
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="logout-message">
          <h2>Are you sure you want to logout?</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit">Log In</button>
        </form>
      )}
    </div>
  );
}

export default Login;
