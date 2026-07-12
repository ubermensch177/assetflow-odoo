import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';
import './Login.css';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Just mock login for now, we have an admin seeded
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName })
        });
        
        const data = await res.json();
        if (res.ok) {
          setError('Signup successful! You can now log in.');
          setTimeout(() => setIsLogin(true), 2000);
        } else {
          setError(data.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Is the backend running?');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-panel">
        <div className="login-header">
          <div className="logo-icon-large">
            <ShieldCheck size={32} color="white" />
          </div>
          <h1>AssetFlow ERP</h1>
          <p>Enterprise Asset Management System</p>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>{error}</div>}

          {!isLogin && (
            <div className="name-fields">
              <div className="input-group">
                <User size={18} />
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required={!isLogin} 
                />
              </div>
              <div className="input-group">
                <User size={18} />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required={!isLogin} 
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Admin:</strong> admin@assetflow.com / password123</p>
        </div>
      </div>
    </div>
  );
};
