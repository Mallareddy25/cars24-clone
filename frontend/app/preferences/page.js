'use client';

import { useState, useEffect } from 'react';

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState({
    appointmentAlerts: true,
    bidAlerts: true,
    priceAlerts: true,
    messageAlerts: true,
    channel: 'browser'
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/notifications/preferences`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setPrefs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/notifications/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      if (res.ok) {
        setSuccessMsg('Preferences saved successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async (type) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          message: `This is a test notification for ${type}!`
        })
      });

      if (res.ok) {
        const data = await res.text();
        if (data.includes('skipped')) {
          alert('Backend blocked the notification because your preferences are turned off for this type!');
        } else {
          // Fire a mock event so the UI slides in, since we don't have real Firebase keys to route the message back
          window.dispatchEvent(new CustomEvent('mock-notification', {
            detail: { title: `New ${type} Alert`, body: `This is a test notification for ${type}!` }
          }));
        }
      }
    } catch (err) {
      console.error("Failed to send test notification", err);
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Loading...</h2></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Notification Settings</h1>

      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
        <form onSubmit={handleSave}>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Push Notification Alerts</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" name="appointmentAlerts" checked={prefs.appointmentAlerts} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Appointment Updates</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified when your test drive is confirmed or rescheduled.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" name="bidAlerts" checked={prefs.bidAlerts} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Auction / Bid Alerts</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified when someone outbids you or you win an auction.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" name="priceAlerts" checked={prefs.priceAlerts} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Dynamic Price Drops</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified when a car you liked drops in price due to season changes.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" name="messageAlerts" checked={prefs.messageAlerts} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Direct Messages</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified when a seller replies to your inquiries.</div>
              </div>
            </label>
          </div>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Delivery Channels</h3>
          <div style={{ marginBottom: '2.5rem' }}>
            <select name="channel" value={prefs.channel} onChange={handleChange} style={{ padding: '0.8rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}>
              <option value="browser">Browser Push Notifications Only</option>
              <option value="email">Email Only</option>
              <option value="both">Both Browser & Email</option>
            </select>
          </div>

          {successMsg && <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1.5rem' }}>{successMsg}</div>}

          <button type="submit" disabled={saving} style={{
            background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem',
            border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '3rem', background: '#f8fafc', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px dashed #cbd5e1' }}>
        <h3 style={{ marginTop: 0, color: '#334155' }}>Developer Tools (Test Push API)</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Trigger dummy events to test if the .NET backend properly filters by your preferences and pushes them to your browser via Firebase.</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleTestNotification('Appointment')} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Simulate Appointment</button>
          <button onClick={() => handleTestNotification('PriceDrop')} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Simulate Price Drop</button>
          <button onClick={() => handleTestNotification('Bid')} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Simulate Bid Update</button>
          <button onClick={() => handleTestNotification('Message')} style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Simulate Message</button>
        </div>
      </div>
    </div>
  );
}
