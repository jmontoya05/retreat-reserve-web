import React from 'react';

interface LogoProps {
  mode?: 'light' | 'dark';
  layout?: 'vertical' | 'horizontal' | 'icon';
  className?: string;
  iconSize?: number;
}

export const Logo: React.FC<LogoProps> = ({
  mode = 'light',
  layout = 'horizontal',
  className = '',
  iconSize = 42,
}) => {
  // Define color palette based on light/dark mode
  const primaryColor = mode === 'light' ? '#1F5937' : '#FFFFFF';
  const accentColor = mode === 'light' ? '#8DB600' : '#8DB600';
  const neutralColor = mode === 'light' ? '#1F2937' : '#F4E9D9';
  const secondaryColor = mode === 'light' ? '#4A5568' : '#D1D5DB';

  // Render a responsive, clean Pine Tree SVG element at a given position and scale
  const renderTree = (x: number, y: number, scale: number) => {
    const bW = 14 * scale; // bottom width
    const tH = 34 * scale; // tree height
    return (
      <g key={`tree-${x}-${y}`} className="transition-all duration-300">
        {/* Trunk */}
        <rect
          x={x - 2 * scale}
          y={y}
          width={4 * scale}
          height={8 * scale}
          fill={primaryColor}
          opacity={0.8}
        />
        {/* Layer 1 (Bottom) */}
        <polygon
          points={`${x - bW},${y} ${x},${y - 12 * scale} ${x + bW},${y}`}
          fill={primaryColor}
        />
        {/* Layer 2 (Middle) */}
        <polygon
          points={`${x - bW * 0.8},${y - 8 * scale} ${x},${y - 18 * scale} ${x + bW * 0.8},${y - 8 * scale}`}
          fill={primaryColor}
        />
        {/* Layer 3 (Top) */}
        <polygon
          points={`${x - bW * 0.6},${y - 14 * scale} ${x},${y - 24 * scale} ${x + bW * 0.6},${y - 14 * scale}`}
          fill={primaryColor}
        />
      </g>
    );
  };

  const vectorGraphic = (
    <svg
      viewBox="0 0 400 240"
      width={iconSize * 1.6}
      height={iconSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs select-none"
    >
      {/* 1. MOUNTAINS IN BACKGROUND */}
      {/* Left/Back Peak */}
      <polygon
        points="70,170 150,85 220,170"
        fill="none"
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
        opacity="0.3"
      />
      {/* Mountain outline details / peaks */}
      <path
        d="M 125,110 L 150,85 L 165,102 M 140,115 L 150,105 L 160,115"
        stroke={primaryColor}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Main Back Peak (Right/Center) */}
      <polygon
        points="140,170 230,60 320,170"
        fill="none"
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
        opacity="0.45"
      />
      {/* Snow peak detail on the main mountain */}
      <path
        d="M 205,90 L 230,60 L 255,90 M 215,102 L 230,85 L 245,102"
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* 2. CHIMNEY SMOKE */}
      <path
        d="M 166,105 Q 166,80 178,74 T 188,48 T 178,32"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
        strokeDasharray="4 2"
      />

      {/* 3. THE CABIN (Center) */}
      {/* Chimney */}
      <rect
        x="163"
        y="105"
        width="6"
        height="18"
        fill={primaryColor}
        stroke={primaryColor}
        strokeWidth="1.5"
      />
      
      {/* Outer pitch roof */}
      <polygon
        points="145,135 200,90 255,135"
        fill={mode === 'light' ? '#FFFFFF' : '#1F5937'}
        stroke={primaryColor}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Inner roof support line */}
      <polygon
        points="155,133 200,97 245,133"
        stroke={primaryColor}
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Cabin Wood Logs Structure */}
      <rect
        x="158"
        y="135"
        width="84"
        height="38"
        fill={mode === 'light' ? '#FDFBF7' : '#143B24'}
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Log lines (horizontal siding) */}
      <line x1="158" y1="142" x2="242" y2="142" stroke={primaryColor} strokeWidth="2.2" opacity="0.8" />
      <line x1="158" y1="149" x2="242" y2="149" stroke={primaryColor} strokeWidth="2.2" opacity="0.8" />
      <line x1="158" y1="156" x2="242" y2="156" stroke={primaryColor} strokeWidth="2.2" opacity="0.8" />
      <line x1="158" y1="163" x2="242" y2="163" stroke={primaryColor} strokeWidth="2.2" opacity="0.8" />

      {/* Porch door */}
      <rect
        x="188"
        y="145"
        width="24"
        height="28"
        fill={mode === 'light' ? '#FFFFFF' : '#1F5937'}
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Door detail (cross panes) */}
      <line x1="188" y1="159" x2="212" y2="159" stroke={primaryColor} strokeWidth="2.2" />
      <line x1="200" y1="145" x2="200" y2="173" stroke={primaryColor} strokeWidth="2.2" />

      {/* Windows */}
      <rect
        x="166"
        y="143"
        width="14"
        height="14"
        fill={mode === 'light' ? '#FFFFFF' : '#1F5937'}
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="173" y1="143" x2="173" y2="157" stroke={primaryColor} strokeWidth="1.5" />
      <line x1="166" y1="150" x2="180" y2="150" stroke={primaryColor} strokeWidth="1.5" />

      <rect
        x="220"
        y="143"
        width="14"
        height="14"
        fill={mode === 'light' ? '#FFFFFF' : '#1F5937'}
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="227" y1="143" x2="227" y2="157" stroke={primaryColor} strokeWidth="1.5" />
      <line x1="220" y1="150" x2="234" y2="150" stroke={primaryColor} strokeWidth="1.5" />

      {/* 4. TREES SURROUNDING THE HOUSE */}
      {/* Left side trees (decreasing size) */}
      {renderTree(136, 172, 1.05)}
      {renderTree(112, 172, 0.95)}
      {renderTree(90, 172, 0.82)}

      {/* Right side trees */}
      {renderTree(264, 172, 1.05)}
      {renderTree(288, 172, 0.95)}
      {renderTree(310, 172, 0.82)}

      {/* Ground lines (scenic slope lines grounding the image) */}
      <path
        d="M 60,172 Q 130,178 200,172 T 340,172"
        stroke={primaryColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 80,181 Q 140,185 200,181 T 320,181"
        stroke={primaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );

  if (layout === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="logo-icon-layout">
        {vectorGraphic}
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center space-y-4 ${className}`} id="logo-vertical-layout">
        {vectorGraphic}
        <div className="space-y-1">
          <h1 
            className="font-serif text-lg sm:text-xl font-bold tracking-[0.22em] uppercase leading-none"
            style={{ color: neutralColor, fontFamily: "Georgia, serif" }}
          >
            RETREAT RESERVE
          </h1>
          <p 
            className="text-[9px] uppercase tracking-[0.3em] font-semibold text-center block"
            style={{ color: accentColor }}
          >
            Escápate. Relájate. Reconecta.
          </p>
        </div>
      </div>
    );
  }

  // Default: Horizontal Layout
  return (
    <div className={`flex items-center gap-3.5 ${className}`} id="logo-horizontal-layout">
      {vectorGraphic}
      <div className="flex flex-col text-left">
        <h1 
          className="font-serif text-base sm:text-lg font-bold tracking-[0.16em] uppercase leading-tight"
          style={{ color: neutralColor, fontFamily: "Georgia, serif" }}
        >
          RETREAT <span style={{ color: primaryColor }}>RESERVE</span>
        </h1>
        <p 
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-medium leading-none mt-0.5"
          style={{ color: accentColor }}
        >
          Escápate • Relájate • Reconecta
        </p>
      </div>
    </div>
  );
};
