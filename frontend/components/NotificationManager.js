'use client';

import { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

export default function NotificationManager() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Request push notification permissions and grab the token
    const setupNotifications = async () => {
      try {
        await requestForToken();
      } catch (e) {
        console.error("FCM Token fetch failed", e);
      }
    };
    setupNotifications();
  }, []);

  useEffect(() => {
    // Listen for real foreground notifications
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      })
      .catch((err) => console.log('failed: ', err));

    // Listen for mock notifications from Developer Tools
    const handleMock = (e) => {
      setNotification(e.detail);
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    };
    window.addEventListener('mock-notification', handleMock);
    return () => window.removeEventListener('mock-notification', handleMock);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      borderLeft: '4px solid var(--primary-color)',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: '#333' }}>{notification.title}</h4>
        <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0', color: '#999' }}>×</button>
      </div>
      <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>{notification.body}</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
