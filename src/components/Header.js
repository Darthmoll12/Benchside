import React from 'react'
import Image from 'next/image'
import logo from '../../public/Benchside_logo_transparent.png'

function Header() {
  return (
    <header style={{ 
      width: '100%', 
      backgroundColor: '#ffffff', // Ensures logo isn't lost on dark backgrounds
      display: 'flex', 
      justifyContent: 'left',   // justifies the logo
      borderBottom: '1px solid #eaeaea' 
    }}>
      <div style={{ position: 'relative', width: '300px', height: '100px' }}> 
        {/* 'fill' makes the logo take up the space of the parent div */}
        <Image 
          src={logo} 
          alt="Benchside Logo" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority 
        />
      </div>
    </header>
  );
}

export default Header;