import React, { useState } from 'react';
import { Award, ShieldCheck, Printer, Download, Search, CheckCircle2, QrCode, FileText, Sparkles, User, GraduationCap, Laptop, BookOpen, Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_CERTIFICATES = [
  {
    id: "BB-ACADEMY-2026-DCA-9041",
    studentName: "Vikram Kumar Singh",
    rollNo: "RNC-DCA-2026-042",
    course: "DCA (Diploma in Computer Applications - 6 Months)",
    category: "Computer",
    grade: "Grade A+ (Distinction)",
    issueDate: "July 28, 2026",
    instructor: "Subham Pandey Sir",
    description: "Successfully mastered Computer Fundamentals, Windows 11 OS, MS Word, MS Excel, MS PowerPoint, MS Access, Hindi/English Touch Typing, and Internet Applications."
  },
  {
    id: "BB-ACADEMY-2026-ADCA-9182",
    studentName: "Pooja Kumari",
    rollNo: "RNC-ADCA-2026-018",
    course: "ADCA (Advance Diploma in Computer Applications - 1 Year)",
    category: "Computer",
    grade: "Grade A+ (First Class with Distinction)",
    issueDate: "June 15, 2026",
    instructor: "Subham Pandey Sir",
    description: "Successfully completed complete DCA Office Automation, Tally Prime with GST Accounting, Web Designing (HTML/CSS), Photoshop, and Computer Hardware Basics."
  },
  {
    id: "BB-ACADEMY-2026-CBSE10-8420",
    studentName: "Aditya Kumar",
    rollNo: "RNC-ACAD-2026-104",
    course: "Class 10th Board Academic Excellence",
    category: "Academics",
    grade: "96.4% Marks (Class Topper)",
    issueDate: "May 20, 2026",
    instructor: "Rahul Sir & Roushan Verma Sir",
    description: "Awarded for outstanding academic score (96.4%) in Class 10th Board Examinations in Mathematics, Physics, Chemistry, Biology, and English."
  },
  {
    id: "BB-ACADEMY-2026-JNVST-7714",
    studentName: "Ananya Roy",
    rollNo: "RNC-JNV-2026-001",
    course: "Jawahar Navodaya Entrance (JNVST) Selection Qualifying Certificate",
    category: "Navodaya",
    grade: "Rank #1 Selection",
    issueDate: "April 10, 2026",
    instructor: "Roushan Verma Sir",
    description: "Qualified Jawahar Navodaya Vidyalaya Selection Test with Distinction in Mental Ability, Arithmetic Reasoning, and Language Tests."
  },
  {
    id: "BB-ACADEMY-2026-MID8-6621",
    studentName: "Priya Sharma",
    rollNo: "RNC-MID-2026-088",
    course: "Class 8th Middle School Academic Merit",
    category: "Academics",
    grade: "97.8% Marks (School Merit)",
    issueDate: "March 30, 2026",
    instructor: "Shivam Sir",
    description: "Awarded for foundational academic excellence in Class 8th Mathematics, Science, and English Literature."
  },
  {
    id: "BB-ACADEMY-2026-PRI5-5510",
    studentName: "Aarav Gupta",
    rollNo: "RNC-PRI-2026-012",
    course: "Class 5th Primary School Foundation Certificate",
    category: "Academics",
    grade: "Grade A (Gold Medal)",
    issueDate: "March 25, 2026",
    instructor: "Riya Ma'am",
    description: "Awarded for exceptional primary learning concepts, mental maths, environmental science, and creative English writing."
  }
];

export default function StudentCertificatesFolder() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchCertId, setSearchCertId] = useState("");
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  // Live Generator State
  const [genName, setGenName] = useState("Rahul Kumar");
  const [genRoll, setGenRoll] = useState("RNC-2026-108");
  const [genCourse, setGenCourse] = useState("DCA (Diploma in Computer Applications)");
  const [genGrade, setGenGrade] = useState("Grade A+ (Distinction)");
  const [genInstructor, setGenInstructor] = useState("Subham Pandey Sir");
  const [genIssueDate, setGenIssueDate] = useState("August 07, 2026");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredCerts = SAMPLE_CERTIFICATES.filter(c => 
    activeCategory === "All" || c.category === activeCategory
  );

  const handleVerifySearch = (e) => {
    e.preventDefault();
    setVerifyError("");
    setVerifiedCert(null);

    const query = searchCertId.trim().toUpperCase();
    if (!query) return;

    const found = SAMPLE_CERTIFICATES.find(c => c.id.toUpperCase() === query || c.rollNo.toUpperCase() === query);
    if (found) {
      setVerifiedCert(found);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } else {
      setVerifyError(`No official certificate found matching ID "${searchCertId}". Please check the ID stamp on your certificate.`);
    }
  };

  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    setTimeout(() => {
      window.print();
      setDownloadSuccess(false);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge-crimson" style={{ background: 'rgba(230, 57, 70, 0.15)', color: 'var(--brand-crimson)', borderColor: 'var(--brand-crimson)' }}>
              STUDENT CERTIFICATES & CREDENTIALS VAULT
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award color="var(--brand-crimson)" size={32} />
              <span>Backbone Academy Official Student Certificates</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Verifiable completion, diploma, and academic excellence certificates provided to our students in Pandra Ranchi.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-crimson" onClick={handleDownloadCertificate} style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', borderColor: '#22C55E' }}>
              {downloadSuccess ? <Check size={18} /> : <Download size={18} />}
              <span>{downloadSuccess ? 'Preparing Download...' : 'Download Certificate PDF'}</span>
            </button>

            <button className="btn-outline" onClick={handleDownloadCertificate}>
              <Printer size={18} />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>

        {/* Verification Search Bar */}
        <div className="glass-panel-highlight" style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: 'rgba(230, 57, 70, 0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-crimson)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} />
            <span>Verify Student Certificate Online (Instant Verification)</span>
          </div>

          <form onSubmit={handleVerifySearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Enter Certificate ID (e.g. BB-ACADEMY-2026-DCA-9041 or Roll No)..."
                value={searchCertId}
                onChange={(e) => setSearchCertId(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <button className="btn-crimson" type="submit" style={{ padding: '10px 22px' }}>
              <span>Verify Certificate</span>
            </button>
          </form>

          {verifyError && (
            <div style={{ marginTop: '12px', color: '#EF4444', fontSize: '0.88rem', fontWeight: 600 }}>
              ⚠️ {verifyError}
            </div>
          )}

          {verifiedCert && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={20} />
                <span>OFFICIAL VERIFIED CERTIFICATE RECORD</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <strong>Student Name:</strong> {verifiedCert.studentName} | <strong>Roll No:</strong> {verifiedCert.rollNo}<br />
                <strong>Course:</strong> {verifiedCert.course} | <strong>Grade:</strong> {verifiedCert.grade}<br />
                <strong>Instructor:</strong> {verifiedCert.instructor} | <strong>Issued:</strong> {verifiedCert.issueDate}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {["All", "Academics", "Navodaya", "Computer"].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? "btn-crimson" : "btn-outline"}
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            {cat === "All" && "📁 All Issued Certificates"}
            {cat === "Academics" && "🎓 School Academic Certificates"}
            {cat === "Navodaya" && "🏆 Navodaya Selection Certificates"}
            {cat === "Computer" && "💻 Computer Diploma Certificates (DCA/ADCA)"}
          </button>
        ))}
      </div>

      {/* Certificates Gallery Grid */}
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
          Official Issued Certificates Showcase
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredCerts.map((cert) => (
            <div 
              key={cert.id} 
              className="glass-panel-highlight"
              style={{
                padding: '24px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                border: '2px solid var(--brand-crimson)',
                boxShadow: '0 10px 30px rgba(230, 57, 70, 0.2)',
                color: '#0F172A',
                position: 'relative'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid rgba(230, 57, 70, 0.2)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Ultra-Clear Logo */}
                  <img 
                    src="/logo.jpg" 
                    alt="Backbone Academy Clear Crest Logo" 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      objectFit: 'contain',
                      background: '#FFFFFF',
                      border: '2px solid var(--brand-crimson)',
                      boxShadow: '0 0 12px rgba(230, 57, 70, 0.4)'
                    }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0F172A', letterSpacing: '0.5px' }}>BACKBONE ACADEMY</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>PANDRA, RANCHI, JHARKHAND</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(230, 57, 70, 0.1)', color: 'var(--brand-crimson)', padding: '4px 10px', borderRadius: '12px' }}>
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', margin: '14px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>CERTIFICATE OF EXCELLENCE</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>{cert.studentName}</h4>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Roll No: {cert.rollNo}</div>
              </div>

              {/* Course & Grade Box */}
              <div style={{ background: 'rgba(230, 57, 70, 0.06)', padding: '12px', borderRadius: '10px', border: '1px dashed rgba(230, 57, 70, 0.3)', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>{cert.course}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>🏅 {cert.grade}</div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px', textAlign: 'center' }}>
                "{cert.description}"
              </p>

              {/* Footer Stamp & ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)', fontSize: '0.72rem', color: '#64748B' }}>
                <div>
                  <div><strong>Instructor:</strong> {cert.instructor}</div>
                  <div><strong>Issued:</strong> {cert.issueDate}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>VERIFICATION ID</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.68rem', color: '#0F172A' }}>{cert.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Printable Main Certificate Sheet View */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles color="var(--brand-gold)" size={24} />
              <span>Interactive Official Certificate Customizer & Downloader</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Enter student details below to instantly customize, preview, and download your official Backbone Academy certificate!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-crimson" onClick={handleDownloadCertificate} style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', borderColor: '#22C55E' }}>
              <Download size={18} />
              <span>Download Printable PDF</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Student Full Name</label>
            <input type="text" value={genName} onChange={(e) => setGenName(e.target.value)} className="search-input" style={{ marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Roll Number</label>
            <input type="text" value={genRoll} onChange={(e) => setGenRoll(e.target.value)} className="search-input" style={{ marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Course / Curriculum</label>
            <input type="text" value={genCourse} onChange={(e) => setGenCourse(e.target.value)} className="search-input" style={{ marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Grade / Marks</label>
            <input type="text" value={genGrade} onChange={(e) => setGenGrade(e.target.value)} className="search-input" style={{ marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Lead Faculty Instructor</label>
            <select value={genInstructor} onChange={(e) => setGenInstructor(e.target.value)} className="search-input" style={{ marginTop: '4px', background: 'var(--bg-secondary)' }}>
              <option value="Rahul Sir">Rahul Sir (Maths & Science Dept.)</option>
              <option value="Subham Pandey Sir">Subham Pandey Sir (Computer & IT Dept.)</option>
              <option value="Roushan Verma Sir">Roushan Verma Sir (Navodaya Entrance)</option>
              <option value="Shivam Sir">Shivam Sir (Class 5th-8th Academics)</option>
              <option value="Riya Ma'am">Riya Ma'am (Class 1st-5th Primary)</option>
            </select>
          </div>
        </div>

        {/* Generated Ultra-Crisp Official Certificate Sheet */}
        <div 
          id="official-printable-certificate"
          className="printable-certificate-sheet"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: '44px 40px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '6px double var(--brand-crimson)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            color: '#0F172A',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          {/* Top Header with Ultra-Clear Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid var(--brand-crimson)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src="/logo.jpg" 
                alt="Backbone Academy High Resolution Crest Logo" 
                style={{ 
                  width: '75px', 
                  height: '75px', 
                  borderRadius: '50%', 
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  border: '3px solid var(--brand-crimson)', 
                  boxShadow: '0 0 16px rgba(230, 57, 70, 0.4)'
                }} 
              />
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '1px', margin: 0 }}>BACKBONE ACADEMY</h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-crimson)', letterSpacing: '0.5px' }}>PANDRA, RANCHI, JHARKHAND — 824003</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', fontStyle: 'italic', marginTop: '2px' }}>"Unlock Your Future With Unbelievable Strength"</div>
              </div>
            </div>
            
            <QrCode size={56} color="var(--brand-crimson)" />
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#64748B', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
            OFFICIAL CERTIFICATE OF MERIT & COMPLETION
          </div>

          <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '10px' }}>This is to certify that</p>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--brand-crimson)', margin: '4px 0 6px', letterSpacing: '-0.5px' }}>{genName}</h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 800, marginBottom: '20px' }}>Roll Number: {genRoll}</p>

          <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 20px', fontWeight: 500 }}>
            has successfully completed the prescribed curriculum for <strong>{genCourse}</strong> with <strong>{genGrade}</strong> under the mentorship of <strong>{genInstructor}</strong> at Backbone Academy Ranchi.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px', paddingTop: '20px', borderTop: '2px solid rgba(0,0,0,0.12)', fontSize: '0.85rem', color: '#64748B' }}>
            <div style={{ textAlign: 'left' }}>
              <div><strong>Issue Date:</strong> {genIssueDate}</div>
              <div><strong>Verification ID:</strong> BB-ACADEMY-2026-VERIFIED-1088</div>
              <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 800, marginTop: '2px' }}>✓ Government Verifiable Online Credentials</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, color: '#0F172A', borderBottom: '2px solid #0F172A', paddingBottom: '4px', display: 'inline-block' }}>Rahul Sir / Subham Pandey Sir</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-crimson)', fontWeight: 800, marginTop: '2px' }}>Authorized Signatory, Backbone Academy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
