const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);
// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bank');

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});

const Booking = require('./Booking');
const Admin = require('./Admin');
const bcrypt = require('bcryptjs');

// إضافة حجز جديد
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, mobile, branch, service, date, time } = req.body;
    // تحقق من عدم وجود حجز لنفس اليوم والميعاد
    const exists = await Booking.findOne({ date, time, branch });
    if (exists) {
      return res.status(409).json({ message: 'هذا الميعاد محجوز بالفعل' });
    }
    const booking = new Booking({ name, mobile, branch, service, date, time });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء الحجز', error: err.message });
  }
});

// جلب كل الحجوزات
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات', error: err.message });
  }
});

// جلب المواعيد المحجوزة ليوم معين وفرع معين
app.get('/api/bookings/slots', async (req, res) => {
  try {
    const { date, branch } = req.query;
    const slots = await Booking.find({ date, branch }).select('time -_id');
    res.json(slots.map(s => s.time));
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المواعيد', error: err.message });
  }
});

// تسجيل الدخول للأدمن
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'بيانات غير صحيحة' });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ message: 'بيانات غير صحيحة' });
  res.json({ message: 'تم تسجيل الدخول بنجاح' });
});

app.get('/', (req, res) => {
  res.send('Bank API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 