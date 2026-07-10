'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ListingCard from '@/components/ListingCard';

const MOCK_HOMES_ROW_1 = [
  { id: 'h1', title: 'Flat in Calangute', location: 'Goa, India', price_per_night: 10009, rating: 5.0, image_urls: '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]' },
  { id: 'h2', title: 'Flat in Candolim', location: 'Goa, India', price_per_night: 11499, rating: 4.93, image_urls: '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]' },
  { id: 'h3', title: 'Flat in Anjuna', location: 'Goa, India', price_per_night: 8036, rating: 4.92, image_urls: '["https://images.unsplash.com/photo-1493809842364-494fcb2362b9?w=800&q=80"]' },
  { id: 'h4', title: 'Home in Candolim', location: 'Goa, India', price_per_night: 3558, rating: 4.81, image_urls: '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]' },
];

const MOCK_HOMES_ROW_2 = [
  { id: 'h5', title: 'Farm stay in Auroville', location: 'Puducherry, India', price_per_night: 4337, rating: 4.91, image_urls: '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]' },
  { id: 'h6', title: 'Home in Puducherry', location: 'Puducherry, India', price_per_night: 4564, rating: 4.96, image_urls: '["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"]' },
  { id: 'h7', title: 'Place to stay in Puducherry', location: 'Puducherry, India', price_per_night: 1484, rating: 4.82, image_urls: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"]' },
  { id: 'h8', title: 'Boutique hotel', location: 'Puducherry, India', price_per_night: 5400, rating: 4.92, image_urls: '["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80"]' },
];



export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'Homes';

  const [searchLocation, setSearchLocation] = useState('India');
  const [checkIn, setCheckIn] = useState('2024-07-14');
  const [checkOut, setCheckOut] = useState('2024-07-15');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const [realHomes, setRealHomes] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/listings/')
      .then(res => res.json())
      .then(data => setRealHomes(data))
      .catch(console.error);
  }, []);

  const handleHeroSearch = () => {
    const totalGuests = adults + children;
    router.push(`/search?location=${encodeURIComponent(searchLocation)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${totalGuests}`);
  };

  const renderRow = (title: string, data: any[]) => (
    <div style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>{title}</h2>
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {data.map(listing => (
          <div key={listing.id} style={{ minWidth: '280px', flex: '0 0 280px' }}>
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingBottom: '40px', paddingTop: '40px' }}>
      
      {/* Original Hero Section */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '600px', borderRadius: '24px', overflow: 'hidden', marginBottom: '60px', margin: '0 auto 60px auto' }}>
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
              <input type="text" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: 0 }} />
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
          
          <button onClick={handleHeroSearch} style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}>
            Search
          </button>
        </div>
      </div>

      {tab === 'Homes' && (
        <>
          {renderRow('Popular homes in North Goa', realHomes.filter(h => h.location.includes('Goa')))}
          {renderRow('Available in Puducherry this weekend', realHomes.filter(h => h.location.includes('Puducherry')))}
        </>
      )}

      {tab === 'Experiences' && (
        <>
          {renderRow('Happening today in Bengaluru', realHomes.filter(h => h.property_type === 'Experience'))}
          {renderRow('Tomorrow in Bengaluru', [...realHomes.filter(h => h.property_type === 'Experience')].reverse())}
        </>
      )}

      {tab === 'Services' && (
        <>
          {renderRow('Services in South Goa', realHomes.filter(h => h.property_type === 'Service'))}
        </>
      )}

    </div>
  );
}


