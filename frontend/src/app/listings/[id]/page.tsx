import Link from 'next/link';

export default function ListingDetail() {
  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>Cozy Beachfront Cottage</h1>
      <div style={{ display: 'flex', gap: '10px', color: 'var(--text-light)', marginBottom: '20px' }}>
        <span>★ 4.90</span>
        <span>•</span>
        <span style={{ textDecoration: 'underline' }}>Malibu, USA</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ flex: 1, backgroundColor: '#eaeaea' }}></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ flex: 1, backgroundColor: '#d5d5d5' }}></div>
          <div style={{ flex: 1, backgroundColor: '#cccccc' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: '40px', gap: '80px' }}>
        <div style={{ flex: 2 }}>
          <h2 style={{ fontSize: '22px' }}>Entire cottage hosted by John</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>4 guests · 2 bedrooms · 1 bed · 1 bath</p>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />
          
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>About this space</h3>
          <p style={{ lineHeight: '1.6' }}>A lovely beachfront cottage with beautiful views. Enjoy the sound of the waves and beautiful sunsets right from the patio.</p>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', position: 'sticky', top: '100px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>$250 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>night</span></div>
            
            <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #b0b0b0' }}>
                <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #b0b0b0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold' }}>CHECK-IN</div>
                  <div style={{ fontSize: '14px' }}>Add date</div>
                </div>
                <div style={{ flex: 1, padding: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold' }}>CHECKOUT</div>
                  <div style={{ fontSize: '14px' }}>Add date</div>
                </div>
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>GUESTS</div>
                <div style={{ fontSize: '14px' }}>1 guest</div>
              </div>
            </div>
            
            <button style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s' }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}>
              Reserve
            </button>
            <div style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-light)', fontSize: '14px' }}>You won't be charged yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
