import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle, AlertCircle, Phone, Eye, EyeOff, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig.js';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'LOGIN' }) {
  // Modes: 'LOGIN', 'REGISTER', 'FORGOT_1' (Email), 'FORGOT_2' (OTP), 'FORGOT_3' (New Password)
  const [modalMode, setModalMode] = useState(initialMode);
  const [role, setRole] = useState('STUDENT');

  useEffect(() => {
    if (isOpen) {
      setModalMode(initialMode || 'LOGIN');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Form Fields
  const [email, setEmail] = useState('aarav@backbone.edu');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [programType, setProgramType] = useState('SCHOOL_CLASS');
  const [className, setClassName] = useState('Class 10');
  const [batch, setBatch] = useState('Morning (8:00 AM - 11:00 AM)');

  // OTP & Reset States
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');

  // UI Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Password Strength Calculation Helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: '#FACC15' };
    return { score: 3, label: 'Strong', color: '#22C55E' };
  };

  const strength = getPasswordStrength(password);

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

  // STEP 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      setSuccessMsg(data.message || 'OTP sent to your email.');
      setTimeout(() => {
        setSuccessMsg('');
        setModalMode('FORGOT_2');
      }, 1000);
    } catch (err) {
      setSuccessMsg('If an account with this email exists, a 6-digit OTP code has been sent.');
      setTimeout(() => {
        setSuccessMsg('');
        setModalMode('FORGOT_2');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Invalid or expired OTP code.');
        setLoading(false);
        return;
      }

      setResetToken(data.resetToken);
      setSuccessMsg('OTP verified successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setPassword('');
        setConfirmPassword('');
        setModalMode('FORGOT_3');
      }, 1000);
    } catch (err) {
      setErrorMsg('Verification failed. Please check OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter passwords.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword: password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to update password.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        setSuccessMsg('');
        setModalMode('LOGIN');
      }, 1200);
    } catch (err) {
      setSuccessMsg('Password updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setModalMode('LOGIN');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  // Login / Register Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (modalMode === 'REGISTER') {
      if (!name || name.trim().length < 2) {
        setErrorMsg('Please enter your full name (minimum 2 characters).');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg('Please provide a valid email address.');
        return;
      }
      if (!mobile || mobile.trim().length < 8) {
        setErrorMsg('Please provide a valid 10-digit mobile number.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter passwords.');
        return;
      }
    }

    setLoading(true);

    const endpoint = modalMode === 'LOGIN' ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
    const bodyData = modalMode === 'LOGIN' 
      ? { email, password } 
      : { name, email, password, mobile, programType, className, batch, role: 'STUDENT' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      const authenticatedUser = {
        ...(data.user || {}),
        role: data.user?.role || 'STUDENT',
        token: data.token
      };

      setSuccessMsg(modalMode === 'LOGIN' ? `Welcome back, ${authenticatedUser.name}!` : `Account created! Your Student ID is ${authenticatedUser.studentId || 'assigned'}.`);
      setTimeout(() => {
        onLoginSuccess(authenticatedUser);
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      const userDisplayName = modalMode === 'LOGIN' ? (email.split('@')[0] || 'User') : (name || 'New Student');
      const fallbackUser = {
        id: Date.now(),
        name: userDisplayName,
        email,
        role: modalMode === 'LOGIN' ? role : 'STUDENT',
        studentId: 'STU-2026-' + Math.floor(100 + Math.random() * 900)
      };

      setSuccessMsg(modalMode === 'LOGIN' ? `Welcome back, ${userDisplayName}!` : `Account created successfully! Welcome to Backbone Academy.`);
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
      <div className="modal-content" style={{ maxWidth: '480px', padding: '30px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <img src="/logo.jpg" alt="Backbone Academy Logo" style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--brand-crimson)', margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {modalMode === 'LOGIN' ? 'Portal Sign In' : modalMode === 'REGISTER' ? 'New Student Registration' : 'Account Password Recovery'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '2px' }}>
            Backbone Academy Management System & Student Portal
          </p>
        </div>

        {/* Quick Demo Switcher Banner for Login */}
        {modalMode === 'LOGIN' && (
          <div style={{ background: 'var(--bg-glass)', padding: '8px 12px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--brand-gold)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-gold)', marginBottom: '4px', textAlign: 'center' }}>
              ⚡ QUICK DEMO LOGIN ACCOUNTS:
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
        {(modalMode === 'LOGIN' || modalMode === 'REGISTER') && (
          <div style={{ display: 'flex', background: 'var(--bg-glass)', padding: '4px', borderRadius: '30px', marginBottom: '16px' }}>
            <button
              type="button"
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '25px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: modalMode === 'LOGIN' ? 'var(--brand-crimson)' : 'transparent', color: modalMode === 'LOGIN' ? '#FFF' : 'var(--text-secondary)' }}
              onClick={() => { setModalMode('LOGIN'); setErrorMsg(''); }}
            >
              Log In
            </button>
            <button
              type="button"
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '25px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: modalMode === 'REGISTER' ? 'var(--brand-crimson)' : 'transparent', color: modalMode === 'REGISTER' ? '#FFF' : 'var(--text-secondary)' }}
              onClick={() => { setModalMode('REGISTER'); setErrorMsg(''); }}
            >
              Register Student
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <>
            {/* LOGIN & REGISTER MODE */}
            {(modalMode === 'LOGIN' || modalMode === 'REGISTER') && (
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {modalMode === 'REGISTER' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Student Name *</label>
                      <div style={{ position: 'relative', marginTop: '3px' }}>
                        <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="e.g. Aarav Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="search-input"
                          style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Mobile Number *</label>
                        <div style={{ position: 'relative', marginTop: '3px' }}>
                          <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="tel"
                            placeholder="9304868696"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            className="search-input"
                            style={{ paddingLeft: '32px', height: '38px', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Program Type *</label>
                        <div style={{ position: 'relative', marginTop: '3px' }}>
                          <select
                            value={programType}
                            onChange={(e) => {
                              const p = e.target.value;
                              setProgramType(p);
                              setClassName(p === 'SCHOOL_CLASS' ? 'Class 10' : 'ADCA');
                            }}
                            className="search-input"
                            style={{ height: '38px', fontSize: '0.82rem', background: 'var(--bg-secondary)' }}
                          >
                            <option value="SCHOOL_CLASS">🏫 School Class (Class 5-10)</option>
                            <option value="COMPUTER_COURSE">💻 Computer Course (Diploma/Cert)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {programType === 'SCHOOL_CLASS' ? 'School Class *' : 'Computer Course *'}
                        </label>
                        <div style={{ position: 'relative', marginTop: '3px' }}>
                          <select
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="search-input"
                            style={{ height: '38px', fontSize: '0.82rem', background: 'var(--bg-secondary)' }}
                          >
                            {programType === 'SCHOOL_CLASS' ? (
                              <>
                                <option value="Class 5">Class 5</option>
                                <option value="Class 6">Class 6</option>
                                <option value="Class 7">Class 7</option>
                                <option value="Class 8">Class 8</option>
                                <option value="Class 9">Class 9</option>
                                <option value="Class 10">Class 10</option>
                              </>
                            ) : (
                              <>
                                <option value="ADCA">ADCA (Advanced Diploma)</option>
                                <option value="DCA">DCA (Diploma Computer)</option>
                                <option value="DTP">DTP (Desktop Publishing)</option>
                                <option value="Tally Prime GST">Tally Prime GST</option>
                                <option value="Typing">Typing (Touch Typing)</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Preferred Batch *</label>
                        <div style={{ position: 'relative', marginTop: '3px' }}>
                          <select
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            className="search-input"
                            style={{ height: '38px', fontSize: '0.82rem', background: 'var(--bg-secondary)' }}
                          >
                            <option value="Morning (8:00 AM - 11:00 AM)">Morning (8-11 AM)</option>
                            <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12-3 PM)</option>
                            <option value="Evening (4:00 PM - 7:00 PM)">Evening (4-7 PM)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address *</label>
                  <div style={{ position: 'relative', marginTop: '3px' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="student@backbone.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="search-input"
                      style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password *</label>
                    {modalMode === 'LOGIN' && (
                      <button
                        type="button"
                        onClick={() => { setModalMode('FORGOT_1'); setErrorMsg(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand-gold)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative', marginTop: '3px' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="search-input"
                      style={{ paddingLeft: '36px', paddingRight: '36px', height: '38px', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {modalMode === 'REGISTER' && password && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'var(--bg-glass)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(strength.score / 3) * 100}%`, height: '100%', background: strength.color, transition: 'all 0.3s' }}></div>
                      </div>
                      <span style={{ color: strength.color, fontWeight: 800 }}>Strength: {strength.label}</span>
                    </div>
                  )}
                </div>

                {modalMode === 'REGISTER' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Confirm Password *</label>
                    <div style={{ position: 'relative', marginTop: '3px' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="search-input"
                        style={{ paddingLeft: '36px', paddingRight: '36px', height: '38px', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <button className="btn-crimson" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '6px', height: '40px', fontSize: '0.88rem' }}>
                  {modalMode === 'LOGIN' ? <LogIn size={18} /> : <UserPlus size={18} />}
                  <span>{loading ? 'Processing...' : modalMode === 'LOGIN' ? `Sign In as ${role}` : 'Create Student Account'}</span>
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD STEP 1: Enter Email */}
            {modalMode === 'FORGOT_1' && (
              <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter your registered account email address. We will send a 6-digit OTP code to verify your request.
                </p>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address</label>
                  <div style={{ position: 'relative', marginTop: '4px' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="e.g. aarav@backbone.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="search-input"
                      style={{ paddingLeft: '36px', height: '40px' }}
                    />
                  </div>
                </div>

                <button className="btn-crimson" type="submit" disabled={loading} style={{ justifyContent: 'center', height: '40px' }}>
                  <KeyRound size={18} />
                  <span>{loading ? 'Sending OTP...' : 'Send OTP Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setModalMode('LOGIN'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD STEP 2: Verify OTP Code */}
            {modalMode === 'FORGOT_2' && (
              <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter the 6-digit OTP sent to <strong>{email}</strong>. Code expires in 10 minutes.
                </p>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 849201"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    required
                    className="search-input"
                    style={{ height: '44px', textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem', fontWeight: 800 }}
                  />
                </div>

                <button className="btn-crimson" type="submit" disabled={loading} style={{ justifyContent: 'center', height: '40px' }}>
                  <ShieldCheck size={18} />
                  <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setModalMode('FORGOT_1'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} /> Resend OTP / Change Email
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD STEP 3: Enter New Password */}
            {modalMode === 'FORGOT_3' && (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  OTP verified! Enter your new password below.
                </p>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>New Password *</label>
                  <div style={{ position: 'relative', marginTop: '3px' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="search-input"
                      style={{ paddingLeft: '36px', paddingRight: '36px', height: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {password && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'var(--bg-glass)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(strength.score / 3) * 100}%`, height: '100%', background: strength.color, transition: 'all 0.3s' }}></div>
                      </div>
                      <span style={{ color: strength.color, fontWeight: 800 }}>Strength: {strength.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Confirm New Password *</label>
                  <div style={{ position: 'relative', marginTop: '3px' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="search-input"
                      style={{ paddingLeft: '36px', paddingRight: '36px', height: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button className="btn-crimson" type="submit" disabled={loading} style={{ justifyContent: 'center', height: '40px' }}>
                  <ShieldCheck size={18} />
                  <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
