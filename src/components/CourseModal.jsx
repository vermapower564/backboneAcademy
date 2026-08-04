import React from 'react';
import { X, CheckCircle, Play, BookOpen, Clock, Award, UserCheck } from 'lucide-react';

export default function CourseModal({ course, onClose, isEnrolled, onEnroll }) {
  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: '20px' }}>
          <span className="badge-crimson">{course.track}</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '10px' }}>{course.title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{course.description}</p>
        </div>

        {/* Video Player Preview Placeholder */}
        <div style={{ 
          background: 'linear-gradient(135deg, #090C15 0%, #1E293B 100%)', 
          borderRadius: '12px', 
          padding: '40px 20px', 
          textAlign: 'center', 
          marginBottom: '24px',
          border: '1px solid var(--border-color)',
          position: 'relative'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'var(--brand-crimson)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(230, 57, 70, 0.6)',
            cursor: 'pointer'
          }}>
            <Play size={28} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '4px' }} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Course Overview & Architecture Lecture Preview</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>14 mins 30 secs • High Definition 4K</p>
        </div>

        {/* Syllabus breakdown */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="var(--brand-crimson)" />
          <span>Curriculum Modules</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {course.syllabus.map((module, idx) => (
            <div key={idx} style={{ 
              padding: '12px 16px', 
              background: 'var(--bg-glass)', 
              border: '1px solid var(--border-light)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{module}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Complete</span>
            </div>
          ))}
        </div>

        {/* Instructor Bio */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          padding: '16px', 
          background: 'var(--bg-glass)', 
          borderRadius: '12px',
          marginBottom: '24px' 
        }}>
          <img src={course.instructor.avatar} alt={course.instructor.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{course.instructor.name}</div>
            <div style={{ color: 'var(--brand-crimson)', fontSize: '0.85rem', fontWeight: 600 }}>{course.instructor.role}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Industry Veteran & Backbone Academy Distinguished Fellow</div>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Earn Badge:</strong> <span style={{ color: 'var(--brand-gold)' }}>{course.badge}</span>
          </div>

          {isEnrolled ? (
            <button className="btn-outline" style={{ color: '#22C55E', borderColor: '#22C55E' }} disabled>
              <CheckCircle size={18} />
              <span>Currently Enrolled</span>
            </button>
          ) : (
            <button className="btn-crimson" onClick={() => { onEnroll(course.id); onClose(); }}>
              <UserCheck size={18} />
              <span>Enroll in Course</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
