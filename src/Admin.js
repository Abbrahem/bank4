import React, { useEffect, useState } from 'react';
import './App.css';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true);
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر جلب البيانات من السيرفر');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center">لوحة الإدارة - الحجوزات</h2>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="table-responsive animate__animated animate__fadeInUp">
              <table className="table table-bordered table-hover align-middle bg-white shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>رقم الموبايل</th>
                    <th>الفرع</th>
                    <th>الخدمة</th>
                    <th>اليوم</th>
                    <th>المعاد</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center">جاري التحميل...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="7" className="text-center text-danger">{error}</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">لا توجد حجوزات</td></tr>
                  ) : (
                    bookings.map((b, idx) => (
                      <tr key={b._id} className="animate__animated animate__fadeIn animate__faster">
                        <td>{idx + 1}</td>
                        <td>{b.name}</td>
                        <td>{b.mobile}</td>
                        <td>{b.branch}</td>
                        <td>{b.service}</td>
                        <td>{new Date(b.date).toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</td>
                        <td>{b.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin; 