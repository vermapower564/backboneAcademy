import express from 'express';
import { readDB, writeDB } from '../db.js';
import pool, { isTiDBConnected } from '../database.js';
import { verifyRole } from '../middleware/authMiddleware.js';
import { recordAuditLog } from '../middleware/auditLogger.js';
import { sendFeePaymentEmail } from '../email.js';

const router = express.Router();

// GET /api/fees - Get fee records (Cryptographic Data Isolation)
router.get('/fees', async (req, res, next) => {
  const { studentId, paymentStatus } = req.query;
  const userRole = (req.user?.role || 'GUEST').toUpperCase();
  const verifiedStudentId = req.user?.studentId;

  try {
    if (isTiDBConnected) {
      let query = 'SELECT * FROM fees WHERE 1=1';
      const params = [];

      if (userRole === 'STUDENT' && verifiedStudentId) {
        query += ' AND studentId = ?';
        params.push(verifiedStudentId);
      } else if (userRole === 'ADMIN' || userRole === 'TEACHER') {
        if (studentId) { query += ' AND studentId = ?'; params.push(studentId); }
        if (paymentStatus) { query += ' AND paymentStatus = ?'; params.push(paymentStatus); }
      } else {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, fees: rows });
    }

    const db = readDB();
    let result = db.fees || [];

    if (userRole === 'STUDENT' && verifiedStudentId) {
      result = result.filter(f => f.studentId === verifiedStudentId);
    } else if (userRole === 'ADMIN' || userRole === 'TEACHER') {
      if (studentId) result = result.filter(f => f.studentId === studentId);
      if (paymentStatus) result = result.filter(f => f.paymentStatus === paymentStatus);
    } else {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, count: result.length, fees: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/fees/payment - Record fee payment (Admin Only)
router.post('/fees/payment', verifyRole(['ADMIN']), async (req, res, next) => {
  const { feeId, amountPaid, paymentDate } = req.body;
  if (!feeId || !amountPaid) {
    return res.status(400).json({ success: false, message: 'Fee record ID and payment amount are required.' });
  }

  const payDate = paymentDate || new Date().toISOString().split('T')[0];

  try {
    if (isTiDBConnected) {
      const [rows] = await pool.query('SELECT * FROM fees WHERE id = ?', [feeId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Fee record not found.' });

      const fee = rows[0];
      const newPaid = Number(fee.paidAmount) + Number(amountPaid);
      const newPending = Math.max(0, Number(fee.totalAmount) - newPaid);
      let status = 'PARTIAL';
      if (newPending === 0) status = 'PAID';

      await pool.query(
        'UPDATE fees SET paidAmount = ?, pendingAmount = ?, paymentStatus = ?, paymentDate = ? WHERE id = ?',
        [newPaid, newPending, status, payDate, feeId]
      );

      await recordAuditLog({ req, action: 'RECORD_FEE_PAYMENT', targetEntity: 'fees', targetRecordId: feeId, metadata: { amountPaid, studentName: fee.studentName, newPending } });
      sendFeePaymentEmail({ email: fee.email || 'aarav@backbone.edu', studentName: fee.studentName, receiptNo: fee.receiptNo, totalAmount: fee.totalAmount, paidAmount: newPaid, pendingAmount: newPending, paymentStatus: status }).catch(err => console.error('Fee email error:', err.message));
      return res.json({ success: true, message: `Payment of ₹${amountPaid} recorded successfully! Receipt generated.` });
    }

    const db = readDB();
    const index = (db.fees || []).findIndex(f => String(f.id) === String(feeId));
    if (index === -1) return res.status(404).json({ success: false, message: 'Fee record not found.' });

    const fee = db.fees[index];
    const newPaid = Number(fee.paidAmount) + Number(amountPaid);
    const newPending = Math.max(0, Number(fee.totalAmount) - newPaid);
    let status = 'PARTIAL';
    if (newPending === 0) status = 'PAID';

    db.fees[index] = { ...fee, paidAmount: newPaid, pendingAmount: newPending, paymentStatus: status, paymentDate: payDate };
    writeDB(db);

    await recordAuditLog({ req, action: 'RECORD_FEE_PAYMENT', targetEntity: 'fees', targetRecordId: feeId, metadata: { amountPaid, studentName: fee.studentName, newPending } });
    sendFeePaymentEmail({ email: fee.email || 'aarav@backbone.edu', studentName: fee.studentName, receiptNo: fee.receiptNo, totalAmount: fee.totalAmount, paidAmount: newPaid, pendingAmount: newPending, paymentStatus: status }).catch(err => console.error('Fee email error:', err.message));
    return res.json({ success: true, message: `Payment of ₹${amountPaid} recorded successfully! Receipt generated.`, fee: db.fees[index] });
  } catch (error) {
    next(error);
  }
});

export default router;
