import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    // جلب المستخدمين الحاليين
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // منع تكرار الإيميل
    if (users.some(u => u.email === email)) {
      setError('البريد الإلكتروني مستخدم بالفعل');
      return;
    }
    // إضافة المستخدم الجديد
    const user = { name, email, password, bookings: [] };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    // تسجيل الدخول تلقائيًا بعد التسجيل
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-4 text-center">إنشاء حساب جديد</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">الاسم</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">البريد الإلكتروني</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">كلمة المرور</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-dark w-100">تسجيل</button>
        </form>
        <div className="mt-3 text-center">
          لديك حساب؟ <a href="/login">سجّل الدخول</a>
        </div>
      </div>
    </div>
  );
}

export default Register; 