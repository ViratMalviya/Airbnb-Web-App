'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Homes');
  const [selectedService, setSelectedService] = useState('Add service');
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const handleSearch = () => {
    setIsSearchOpen(false);
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    params.append('tab', activeTab);
    
    if (activeTab === 'Services' && selectedService !== 'Add service') {
      params.append('service', selectedService);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsSearchOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabName);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSearchOpen ? '20px' : '0' }}>
          
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="30" height="32" viewBox="0 0 32 32" style={{ fill: 'var(--primary)' }}>
              <path d="M29.24 22.68c-.16-.39-3.11-7.33-7.04-12.02-3.12-3.7-6.22-6.52-6.25-6.55L15.91 4 15.86 4.05C15.83 4.08 12.72 6.9 9.61 10.6 5.68 15.29 2.73 22.23 2.57 22.62c-.67 1.62-.35 3.3.87 4.54 1.13 1.16 2.8 1.5 4.38.9 2.3-.87 5-2.73 8.13-6.53 3.12 3.81 5.82 5.67 8.11 6.54 1.57.6 3.23.27 4.35-.88 1.2-1.24 1.51-2.92.83-4.51zM15.95 21.04c-2.48 2.87-4.66 4.38-6.4 5.04-.98.37-1.92.2-2.58-.48-.68-.69-.87-1.7-.44-2.72.1-.25 2.8-6.66 6.4-10.93C15.54 8.7 18.06 6.32 18.3 6.09c1.92 2.37 4.08 5.3 5.42 8.75-2.07-.35-4.52-.37-7.77-13.8zM26.4 26.6c-.66.68-1.58.85-2.56.49-1.73-.65-3.9-2.15-6.36-4.99 1.4-1.37 2.86-3.15 4.38-5.32 1.43 3.32 3.65 6.27 4.97 7.15.43 1.01.24 2.02-.43 2.67z" />
            </svg>
            airbnb
          </Link>

          {/* Center Navigation Tabs */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div onClick={() => handleTabClick('Homes')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: activeTab === 'Homes' ? '2px solid black' : '2px solid transparent', paddingBottom: '5px' }}>
              <span style={{ fontSize: '20px' }}>🏠</span>
              <span style={{ fontWeight: activeTab === 'Homes' ? 'bold' : 'normal', color: activeTab === 'Homes' ? 'black' : 'var(--text-light)' }}>Homes</span>
            </div>
            <div onClick={() => handleTabClick('Experiences')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: activeTab === 'Experiences' ? '2px solid black' : '2px solid transparent', paddingBottom: '5px' }}>
              <span style={{ fontSize: '20px' }}>🎈</span>
              <span style={{ fontWeight: activeTab === 'Experiences' ? 'bold' : 'normal', color: activeTab === 'Experiences' ? 'black' : 'var(--text-light)' }}>Experiences</span>
            </div>
            <div onClick={() => handleTabClick('Services')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: activeTab === 'Services' ? '2px solid black' : '2px solid transparent', paddingBottom: '5px' }}>
              <span style={{ fontSize: '20px' }}>🛎️</span>
              <span style={{ fontWeight: activeTab === 'Services' ? 'bold' : 'normal', color: activeTab === 'Services' ? 'black' : 'var(--text-light)' }}>Services</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/trips" style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
              Trips
            </Link>
            <Link href="/wishlists" style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', textDecoration: 'none', color: 'var(--text-color)' }}>
              Wishlists
            </Link>
            <Link href="/host" style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', textDecoration: 'none', color: 'var(--text-color)' }}>
              Airbnb your home
            </Link>
            <div onClick={toggleTheme} style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              {isDark ? '☀️' : '🌙'}
            </div>
            <div style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              🌐
            </div>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '30px', padding: '5px 5px 5px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative' }}
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)'}
               onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <span>☰</span>
              <div style={{ backgroundColor: 'var(--text-light)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 32 32" fill="white">
                  <path d="M16 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8.8 19.3A12 12 0 1 1 24.8 23.3l-2.4-3.5c-1.8 1.4-4.1 2.2-6.4 2.2-2.4 0-4.6-.8-6.4-2.2l-2.4 3.5z"></path>
                </svg>
              </div>
              
              {isDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px', backgroundColor: 'var(--dropdown-bg)', borderRadius: '12px', boxShadow: 'var(--card-shadow)', minWidth: '240px', padding: '10px 0', zIndex: 100 }}>
                  <Link href="/trips" style={{ display: 'block', padding: '12px 20px', fontWeight: 'bold', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Trips
                  </Link>
                  <Link href="/wishlists" style={{ display: 'block', padding: '12px 20px', fontWeight: 'bold', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Wishlists
                  </Link>
                  <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <Link href="/host" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Airbnb your home
                  </Link>
                  <div onClick={() => { addToast('Identity Verification coming soon!', 'info'); setIsDropdownOpen(false); }} style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Verify Identity
                  </div>
                  <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <div style={{ padding: '12px 20px', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Help Center
                  </div>
                  <div style={{ padding: '12px 20px', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Log out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Large Expanded Search Bar */}
        {isSearchOpen ? (
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', backgroundColor: '#ebebeb', borderRadius: '40px', width: '100%', maxWidth: '850px', border: '1px solid var(--border-color)', position: 'relative', zIndex: 101 }}>
              
              <div style={{ flex: 1.5, padding: '14px 32px', cursor: 'pointer', borderRadius: '40px' }}
                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dddddd'}
                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Where</div>
                <input 
                  type="text" 
                  placeholder={activeTab === 'Experiences' ? 'Search by city or landmark' : 'Search destinations'} 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--text-dark)' }} 
                />
              </div>

              <div style={{ width: '1px', backgroundColor: '#ccc', margin: '14px 0' }}></div>

              <div style={{ flex: 1, padding: '14px 24px', cursor: 'pointer', borderRadius: '40px' }}
                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dddddd'}
                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>When</div>
                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>Add dates</div>
              </div>

              <div style={{ width: '1px', backgroundColor: '#ccc', margin: '14px 0' }}></div>

              <div style={{ flex: 1.5, padding: '8px 8px 8px 24px', cursor: 'pointer', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{activeTab === 'Services' ? 'Type of service' : 'Who'}</div>
                  <div style={{ fontSize: '14px', color: selectedService !== 'Add service' && activeTab === 'Services' ? 'black' : 'var(--text-light)', fontWeight: selectedService !== 'Add service' && activeTab === 'Services' ? 'bold' : 'normal' }}>{activeTab === 'Services' ? selectedService : 'Add guests'}</div>
                </div>
                <button onClick={handleSearch} style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '14px 14px', borderRadius: '50%', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  🔍
                </button>
              </div>

            </div>

            {/* Floating Dropdown for Services */}
            {activeTab === 'Services' && (
              <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-10%)', backgroundColor: 'white', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 102, width: '450px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['📷 Photography', '👨‍🍳 Chefs', '💆 Massage', '🍱 Prepared meals', '⏱️ Training', '💄 Make-up', '💇 Hair', '🧖‍♀️ Spa treatments', '🥡 Catering'].map((svc) => {
                    const cleanName = svc.replace(/[^\w\s-]/gi, '').trim();
                    const isSelected = selectedService === cleanName;
                    return (
                      <div key={svc} 
                           onClick={() => setSelectedService(cleanName)}
                           style={{ border: isSelected ? '2px solid black' : '1px solid #ccc', backgroundColor: isSelected ? '#f7f7f7' : 'white', borderRadius: '30px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', transition: 'border-color 0.2s', fontWeight: isSelected ? 'bold' : 'normal' }}
                           onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.borderColor = 'black'; }}
                           onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.borderColor = '#ccc'; }}>
                        {svc}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Collapsed small search bar if not home, or just nothing on home */
          !pathname.endsWith('/') && (
             <div style={{ display: 'flex', justifyContent: 'center' }}>
               <div 
                 onClick={() => setIsSearchOpen(true)}
                 style={{ border: '1px solid var(--border-color)', borderRadius: '30px', padding: '8px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', display: 'flex', gap: '15px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
               >
                 <span>Anywhere</span>
                 <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px' }}>Any week</span>
                 <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px', color: 'var(--text-light)', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   Add guests
                   <div style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🔍</div>
                 </span>
               </div>
             </div>
          )
        )}
      </div>
    </header>
  );
}

