import React, { useRef } from 'react';
import { Sun, Moon, Flame, Compass, Terminal, Award, LayoutDashboard, Trophy, Phone, Star, User, LogIn, LogOut, Laptop, Gift, UserCheck, Share2, ChevronLeft, ChevronRight, Info, Edit3, Shield, GraduationCap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, userXP, streakDays, user, onOpenAuth, onLogout, onOpenDemoModal, onOpenShareModal }) {
  const navMenuRef = useRef(null);

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
          title="Share Backbone Academy Website Link"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Smooth Horizontally Scrollable Header Navigation */}
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
                <span>School Courses</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'computer' ? 'active' : ''}`}
                onClick={() => setActiveTab('computer')}
                style={{ color: activeTab === 'computer' ? '#06B6D4' : undefined }}
              >
                <Laptop size={17} color={activeTab === 'computer' ? '#06B6D4' : undefined} />
                <span>Computer Classes</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Info size={17} />
                <span>About Us</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'faculty' ? 'active' : ''}`}
                onClick={() => setActiveTab('faculty')}
              >
                <UserCheck size={17} />
                <span>Faculty</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'admission' ? 'active' : ''}`}
                onClick={() => setActiveTab('admission')}
              >
                <Edit3 size={17} />
                <span>Admission Enquiry</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'lab' ? 'active' : ''}`}
                onClick={() => setActiveTab('lab')}
              >
                <Terminal size={17} />
                <span>Practice Lab</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificates')}
                style={{ color: activeTab === 'certificates' ? 'var(--brand-crimson)' : undefined }}
              >
                <Award size={17} color={activeTab === 'certificates' ? 'var(--brand-crimson)' : undefined} />
                <span>Certificates</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={17} />
                <span>Reviews</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <Phone size={17} />
                <span>Contact Us</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'dashboard' || activeTab === 'portal' ? 'active' : ''}`}
                onClick={() => setActiveTab(user ? 'portal' : 'dashboard')}
                style={{ color: 'var(--brand-gold)' }}
              >
                <LayoutDashboard size={17} color="var(--brand-gold)" />
                <span>{userRole === 'ADMIN' ? 'Admin Portal' : userRole === 'TEACHER' ? 'Faculty Portal' : 'Student Portal'}</span>
              </button>
            </li>
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

        <div className="user-badge" title="Daily streak & earned XP">
          <span className="streak-counter">
            <Flame size={16} fill="#FFB703" color="#FFB703" />
            {streakDays}d
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>
            {userXP} XP
          </span>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px', background: userRole === 'ADMIN' ? 'rgba(230,57,70,0.2)' : userRole === 'TEACHER' ? 'rgba(255,183,3,0.2)' : 'rgba(34,197,94,0.2)', color: userRole === 'ADMIN' ? 'var(--brand-crimson)' : userRole === 'TEACHER' ? 'var(--brand-gold)' : '#4ADE80', fontWeight: 800 }}>
              {userRole}
            </span>
            <button 
              className="btn-outline" 
              style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '6px' }}
              onClick={onLogout}
              title="Logged in - Click to Sign Out"
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
            onClick={onOpenAuth}
          >
            <LogIn size={15} />
            <span>Login / Register</span>
          </button>
        )}

        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
