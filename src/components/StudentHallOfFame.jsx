import React from 'react';
import { Trophy, Star, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

const TOPPERS = [
  {
    name: "Aditya Kumar",
    achievement: "96.4% in Class 10th Board Exams",
    course: "Class 10th Science & Maths Batch",
    mentor: "Rahul Sir & Roushan Verma Sir",
    year: "2026 Batch Topper",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Ananya Roy",
    achievement: "Selection Rank #1 in JNVST Navodaya Exam",
    course: "Jawahar Navodaya Selection Batch",
    mentor: "Roushan Verma Sir",
    year: "2026 Navodaya Selection",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Vikram Singh",
    achievement: "Grade A+ (Distinction) in ADCA Computer",
    course: "1-Year ADCA Computer Diploma",
    mentor: "Subham Pandey Sir",
    year: "2026 Computer IT Distinction",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Priya Sharma",
    achievement: "Class 8th Topper (97.8% Marks)",
    course: "Class 5th to 8th Academic Batch",
    mentor: "Shivam Sir",
    year: "2026 Academic Star",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  }
];

export default function StudentHallOfFame() {
  return (
    <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <span className="badge-crimson" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
          STUDENT SUCCESS & RESULTS
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Trophy color="var(--brand-gold)" size={32} />
          <span>Backbone Academy Hall of Fame</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Celebrating our highest scoring students in Board Exams, Navodaya Entrance, and Computer Diplomas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {TOPPERS.map((top, idx) => (
          <div key={idx} className="glass-panel-highlight" style={{ padding: '20px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 183, 3, 0.2)', color: 'var(--brand-gold)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
              🏆 {top.year}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <img src={top.avatar} alt={top.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand-gold)', boxShadow: '0 0 16px rgba(255, 183, 3, 0.4)' }} />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{top.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>{top.course}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-glass)', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', borderLeft: '3px solid var(--brand-gold)' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{top.achievement}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Guided by {top.mentor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
