import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCatalog from './components/CourseCatalog';
import CourseModal from './components/CourseModal';
import ComputerClasses from './components/ComputerClasses';
import FacultySection from './components/FacultySection';
import DemoClassModal from './components/DemoClassModal';
import ShareModal from './components/ShareModal';
import FloatingShareWidget from './components/FloatingShareWidget';
import FloatingWhatsAppWidget from './components/FloatingWhatsAppWidget';
import PracticeLab from './components/PracticeLab';
import Dashboard from './components/Dashboard';
import AboutSection from './components/AboutSection';
import AdmissionForm from './components/AdmissionForm';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import CertificateGenerator from './components/CertificateGenerator';
import Leaderboard from './components/Leaderboard';
import ContactSection from './components/ContactSection';
import ReviewSystem from './components/ReviewSystem';
import AuthModal from './components/AuthModal';
import WelcomePopUp from './components/WelcomePopUp';
import FAQSection from './components/FAQSection';
import StudentHallOfFame from './components/StudentHallOfFame';
import StudentCertificatesFolder from './components/StudentCertificatesFolder';
import Footer from './components/Footer';
import { Gift, Bell, PhoneCall } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('courses');
  const [theme, setTheme] = useState('light');
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [userXP, setUserXP] = useState(450);
  const [streakDays, setStreakDays] = useState(12);
  const [enrolledCourses, setEnrolledCourses] = useState(['navodaya-prep-101', 'dca-course']);

  // User & Modal states
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('LOGIN');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenAuth = (mode = 'LOGIN') => {
    setAuthModalMode(typeof mode === 'string' ? mode : 'LOGIN');
    setIsAuthOpen(true);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAddXP = (amount) => {
    setUserXP(prev => prev + amount);
  };

  const handleEnrollCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData?.role === 'ADMIN' || userData?.role === 'TEACHER' || userData?.role === 'STUDENT') {
      setActiveTab('portal');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('courses');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="main-bg-overlay"></div>

      {/* Top Announcement Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #E63946 0%, #B71C1C 100%)',
        color: '#FFFFFF',
        padding: '6px 16px',
        fontSize: '0.82rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        zIndex: 101
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={15} />
          <span>📢 <strong>Admissions Open 2026-27 at Pandra Ranchi Campus!</strong> Reserve 3 Days Free Trial Demo Classes with Rahul Verma Sir & Team.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a href="tel:9304868696" style={{ color: '#FFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PhoneCall size={14} />
            <span>+91 9304868696</span>
          </a>
          <button 
            onClick={() => setIsDemoModalOpen(true)} 
            style={{ background: '#FFB703', color: '#000', border: 'none', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Book Free Demo
          </button>
        </div>
      </div>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        userXP={userXP} 
        streakDays={streakDays} 
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      <main className="main-wrapper" style={{ flex: 1 }}>
        {activeTab === 'courses' && (
          <>
            <Hero 
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              onLabClick={() => setActiveTab('lab')} 
              onOpenDemoModal={() => setIsDemoModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onLoginSuccess={handleLoginSuccess}
              onOpenAuth={handleOpenAuth}
              user={user}
            />

            <div id="catalog-section">
              <CourseCatalog 
                onSelectCourse={(course) => setSelectedCourseModal(course)} 
                enrolledCourses={enrolledCourses} 
                onEnroll={handleEnrollCourse} 
              />
            </div>

            <div style={{ marginTop: '40px' }}>
              <FacultySection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
            </div>

            <StudentHallOfFame />

            <FAQSection />
          </>
        )}

        {activeTab === 'computer' && (
          <>
            <ComputerClasses onSelectCourse={(course) => setSelectedCourseModal(course)} />
            <FAQSection />
          </>
        )}

        {activeTab === 'about' && (
          <>
            <AboutSection />
            <FacultySection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
            <FAQSection />
          </>
        )}

        {activeTab === 'admission' && (
          <>
            <AdmissionForm />
            <FAQSection />
          </>
        )}

        {activeTab === 'faculty' && (
          <>
            <FacultySection onOpenDemoModal={() => setIsDemoModalOpen(true)} />
            <StudentHallOfFame />
          </>
        )}

        {activeTab === 'lab' && (
          <PracticeLab onAddXP={handleAddXP} />
        )}

        {activeTab === 'reviews' && (
          <>
            <ReviewSystem />
            <StudentHallOfFame />
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <ContactSection />
            <FAQSection />
          </>
        )}

        {(activeTab === 'dashboard' || activeTab === 'portal') && (
          user ? (
            user.role === 'ADMIN' ? (
              <AdminDashboard user={user} />
            ) : user.role === 'TEACHER' ? (
              <TeacherDashboard user={user} />
            ) : (
              <StudentDashboard user={user} onNavigate={setActiveTab} />
            )
          ) : (
            <Dashboard 
              userXP={userXP} 
              streakDays={streakDays} 
              enrolledCourses={enrolledCourses} 
              onNavigate={setActiveTab} 
            />
          )
        )}

        {(activeTab === 'certificates' || activeTab === 'certificate') && (
          <StudentCertificatesFolder />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard />
        )}
      </main>

      <CourseModal 
        course={selectedCourseModal} 
        onClose={() => setSelectedCourseModal(null)} 
        isEnrolled={selectedCourseModal ? enrolledCourses.includes(selectedCourseModal.id) : false} 
        onEnroll={handleEnrollCourse} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
        initialMode={authModalMode}
      />

      <DemoClassModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      <FloatingShareWidget 
        onOpenShareModal={() => setIsShareModalOpen(true)} 
      />

      <FloatingWhatsAppWidget />

      <WelcomePopUp 
        onClaimBonus={handleAddXP} 
      />

      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
