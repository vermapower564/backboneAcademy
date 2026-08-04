import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, Heart, Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Rohan Sharma",
    role: "Senior Backend Developer",
    course: "Distributed Cloud Architecture",
    rating: 5,
    date: "Aug 01, 2026",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    comment: "Backbone Academy completely transformed how I think about microservices & Raft consensus! The practical architecture labs and physical posture tips kept me energized."
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "AI Systems Engineer",
    course: "Full-Stack AI Engineering",
    rating: 5,
    date: "Jul 28, 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    comment: "The vector database & agent routing modules were outstanding! Plus the campus staff at Pandra Ranchi were super helpful."
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Data Infrastructure Lead",
    course: "Physical Ergonomics & Posture",
    rating: 5,
    date: "Jul 20, 2026",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    comment: "I used to suffer from constant neck strain while coding. The 20-20-20 protocol and posture coach in this app saved my spine!"
  }
];

export default function ReviewSystem() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Distributed Cloud Architecture');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview = {
      id: Date.now(),
      name,
      role: 'Backbone Academy Scholar',
      course,
      rating,
      date: 'Today',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      comment
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setComment('');

    // Trigger confetti & Thank You modal
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    setShowThankYouModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="badge-crimson">STUDENT TESTIMONIALS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star color="var(--brand-gold)" fill="var(--brand-gold)" size={28} />
              <span>Student Reviews & Experience</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Hear from engineers who built their technical & physical backbone at Backbone Academy.
            </p>
          </div>

          <div className="glass-panel-highlight" style={{ padding: '12px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-gold)' }}>4.95 / 5.0</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From 1,200+ Reviews</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare color="var(--brand-crimson)" size={20} />
            <span>Share Your Learning Experience</span>
          </h3>

          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Alex Harrison"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="search-input"
                  style={{ marginTop: '4px', paddingLeft: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Course Completed</label>
                <select 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="search-input"
                  style={{ marginTop: '4px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}
                >
                  <option value="Class 5th to 10th Academics">Class 5th to 10th Academics</option>
                  <option value="Navodaya Entrance (JNVST) Prep">Navodaya Entrance (JNVST) Prep</option>
                  <option value="Computer Literacy & Coding">Computer Literacy & Coding</option>
                  <option value="Distributed Cloud Architecture">Distributed Cloud Architecture</option>
                  <option value="Full-Stack AI Engineering">Full-Stack AI Engineering</option>
                  <option value="Physical Ergonomics & Posture">Physical Ergonomics & Posture</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      color="var(--brand-gold)" 
                      fill={star <= rating ? "var(--brand-gold)" : "none"}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Your Detailed Feedback</label>
              <textarea 
                placeholder="Describe your learning journey, curriculum quality, or posture improvements..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="search-input"
                style={{ marginTop: '4px', padding: '12px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-crimson" type="submit">
                <Send size={16} />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Reviews List */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Student Testimonials</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-panel" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} color="var(--brand-gold)" fill="var(--brand-gold)" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                <img src={rev.avatar} alt={rev.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{rev.name}</span>
                    <CheckCircle2 size={14} color="#22C55E" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)', fontWeight: 600 }}>{rev.course}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impressive Thank You Modal Pop-up */}
      {showThankYouModal && (
        <div className="modal-overlay" onClick={() => setShowThankYouModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowThankYouModal(false)}>
              <X size={20} />
            </button>

            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)', margin: '0 auto 16px', boxShadow: '0 0 24px rgba(230, 57, 70, 0.5)' }}>
              <Heart size={36} fill="var(--brand-crimson)" color="var(--brand-crimson)" />
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
              Thank You so Much! 🎉
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Your inspiring review strengthens the entire <strong>Backbone Academy</strong> community! We truly appreciate your feedback and dedication to tech mastery.
            </p>

            <div className="glass-panel-highlight" style={{ padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem', color: 'var(--brand-gold)', fontWeight: 700 }}>
              <Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Bonus +50 Review XP Awarded to your profile!
            </div>

            <button className="btn-crimson" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowThankYouModal(false)}>
              <span>Continue Learning</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
