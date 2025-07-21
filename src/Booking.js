import React, { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';

const branches = [
  { value: 'المحلة الكبرى - شارع شكري', label: 'المحلة الكبرى - شارع شكري' },
  { value: 'طنطا - شارع البحر', label: 'طنطا - شارع البحر' },
];

const services = [
  'تخليص أوراق',
  'استعلام',
  'استخراج قروض',
  'منشآت',
  'استفسارات',
];

function Booking() {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState('');
  const [service, setService] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // حساب الأيام المتاحة (من يوم 22 ولمدة 15 يوم)
  const today = new Date();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 22);
  const days = [];
  for (let i = 0; i < 15; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    if (d >= today) {
      days.push(d);
    }
  }

  // حساب المواعيد المتاحة (من 9:00 إلى 5:00 كل ربع ساعة)
  const times = [];
  for (let h = 9; h < 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0');
      const min = m.toString().padStart(2, '0');
      times.push(`${hour}:${min}`);
    }
  }

  // جلب المواعيد المحجوزة عند اختيار اليوم والفرع
  useEffect(() => {
    if (date && branch) {
      setLoadingSlots(true);
      fetch(`/api/bookings/slots?date=${date.slice(0,10)}&branch=${encodeURIComponent(branch)}`)
        .then(res => res.json())
        .then(data => {
          setBookedSlots(data);
          setLoadingSlots(false);
        })
        .catch(() => setLoadingSlots(false));
    } else {
      setBookedSlots([]);
    }
  }, [date, branch]);

  // خطوات الفورم
  useEffect(() => {
    // إذا كان المستخدم مسجل دخول، املأ الاسم ورقم الموبايل تلقائيًا
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setName(user.name);
      // يمكن إضافة رقم الهاتف في بيانات المستخدم لاحقًا
    }
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{minWidth: 350, borderRadius: 20, maxWidth: 420}}>
        <h3 className="fw-bold mb-4 text-center">حجز موعد جديد</h3>
        {step === 1 && (
          <form onSubmit={e => {e.preventDefault(); if(branch) setStep(2);}}>
            <div className="mb-3">
              <label className="form-label fw-bold">اختر الفرع</label>
              <select className="form-select rounded-pill" value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="">-- اختر الفرع --</option>
                {branches.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-dark w-100 rounded-pill fw-bold">التالي</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={e => {e.preventDefault(); if(service) setStep(3);}}>
            <div className="mb-3">
              <label className="form-label fw-bold">اختر خدمتك</label>
              <select className="form-select rounded-pill" value={service} onChange={e => setService(e.target.value)}>
                <option value="">-- اختر الخدمة --</option>
                {services.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button type="button" className="btn btn-secondary rounded-pill me-2" onClick={() => setStep(1)}>السابق</button>
            <button type="submit" className="btn btn-dark rounded-pill fw-bold">التالي</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={e => {e.preventDefault(); if(name && mobile) setStep(4);}}>
            <div className="mb-3">
              <label className="form-label fw-bold">الاسم</label>
              <input type="text" className="form-control rounded-pill" value={name} onChange={e => setName(e.target.value)} placeholder="اسمك الثلاثي" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">رقم الموبايل</label>
              <input type="tel" className="form-control rounded-pill" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="010xxxxxxxx" />
            </div>
            <button type="button" className="btn btn-secondary rounded-pill me-2" onClick={() => setStep(2)}>السابق</button>
            <button type="submit" className="btn btn-dark rounded-pill fw-bold">التالي</button>
          </form>
        )}
        {step === 4 && (
          <form onSubmit={e => {e.preventDefault(); if(date && time) setStep(5);}}>
            <div className="mb-3">
              <label className="form-label fw-bold">اختر اليوم</label>
              <select className="form-select rounded-pill" value={date} onChange={e => setDate(e.target.value)}>
                <option value="">-- اختر اليوم --</option>
                {days.map(d => <option key={d.toISOString()} value={d.toISOString()}>{d.toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">اختر الميعاد</label>
              <select className="form-select rounded-pill" value={time} onChange={e => setTime(e.target.value)} disabled={loadingSlots || !date}>
                <option value="">-- اختر الميعاد --</option>
                {times.map(t => (
                  <option key={t} value={t} disabled={bookedSlots.includes(t)}>
                    {t} {bookedSlots.includes(t) ? ' (محجوز)' : ''}
                  </option>
                ))}
              </select>
              {loadingSlots && <div className="text-center text-muted small py-1">جاري تحميل المواعيد...</div>}
            </div>
            <button type="button" className="btn btn-secondary rounded-pill me-2" onClick={() => setStep(3)}>السابق</button>
            <button type="submit" className="btn btn-dark rounded-pill fw-bold">التالي</button>
          </form>
        )}
        {step === 5 && (
          <div>
            <h5 className="fw-bold mb-3 text-center">تأكيد الحجز</h5>
            <ul className="list-group mb-3">
              <li className="list-group-item">الفرع: <span className="fw-bold">{branch}</span></li>
              <li className="list-group-item">الخدمة: <span className="fw-bold">{service}</span></li>
              <li className="list-group-item">الاسم: <span className="fw-bold">{name}</span></li>
              <li className="list-group-item">رقم الموبايل: <span className="fw-bold">{mobile}</span></li>
              <li className="list-group-item">اليوم: <span className="fw-bold">{date && new Date(date).toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span></li>
              <li className="list-group-item">المعاد: <span className="fw-bold">{time}</span></li>
            </ul>
            {error && <div className="alert alert-danger py-1 text-center">{error}</div>}
            <button className="btn btn-secondary rounded-pill me-2" onClick={() => setStep(4)}>السابق</button>
            <button className="btn btn-success rounded-pill fw-bold" onClick={async () => {
              setLoadingSubmit(true);
              setError('');
              const token = localStorage.getItem('token');
              try {
                const res = await fetch('/api/bookings', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                  },
                  body: JSON.stringify({ name, mobile, branch, service, date: date.slice(0,10), time })
                });
                if (res.status === 201) {
                  Swal.fire({
                    icon: 'success',
                    title: 'تم الحجز بنجاح!',
                    text: 'سيتم تحويلك للصفحة الرئيسية خلال ثوانٍ...',
                    timer: 3000,
                    showConfirmButton: false
                  });
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 3000);
                  setConfirm(true);
                } else if (res.status === 409) {
                  setError('هذا الميعاد محجوز بالفعل، اختر ميعاد آخر.');
                  setStep(4);
                } else {
                  setError('حدث خطأ أثناء الحجز، حاول مرة أخرى.');
                }
              } catch {
                setError('تعذر الاتصال بالسيرفر.');
              }
              setLoadingSubmit(false);
            }} disabled={loadingSubmit}>
              {loadingSubmit ? 'جاري الحجز...' : 'تأكيد الحجز'}
            </button>
          </div>
        )}
        {confirm && (
          <div className="text-center">
            <div className="alert alert-success fw-bold">تم حجز موعدك بنجاح! سيتم التواصل معك عبر الواتساب قريباً.</div>
            <ul className="list-group mb-3">
              <li className="list-group-item">الفرع: <span className="fw-bold">{branch}</span></li>
              <li className="list-group-item">الخدمة: <span className="fw-bold">{service}</span></li>
              <li className="list-group-item">الاسم: <span className="fw-bold">{name}</span></li>
              <li className="list-group-item">رقم الموبايل: <span className="fw-bold">{mobile}</span></li>
              <li className="list-group-item">اليوم: <span className="fw-bold">{date && new Date(date).toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span></li>
              <li className="list-group-item">المعاد: <span className="fw-bold">{time}</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking; 