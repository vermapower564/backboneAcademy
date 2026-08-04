import React from 'react';
import { Share2 } from 'lucide-react';

export default function FloatingShareWidget({ onOpenShareModal }) {
  const handleShareClick = async () => {
    const shareTitle = "Backbone Academy — Unlock Your Future With Unbelievable Strength";
    const shareText = "Join Backbone Academy in Pandra Ranchi! Class 1st-10th Academics, Navodaya Entrance (JNVST), and Computer Classes (DCA, ADCA, Tally GST). 3 Days Free Demo Classes!";
    
    // Replace 'localhost' with real shareable Wi-Fi network link so anyone on WhatsApp can open it!
    const shareUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://192.168.1.39:5174/'
      : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        onOpenShareModal();
      }
    } else {
      onOpenShareModal();
    }
  };

  return (
    <div 
      onClick={handleShareClick}
      title="Share Backbone Academy Link on Mobile / Tablet / Desktop"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '30px',
        zIndex: 999,
        background: 'linear-gradient(135deg, #E63946 0%, #B71C1C 100%)',
        color: '#FFFFFF',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(230, 57, 70, 0.6)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
      className="animate-pulse-glow"
    >
      <Share2 size={26} />
    </div>
  );
}
