import Image from 'next/image';
import BookingCard from '@/components/BookingCard';

async function getListing(id: str) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/listings/${id}`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch listing');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    return <div className="container" style={{ marginTop: '40px' }}>Listing not found</div>;
  }

  const images = JSON.parse(listing.image_urls || '[]');
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="container" style={{ marginTop: '20px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>{listing.title}</h1>
      <div style={{ display: 'flex', gap: '10px', color: 'var(--text-light)', marginBottom: '20px' }}>
        <span>★ {listing.rating.toFixed(2)}</span>
        <span>•</span>
        <span style={{ textDecoration: 'underline' }}>{listing.location}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Image src={mainImage} alt={listing.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative', backgroundColor: '#eaeaea' }}>
             {/* If we had more images, we'd put them here. For now, we'll just show placeholders or duplicate */}
          </div>
          <div style={{ flex: 1, position: 'relative', backgroundColor: '#eaeaea' }}>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '40px', gap: '80px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 500px' }}>
          <h2 style={{ fontSize: '22px' }}>Entire {listing.property_type.toLowerCase()} hosted by Host</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>4 guests · 2 bedrooms · 1 bed · 1 bath</p>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />
          
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>About this space</h3>
          <p style={{ lineHeight: '1.6' }}>{listing.description}</p>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />
          
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>What this place offers</h3>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {JSON.parse(listing.amenities || '[]').map((amenity: string, idx: number) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--text-light)' }}>✓</span> {amenity}
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ flex: '1 1 300px' }}>
          <BookingCard listing={listing} />
        </div>
      </div>
    </div>
  );
}

