import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send, Globe, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Smart share URL: Replaces 'localhost' with real Wi-Fi IP '192.168.1.39:5174' or live domain so anyone on WhatsApp can open it!
  const shareUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://192.168.1.39:5174/' 
    : window.location.href;

  const shareTitle = "Backbone Academy — Unlock Your Future With Unbelievable Strength";
  const shareText = "Join Backbone Academy in Pandra Ranchi! Class 1st-10th Academics, Navodaya Entrance (JNVST), and Computer Classes (DCA, ADCA, Tally GST). 3 Days Free Demo Classes!";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n\nJoin here: ${shareUrl}`
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px', padding: '32px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)', margin: '0 auto 14px', boxShadow: '0 0 24px rgba(230, 57, 70, 0.4)' }}>
          <Share2 size={30} />
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
          Share Backbone Academy
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Share our real academy link on WhatsApp, SMS, or social media!
        </p>

        {/* Shareable Link Box */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '20px', alignItems: 'center' }}>
          <Globe size={18} color="var(--brand-crimson)" />
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
          />
          <button 
            className="btn-crimson" 
            onClick={handleCopyLink}
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a 
            href={whatsappShareUrl} 
            target="_blank" 
            rel="noreferrer"
            className="btn-crimson"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', borderColor: '#25D366' }}
          >
            <MessageSquare size={18} />
            <span>Share directly on WhatsApp</span>
          </a>

          {navigator.share && (
            <button 
              className="btn-outline" 
              onClick={handleNativeShare}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              <Send size={18} />
              <span>Share via Phone Apps (SMS/Email/Social)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
