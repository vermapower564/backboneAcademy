import React from 'react';
import { ArrowRight, Zap, Sparkles, GraduationCap, Laptop, BookOpen, Gift, UserCheck, Share2 } from 'lucide-react';

export default function Hero({ onExploreClick, onLabClick, onOpenDemoModal, onOpenShareModal }) {
  return (
    <div>
      <section className="hero-section">
        <div>
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
              fontSize: '0.85rem', 
              fontWeight: 700, 
              marginBottom: '20px',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(255, 183, 3, 0.3)'
            }}
          >
            <Gift size={16} />
            <span>SPECIAL OFFER: 3 FREE DEMO CLASSES AVAILABLE!</span>
          </div>

          <h1 className="hero-title">
            Unlock Your Future <br />
            With <span className="gradient-text">Unbelievable Strength.</span>
          </h1>

          <p className="hero-subtitle">
            Welcome to <strong>Backbone Academy</strong>, Pandra Ranchi — Join us with <strong>Highly Experienced Teachers (10-15+ Yrs Exp)</strong> for <strong>Class 5th to 10th Academics</strong>, <strong>Jawahar Navodaya Entrance (JNVST)</strong>, and <strong>Computer Classes</strong> (DCA, ADCA, Tally Prime GST, Excel).
          </p>

          {/* Quick Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> Class 5 - 10 Boards
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
              <GraduationCap size={14} /> Navodaya Entrance (JNVST)
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: '#06B6D4' }}>
              <Laptop size={14} /> Computer Classes (DCA/ADCA)
            </span>
            <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', borderColor: '#4ADE80' }}>
              <UserCheck size={14} /> Experienced Faculty
            </span>
          </div>

          <div className="hero-cta-group">
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

        <div className="hero-emblem-wrapper">
          <div className="orbit-ring"></div>
          <img 
            src="/logo.jpg" 
            alt="Backbone Academy Official Crest Logo" 
            className="hero-logo-large animate-float" 
          />
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
