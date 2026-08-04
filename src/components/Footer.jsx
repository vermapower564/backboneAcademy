import React from 'react';
import { Send, Globe, Share2, ExternalLink, Heart, BookOpen } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ 
      marginTop: '80px', 
      padding: '50px 20px 30px', 
      background: 'var(--bg-secondary)', 
      borderTop: '1px solid var(--border-light)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
        <div>
          <div className="brand-container" style={{ marginBottom: '14px' }}>
            <img src="/logo.jpg" alt="Backbone Academy Logo" className="brand-logo-img" />
            <div className="brand-title">
              <span>BACKBONE</span>
              <span className="sub">ACADEMY</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Premier educational institute in Pandra Ranchi. Dedicated to <strong>Class 5th to 10th Academics</strong>, <strong>Jawahar Navodaya Entrance (JNVST) Preparation</strong>, and <strong>Computer & IT Classes</strong> (DCA, ADCA, Tally Prime GST, MS Excel).
          </p>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>
            Unlock Your Future With Unbelievable Strength
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>Study Programs</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('courses')}>Class 5th - 10th School Coaching</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('courses')}>Navodaya Entrance (JNVST) Prep</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('computer')}>DCA (6 Months Computer Diploma)</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('computer')}>ADCA (1 Year Computer Diploma)</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('computer')}>Tally Prime with GST Accounting</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('computer')}>Advanced MS Excel & PowerPoint</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>Official Student Resources</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <li>
              <a href="https://cbse.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>[CBSE Official Examination Board]</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://navodaya.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>[JNVST Navodaya Samiti Portal]</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://tallysolutions.com" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-crimson)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>[Tally Education & GST Portal]</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('lab')}>[Interactive Practice Quiz Lab]</li>
            <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('certificate')}>[Official Certificate Verifier]</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>Campus Location</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
            Opp. Mittal Residency, Near Shreeleather,<br />
            Pandra, Ranchi, Jharkhand (824003 / 834005)
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--brand-gold)', fontWeight: 700 }}>
            Call: +91 9304868696 / 8228931077 / 9801239451
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '40px auto 0', 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border-light)', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '14px', 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)' 
      }}>
        <div>
          © {new Date().getFullYear()} Backbone Academy. All rights reserved. Registered Educational Institute in Ranchi.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Crafted with</span>
          <Heart size={14} fill="var(--brand-crimson)" color="var(--brand-crimson)" />
          <span>for Students in Pandra Ranchi</span>
        </div>
      </div>
    </footer>
  );
}
