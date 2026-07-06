import React, { useState, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ShoeSVG } from './ShoeSVG';

interface ShoePreviewStageProps {
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
  onLogoPositionChange: (pos: { x: number; y: number }) => void;
}

export const ShoePreviewStage: React.FC<ShoePreviewStageProps> = ({
  baseModel,
  colors,
  laces,
  soleType,
  material,
  logo,
  accessories,
  onLogoPositionChange
}) => {
  const [angle, setAngle] = useState<'side' | 'top' | 'back' | 'sole'>('side');
  const [zoom, setZoom] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Dragging rotation event handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX.current;
    
    const nextRot = rotationY + deltaX * 0.45;
    setRotationY(nextRot);
    startX.current = clientX;

    // Shift angle preset based on current rotation
    const normalizedRot = ((nextRot % 360) + 360) % 360;
    if (normalizedRot > 45 && normalizedRot <= 135) {
      setAngle('back');
    } else if (normalizedRot > 135 && normalizedRot <= 225) {
      setAngle('sole');
    } else if (normalizedRot > 225 && normalizedRot <= 315) {
      setAngle('top');
    } else {
      setAngle('side');
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="preview-stage-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      {/* Interactive Drag Stage */}
      <div 
        className="interactive-drag-container"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'grab' }}
      >
        <div className="shoe-ambient-lighting" />
        
        {/* Zoomable Shoe SVG Container */}
        <div className="svg-wrapper" style={{ transform: `scale(${zoom})`, width: '100%', maxWidth: '480px', transition: 'transform 0.15s ease-out' }}>
          <ShoeSVG 
            baseModel={baseModel} 
            colors={colors}
            laces={laces}
            soleType={soleType}
            material={material}
            logo={logo}
            accessories={accessories}
            angle={angle}
            zoom={1.0}
            rotationY={rotationY}
            onLogoPositionChange={onLogoPositionChange}
          />
        </div>

        <div className="drag-hint">
          <span>Drag horizontally to rotate shoe 360°</span>
        </div>
      </div>

      {/* Camera Angles / Zoom Controls */}
      <div className="camera-nav-bar">
        {(['side', 'top', 'back', 'sole'] as const).map((vAngle) => (
          <button 
            key={vAngle}
            className={`camera-angle-tab ${angle === vAngle ? 'active' : ''}`}
            onClick={() => {
              setAngle(vAngle);
              if (vAngle === 'side') setRotationY(0);
              if (vAngle === 'back') setRotationY(90);
              if (vAngle === 'sole') setRotationY(180);
              if (vAngle === 'top') setRotationY(270);
            }}
          >
            {vAngle.toUpperCase()}
          </button>
        ))}

        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}><Minus size={16} /></button>
          <span className="zoom-val">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}><Plus size={16} /></button>
        </div>
      </div>
    </div>
  );
};
