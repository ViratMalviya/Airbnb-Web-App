'use client';
import { useEffect, useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistsPage() {
  const { favorites } = useWishlist();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    
    // Fetch all listings and filter on frontend for simplicity
    fetch('https://airbnb-web-app-5140.onrender.com/listings/')
      .then(res => res.json())
      .then(data => {
        const favoritedListings = data.filter((l: any) => favorites.includes(l.id));
        setListings(favoritedListings);
        setLoading(false);
      })
      .catch(console.error);
  }, [favorites]);

  if (loading) return <div className="container" style={{ marginTop: '40px' }}>Loading wishlists...</div>;

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Wishlists</h1>
      
      {listings.length === 0 ? (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Create your first wishlist</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>As you search, click the heart icon to save your favorite places and Experiences to a wishlist.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
