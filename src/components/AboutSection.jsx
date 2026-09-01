import React from 'react';
import { ShieldCheck, Award, BookOpen, Target, Users, MapPin, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel-highlight" style={{ padding: '36px', borderRadius: '24px', textAlign: 'center' }}>
        <img src="/logo.jpg" alt="Backbone Academy Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--brand-crimson)', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(230, 57, 70, 0.4)' }} />
        <span className="badge-crimson" style={{ marginBottom: '10px', display: 'inline-block' }}>ABOUT BACKBONE ACADEMY</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Where Knowledge Becomes Strength</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '12px auto 0', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Located at <strong>Pandra, Ranchi</strong> (Opp. Mittal Residency, Near Shreeleather), Backbone Academy is a premier educational institute providing top-tier coaching for <strong>School Academics (Class 5th to 10th ICSE / CBSE / JAC Board)</strong>, <strong>Navodaya Entrance (JNVST)</strong>, and <strong>Professional Computer Courses (ADCA, DCA, Tally Prime GST, Typing)</strong> led by senior mentor <strong>Rahul Verma Sir</strong>.
        </p>
      </div>

      {/* Grid: Mission, Vision, Approach */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(230, 57, 70, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)', marginBottom: '16px' }}>
            <Target size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            To empower students with strong conceptual clarity, rigorous problem-solving skills, and personal discipline, ensuring top academic performance in board examinations and competitive entrance tests.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(255, 183, 3, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-gold)', marginBottom: '16px' }}>
            <Award size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            To build the foundational "backbone" for every student in Mathematics, Science, English, and Technology, bridging classroom learning with practical application.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', marginBottom: '16px' }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Teaching Approach</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Interactive classroom lectures combined with weekly mock OMR tests, 100% practical computer lab training, small batch sizes for individual attention, and regular parent-teacher updates.
          </p>
        </div>
      </div>

      {/* Campus & Infrastructure Highlights */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin color="var(--brand-crimson)" size={24} />
          <span>Pandra Ranchi Campus Highlights</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 color="var(--brand-crimson)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>100% Practical Computer Lab</strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Dedicated systems for MS Excel, Tally Prime GST, Typing, and DTP design.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 color="var(--brand-crimson)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Board Exam Special Batches</strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tailored revision modules for CBSE, ICSE & JAC Class 9 & 10 boards.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 color="var(--brand-crimson)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>JNVST Mock Test Series</strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Weekly OMR sheet practice and mental ability shortcut techniques.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <CheckCircle2 color="var(--brand-crimson)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Experienced Faculty Team</strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Mentorship by Rahul Verma Sir, Subham Pandey Sir, Roushan Verma Sir & Shivam Sir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
