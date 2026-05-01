'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch(e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navLink = { textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.95rem' };
  const logoutBtn = { background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 };
  const loginBtn = { textDecoration: 'none', color: '#1e293b', fontWeight: 600, padding: '0.5rem 1.2rem', borderRadius: '8px', border: '2px solid #e2e8f0' };
  const signupBtn = { textDecoration: 'none', color: 'white', fontWeight: 600, padding: '0.5rem 1.2rem', borderRadius: '8px', background: 'var(--primary-color)' };
  const drawerLink = { textDecoration: 'none', color: '#1e293b', fontWeight: 600, padding: '1rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '1.1rem', display: 'block' };
  const bar = { display: 'block', width: '24px', height: '2px', background: '#1e293b', borderRadius: '2px', transition: 'all 0.3s ease' };

  return (
    <>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.5rem', background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 200
      }}>
        {/* Logo */}
        <Link href="/" onClick={closeMenu} style={{
          fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-color)',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          <span style={{ fontSize: '1.6rem' }}>🔄</span>
          Cars24<span style={{ color: '#1e293b', fontWeight: 600 }}>-Clone</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={navLink}>Buy Used Cars</Link>
          <Link href="/sell" style={navLink}>Sell Car</Link>
          {user ? (
            <>
              <Link href="/wallet" style={navLink}>My Wallet</Link>
              <Link href="/referral" style={navLink}>Refer & Earn</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid #e2e8f0' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Hi, {user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <Link href="/login" style={loginBtn}>Login</Link>
              <Link href="/signup" style={signupBtn}>Sign Up</Link>
            </div>
          )}
        </nav>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          className="hamburger-btn"
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: '0.5rem', flexDirection: 'column', gap: '5px', zIndex: 300
          }}
        >
          <span style={{ ...bar, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...bar, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div onClick={closeMenu} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150
        }} />
      )}

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: '280px',
        background: '#fff', zIndex: 160,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', padding: '5rem 1.5rem 2rem'
      }}>
        <Link href="/" onClick={closeMenu} style={drawerLink}>🚗 Buy Used Cars</Link>
        <Link href="/sell" onClick={closeMenu} style={drawerLink}>💰 Sell Car</Link>
        {user ? (
          <>
            <Link href="/wallet" onClick={closeMenu} style={drawerLink}>👛 My Wallet</Link>
            <Link href="/referral" onClick={closeMenu} style={drawerLink}>🎁 Refer & Earn</Link>
            <Link href="/preferences" onClick={closeMenu} style={drawerLink}>🔔 Notifications</Link>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.8rem', color: '#1e293b' }}>Hi, {user.name} 👋</div>
              <button onClick={handleLogout} style={{
                background: 'var(--primary-color)', color: 'white', border: 'none',
                padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%'
              }}>Logout</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
            <Link href="/login" onClick={closeMenu} style={{ ...loginBtn, textAlign: 'center', display: 'block' }}>Login</Link>
            <Link href="/signup" onClick={closeMenu} style={{ ...signupBtn, textAlign: 'center', display: 'block' }}>Sign Up</Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
