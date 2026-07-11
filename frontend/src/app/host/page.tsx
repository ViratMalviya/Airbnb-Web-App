'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';

export default function HostDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [hostId, setHostId] = useState<string>('');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToast } = useToast();
  
  const defaultForm = {
    title: '', description: '', location: '', price_per_night: 1000,
    property_type: 'Home', amenities: '["Wifi","Kitchen"]', image_urls: '["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"]'
  };
  
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetch('https://airbnb-web-app-5i40.onrender.com/users/')
      .then(res => res.json())
      .then(users => {
        const host = users.find((u: any) => u.is_host);
        if (host) {
          setHostId(host.id);
          return Promise.all([
            fetch(`https://airbnb-web-app-5i40.onrender.com/listings/host/${host.id}`).then(r => r.json()),
            fetch(`https://airbnb-web-app-5i40.onrender.com/bookings/host/${host.id}`).then(r => r.json())
          ]);
        }
        throw new Error("No host found");
      })
      .then(async ([lData, bData]) => {
        setListings(lData);
        
        // Enrich bookings with listing data
        const enrichedBData = bData.map((b: any) => {
           const listing = lData.find((l: any) => l.id === b.listing_id);
           return { ...b, listing };
        });
        enrichedBData.sort((a: any, b: any) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());
        setBookings(enrichedBData);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `https://airbnb-web-app-5i40.onrender.com/listings/${editingId}`
        : `https://airbnb-web-app-5i40.onrender.com/listings/?host_id=${hostId}`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const savedListing = await res.json();
        if (editingId) {
          setListings(listings.map(l => l.id === editingId ? savedListing : l));
          addToast('Listing updated successfully', 'success');
        } else {
          setListings([savedListing, ...listings]);
          addToast('Listing created successfully', 'success');
        }
        setIsCreating(false);
        setEditingId(null);
        setFormData(defaultForm);
      } else {
        addToast('Failed to save listing', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Error connecting to backend', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`https://airbnb-web-app-5i40.onrender.com/listings/${id}`, { method: 'DELETE' });
      if(res.ok) {
        setListings(listings.filter(l => l.id !== id));
        addToast('Listing deleted', 'success');
      } else {
        addToast('Failed to delete listing', 'error');
      }
    } catch (e) {
      addToast('Failed to delete', 'error');
    }
  };

  const handleEdit = (listing: any) => {
    setFormData({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      price_per_night: listing.price_per_night,
      property_type: listing.property_type,
      amenities: listing.amenities,
      image_urls: listing.image_urls
    });
    setEditingId(listing.id);
    setIsCreating(true);
  };

  if (loading) return <div className="container" style={{ marginTop: '40px' }}>Loading Host Dashboard...</div>;

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Host Dashboard</h1>
        {!isCreating && (
          <button onClick={() => { setFormData(defaultForm); setEditingId(null); setIsCreating(true); }} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            + Create Listing
          </button>
        )}
      </div>

      {isCreating ? (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{editingId ? 'Edit Listing' : 'List your place'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Property Type</label>
                <select value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                  <option value="Home">Home</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Experience">Experience</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (₹)</label>
                <input required type="number" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amenities (JSON Array String)</label>
              <input required type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} placeholder='["Wifi", "Pool"]' />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload Image</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setFormData({...formData, image_urls: JSON.stringify([base64String])});
                  };
                  reader.readAsDataURL(file);
                }
              }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              {formData.image_urls && formData.image_urls !== '[]' && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: 'green' }}>✓ Image ready</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{editingId ? 'Update Listing' : 'Save Listing'}</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Your Properties</h2>
          {listings.length === 0 ? (
            <p>You have no listings.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '50px' }}>
              {listings.map((listing: any) => {
                const images = JSON.parse(listing.image_urls || '[]');
                const mainImage = images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';
                
                return (
                  <div key={listing.id} style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '15px', gap: '20px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={mainImage} alt={listing.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{listing.title}</h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '4px' }}>{listing.location} · {listing.property_type}</p>
                      <p style={{ fontWeight: 'bold' }}>₹{listing.price_per_night} / night</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(listing)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(listing.id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#e53e3e', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Upcoming Reservations</h2>
          {bookings.length === 0 ? (
            <p>No upcoming reservations.</p>
          ) : (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f7f7f7', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th style={{ padding: '15px' }}>Guest</th>
                    <th style={{ padding: '15px' }}>Property</th>
                    <th style={{ padding: '15px' }}>Dates</th>
                    <th style={{ padding: '15px' }}>Total Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '15px' }}>{booking.guest_id.substring(0,8)}...</td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{booking.listing?.title || 'Unknown Property'}</td>
                      <td style={{ padding: '15px' }}>{new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: 'green' }}>₹{booking.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
