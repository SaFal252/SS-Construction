import React from 'react';

const Logo = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 56, height: 56 },
    lg: { width: 80, height: 80 },
    xl: { width: 120, height: 120 }
  };

  const { width, height } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        {/* First S - Building shape */}
        <path
          d="M15 35 L15 85 L45 85 L45 65 L30 65 L30 50 L45 50 L45 35 Z"
          fill="#FFD700"
          className="logo-first-s"
        />
        
        {/* Second S - Building shape (overlapping) */}
        <path
          d="M45 35 L45 85 L75 85 L75 65 L60 65 L60 50 L75 50 L75 35 Z"
          fill="#B8860B"
          className="logo-second-s"
        />
        
        {/* House roof icon */}
        <path
          d="M85 45 L100 65 L70 65 Z"
          fill="#FFD700"
          className="logo-roof"
        />
        
        {/* House base */}
        <rect
          x="78"
          y="65"
          width="22"
          height="18"
          fill="#1a1a1a"
          className="logo-base"
        />
        
        {/* Door */}
        <rect
          x="84"
          y="73"
          width="10"
          height="10"
          fill="#FFD700"
          className="logo-door"
        />
      </svg>
      
      {/* Text part - shown on larger sizes */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wider" style={{ 
            color: '#FFD700',
            fontFamily: 'Playfair Display, serif',
            lineHeight: 1.1
          }}>
            SS
          </span>
          {size === 'lg' || size === 'xl' && (
            <span className="text-[8px] uppercase tracking-[0.2em]" style={{ 
              color: '#F8F5F0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Construction
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
