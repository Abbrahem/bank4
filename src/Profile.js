import React, { useEffect, useState } from 'react';
import './App.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    else window.location.href = '/login';
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/my-bookings', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBookings(data);
          } else if (data && data.message) {
            setError(data.message);
          } else {
            setError('تعذر تحميل الحجوزات');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('تعذر تحميل الحجوزات');
          setLoading(false);
        });
    }
  }, []);

  if (!user) return null;

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mb-4" style={{maxWidth: 500, margin: '0 auto', borderRadius: 20}}>
        <div className="text-center mb-3">
          <div style={{position:'relative', display:'inline-block'}}>
            <img src={'/user-tie-solid.svg'} alt="avatar" width="80" height="80" style={{borderRadius:'50%', background:'#f8f9fa', objectFit:'cover'}} />
            <span style={{position:'absolute', bottom:0, right:0, background:'#fff', borderRadius:'50%', padding:3, boxShadow:'0 0 4px #ccc'}}>
              <svg width="24" height="24" fill="#007bff" viewBox="0 0 16 16"><path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37c.69-1.19 2.065-2.37 5.468-2.37 3.403 0 4.778 1.18 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
            </span>
          </div>
          <h3 className="fw-bold mt-2 mb-0">{user.name}</h3>
          <div className="text-muted">{user.email}</div>
        </div>
      </div>
      <div className="card shadow p-4" style={{maxWidth: 700, margin: '0 auto', borderRadius: 20}}>
        <h4 className="fw-bold mb-3">عملياتك (الحجوزات)</h4>
        {loading ? <div>جاري التحميل...</div> : error ? <div className="alert alert-danger">{error}</div> : (
          bookings.length === 0 ? <div className="text-muted">لا توجد حجوزات بعد.</div> :
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>الفرع</th>
                <th>الخدمة</th>
                <th>اليوم</th>
                <th>الميعاد</th>
                <th>تاريخ الحجز</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.branch}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{new Date(b.createdAt).toLocaleString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile; 