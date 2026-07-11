import Image from 'next/image';
import BookingCard from '@/components/BookingCard';
import { ContactHostButton, MapPlaceholder } from '@/components/ClientPlaceholders';

async function getListing(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/listings/${id}`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch listing');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getHost(hostId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/users/`, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const users = await res.json();
    return users.find((u: any) => u.id === hostId) || null;
  } catch (e) {
    return null;
  }
}

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  const host = listing ? await getHost(listing.host_id) : null;

  if (!listing) {
    return <div className="container" style={{ marginTop: '40px' }}>Listing not found</div>;
  }

  const images = JSON.parse(listing.image_urls || '[]');
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';

  const allFallbacks = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1e52d1590c?w=800&q=80',
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'
  ];

  const hash = listing.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const imgOffset = hash % (allFallbacks.length - 3);
  const fallbacks = allFallbacks.slice(imgOffset, imgOffset + 4);
  
  const hostName = host ? host.name : 'Host';

  return (
    <div className="container" style={{ marginTop: '20px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{listing.title}</h1>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', color: 'var(--text-light)', alignItems: 'center' }}>
        {listing.rating >= 4.8 && <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', display: 'flex', alignItems: 'center' }}>⭐ Guest favorite · </span>}
        <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>★ {listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
        <span>·</span>
        <span style={{ textDecoration: 'underline', color: 'black' }}>{listing.location}</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <Image src={mainImage} alt={listing.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px' }}>
          <div style={{ position: 'relative' }}><Image src={images[1] || fallbacks[0]} alt="Gallery 1" fill style={{ objectFit: 'cover' }} /></div>
          <div style={{ position: 'relative' }}><Image src={images[2] || fallbacks[1]} alt="Gallery 2" fill style={{ objectFit: 'cover' }} /></div>
          <div style={{ position: 'relative' }}><Image src={images[3] || fallbacks[2]} alt="Gallery 3" fill style={{ objectFit: 'cover' }} /></div>
          <div style={{ position: 'relative' }}><Image src={images[4] || fallbacks[3]} alt="Gallery 4" fill style={{ objectFit: 'cover' }} /></div>
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '40px', gap: '80px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Entire {listing.property_type.toLowerCase()} hosted by {hostName}</div>
              <div style={{ color: 'var(--text-light)', marginTop: '5px' }}>{listing.max_guests || 4} guests · 2 bedrooms · 1 bed · 1 bath</div>
            </div>
            {host?.avatar_url ? (
              <Image src={host.avatar_url} alt={hostName} width={50} height={50} style={{ borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#64748b' }}>
                {hostName[0]}
              </div>
            )}
          </div>
          <div style={{ marginTop: '15px' }}>
             <ContactHostButton />
          </div>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
          
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

      {/* Reviews Section */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '40px 0' }} />
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>★</span> {listing.rating > 0 ? `${listing.rating.toFixed(2)} · 128 reviews` : 'No reviews (yet)'}
        </h2>
      </div>

      {listing.rating > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 80px', marginBottom: '40px' }}>
            {[
              { label: 'Cleanliness', rating: '4.9' },
              { label: 'Accuracy', rating: '4.8' },
              { label: 'Communication', rating: '5.0' },
              { label: 'Location', rating: '4.9' },
              { label: 'Check-in', rating: '5.0' },
              { label: 'Value', rating: '4.7' },
            ].map(cat => (
              <div key={cat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px' }}>{cat.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '150px' }}>
                  <div style={{ height: '4px', backgroundColor: '#e2e2e2', width: '100%', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: '#222', width: `${(parseFloat(cat.rating) / 5) * 100}%` }}></div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', width: '20px', textAlign: 'right' }}>{cat.rating}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' }}>
            {(() => {
              const allReviews = [
                { name: 'Sarah', date: 'October 2023', text: 'Absolutely incredible stay. The views were breathtaking and the host was very responsive. Would definitely come back!' },
                { name: 'Michael', date: 'September 2023', text: 'Clean, spacious, and perfectly located. Walking distance to everything we needed. Highly recommend this property.' },
                { name: 'David', date: 'August 2023', text: 'Beautiful place with amazing amenities. The wifi was fast and the kitchen had everything we needed to cook.' },
                { name: 'Emily', date: 'July 2023', text: 'Host was incredibly accommodating and let us check in early. The space was spotless and exactly as described.' },
                { name: 'Alex', date: 'June 2023', text: 'A fantastic getaway! The attention to detail in the decor really made it feel like home. We loved every second of it.' },
                { name: 'Jessica', date: 'May 2023', text: 'Highly recommend! The neighborhood is quiet but close to the best restaurants. The beds were extremely comfortable.' },
                { name: 'Ryan', date: 'April 2023', text: 'Check-in was seamless, and the property exceeded our expectations in every way. The outdoor area is perfect for relaxing.' },
                { name: 'Olivia', date: 'March 2023', text: 'We had a wonderful family vacation here. There was plenty of space for everyone and the local recommendations were spot on.' }
              ];
              const revOffset = hash % (allReviews.length - 3);
              const selectedReviews = allReviews.slice(revOffset, revOffset + 4);
              
              return selectedReviews.map(review => (
                <div key={review.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {review.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{review.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>{review.date}</div>
                    </div>
                  </div>
                  <p style={{ lineHeight: '1.5' }}>{review.text}</p>
                </div>
              ));
            })()}
          </div>
          <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
          
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Where you'll be</h2>
          <MapPlaceholder location={listing.location} />

        </>
      )}
    </div>
  );
}

