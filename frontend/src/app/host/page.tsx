'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

export default function HostDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [listings, setListings] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', price_per_night: 1000,
    max_guests: 2, bedrooms: 1, bathrooms: 1, image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/listings/')
      .then(res => res.json())
      .then(data => setListings(data.slice(0, 3))) // Mock: show first 3 as "host's"
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/listings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newListing = await res.json();
        setListings([newListing, ...listings] as any);
        alert('Listing created successfully!');
        setIsCreating(false);
      } else {
        alert('Failed to create listing. Make sure backend is running.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to backend.');
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Welcome back, Host</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            Create new listing
          </button>
        )}
      </div>

      {isCreating ? (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>List your place</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
              <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (₹)</label>
                <input required type="number" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Guests</label>
                <input required type="number" value={formData.max_guests} onChange={e => setFormData({...formData, max_guests: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Save Listing</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Your listings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
