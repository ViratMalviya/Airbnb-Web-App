import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* SVG Airbnb Logo */}
          <svg width="30" height="32" viewBox="0 0 32 32" style={{ fill: 'var(--primary)' }}>
            <path d="M29.24 22.68c-.16-.39-3.11-7.33-7.04-12.02-3.12-3.7-6.22-6.52-6.25-6.55L15.91 4 15.86 4.05C15.83 4.08 12.72 6.9 9.61 10.6 5.68 15.29 2.73 22.23 2.57 22.62c-.67 1.62-.35 3.3.87 4.54 1.13 1.16 2.8 1.5 4.38.9 2.3-.87 5-2.73 8.13-6.53 3.12 3.81 5.82 5.67 8.11 6.54 1.57.6 3.23.27 4.35-.88 1.2-1.24 1.51-2.92.83-4.51zM15.95 21.04c-2.48 2.87-4.66 4.38-6.4 5.04-.98.37-1.92.2-2.58-.48-.68-.69-.87-1.7-.44-2.72.1-.25 2.8-6.66 6.4-10.93C15.54 8.7 18.06 6.32 18.3 6.09c1.92 2.37 4.08 5.3 5.42 8.75-2.07-.35-4.52-.37-7.77-13.8zM26.4 26.6c-.66.68-1.58.85-2.56.49-1.73-.65-3.9-2.15-6.36-4.99 1.4-1.37 2.86-3.15 4.38-5.32 1.43 3.32 3.65 6.27 4.97 7.15.43 1.01.24 2.02-.43 2.67z" />
          </svg>
          airbnb
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/host" style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
            Airbnb your place
          </Link>
        </div>
      </div>
    </header>
  );
}

