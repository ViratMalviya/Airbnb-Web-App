'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet's default icon path issues with Webpack
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a custom price pin icon
const createPriceIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-price-pin',
    html: `<div style="background-color: white; border-radius: 20px; padding: 5px 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 1px solid #ccc; font-size: 14px;">₹${price}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

export default function InteractiveMap({ listings }: { listings: any[] }) {
  // Simple mock geocoding based on location string hash to scatter pins
  const getCoordinates = (listing: any) => {
    let lat = 20.5937; // Center of India default
    let lng = 78.9629;
    
    if (listing.location.includes('New York')) { lat = 40.7128; lng = -74.0060; }
    else if (listing.location.includes('Malibu') || listing.location.includes('USA')) { lat = 34.0259; lng = -118.7798; }
    else if (listing.location.includes('Goa')) { lat = 15.2993; lng = 74.1240; }
    else if (listing.location.includes('Shimla') || listing.location.includes('Kufri')) { lat = 31.1048; lng = 77.1734; }
    
    // Add small random offset based on ID to separate pins in the same city
    const hash = listing.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const offsetLat = (hash % 100) * 0.0005;
    const offsetLng = (hash % 100) * 0.0005;
    
    return [lat + offsetLat, lng + offsetLng] as [number, number];
  };

  // Default center
  const center: [number, number] = listings.length > 0 ? getCoordinates(listings[0]) : [20.5937, 78.9629];

  return (
    <div style={{ height: '100%', width: '100%', position: 'sticky', top: '100px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map(listing => (
          <Marker key={listing.id} position={getCoordinates(listing)} icon={createPriceIcon(listing.price_per_night)}>
            <Popup>
              <div style={{ padding: '5px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{listing.title}</h3>
                <p style={{ margin: 0 }}>₹{listing.price_per_night} / night</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
