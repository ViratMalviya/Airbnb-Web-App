'use client';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';



export default function SearchPage({ searchParams }: { searchParams: any }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  
  const location = searchParams?.location || 'Anywhere';
  const filtersList = ['Price', 'Type of place', 'Free cancellation', 'Wifi', 'Kitchen', 'Washer', 'Iron'];

  const tab = searchParams?.tab || 'Homes';
  const serviceParam = searchParams?.service;

  useEffect(() => {
    const url = new URL('http://127.0.0.1:8000/listings/');
    if (location && location !== 'Anywhere') {
      url.searchParams.append('location', location);
    }
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        let filtered = data.filter((d: any) => {
          if (tab === 'Experiences') return d.property_type === 'Experience';
          if (tab === 'Services') {
            if (d.property_type !== 'Service') return false;
            if (serviceParam) {
              try {
                const amenities = JSON.parse(d.amenities || '[]');
                return amenities.includes(serviceParam);
              } catch (e) {
                return false;
              }
            }
            return true;
          }
          return d.property_type !== 'Experience' && d.property_type !== 'Service';
        });

        if (activeFilters.length > 0) {
          filtered = filtered.slice(0, Math.max(1, filtered.length - activeFilters.length));
        }

        setListings(filtered);
      })
      .catch(console.error);
  }, [activeFilters, location, tab, serviceParam]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '40px', paddingTop: '20px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
          300+ stays · {location}
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
          Stays in {location}
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {filtersList.map(filter => {
          const isActive = activeFilters.includes(filter);
          return (
            <button 
              key={filter} 
              onClick={() => toggleFilter(filter)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '30px', 
                border: isActive ? '2px solid black' : '1px solid var(--border-color)', 
                backgroundColor: isActive ? '#f7f7f7' : 'white', 
                cursor: 'pointer', 
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--text-dark)', marginBottom: '10px' }}>No exact matches</h2>
          <p>Try changing or removing some of your filters or adjusting your search area.</p>
          <button 
            onClick={() => setActiveFilters([])}
            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--text-dark)', fontWeight: 'bold', backgroundColor: 'white', cursor: 'pointer' }}
          >
            Remove all filters
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px',
          rowGap: '40px'
        }}>
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
