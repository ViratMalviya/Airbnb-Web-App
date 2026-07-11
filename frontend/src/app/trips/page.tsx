'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function TripsPage() {
  const { addToast } = useToast();
  const [reviewingBooking, setReviewingBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
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

  const submitReview = async () => {
    try {
      const guestId = reviewingBooking.guest_id;
      const res = await fetch(`http://127.0.0.1:8000/reviews/?guest_id=${guestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: reviewingBooking.listing.id,
          rating,
          comment
        })
      });
      if (res.ok) {
        addToast('Review submitted successfully! You are a Superguest.', 'success');
        setReviewingBooking(null);
        setRating(5);
        setComment('');
      } else {
        addToast('Failed to submit review.', 'error');
      }
    } catch(e) {
      addToast('Error submitting review', 'error');
    }
  };

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
                    <div style={{ marginTop: '12px' }}>
                      <button onClick={(e) => { e.preventDefault(); setReviewingBooking(booking); }} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', fontWeight: 'bold', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor='var(--card-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='transparent'}>
                        Leave a Review
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {reviewingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setReviewingBooking(null)}>
          <div style={{ backgroundColor: 'var(--dropdown-bg)', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 8px 28px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Review your stay at {reviewingBooking.listing.title}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Rating (1-5)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer', fontSize: '32px', color: star <= rating ? '#ffb400' : 'var(--border-color)' }}>★</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Share your experience</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-dark)' }} placeholder="What did you love about this place?"></textarea>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setReviewingBooking(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitReview} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
