import React, { useState } from 'react';
import { COURSES, TRACKS } from '../data/coursesData';
import { Search, Clock, BookOpen, Star, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function CourseCatalog({ onSelectCourse, enrolledCourses, onEnroll }) {
  const [selectedTrack, setSelectedTrack] = useState("All Tracks");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = COURSES.filter(course => {
    const matchesTrack = selectedTrack === "All Tracks" || course.track === selectedTrack;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  return (
    <section style={{ marginBottom: '60px' }}>
      <div className="catalog-header">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Core Curriculum</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Master structural engineering foundations across five specialized tracks.</p>
        </div>

        <div className="search-input-wrapper">
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search courses, tracks, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Track Filter Tabs */}
      <div className="track-tabs" style={{ marginBottom: '30px' }}>
        {TRACKS.map(track => (
          <button
            key={track}
            className={`track-tab-btn ${selectedTrack === track ? 'active' : ''}`}
            onClick={() => setSelectedTrack(track)}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <div key={course.id} className="glass-panel course-card">
              <div>
                <div className="course-card-top">
                  <span className="badge-crimson">{course.track}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-gold)' }}>
                    ★ {course.rating} ({course.reviews})
                  </span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={15} />
                    <span>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={15} />
                    <span>{course.modulesCount} Modules</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={15} />
                    <span>{course.studentsEnrolled.toLocaleString()}</span>
                  </div>
                </div>

                <div className="course-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="instructor-avatar" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{course.instructor.name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onSelectCourse(course)}>
                      <span>Syllabus</span>
                      <ArrowUpRight size={14} />
                    </button>

                    {isEnrolled ? (
                      <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#22C55E', borderColor: '#22C55E' }}>
                        <CheckCircle2 size={14} />
                        <span>Enrolled</span>
                      </button>
                    ) : (
                      <button className="btn-crimson" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onEnroll(course.id)}>
                        <span>Enroll</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
