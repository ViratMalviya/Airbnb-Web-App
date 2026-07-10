import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Placeholder for Listings Grid */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', width: '300px' }}>
          <div style={{ height: '200px', backgroundColor: '#eaeaea' }}></div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Malibu, USA</h3>
            <p style={{ color: 'var(--text-light)', margin: '0 0 8px 0' }}>Beachfront Cottage</p>
            <p style={{ margin: '0', fontWeight: 'bold' }}>$250 <span style={{ fontWeight: 'normal' }}>night</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
