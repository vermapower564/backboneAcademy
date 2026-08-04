import React from 'react';
import { COURSES } from '../data/coursesData';
import { LayoutDashboard, Award, Flame, Calendar, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ userXP, streakDays, enrolledCourses, onNavigate }) {
  const userEnrolledList = COURSES.filter(c => enrolledCourses.includes(c.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Student Welcome Banner */}
      <div className="glass-panel-highlight" style={{ padding: '30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '10px', display: 'inline-block' }}>STUDENT PORTAL</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome back, Master Engineer!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            You are on a <strong>{streakDays}-day learning streak</strong>! Keep building your technical backbone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '14px', textCenter: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Earned XP</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-gold)' }}>{userXP} XP</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '14px', textCenter: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global Rank</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>#14</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px' }}>
        {/* Enrolled Courses & Progress */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen color="var(--brand-crimson)" size={22} />
            <span>Active Enrolled Curriculums ({userEnrolledList.length})</span>
          </h3>

          {userEnrolledList.length === 0 ? (
            <div style={{ textCenter: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>You haven't enrolled in any courses yet.</p>
              <button className="btn-crimson" style={{ marginTop: '16px' }} onClick={() => onNavigate('courses')}>
                <span>Browse Course Catalog</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userEnrolledList.map(course => (
                <div key={course.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{course.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>65% Complete</span>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--brand-crimson) 0%, var(--brand-ruby) 100%)', borderRadius: '4px' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>Next: Module 4 - Distributed Consensus Protocols</span>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => onNavigate('lab')}>
                      <span>Continue Learning</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges & Live Masterclasses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Achievements */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="var(--brand-gold)" size={20} />
              <span>Earned Credentials</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 color="var(--brand-crimson)" size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Cloud Master Credential</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked Aug 2026</div>
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 color="var(--brand-crimson)" size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Ergonomic Champion</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked Jul 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Live Masterclass */}
          <div className="glass-panel-highlight" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-crimson)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
              <Calendar size={16} /> UPCOMING LIVE MASTERCLASS
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
              Architecting Global AI RAG Pipelines with 10M+ Vectors
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Live Q&A with Chief Architect Dr. Aris Thorne.
            </p>
            <button className="btn-crimson" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}>
              <span>Reserve Seat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
