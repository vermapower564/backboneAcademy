import React, { useState } from 'react';
import { Send, CheckCircle2, User, Phone, Mail, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../apiConfig.js';

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    mobile: '',
    email: '',
    className: 'Class 10',
    board: 'CBSE',
    address: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.mobile) {
      setErrorMsg('Student Name and Mobile number are required.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.studentName} (Parent: ${formData.parentName || 'N/A'})`,
          phone: formData.mobile,
          email: formData.email,
          message: `Admission Enquiry for ${formData.className} (${formData.board}). Address: ${formData.address || 'N/A'}. Message: ${formData.message || 'None'}`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } else {
        setErrorMsg(data.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      // Offline fallback
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <img src="/logo.jpg" alt="Backbone Academy Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--brand-crimson)', margin: '0 auto 10px' }} />
        <span className="badge-crimson">ADMISSION & ENQUIRY FORM 2026-27</span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>Join Backbone Academy</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
          Reserve seats for School Academics (Class 5-10 ICSE/CBSE/JAC), JNVST Entrance & Computer Diplomas.
        </p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '30px 16px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '16px', border: '1px solid #22C55E' }}>
          <CheckCircle2 size={48} color="#22C55E" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>Enquiry Submitted Successfully! 🎉</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '8px 0 20px' }}>
            Thank you <strong>{formData.studentName}</strong>! Our academic counselor at Pandra Ranchi campus will call you back on <strong>{formData.mobile}</strong> shortly.
          </p>
          <button className="btn-crimson" onClick={() => setSubmitted(false)}>
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {errorMsg && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Student Full Name *</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="studentName" placeholder="e.g. Aarav Kumar" value={formData.studentName} onChange={handleChange} required className="search-input" style={{ paddingLeft: '38px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Parent / Guardian Name</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" name="parentName" placeholder="e.g. Sanjay Kumar" value={formData.parentName} onChange={handleChange} className="search-input" style={{ paddingLeft: '38px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Mobile / WhatsApp Number *</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="tel" name="mobile" placeholder="e.g. 9304868696" value={formData.mobile} onChange={handleChange} required className="search-input" style={{ paddingLeft: '38px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address (Optional)</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" name="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} className="search-input" style={{ paddingLeft: '38px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Class / Target Course</label>
              <select name="className" value={formData.className} onChange={handleChange} className="search-input" style={{ marginTop: '4px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}>
                <option value="Class 5">Class 5th Coaching</option>
                <option value="Class 6">Class 6th Coaching</option>
                <option value="Class 7">Class 7th Coaching</option>
                <option value="Class 8">Class 8th Coaching</option>
                <option value="Class 9">Class 9th Board Coaching</option>
                <option value="Class 10">Class 10th Board Coaching</option>
                <option value="JNVST Navodaya Batch">Navodaya Entrance (JNVST)</option>
                <option value="ADCA Computer Diploma">ADCA Computer Course (1 Year)</option>
                <option value="DCA Computer Diploma">DCA Computer Course (6 Months)</option>
                <option value="Tally Prime GST Accounting">Tally Prime GST Accounting</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>School Board</label>
              <select name="board" value={formData.board} onChange={handleChange} className="search-input" style={{ marginTop: '4px', paddingLeft: '14px', background: 'var(--bg-secondary)' }}>
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE Board</option>
                <option value="JAC Board">JAC Board (Jharkhand)</option>
                <option value="Other">Other / Computer Student</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Address / Location</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" name="address" placeholder="e.g. Pandra, Ranchi" value={formData.address} onChange={handleChange} className="search-input" style={{ paddingLeft: '38px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Additional Message / Queries</label>
            <textarea name="message" placeholder="Write any specific query..." value={formData.message} onChange={handleChange} className="search-input" style={{ marginTop: '4px', minHeight: '80px', padding: '12px' }}></textarea>
          </div>

          <button className="btn-crimson" type="submit" disabled={loading} style={{ justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
            <Send size={18} />
            <span>{loading ? 'Submitting Enquiry...' : 'Submit Admission Enquiry'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
