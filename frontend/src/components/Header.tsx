import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px' }}>
          airbnb
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '24px', padding: '10px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', fontWeight: 'bold', fontSize: '14px' }}>
            <span>Anywhere</span>
            <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px' }}>Any week</span>
            <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px', color: 'var(--text-light)', fontWeight: 'normal' }}>Add guests</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/host">Airbnb your home</Link>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '21px', padding: '5px 5px 5px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>☰</span>
            <div style={{ backgroundColor: 'var(--text-light)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>U</div>
          </div>
        </div>
      </div>
    </header>
  );
}
