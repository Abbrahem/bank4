import React, { useState } from 'react';
import './App.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.message || 'حدث خطأ');
      }
    } catch {
      setError('تعذر الاتصال بالسيرفر');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{minWidth: 350, borderRadius: 20}}>
        <div className="text-center mb-4">
          <img src="/logo192.png" alt="بنك الاشتراكات" width="60" className="mb-2" />
          <h3 className="fw-bold mb-0">إنشاء حساب جديد</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">الاسم</label>
            <input type="text" className="form-control rounded-pill" value={name} onChange={e => setName(e.target.value)} placeholder="اسمك الثلاثي" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">البريد الإلكتروني</label>
            <input type="email" className="form-control rounded-pill" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">كلمة المرور</label>
            <input type="password" className="form-control rounded-pill" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" />
          </div>
          {error && <div className="alert alert-danger py-1 text-center">{error}</div>}
          <button type="submit" className="btn btn-dark w-100 rounded-pill fw-bold" disabled={loading}>
            {loading ? 'جاري التسجيل...' : 'تسجيل'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register; 