'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TripsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/')
      .then(res => res.json())
      .then(users => {
        const guest = users.find((u: any) => !u.is_host);
        if (guest) {
          return fetch(`http://127.0.0.1:8000/bookings/guest/${guest.id}`);
        }
        throw new Error("No guest found");
      })
      .then(res => res.json())
      .then(async data => {
        const enriched = await Promise.all(data.map(async (b: any) => {
          const lRes = await fetch(`http://127.0.0.1:8000/listings/${b.listing_id}`);
          const listing = await lRes.json();
          return { ...b, listing };
        }));
        enriched.sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());
        setBookings(enriched);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container" style={{ marginTop: '40px' }}>Loading your trips...</div>;
  }

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Trips</h1>
      
      {bookings.length === 0 ? (
        <div>
          <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>No trips booked... yet!</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Time to dust off your bags and start planning your next adventure.</p>
          <Link href="/" style={{ padding: '12px 24px', backgroundColor: 'var(--text-dark)', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            Start searching
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {bookings.map(booking => {
            const images = JSON.parse(booking.listing.image_urls || '[]');
            const mainImage = images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';
            
            return (
              <Link href={`/listings/${booking.listing.id}`} key={booking.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.2s', height: '100%' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image src={mainImage} alt={booking.listing.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{booking.listing.location}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{booking.listing.title}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '14px' }}>
                        <div><strong>{new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong> -</div>
                        <div><strong>{new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>Total</div>
                        <div style={{ fontWeight: 'bold' }}>₹{booking.total_price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
