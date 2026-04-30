export default function GenericPage({ params }) {
  // A catch-all page for footer links
  const pageName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
      <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '1rem' }}>{pageName}</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px' }}>
        This page is currently under construction. Please check back later!
      </p>
      <a href="/" style={{ marginTop: '2rem', display: 'inline-block', padding: '0.8rem 1.5rem', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>
        Return to Homepage
      </a>
    </div>
  );
}
