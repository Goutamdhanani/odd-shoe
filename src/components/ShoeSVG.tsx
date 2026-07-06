import React, { useState, useRef } from 'react';

interface ShoeSVGProps {
  baseModel: string;
  colors: Record<string, string>;
  laces: {
    type: string;
    thickness: string;
    length: string;
    material: string;
    color: string;
  };
  soleType: string;
  material: string;
  logo: {
    type: 'none' | 'text' | 'image';
    value: string;
    position: { x: number; y: number };
    scale: number;
  };
  accessories: {
    laceTags: boolean;
    goldEyelets: boolean;
    reflectiveStrips: boolean;
    glowOutsole: boolean;
    carbonHeel: boolean;
    tongueLabel: string;
    insoleText: string;
  };
  angle: 'side' | 'top' | 'back' | 'sole';
  zoom: number;
  rotationY: number; // simulated Y-rotation in degrees
  onLogoPositionChange?: (pos: { x: number; y: number }) => void;
}

export const ShoeSVG: React.FC<ShoeSVGProps> = ({
  baseModel,
  colors,
  laces,
  soleType,
  material,
  logo,
  accessories,
  angle,
  zoom,
  rotationY,
  onLogoPositionChange
}) => {
  const logoRef = useRef<SVGGElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const logoStart = useRef({ x: 0, y: 0 });

  // Handle Logo Dragging
  const handleLogoStart = (e: React.MouseEvent<SVGGElement> | React.TouchEvent<SVGGElement>) => {
    e.stopPropagation();
    setIsDraggingLogo(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    logoStart.current = { ...logo.position };
  };

  const handleLogoMove = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingLogo || !onLogoPositionChange) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Scale movement delta by zoom factor
    const dx = (clientX - dragStart.current.x) / zoom;
    const dy = (clientY - dragStart.current.y) / zoom;

    // Bounds check to keep logo on the shoe body
    const newX = Math.max(100, Math.min(380, logoStart.current.x + dx));
    const newY = Math.max(60, Math.min(220, logoStart.current.y + dy));

    onLogoPositionChange({ x: newX, y: newY });
  };

  const handleLogoEnd = () => {
    setIsDraggingLogo(false);
  };

  React.useEffect(() => {
    if (isDraggingLogo) {
      window.addEventListener('mousemove', handleLogoMove);
      window.addEventListener('mouseup', handleLogoEnd);
      window.addEventListener('touchmove', handleLogoMove);
      window.addEventListener('touchend', handleLogoEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleLogoMove);
      window.removeEventListener('mouseup', handleLogoEnd);
      window.removeEventListener('touchmove', handleLogoMove);
      window.removeEventListener('touchend', handleLogoEnd);
    };
  }, [isDraggingLogo, logo.position, zoom]);

  // Adjust parameters based on baseModel
  const isHighTop = baseModel === 'High Top' || baseModel === 'Basketball';
  const isLowTop = baseModel === 'Low Top' || baseModel === 'Skate';
  const isRunner = baseModel === 'Runner' || baseModel === 'Training';

  // Base configurations
  const collarY = isHighTop ? 45 : isLowTop ? 115 : 85;
  const tongueY = isHighTop ? 35 : isLowTop ? 100 : 70;
  
  // Sole dimensions based on soleType
  const soleHeight = soleType === 'chunky' ? 38 : soleType === 'bubble' || soleType === 'air' ? 30 : 22;
  const midsoleY = 240 - soleHeight;
  
  // Custom material textures (SVG patterns)
  const renderMaterialPattern = () => {
    if (material === 'mesh') {
      return (
        <pattern id="meshPattern" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="rgba(0,0,0,0.15)" />
        </pattern>
      );
    }
    if (material === 'knit') {
      return (
        <pattern id="knitPattern" width="10" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 0 Q 5 4, 10 0 M 0 6 Q 5 2, 10 6" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
        </pattern>
      );
    }
    if (material === 'canvas') {
      return (
        <pattern id="canvasPattern" width="4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
          <line x1="2" y1="0" x2="2" y2="4" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        </pattern>
      );
    }
    return null;
  };

  // Color variables with fallbacks
  const cUpper = colors.upper || '#FFFFFF';
  const cToeBox = colors.toeBox || '#FFFFFF';
  const cHeel = colors.heel || '#FFFFFF';
  const cSidePanels = colors.sidePanels || '#FFFFFF';
  const cTongue = colors.tongue || '#FFFFFF';
  const cMidsole = colors.midsole || '#FFFFFF';
  const cOutsole = colors.outsole || '#333333';
  const cAirBubble = colors.airBubble || '#00E5FF';
  const cLaceLoops = colors.laceLoops || '#FFFFFF';
  const cHeelPull = colors.heelPull || '#FFFFFF';
  const cStitching = colors.stitching || '#CCCCCC';
  const cLaces = laces.color || '#FFFFFF';

  // Apply simulated 3D rotation transform + zoom
  const baseTransform = `scale(${zoom}) rotateY(${rotationY}deg)`;

  return (
    <div 
      className="shoe-svg-viewport"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        userSelect: 'none'
      }}
    >
      <svg
        viewBox="0 0 500 320"
        width="100%"
        height="100%"
        style={{
          transform: baseTransform,
          transition: isDraggingLogo ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          overflow: 'visible',
          transformOrigin: '50% 50%'
        }}
      >
        <defs>
          {/* Shading Gradients */}
          <linearGradient id="verticalShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="midsoleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          <radialGradient id="airBubbleGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="60%" stopColor={cAirBubble} stopOpacity="0.5" />
            <stop offset="100%" stopColor={cAirBubble} stopOpacity="0.9" />
          </radialGradient>

          <radialGradient id="soleShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(11, 30, 45, 0.35)" />
            <stop offset="100%" stopColor="rgba(11, 30, 45, 0)" />
          </radialGradient>

          <linearGradient id="metallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="30%" stopColor="rgba(150,150,150,0.2)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="70%" stopColor="rgba(100,100,100,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
          </linearGradient>

          {/* Dynamic textures */}
          {renderMaterialPattern()}
        </defs>

        {/* Shadow underneath */}
        <ellipse cx="250" cy="275" rx="200" ry="16" fill="url(#soleShadow)" />

        {/* -------------------- ANGLE: SIDE VIEW -------------------- */}
        {(angle === 'side' || !angle) && (
          <g id="side-view" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Heel Pull Tab */}
            <path
              d={`M 75 ${collarY + 15} C 55 ${collarY - 10}, 65 ${collarY - 20}, 85 ${collarY + 5} Z`}
              fill={cHeelPull}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
            />
            {/* Inner pull tab shade */}
            <path
              d={`M 75 ${collarY + 15} C 62 ${collarY - 2}, 68 ${collarY - 7}, 80 ${collarY + 8}`}
              fill="none"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="2"
            />

            {/* Tongue */}
            <path
              d={`M 170 ${collarY + 25} C 175 ${tongueY}, 205 ${tongueY + 5}, 215 ${collarY + 40} Z`}
              fill={cTongue}
            />
            {/* Tongue Texture Overlay */}
            {material !== 'leather' && material !== 'suede' && (
              <path
                d={`M 170 ${collarY + 25} C 175 ${tongueY}, 205 ${tongueY + 5}, 215 ${collarY + 40} Z`}
                fill={`url(#${material}Pattern)`}
                opacity="0.8"
              />
            )}
            
            {/* Shoe Main Upper Body */}
            <path
              d={`M 55 210 C 40 145, 65 ${collarY + 5}, 95 ${collarY} 
                 C 125 ${collarY + 20}, 160 ${collarY + 30}, 205 ${collarY + 45} 
                 C 275 160, 395 190, 440 205 
                 C 455 210, 455 218, 435 224 
                 C 380 238, 250 236, 55 210 Z`}
              fill={cUpper}
            />
            
            {/* Upper Material Texture Overlay */}
            {material !== 'leather' && material !== 'suede' && (
              <path
                d={`M 55 210 C 40 145, 65 ${collarY + 5}, 95 ${collarY} 
                   C 125 ${collarY + 20}, 160 ${collarY + 30}, 205 ${collarY + 45} 
                   C 275 160, 395 190, 440 205 
                   C 455 210, 455 218, 435 224 
                   C 380 238, 250 236, 55 210 Z`}
                fill={`url(#${material}Pattern)`}
                opacity="0.85"
              />
            )}
            
            {/* Shading overlay for Upper */}
            <path
              d={`M 55 210 C 40 145, 65 ${collarY + 5}, 95 ${collarY} 
                 C 125 ${collarY + 20}, 160 ${collarY + 30}, 205 ${collarY + 45} 
                 C 275 160, 395 190, 440 205 
                 C 455 210, 455 218, 435 224 
                 C 380 238, 250 236, 55 210 Z`}
              fill="url(#verticalShade)"
              opacity="0.25"
            />

            {/* Suede/Leather Specular Highlights (For Suede/Leather feeling premium) */}
            {(material === 'leather' || material === 'vegan') && (
              <path
                d={`M 95 ${collarY} C 125 ${collarY + 20}, 160 ${collarY + 30}, 205 ${collarY + 45} L 220 ${collarY + 80} C 170 140, 110 110, 95 ${collarY}`}
                fill="url(#metallicGrad)"
                opacity="0.15"
                pointerEvents="none"
              />
            )}

            {/* Heel Counter Panel */}
            <path
              d={`M 55 210 C 42 165, 65 115, 95 115 
                 C 105 145, 112 185, 102 216 
                 C 82 216, 68 214, 55 210 Z`}
              fill={cHeel}
              stroke="rgba(0,0,0,0.08)"
            />
            <path
              d={`M 55 210 C 42 165, 65 115, 95 115 
                 C 105 145, 112 185, 102 216 
                 C 82 216, 68 214, 55 210 Z`}
              fill="url(#verticalShade)"
              opacity="0.2"
            />

            {/* Side Panel Overlay */}
            <path
              d={`M 140 145 C 190 160, 270 185, 335 190 
                 C 320 215, 270 232, 195 230 
                 C 135 228, 118 190, 140 145 Z`}
              fill={cSidePanels}
              stroke="rgba(0,0,0,0.08)"
            />
            {/* Side Panel Texture & Shading */}
            {material !== 'leather' && material !== 'suede' && (
              <path
                d={`M 140 145 C 190 160, 270 185, 335 190 
                   C 320 215, 270 232, 195 230 
                   C 135 228, 118 190, 140 145 Z`}
                fill={`url(#${material}Pattern)`}
                opacity="0.7"
              />
            )}
            <path
              d={`M 140 145 C 190 160, 270 185, 335 190 
                 C 320 215, 270 232, 195 230 
                 C 135 228, 118 190, 140 145 Z`}
              fill="url(#verticalShade)"
              opacity="0.15"
            />

            {/* Toe Box Cap */}
            <path
              d="M 330 190 C 365 190, 410 193, 440 205 C 448 208, 442 218, 432 222 C 385 228, 330 226, 330 190 Z"
              fill={cToeBox}
              stroke="rgba(0,0,0,0.08)"
            />
            <path
              d="M 330 190 C 365 190, 410 193, 440 205 C 448 208, 442 218, 432 222 C 385 228, 330 226, 330 190 Z"
              fill="url(#verticalShade)"
              opacity="0.22"
            />

            {/* Gold Eyelets Detail */}
            {accessories.goldEyelets && (
              <g fill="#FFD700" stroke="#B8860B" strokeWidth="0.5">
                <circle cx="165" cy="142" r="3.5" />
                <circle cx="185" cy="155" r="3.5" />
                <circle cx="205" cy="168" r="3.5" />
                <circle cx="225" cy="181" r="3.5" />
              </g>
            )}

            {/* Standard Lace Loops */}
            {!accessories.goldEyelets && (
              <g fill={cLaceLoops} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8">
                <circle cx="165" cy="142" r="2.5" />
                <circle cx="185" cy="155" r="2.5" />
                <circle cx="205" cy="168" r="2.5" />
                <circle cx="225" cy="181" r="2.5" />
              </g>
            )}

            {/* Stitching Lines (Fine dotted lines tracing shapes) */}
            <path
              d={`M 59 203 C 48 155, 68 122, 92 122 M 138 152 C 182 165, 260 188, 324 193 M 332 195 C 380 198, 420 203, 430 213`}
              fill="none"
              stroke={cStitching}
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />

            {/* Laces Visuals based on laces.type */}
            <g stroke={cLaces} strokeLinecap="round" opacity="0.95">
              {laces.type === 'rope' ? (
                // Rope laces with spiral texture lines
                <g strokeWidth="4">
                  <line x1="165" y1="142" x2="185" y2="155" strokeDasharray="2,2" />
                  <line x1="185" y1="155" x2="205" y2="168" strokeDasharray="2,2" />
                  <line x1="205" y1="168" x2="225" y2="181" strokeDasharray="2,2" />
                  {/* Tie loop */}
                  <path d="M 165 142 Q 150 130, 140 145 Q 150 155, 165 142" fill="none" strokeWidth="3" />
                  <path d="M 165 142 Q 160 120, 175 125 Q 175 140, 165 142" fill="none" strokeWidth="3" />
                </g>
              ) : laces.type === 'reflective' ? (
                // Reflective laces (White dots on colored base)
                <g strokeWidth="3.5">
                  <line x1="165" y1="142" x2="185" y2="155" />
                  <line x1="185" y1="155" x2="205" y2="168" />
                  <line x1="205" y1="168" x2="225" y2="181" />
                  {/* Reflective sparkle dots */}
                  <g stroke="#FFF" strokeWidth="1" strokeDasharray="1,5">
                    <line x1="165" y1="142" x2="185" y2="155" />
                    <line x1="185" y1="155" x2="205" y2="168" />
                    <line x1="205" y1="168" x2="225" y2="181" />
                  </g>
                </g>
              ) : (
                // Flat/Round/Elastic (Solid colors with width variations)
                <g strokeWidth={laces.thickness === 'thick' ? '4.5' : laces.thickness === 'thin' ? '2' : '3.2'}>
                  <line x1="165" y1="142" x2="185" y2="155" />
                  <line x1="185" y1="155" x2="205" y2="168" />
                  <line x1="205" y1="168" x2="225" y2="181" />
                  {/* Bow tails */}
                  <path d="M 165 142 C 145 135, 135 155, 150 160 C 158 155, 165 145, 165 142" fill="none" />
                  <path d="M 165 142 C 170 120, 190 125, 180 145 C 175 148, 168 145, 165 142" fill="none" />
                </g>
              )}
            </g>

            {/* Metal Lace Tags (Deubré) accessory */}
            {accessories.laceTags && (
              <g transform="translate(222, 178) rotate(35)">
                <rect x="-6" y="-3" width="12" height="6" rx="1.5" fill="#E5E4E2" stroke="#9B9A96" strokeWidth="0.5" />
                <rect x="-4" y="-1" width="8" height="2" fill="#B0B0B0" />
                {/* Metallic shine */}
                <line x1="-5" y1="-2" x2="5" y2="2" stroke="#FFF" strokeWidth="0.8" opacity="0.7" />
              </g>
            )}

            {/* Reflective Strips */}
            {accessories.reflectiveStrips && (
              <path
                d="M 64 150 Q 80 165, 88 190"
                fill="none"
                stroke="#EAEAEA"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.9"
                filter="drop-shadow(0 0 3px rgba(255,255,255,0.8))"
              />
            )}

            {/* Brand Logo placement (repositionable SVG element) */}
            {logo.type !== 'none' && (
              <g 
                ref={logoRef}
                transform={`translate(${logo.position.x}, ${logo.position.y}) scale(${logo.scale})`}
                onMouseDown={handleLogoStart}
                onTouchStart={handleLogoStart}
                style={{ cursor: isDraggingLogo ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
              >
                {logo.type === 'text' ? (
                  <text
                    x="0"
                    y="0"
                    fill={colors.stitching || '#0B1E2D'}
                    fontSize="13"
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-display)"
                    style={{ letterSpacing: '0.05em', textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
                  >
                    {logo.value || 'ODD'}
                  </text>
                ) : (
                  // Custom Image/Graphic SVG element (renders a custom Swoosh / Wave graphic for brand, or image)
                  logo.value.startsWith('data:') || logo.value.startsWith('http') ? (
                    <image
                      href={logo.value}
                      x="-20"
                      y="-15"
                      width="40"
                      height="30"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  ) : (
                    // Default premium vector lightning bolt / wave logo
                    <path
                      d="M -20 -4 C -10 -15, 10 5, 25 -8 C 15 12, -10 -2, -20 -4 Z"
                      fill={colors.stitching || '#0B1E2D'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    />
                  )
                )}
                {/* Drag boundary highlight when dragging */}
                {isDraggingLogo && (
                  <rect x="-25" y="-18" width="50" height="36" rx="4" fill="none" stroke="var(--oddshoe-amber)" strokeWidth="1.5" strokeDasharray="3,2" />
                )}
              </g>
            )}

            {/* Carbon Fiber Heel Plate */}
            {accessories.carbonHeel && (
              <path
                d="M 52 205 C 47 185, 55 170, 72 170 C 80 185, 78 200, 70 212 Z"
                fill="#222"
                stroke="#444"
                strokeWidth="1"
                opacity="0.9"
                style={{
                  backgroundImage: 'radial-gradient(#444 20%, transparent 20%)',
                  backgroundSize: '4px 4px'
                }}
              />
            )}

            {/* Midsole */}
            <path
              d={`M 44 ${midsoleY} 
                 C 150 ${midsoleY + 5}, 300 ${midsoleY + 8}, 456 ${midsoleY - 12} 
                 L 462 238 
                 C 300 258, 150 255, 40 232 Z`}
              fill={cMidsole}
            />
            {/* Midsole shading/glow */}
            <path
              d={`M 44 ${midsoleY} 
                 C 150 ${midsoleY + 5}, 300 ${midsoleY + 8}, 456 ${midsoleY - 12} 
                 L 462 238 
                 C 300 258, 150 255, 40 232 Z`}
              fill="url(#midsoleGlow)"
            />

            {/* Outsole (Slightly wraps around bottom of midsole) */}
            <path
              d="M 38 231 L 42 228 C 150 252, 300 255, 464 235 L 468 243 C 300 268, 150 266, 38 243 Z"
              fill={cOutsole}
              opacity={accessories.glowOutsole ? 0.95 : 1}
              style={accessories.glowOutsole ? { filter: 'drop-shadow(0 0 8px rgba(56, 176, 0, 0.8))', fill: '#70E000' } : {}}
            />

            {/* Outsole Grip Lines */}
            <g stroke="rgba(0,0,0,0.25)" strokeWidth="1.5">
              <line x1="80" y1="239" x2="80" y2="246" />
              <line x1="130" y1="243" x2="131" y2="251" />
              <line x1="180" y1="245" x2="181" y2="253" />
              <line x1="230" y1="245" x2="231" y2="253" />
              <line x1="280" y1="243" x2="281" y2="251" />
              <line x1="330" y1="240" x2="331" y2="247" />
              <line x1="380" y1="236" x2="381" y2="242" />
            </g>

            {/* Air Bubble Capsule (renders if soleType === 'air' or 'bubble') */}
            {(soleType === 'air' || soleType === 'bubble') && (
              <g>
                {/* Bubble Cutout */}
                <rect x="75" y={midsoleY + 5} width="58" height="15" rx="7.5" fill="rgba(0,0,0,0.5)" />
                {/* Bubble Liquid Glow */}
                <rect x="77" y={midsoleY + 6} width="54" height="13" rx="6.5" fill="url(#airBubbleGrad)" />
                {/* Bubble reflection highlight */}
                <path d={`M 80 ${midsoleY + 8} Q 104 ${midsoleY + 11}, 128 ${midsoleY + 8}`} fill="none" stroke="#FFF" strokeWidth="1" opacity="0.6" />
              </g>
            )}

            {/* Personalized Tongue Label Text */}
            {accessories.tongueLabel && (
              <g transform={`translate(188, ${tongueY + 28}) rotate(-18)`}>
                <rect x="-16" y="-6" width="32" height="12" fill="#FAF9F6" rx="1" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                <text x="0" y="2" fontSize="5" fontWeight="800" textAnchor="middle" fill="#111" fontFamily="var(--font-body)">
                  {accessories.tongueLabel.toUpperCase().substring(0, 8)}
                </text>
              </g>
            )}

          </g>
        )}

        {/* -------------------- ANGLE: TOP VIEW -------------------- */}
        {angle === 'top' && (
          <g id="top-view">
            {/* Outline Silhouette of Shoe */}
            <path
              d="M 200 60 C 160 60, 155 100, 160 170 C 165 240, 185 270, 200 270 C 215 270, 235 240, 240 170 C 245 100, 240 60, 200 60 Z"
              fill={cUpper}
              stroke="rgba(0,0,0,0.1)"
            />
            {/* Texture */}
            {material !== 'leather' && material !== 'suede' && (
              <path
                d="M 200 60 C 160 60, 155 100, 160 170 C 165 240, 185 270, 200 270 C 215 270, 235 240, 240 170 C 245 100, 240 60, 200 60 Z"
                fill={`url(#${material}Pattern)`}
                opacity="0.8"
              />
            )}
            <path
              d="M 200 60 C 160 60, 155 100, 160 170 C 165 240, 185 270, 200 270 C 215 270, 235 240, 240 170 C 245 100, 240 60, 200 60 Z"
              fill="url(#verticalShade)"
              opacity="0.2"
            />

            {/* Toe Box Cap Top */}
            <path
              d="M 200 60 C 176 60, 168 70, 172 95 C 182 98, 218 98, 228 95 C 232 70, 224 60, 200 60 Z"
              fill={cToeBox}
              stroke="rgba(0,0,0,0.05)"
            />

            {/* Collar opening & Insole */}
            <ellipse cx="200" cy="210" rx="26" ry="38" fill={colors.midsole || '#FFFFFF'} stroke="rgba(0,0,0,0.15)" />
            {/* Custom Insole Text */}
            <text x="200" y="215" fill={colors.upper || '#111'} fontSize="6" fontWeight="800" textAnchor="middle" fontFamily="var(--font-body)">
              {accessories.insoleText ? accessories.insoleText.substring(0, 15) : 'ODDSHOE DESIGN'}
            </text>

            {/* Tongue top view */}
            <path d="M 175 140 C 175 110, 225 110, 225 140 Z" fill={cTongue} />

            {/* Laces top view */}
            <g stroke={cLaces} strokeWidth="3" strokeLinecap="round">
              <line x1="178" y1="125" x2="222" y2="125" />
              <line x1="176" y1="140" x2="224" y2="140" />
              <line x1="175" y1="155" x2="225" y2="155" />
              <line x1="176" y1="170" x2="224" y2="170" />
            </g>

            {/* Metal Lace Tag */}
            {accessories.laceTags && (
              <rect x="192" y="112" width="16" height="5" rx="1" fill="#E5E4E2" stroke="#9B9A96" strokeWidth="0.5" />
            )}

            {/* Outsole rim visibility */}
            <path
              d="M 200 56 C 154 56, 149 100, 154 170 C 159 242, 180 276, 200 276 C 220 276, 241 242, 246 170 C 251 100, 246 56, 200 56 Z"
              fill="none"
              stroke={cOutsole}
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* -------------------- ANGLE: BACK VIEW -------------------- */}
        {angle === 'back' && (
          <g id="back-view">
            {/* Heel profile */}
            <path
              d="M 170 240 C 170 120, 160 70, 200 70 C 240 70, 230 120, 230 240 Z"
              fill={cHeel}
              stroke="rgba(0,0,0,0.1)"
            />
            {/* Texture */}
            {material !== 'leather' && material !== 'suede' && (
              <path
                d="M 170 240 C 170 120, 160 70, 200 70 C 240 70, 230 120, 230 240 Z"
                fill={`url(#${material}Pattern)`}
                opacity="0.8"
              />
            )}
            <path
              d="M 170 240 C 170 120, 160 70, 200 70 C 240 70, 230 120, 230 240 Z"
              fill="url(#verticalShade)"
              opacity="0.25"
            />

            {/* Heel collar opening */}
            <path d="M 172 105 C 172 80, 228 80, 228 105 Z" fill={cUpper} stroke="rgba(0,0,0,0.1)" />

            {/* Heel Pull Tab vertical */}
            <path d="M 194 95 L 194 50 C 194 45, 206 45, 206 50 L 206 95 Z" fill={cHeelPull} stroke="rgba(0,0,0,0.15)" />
            <path d="M 197 90 L 197 55 M 203 90 L 203 55" stroke={cStitching} strokeWidth="1" strokeDasharray="2,2" />

            {/* Midsole flat back */}
            <path d="M 164 240 C 164 220, 236 220, 236 240 L 240 262 C 240 262, 160 262, 160 262 Z" fill={cMidsole} />
            
            {/* Outsole flat back */}
            <rect x="156" y="260" width="88" height="8" rx="2" fill={cOutsole} />

            {/* Air Bubble visible from back if selected */}
            {(soleType === 'air' || soleType === 'bubble') && (
              <rect x="180" y="244" width="40" height="10" rx="3" fill="url(#airBubbleGrad)" />
            )}
          </g>
        )}

        {/* -------------------- ANGLE: SOLE VIEW -------------------- */}
        {angle === 'sole' && (
          <g id="sole-view">
            {/* Symmetrical sole tread outline */}
            <path
              d="M 200 50 C 160 50, 150 110, 165 170 C 170 210, 165 240, 172 270 C 180 280, 220 280, 228 270 C 235 240, 230 210, 235 170 C 250 110, 240 50, 200 50 Z"
              fill={cOutsole}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            {/* Tread Details / Grip Wave Patterns */}
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none">
              <path d="M 170 80 Q 200 70, 230 80" />
              <path d="M 166 105 Q 200 95, 234 105" />
              <path d="M 165 130 Q 200 120, 235 130" />
              <path d="M 168 155 Q 200 145, 232 155" />
              
              {/* Midfoot bridge */}
              <rect x="178" y="175" width="44" height="25" rx="4" fill="rgba(0,0,0,0.4)" stroke="none" />
              
              <path d="M 172 215 Q 200 205, 228 215" />
              <path d="M 172 235 Q 200 225, 228 235" />
              <path d="M 174 255 Q 200 245, 226 255" />
            </g>

            {/* Glowing Center Logo in sole */}
            <circle cx="200" cy="188" r="8" fill={accessories.glowOutsole ? '#70E000' : '#FFF'} opacity="0.8" />
            <text x="200" y="190" fill="#000" fontSize="5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
              ODD
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
