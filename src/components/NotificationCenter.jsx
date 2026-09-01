import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, FileText, BookOpen, Calendar, DollarSign, MessageSquare, AlertCircle, Plus, X, RefreshCw, Volume2, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig.js';

export default function NotificationCenter({ user, isDropdown = false, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [showSendModal, setShowSendModal] = useState(false);

  // Send Form State (Admin & Teacher)
  const [newNotif, setNewNotif] = useState({
    title: '',
    message: '',
    type: 'Important academy notice',
    targetClass: 'All Classes'
  });

  const userRole = (user?.role || 'GUEST').toUpperCase();
  const canSendNotif = userRole === 'ADMIN' || userRole === 'TEACHER';

  const typesList = [
    'All',
    'New assignment',
    'New study PDF',
    'New message',
    'New announcement',
    'Exam schedule/update',
    'Holiday/calendar update',
    'Fee reminder',
    'Important academy notice'
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
    fetchNotifications();
  }, [selectedType]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/notifications?`;
      if (selectedType && selectedType !== 'All') url += `type=${encodeURIComponent(selectedType)}`;

      const response = await fetch(url, { headers: getHeaders() });
      const data = await response.json();

      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (notifId) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: getHeaders()
      });

      setNotifications(prev => prev.map(n => String(n.id) === String(notifId) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: getHeaders()
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Broadcast Notification (Admin & Teacher)
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newNotif)
      });

      const data = await response.json();
      if (data.success) {
        setShowSendModal(false);
        setNewNotif({
          title: '',
          message: '',
          type: 'Important academy notice',
          targetClass: 'All Classes'
        });
        fetchNotifications();
      } else {
        alert(data.message || 'Failed to send notification.');
      }
    } catch (err) {
      alert('Error sending notification.');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'New assignment': return <BookOpen size={16} color="var(--brand-gold)" />;
      case 'New study PDF': return <FileText size={16} color="#06B6D4" />;
      case 'New message': return <MessageSquare size={16} color="#A855F7" />;
      case 'Fee reminder': return <DollarSign size={16} color="#22C55E" />;
      case 'Exam schedule/update': return <Calendar size={16} color="var(--brand-crimson)" />;
      case 'Holiday/calendar update': return <Calendar size={16} color="#EF4444" />;
      default: return <Bell size={16} color="var(--brand-gold)" />;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Dropdown Header or Main Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell color="var(--brand-gold)" size={20} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Notifications {unreadCount > 0 && <span style={{ background: 'var(--brand-crimson)', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', marginLeft: '6px' }}>{unreadCount} UNREAD</span>}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {unreadCount > 0 && (
            <button className="btn-outline" onClick={handleMarkAllAsRead} style={{ padding: '4px 10px', fontSize: '0.76rem', gap: '4px' }}>
              <CheckCheck size={14} /> <span>Mark All Read</span>
            </button>
          )}

          {canSendNotif && (
            <button className="btn-crimson" onClick={() => setShowSendModal(true)} style={{ padding: '4px 10px', fontSize: '0.76rem', gap: '4px' }}>
              <Plus size={14} /> <span>Send Notice</span>
            </button>
          )}

          {isDropdown && onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Badges */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {typesList.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            style={{
              padding: '4px 10px',
              borderRadius: '14px',
              fontSize: '0.72rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: selectedType === t ? '1px solid var(--brand-crimson)' : '1px solid var(--border-color)',
              background: selectedType === t ? 'rgba(230,57,70,0.18)' : 'var(--bg-glass)',
              color: selectedType === t ? 'var(--brand-crimson)' : 'var(--text-primary)'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.82rem' }}>Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Bell size={36} style={{ opacity: 0.4, margin: '0 auto 8px' }} />
          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>No Notifications Available</div>
          <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>You are all caught up!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: isDropdown ? '340px' : 'none', overflowY: isDropdown ? 'auto' : 'visible' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              className="glass-panel"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--brand-crimson)',
                background: n.isRead ? 'var(--bg-glass)' : 'rgba(230,57,70,0.06)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <div style={{ marginTop: '2px' }}>{getTypeIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-primary)' }}>{n.title}</span>
                    <span className="badge-crimson" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{n.targetClass || 'All Classes'}</span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {n.message}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-gold)', cursor: 'pointer', padding: '2px' }}
                  title="Mark as Read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Notification Modal (Admin & Teacher Only) */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Broadcast Notification</h3>
              <button onClick={() => setShowSendModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Title *</label>
                <input
                  type="text"
                  placeholder="Notification title..."
                  value={newNotif.title}
                  onChange={e => setNewNotif({ ...newNotif, title: e.target.value })}
                  required
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Type</label>
                <select
                  value={newNotif.type}
                  onChange={e => setNewNotif({ ...newNotif, type: e.target.value })}
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                >
                  {typesList.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Target Class</label>
                <select
                  value={newNotif.targetClass}
                  onChange={e => setNewNotif({ ...newNotif, targetClass: e.target.value })}
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                >
                  {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Message Body *</label>
                <textarea
                  placeholder="Write notice message..."
                  value={newNotif.message}
                  onChange={e => setNewNotif({ ...newNotif, message: e.target.value })}
                  required
                  className="search-input"
                  style={{ minHeight: '70px', padding: '8px', fontSize: '0.85rem', marginTop: '4px' }}
                ></textarea>
              </div>

              <button className="btn-crimson" type="submit" style={{ justifyContent: 'center', marginTop: '6px', height: '40px' }}>
                Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
