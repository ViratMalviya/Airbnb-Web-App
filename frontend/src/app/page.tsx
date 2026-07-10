'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [location, setLocation] = useState('India');
  const [checkIn, setCheckIn] = useState('2024-07-14');
  const [checkOut, setCheckOut] = useState('2024-07-15');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearch = () => {
    alert(`Searching for properties in ${location} from ${checkIn} to ${checkOut} for ${adults} adults and ${children} children.`);
    // Here we would typically route to a /search page or fetch results
  };

  return (
    <div className="container" style={{ paddingBottom: '40px', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '600px', borderRadius: '24px', overflow: 'hidden' }}>
        <Image src="/hero.png" alt="Airbnb interior" fill style={{ objectFit: 'cover' }} priority />
        
        {/* Floating Card */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '400px', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.2' }}>
            Find places to stay on Airbnb
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '24px', lineHeight: '1.4' }}>
            Discover entire homes and rooms perfect for any trip.
          </p>
          
          <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #b0b0b0' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Location</div>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: 0 }} />
            </div>
            
            <div style={{ display: 'flex', borderBottom: '1px solid #b0b0b0' }}>
              <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid #b0b0b0' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Check in</div>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', marginTop: '4px', padding: 0 }} />
              </div>
              <div style={{ flex: 1, padding: '10px 14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Check out</div>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', marginTop: '4px', padding: 0 }} min={checkIn} />
              </div>
            </div>
            
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid #b0b0b0' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Adults</div>
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: 0, backgroundColor: 'transparent' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, padding: '10px 14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Children</div>
                <select value={children} onChange={(e) => setChildren(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: 0, backgroundColor: 'transparent' }}>
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <button onClick={handleSearch} style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}


