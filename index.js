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
const jwt = require('jsonwebtoken');

// موديل المستخدم
const User = require('./User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// إضافة حجز جديد (يدعم المستخدم المسجل)
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, mobile, branch, service, date, time } = req.body;
    let userId = null;
    // إذا كان هناك توكن تحقق، استخرج userId
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch {}
    }
    // تحقق من عدم وجود حجز لنفس اليوم والميعاد
    const exists = await Booking.findOne({ date, time, branch });
    if (exists) {
      return res.status(409).json({ message: 'هذا الميعاد محجوز بالفعل' });
    }
    const booking = new Booking({ name, mobile, branch, service, date, time, userId });
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

// جلب حجوزات مستخدم معين
app.get('/api/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات', error: err.message });
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

// تسجيل مستخدم جديد
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء التسجيل', error: err.message });
  }
});

// تسجيل دخول مستخدم
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'بيانات غير صحيحة' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'بيانات غير صحيحة' });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: err.message });
  }
});

// ميدل وير تحقق JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'غير مصرح' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'توكن غير صالح' });
  }
}

app.get('/', (req, res) => {
  res.send('Bank API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 