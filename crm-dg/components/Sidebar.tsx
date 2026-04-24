'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  // Estado para controlar qual menu está ativo
  const [activeMenu, setActiveMenu] = useState('Visão Geral');

  const menuItems = [
    { name: 'Visão Geral', path: '/', key: 'geral' },
    { name: 'Hoje', path: '/hoje', key: 'hoje' },
    { name: 'Amanhã', path: '/amanha', key: 'amanha' },
    { name: 'Futuro', path: '/futuro', key: 'futuro' },
  ];

  return (
    <aside className="sidebar">
      {/* LOGO DG HUB */}
      <div className="logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <img 
          src="/logodg.png" 
          alt="DG HUB Logo" 
          style={{ width: '135px', height: 'auto' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="menu">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.key} style={{ textDecoration: 'none' }}>
            <button 
              className={activeMenu === item.name ? 'active' : ''}
              onClick={() => setActiveMenu(item.name)}
              style={{
                background: activeMenu === item.name ? '#7b1fa2' : 'none',
                color: activeMenu === item.name ? 'white' : '#a0a0a0',
                border: 'none',
                padding: '12px 16px',
                width: '100%',
                textAlign: 'left',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: '0.2s',
                marginBottom: '6px',
                display: 'block'
              }}
            >
              {item.name}
            </button>
          </Link>
        ))}
      </nav>

      {/* RODAPÉ DA SIDEBAR */}
      <div style={{ marginTop: 'auto', padding: '10px', fontSize: '11px', color: '#444', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '15px' }}>
        DG HUB CRM v1.2
      </div>
    </aside>
  );
}