import React, { useState } from 'react';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // تحقق من بيانات الأدمن أولاً
    if (email === 'admin@bank.com') {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          window.location.href = '/admin';
          return;
        } else {
          const data = await res.json();
          setError(data.message || 'بيانات غير صحيحة');
        }
      } catch {
        setError('تعذر الاتصال بالسيرفر');
      }
      setLoading(false);
      return;
    }
    // تحقق من بيانات المستخدم العادي من مصفوفة users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
      return;
    }
    setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{minWidth: 350, borderRadius: 20}}>
        <div className="text-center mb-4">
          <img src="/logo192.png" alt="بنك الاشتراكات" width="60" className="mb-2" />
          <h3 className="fw-bold mb-0">تسجيل الدخول</h3>
        </div>
        <form onSubmit={handleSubmit}>
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
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 