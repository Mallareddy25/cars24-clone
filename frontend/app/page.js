'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import CarList from '../components/CarList';
import LocationMap from '../components/LocationMap';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    city: ''
  });

  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation denied or failed", err)
      );
    }
  }, []);

  const fetchCars = async (searchQuery, activeFilters, location) => {
    setLoading(true);
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    try {
      const queryParams = new URLSearchParams({
        query: searchQuery || '',   // backend expects 'query' not 'search'
        ...activeFilters,
        lat: location?.lat || '',
        lng: location?.lng || ''
      });
      
      const res = await fetch(`${API}/api/cars/search?${queryParams.toString()}`);
      if (res.ok) setCars(await res.json());

      const topRes = await fetch(`${API}/api/cars/top-selling`);
      if (topRes.ok) setTopCars(await topRes.json());
      
    } catch (err) {
      console.error("Failed to fetch cars", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async (cityFilter) => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    try {
      const cityQuery = cityFilter ? `?city=${cityFilter}` : '';
      const scRes = await fetch(`${API}/api/locations/service-centers${cityQuery}`);
      if (scRes.ok) setServiceCenters(await scRes.json());

      const ppRes = await fetch(`${API}/api/locations/pickup-points${cityQuery}`);
      if (ppRes.ok) setPickupPoints(await ppRes.json());
    } catch (err) {
      console.error("Failed to fetch location data", err);
    }
  };

  useEffect(() => {
    fetchCars(query, filters, userLoc);
    fetchLocationData(filters.city);
  }, [query, filters, userLoc]);

  const handleSearch = (searchQuery) => setQuery(searchQuery);
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  return (
    <div className="page-container">
      <section className="hero-section">
        <h1>Find Your Perfect Car</h1>
        <p>Search from thousands of certified used cars with our advanced matching system.</p>
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Top Selling Cars Ribbon */}
      {!loading && topCars.length > 0 && (
        <section style={{ margin: '3rem 0', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔥 Top Selling Cars</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {topCars.map((car) => (
              <div key={`top-${car.id}`} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', background: '#f8fafc' }}>
                <div style={{ position: 'relative' }}>
                  <img src={`/images/${car.brand.toLowerCase()}_${car.name.toLowerCase().replace(' ', '_')}.png`} alt={`${car.brand} ${car.name}`} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/swift_dzire.png'; }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Top Choice</div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{car.brand} {car.name}</h3>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{car.year} • {car.mileage} km • {car.fuelType}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>₹{car.price.toLocaleString()}</div>
                    <Link href={`/car/${car.id}`} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}>View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="main-content">
        <aside>
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </aside>
        <section>
          {loading ? (
            <div className="loading">Searching for the best matches...</div>
          ) : (
            <>
              {/* Map UI */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Cars & Hubs Near You</h2>
                <LocationMap 
                  cars={cars} 
                  serviceCenters={serviceCenters} 
                  pickupPoints={pickupPoints} 
                  center={userLoc || null}
                />
              </div>

              {/* Cars List */}
              <CarList cars={cars} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
