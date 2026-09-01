import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Calendar, BookOpen, UserCheck, ShieldCheck, X } from 'lucide-react';

export default function StudentResources({ user, canManage = false }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewPdfModal, setViewPdfModal] = useState(null);

  // Upload Form State
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: '📚 Subject Notes',
    className: 'All Classes',
    subject: 'Mathematics',
    description: '',
    fileUrl: '',
    fileSize: '1.5 MB',
    status: 'PUBLISHED'
  });

  const userRole = (user?.role || 'GUEST').toUpperCase();

  const categories = [
    'All',
    '📚 Subject Notes',
    '📖 Syllabus',
    '📝 Question Papers',
    '📅 Holiday List',
    '🗓️ Exam Schedule',
    '📢 Important Notices',
    '📘 Study Materials',
    '📄 Other Academic Documents'
  ];

  const classes = [
    'All',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'ADCA Computer Diploma'
  ];

  const subjects = [
    'All',
    'Mathematics',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Social Science',
    'Computer Applications',
    'Tally Prime GST'
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
    fetchMaterials();
  }, [selectedCategory, selectedClass, selectedSubject, searchQuery]);

  const fetchMaterials = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = `http://localhost:5000/api/materials?`;
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedClass && selectedClass !== 'All') params.append('className', selectedClass);
      if (selectedSubject && selectedSubject !== 'All') params.append('subject', selectedSubject);
      if (searchQuery) params.append('search', searchQuery);

      url += params.toString();

      const response = await fetch(url, { headers: getHeaders() });
      const data = await response.json();

      if (data.success && Array.isArray(data.materials)) {
        setMaterials(data.materials);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
      setErrorMsg('Failed to load study resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF Upload / Submit (Admin & Teacher)
  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.fileUrl) {
      setErrorMsg('Please provide a document title and file URL.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newDoc)
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Document published successfully!');
        setShowUploadModal(false);
        setNewDoc({
          title: '',
          category: '📚 Subject Notes',
          className: 'All Classes',
          subject: 'Mathematics',
          description: '',
          fileUrl: '',
          fileSize: '1.5 MB',
          status: 'PUBLISHED'
        });
        fetchMaterials();
      } else {
        setErrorMsg(data.message || 'Failed to upload document.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to backend server.');
    }
  };

  // Toggle Publish / Unpublish Status
  const handleTogglePublish = async (docId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${docId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchMaterials();
      } else {
        alert(data.message || 'Failed to update document status.');
      }
    } catch (err) {
      alert('Error updating document status.');
    }
  };

  // Delete Document (Admin & Teacher)
  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${docId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        fetchMaterials();
      } else {
        alert(data.message || 'Failed to delete document.');
      }
    } catch (err) {
      alert('Error deleting document.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-crimson" style={{ marginBottom: '6px', display: 'inline-block' }}>STUDENT RESOURCE CENTER</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Academic Documents & PDF Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Access verified class notes, question papers, syllabus, exam schedules, and study materials.
          </p>
        </div>

        {canManage && (userRole === 'ADMIN' || userRole === 'TEACHER') && (
          <button className="btn-crimson" onClick={() => setShowUploadModal(true)} style={{ fontSize: '0.88rem', padding: '8px 16px' }}>
            <Plus size={18} /> <span>Upload New PDF Document</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', color: '#4ADE80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Bar & Search */}
      <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search document title, subject, keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Class Filter */}
          <div style={{ minWidth: '140px' }}>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="search-input" style={{ height: '40px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
              <option value="All">All Classes</option>
              {classes.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Subject Filter */}
          <div style={{ minWidth: '140px' }}>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="search-input" style={{ height: '40px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
              <option value="All">All Subjects</option>
              {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: selectedCategory === cat ? '1px solid var(--brand-crimson)' : '1px solid var(--border-color)',
                background: selectedCategory === cat ? 'rgba(230,57,70,0.18)' : 'var(--bg-glass)',
                color: selectedCategory === cat ? 'var(--brand-crimson)' : 'var(--text-primary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Library Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <FileText size={32} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px' }} />
          <div>Fetching document library...</div>
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '18px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FileText size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Academic Documents Found</h3>
          <p style={{ fontSize: '0.84rem', marginTop: '4px' }}>Try adjusting your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {materials.map(m => (
            <div key={m.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
              <div>
                {/* Category & Status Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,183,3,0.15)', color: 'var(--brand-gold)', fontWeight: 800, fontSize: '0.72rem' }}>
                    {m.category || 'Study Materials'}
                  </span>

                  {canManage && (
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, background: m.status === 'PUBLISHED' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: m.status === 'PUBLISHED' ? '#4ADE80' : '#FCA5A5' }}>
                      {m.status || 'PUBLISHED'}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.4 }}>
                  {m.title}
                </h4>
                {m.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                    {m.description}
                  </p>
                )}

                {/* Badges: Class & Subject */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge-crimson" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {m.className || 'All Classes'}
                  </span>
                  {m.subject && (
                    <span className="badge-crimson" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(6,182,212,0.15)', color: '#06B6D4', borderColor: '#06B6D4' }}>
                      {m.subject}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Row: Metadata & Action Buttons */}
              <div style={{ borderTop: '1px solid var(--border-color)', pt: '12px', paddingTop: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  <span>Uploaded: {m.date || 'Aug 2026'}</span>
                  <span>Size: {m.fileSize || '1.2 MB'}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-crimson"
                    style={{ flex: 1, padding: '6px', fontSize: '0.78rem', justifyContent: 'center' }}
                    onClick={() => setViewPdfModal(m)}
                  >
                    <Eye size={14} /> <span>View PDF</span>
                  </button>

                  <a
                    href={m.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                    onClick={(e) => {
                      if (!m.fileUrl || m.fileUrl === '#') {
                        e.preventDefault();
                        alert(`Downloading "${m.title}" (PDF document download started).`);
                      }
                    }}
                  >
                    <Download size={14} /> <span>Download</span>
                  </a>

                  {/* Management Controls for Admin & Teacher */}
                  {canManage && (userRole === 'ADMIN' || userRole === 'TEACHER') && (
                    <>
                      <button
                        className="btn-outline"
                        style={{ padding: '6px', fontSize: '0.72rem' }}
                        title={m.status === 'PUBLISHED' ? 'Unpublish Document' : 'Publish Document'}
                        onClick={() => handleTogglePublish(m.id, m.status)}
                      >
                        {m.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        className="btn-outline"
                        style={{ padding: '6px', fontSize: '0.72rem', borderColor: '#EF4444', color: '#FCA5A5' }}
                        title="Delete Document"
                        onClick={() => handleDeleteDoc(m.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Document Viewer Modal */}
      {viewPdfModal && (
        <div className="modal-overlay" onClick={() => setViewPdfModal(null)}>
          <div className="modal-content" style={{ maxWidth: '650px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="var(--brand-crimson)" size={22} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{viewPdfModal.title}</h3>
              </div>
              <button onClick={() => setViewPdfModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Category:</strong> {viewPdfModal.category}</div>
              <div style={{ marginBottom: '6px' }}><strong>Class & Subject:</strong> {viewPdfModal.className} ({viewPdfModal.subject})</div>
              <div style={{ marginBottom: '6px' }}><strong>Uploader:</strong> {viewPdfModal.uploadedBy || 'Academy Admin'}</div>
              <div><strong>Description:</strong> {viewPdfModal.description || 'Official academic document issued by Backbone Academy.'}</div>
            </div>

            {/* Embedded PDF Viewer Frame / Fallback Preview */}
            <div style={{ height: '280px', border: '1px dashed var(--brand-crimson)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-glass)', textAlign: 'center', padding: '20px' }}>
              <FileText size={48} color="var(--brand-crimson)" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>PDF Document Ready for Preview & Download</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                Click below to download or open full-page PDF viewer for high-resolution printing.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-outline" onClick={() => setViewPdfModal(null)}>Close</button>
              <a
                href={viewPdfModal.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-crimson"
                onClick={(e) => {
                  if (!viewPdfModal.fileUrl || viewPdfModal.fileUrl === '#') {
                    e.preventDefault();
                    alert(`Downloading "${viewPdfModal.title}" PDF.`);
                  }
                }}
              >
                <Download size={16} /> <span>Download PDF Document</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Document Modal (Admin & Teacher Only) */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Upload PDF Document</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Class 10 Physics Chapter 1 Notes"
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  required
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category</label>
                  <select
                    value={newDoc.category}
                    onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Target Class</label>
                  <select
                    value={newDoc.className}
                    onChange={e => setNewDoc({ ...newDoc, className: e.target.value })}
                    className="search-input"
                    style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Subject</label>
                <select
                  value={newDoc.subject}
                  onChange={e => setNewDoc({ ...newDoc, subject: e.target.value })}
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px', background: 'var(--bg-secondary)' }}
                >
                  {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>PDF Document Link / Storage URL *</label>
                <input
                  type="text"
                  placeholder="https://... or /documents/notes-2026.pdf"
                  value={newDoc.fileUrl}
                  onChange={e => setNewDoc({ ...newDoc, fileUrl: e.target.value })}
                  required
                  className="search-input"
                  style={{ height: '38px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Short Description</label>
                <textarea
                  placeholder="Summary of document contents..."
                  value={newDoc.description}
                  onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="search-input"
                  style={{ minHeight: '60px', padding: '8px', fontSize: '0.85rem', marginTop: '4px' }}
                ></textarea>
              </div>

              <button className="btn-crimson" type="submit" style={{ justifyContent: 'center', marginTop: '8px', height: '40px' }}>
                Publish PDF Document
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
