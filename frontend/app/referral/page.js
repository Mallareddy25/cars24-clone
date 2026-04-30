'use client';

import { useState, useEffect } from 'react';

export default function ReferralPage() {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testResult, setTestResult] = useState('');
  
  const mockUserId = 1; // Current user

  useEffect(() => {
    async function fetchReferral() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/referral/${mockUserId}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setReferral(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReferral();
  }, []);

  const handleCopy = () => {
    if (referral) {
      navigator.clipboard.writeText(referral.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const simulateReferralUsage = async () => {
    setTestMode(true);
    setTestResult('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/referral/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: referral.code,
          referredUserId: 2 // A dummy new user using your code
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTestResult('Success! A new user applied your code. Check your wallet for 1000 points!');
        
        // Refresh referral stats
        const refRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/referral/${mockUserId}`, { cache: 'no-store' });
        if (refRes.ok) {
          setReferral(await refRes.json());
        }

        // Trigger a fake push notification
        window.dispatchEvent(new CustomEvent('mock-notification', { 
          detail: { title: 'Referral Bonus!', body: 'Someone just used your referral code! 1000 points added to your wallet.' }
        }));

      } else {
        setTestResult(`Failed: ${data.message || data}`);
      }
    } catch (err) {
      setTestResult('Error hitting API');
    } finally {
      setTestMode(false);
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (!referral) return <div className="page-container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Failed to load referral code.</h2></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Invite Friends, Earn Rewards</h1>
      
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white', padding: '3rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Give 500, Get 1000</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
          Share your unique referral code. When a friend signs up and completes a purchase, they get 500 Welcome Points, and you get 1000 Bonus Points!
        </p>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px', display: 'inline-block', minWidth: '300px' }}>
          <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '0.5rem' }}>Your Referral Code</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'monospace' }}>{referral.code}</span>
          </div>
          <button 
            onClick={handleCopy}
            style={{ 
              marginTop: '1rem', background: copied ? '#22c55e' : 'white', color: copied ? 'white' : '#4f46e5', 
              border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 600, fontSize: '1rem',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: '#333' }}>{referral.totalReferrals}</div>
          <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Total Friends Referred</div>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{referral.totalPointsEarned}</div>
          <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Total Points Earned</div>
        </div>
      </div>

      <div style={{ marginTop: '3rem', background: '#f8fafc', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px dashed #cbd5e1' }}>
        <h3 style={{ marginTop: 0, color: '#334155' }}>Developer Tools (Test Referral API)</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Simulate a new user checking out and applying your code.</p>
        
        <button 
          onClick={simulateReferralUsage} 
          disabled={testMode}
          style={{ padding: '0.8rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
        >
          {testMode ? 'Processing...' : 'Simulate Friend Applying Code'}
        </button>

        {testResult && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', background: testResult.includes('Success') ? '#dcfce7' : '#fee2e2', color: testResult.includes('Success') ? '#166534' : '#991b1b' }}>
            {testResult}
          </div>
        )}
      </div>

    </div>
  );
}
