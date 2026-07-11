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
    fetch('https://airbnb-web-app-5140.onrender.com/listings/')
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
                <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: '0', backgroundColor: 'transparent', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=%27black%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right center' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, padding: '10px 14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Children</div>
                <select value={children} onChange={(e) => setChildren(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', marginTop: '4px', padding: '0', backgroundColor: 'transparent', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=%27black%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right center' }}>
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
          
          {/* Feature Highlights Section */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '80px', marginTop: '40px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}><path d="M16 1c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15C1 7.716 7.716 1 16 1zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3zm5.293 8.293a1 1 0 0 1 1.414 0l.086.094a1 1 0 0 1-.086 1.32l-7 7a1 1 0 0 1-1.32.086l-.094-.086-3-3a1 1 0 0 1 1.32-1.498l.094.084L15 14.585l6.293-6.292z"></path></svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Enjoy some flexibility</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.4' }}>Stays with flexible cancellation make it easy to rebook if your plans change.</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}><path d="M25 4a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18zm0 2H7v17h18V6zM12 11h8v2h-8v-2zm0 4h8v2h-8v-2z"></path></svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>More than 7M active listings</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.4' }}>Join more than 1 billion guests who've found getaways in over 220 countries and destinations.</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}><path d="M12 2h8v4h-8V2zm14 1v2h-4v-2h4zM6 3v2H2V3h4zm16 8h8v2h-8v-2zm-6 1v2H2v-2h14zm-4 7h4v4h-4v-4zm14 1v2h-8v-2h8zM8 20v2H2v-2h6z"></path></svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>100+ filters for tailored stays</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.4' }}>Pick your price range, the number of rooms you want and other key amenities to find the stay that fits your needs.</p>
            </div>
          </div>

          {/* Big, small, we have it all Section */}
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' }}>Big, small, we have it all</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push('/search?property_type=Home')}>
                <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                  <Image src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" alt="Houses" fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Houses <span style={{ fontWeight: 'normal' }}>›</span></h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.4' }}>If you need extra space, get an entire place all to yourself.</p>
              </div>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push('/search?property_type=Apartment')}>
                <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                  <Image src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" alt="Flats" fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Flats <span style={{ fontWeight: 'normal' }}>›</span></h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.4' }}>Stay in some of the most convenient locations with spaces in shared buildings.</p>
              </div>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push('/search?property_type=Room')}>
                <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                  <Image src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80" alt="Private rooms" fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Private rooms <span style={{ fontWeight: 'normal' }}>›</span></h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.4' }}>Enjoy your own sleeping space and share a common area with others.</p>
              </div>
            </div>
          </div>
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


