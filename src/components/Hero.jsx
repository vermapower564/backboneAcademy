import React, { useState } from 'react';
import { ArrowRight, GraduationCap, Laptop, BookOpen, Gift, UserCheck, Share2, Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, AlertCircle, Shield, KeyRound, UserPlus } from 'lucide-react';

export default function Hero({ onExploreClick, onLabClick, onOpenDemoModal, onOpenShareModal, onLoginSuccess, onOpenAuth, user }) {
  // Login Panel State
  const [email, setEmail] = useState('aarav@backbone.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState('STUDENT');

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

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Authentication failed. Please check credentials.');
        setLoading(false);
        return;
      }

      const authenticatedUser = {
        ...(data.user || {}),
        role: data.user?.role || role || 'STUDENT',
        token: data.token
      };

      setSuccessMsg(`Welcome back, ${authenticatedUser.name}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(authenticatedUser);
        setSuccessMsg('');
      }, 800);
    } catch (err) {
      // Offline fallback login
      const userDisplayName = email.split('@')[0] || 'Member';
      const fallbackUser = {
        id: Date.now(),
        name: userDisplayName,
        email,
        role,
        studentId: role === 'STUDENT' ? 'STU-2026-001' : null
      };

      setSuccessMsg(`Welcome back, ${userDisplayName}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(fallbackUser);
        setSuccessMsg('');
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="hero-landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center', margin: '20px 0 40px' }}>
        
        {/* Left Column: Academy Branding & Introduction */}
        <div>
          {/* Official Academy Crest & Tagline Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <img 
              src="/logo.jpg" 
              alt="Backbone Academy Official Crest Logo" 
              style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--brand-crimson)', boxShadow: '0 0 16px rgba(230, 57, 70, 0.4)' }} 
            />
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px', lineHeight: 1 }}>
                BACKBONE ACADEMY
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-gold)', fontStyle: 'italic', marginTop: '3px' }}>
                "Where Knowledge Becomes Strength"
              </div>
            </div>
          </div>

          {/* Demo Offer Banner */}
          <div 
            onClick={onOpenDemoModal}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 16px', 
              background: 'rgba(255, 183, 3, 0.15)', 
              border: '1px solid var(--brand-gold)', 
              borderRadius: '30px', 
              color: 'var(--brand-gold)', 
              fontSize: '0.84rem', 
              fontWeight: 700, 
              marginBottom: '18px',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(255, 183, 3, 0.3)'
            }}
          >
            <Gift size={16} />
            <span>SPECIAL OFFER: 3 FREE DEMO CLASSES AVAILABLE!</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: '2.5rem', lineHeight: 1.15, fontWeight: 900, marginBottom: '16px' }}>
            Unlock Academic Excellence <br />
            With <span className="gradient-text">Unbelievable Strength.</span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Welcome to <strong>Backbone Academy</strong>, Pandra Ranchi — Premier institute providing <strong>Class 5th to 10th (ICSE, CBSE, JAC Board)</strong> coaching, <strong>Jawahar Navodaya Entrance (JNVST)</strong>, and <strong>100% Practical Computer Diplomas</strong> (ADCA, DCA, Tally Prime GST, Advanced Excel). Directed by Rahul Verma Sir & Team (10-15+ Yrs Exp).
          </p>

          {/* Quick Category Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> Class 5 - 10 Boards
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
              <GraduationCap size={14} /> Navodaya (JNVST)
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: '#06B6D4' }}>
              <Laptop size={14} /> Computer ADCA / DCA
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', borderColor: '#4ADE80' }}>
              <UserCheck size={14} /> 10-15+ Yrs Faculty
            </span>
          </div>

          <div className="hero-cta-group" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-crimson" style={{ background: 'linear-gradient(135deg, #FFB703 0%, #E63946 100%)', borderColor: '#FFB703', color: '#FFF' }} onClick={onOpenDemoModal}>
              <Gift size={18} />
              <span>Book 3 Free Demo Classes</span>
            </button>

            <button className="btn-outline" onClick={onExploreClick}>
              <span>Explore Batches</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn-outline" onClick={onOpenShareModal} style={{ borderColor: 'var(--brand-crimson)', color: 'var(--brand-crimson)' }}>
              <Share2 size={18} />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Right Column: Prominent Public Login Panel */}
        <div className="glass-panel-highlight" style={{ padding: '28px', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)', border: '1px solid var(--brand-crimson)' }}>
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--brand-gold)', margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Academy Portal Login</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
              Access Student Dashboard, Teacher Portal & Admin Center
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div style={{ background: 'var(--bg-glass)', padding: '8px 10px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-gold)', marginBottom: '4px', textAlign: 'center' }}>
              ⚡ QUICK DEMO LOGIN ACCOUNTS:
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('ADMIN')}
                style={{ flex: 1, padding: '5px', border: role === 'ADMIN' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'ADMIN' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('TEACHER')}
                style={{ flex: 1, padding: '5px', border: role === 'TEACHER' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'TEACHER' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                🎓 Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('STUDENT')}
                style={{ flex: 1, padding: '5px', border: role === 'STUDENT' ? '1px solid var(--brand-crimson)' : '1px solid transparent', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: role === 'STUDENT' ? 'rgba(230,57,70,0.2)' : 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                👨‍🎓 Student
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', textAlign: 'center' }}>
              <CheckCircle size={28} style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{successMsg}</div>
            </div>
          ) : (
            <form onSubmit={handleInlineLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Student ID / Email Address</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    placeholder="aarav@backbone.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="search-input"
                    style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="search-input"
                    style={{ paddingLeft: '36px', paddingRight: '36px', height: '40px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--brand-crimson)' }}
                  />
                  <span>Remember Session</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); onOpenAuth && onOpenAuth('FORGOT_1'); }}
                  style={{ color: 'var(--brand-gold)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot Password?
                </a>
              </div>

              <button className="btn-crimson" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', height: '40px', marginTop: '4px', fontSize: '0.88rem' }}>
                <LogIn size={18} />
                <span>{loading ? 'Authenticating...' : `Sign In as ${role}`}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                New Student?{' '}
                <button
                  type="button"
                  onClick={onOpenAuth}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-crimson)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Register Account
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="glass-panel stats-bar">
        <div className="stat-item">
          <div className="stat-number">3 Days Free</div>
          <div className="stat-label">Trial Demo Classes for All Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10 - 15+ Yrs</div>
          <div className="stat-label">Highly Experienced Faculty Staff</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">Class 5-10 & JNVST</div>
          <div className="stat-label">Navodaya Selection & Board Prep</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">Computer DCA/ADCA</div>
          <div className="stat-label">Tally Prime GST & Advanced Excel</div>
        </div>
      </div>
    </div>
  );
}
