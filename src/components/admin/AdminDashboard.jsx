import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, DollarSign, BookOpen, Bell, FileText, Download, Plus, Search, Filter, CheckCircle2, AlertCircle, Printer, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState({ totalStudents: 3, totalTeachers: 3, totalBookings: 1, totalFeeCollected: 23000, totalFeePending: 14000, activeCoursesCount: 12 });
  
  // Data States
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Selections
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReportCard, setSelectedReportCard] = useState(null);

  // Form States
  const [newStudent, setNewStudent] = useState({ name: '', parentName: '', mobile: '', email: '', className: 'Class 10', board: 'CBSE', course: 'Class 5th to 10th Academics' });
  const [newTeacher, setNewTeacher] = useState({ name: '', mobile: '', email: '', subjects: 'Mathematics, Science', classes: 'Class 9, Class 10' });
  const [newNotice, setNewNotice] = useState({ title: '', description: '', targetClass: 'All Classes' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', subject: 'Mathematics', className: 'Class 10', dueDate: '2026-09-10' });
  const [marksEntry, setMarksEntry] = useState({ studentId: 'STU-2026-001', studentName: 'Aarav Kumar', className: 'Class 10', subject: 'Mathematics', marksObtained: 94, maxMarks: 100 });

  // Attendance Form
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attClass, setAttClass] = useState('Class 10');

  const getHeaders = (extraHeaders = {}) => {
    const headers = { 'Content-Type': 'application/json', ...extraHeaders };
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else {
      headers['x-user-role'] = 'ADMIN';
    }
    return headers;
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const headers = getHeaders();
      const [sumRes, stuRes, tchRes, feeRes, attRes, exRes, asRes, matRes, annRes] = await Promise.all([
        fetch('http://localhost:5000/api/reports/summary', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/students', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/teachers', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/fees', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/attendance', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/exams/results', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/assignments', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/materials', { headers }).then(r => r.json()).catch(() => null),
        fetch('http://localhost:5000/api/announcements', { headers }).then(r => r.json()).catch(() => null)
      ]);

      if (sumRes?.summary) setSummary(sumRes.summary);
      if (stuRes?.students) setStudents(stuRes.students);
      if (tchRes?.teachers) setTeachers(tchRes.teachers);
      if (feeRes?.fees) setFees(feeRes.fees);
      if (attRes?.attendance) setAttendance(attRes.attendance);
      if (exRes?.results) setExamResults(exRes.results);
      if (asRes?.assignments) setAssignments(asRes.assignments);
      if (matRes?.materials) setMaterials(matRes.materials);
      if (annRes?.announcements) setAnnouncements(annRes.announcements);
    } catch (err) {
      console.error('Fetch Admin Data Error:', err);
    }
  };

  // Add Student Handler
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStudentModal(false);
        setNewStudent({ name: '', parentName: '', mobile: '', email: '', className: 'Class 10', board: 'CBSE', course: 'Class 5th to 10th Academics' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Teacher Handler
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/teachers', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newTeacher)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddTeacherModal(false);
        setNewTeacher({ name: '', mobile: '', email: '', subjects: 'Mathematics, Science', classes: 'Class 9, Class 10' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Record Fee Payment Handler
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedFeeRecord || !paymentAmount) return;

    try {
      const res = await fetch('http://localhost:5000/api/fees/payment', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ feeId: selectedFeeRecord.id, amountPaid: paymentAmount })
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentModal(false);
        setPaymentAmount('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark Attendance Handler
  const handleMarkAttendance = async (studentId, status) => {
    try {
      await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          date: attDate,
          className: attClass,
          records: [{ studentId, status }],
          markedBy: 'Admin Director'
        })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Marks Handler
  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/exams/results', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(marksEntry)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish Notice Handler
  const handlePublishNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newNotice)
      });
      const data = await res.json();
      if (data.success) {
        setNewNotice({ title: '', description: '', targetClass: 'All Classes' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export Report to CSV
  const handleExportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'students') {
      csvContent += 'Student ID,Name,Parent Name,Class,Board,Mobile,Status\n';
      students.forEach(s => {
        csvContent += `${s.studentId},${s.name},${s.parentName || ''},${s.className},${s.board},${s.mobile},${s.status}\n`;
      });
    } else if (type === 'fees') {
      csvContent += 'Receipt No,Student Name,Class,Total Fee,Paid Fee,Pending Fee,Status\n';
      fees.forEach(f => {
        csvContent += `${f.receiptNo || 'N/A'},${f.studentName},${f.className},${f.totalAmount},${f.paidAmount},${f.pendingAmount},${f.paymentStatus}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Backbone_Academy_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Admin Banner */}
      <div className="glass-panel-highlight" style={{ padding: '24px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '6px', display: 'inline-block' }}>ADMIN MANAGEMENT SYSTEM</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Backbone Academy Director Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Full control over Students, Faculty, Attendance, Fee Receipts, Examinations & Reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-crimson" onClick={() => setShowAddStudentModal(true)} style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            <Plus size={16} /> <span>Add Student</span>
          </button>
          <button className="btn-outline" onClick={() => setShowAddTeacherModal(true)} style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            <Plus size={16} /> <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>TOTAL STUDENTS</span>
            <Users color="var(--brand-crimson)" size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '6px' }}>{summary.totalStudents}</div>
          <div style={{ fontSize: '0.75rem', color: '#4ADE80', marginTop: '2px' }}>Active Batch Enrolments</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>FACULTY MEMBERS</span>
            <GraduationCap color="var(--brand-gold)" size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '6px' }}>{summary.totalTeachers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Active Teaching Staff</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>FEE COLLECTED</span>
            <DollarSign color="#22C55E" size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ADE80', marginTop: '6px' }}>₹{summary.totalFeeCollected.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Academic Year 2026-27</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>PENDING FEES</span>
            <AlertCircle color="#EF4444" size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FCA5A5', marginTop: '6px' }}>₹{summary.totalFeePending.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#FCA5A5', marginTop: '2px' }}>Outstanding Dues</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid var(--border-color)' }}>
        {[
          { id: 'overview', label: 'Students Directory', icon: Users },
          { id: 'teachers', label: 'Teacher Management', icon: GraduationCap },
          { id: 'attendance', label: 'Daily Attendance', icon: Calendar },
          { id: 'fees', label: 'Fees & Receipts', icon: DollarSign },
          { id: 'exams', label: 'Exams & Report Cards', icon: BookOpen },
          { id: 'announcements', label: 'Noticeboard', icon: Bell },
          { id: 'reports', label: 'Reports & CSV Export', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'var(--brand-crimson)' : 'var(--bg-glass)',
                color: isActive ? '#FFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Students Directory */}
      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Class-Wise Student Directory ({students.length})</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Filter students by class hierarchy and inspect individual student records.</p>
            </div>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search name, ID, phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Class Hierarchy Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {['All Classes', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'ADCA Computer Diploma'].map(cls => {
              const count = cls === 'All Classes' ? students.length : students.filter(s => s.className === cls).length;
              const isActive = (cls === 'All Classes' && !searchQuery) || searchQuery === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSearchQuery(cls === 'All Classes' ? '' : cls)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isActive ? '1px solid var(--brand-crimson)' : '1px solid var(--border-color)',
                    background: isActive ? 'rgba(230,57,70,0.18)' : 'var(--bg-glass)',
                    color: isActive ? 'var(--brand-crimson)' : 'var(--text-primary)'
                  }}
                >
                  {cls} ({count})
                </button>
              );
            })}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-glass)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Student ID</th>
                  <th style={{ padding: '12px' }}>Student Name</th>
                  <th style={{ padding: '12px' }}>Class / Board</th>
                  <th style={{ padding: '12px' }}>Parent & Contact</th>
                  <th style={{ padding: '12px' }}>Batch</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--brand-crimson)' }}>{s.studentId}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: '12px' }}>{s.className} ({s.board})</td>
                    <td style={{ padding: '12px' }}>
                      <div>{s.parentName || 'Parent'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📞 {s.mobile}</div>
                    </td>
                    <td style={{ padding: '12px' }}>{s.batch}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', background: s.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: s.status === 'ACTIVE' ? '#4ADE80' : '#FCA5A5', fontWeight: 700, fontSize: '0.75rem' }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Teacher Management */}
      {activeTab === 'teachers' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Faculty Members & Assignments ({teachers.length})</h3>
            <button className="btn-crimson" onClick={() => setShowAddTeacherModal(true)} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              <Plus size={16} /> <span>Add Faculty</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {teachers.map(t => (
              <div key={t.id} className="glass-panel" style={{ padding: '18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src="/logo.jpg" alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--brand-crimson)' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-gold)', fontWeight: 700 }}>ID: {t.teacherId}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📞 <strong>Contact:</strong> {t.mobile}</div>
                  <div>📘 <strong>Subjects:</strong> {Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects}</div>
                  <div>🏫 <strong>Assigned Classes:</strong> {Array.isArray(t.classes) ? t.classes.join(', ') : t.classes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Daily Attendance */}
      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daily Attendance Marker</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Mark daily present / absent status for student batches.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} className="search-input" style={{ height: '38px', fontSize: '0.85rem' }} />
              <select value={attClass} onChange={e => setAttClass(e.target.value)} className="search-input" style={{ height: '38px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
                <option value="ADCA Computer Diploma">ADCA Computer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {students.filter(s => s.className === attClass).map(s => {
              const rec = attendance.find(a => a.studentId === s.studentId && a.date === attDate);
              const status = rec ? rec.status : 'UNMARKED';
              return (
                <div key={s.id} className="glass-panel" style={{ padding: '14px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({s.studentId})</span></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Class: {s.className} ({s.board})</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleMarkAttendance(s.studentId, 'PRESENT')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: status === 'PRESENT' ? '#22C55E' : 'rgba(34,197,94,0.15)', color: status === 'PRESENT' ? '#FFF' : '#22C55E', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      PRESENT
                    </button>
                    <button onClick={() => handleMarkAttendance(s.studentId, 'ABSENT')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: status === 'ABSENT' ? '#EF4444' : 'rgba(239,68,68,0.15)', color: status === 'ABSENT' ? '#FFF' : '#EF4444', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      ABSENT
                    </button>
                    <button onClick={() => handleMarkAttendance(s.studentId, 'LATE')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: status === 'LATE' ? '#EAB308' : 'rgba(234,179,8,0.15)', color: status === 'LATE' ? '#FFF' : '#EAB308', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      LATE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Fees Management */}
      {activeTab === 'fees' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Student Fee Structure & Payment Receipts ({fees.length})</h3>
            <button className="btn-outline" onClick={() => handleExportCSV('fees')} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              <Download size={15} /> <span>Export Fees CSV</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-glass)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Receipt No</th>
                  <th style={{ padding: '12px' }}>Student Name</th>
                  <th style={{ padding: '12px' }}>Class</th>
                  <th style={{ padding: '12px' }}>Total Fee</th>
                  <th style={{ padding: '12px' }}>Paid</th>
                  <th style={{ padding: '12px' }}>Pending</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--brand-gold)' }}>{f.receiptNo || 'REC-2026'}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{f.studentName}</td>
                    <td style={{ padding: '12px' }}>{f.className}</td>
                    <td style={{ padding: '12px' }}>₹{Number(f.totalAmount).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: '#4ADE80', fontWeight: 700 }}>₹{Number(f.paidAmount).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: '#FCA5A5', fontWeight: 700 }}>₹{Number(f.pendingAmount).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', background: f.paymentStatus === 'PAID' ? 'rgba(34,197,94,0.15)' : f.paymentStatus === 'PARTIAL' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)', color: f.paymentStatus === 'PAID' ? '#4ADE80' : f.paymentStatus === 'PARTIAL' ? '#FACC15' : '#FCA5A5', fontWeight: 700, fontSize: '0.75rem' }}>
                        {f.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '6px' }}>
                      <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => { setSelectedFeeRecord(f); setShowPaymentModal(true); }}>
                        Record Pay
                      </button>
                      <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setSelectedReceipt(f)}>
                        <Printer size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Exams & Report Cards */}
      {activeTab === 'exams' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px' }}>Exams, Marks Submission & Report Cards</h3>

          <form onSubmit={handleSubmitMarks} style={{ padding: '18px', background: 'var(--bg-glass)', borderRadius: '14px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Student ID</label>
              <input type="text" value={marksEntry.studentId} onChange={e => setMarksEntry({ ...marksEntry, studentId: e.target.value })} className="search-input" style={{ height: '36px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Subject</label>
              <input type="text" value={marksEntry.subject} onChange={e => setMarksEntry({ ...marksEntry, subject: e.target.value })} className="search-input" style={{ height: '36px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Marks Obtained</label>
              <input type="number" value={marksEntry.marksObtained} onChange={e => setMarksEntry({ ...marksEntry, marksObtained: Number(e.target.value) })} className="search-input" style={{ height: '36px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Max Marks</label>
              <input type="number" value={marksEntry.maxMarks} onChange={e => setMarksEntry({ ...marksEntry, maxMarks: Number(e.target.value) })} className="search-input" style={{ height: '36px', fontSize: '0.85rem' }} />
            </div>
            <button className="btn-crimson" type="submit" style={{ height: '36px', fontSize: '0.85rem', justifyContent: 'center' }}>
              <span>Calculate & Submit</span>
            </button>
          </form>

          <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Published Exam Results & Grades</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-glass)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px' }}>Student ID</th>
                  <th style={{ padding: '10px' }}>Subject</th>
                  <th style={{ padding: '10px' }}>Marks Obtained</th>
                  <th style={{ padding: '10px' }}>Percentage</th>
                  <th style={{ padding: '10px' }}>Grade</th>
                  <th style={{ padding: '10px' }}>Report Card</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{r.studentId}</td>
                    <td style={{ padding: '10px' }}>{r.subject}</td>
                    <td style={{ padding: '10px' }}>{r.marksObtained} / {r.maxMarks}</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--brand-gold)' }}>{r.percentage}%</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(230,57,70,0.15)', color: 'var(--brand-crimson)', fontWeight: 800 }}>{r.grade}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => setSelectedReportCard(r)}>
                        View Report Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Announcements */}
      {activeTab === 'announcements' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px' }}>Publish Noticeboard Announcement</h3>
          <form onSubmit={handlePublishNotice} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <input type="text" placeholder="Notice Title..." value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} className="search-input" required style={{ height: '38px', fontSize: '0.85rem' }} />
            <textarea placeholder="Notice Description..." value={newNotice.description} onChange={e => setNewNotice({ ...newNotice, description: e.target.value })} className="search-input" required style={{ minHeight: '70px', padding: '10px', fontSize: '0.85rem' }}></textarea>
            <button className="btn-crimson" type="submit" style={{ width: '180px', justifyContent: 'center', height: '36px', fontSize: '0.85rem' }}>
              <span>Publish Notice</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map(a => (
              <div key={a.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-crimson)' }}>{a.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Published: {a.publishDate}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Reports & CSV Export Center */}
      {activeTab === 'reports' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Academy Reports & Analytics Center</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Generate, print, and export executive reports for administration and board audits.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {/* 1. Student Roster */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Student Roster Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Complete student directory filtered by class, board, contact, and enrollment date ({students.length} Total).
                </p>
              </div>
              <button className="btn-crimson" onClick={() => handleExportCSV('students')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Download size={15} /> <span>Export Students CSV</span>
              </button>
            </div>

            {/* 2. Fee Collection & Pending Balance */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Fee Collection & Pending Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Statement of total agreed fees, paid fees (₹{summary.totalFeeCollected.toLocaleString()}), and pending balances (₹{summary.totalFeePending.toLocaleString()}).
                </p>
              </div>
              <button className="btn-crimson" onClick={() => handleExportCSV('fees')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Download size={15} /> <span>Export Fees CSV</span>
              </button>
            </div>

            {/* 3. Class-Wise Attendance */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Class Attendance Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Daily and monthly class attendance logs, present/absent ratios, and marked-by audit trail ({attendance.length} Logs).
                </p>
              </div>
              <button className="btn-crimson" onClick={() => handleExportCSV('attendance')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Download size={15} /> <span>Export Attendance CSV</span>
              </button>
            </div>

            {/* 4. Exam Performance & Grades */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Exam Performance Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Subject scores, max marks, calculated percentages, and letter grade distributions ({examResults.length} Report Cards).
                </p>
              </div>
              <button className="btn-crimson" onClick={() => handleExportCSV('exams')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Download size={15} /> <span>Export Exam Results CSV</span>
              </button>
            </div>

            {/* 5. Teacher Activity */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Teacher Activity Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Faculty directory, assigned subject specializations, and target class allocations ({teachers.length} Faculty).
                </p>
              </div>
              <button className="btn-outline" onClick={() => window.print()} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Printer size={15} /> <span>Print Faculty Report</span>
              </button>
            </div>

            {/* 6. Assignments & Tasks */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>Assignment & Activity Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Homework published by class and subject with submission deadlines ({assignments.length} Tasks).
                </p>
              </div>
              <button className="btn-outline" onClick={() => window.print()} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                <Printer size={15} /> <span>Print Assignment Report</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedFeeRecord && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>Record Fee Payment</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Student: <strong>{selectedFeeRecord.studentName}</strong> ({selectedFeeRecord.className})<br />
              Pending Amount: <strong style={{ color: '#FCA5A5' }}>₹{selectedFeeRecord.pendingAmount}</strong>
            </p>
            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="number" placeholder="Enter Amount Paid (₹)..." value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} required className="search-input" style={{ height: '40px' }} />
              <button className="btn-crimson" type="submit" style={{ justifyContent: 'center' }}>Record Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '30px', background: '#FFF', color: '#000' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #E63946', paddingBottom: '12px', marginBottom: '16px' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#E63946', margin: '4px 0 0' }}>BACKBONE ACADEMY</h2>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>Pandra Ranchi | Helpline: +91 9304868696</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '6px', background: '#EEE', padding: '2px 8px', display: 'inline-block', borderRadius: '4px' }}>FEE PAYMENT RECEIPT</div>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div><strong>Receipt No:</strong> {selectedReceipt.receiptNo}</div>
              <div><strong>Date:</strong> {selectedReceipt.paymentDate || 'Aug 31, 2026'}</div>
              <div><strong>Student Name:</strong> {selectedReceipt.studentName}</div>
              <div><strong>Class / Course:</strong> {selectedReceipt.className}</div>
              <hr style={{ margin: '10px 0' }} />
              <div><strong>Total Agreed Fee:</strong> ₹{selectedReceipt.totalAmount}</div>
              <div><strong>Amount Paid:</strong> <span style={{ color: 'green', fontWeight: 800 }}>₹{selectedReceipt.paidAmount}</span></div>
              <div><strong>Balance Pending:</strong> ₹{selectedReceipt.pendingAmount}</div>
              <div><strong>Status:</strong> {selectedReceipt.paymentStatus}</div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="btn-crimson" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.print()}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center', color: '#000' }} onClick={() => setSelectedReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
