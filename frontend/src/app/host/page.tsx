import Link from 'next/link';

export default function HostDashboard() {
  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px' }}>Welcome back, Host</h1>
        <button style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>
          Create new listing
        </button>
      </div>

      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="var(--text-light)" style={{ display: 'inline-block' }}>
            <path d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12.014 12.014 0 0 1-12 12z"></path>
            <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z"></path>
            <path d="M17 14h-2v10h2z"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>You don't have any listings yet</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>It’s easy to start hosting on Airbnb.</p>
        <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--text-dark)', fontWeight: 'bold' }}>
          Set up a new listing
        </button>
      </div>
    </div>
  );
}
