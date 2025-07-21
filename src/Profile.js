import React, { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // إضافة مستمع لتحديث البيانات عند تغيير LocalStorage
    const onStorage = () => {
      const updated = localStorage.getItem('user');
      if (updated) setUser(JSON.parse(updated));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>الملف الشخصي</h2>
        <p>لم يتم تسجيل الدخول.</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="text-center mb-4">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#eee', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <h3 className="mt-3">{user.name}</h3>
          <p className="text-muted mb-1">{user.email}</p>
          <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>تسجيل الخروج</button>
        </div>
        <hr />
        <h5 className="mb-3">عملياتك (الحجوزات)</h5>
        {user.bookings && user.bookings.length > 0 ? (
          <ul className="list-group">
            {user.bookings.map((booking, idx) => (
              <li key={idx} className="list-group-item">
                <div><b>الخدمة:</b> {booking.service}</div>
                <div><b>الفرع:</b> {booking.branch}</div>
                <div><b>اليوم:</b> {booking.date}</div>
                <div><b>الميعاد:</b> {booking.time}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">لا توجد حجوزات بعد.</p>
        )}
      </div>
    </div>
  );
}

export default Profile; 