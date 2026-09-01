import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Tag, Filter, CheckCircle2, AlertCircle, Trash2, Edit3, X, Eye } from 'lucide-react';

export default function AcademicCalendar({ user, canManage = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Date Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026

  // Filters
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedType, setSelectedType] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '2026-09-15',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    eventType: '🌴 Holiday',
    targetClass: 'All Classes',
    status: 'PUBLISHED'
  });

  const userRole = (user?.role || 'GUEST').toUpperCase();

  const eventTypes = [
    { label: 'All', icon: '🗓️', color: 'var(--text-primary)', bg: 'var(--bg-glass)' },
    { label: '🌴 Holiday', icon: '🌴', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
    { label: '📝 Exam', icon: '📝', color: 'var(--brand-crimson)', bg: 'rgba(230,57,70,0.15)' },
    { label: '✏️ Class Test', icon: '✏️', color: 'var(--brand-gold)', bg: 'rgba(255,183,3,0.15)' },
    { label: '👨‍👩‍👧 Parent Meeting', icon: '👨‍👩‍👧', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
    { label: '🎉 Academy Event', icon: '🎉', color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
    { label: '📢 Admission Event', icon: '📢', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    { label: '📌 Important Date', icon: '📌', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
    { label: '📄 Other', icon: '📄', color: '#64748B', bg: 'rgba(100,116,139,0.15)' }
  ];

  const classesList = [
    'All Classes',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'ADCA Computer Diploma'
  ];

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else {
      headers['x-user-role'] = userRole;
      if (user?.studentId) headers['x-student-id'] = user.studentId;
    }
    return headers;
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedClass, selectedType, currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = `http://localhost:5000/api/calendar?`;
      const params = new URLSearchParams();
      if (selectedClass && selectedClass !== 'All Classes') params.append('className', selectedClass);
      if (selectedType && selectedType !== 'All') params.append('eventType', selectedType);

      url += params.toString();

      const response = await fetch(url, { headers: getHeaders() });
      const data = await response.json();

      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setErrorMsg('Failed to load academic calendar events.');
    } finally {
      setLoading(false);
    }
  };

  // Add Calendar Event (Admin Only)
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.eventDate) {
      setErrorMsg('Event title and date are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/calendar', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newEvent)
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Academic event published successfully!');
        setShowAddModal(false);
        setNewEvent({
          title: '',
          description: '',
          eventDate: '2026-09-15',
          startTime: '10:00 AM',
          endTime: '01:00 PM',
          eventType: '🌴 Holiday',
          targetClass: 'All Classes',
          status: 'PUBLISHED'
        });
        fetchEvents();
      } else {
        setErrorMsg(data.message || 'Failed to publish event.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to server.');
    }
  };

  // Delete Calendar Event (Admin Only)
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to remove this event from the calendar?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/calendar/${eventId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        fetchEvents();
      } else {
        alert(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      alert('Error deleting event.');
    }
  };

  // Month navigation helpers
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '6px', display: 'inline-block' }}>ACADEMIC SCHEDULE</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Academy Calendar & Holidays</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Official dates for exams, holidays, parent meetings, and academy events.
          </p>
        </div>

        {canManage && userRole === 'ADMIN' && (
          <button className="btn-crimson" onClick={() => setShowAddModal(true)} style={{ fontSize: '0.88rem', padding: '8px 16px' }}>
            <Plus size={18} /> <span>Add New Calendar Event</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Month Selector Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={prevMonth} className="btn-outline" style={{ padding: '6px 12px' }} title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, minWidth: '180px', textAlign: 'center' }}>
              {currentMonthName} {currentYear}
            </h3>
            <button onClick={nextMonth} className="btn-outline" style={{ padding: '6px 12px' }} title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Class Filter Dropdown */}
          <div style={{ minWidth: '160px' }}>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="search-input" style={{ height: '38px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
              {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
        </div>

        {/* Event Type Filter Badges */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {eventTypes.map(t => (
            <button
              key={t.label}
              onClick={() => setSelectedType(t.label)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '0.76rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: selectedType === t.label ? '1px solid var(--brand-crimson)' : '1px solid var(--border-color)',
                background: selectedType === t.label ? 'rgba(230,57,70,0.18)' : 'var(--bg-glass)',
                color: selectedType === t.label ? 'var(--brand-crimson)' : 'var(--text-primary)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid / List View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <CalendarIcon size={32} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px' }} />
          <div>Loading calendar events...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '18px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <CalendarIcon size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Events Scheduled for This Selection</h3>
          <p style={{ fontSize: '0.84rem', marginTop: '4px' }}>Check back soon or select another month / class filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '18px' }}>
          {events.map(ev => {
            const typeConfig = eventTypes.find(t => t.label === ev.eventType) || eventTypes[eventTypes.length - 1];
            return (
              <div key={ev.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>
                <div>
                  {/* Top Type & Class Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', background: typeConfig.bg, color: typeConfig.color, fontWeight: 800, fontSize: '0.74rem' }}>
                      {ev.eventType}
                    </span>

                    <span className="badge-crimson" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      {ev.targetClass || 'All Classes'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.4 }}>
                    {ev.title}
                  </h4>
                  {ev.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {ev.description}
                    </p>
                  )}
                </div>

                {/* Date & Time Footer Row */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-gold)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarIcon size={15} />
                      <span>{ev.eventDate}</span>
                    </div>

                    {(ev.startTime || ev.endTime) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                        <Clock size={14} />
                        <span>{ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''}</span>
                      </div>
                    )}
                  </div>

                  {canManage && userRole === 'ADMIN' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button
                        className="btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.72rem', borderColor: '#EF4444', color: '#FCA5A5' }}
                        onClick={() => handleDeleteEvent(ev.id)}
                      >
                        <Trash2 size={13} /> Delete Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Calendar Event Modal (Admin Only) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Add Academic Calendar Event</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Board Examinations Start"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Event Date *</label>
                  <input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    required
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Event Type</label>
                  <select
                    value={newEvent.eventType}
                    onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                  >
                    {eventTypes.filter(t => t.label !== 'All').map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Start Time (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={newEvent.startTime}
                    onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>End Time (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 01:00 PM"
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Target Class</label>
                <select
                  value={newEvent.targetClass}
                  onChange={e => setNewEvent({ ...newEvent, targetClass: e.target.value })}
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                >
                  {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Description</label>
                <textarea
                  placeholder="Details about this academic event..."
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="search-input"
                  style={{ minHeight: '60px', padding: '8px', fontSize: '0.85rem', marginTop: '4px' }}
                ></textarea>
              </div>

              <button className="btn-crimson" type="submit" style={{ justifyContent: 'center', marginTop: '8px', height: '40px' }}>
                Publish Event to Calendar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
