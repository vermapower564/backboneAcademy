import React, { useState, useEffect, useRef } from 'react';
import { Compass, Laptop, Info, UserCheck, Edit3, Award, Star, Phone, LayoutDashboard, LogIn, LogOut, Share2, ChevronLeft, ChevronRight, User, ShieldCheck, Gift, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  user, 
  onOpenAuth, 
  onLogout, 
  onOpenDemoModal, 
  onOpenShareModal 
}) {
  const navMenuRef = useRef(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    if (user) {
      const headers = { 'Content-Type': 'application/json' };
      if (user.token) headers['Authorization'] = `Bearer ${user.token}`;
      else {
        headers['x-user-role'] = user.role || 'STUDENT';
        if (user.studentId) headers['x-student-id'] = user.studentId;
      }

      fetch('http://localhost:5000/api/notifications', { headers })
        .then(r => r.json())
        .then(d => { if (d?.unreadCount !== undefined) setUnreadCount(d.unreadCount); })
        .catch(err => console.error(err));
    }
  }, [user]);

  const scrollLeft = () => {
    if (navMenuRef.current) {
      navMenuRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (navMenuRef.current) {
      navMenuRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const userRole = user?.role || 'STUDENT';

  return (
    <header className="navbar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div className="brand-container" onClick={() => setActiveTab('courses')}>
          <img src="/logo.jpg" alt="Backbone Academy Logo" className="brand-logo-img" />
          <div className="brand-title">
            <span>BACKBONE</span>
            <span className="sub">ACADEMY</span>
          </div>
        </div>

        {/* Share Button in Header */}
        <button 
          className="btn-outline"
          style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px', borderColor: 'var(--brand-crimson)', color: 'var(--brand-crimson)' }}
          onClick={onOpenShareModal}
          title="Share Website Link"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>

      {/* Public Navigation Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0, justifyContent: 'center' }}>
        <button 
          onClick={scrollLeft} 
          className="nav-scroll-btn" 
          title="Scroll Left"
          style={{ background: 'transparent', border: 'none', color: 'var(--brand-crimson)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="nav-menu-wrapper" ref={navMenuRef}>
          <ul className="nav-menu">
            <li>
              <button 
                className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <Compass size={17} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Info size={17} />
                <span>About</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'computer' ? 'active' : ''}`}
                onClick={() => setActiveTab('computer')}
                style={{ color: activeTab === 'computer' ? '#06B6D4' : undefined }}
              >
                <Laptop size={17} color={activeTab === 'computer' ? '#06B6D4' : undefined} />
                <span>Courses</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'faculty' ? 'active' : ''}`}
                onClick={() => setActiveTab('faculty')}
              >
                <UserCheck size={17} />
                <span>Why Us</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'admission' ? 'active' : ''}`}
                onClick={() => setActiveTab('admission')}
              >
                <Edit3 size={17} />
                <span>Admission</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <Phone size={17} />
                <span>Contact</span>
              </button>
            </li>

            {/* Authenticated Portal Link if logged in */}
            {user && (
              <li>
                <button 
                  className={`nav-link ${activeTab === 'dashboard' || activeTab === 'portal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('portal')}
                  style={{ color: 'var(--brand-gold)', fontWeight: 800 }}
                >
                  <LayoutDashboard size={17} color="var(--brand-gold)" />
                  <span>{userRole === 'ADMIN' ? 'Admin Portal' : userRole === 'TEACHER' ? 'Faculty Portal' : 'Student Portal'}</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <button 
          onClick={scrollRight} 
          className="nav-scroll-btn" 
          title="Scroll Right"
          style={{ background: 'transparent', border: 'none', color: 'var(--brand-crimson)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Right Header Actions */}
      <div className="nav-actions" style={{ flexShrink: 0 }}>
        {/* 3 Free Demo Classes Offer Button */}
        <button 
          className="btn-crimson" 
          style={{ padding: '6px 14px', fontSize: '0.82rem', background: 'linear-gradient(135deg, #FFB703 0%, #E63946 100%)', borderColor: '#FFB703', color: '#FFF' }}
          onClick={onOpenDemoModal}
        >
          <Gift size={15} />
          <span>3 Free Demo Classes</span>
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            {/* Notification Bell Button */}
            <button
              className="btn-outline"
              style={{ padding: '6px 10px', fontSize: '0.82rem', position: 'relative' }}
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="Notification Center"
            >
              <Bell size={16} color="var(--brand-gold)" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--brand-crimson)', color: '#FFF', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Flyout Dropdown */}
            {showNotifDropdown && (
              <div
                className="glass-panel-highlight"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  width: '360px',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                  zIndex: 999,
                  border: '1px solid var(--brand-crimson)'
                }}
              >
                <NotificationCenter user={user} isDropdown={true} onClose={() => setShowNotifDropdown(false)} />
              </div>
            )}

            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px', background: userRole === 'ADMIN' ? 'rgba(230,57,70,0.2)' : userRole === 'TEACHER' ? 'rgba(255,183,3,0.2)' : 'rgba(34,197,94,0.2)', color: userRole === 'ADMIN' ? 'var(--brand-crimson)' : userRole === 'TEACHER' ? 'var(--brand-gold)' : '#4ADE80', fontWeight: 800 }}>
              {userRole}
            </span>
            <button 
              className="btn-outline" 
              style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
              onClick={onLogout}
              title="Click to Sign Out"
            >
              <User size={15} color="var(--brand-crimson)" />
              <span>{user.name}</span>
              <LogOut size={14} style={{ marginLeft: '2px', opacity: 0.7 }} />
            </button>
          </div>
        ) : (
          <button 
            className="btn-crimson" 
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => onOpenAuth('LOGIN')}
          >
            <LogIn size={15} />
            <span>Student Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
