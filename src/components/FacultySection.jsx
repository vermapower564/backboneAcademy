import React from 'react';
import { Award, UserCheck, Star, Sparkles, BookOpen, Gift, Laptop, GraduationCap } from 'lucide-react';

const FACULTY_MEMBERS = [
  {
    name: "Rahul Sir",
    title: "Head of Mathematics, Science & Computer Dept.",
    experience: "7 Years Experience",
    specialization: "Class 5th-10th Maths, Science & Computer Classes",
    avatar: "/teacher.jpg",
    bio: "Senior lead faculty with 7 years of teaching excellence in Pandra Ranchi. Mentored 1,500+ students to score top marks in Mathematics, Science, and Computer diploma courses."
  },
  {
    name: "Subham Pandey Sir",
    title: "Computer & IT Department Specialist",
    experience: "7 Years Experience",
    specialization: "DCA, ADCA, Tally Prime GST, MS Excel & PPT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Senior computer specialist delivering 100% practical computer training in DCA, ADCA, Tally Prime GST accounting, and advanced office automation."
  },
  {
    name: "Roushan Verma Sir",
    title: "Navodaya Entrance (JNVST) & Senior Faculty",
    experience: "8+ Years Experience",
    specialization: "JNVST Entrance, Mental Ability & Senior Science",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Specialist instructor for Jawahar Navodaya Vidyalaya Selection Test (JNVST) preparation, mental ability reasoning, and senior school coaching."
  },
  {
    name: "Shivam Sir",
    title: "Class 5th to 8th Academics Specialist",
    experience: "5+ Years Experience",
    specialization: "Class 5th, 6th, 7th & 8th Maths, Science & English",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Dedicated middle-school academic expert focusing on strong foundational concepts in Mathematics, Science, and English for Class 5th to 8th students."
  },
  {
    name: "Riya Ma'am",
    title: "Primary Classes (1st to 5th) Lead Faculty",
    experience: "4+ Years Experience",
    specialization: "Class 1st to 5th All Subjects & Early Learning",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Caring primary school educator specializing in interactive, conceptual, and fun learning methods for Class 1st to 5th foundational students."
  }
];

export default function FacultySection({ onOpenDemoModal }) {
  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="badge-crimson" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
            MEET OUR EXPERIENCED TEACHERS
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck color="var(--brand-crimson)" size={30} />
            <span>Experienced Backbone Academy Faculty</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Dedicated expert teachers for Class 1st-5th, Class 5th-8th, Class 9th-10th, Navodaya Entrance, and Computer Classes in Pandra Ranchi.
          </p>
        </div>

        <button className="btn-crimson" onClick={onOpenDemoModal} style={{ boxShadow: '0 0 20px rgba(230, 57, 70, 0.5)' }}>
          <Gift size={18} />
          <span>Book 3 Free Demo Classes</span>
        </button>
      </div>

      {/* Featured Lead Teacher Card - Rahul Sir */}
      <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.12) 0%, rgba(17, 24, 39, 0.95) 100%)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
        <img 
          src="/teacher.jpg" 
          alt="Rahul Sir - Head of Mathematics, Science & Computer Dept." 
          style={{ width: '130px', height: '150px', borderRadius: '16px', objectFit: 'cover', border: '3px solid var(--brand-crimson)', boxShadow: '0 0 24px rgba(230, 57, 70, 0.5)' }} 
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span className="badge-crimson" style={{ background: 'var(--brand-crimson)', color: '#FFF' }}>HEAD OF ACADEMICS & COMPUTER DEPT</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-gold)' }}>⭐ 7 Years Experience</span>
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Rahul Sir</h3>
          <div style={{ color: 'var(--brand-crimson)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
            Head of Mathematics, Science & Computer Classes (Class 5th-10th, DCA, ADCA, Tally & Excel)
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            "Education and practical computer skills form the strong backbone of every student's future. With 7 years of dedicated teaching experience in Ranchi, my goal is to give every student individual attention and guidance for guaranteed exam success."
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-crimson" onClick={onOpenDemoModal}>
              <Gift size={16} />
              <span>Book 3 Free Demo Classes with Rahul Sir</span>
            </button>
          </div>
        </div>
      </div>

      {/* All Faculty Cards Grid */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>All Backbone Academy Faculty Members</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {FACULTY_MEMBERS.map((fac, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <img src={fac.avatar} alt={fac.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-crimson)' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{fac.name}</h3>
                  <div style={{ color: 'var(--brand-crimson)', fontSize: '0.8rem', fontWeight: 700 }}>{fac.title}</div>
                  <span className="badge-crimson" style={{ fontSize: '0.7rem', padding: '2px 8px', marginTop: '4px', display: 'inline-block' }}>
                    {fac.experience}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--brand-gold)', fontWeight: 700, marginBottom: '8px' }}>
                Specialty: {fac.specialization}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                "{fac.bio}"
              </p>
            </div>

            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }} onClick={onOpenDemoModal}>
              <span>Book Demo Class</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
