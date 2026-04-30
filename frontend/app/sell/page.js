'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellCar() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    Brand: '',
    Model: '',
    Year: 2020,
    Mileage: 50000,
    City: '',
    ExpectedPrice: '',
    Image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to sell your car.");
      router.push('/login');
      return;
    }

    setLoading(true);
    
    // Create FormData object instead of JSON
    const submitData = new FormData();
    submitData.append('UserId', user.id);
    submitData.append('Brand', formData.Brand);
    submitData.append('Model', formData.Model);
    submitData.append('Year', formData.Year);
    submitData.append('Mileage', formData.Mileage);
    submitData.append('City', formData.City);
    submitData.append('ExpectedPrice', formData.ExpectedPrice);
    if (formData.Image) {
      submitData.append('Image', formData.Image);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/sell/submit`, {
        method: 'POST',
        // Omit Content-Type to let the browser automatically set the multipart boundary
        body: submitData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedImagePath(data.imagePath);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{ background: 'white', padding: '4rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', color: '#16a34a', marginBottom: '1rem' }}>Request Submitted Successfully!</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Our valuation expert will contact you shortly to schedule an inspection for your {formData.Brand} {formData.Model}.
          </p>
          
          {uploadedImagePath && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Uploaded Image:</p>
              <img src={uploadedImagePath} alt="Uploaded Car" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
            </div>
          )}

          <Link href="/" style={{ background: 'var(--primary-color)', color: 'white', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600 }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Sell Your Car</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Get the best price in just 1 hour. Start by telling us about your car.</p>
        
        {!user && (
          <div style={{ background: '#fffbeb', color: '#b45309', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fde68a' }}>
            Please <Link href="/login" style={{ fontWeight: 600, color: '#b45309' }}>login</Link> before submitting a request.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Image Upload Area */}
          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', position: 'relative' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📷</span>
                <span style={{ fontWeight: 600 }}>Upload Car Photo</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Brand</label>
              <input type="text" name="Brand" required value={formData.Brand} onChange={handleChange} placeholder="e.g. Maruti" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Model</label>
              <input type="text" name="Model" required value={formData.Model} onChange={handleChange} placeholder="e.g. Swift" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Year</label>
              <input type="number" name="Year" required value={formData.Year} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Mileage (km)</label>
              <input type="number" name="Mileage" required value={formData.Mileage} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>City</label>
            <input type="text" name="City" required value={formData.City} onChange={handleChange} placeholder="e.g. Mumbai" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Expected Price (₹)</label>
            <input type="number" name="ExpectedPrice" required value={formData.ExpectedPrice} onChange={handleChange} placeholder="e.g. 500000" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>

          <button 
            type="submit" 
            disabled={loading || !user}
            style={{ 
              background: 'var(--primary-color)', color: 'white', border: 'none', padding: '1rem', 
              borderRadius: '8px', fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem', cursor: 'pointer',
              opacity: (loading || !user) ? 0.5 : 1
            }}>
            {loading ? 'Submitting...' : 'Get Valuation'}
          </button>
        </form>
      </div>
    </div>
  );
}
