'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#f5f7fa', padding: '4rem 2rem', marginTop: '4rem', borderTop: '1px solid #e2e8f0', fontFamily: 'var(--font-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        
        {/* Brand Info */}
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔄 Cars24
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, marginBottom: '2rem' }}>
            Better drives,<br/>better lives
          </h2>
          <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            <strong>Corporate office</strong><br/>
            6th Floor, SAS Tower-C, Ch Baktawar Singh Road, Medicity<br/>
            Sector 38, Shivaji Nagar, Gurgaon, 122001, Haryana
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
            🏛 RBI Registered NBFC
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 600 }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/about-us" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>About Us</Link></li>
            <li><Link href="/careers" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Careers</Link></li>
            <li><Link href="/press-kit" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Press Kit</Link></li>
            <li><Link href="/testimonials" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Testimonials</Link></li>
            <li><Link href="/sustainability" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Sustainability</Link></li>
            <li><Link href="/privacy-policy" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Privacy Policy</Link></li>
            <li><Link href="/news" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>News</Link></li>
            <li><Link href="/article" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Article</Link></li>
            <li><Link href="/blog" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Blog</Link></li>
          </ul>
        </div>

        {/* Discover Links */}
        <div>
          <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 600 }}>Discover</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Buy a used car</Link></li>
            <li><Link href="/sell" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Sell a used car</Link></li>
            <li><Link href="/get-valuation" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Get a used car valuation</Link></li>
            <li><Link href="/insurance" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Motor insurance options</Link></li>
            <li><Link href="/challan" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Check and pay your challan</Link></li>
            <li><Link href="/verify-details" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Verify vehicle details</Link></li>
            <li><Link href="/explore-new" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Explore new cars</Link></li>
            <li><Link href="/scrap" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Scrap your car</Link></li>
            <li><Link href="/e-challan-telangana" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>e-Challan for Telangana</Link></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 600 }}>Help & Support</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/faqs" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>FAQs</Link></li>
            <li><Link href="/security" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Security</Link></li>
            <li><Link href="/contact-us" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Contact us</Link></li>
            <li><Link href="/partner" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Become a partner</Link></li>
            <li><Link href="/rc-transfer" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>RC transfer status</Link></li>
            <li><Link href="/terms-conditions" style={{ color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Terms & conditions</Link></li>
          </ul>
        </div>
        
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ color: '#475569', fontSize: '0.85rem' }}>
          © 2026 Cars24 Clone Platform • www.cars24.com • All rights reserved
        </div>
        <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
          We are global 🇦🇪 UAE • 🇦🇺 Australia
        </div>
      </div>
    </footer>
  );
}
