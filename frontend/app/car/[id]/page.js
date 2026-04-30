'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CarDetailsPage({ params }) {
  const [car, setCar] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);

  // Chat System State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Default to Monsoon season for demo purposes, could be a dropdown later
  const [season, setSeason] = useState('Monsoon');

  useEffect(() => {
    async function fetchCarAndPricing() {
      try {
        setLoading(true);
        // Fetch base car details
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/cars/${params.id}`);
        if (!res.ok) {
          setCar(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        
        const imageMap = {
          'Swift DZire': 'swift_dzire.png', 
          'City': 'honda_city.png', 
          'Creta': 'hyundai_creta.png',
          'Nexon': 'tata_nexon.png', 
          'Baleno': 'maruti_baleno.png', 
          'Thar': 'mahindra_thar.png'
        };
        data.imageName = imageMap[data.name];
        data.description = `A fantastic ${data.year} ${data.brand} ${data.name} with ${data.transmission} transmission and ${data.fuelType} engine. Located in ${data.city}.`;
        setCar(data);

        // Fetch dynamic pricing
        const pricingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/pricing/${params.id}?season=${season}`);
        if (pricingRes.ok) {
          const pricingData = await pricingRes.json();
          setPricing(pricingData);
        }

        // Fetch Maintenance Estimate
        const age = new Date().getFullYear() - data.year;
        const simulatedKmDriven = age * 18000; // Simulating 18k km per year
        
        try {
          const maintRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/maintenance/estimate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              carId: parseInt(params.id),
              age: age,
              kmDriven: simulatedKmDriven,
              brand: data.brand,
              model: data.name
            })
          });
          
          if (maintRes.ok) {
            const maintData = await maintRes.json();
            setMaintenance(maintData);
          }
        } catch (e) {
          console.error("Maintenance API Error:", e);
        } finally {
          setMaintenanceLoading(false);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchCarAndPricing();
  }, [params.id, season]);

  // Chat System Methods
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/messages/${params.id}`);
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
    }
  }, [isChatOpen]);

  useEffect(() => {
    const handleMockNotification = (e) => {
      // If the push notification is a Message type, refresh our chat!
      if (e.detail && e.detail.type === 'Message' && isChatOpen) {
        fetchMessages();
      }
    };
    window.addEventListener('mock-notification', handleMockNotification);
    return () => window.removeEventListener('mock-notification', handleMockNotification);
  }, [isChatOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSendingMsg(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: parseInt(params.id), content: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}><h2>Loading...</h2></div>;
  }

  if (!car) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Car not found.</h2>
        <Link href="/" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Back to Search</Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = car.imageName ? `/images/${car.imageName}` : `https://source.unsplash.com/600x400/?car,${car.brand},${car.name.replace(' ', '')}`;

  return (
    <div className="page-container">
      <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
        ← Back to Search Results
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <img src={imageUrl} alt={`${car.brand} ${car.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{car.year} {car.brand} {car.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>{car.description}</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--secondary-color)', padding: '0.8rem 1.2rem', borderRadius: '8px', textAlign: 'center', flex: '1' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Fuel Type</span>
              <strong style={{ fontSize: '1.1rem' }}>{car.fuelType}</strong>
            </div>
            <div style={{ background: 'var(--secondary-color)', padding: '0.8rem 1.2rem', borderRadius: '8px', textAlign: 'center', flex: '1' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Transmission</span>
              <strong style={{ fontSize: '1.1rem' }}>{car.transmission}</strong>
            </div>
            <div style={{ background: 'var(--secondary-color)', padding: '0.8rem 1.2rem', borderRadius: '8px', textAlign: 'center', flex: '1' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Mileage</span>
              <strong style={{ fontSize: '1.1rem' }}>{car.mileage} kmpl</strong>
            </div>
          </div>
          
          <div style={{ borderTop: '2px solid var(--secondary-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Recommended Price</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                  {pricing ? formatPrice(pricing.recommendedPrice) : formatPrice(car.price)}
                </div>
              </div>
              <select value={season} onChange={(e) => setSeason(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="All">Standard Season</option>
                <option value="Monsoon">Monsoon Season</option>
                <option value="Fuel Spike">Fuel Spike</option>
              </select>
            </div>

            {pricing && pricing.multiplier !== 1 && (
              <div style={{ background: pricing.multiplier > 1 ? '#fee2e2' : '#dcfce7', color: pricing.multiplier > 1 ? '#991b1b' : '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.95rem' }}>
                <strong>Dynamic Pricing Alert: </strong> 
                The current price is {pricing.multiplier > 1 ? 'higher' : 'lower'} than the base value ({formatPrice(pricing.basePrice)}). 
                <br/><span style={{ fontStyle: 'italic', display: 'block', marginTop: '0.4rem' }}>Reason: {pricing.reason}</span>
              </div>
            )}
            
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              marginTop: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
            }}>
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Estimator Section */}
      <div style={{ marginTop: '3rem', background: 'white', padding: '2.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          🛠 Expected Maintenance Cost
          {maintenance && !maintenanceLoading && (
            <span style={{ 
              fontSize: '0.9rem', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '20px', 
              fontWeight: 600,
              background: maintenance.conditionTag.includes('High') ? '#fee2e2' : (maintenance.conditionTag.includes('Elevated') ? '#fef08a' : '#dcfce7'),
              color: maintenance.conditionTag.includes('High') ? '#991b1b' : (maintenance.conditionTag.includes('Elevated') ? '#854d0e' : '#166534')
            }}>
              {maintenance.conditionTag}
            </span>
          )}
        </h2>

        {maintenanceLoading ? (
          <div style={{ color: '#64748b' }}>Running AI maintenance diagnostics...</div>
        ) : maintenance ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
            
            <div>
              <div style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Estimated Monthly Cost</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#334155', marginBottom: '1.5rem' }}>
                ₹{maintenance.estimatedMonthlyCost} <span style={{ fontSize: '1.2rem', fontWeight: 400, color: '#94a3b8' }}>/mo</span>
              </div>

              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Cost Breakdown</div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: `${(maintenance.baseCost / maintenance.estimatedMonthlyCost) * 100}%`, background: '#3b82f6' }} title={`Base Cost: ₹${maintenance.baseCost}`}></div>
                {maintenance.estimatedMonthlyCost > maintenance.baseCost && (
                  <div style={{ width: `${((maintenance.estimatedMonthlyCost - maintenance.baseCost) / maintenance.estimatedMonthlyCost) * 100}%`, background: '#f59e0b' }} title={`Age/Mileage Penalty: ₹${maintenance.estimatedMonthlyCost - maintenance.baseCost}`}></div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div> Base Model Cost</div>
                {maintenance.estimatedMonthlyCost > maintenance.baseCost && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div> Age/Mileage Penalty</div>
                )}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.2rem', color: '#334155', marginBottom: '1rem' }}>Actionable Insights</h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#475569' }}>
                {maintenance.insights.map((insight, idx) => (
                  <li key={idx} style={{ lineHeight: '1.5' }}>{insight}</li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div style={{ color: '#ef4444' }}>Failed to load maintenance estimate.</div>
        )}
      </div>

      {/* Chat Window Overlay */}
      {isChatOpen && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '350px', height: '500px', 
          background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ background: '#1e293b', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600 }}>Chat with Seller</div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
          </div>
          
          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 'auto', marginBottom: 'auto' }}>
                Send a message to start the conversation!
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{ 
                  alignSelf: msg.senderId === 1 ? 'flex-end' : 'flex-start',
                  background: msg.senderId === 1 ? '#3b82f6' : '#e2e8f0',
                  color: msg.senderId === 1 ? 'white' : '#334155',
                  padding: '0.8rem 1rem', borderRadius: '12px', maxWidth: '80%',
                  borderBottomRightRadius: msg.senderId === 1 ? '0' : '12px',
                  borderBottomLeftRadius: msg.senderId === 1 ? '12px' : '0'
                }}>
                  {msg.content}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type your message..." 
              style={{ flex: 1, padding: '0.8rem', borderRadius: '20px', border: '1px solid #cbd5e1', outline: 'none' }}
              disabled={sendingMsg}
            />
            <button 
              type="submit" 
              disabled={sendingMsg || !newMessage.trim()}
              style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (sendingMsg || !newMessage.trim()) ? 0.5 : 1 }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
