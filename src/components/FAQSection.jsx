import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    q: "How do I book and attend the 3 Days Free Demo Classes?",
    a: "Booking is 100% free! Click the '3 Free Demo Classes' button anywhere on the site, select your course (Academics, Navodaya, or Computer), choose your preferred time slot, and submit. You can also visit our Pandra Ranchi campus directly."
  },
  {
    q: "What subjects are taught for Class 1st to 10th students?",
    a: "We offer comprehensive coaching for Mathematics, Science (Physics, Chemistry, Biology), English, Hindi, and Social Science for CBSE & State Board students. Classes 1st-5th are guided by Riya Ma'am, Class 5th-8th by Shivam Sir, and Class 9th-10th by Rahul Sir & Roushan Verma Sir."
  },
  {
    q: "Are the Computer Course certificates (DCA / ADCA) government verifiable?",
    a: "Yes! All DCA, ADCA, Tally Prime GST, and MS Office certificates issued by Backbone Academy come with a unique Verification QR Code & ID Stamp that can be verified online anytime."
  },
  {
    q: "What are the timings for Jawahar Navodaya Entrance (JNVST) batches?",
    a: "Navodaya entrance prep batches run in both Morning (8:00 AM - 11:00 AM) and Evening (4:00 PM - 7:00 PM) slots under Roushan Verma Sir, including weekly OMR mock exams."
  },
  {
    q: "Where is the Backbone Academy campus located in Ranchi?",
    a: "Our campus is located at Opp. Mittal Residency, Near Shreeleather, Pandra, Ranchi, Jharkhand (Pin 824003 / 834005). Phone hotlines: +91 9304868696 / 8228931077 / 9801239451."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <span className="badge-crimson" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: '#06B6D4' }}>
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <HelpCircle color="var(--brand-crimson)" size={30} />
          <span>Have Questions? We Have Answers</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Everything parents and students need to know about admissions, demo classes, and courses.
        </p>
      </div>

      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {FAQS.map((faq, idx) => (
          <div 
            key={idx}
            className="glass-panel-highlight"
            style={{ 
              padding: '18px 22px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              borderColor: openIdx === idx ? 'var(--brand-crimson)' : 'var(--border-light)'
            }}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: openIdx === idx ? 'var(--brand-crimson)' : 'var(--text-primary)' }}>
                {faq.q}
              </h3>
              {openIdx === idx ? <ChevronUp size={20} color="var(--brand-crimson)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
            </div>

            {openIdx === idx && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
