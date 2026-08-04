import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial data structure
const initialData = {
  users: [
    { id: 1, name: "Student Demo", email: "student@backbone.edu", password: "password123", createdAt: new Date().toISOString() }
  ],
  demoBookings: [
    { id: 1, studentName: "Aarav Kumar", phone: "9304868696", course: "Class 5th to 10th Academics", timeSlot: "Morning (8:00 AM - 11:00 AM)", bookedAt: new Date().toISOString() }
  ],
  reviews: [
    { id: 1, name: "Rohan Sharma", course: "Class 5th to 10th Academics", rating: 5, date: "Aug 01, 2026", comment: "Rahul Verma Sir explains Mathematics & Science concepts so clearly! Scored 94% in my exams." },
    { id: 2, name: "Priya Verma", course: "DCA (Diploma in Computer Applications)", rating: 5, date: "Jul 28, 2026", comment: "The DCA computer practical classes at Pandra Ranchi campus are 100% practical. Loved MS Excel & Typing!" },
    { id: 3, name: "Amit Kumar", course: "Navodaya Entrance (JNVST) Prep", rating: 5, date: "Jul 20, 2026", comment: "The JNVST mock OMR tests and mental ability coaching at Backbone Academy helped me get selected!" }
  ],
  contacts: []
};

// Initialize JSON database if it doesn't exist
export function initDB() {
  if (!fs.existsSync(DATA_FILE)) {
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
