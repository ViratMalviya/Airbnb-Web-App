import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

async function getListings(searchParams: any) {
  try {
    const { location, guests } = searchParams;
    let url = 'http://127.0.0.1:8000/listings/?';
    if (location) url += `location=${encodeURIComponent(location)}&`;
    if (guests) url += `min_guests=${guests}`;
    
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const listings = await getListings(searchParams);
  const location = searchParams.location || 'Anywhere';
  const guests = searchParams.guests || '';

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

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['Price', 'Type of place', 'Free cancellation', 'Wifi', 'Kitchen', 'Washer', 'Iron'].map(filter => (
          <button key={filter} style={{ padding: '8px 16px', borderRadius: '30px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px' }}>
            {filter}
          </button>
        ))}
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--text-dark)', marginBottom: '10px' }}>No exact matches</h2>
          <p>Try changing or removing some of your filters or adjusting your search area.</p>
          <Link href="/">
            <button style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--text-dark)', fontWeight: 'bold', backgroundColor: 'white', cursor: 'pointer' }}>
              Remove all filters
            </button>
          </Link>
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
