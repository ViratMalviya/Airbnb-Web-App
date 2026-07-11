'use client';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', backgroundColor: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

export default function SearchPage({ searchParams }: { searchParams: any }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const limit = 4;
  
  const location = searchParams?.location || 'Anywhere';
  const filtersList = ['Wifi', 'Kitchen', 'Pool', 'AC', 'Free parking', 'Washer', 'Iron'];

  const tab = searchParams?.tab || 'Homes';
  const serviceParam = searchParams?.service;

  useEffect(() => {
    const url = new URL('https://airbnb-web-app-5i40.onrender.com/listings/');
    if (location && location !== 'Anywhere') {
      url.searchParams.append('location', location);
    }
    
    // Add skip and limit
    url.searchParams.append('skip', ((page - 1) * limit).toString());
    url.searchParams.append('limit', (limit + 1).toString());
    
    // Add property_type filter based on tab
    if (tab === 'Experiences') {
      url.searchParams.append('property_type', 'Experience');
    } else if (tab === 'Services') {
      url.searchParams.append('property_type', 'Service');
      if (serviceParam) {
        url.searchParams.append('amenity', serviceParam);
      }
    } else {
      url.searchParams.append('property_type', 'Home');
    }

    // Add amenities filters
    const validAmenities = ['Wifi', 'Kitchen', 'Pool', 'AC', 'Free parking', 'Washer', 'Iron'];
    activeFilters.forEach(f => {
      if (validAmenities.includes(f)) {
        url.searchParams.append('amenity', f);
      }
    });
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        const more = data.length > limit;
        setHasMore(more);
        const results = more ? data.slice(0, limit) : data;

        if (page === 1) {
          setListings(results);
        } else {
          setListings(prev => {
            const existingIds = new Set(prev.map((l: any) => l.id));
            const newResults = results.filter((l: any) => !existingIds.has(l.id));
            return [...prev, ...newResults];
          });
        }
      })
      .catch(console.error);
  }, [activeFilters, location, tab, serviceParam, page]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
    setPage(1); // Reset to page 1 on filter change
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{listings.length} places to stay</h2>
        <button onClick={() => setShowMap(!showMap)} style={{ padding: '8px 16px', borderRadius: '30px', backgroundColor: '#222', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          {showMap ? 'Show list' : 'Show map'} <span style={{ fontSize: '18px' }}>🗺️</span>
        </button>
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
        <div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: showMap ? 1 : '1 1 100%', display: 'grid', gridTemplateColumns: showMap ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', rowGap: '40px', marginBottom: '40px' }}>
              {listings.map((listing: any, i: number) => (
                <ListingCard key={`${listing.id}-${i}`} listing={listing} />
              ))}
            </div>
            {showMap && (
              <div style={{ flex: 1, height: 'calc(100vh - 200px)', position: 'sticky', top: '20px' }}>
                <InteractiveMap listings={listings} />
              </div>
            )}
          </div>
          
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '60px' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Continue exploring {tab.toLowerCase()}</p>
              <button 
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#222',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'black'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#222'}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
