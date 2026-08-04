import React from 'react';
import { Phone, MapPin, Mail, Clock, MessageSquare, ExternalLink, Navigation, GraduationCap, Laptop, BookOpen } from 'lucide-react';

export default function ContactSection() {
  const whatsappUrl = `https://wa.me/919304868696?text=${encodeURIComponent(
    "🎓 Hello Backbone Academy Admission Bot! 👋 I want to connect regarding Admissions, 3 Days Free Demo Classes, Fees, and Batch Timings at Pandra Ranchi."
  )}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span className="badge-crimson">ADMISSIONS & INQUIRIES</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
            Contact Backbone Academy
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Get in touch with us for <strong>Class 5th to 10th Academics</strong>, <strong>Jawahar Navodaya Entrance (JNVST) Preparation</strong>, <strong>Computer & Coding Classes</strong>, and Advanced Tech Courses.
          </p>
        </div>

        {/* Highlight Banner for Class 5-10, Navodaya & Computer Classes */}
        <div className="glass-panel-highlight" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px', background: 'rgba(230, 57, 70, 0.12)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-crimson)', marginBottom: '12px' }}>
            ✨ Admissions Open for New Batches at Pandra Ranchi Campus:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-glass)', padding: '10px 14px', borderRadius: '10px' }}>
              <BookOpen size={20} color="var(--brand-gold)" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Class 5th to 10th</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Maths, Science, Eng & Boards</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-glass)', padding: '10px 14px', borderRadius: '10px' }}>
              <GraduationCap size={20} color="var(--brand-crimson)" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Navodaya Entrance (JNVST)</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Special Selection Batch</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-glass)', padding: '10px 14px', borderRadius: '10px' }}>
              <Laptop size={20} color="#06B6D4" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Computer & Coding Classes</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>MS Office, Typing & Programming</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Phone Numbers Card */}
          <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)' }}>
                <Phone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Call & WhatsApp Hotlines</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Admissions Hotline</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a 
                href="tel:9304868696" 
                style={{ textDecoration: 'none', color: 'var(--text-primary)', padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: '10px', border: '1px solid var(--brand-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}
              >
                <span>+91 9304868696</span>
                <span style={{ fontSize: '0.8rem', color: '#FFF', background: 'var(--brand-crimson)', padding: '4px 10px', borderRadius: '6px' }}>Call Now</span>
              </a>

              <a 
                href="tel:8228931077" 
                style={{ textDecoration: 'none', color: 'var(--text-primary)', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}
              >
                <span>+91 8228931077</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)' }}>Call Now</span>
              </a>

              <a 
                href="tel:9801239451" 
                style={{ textDecoration: 'none', color: 'var(--text-primary)', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}
              >
                <span>+91 9801239451</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)' }}>Call Now</span>
              </a>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn-crimson" 
                style={{ justifyContent: 'center', padding: '12px', fontSize: '0.92rem', marginTop: '4px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', borderColor: '#25D366' }}
              >
                <MessageSquare size={18} />
                <span>Chat on WhatsApp (9304868696)</span>
              </a>
            </div>
          </div>

          {/* Location & Address Card */}
          <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)' }}>
                <MapPin size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Academy Campus</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pandra Ranchi Center</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Opp. Mittal Residency, Near Shreeleather,<br />
              Pandra, Ranchi, Jharkhand — 824003 / 834005
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--brand-gold)" />
                <span><strong>Opening Hours:</strong> Mon - Sat: 8:00 AM - 7:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--brand-crimson)" />
                <span><strong>Admissions Email:</strong> admissions@backboneacademy.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation color="var(--brand-crimson)" size={20} />
              <span>Pandra Ranchi Campus Location</span>
            </h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Opp. Mittal Residency, Near Shreeleather, Pandra Ranchi</span>
          </div>

          <a 
            href="https://maps.google.com/?q=Opp.+Mittal+Residency,+Near+Shreeleather,+Pandra,+Ranchi" 
            target="_blank" 
            rel="noreferrer"
            className="btn-outline"
          >
            <span>Open in Google Maps</span>
            <ExternalLink size={16} />
          </a>
        </div>

        <div style={{ width: '100%', height: '360px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <iframe 
            title="Backbone Academy Pandra Ranchi Location"
            src="https://maps.google.com/maps?q=Pandra%20Ranchi%20Jharkhand&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
