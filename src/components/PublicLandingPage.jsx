import React, { useState } from 'react';
import { ArrowRight, GraduationCap, Laptop, BookOpen, Gift, UserCheck, Share2, CheckCircle2, Award, Users, Phone, MapPin, Mail, Sparkles, Clock, Calendar, FileText, Lock, LogIn, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import Hero from './Hero';
import CourseCatalog from './CourseCatalog';
import AboutSection from './AboutSection';
import AdmissionForm from './AdmissionForm';
import ContactSection from './ContactSection';

export default function PublicLandingPage({ 
  onOpenAuth, 
  onOpenDemoModal, 
  onOpenShareModal, 
  onLoginSuccess, 
  user,
  onNavigate 
}) {
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* 1. HERO SECTION & PROMINENT INLINE LOGIN */}
      <Hero
        onExploreClick={() => handleScrollToSection('courses-section')}
        onOpenDemoModal={onOpenDemoModal}
        onOpenShareModal={onOpenShareModal}
        onLoginSuccess={onLoginSuccess}
        onOpenAuth={onOpenAuth}
        user={user}
      />

      {/* 2. ABOUT BACKBONE ACADEMY SECTION */}
      <section id="about-section" className="glass-panel" style={{ padding: '36px 32px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px' }}>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>ABOUT OUR ACADEMY</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Where Knowledge Becomes Strength</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: '6px', lineHeight: 1.6 }}>
            Backbone Academy was founded with a mission to empower school students and computer learners in Ranchi with a rock-solid academic foundation and real-world practical skills.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <UserCheck color="var(--brand-crimson)" size={28} style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>Experienced Faculty</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Directed by Rahul Verma Sir & Team with over 10-15+ years of dedicated teaching experience in CBSE, ICSE, JAC boards, and competitive prep.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <BookOpen color="var(--brand-gold)" size={28} style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>Structured Learning</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Concept-focused teaching methodology, step-by-step problem solving, and rigorous practice sheets designed for top exam performance.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Laptop color="#06B6D4" size={28} style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>100% Practical Computer Lab</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Hands-on individual PC practice for ADCA, DCA, Tally Prime GST, Typing, and MS Office applications with ISO certified course material.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE BACKBONE ACADEMY */}
      <section id="why-us-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>WHY CHOOSE US</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
            Empowering Every Student to Succeed
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
            We believe that every child has unique potential. Our small batch sizes and individual guidance ensure no student gets left behind.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "Highly Experienced Teachers (10 - 15+ Years Exp)",
              "Class 5th to 10th ICSE, CBSE & JAC Board Batches",
              "Jawahar Navodaya Entrance (JNVST) Selection Prep",
              "100% Practical Computer Lab (ADCA / DCA / Tally GST)",
              "Regular Attendance Tracking & Weekly Assessment Tests",
              "Individual Doubt Clearance & Progress Monitoring"
            ].map((text, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700 }}>
                <CheckCircle2 color="var(--brand-crimson)" size={18} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel-highlight" style={{ padding: '28px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--brand-gold)' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--brand-gold)', margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Visit Pandra Ranchi Campus</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', marginBottom: '18px' }}>
            Opp. Mittal Residency, Near Pandra Market, Pandra Ranchi
          </p>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-gold)', marginBottom: '16px' }}>
            📞 Helpline: +91 9304868696
          </div>
          <button className="btn-crimson" onClick={onOpenDemoModal} style={{ width: '100%', justifyContent: 'center' }}>
            <Gift size={18} /> <span>Book 3 Free Demo Classes</span>
          </button>
        </div>
      </section>

      {/* 4. COURSES & CLASSES OFFERINGS */}
      <section id="courses-section">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>COURSES & BATCHES</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Academic & Computer Programs</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
            Enrol in School Board Coaching (5th–10th), JNVST Entrance Prep, or Computer Diplomas
          </p>
        </div>

        <CourseCatalog
          onSelectCourse={(course) => setSelectedCourseModal(course)}
          enrolledCourses={[]}
          onEnroll={() => onOpenAuth('LOGIN')}
        />
      </section>

      {/* 5. LEARNING & ACADEMIC FEATURES (PUBLIC HIGH-LEVEL OVERVIEW) */}
      <section className="glass-panel" style={{ padding: '36px 32px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 28px' }}>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>ACADEMIC SYSTEM</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Comprehensive Student Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
            How Backbone Academy ensures consistent academic growth and parental peace of mind
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
            <Calendar color="var(--brand-crimson)" size={24} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Daily Attendance Tracking</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Automated daily present/absent logs for student accountability.</p>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
            <FileText color="var(--brand-gold)" size={24} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Homework & Assignments</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Regular practice tasks assigned by subject teachers.</p>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
            <Award color="#4ADE80" size={24} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Exams & Report Cards</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Mid-term assessments, scorecards, and grade performance cards.</p>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
            <Sparkles color="#06B6D4" size={24} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Digital Study Notes</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Downloadable chapter notes, worksheets, and 10-yr question papers.</p>
          </div>
        </div>
      </section>

      {/* 6. ADMISSION ENQUIRY CTA SECTION */}
      <section id="admission-section" className="glass-panel-highlight" style={{ padding: '36px 32px', borderRadius: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <div>
            <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>ADMISSION OPEN 2026-27</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>Begin Your Journey With Us</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
              Fill out the admission enquiry form to reserve your seats or book a 3-Day Free Demo Class. Limited seats available per batch.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-crimson" onClick={onOpenDemoModal} style={{ fontSize: '0.85rem' }}>
                <Gift size={16} /> <span>Book 3 Free Demo Classes</span>
              </button>
              <button className="btn-outline" onClick={() => onOpenAuth('LOGIN')} style={{ fontSize: '0.85rem' }}>
                <LogIn size={16} /> <span>Student Login</span>
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <AdmissionForm />
          </div>
        </div>
      </section>

      {/* 7. CONTACT & LOCATION SECTION */}
      <section id="contact-section">
        <ContactSection />
      </section>

    </div>
  );
}
