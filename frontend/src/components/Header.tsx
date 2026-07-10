'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [guests, setGuests] = useState(0);

  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px' }}>
          airbnb
        </Link>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ border: '1px solid var(--border-color)', borderRadius: '24px', padding: '10px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)'}
          >
            <span>Anywhere</span>
            <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px' }}>Any week</span>
            <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px', color: guests > 0 ? 'var(--text-dark)' : 'var(--text-light)', fontWeight: guests > 0 ? 'bold' : 'normal' }}>
              {guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}
            </span>
          </div>
          
          {isSearchOpen && (
            <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', width: '300px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 200 }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Where</div>
                <input type="text" placeholder="Search destinations" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Who</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Guests</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => setGuests(Math.max(0, guests - 1))} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                    <span>{guests}</span>
                    <button onClick={() => setGuests(guests + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>
                Search
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/host" style={{ padding: '10px', borderRadius: '21px' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Airbnb your home
          </Link>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '21px', padding: '5px 5px 5px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
             onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)'}
             onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <span>☰</span>
            <div style={{ backgroundColor: 'var(--text-light)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>U</div>
          </div>
        </div>
      </div>
    </header>
  );
}
