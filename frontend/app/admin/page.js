'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const statsRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005') + '');
        if (statsRes.ok) setStats(await statsRes.json());

        const usersRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005') + '');
        if (usersRes.ok) setUsers(await usersRes.json());

        const leadsRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005') + '');
        if (leadsRes.ok) setLeads(await leadsRes.json());
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    if (loading) return <div style={{ padding: '2rem', fontSize: '1.2rem', color: '#64748b' }}>Loading database records...</div>;

    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Platform Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Total Users</div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>{stats?.totalUsers || 0}</div>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
                <div style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cars in Inventory</div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>{stats?.totalCars || 0}</div>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sell Leads (Appraisals)</div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>{stats?.totalLeads || 0}</div>
              </div>

            </div>
          </div>
        );

      case 'users':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Registered Users</h2>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', color: '#64748b' }}>#{u.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{u.name}</td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{u.email}</td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'leads':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1e293b' }}>Sell Car Leads</h2>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Image</th>
                    <th style={{ padding: '1rem' }}>Vehicle</th>
                    <th style={{ padding: '1rem' }}>Details</th>
                    <th style={{ padding: '1rem' }}>Expected Price</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        {l.imagePath ? (
                          <img src={l.imagePath} alt="Car" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        ) : (
                          <div style={{ width: '80px', height: '60px', background: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>No Image</div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>{l.brand} {l.model}</div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>User ID: {l.userId}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        <div>{l.year}</div>
                        <div>{l.mileage} km</div>
                        <div>{l.city}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#10b981' }}>₹{l.expectedPrice.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{l.status}</span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{formatDate(l.createdAt)}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No leads found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #334155', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚙️</span> Admin Panel
        </div>
        <nav style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ padding: '1rem 1.5rem', background: activeTab === 'overview' ? '#334155' : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            📊 Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '1rem 1.5rem', background: activeTab === 'users' ? '#334155' : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            👥 Users
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            style={{ padding: '1rem 1.5rem', background: activeTab === 'leads' ? '#334155' : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            🚗 Sell Leads
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}
