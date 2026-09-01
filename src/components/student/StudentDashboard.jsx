import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, FileText, CheckCircle2, Download, Bell, DollarSign, Printer, TrendingUp, Check, AlertCircle, Sparkles, Clock, ShieldCheck } from 'lucide-react';
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

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 25,
    present: 23,
    absent: 2,
    late: 0,
    percentage: 92
  });

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
  const [notifications, setNotifications] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const headers = getHeaders();
      const currentStudentId = user?.studentId || studentInfo.studentId;

      const [stRes, attRes, asRes, matRes, exRes, feeRes, notifRes] = await Promise.all([
        fetch(`http://localhost:5000/api/students?studentId=${currentStudentId}`, { headers }).then(r => r.json()).catch(() => null),
        fetch(`http://localhost:5000/api/attendance?studentId=${currentStudentId}`, { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/assignments?className=Class 10', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/materials?className=Class 10', { headers }).then(r => r.json()).catch(() => null),
        fetch(`http://localhost:5000/api/exams/results?studentId=${currentStudentId}`, { headers }).then(r => r.json()).catch(() => null),
        fetch(`http://localhost:5000/api/fees?studentId=${currentStudentId}`, { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/notifications', { headers }).then(r => r.json()).catch(() => null)
      ]);

      if (stRes?.students && stRes.students.length > 0) {
        setStudentInfo(stRes.students[0]);
      }

      if (attRes?.attendance) {
        const atts = attRes.attendance;
        setAttendanceRecords(atts);
        if (atts.length > 0) {
          const present = atts.filter(a => a.status === 'PRESENT').length;
          const absent = atts.filter(a => a.status === 'ABSENT').length;
          const late = atts.filter(a => a.status === 'LATE').length;
          const pct = Math.round((present / atts.length) * 100);
          setAttendanceStats({ total: atts.length, present, absent, late, percentage: pct });
        }
      }

      if (asRes?.assignments) setAssignments(asRes.assignments);
      if (matRes?.materials) setMaterials(matRes.materials);
      if (exRes?.results) setResults(exRes.results);
      if (feeRes?.fees && feeRes.fees.length > 0) setFeeRecord(feeRes.fees[0]);
      if (notifRes?.notifications) setNotifications(notifRes.notifications.slice(0, 4));
    } catch (err) {
      console.error('Error loading student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Average Exam Score
  const avgExamPercentage = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + Number(r.percentage || 0), 0) / results.length) 
    : 91;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome & Student Profile Header */}
      <div className="glass-panel-highlight" style={{ padding: '28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>AUTHENTICATED STUDENT PORTAL</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome back, {studentInfo.name}! 🎓</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.92rem' }}>
            Student ID: <strong style={{ color: 'var(--brand-gold)' }}>{studentInfo.studentId}</strong> | Enrolled: <strong>{studentInfo.className || 'Class 10'} ({studentInfo.board || 'CBSE'})</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ADE80', marginTop: '2px' }}>{attendanceStats.percentage}%</div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Avg Exam Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '2px' }}>{avgExamPercentage}%</div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 18px', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fee Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: feeRecord.paymentStatus === 'PAID' ? '#4ADE80' : '#FACC15', marginTop: '6px' }}>
              {feeRecord.paymentStatus}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 ACADEMIC PROGRESS OVERVIEW WIDGET GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* Attendance Breakdown Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>ATTENDANCE SUMMARY</span>
            <Calendar size={18} color="#4ADE80" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80' }}>
            {attendanceStats.percentage}% <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>({attendanceStats.present}/{attendanceStats.total} Days)</span>
          </div>

          {/* Visual Progress Bar */}
          <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', margin: '10px 0', overflow: 'hidden' }}>
            <div style={{ width: `${attendanceStats.percentage}%`, height: '100%', background: '#4ADE80', borderRadius: '4px' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <span>Present: <strong style={{ color: '#4ADE80' }}>{attendanceStats.present}</strong></span>
            <span>Absent: <strong style={{ color: '#EF4444' }}>{attendanceStats.absent}</strong></span>
            <span>Late: <strong style={{ color: '#FACC15' }}>{attendanceStats.late}</strong></span>
          </div>
        </div>

        {/* Exam Overall Score Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>EXAM PERFORMANCE</span>
            <TrendingUp size={18} color="var(--brand-gold)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-gold)' }}>
            {avgExamPercentage}% <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>(Grade A+)</span>
          </div>

          <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', margin: '10px 0', overflow: 'hidden' }}>
            <div style={{ width: `${avgExamPercentage}%`, height: '100%', background: 'var(--brand-gold)', borderRadius: '4px' }}></div>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Based on recent mid-term board exams & class assessments.
          </div>
        </div>

        {/* Assignments Completion Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>ASSIGNMENT TASKS</span>
            <BookOpen size={18} color="var(--brand-crimson)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-crimson)' }}>
            {assignments.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Tasks</span>
          </div>

          <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', margin: '10px 0', overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', background: 'var(--brand-crimson)', borderRadius: '4px' }}></div>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Next due date: <strong style={{ color: 'var(--brand-crimson)' }}>Sep 10, 2026</strong>
          </div>
        </div>

        {/* Fee Statement Summary Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>FEE STATEMENT</span>
            <DollarSign size={18} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80' }}>
            ₹{Number(feeRecord.paidAmount).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#FCA5A5', fontWeight: 600 }}>(Pending: ₹{feeRecord.pendingAmount})</span>
          </div>

          <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', margin: '10px 0', overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((feeRecord.paidAmount / (feeRecord.totalAmount || 1)) * 100)}%`, height: '100%', background: '#06B6D4', borderRadius: '4px' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <span>Receipt: <strong>{feeRecord.receiptNo || 'REC-2026-101'}</strong></span>
            <span style={{ color: 'var(--brand-gold)', cursor: 'pointer', fontWeight: 700 }} onClick={() => setShowReceiptModal(true)}>View Receipt</span>
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Homework, Resources & Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Homework & Assignments List */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen color="var(--brand-crimson)" size={20} />
              <span>Assigned Homework & Practice Tasks ({assignments.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending assignments at this moment.</div>
              ) : (
                assignments.map(a => (
                  <div key={a.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>Due: {a.dueDate}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{a.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <span>Subject: <strong>{a.subject || 'Mathematics'}</strong></span>
                      <span>Assigned by: {a.createdBy || 'Rahul Verma Sir'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Resources & PDF Library */}
          <StudentResources user={user} canManage={false} />

          {/* Academic Calendar & Schedule */}
          <AcademicCalendar user={user} canManage={false} />
        </div>

        {/* Right Column: Subject Performance, Fees, Report Cards & Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Subject-Wise Exam Performance Summary */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="var(--brand-gold)" size={18} />
              <span>Subject Performance & Grades</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.length === 0 ? (
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No exam report cards published yet.</div>
              ) : (
                results.map(r => (
                  <div key={r.id} style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{r.subject}</div>
                      <span className="badge-crimson" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>Grade {r.grade}</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Score: <strong>{r.marksObtained}/{r.maxMarks}</strong> ({r.percentage}%)
                    </div>
                    {/* Subject Progress Bar */}
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${r.percentage}%`, height: '100%', background: Number(r.percentage) >= 90 ? '#4ADE80' : Number(r.percentage) >= 75 ? 'var(--brand-gold)' : '#EF4444', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Academic Notifications Feed */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell color="var(--brand-gold)" size={18} />
              <span>Recent Academy Alerts</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No recent notifications.</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '3px solid var(--brand-crimson)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fee Receipt Printable Summary */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign color="#22C55E" size={18} />
              <span>Fee Receipt & Statement</span>
            </h3>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div>Receipt No: <strong>{feeRecord.receiptNo || 'REC-2026-101'}</strong></div>
              <div>Total Agreed Fee: ₹{feeRecord.totalAmount}</div>
              <div>Paid Amount: <strong style={{ color: '#4ADE80' }}>₹{feeRecord.paidAmount}</strong></div>
              <div>Balance Pending: <strong style={{ color: '#FCA5A5' }}>₹{feeRecord.pendingAmount}</strong></div>
            </div>
            <button className="btn-crimson" onClick={() => setShowReceiptModal(true)} style={{ width: '100%', justifyContent: 'center', marginTop: '14px', fontSize: '0.82rem' }}>
              <Printer size={15} /> Print Official Receipt
            </button>
          </div>

        </div>
      </div>

      {/* Official Receipt Printable Modal */}
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
              <div><strong>Receipt No:</strong> {feeRecord.receiptNo || 'REC-2026-101'}</div>
              <div><strong>Student Name:</strong> {studentInfo.name} ({studentInfo.studentId})</div>
              <div><strong>Class:</strong> {studentInfo.className || 'Class 10'}</div>
              <div><strong>Total Agreed Fee:</strong> ₹{feeRecord.totalAmount}</div>
              <div><strong>Paid Amount:</strong> <span style={{ color: '#22C55E', fontWeight: 700 }}>₹{feeRecord.paidAmount}</span></div>
              <div><strong>Balance Pending:</strong> <span style={{ color: '#EF4444', fontWeight: 700 }}>₹{feeRecord.pendingAmount}</span></div>
              <div><strong>Payment Status:</strong> <strong>{feeRecord.paymentStatus}</strong></div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-outline" style={{ flex: 1, borderColor: '#333', color: '#333' }} onClick={() => setShowReceiptModal(false)}>Close</button>
              <button className="btn-crimson" style={{ flex: 1 }} onClick={() => window.print()}>Print Receipt</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
