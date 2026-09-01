import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, BookOpen, Plus, CheckCircle2, FileText, Send } from 'lucide-react';

export default function TeacherDashboard({ user }) {
  const [teacherInfo, setTeacherInfo] = useState({
    name: user?.name || 'Rahul Verma Sir',
    teacherId: 'TCH-2026-001',
    subjects: ['Mathematics', 'Science', 'Computer Science'],
    classes: ['Class 9', 'Class 10', 'ADCA Computer Diploma']
  });

  const [students, setStudents] = useState([]);
  const [attClass, setAttClass] = useState('Class 10');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceLog, setAttendanceLog] = useState({});

  // Assignment Form
  const [assignment, setAssignment] = useState({ title: '', description: '', subject: 'Mathematics', className: 'Class 10', dueDate: '2026-09-10' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(r => r.json())
      .then(d => { if (d?.students) setStudents(d.students); })
      .catch(err => console.error(err));
  }, []);

  const handleMark = (studentId, status) => {
    setAttendanceLog(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    const records = Object.keys(attendanceLog).map(sId => ({ studentId: sId, status: attendanceLog[sId] }));
    if (records.length === 0) return alert('Please mark at least one student status.');

    try {
      const res = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'TEACHER' },
        body: JSON.stringify({ date: attDate, className: attClass, records, markedBy: teacherInfo.name })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Daily Attendance saved successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'TEACHER' },
        body: JSON.stringify({ ...assignment, createdBy: teacherInfo.name })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Homework assignment published to students!');
        setAssignment({ title: '', description: '', subject: 'Mathematics', className: 'Class 10', dueDate: '2026-09-10' });
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Teacher Welcome Banner */}
      <div className="glass-panel-highlight" style={{ padding: '28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '8px', display: 'inline-block' }}>FACULTY PORTAL</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome, {teacherInfo.name}!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Assigned Subjects: <strong>{teacherInfo.subjects.join(', ')}</strong> | Classes: <strong>{teacherInfo.classes.join(', ')}</strong>
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned Students</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-gold)' }}>{students.length}</div>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '12px 18px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> <span>{msg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Left Column: Mark Daily Attendance */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar color="var(--brand-crimson)" size={20} />
              <span>Mark Daily Class Attendance</span>
            </h3>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} className="search-input" style={{ height: '36px', fontSize: '0.82rem' }} />
              <select value={attClass} onChange={e => setAttClass(e.target.value)} className="search-input" style={{ height: '36px', fontSize: '0.82rem', background: 'var(--bg-secondary)' }}>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {students.filter(s => s.className === attClass).map(s => {
              const currentStatus = attendanceLog[s.studentId] || 'UNMARKED';
              return (
                <div key={s.id} style={{ padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {s.studentId}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleMark(s.studentId, 'PRESENT')} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: currentStatus === 'PRESENT' ? '#22C55E' : 'rgba(34,197,94,0.15)', color: currentStatus === 'PRESENT' ? '#FFF' : '#22C55E', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                      P
                    </button>
                    <button onClick={() => handleMark(s.studentId, 'ABSENT')} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: currentStatus === 'ABSENT' ? '#EF4444' : 'rgba(239,68,68,0.15)', color: currentStatus === 'ABSENT' ? '#FFF' : '#EF4444', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                      A
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn-crimson" onClick={handleSaveAttendance} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
            Save Class Attendance
          </button>
        </div>

        {/* Right Column: Create Assignment Task */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText color="var(--brand-gold)" size={20} />
            <span>Publish Homework / Task</span>
          </h3>

          <form onSubmit={handlePublishAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Task Title</label>
              <input type="text" placeholder="Title..." value={assignment.title} onChange={e => setAssignment({ ...assignment, title: e.target.value })} required className="search-input" style={{ height: '36px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Target Class</label>
              <select value={assignment.className} onChange={e => setAssignment({ ...assignment, className: e.target.value })} className="search-input" style={{ height: '36px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="ADCA Computer Diploma">ADCA Computer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Instructions / Description</label>
              <textarea placeholder="Solve questions..." value={assignment.description} onChange={e => setAssignment({ ...assignment, description: e.target.value })} className="search-input" style={{ minHeight: '60px', padding: '8px', fontSize: '0.85rem' }}></textarea>
            </div>

            <button className="btn-crimson" type="submit" style={{ justifyContent: 'center', height: '38px', fontSize: '0.85rem', marginTop: '6px' }}>
              <Send size={16} /> <span>Publish Task</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
