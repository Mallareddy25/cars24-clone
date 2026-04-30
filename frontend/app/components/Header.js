'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check auth state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🔄</span> Cars24<span style={{ color: '#1e293b' }}>-Clone</span>
      </Link>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>Buy Used Cars</Link>
        <Link href="/sell" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>Sell Car</Link>
        {user ? (
          <>
            <Link href="/wallet" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>My Wallet</Link>
            <Link href="/referral" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>Refer & Earn</Link>
            <Link href="/preferences" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>Notification Settings</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #e2e8f0' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Link href="/login" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, padding: '0.5rem 1.5rem', borderRadius: '8px', border: '2px solid #e2e8f0' }}>Login</Link>
            <Link href="/signup" style={{ textDecoration: 'none', color: 'white', fontWeight: 600, padding: '0.5rem 1.5rem', borderRadius: '8px', background: 'var(--primary-color)' }}>Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
