import React, { useState } from 'react';
import { COMPUTER_COURSES } from '../data/computerCoursesData';
import { Laptop, Clock, Award, CheckCircle2, BookOpen, ChevronRight, MessageSquare, Phone } from 'lucide-react';

export default function ComputerClasses({ onSelectCourse }) {
  const [selectedCourse, setSelectedCourse] = useState(COMPUTER_COURSES[0]);

  const whatsappInquiryUrl = (courseTitle) => `https://wa.me/918228931077?text=${encodeURIComponent(
    `Hello Backbone Academy, I want to inquire about admission for the computer course: ${courseTitle}. Please share batch timings & fee details.`
  )}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="badge-crimson" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: '#06B6D4' }}>
              COMPUTER & IT TRAINING ACADEMY
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Laptop color="#06B6D4" size={32} />
              <span>Computer Learning Courses (DCA, ADCA, Tally & Excel)</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              100% Practical Computer Classes in Pandra Ranchi. Master DCA, ADCA, Tally Prime with GST, Advanced Excel, & PowerPoint.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="tel:8228931077" className="btn-crimson" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Phone size={16} />
              <span>Call: 8228931077</span>
            </a>
          </div>
        </div>

        {/* Quick Selection Tabs */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
          {COMPUTER_COURSES.map(course => (
            <button
              key={course.id}
              className={`track-tab-btn ${selectedCourse.id === course.id ? 'active' : ''}`}
              onClick={() => setSelectedCourse(course)}
              style={{
                borderColor: selectedCourse.id === course.id ? course.color : 'var(--border-light)',
                background: selectedCourse.id === course.id ? course.color : 'var(--bg-glass)',
                color: '#FFF'
              }}
            >
              {course.code} • {course.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Detailed Inspector Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Syllabus & Overview */}
          <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-crimson" style={{ background: 'rgba(230, 57, 70, 0.15)', color: 'var(--brand-crimson)' }}>
                {selectedCourse.badge}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-gold)' }}>
                Duration: {selectedCourse.duration}
              </span>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>{selectedCourse.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
              {selectedCourse.summary}
            </p>

            <div style={{ background: 'var(--bg-glass)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <strong>Eligibility:</strong> {selectedCourse.eligibility}
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--brand-crimson)" />
              <span>Complete Curriculum Modules ({selectedCourse.syllabus.length})</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {selectedCourse.syllabus.map((mod, idx) => (
                <div key={idx} style={{ 
                  padding: '10px 14px', 
                  background: 'var(--bg-glass)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.88rem'
                }}>
                  <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                  <span>{mod}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href={whatsappInquiryUrl(selectedCourse.title)} 
                target="_blank" 
                rel="noreferrer"
                className="btn-crimson" 
                style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', borderColor: '#25D366' }}
              >
                <MessageSquare size={18} />
                <span>Inquire Batch Timings on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Highlights & Course List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award color="var(--brand-gold)" size={18} />
                <span>Key Course Benefits</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCourse.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--brand-crimson)', fontWeight: 800 }}>✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Computer Courses Summary */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
                All Computer Training Programs
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {COMPUTER_COURSES.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    style={{ 
                      padding: '10px 14px', 
                      background: selectedCourse.id === c.id ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-glass)',
                      border: `1px solid ${selectedCourse.id === c.id ? '#06B6D4' : 'var(--border-light)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selectedCourse.id === c.id ? '#06B6D4' : 'var(--text-primary)' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.duration}</div>
                    </div>
                    <ChevronRight size={16} color={selectedCourse.id === c.id ? '#06B6D4' : 'var(--text-muted)'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
