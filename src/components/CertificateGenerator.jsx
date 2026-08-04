import React, { useState } from 'react';
import { COURSES } from '../data/coursesData';
import { Award, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CertificateGenerator() {
  const [studentName, setStudentName] = useState("Alex Harrison");
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);
  const [issueDate, setIssueDate] = useState("August 03, 2026");

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  const certificateId = `BB-ACADEMY-2026-${selectedCourse.id.toUpperCase()}-8924`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award color="var(--brand-crimson)" size={28} />
          <span>Official Certificate Generator</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Generate your official verifiable Certificate of Completion with Backbone Academy credentials.
        </p>

        {/* Customization Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Student Full Name</label>
            <input 
              type="text" 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)}
              className="search-input"
              style={{ marginTop: '6px', paddingLeft: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Completed Curriculum</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="search-input"
              style={{ marginTop: '6px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}
            >
              {COURSES.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Issue Date</label>
            <input 
              type="text" 
              value={issueDate} 
              onChange={(e) => setIssueDate(e.target.value)}
              className="search-input"
              style={{ marginTop: '6px', paddingLeft: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Certificate Preview Card */}
      <div className="certificate-preview-box" id="certificate-print-area">
        <img src="/logo.jpg" alt="Backbone Academy Emblem" className="certificate-header-logo" />
        
        <div className="certificate-title">BACKBONE ACADEMY</div>
        <div style={{ fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#B71C1C', fontWeight: 800, marginBottom: '24px' }}>
          Unlock Your Future With Unbelievable Strength
        </div>

        <div style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#475569', marginBottom: '10px' }}>
          This is to officially certify that
        </div>

        <div className="certificate-student-name">
          {studentName || "Student Name"}
        </div>

        <div style={{ fontSize: '1.05rem', color: '#334155', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
          has successfully fulfilled all rigorous academic standards, practical engineering labs, and architectural examinations for the curriculum of:
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B71C1C', marginBottom: '24px' }}>
          {selectedCourse.title}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '40px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>
              Dr. Aris Thorne
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Academic Dean & Founder
            </div>
          </div>

          <div style={{ 
            width: '70px', 
            height: '70px', 
            borderRadius: '50%', 
            border: '3px solid #D32F2F', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#D32F2F',
            fontWeight: 800,
            fontSize: '0.65rem',
            textAlign: 'center',
            padding: '4px'
          }}>
            <ShieldCheck size={20} />
            VERIFIED
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{issueDate}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Verification ID: {certificateId}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button className="btn-crimson" onClick={handlePrint}>
          <Printer size={18} />
          <span>Print / Save Certificate as PDF</span>
        </button>
      </div>
    </div>
  );
}
