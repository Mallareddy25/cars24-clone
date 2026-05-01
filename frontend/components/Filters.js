'use client';

export default function Filters({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="filters-panel">
      <h3>Advanced Filters</h3>
      
      <div className="filter-group">
        <label htmlFor="city">City Location</label>
        <select name="city" id="city" value={filters.city || ''} onChange={handleChange}>
          <option value="">Use My Location (GPS)</option>
          <option value="All">All Cities (Anywhere)</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Pune">Pune</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="fuelType">Fuel Type</label>
        <select name="fuelType" id="fuelType" value={filters.fuelType} onChange={handleChange}>
          <option value="">All</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="EV">Electric / EV</option>
          <option value="CNG">CNG</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="transmission">Transmission</label>
        <select name="transmission" id="transmission" value={filters.transmission} onChange={handleChange}>
          <option value="">All</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Min Mileage (kmpl)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input 
            type="range" 
            name="minMileage" 
            min="0" 
            max="30" 
            value={filters.minMileage || 0} 
            onChange={handleChange} 
          />
          <span style={{ fontWeight: 600 }}>{filters.minMileage || 0}+</span>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="minYear">Min Year</label>
        <select name="minYear" id="minYear" value={filters.minYear} onChange={handleChange}>
          <option value="">Any</option>
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
