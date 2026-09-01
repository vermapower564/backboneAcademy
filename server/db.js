import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial data structure for Backbone Academy Management System
const initialData = {
  users: [
    { id: 1, name: "Academy Director", email: "admin@backbone.edu", password: "$2b$10$j0GZ/M0hU/9X4NlvdWEnwuUYknS.aeEggupFJvfMsyhdttGJdxqFW", role: "ADMIN", createdAt: "2026-08-01T00:00:00.000Z" },
    { id: 2, name: "Rahul Verma Sir", email: "rahul@backbone.edu", password: "$2b$10$j0GZ/M0hU/9X4NlvdWEnwuUYknS.aeEggupFJvfMsyhdttGJdxqFW", role: "TEACHER", createdAt: "2026-08-01T00:00:00.000Z" },
    { id: 3, name: "Aarav Kumar", email: "aarav@backbone.edu", password: "$2b$10$j0GZ/M0hU/9X4NlvdWEnwuUYknS.aeEggupFJvfMsyhdttGJdxqFW", role: "STUDENT", studentId: "STU-2026-001", createdAt: "2026-08-01T00:00:00.000Z" }
  ],
  students: [
    { id: 1, studentId: "STU-2026-001", name: "Aarav Kumar", dob: "2012-05-14", gender: "Male", parentName: "Sanjay Kumar", mobile: "9304868696", email: "aarav@backbone.edu", address: "Pandra, Ranchi", programType: "SCHOOL_CLASS", className: "Class 10", board: "CBSE", course: "Class 5th to 10th Academics", batch: "Morning (8:00 AM - 11:00 AM)", admissionDate: "2026-04-10", status: "ACTIVE" },
    { id: 2, studentId: "STU-2026-002", name: "Priya Sharma", dob: "2013-09-22", gender: "Female", parentName: "Rajesh Sharma", mobile: "8228931077", email: "priya@gmail.com", address: "Hehal, Ranchi", programType: "SCHOOL_CLASS", className: "Class 9", board: "ICSE", course: "Class 5th to 10th Academics", batch: "Evening (4:00 PM - 7:00 PM)", admissionDate: "2026-04-12", status: "ACTIVE" },
    { id: 3, studentId: "STU-2026-003", name: "Rohan Verma", dob: "2008-01-30", gender: "Male", parentName: "Manoj Verma", mobile: "9123456789", email: "rohan@gmail.com", address: "Ratu Road, Ranchi", programType: "COMPUTER_COURSE", className: "ADCA", board: "Autonomous Diploma", course: "ADCA (Advanced Diploma in Computer Applications)", batch: "Evening (4:00 PM - 7:00 PM)", admissionDate: "2026-05-01", status: "ACTIVE" },
    { id: 4, studentId: "STU-2026-004", name: "Amit Kumar", dob: "2009-11-12", gender: "Male", parentName: "Vijay Kumar", mobile: "9431109988", email: "amit@gmail.com", address: "Kanke, Ranchi", programType: "COMPUTER_COURSE", className: "Tally Prime GST", board: "GST Accounting Cert", course: "Tally Prime GST", batch: "Morning (8:00 AM - 11:00 AM)", admissionDate: "2026-06-15", status: "ACTIVE" }
  ],
  teachers: [
    { id: 1, teacherId: "TCH-2026-001", name: "Rahul Verma Sir", photo: "/logo.jpg", mobile: "9304868696", email: "rahul@backbone.edu", subjects: ["Mathematics", "Science", "Computer Fundamentals"], classes: ["Class 9", "Class 10", "ADCA", "DCA"], joiningDate: "2024-01-15", status: "ACTIVE" },
    { id: 2, teacherId: "TCH-2026-002", name: "Subham Pandey Sir", photo: "/logo.jpg", mobile: "8228931077", email: "subham@backbone.edu", subjects: ["Social Studies", "Hindi", "JNVST Mental Ability"], classes: ["Class 5", "Class 6", "Class 7"], joiningDate: "2024-06-01", status: "ACTIVE" },
    { id: 3, teacherId: "TCH-2026-003", name: "Roushan Verma Sir", photo: "/logo.jpg", mobile: "9123456780", email: "roushan@backbone.edu", subjects: ["Tally Accounting", "GST Vouchers", "DTP Photoshop"], classes: ["DTP", "Tally Prime GST", "Typing"], joiningDate: "2025-02-10", status: "ACTIVE" }
  ],
  attendance: [
    { id: 1, studentId: "STU-2026-001", className: "Class 10", date: "2026-08-28", status: "PRESENT", markedBy: "Rahul Verma Sir" },
    { id: 2, studentId: "STU-2026-001", className: "Class 10", date: "2026-08-29", status: "PRESENT", markedBy: "Rahul Verma Sir" },
    { id: 3, studentId: "STU-2026-001", className: "Class 10", date: "2026-08-30", status: "PRESENT", markedBy: "Rahul Verma Sir" },
    { id: 4, studentId: "STU-2026-002", className: "Class 9", date: "2026-08-30", status: "PRESENT", markedBy: "Subham Pandey Sir" },
    { id: 5, studentId: "STU-2026-003", className: "ADCA", date: "2026-08-30", status: "PRESENT", markedBy: "Rahul Verma Sir" },
    { id: 6, studentId: "STU-2026-004", className: "Tally Prime GST", date: "2026-08-30", status: "PRESENT", markedBy: "Roushan Verma Sir" }
  ],
  fees: [
    { id: 1, studentId: "STU-2026-001", studentName: "Aarav Kumar", className: "Class 10", totalAmount: 12000, paidAmount: 8000, pendingAmount: 4000, dueDate: "2026-09-10", paymentStatus: "PARTIAL", paymentDate: "2026-08-05", receiptNo: "REC-2026-101" },
    { id: 2, studentId: "STU-2026-002", studentName: "Priya Sharma", className: "Class 9", totalAmount: 10000, paidAmount: 10000, pendingAmount: 0, dueDate: "2026-08-15", paymentStatus: "PAID", paymentDate: "2026-08-10", receiptNo: "REC-2026-102" },
    { id: 3, studentId: "STU-2026-003", studentName: "Rohan Verma", className: "ADCA", totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, dueDate: "2026-09-15", paymentStatus: "PARTIAL", paymentDate: "2026-05-10", receiptNo: "REC-2026-103" },
    { id: 4, studentId: "STU-2026-004", studentName: "Amit Kumar", className: "Tally Prime GST", totalAmount: 6000, paidAmount: 6000, pendingAmount: 0, dueDate: "2026-07-01", paymentStatus: "PAID", paymentDate: "2026-06-15", receiptNo: "REC-2026-104" }
  ],
  exams: [
    { id: 1, examName: "Mid-Term Board Assessment 2026", className: "Class 10", subject: "Mathematics", maxMarks: 100, examDate: "2026-08-20" },
    { id: 2, examName: "Mid-Term Board Assessment 2026", className: "Class 10", subject: "Science", maxMarks: 100, examDate: "2026-08-22" },
    { id: 3, examName: "ADCA Practical Programming Evaluation", className: "ADCA", subject: "C++ & Computer Fundamentals", maxMarks: 100, examDate: "2026-08-25" }
  ],
  examResults: [
    { id: 1, examId: 1, studentId: "STU-2026-001", studentName: "Aarav Kumar", className: "Class 10", subject: "Mathematics", marksObtained: 94, maxMarks: 100, percentage: 94, grade: "A+" },
    { id: 2, examId: 2, studentId: "STU-2026-001", studentName: "Aarav Kumar", className: "Class 10", subject: "Science", marksObtained: 91, maxMarks: 100, percentage: 91, grade: "A+" },
    { id: 3, examId: 3, studentId: "STU-2026-003", studentName: "Rohan Verma", className: "ADCA", subject: "C++ & Computer Fundamentals", marksObtained: 88, maxMarks: 100, percentage: 88, grade: "A" }
  ],
  assignments: [
    { id: 1, title: "Quadratic Equations & Trigonometry Practice Sheet", description: "Solve all 25 numerical problems in your HW register.", subject: "Mathematics", className: "Class 10", dueDate: "2026-09-05", createdBy: "Rahul Verma Sir", fileUrl: "#" },
    { id: 2, title: "Tally Prime GST Invoice Creation Task", description: "Create 5 B2B GST sales vouchers in Tally Prime software.", subject: "Tally Accounting", className: "Tally Prime GST", dueDate: "2026-09-08", createdBy: "Roushan Verma Sir", fileUrl: "#" },
    { id: 3, title: "ADCA C++ Pointer & Structure Practical Exercise", description: "Write and execute C++ program for student database array.", subject: "C++ Programming", className: "ADCA", dueDate: "2026-09-12", createdBy: "Rahul Verma Sir", fileUrl: "#" }
  ],
  materials: [
    { id: 1, title: "Class 10 Physics - Light Reflection & Refraction Notes", category: "Notes", className: "Class 10", fileUrl: "#", uploadedBy: "Rahul Verma Sir", date: "Aug 15, 2026" },
    { id: 2, title: "ADCA Computer Fundamentals Complete Study PDF", category: "Study PDFs", className: "ADCA", fileUrl: "#", uploadedBy: "Rahul Verma Sir", date: "Aug 18, 2026" },
    { id: 3, title: "Tally Prime GST Invoice & Ledger Creation Vouchers", category: "GST Materials", className: "Tally Prime GST", fileUrl: "#", uploadedBy: "Roushan Verma Sir", date: "Aug 20, 2026" },
    { id: 4, title: "DTP Graphic Design CorelDraw & Photoshop Practical File", category: "Practical Files", className: "DTP", fileUrl: "#", uploadedBy: "Roushan Verma Sir", date: "Aug 22, 2026" }
  ],
  announcements: [
    { id: 1, title: "🎉 Special Independence Day Scholarship Test Results Out!", description: "Congratulations to all top rankers! Certificates & medals distributed at Pandra Ranchi campus.", targetClass: "All Classes", publishDate: "2026-08-16", expiryDate: "2026-09-15", status: "ACTIVE" },
    { id: 2, title: "📢 ADCA & Computer Diploma Practical Lab Timetable Updated", description: "Computer practical lab sessions for ADCA & DCA batches now available in Evening Slot (4-7 PM).", targetClass: "ADCA", publishDate: "2026-08-28", expiryDate: "2026-09-10", status: "ACTIVE" }
  ],
  demoBookings: [
    { id: 1, studentName: "Aarav Kumar", phone: "9304868696", course: "Class 5th to 10th Academics", timeSlot: "Morning (8:00 AM - 11:00 AM)", bookedAt: "2026-08-04T05:28:40.813Z" }
  ],
  reviews: [
    { id: 1, name: "Rohan Sharma", course: "Class 5th to 10th Academics", rating: 5, date: "Aug 01, 2026", comment: "Rahul Verma Sir explains Mathematics & Science concepts so clearly! Scored 94% in my exams." },
    { id: 2, name: "Priya Verma", course: "DCA (Diploma in Computer Applications)", rating: 5, date: "Jul 28, 2026", comment: "The DCA computer practical classes at Pandra Ranchi campus are 100% practical. Loved MS Excel & Typing!" },
    { id: 3, name: "Amit Kumar", course: "Navodaya Entrance (JNVST) Prep", rating: 5, date: "Jul 20, 2026", comment: "The JNVST mock OMR tests and mental ability coaching at Backbone Academy helped me get selected!" }
  ],
  contacts: [],
  passwordResets: [],
  calendarEvents: [
    {
      id: 1,
      title: "🌴 Teacher's Day Academy Celebration & Holiday",
      description: "Special event and afternoon holiday for Teacher's Day celebration.",
      eventDate: "2026-09-05",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      eventType: "🌴 Holiday",
      targetClass: "All Classes",
      status: "PUBLISHED",
      createdBy: "Academy Director",
      createdAt: "2026-08-25T00:00:00.000Z"
    },
    {
      id: 2,
      title: "📝 Class 10 Mid-Term Mathematics Board Exam",
      description: "Mid-term comprehensive exam covering Algebra & Geometry chapters.",
      eventDate: "2026-09-12",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      eventType: "📝 Exam",
      targetClass: "Class 10",
      status: "PUBLISHED",
      createdBy: "Rahul Verma Sir",
      createdAt: "2026-08-28T00:00:00.000Z"
    },
    {
      id: 3,
      title: "👨‍👩‍👧 Parent-Teacher Meeting (PTM)",
      description: "Discussion on mid-term performance and individual progress cards.",
      eventDate: "2026-09-20",
      startTime: "10:00 AM",
      endTime: "02:00 PM",
      eventType: "👨‍👩‍👧 Parent Meeting",
      targetClass: "Class 10",
      status: "PUBLISHED",
      createdBy: "Academy Director",
      createdAt: "2026-08-30T00:00:00.000Z"
    }
  ],
  notifications: [
    {
      id: 1,
      studentId: "STU-2026-001",
      targetClass: "Class 10",
      type: "New assignment",
      title: "📘 New Assignment Published: Physics Light Numerical Set",
      message: "Rahul Verma Sir published a new homework assignment due on Sep 10, 2026.",
      isRead: false,
      relatedId: "1",
      createdAt: "2026-08-30T10:00:00.000Z"
    },
    {
      id: 2,
      studentId: "STU-2026-001",
      targetClass: "Class 10",
      type: "Fee reminder",
      title: "🧾 Fee Payment Receipt Updated",
      message: "Payment receipt #REC-2026-101 of ₹8,000 has been recorded for your account.",
      isRead: false,
      relatedId: "101",
      createdAt: "2026-08-28T14:30:00.000Z"
    },
    {
      id: 3,
      targetClass: "All Classes",
      type: "Holiday/calendar update",
      title: "🌴 Teacher's Day Celebration & Holiday Notice",
      message: "Academy will remain open till 1:00 PM on Sep 05 for Teacher's Day function.",
      isRead: true,
      relatedId: "1",
      createdAt: "2026-08-25T09:00:00.000Z"
    }
  ]
};

// Initialize JSON database if it doesn't exist or update missing keys
export function initDB() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const existing = JSON.parse(raw);
    let updated = false;

    for (const key of Object.keys(initialData)) {
      if (!existing[key] || !Array.isArray(existing[key])) {
        existing[key] = initialData[key];
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    }
  } catch (err) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Read database
export function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return initialData;
  }
}

// Write database
export function writeDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
