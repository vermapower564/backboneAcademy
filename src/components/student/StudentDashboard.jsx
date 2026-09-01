import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, FileText, CheckCircle2, Download, Bell, DollarSign, Printer } from 'lucide-react';
import StudentResources from '../StudentResources';
import AcademicCalendar from '../AcademicCalendar';

export default function StudentDashboard({ user, onNavigate }) {
  const [studentInfo, setStudentInfo] = useState({
    name: user?.name || 'Aarav Kumar',
    studentId: user?.studentId || 'STU-2026-001',
    className: 'Class 10',
    board: 'CBSE',
    course: 'Class 5th to 10th Academics',
    batch: 'Morning (8:00 AM - 11:00 AM)'
  });

  const [attendance, setAttendance] = useState([
    { date: '2026-08-30', status: 'PRESENT' },
    { date: '2026-08-29', status: 'PRESENT' },
    { date: '2026-08-28', status: 'PRESENT' }
  ]);

  const [feeRecord, setFeeRecord] = useState({
    receiptNo: 'REC-2026-101',
    totalAmount: 12000,
    paidAmount: 8000,
    pendingAmount: 4000,
    dueDate: '2026-09-10',
    paymentStatus: 'PARTIAL'
  });

  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [results, setResults] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const getHeaders = (extraHeaders = {}) => {
    const headers = { 'Content-Type': 'application/json', ...extraHeaders };
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else {
      headers['x-user-role'] = 'STUDENT';
      if (user?.studentId) headers['x-student-id'] = user.studentId;
    }
    return headers;
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const headers = getHeaders();
      const [asRes, matRes, exRes, feeRes] = await Promise.all([
        fetch('http://localhost:5000/api/assignments?className=Class 10', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/materials?className=Class 10', { headers }).then(r => r.json()).catch(() => null),
        fetch(`http://localhost:5000/api/exams/results?studentId=${studentInfo.studentId}`, { headers }).then(r => r.json()).catch(() => null),
        fetch(`http://localhost:5000/api/fees?studentId=${studentInfo.studentId}`, { headers }).then(r => r.json()).catch(() => null)
      ]);

      if (asRes?.assignments) setAssignments(asRes.assignments);
      if (matRes?.materials) setMaterials(matRes.materials);
      if (exRes?.results) setResults(exRes.results);
      if (feeRes?.fees && feeRes.fees.length > 0) setFeeRecord(feeRes.fees[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const attendancePercentage = 92; // 92% attendance rate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel-highlight" style={{ padding: '28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>STUDENT PORTAL</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome back, {studentInfo.name}!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            ID: <strong style={{ color: 'var(--brand-gold)' }}>{studentInfo.studentId}</strong> | Enrolled in <strong>{studentInfo.className} ({studentInfo.board})</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>{attendancePercentage}%</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fee Status</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: feeRecord.paymentStatus === 'PAID' ? '#4ADE80' : '#FACC15', marginTop: '4px' }}>
              {feeRecord.paymentStatus}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        {/* Left Column: Homework & Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Homework Assignments */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen color="var(--brand-crimson)" size={20} />
              <span>Assigned Homework & Tasks ({assignments.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.map(a => (
                <div key={a.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{a.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>Due: {a.dueDate}</span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{a.description}</p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned by: {a.createdBy}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Resources & PDF Library */}
          <StudentResources user={user} canManage={false} />

          {/* Academic Calendar & Schedule */}
          <AcademicCalendar user={user} canManage={false} />
        </div>

        {/* Right Column: Fees, Report Card & Timetable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Fee Receipt Card */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign color="#22C55E" size={18} />
              <span>Fee Payment Status</span>
            </h3>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div>Receipt No: <strong>{feeRecord.receiptNo}</strong></div>
              <div>Total Fee: ₹{feeRecord.totalAmount}</div>
              <div>Paid Amount: <strong style={{ color: '#4ADE80' }}>₹{feeRecord.paidAmount}</strong></div>
              <div>Pending: <strong style={{ color: '#FCA5A5' }}>₹{feeRecord.pendingAmount}</strong></div>
            </div>
            <button className="btn-crimson" onClick={() => setShowReceiptModal(true)} style={{ width: '100%', justifyContent: 'center', marginTop: '14px', fontSize: '0.82rem' }}>
              <Printer size={15} /> View Official Receipt
            </button>
          </div>

          {/* Academic Report Card Summary */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="var(--brand-gold)" size={18} />
              <span>Recent Report Cards</span>
            </h3>
            {results.map(r => (
              <div key={r.id} style={{ padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.subject}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score: {r.marksObtained}/{r.maxMarks} ({r.percentage}%)</div>
                </div>
                <span className="badge-crimson" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Grade {r.grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '28px', background: '#FFF', color: '#000' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #E63946', paddingBottom: '12px', marginBottom: '14px' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#E63946', margin: '4px 0 0' }}>BACKBONE ACADEMY</h3>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>Pandra Ranchi | Helpline: +91 9304868696</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, marginTop: '4px', background: '#EEE', padding: '2px 8px', display: 'inline-block', borderRadius: '4px' }}>FEE PAYMENT RECEIPT</div>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div><strong>Receipt No:</strong> {feeRecord.receiptNo}</div>
              <div><strong>Student Name:</strong> {studentInfo.name} ({studentInfo.studentId})</div>
              <div><strong>Class:</strong> {studentInfo.className} ({studentInfo.board})</div>
              <hr style={{ margin: '10px 0' }} />
              <div><strong>Total Agreed Fee:</strong> ₹{feeRecord.totalAmount}</div>
              <div><strong>Paid Amount:</strong> <span style={{ color: 'green', fontWeight: 800 }}>₹{feeRecord.paidAmount}</span></div>
              <div><strong>Balance Pending:</strong> ₹{feeRecord.pendingAmount}</div>
              <div><strong>Status:</strong> {feeRecord.paymentStatus}</div>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
              <button className="btn-crimson" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.print()}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center', color: '#000' }} onClick={() => setShowReceiptModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
