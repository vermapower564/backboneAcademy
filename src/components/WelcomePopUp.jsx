import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Gift, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomePopUp({ onClaimBonus }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show pop-up on initial load after 600ms
    const timer = setTimeout(() => {
      setIsVisible(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.4 }
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const handleClaim = () => {
    onClaimBonus(100);
    setIsVisible(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsVisible(false)}>
      <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', border: '2px solid var(--brand-gold)' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsVisible(false)}>
          <X size={20} />
        </button>

        <div style={{ 
          width: '72px', 
          height: '72px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #FFB703 0%, #E63946 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 16px',
          boxShadow: '0 0 30px rgba(255, 183, 3, 0.6)'
        }}>
          <Gift size={36} color="#FFFFFF" />
        </div>

        <span className="badge-crimson" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
          ✨ TODAY IS YOUR LUCKY DAY! ✨
        </span>

        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>
          Welcome to Backbone Academy
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
          You have unlocked exclusive access to our premier technical engineering & ergonomic posture ecosystem!
        </p>

        <div className="glass-panel-highlight" style={{ padding: '14px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(230, 57, 70, 0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome Gift Unlocked</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
            <Sparkles size={20} /> +100 FREE WELCOME XP
          </div>
        </div>

        <button className="btn-crimson" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={handleClaim}>
          <span>Claim 100 XP & Start Learning</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
