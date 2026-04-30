'use client';

import { useState, useEffect } from 'react';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');
  
  const mockUserId = 1;

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/wallet/${mockUserId}`, { cache: 'no-store' });
      if (res.ok) {
        setWallet(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    setRedeemMsg('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/wallet/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: mockUserId, points: 500 }) // Hardcoded 500 points to redeem for demo
      });
      
      if (res.ok) {
        setRedeemMsg('Success! 500 points redeemed for a ₹500 Discount Voucher.');
        fetchWallet(); // refresh balance
      } else {
        const errorText = await res.text();
        setRedeemMsg(`Failed: ${errorText}`);
      }
    } catch (err) {
      setRedeemMsg('Error connecting to backend.');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Loading Wallet...</h2></div>;
  if (!wallet) return <div className="page-container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Failed to load wallet.</h2></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Wallet</h1>
      
      {/* Balance Card */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '3rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Available Balance</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            {wallet.balance} <span style={{ fontSize: '1.5rem', fontWeight: 400, color: '#94a3b8' }}>pts</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <button 
            onClick={handleRedeem}
            disabled={redeeming || wallet.balance < 500}
            style={{ 
              background: 'var(--primary-color)', color: 'white', border: 'none', padding: '1rem 2rem', 
              borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', cursor: (redeeming || wallet.balance < 500) ? 'not-allowed' : 'pointer',
              opacity: (redeeming || wallet.balance < 500) ? 0.5 : 1
            }}
          >
            {redeeming ? 'Processing...' : 'Redeem 500 Pts'}
          </button>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>1 pt = ₹1 Discount</div>
        </div>
      </div>

      {redeemMsg && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: redeemMsg.includes('Success') ? '#dcfce7' : '#fee2e2', color: redeemMsg.includes('Success') ? '#166534' : '#991b1b' }}>
          {redeemMsg}
        </div>
      )}

      {/* Transaction History */}
      <div style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>Transaction History</h3>
        
        {wallet.transactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0' }}>No transactions yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {wallet.transactions.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{t.description}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: t.type === 'Earned' ? '#16a34a' : '#ef4444' }}>
                  {t.type === 'Earned' ? '+' : ''}{t.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
