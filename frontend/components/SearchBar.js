'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Mock suggestion logic. In a real app, this might debounce an API call.
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length > 1) {
      const mockBrands = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra'];
      const mockModels = ['Swift', 'City', 'Creta', 'Nexon', 'Thar', 'Baleno'];
      
      const matched = [...mockBrands, ...mockModels].filter(item => 
        item.toLowerCase().includes(val.toLowerCase())
      );
      
      setSuggestions(matched);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by brand, model (e.g., Hyundai Creta)" 
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
        />
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              className="suggestion-item"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
