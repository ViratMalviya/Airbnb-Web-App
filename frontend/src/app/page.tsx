import ListingCard from '@/components/ListingCard';

async function getListings() {
  try {
    const res = await fetch('http://127.0.0.1:8000/listings/', { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const listings = await getListings();

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      
      {/* Categories Row placeholder */}
      <div style={{ display: 'flex', gap: '30px', padding: '20px 0', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
        {['Amazing pools', 'Beachfront', 'Cabins', 'OMG!', 'Farms', 'Mansions'].map(cat => (
          <div key={cat} className="category-item">
            <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--text-dark)', mask: 'url(https://unpkg.com/lucide-static@0.321.0/icons/tent.svg) no-repeat center', WebkitMask: 'url(https://unpkg.com/lucide-static@0.321.0/icons/tent.svg) no-repeat center' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cat}</span>
          </div>
        ))}
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
          No listings found. Make sure the backend is running.
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

