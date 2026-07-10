'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ListingCard({ listing }: { listing: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const images = JSON.parse(listing.image_urls || '[]');
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ position: 'relative', aspectRatio: '20/19', borderRadius: '16px', overflow: 'hidden' }}>
          <Image 
            src={mainImage} 
            alt={listing.title} 
            fill 
            style={{ objectFit: 'cover' }} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}>
              <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
            </svg>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0', fontSize: '15px', fontWeight: 'bold' }}>{listing.location}</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
              ★ {listing.rating.toFixed(2)}
            </span>
          </div>
          <p style={{ margin: '2px 0', color: 'var(--text-light)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {listing.title}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: 'var(--text-dark)' }}>
            <span style={{ fontWeight: 'bold' }}>${listing.price_per_night}</span> night
          </p>
        </div>
      </div>
    </Link>
  );
}
