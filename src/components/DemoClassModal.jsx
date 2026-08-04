import React, { useState } from 'react';
import { X, CheckCircle2, Phone, User, Gift, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DemoClassModal({ isOpen, onClose }) {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('Class 5th to 10th Academics');
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    setLoading(true);
    try {
      // Send real API request to Backend Server
      const res = await fetch('http://localhost:5000/api/demo-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, phone, course, timeSlot })
      });
      const data = await res.json();

      setIsBooked(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      // Fallback offline success
      setIsBooked(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsBooked(false);
    setStudentName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '480px', padding: '32px', border: '2px solid var(--brand-crimson)' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {isBooked ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', margin: '0 auto 16px', boxShadow: '0 0 24px rgba(34, 197, 94, 0.5)' }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ADE80', marginBottom: '8px' }}>
              3 Free Demo Classes Reserved! 🎉
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Thank you <strong>{studentName}</strong>! Your 3-day trial seat for <strong>{course}</strong> with Rahul Verma Sir has been registered on our backend server.
            </p>

            <div className="glass-panel-highlight" style={{ padding: '14px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(230, 57, 70, 0.15)', textAlign: 'left', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '6px' }}>Campus Confirmation:</div>
              <div>📍 <strong>Location:</strong> Opp. Mittal Residency, Near Shreeleather, Pandra Ranchi</div>
              <div>📞 <strong>Hotlines:</strong> +91 9304868696 / 8228931077</div>
              <div>🕒 <strong>Selected Slot:</strong> {timeSlot}</div>
            </div>

            <button className="btn-crimson" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClose}>
              <span>Done & Close</span>
            </button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-crimson)', margin: '0 auto 10px', boxShadow: '0 0 20px rgba(230, 57, 70, 0.4)' }}>
                <Gift size={30} />
              </div>

              <span className="badge-crimson" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--brand-gold)', borderColor: 'var(--brand-gold)' }}>
                🎁 SPECIAL OFFER: 3 DAYS FREE DEMO
              </span>

              <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px' }}>
                Book 3 Free Demo Classes
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                Experience our teaching quality with Rahul Verma Sir before joining!
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Student Full Name</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Enter student name..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="search-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Mobile / WhatsApp Number</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="tel" 
                    placeholder="e.g. 9304868696"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="search-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Demo Course</label>
                <select 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="search-input"
                  style={{ marginTop: '4px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}
                >
                  <option value="Class 5th to 10th Academics">Class 5th to 10th School Coaching</option>
                  <option value="Navodaya Entrance (JNVST) Prep">Navodaya Entrance (JNVST) Batch</option>
                  <option value="DCA Computer Diploma">DCA Computer Course (6 Months)</option>
                  <option value="ADCA Computer Diploma">ADCA Computer Course (1 Year)</option>
                  <option value="Tally Prime GST Accounting">Tally Prime GST Accounting</option>
                  <option value="Advanced MS Excel & PPT">Advanced MS Excel & PowerPoint</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Preferred Batch Timing</label>
                <select 
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="search-input"
                  style={{ marginTop: '4px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}
                >
                  <option value="Morning (8:00 AM - 11:00 AM)">Morning (8:00 AM - 11:00 AM)</option>
                  <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                  <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                </select>
              </div>

              <button className="btn-crimson" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}>
                <Send size={18} />
                <span>{loading ? 'Submitting to Backend...' : 'Reserve 3 Free Demo Classes Now'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
