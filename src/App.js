import React from 'react';
import './App.css';
import logo from './logo.svg'; // مؤقتًا حتى يتم استبداله
import Login from './Login';
import Booking from './Booking';
import Admin from './Admin';
import Register from './Register';
import Profile from './Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// مكون حالة المستخدم في الـ Navbar
function UserStatus() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    if (isLoggedIn && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="d-flex align-items-center ms-3 bg-light border rounded-pill px-3 py-1 shadow-sm" style={{minWidth: 120, gap: 8}}>
      {!user ? (
        <>
          <span className="fw-bold text-secondary">ضيف</span>
          <a href="/login" className="btn btn-sm btn-outline-dark rounded-pill ms-2" style={{fontWeight:'bold'}}>
            تسجيل الدخول
          </a>
        </>
      ) : (
        <>
          <a href="/profile" className="d-flex align-items-center text-decoration-none" style={{cursor:'pointer'}}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <span className="ms-2 fw-bold">{user.name}</span>
          </a>
          <button className="btn btn-link text-danger ms-2 p-0" style={{fontWeight:'bold', fontSize:14}} onClick={handleLogout}>تسجيل الخروج</button>
        </>
      )}
    </div>
  );
}

function MainPage() {
  // حالة المستخدم
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return (
    <div className="App" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="#">
            <img src={logo} alt="بنك الاشتراكات" width="40" height="40" style={{borderRadius: '50%'}} />
            بنك الاشتراكات
          </a>
          {/* زر navbar-toggler الافتراضي يفتح offcanvas */}
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3 d-none d-lg-flex">
              <li className="nav-item">
                <a className="nav-link" href="#services" onClick={e => {e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });}}>خدماتنا</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#whyus" onClick={e => {e.preventDefault(); document.getElementById('whyus')?.scrollIntoView({ behavior: 'smooth' });}}>لماذا نحن</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#steps" onClick={e => {e.preventDefault(); document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' });}}>خطوات الحجز</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact" onClick={e => {e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });}}>تواصل معنا</a>
              </li>
              {!isLoggedIn && (
                <li className="nav-item">
                  <a className="nav-link" href="/register" onClick={e => {e.preventDefault(); window.location.href = '/register';}}>إنشاء حساب</a>
                </li>
              )}
            </ul>
            {/* حالة المستخدم */}
            <UserStatus />
          </div>
        </div>
      </nav>

      {/* نافذة القائمة للموبايل (offcanvas) */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="mobileMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">القائمة</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column gap-3">
          <button className="btn btn-link fs-5 text-start" style={{textDecoration: 'none'}} onClick={() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('#mobileMenu')?.classList.remove('show');
            document.body.classList.remove('offcanvas-backdrop');
          }}>خدماتنا</button>
          <button className="btn btn-link fs-5 text-start" style={{textDecoration: 'none'}} onClick={() => {
            document.getElementById('whyus')?.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('#mobileMenu')?.classList.remove('show');
            document.body.classList.remove('offcanvas-backdrop');
          }}>لماذا نحن</button>
          <button className="btn btn-link fs-5 text-start" style={{textDecoration: 'none'}} onClick={() => {
            document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('#mobileMenu')?.classList.remove('show');
            document.body.classList.remove('offcanvas-backdrop');
          }}>خطوات الحجز</button>
          <button className="btn btn-link fs-5 text-start" style={{textDecoration: 'none'}} onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('#mobileMenu')?.classList.remove('show');
            document.body.classList.remove('offcanvas-backdrop');
          }}>تواصل معنا</button>
          {!isLoggedIn && (
            <>
              <button className="btn btn-dark rounded-pill fs-5" onClick={() => {
                window.location.href = '/login';
                document.querySelector('#mobileMenu')?.classList.remove('show');
                document.body.classList.remove('offcanvas-backdrop');
              }}>تسجيل الدخول</button>
              <button className="btn btn-outline-dark rounded-pill fs-5" onClick={() => {
                window.location.href = '/register';
                document.querySelector('#mobileMenu')?.classList.remove('show');
                document.body.classList.remove('offcanvas-backdrop');
              }}>إنشاء حساب</button>
            </>
          )}
          {isLoggedIn && (
            <button className="btn btn-outline-dark rounded-pill fs-5" onClick={() => {
              window.location.href = '/profile';
              document.querySelector('#mobileMenu')?.classList.remove('show');
              document.body.classList.remove('offcanvas-backdrop');
            }}>الملف الشخصي</button>
          )}
        </div>
      </div>
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center justify-content-center position-relative" style={{height: '100vh', background: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80) center/cover no-repeat'}}>
        <div className="container text-center text-dark position-relative" style={{zIndex:2}}>
          <h1 className="display-4 fw-bold mb-3" style={{textShadow: '0 2px 8px #fff'}}>مرحبا بك في بنك الاشتراكات</h1>
          <p className="lead mb-4" style={{textShadow: '0 1px 6px #fff'}}>نحن هنا لنقدم لك أفضل الخدمات البنكية بأعلى جودة واحترافية. احجز موعدك بسهولة وابدأ تجربتك المصرفية الفاخرة معنا.</p>
          <a href="/book" className="btn btn-outline-dark btn-lg px-5 py-2 rounded-pill shadow">احجز موعدك الآن</a>
        </div>
        <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" style={{background: 'rgba(255,255,255,0.5)', zIndex:1}}></div>
      </section>
      {/* كروت بنكية عصرية وتفاعلية */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* كارد حساب توفير ذكي */}
            <div className="col-md-6 col-lg-3">
              <div className="bank-card card border-0 shadow-lg h-100 text-center p-4 animate__animated animate__fadeInUp position-relative overflow-hidden">
                <i className="bi bi-piggy-bank fs-1 text-primary mb-3"></i>
                <h5 className="fw-bold mb-2">حساب توفير ذكي</h5>
                <p className="text-muted">افتح حسابك وابدأ الادخار مع عوائد تنافسية.</p>
                <button className="btn btn-outline-primary rounded-pill mt-2">افتح حسابك الآن</button>
                <div className="bank-card-offer position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{pointerEvents:'none'}}>
                  <span className="badge bg-success fs-6 animate__animated animate__fadeIn animate__delay-1s" style={{display:'none'}}>فائدة حتى 12%</span>
                </div>
              </div>
            </div>
            {/* كارد تقييم العملاء */}
            <div className="col-md-6 col-lg-3">
              <div className="bank-card card border-0 shadow-lg h-100 text-center p-4 animate__animated animate__fadeInUp animate__delay-1s position-relative">
                <i className="bi bi-star-half fs-1 text-warning mb-3"></i>
                <h5 className="fw-bold mb-2">تقييم العملاء</h5>
                <div className="mb-2">
                  <span className="fs-4 text-warning">★</span>
                  <span className="fs-4 text-warning">★</span>
                  <span className="fs-4 text-warning">★</span>
                  <span className="fs-4 text-warning">★</span>
                  <span className="fs-4 text-warning">☆</span>
                  <span className="fw-bold ms-2">4.9/5</span>
                </div>
                <button className="btn btn-outline-warning rounded-pill mt-2">شاهد آراء العملاء</button>
                <div className="bank-card-offer position-absolute bottom-0 start-0 w-100 text-center animate__animated animate__fadeIn animate__delay-1s" style={{display:'none'}}>
                  <span className="text-muted small">+2000 تقييم إيجابي</span>
                </div>
              </div>
            </div>
            {/* كارد تطبيق البنك */}
            <div className="col-md-6 col-lg-3">
              <div className="bank-card card border-0 shadow-lg h-100 text-center p-4 animate__animated animate__fadeInUp animate__delay-2s position-relative">
                <i className="bi bi-phone fs-1 text-success mb-3"></i>
                <h5 className="fw-bold mb-2">تطبيق البنك</h5>
                <p className="text-muted">إدارة حساباتك وتحويل الأموال بسهولة من هاتفك.</p>
                <button className="btn btn-outline-success rounded-pill mt-2">حمّل التطبيق</button>
                <div className="bank-card-offer position-absolute top-0 end-0 m-2 animate__animated animate__fadeIn animate__delay-1s" style={{display:'none'}}>
                  <img src="https://chart.googleapis.com/chart?cht=qr&chs=60x60&chl=https://bank.com/app" alt="QR" style={{borderRadius:8}} />
                </div>
              </div>
            </div>
            {/* كارد عرض حصري */}
            <div className="col-md-6 col-lg-3">
              <div className="bank-card card border-0 shadow-lg h-100 text-center p-4 animate__animated animate__fadeInUp animate__delay-3s position-relative overflow-hidden">
                <i className="bi bi-gift fs-1 text-danger mb-3"></i>
                <h5 className="fw-bold mb-2">عرض حصري</h5>
                <p className="text-muted animate__animated animate__pulse animate__infinite">احصل على بطاقة مجانية عند أول تحويل!</p>
                <button className="btn btn-outline-danger rounded-pill mt-2">اعرف المزيد</button>
                <div className="bank-card-offer position-absolute top-0 end-0 m-2 animate__animated animate__fadeIn animate__delay-1s" style={{display:'none'}}>
                  <span className="badge bg-danger">لفترة محدودة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="whyus" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">لماذا نحن</h2>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="why-us-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                <h5 className="fw-bold mb-2">أمان كامل</h5>
                <p className="text-muted">نأمن جميع المعاملات البنكية والمعلومات الشخصية بأعلى مستوى من الأمان.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="why-us-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-clock-history fs-1 text-success mb-3"></i>
                <h5 className="fw-bold mb-2">سرعة في العمليات</h5>
                <p className="text-muted">نقدم خدماتنا بسرعة وفعالية لتلبية احتياجاتك البنكية في أي وقت.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="why-us-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-headset fs-1 text-info mb-3"></i>
                <h5 className="fw-bold mb-2">دعم في أي وقت</h5>
                <p className="text-muted">نتواصل معك في أي وقت ونقدم لك الدعم المتواصل والمتميز.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="steps" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">خطوات الحجز</h2>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="step-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-person-plus fs-1 text-primary mb-3"></i>
                <h5 className="fw-bold mb-2">التسجيل</h5>
                <p className="text-muted">قم بالتسجيل في البنك لتتمكن من استخدام خدماتنا.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="step-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-calendar-check fs-1 text-success mb-3"></i>
                <h5 className="fw-bold mb-2">اختيار التاريخ</h5>
                <p className="text-muted">اختر التاريخ والوقت المناسب لك للحجز.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="step-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-check-circle fs-1 text-info mb-3"></i>
                <h5 className="fw-bold mb-2">التأكيد</h5>
                <p className="text-muted">تأكد من صحة المعلومات وإكمال الحجز.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">تواصل معنا</h2>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="contact-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-telephone fs-1 text-primary mb-3"></i>
                <h5 className="fw-bold mb-2">اتصل بنا</h5>
                <p className="text-muted">01234567890</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="contact-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-envelope fs-1 text-info mb-3"></i>
                <h5 className="fw-bold mb-2">البريد الإلكتروني</h5>
                <p className="text-muted">info@bank.com</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="contact-card card border-0 shadow-lg h-100 text-center p-4">
                <i className="bi bi-geo-alt fs-1 text-success mb-3"></i>
                <h5 className="fw-bold mb-2">العنوان</h5>
                <p className="text-muted">القاهرة, مصر</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-light py-4 mt-auto border-top">
        <div className="container text-center">
          <span className="fw-bold">بنك الاشتراكات</span> &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
