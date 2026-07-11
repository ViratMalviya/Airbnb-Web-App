'use client';
import { useState, useEffect } from 'react';

export default function BookingCard({ listing }: { listing: any }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookedRanges, setBookedRanges] = useState<{start: Date, end: Date}[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(`https://airbnb-web-app-5140.onrender.com/bookings/listing/${listing.id}`)
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) {
           const ranges = data.map((b: any) => ({
             start: new Date(b.check_in),
             end: new Date(b.check_out)
           }));
           setBookedRanges(ranges);
         }
      })
      .catch(console.error);
  }, [listing.id]);

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))) : 1;
  const total = listing.price_per_night * nights;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      setMessage('Please select check-in and check-out dates');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      setMessage('Check-out must be after check-in');
      return;
    }

    const isOverlap = bookedRanges.some(range => {
      // Overlap condition: A starts before B ends, and A ends after B starts
      return checkInDate < range.end && checkOutDate > range.start;
    });

    if (isOverlap) {
      setMessage('Those dates are already booked! Please select another range.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      // Hardcoded guest_id for the mock Jane Guest
      // Assuming her ID is easily found, but actually the backend will accept it. 
      // For now, let's just make the request. We might need a real ID, but the backend requires a guest_id.
      // We can just fetch the first user who is not a host.
      const usersRes = await fetch('https://airbnb-web-app-5140.onrender.com/users/');
      const users = await usersRes.json();
      const guest = users.find((u: any) => !u.is_host);
      
      const res = await fetch(`https://airbnb-web-app-5140.onrender.com/bookings/?guest_id=${guest.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: total
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to book');
      }
      
      setShowSuccess(true);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', position: 'sticky', top: '100px', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>You're all set!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', lineHeight: '1.5' }}>Your reservation for {nights} night{nights > 1 ? 's' : ''} in {listing.location} is confirmed.</p>
        <button 
          onClick={() => window.location.href = '/trips'}
          style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--text-dark)', color: 'white', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' }}
        >
          View My Trips
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', position: 'sticky', top: '100px', backgroundColor: 'white' }}>
      <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>
        ₹{listing.price_per_night} <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--text-light)' }}>night</span>
      </div>
      
      <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #b0b0b0' }}>
          <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #b0b0b0' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>CHECK-IN</div>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', marginTop: '4px' }} />
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>CHECKOUT</div>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', marginTop: '4px' }} min={checkIn} />
          </div>
        </div>
        <div style={{ padding: '10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>GUESTS</div>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', marginTop: '4px', backgroundColor: 'transparent' }}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleReserve}
        disabled={loading}
        style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s', opacity: loading ? 0.7 : 1 }} 
        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
        onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--primary)')}
      >
        {loading ? 'Processing...' : 'Reserve'}
      </button>
      
      {message && (
        <div style={{ textAlign: 'center', marginTop: '15px', color: message.includes('success') ? 'green' : 'red', fontSize: '14px' }}>
          {message}
        </div>
      )}
      
      {!message && (
        <div style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-light)', fontSize: '14px' }}>
          You won't be charged yet
        </div>
      )}

      {checkIn && checkOut && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ textDecoration: 'underline' }}>₹{listing.price_per_night} x {nights} nights</span>
            <span>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ textDecoration: 'underline' }}>Airbnb service fee</span>
            <span>₹{Math.floor(total * 0.1)}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total before taxes</span>
            <span>₹{total + Math.floor(total * 0.1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
