import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle, AlertCircle, Shield, GraduationCap, UserCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('aarav@backbone.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Quick Demo Accounts Fill Helper
  const handleQuickDemoFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setEmail('admin@backbone.edu');
      setPassword('password123');
    } else if (selectedRole === 'TEACHER') {
      setEmail('rahul@backbone.edu');
      setPassword('password123');
    } else {
      setEmail('aarav@backbone.edu');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg('');
    setLoading(true);

    const endpoint = isLoginMode ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const bodyData = isLoginMode ? { email, password } : { name, email, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Authentication failed. Please check credentials.');
        setLoading(false);
        return;
      }

      const authenticatedUser = {
        ...(data.user || {}),
        role: data.user?.role || role || 'STUDENT'
      };

      setSuccessMsg(data.message);
      setTimeout(() => {
        onLoginSuccess(authenticatedUser);
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      // Offline fallback authentication
      const userDisplayName = isLoginMode ? (email.split('@')[0] || 'User') : (name || 'New Member');
      const fallbackUser = {
        id: Date.now(),
        name: userDisplayName,
        email,
        role
      };

      setSuccessMsg(isLoginMode ? `Welcome back, ${userDisplayName}!` : `Account created successfully! Welcome to Backbone Academy.`);
      setTimeout(() => {
        onLoginSuccess(fallbackUser);
        setSuccessMsg('');
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/logo.jpg" alt="Backbone Academy Logo" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--brand-crimson)', margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {isLoginMode ? 'Portal Sign In' : 'Register Account'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '2px' }}>
            Backbone Academy Management System & Student Portal
          </p>
        </div>

        {/* Quick Demo Switcher Banner */}
        {isLoginMode && (
          <div style={{ background: 'var(--bg-glass)', padding: '10px 12px', borderRadius: '12px', marginBottom: '18px', border: '1px solid var(--brand-gold)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-gold)', marginBottom: '6px', textAlign: 'center' }}>
              ⚡ QUICK ONE-CLICK DEMO ACCOUNTS:
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('ADMIN')}
                style={{ flex: 1, padding: '4px', border: role === 'ADMIN' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'ADMIN' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('TEACHER')}
                style={{ flex: 1, padding: '4px', border: role === 'TEACHER' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'TEACHER' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                🎓 Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('STUDENT')}
                style={{ flex: 1, padding: '4px', border: role === 'STUDENT' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'STUDENT' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                👨‍🎓 Student
              </button>
            </div>
          </div>
        )}

        {/* Tab Switch: Login / Register */}
        <div style={{ display: 'flex', background: 'var(--bg-glass)', padding: '4px', borderRadius: '30px', marginBottom: '18px' }}>
          <button
            type="button"
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '25px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: isLoginMode ? 'var(--brand-crimson)' : 'transparent', color: isLoginMode ? '#FFF' : 'var(--text-secondary)' }}
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
          >
            Log In
          </button>
          <button
            type="button"
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '25px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: !isLoginMode ? 'var(--brand-crimson)' : 'transparent', color: !isLoginMode ? '#FFF' : 'var(--text-secondary)' }}
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.84rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', textAlign: 'center' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700 }}>{successMsg}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLoginMode && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="search-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="student@backbone.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="search-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="search-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <button className="btn-crimson" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
              {isLoginMode ? <LogIn size={18} /> : <UserPlus size={18} />}
              <span>{loading ? 'Authenticating...' : isLoginMode ? `Sign In as ${role}` : 'Create Account'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
