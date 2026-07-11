'use client';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';

export function ContactHostButton() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast('Messaging between guest and host coming soon!', 'info')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid black', backgroundColor: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}>
      Contact Host
    </button>
  );
}

export function MapPlaceholder({ location }: { location: string }) {
  const { addToast } = useToast();
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map Placeholder" fill style={{ objectFit: 'cover', opacity: 0.8 }} />
      <div style={{ position: 'absolute', backgroundColor: 'white', padding: '15px 25px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 }} onClick={() => addToast('Real-time map with live pricing pins coming soon!', 'info')}>
        <span style={{ fontSize: '18px' }}>📍 {location}</span>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-light)' }}>Map View (Coming Soon)</p>
      </div>
    </div>
  );
}
