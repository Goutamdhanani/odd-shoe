import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, Save, Share2, Heart, ShoppingCart, Award, Sparkles, 
  Upload, X, ChevronLeft, ChevronRight, Sliders, Plus, Minus, Info, 
  Truck, Copy, Check, Printer, Download, RefreshCw, FileText 
} from 'lucide-react';
import { ShoeSVG } from './ShoeSVG';
import { Product } from '../types';
import confetti from 'canvas-confetti';

interface CustomizerProps {
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: number, quantity?: number) => void;
}

// Configurator Base Models Data
const BASE_MODELS = [
  { id: 'runner', name: 'Runner', desc: 'Sleek aerodynamic runner built for maximum speed and shock absorption.', price: 12000, image: '/shoes/ai_air.png' },
  { id: 'hightop', name: 'High Top', desc: 'Retro basketball high top with deep ankle support and premium padding.', price: 14000, image: '/shoes/quality_green.png' },
  { id: 'lowtop', name: 'Low Top', desc: 'Classic low-cut street sneaker. Effortlessly casual, lightweight, and versatile.', price: 11500, image: '/shoes/hero_white.png' },
  { id: 'basketball', name: 'Basketball', desc: 'Performance court shoe featuring extra chunky sole and high impact pods.', price: 15000, image: '/shoes/yp8_air.png' },
  { id: 'lifestyle', name: 'Lifestyle', desc: 'Modern everyday hybrid combining heritage aesthetics with organic materials.', price: 12500, image: '/shoes/green_m123.png' },
  { id: 'skate', name: 'Skate', desc: 'Heavy-duty canvas and suede flat-sole sneaker built to absorb skate impact.', price: 11000, image: '/shoes/green_wood.png' },
  { id: 'training', name: 'Training', desc: 'Cross-training athletic shoe designed for multi-directional stability.', price: 13000, image: '/shoes/ai_air.png' },
];

// Presets Data
const PRESETS = [
  {
    name: 'Midnight Black',
    baseModel: 'Lifestyle',
    colors: { upper: '#16181C', toeBox: '#16181C', heel: '#16181C', sidePanels: '#16181C', tongue: '#16181C', midsole: '#16181C', outsole: '#111111', airBubble: '#16181C', laceLoops: '#16181C', heelPull: '#16181C', stitching: '#3A3F47' },
    laces: { type: 'flat', thickness: 'medium', length: 'standard', material: 'cotton', color: '#16181C' },
    soleType: 'lifestyle',
    material: 'leather',
    logo: { type: 'text' as const, value: 'ODD', position: { x: 220, y: 180 }, scale: 1 },
    accessories: { laceTags: true, goldEyelets: false, reflectiveStrips: false, glowOutsole: false, carbonHeel: true, tongueLabel: 'BLACK', insoleText: 'MIDNIGHT' }
  },
  {
    name: 'Tokyo Neon',
    baseModel: 'Basketball',
    colors: { upper: '#0B1E2D', toeBox: '#FF007F', heel: '#00F0FF', sidePanels: '#0B1E2D', tongue: '#FF007F', midsole: '#00F0FF', outsole: '#FF007F', airBubble: '#E0FF00', laceLoops: '#E0FF00', heelPull: '#E0FF00', stitching: '#FF007F' },
    laces: { type: 'rope', thickness: 'thick', length: 'standard', material: 'nylon', color: '#E0FF00' },
    soleType: 'air',
    material: 'mesh',
    logo: { type: 'text' as const, value: 'TYO', position: { x: 200, y: 170 }, scale: 1.1 },
    accessories: { laceTags: true, goldEyelets: false, reflectiveStrips: true, glowOutsole: true, carbonHeel: false, tongueLabel: 'TOKYO', insoleText: 'NEON WAVE' }
  },
  {
    name: 'Arctic Ice',
    baseModel: 'Runner',
    colors: { upper: '#EAF6FC', toeBox: '#FFFFFF', heel: '#D4EDF9', sidePanels: '#BFE3F5', tongue: '#FFFFFF', midsole: '#EAF6FC', outsole: '#62B8DF', airBubble: '#BFE3F5', laceLoops: '#62B8DF', heelPull: '#4A9FCB', stitching: '#4A9FCB' },
    laces: { type: 'reflective', thickness: 'thin', length: 'standard', material: 'nylon', color: '#FFFFFF' },
    soleType: 'bubble',
    material: 'knit',
    logo: { type: 'text' as const, value: 'ICE', position: { x: 210, y: 180 }, scale: 1 },
    accessories: { laceTags: false, goldEyelets: false, reflectiveStrips: true, glowOutsole: false, carbonHeel: false, tongueLabel: 'FREEZE', insoleText: 'ARCTIC RUNNER' }
  },
  {
    name: 'Ferrari Red',
    baseModel: 'High Top',
    colors: { upper: '#D50000', toeBox: '#111111', heel: '#D50000', sidePanels: '#111111', tongue: '#D50000', midsole: '#111111', outsole: '#D50000', airBubble: '#FFD700', laceLoops: '#FFFFFF', heelPull: '#FFFFFF', stitching: '#FFD700' },
    laces: { type: 'flat', thickness: 'medium', length: 'standard', material: 'cotton', color: '#FFFFFF' },
    soleType: 'chunky',
    material: 'leather',
    logo: { type: 'text' as const, value: 'RACING', position: { x: 200, y: 180 }, scale: 0.95 },
    accessories: { laceTags: true, goldEyelets: true, reflectiveStrips: false, glowOutsole: false, carbonHeel: true, tongueLabel: 'FERRARI', insoleText: 'SCUDERIA' }
  },
  {
    name: 'Ocean Wave',
    baseModel: 'Lifestyle',
    colors: { upper: '#2A9D8F', toeBox: '#FAF0CA', heel: '#264653', sidePanels: '#F4A261', tongue: '#E76F51', midsole: '#F4A261', outsole: '#264653', airBubble: '#2A9D8F', laceLoops: '#E9C46A', heelPull: '#2A9D8F', stitching: '#E9C46A' },
    laces: { type: 'flat', thickness: 'medium', length: 'standard', material: 'cotton', color: '#FAF0CA' },
    soleType: 'lifestyle',
    material: 'canvas',
    logo: { type: 'text' as const, value: 'WAVE', position: { x: 220, y: 185 }, scale: 1 },
    accessories: { laceTags: false, goldEyelets: true, reflectiveStrips: false, glowOutsole: false, carbonHeel: false, tongueLabel: 'OCEAN', insoleText: 'WAVE RIDER' }
  },
  {
    name: 'Minimal White',
    baseModel: 'Low Top',
    colors: { upper: '#FFFFFF', toeBox: '#FFFFFF', heel: '#FFFFFF', sidePanels: '#FFFFFF', tongue: '#FFFFFF', midsole: '#FFFFFF', outsole: '#EAEAEA', airBubble: '#FFFFFF', laceLoops: '#FFFFFF', heelPull: '#FFFFFF', stitching: '#CCCCCC' },
    laces: { type: 'flat', thickness: 'medium', length: 'standard', material: 'cotton', color: '#FFFFFF' },
    soleType: 'lifestyle',
    material: 'vegan',
    logo: { type: 'text' as const, value: 'PURE', position: { x: 220, y: 180 }, scale: 1 },
    accessories: { laceTags: true, goldEyelets: false, reflectiveStrips: false, glowOutsole: false, carbonHeel: false, tongueLabel: 'MINIMAL', insoleText: 'ONE OF ONE' }
  }
];

// Curated Luxury Color Palettes
const LUXURY_PALETTES = {
  popular: ['#FFFFFF', '#16181C', '#D50000', '#0D47A1', '#2E7D32', '#F5A63B', '#8D5B4C', '#BFE3F5'],
  brand: ['#0B1E2D', '#7FC8E8', '#4A9FCB', '#60B7DF', '#F5A63B', '#FFFFFF', '#D4EDF9', '#132A3E'],
  metallic: ['#D4AF37', '#C0C0C0', '#E5E4E2', '#B87333', '#8A7F8D', '#DAA520', '#C3B091', '#4C516D'],
  neon: ['#FF007F', '#00F0FF', '#E0FF00', '#39FF14', '#FF5E00', '#8F00FF', '#FF00CC', '#00FF66'],
  pastel: ['#FFC0CB', '#B0E0E6', '#E6E6FA', '#F0E68C', '#FFF0F5', '#F0FFF0', '#F5FFFA', '#FAF0E6'],
  gradients: [
    'linear-gradient(135deg, #FF007F 0%, #00F0FF 100%)',
    'linear-gradient(135deg, #0B1E2D 0%, #7FC8E8 100%)',
    'linear-gradient(135deg, #F5A63B 0%, #D50000 100%)',
    'linear-gradient(135deg, #2E7D32 0%, #E0FF00 100%)'
  ]
};

export const Customizer: React.FC<CustomizerProps> = ({ onClose, onAddToCart }) => {
  // Configurator Steps
  const steps = [
    'Choose Base',
    'Color Theme',
    'Laces',
    'Sole',
    'Material',
    'Logo',
    'Accessories'
  ];
  const [activeStep, setActiveStep] = useState(0);

  // Editable design title
  const [designTitle, setDesignTitle] = useState('My Custom One-of-One Sneaker');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Configurator Customization State
  const [baseModel, setBaseModel] = useState('Runner');
  const [colors, setColors] = useState<Record<string, string>>({
    upper: '#FFFFFF',
    toeBox: '#EAF6FC',
    heel: '#FFFFFF',
    sidePanels: '#FFFFFF',
    tongue: '#FFFFFF',
    midsole: '#FFFFFF',
    outsole: '#16181C',
    airBubble: '#7FC8E8',
    laceLoops: '#FFFFFF',
    heelPull: '#7FC8E8',
    stitching: '#CCCCCC',
  });
  const [laces, setLaces] = useState({
    type: 'flat',
    thickness: 'medium',
    length: 'standard',
    material: 'cotton',
    color: '#FFFFFF'
  });
  const [soleType, setSoleType] = useState('running');
  const [material, setMaterial] = useState('mesh');
  const [logo, setLogo] = useState({
    type: 'text' as 'none' | 'text' | 'image',
    value: 'ODD',
    position: { x: 220, y: 180 },
    scale: 1.0
  });
  const [accessories, setAccessories] = useState({
    laceTags: false,
    goldEyelets: false,
    reflectiveStrips: false,
    glowOutsole: false,
    carbonHeel: false,
    tongueLabel: '',
    insoleText: ''
  });

  // Selected part for Color Theme step
  const [selectedPart, setSelectedPart] = useState('upper');

  // Preview Control States
  const [angle, setAngle] = useState<'side' | 'top' | 'back' | 'sole'>('side');
  const [zoom, setZoom] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Smart suggestions matching combinations
  const [colorSuggestions, setColorSuggestions] = useState<string[][]>([]);

  // Color picker custom color fields
  const [colorInput, setColorInput] = useState('#FFFFFF');
  const [recentColors, setRecentColors] = useState<string[]>(['#FFFFFF', '#16181C', '#D50000', '#0D47A1', '#7FC8E8']);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(['#7FC8E8', '#F5A63B']);

  // Modals & Certificate states
  const [showCertificate, setShowCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [certificateSerial, setCertificateSerial] = useState('');
  const [size, setSize] = useState<number>(9);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Price calculations
  const calculatePricing = () => {
    const base = BASE_MODELS.find(b => b.name === baseModel)?.price || 12000;
    
    let matCost = 0;
    if (material === 'leather') matCost = 2000;
    if (material === 'suede') matCost = 2500;
    if (material === 'knit') matCost = 1000;
    if (material === 'vegan') matCost = 1500;
    if (material === 'canvas') matCost = 500;
    if (material === 'recycled') matCost = 1000;

    let logoCost = 0;
    if (logo.type === 'text') logoCost = 500;
    if (logo.type === 'image') logoCost = 1500;

    let accCost = 0;
    if (accessories.laceTags) accCost += 500;
    if (accessories.goldEyelets) accCost += 1000;
    if (accessories.reflectiveStrips) accCost += 800;
    if (accessories.glowOutsole) accCost += 1500;
    if (accessories.carbonHeel) accCost += 2000;
    if (accessories.tongueLabel) accCost += 1000;
    if (accessories.insoleText) accCost += 500;

    const total = base + matCost + logoCost + accCost;
    return {
      base,
      material: matCost,
      logo: logoCost,
      accessories: accCost,
      total
    };
  };

  const pricing = calculatePricing();

  // Load configuration from URL Query string on load if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('customizer') === 'true') {
      const base = params.get('base');
      if (base) setBaseModel(base);
      
      const loadedColors: Record<string, string> = { ...colors };
      Object.keys(colors).forEach(part => {
        const val = params.get(`c_${part}`);
        if (val) loadedColors[part] = decodeURIComponent(val);
      });
      setColors(loadedColors);

      const lType = params.get('laces_type');
      const lColor = params.get('laces_color');
      if (lType || lColor) {
        setLaces(prev => ({
          ...prev,
          type: lType || prev.type,
          color: lColor ? decodeURIComponent(lColor) : prev.color
        }));
      }

      const sole = params.get('sole');
      if (sole) setSoleType(sole);

      const mat = params.get('material');
      if (mat) setMaterial(mat);

      const logType = params.get('logo_type');
      const logVal = params.get('logo_val');
      if (logType) {
        setLogo(prev => ({
          ...prev,
          type: logType as any,
          value: logVal ? decodeURIComponent(logVal) : prev.value
        }));
      }
    }
    setCertificateSerial(`OS-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  // Update suggestions based on selected color of the part
  useEffect(() => {
    const activeColor = colors[selectedPart] || '#FFFFFF';
    const suggestions = generateColorSuggestions(activeColor);
    setColorSuggestions(suggestions);
  }, [selectedPart, colors]);

  // Convert Hex to HSL to compute premium colorways
  const generateColorSuggestions = (hex: string) => {
    // Basic HSL parser
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);

    // AI suggestions logic based on active color hue
    if (h >= 0 && h < 30) {
      // Reds / Oranges
      return [
        ['#FFFFFF', '#0B1E2D', '#F5A63B'], // Coral Sunset theme
        ['#16181C', '#C0C0C0', '#D50000'], // High-Contrast Racing
        ['#FAF0CA', '#8D5B4C', '#D4AF37']  // Autumn Gold
      ];
    } else if (h >= 30 && h < 80) {
      // Cream / Yellow
      return [
        ['#8D5B4C', '#D4AF37', '#16181C'], // Desert Camel & Gold
        ['#FFFFFF', '#7FC8E8', '#0D47A1'], // Sky Beach
        ['#2E7D32', '#FAF0CA', '#FFFFFF']  // Forest Cream
      ];
    } else if (h >= 80 && h < 170) {
      // Green
      return [
        ['#16181C', '#70E000', '#FF007F'], // Tokyo Underground (Green/Magenta/Black)
        ['#FFFFFF', '#D4AF37', '#2E7D32'], // Emerald Luxury
        ['#EAF6FC', '#4A9FCB', '#FFFFFF']  // Frozen Mint
      ];
    } else if (h >= 170 && h < 260) {
      // Blue / Cyan
      return [
        ['#FFFFFF', '#F5A63B', '#0B1E2D'], // Nautical Classic
        ['#FF007F', '#E0FF00', '#16181C'], // Cyber Runner
        ['#EAF6FC', '#D4EDF9', '#FFFFFF']  // Triple Ice White
      ];
    } else {
      // Purple / Magenta / Pink
      return [
        ['#00F0FF', '#16181C', '#E0FF00'], // Neon Synthwave
        ['#FFFFFF', '#FFC0CB', '#D4AF37'], // Pastel Rose Gold
        ['#0B1E2D', '#BFE3F5', '#FFFFFF']  // Night Frost
      ];
    }
  };

  // Preset Applier
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setBaseModel(preset.baseModel);
    setColors(preset.colors);
    setLaces(preset.laces);
    setSoleType(preset.soleType);
    setMaterial(preset.material);
    setLogo(preset.logo);
    setAccessories(preset.accessories);
    triggerToast(`Applied "${preset.name}" design preset!`);
    confetti({ particleCount: 60, spread: 40, origin: { y: 0.85 } });
  };

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Interactive rotation mouse/touch handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX.current;
    
    // Rotate Y smoothly
    const nextRot = rotationY + deltaX * 0.45;
    setRotationY(nextRot);
    startX.current = clientX;

    // Simulated camera angle change based on degree range
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

  // Share link generator
  const getShareLink = () => {
    const params = new URLSearchParams();
    params.set('customizer', 'true');
    params.set('base', baseModel);
    Object.entries(colors).forEach(([part, color]) => {
      params.set(`c_${part}`, encodeURIComponent(color));
    });
    params.set('laces_type', laces.type);
    params.set('laces_color', encodeURIComponent(laces.color));
    params.set('sole', soleType);
    params.set('material', material);
    params.set('logo_type', logo.type);
    params.set('logo_val', encodeURIComponent(logo.value));
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyToClipboard = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link);
    triggerToast('Copied customization link to clipboard!');
  };

  // Logo uploader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogo(prev => ({
            ...prev,
            type: 'image',
            value: event.target!.result as string
          }));
          triggerToast('Logo loaded! Drag it on the side panel to reposition.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add to Cart
  const handleCheckoutAdd = () => {
    const customizedProduct: Product = {
      id: `custom-${Date.now()}`,
      name: `${designTitle} (${baseModel})`,
      subtitle: `Designed by You — 1 of 1`,
      category: 'Custom Tech',
      price: pricing.total,
      formattedPrice: `Rs. ${pricing.total.toLocaleString()}`,
      image: '/shoes/hero_white.png', // Fallback display thumbnail
      description: `Custom ${baseModel} configured with ${material} material, ${laces.type} laces, and custom logo accents.`,
      details: [
        `Base Model: ${baseModel}`,
        `Material: ${material.toUpperCase()}`,
        `Sole: ${soleType.toUpperCase()}`,
        logo.type !== 'none' ? `Custom Logo: ${logo.value}` : 'No custom logo',
      ],
      colors: Object.values(colors),
      sizes: [size],
      rating: 5.0
    };

    onAddToCart(customizedProduct, size, 1);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  // Download SVG Preview
  const handleDownload = () => {
    const svgEl = document.querySelector('.shoe-svg-viewport svg');
    if (svgEl) {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = `${designTitle.replace(/\s+/g, '_')}_custom_shoe.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Downloaded Vector Shoe Layout!');
    }
  };

  return (
    <div className="customizer-fullscreen-layout">
      {/* Top Action Header */}
      <header className="customizer-nav-header">
        <button className="back-to-store-btn" onClick={onClose}>
          <ChevronLeft size={20} />
          <span>Exit Studio</span>
        </button>

        <div className="design-title-block">
          {isEditingTitle ? (
            <input
              type="text"
              className="title-edit-input"
              value={designTitle}
              onChange={(e) => setDesignTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
              autoFocus
            />
          ) : (
            <h2 className="title-display" onClick={() => setIsEditingTitle(true)}>
              {designTitle}
              <Sliders size={14} className="edit-icon" />
            </h2>
          )}
          <span className="live-save-badge">
            <Check size={12} /> Auto-Saved
          </span>
        </div>

        <div className="header-actions">
          <button className="icon-header-btn" onClick={() => setShowCertificate(true)} title="View Authenticity Certificate">
            <Award size={18} />
            <span className="desktop-only">Certificate</span>
          </button>
          <button className="icon-header-btn" onClick={copyToClipboard} title="Copy Share Link">
            <Share2 size={18} />
            <span className="desktop-only">Share</span>
          </button>
          <button className="icon-header-btn" onClick={handleDownload} title="Download SVG Design">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Main Dual Pane Layout */}
      <main className="customizer-workspace">
        
        {/* LEFT PANE: Premium Preview Studio */}
        <section className="preview-stage-pane">
          {/* Top Info Chips */}
          <div className="stage-top-chips">
            <div className="limited-badge">
              <Sparkles size={12} /> 1 OF 1 CUSTOM
            </div>
            <div className="delivery-est">
              <Truck size={14} /> Est. Delivery: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
            </div>
          </div>

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
          >
            <div className="shoe-ambient-lighting" />
            
            {/* Embedded Zoomable Shoe SVG */}
            <div className="svg-wrapper" style={{ transform: `scale(${zoom})` }}>
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
                onLogoPositionChange={(pos) => setLogo(prev => ({ ...prev, position: pos }))}
              />
            </div>

            {/* Instruction tooltip */}
            <div className="drag-hint">
              <span>Drag horizontally to rotate shoe 360°</span>
            </div>
          </div>

          {/* Camera Angles / Viewing Options */}
          <div className="camera-nav-bar">
            {(['side', 'top', 'back', 'sole'] as const).map((vAngle) => (
              <button 
                key={vAngle}
                className={`camera-angle-tab ${angle === vAngle ? 'active' : ''}`}
                onClick={() => {
                  setAngle(vAngle);
                  // Set base rotation based on angle selected
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

          {/* Quick Presets Bar */}
          <div className="quick-presets-strip">
            <h4 className="strip-title">Presets</h4>
            <div className="presets-list">
              {PRESETS.map((pr) => (
                <button 
                  key={pr.name}
                  className="preset-pill-btn"
                  onClick={() => applyPreset(pr)}
                >
                  <span className="preset-dot" style={{ background: pr.colors.upper }} />
                  {pr.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT PANE: Steps & Configurator Panel */}
        <section className="configurator-controls-pane">
          {/* Navigation Steps Indicator */}
          <nav className="steps-progress-indicator">
            {steps.map((st, idx) => (
              <button
                key={st}
                className={`step-nav-btn ${idx === activeStep ? 'active' : ''} ${idx < activeStep ? 'completed' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="step-num">{idx + 1}</div>
                <span className="step-label">{st}</span>
              </button>
            ))}
          </nav>

          {/* STEP CONTENT SECTION */}
          <div className="step-detail-card">
            
            {/* STEP 1: CHOOSE BASE */}
            {activeStep === 0 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Select Sneaker Base Model</h3>
                <div className="base-grid">
                  {BASE_MODELS.map((base) => (
                    <div 
                      key={base.id} 
                      className={`base-item-card ${baseModel === base.name ? 'selected' : ''}`}
                      onClick={() => {
                        setBaseModel(base.name);
                        triggerToast(`Switched to ${base.name} Base`);
                      }}
                    >
                      <div className="base-img-box">
                        <img src={base.image} alt={base.name} />
                      </div>
                      <div className="base-meta">
                        <span className="base-name">{base.name}</span>
                        <p className="base-desc">{base.desc}</p>
                        <span className="base-price">Base: Rs. {base.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: COLOR THEME */}
            {activeStep === 1 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Color Customizable Zones</h3>
                
                {/* Zones selector chips */}
                <div className="zones-grid">
                  {Object.keys(colors).map((part) => (
                    <button
                      key={part}
                      className={`zone-select-btn ${selectedPart === part ? 'active' : ''}`}
                      onClick={() => setSelectedPart(part)}
                    >
                      <span className="zone-color-indicator" style={{ backgroundColor: colors[part] }} />
                      <span className="zone-label">{part.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </button>
                  ))}
                </div>

                {/* Color suggestion banner (AI match) */}
                {colorSuggestions.length > 0 && (
                  <div className="smart-suggestions-block">
                    <div className="suggestions-header">
                      <Sparkles size={14} className="badge-sparkle" />
                      <span>Smart Matching Palettes (AI-Assisted)</span>
                    </div>
                    <div className="suggestions-list">
                      {colorSuggestions.map((palette, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="palette-row"
                          onClick={() => {
                            // Apply matching palette colors
                            setColors(prev => ({
                              ...prev,
                              upper: palette[0],
                              toeBox: palette[1],
                              sidePanels: palette[0],
                              heel: palette[2],
                              stitching: palette[2]
                            }));
                            triggerToast('Applied smart matching color combination!');
                          }}
                        >
                          {palette.map((c, cIdx) => (
                            <span key={cIdx} className="palette-color-dot" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium Palette Categories */}
                <div className="premium-color-selectors">
                  <div className="picker-header">
                    <span>Palette Collections</span>
                  </div>

                  {/* Popular */}
                  <div className="color-row-group">
                    <span className="row-label">Popular</span>
                    <div className="colors-grid">
                      {LUXURY_PALETTES.popular.map(c => (
                        <button 
                          key={c} 
                          className={`color-bubble ${colors[selectedPart] === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColors(prev => ({ ...prev, [selectedPart]: c }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="color-row-group">
                    <span className="row-label">Signature</span>
                    <div className="colors-grid">
                      {LUXURY_PALETTES.brand.map(c => (
                        <button 
                          key={c} 
                          className={`color-bubble ${colors[selectedPart] === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColors(prev => ({ ...prev, [selectedPart]: c }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Metallic */}
                  <div className="color-row-group">
                    <span className="row-label">Metallic</span>
                    <div className="colors-grid">
                      {LUXURY_PALETTES.metallic.map(c => (
                        <button 
                          key={c} 
                          className={`color-bubble ${colors[selectedPart] === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColors(prev => ({ ...prev, [selectedPart]: c }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Neon */}
                  <div className="color-row-group">
                    <span className="row-label">Neon Glow</span>
                    <div className="colors-grid">
                      {LUXURY_PALETTES.neon.map(c => (
                        <button 
                          key={c} 
                          className={`color-bubble ${colors[selectedPart] === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColors(prev => ({ ...prev, [selectedPart]: c }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom color manual hex/HSL inputs */}
                  <div className="custom-color-inputs">
                    <div className="inputs-row">
                      <div className="color-input-box">
                        <label>HEX</label>
                        <input
                          type="text"
                          value={colors[selectedPart]}
                          onChange={(e) => setColors(prev => ({ ...prev, [selectedPart]: e.target.value }))}
                        />
                      </div>
                      <div className="color-input-box">
                        <label>Eyedropper</label>
                        <input
                          type="color"
                          value={colors[selectedPart]}
                          onChange={(e) => setColors(prev => ({ ...prev, [selectedPart]: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: LACE CUSTOMIZATION */}
            {activeStep === 2 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Lace Properties</h3>
                
                <div className="control-option-group">
                  <span className="option-label">Lace Type</span>
                  <div className="toggle-options-grid">
                    {['flat', 'round', 'rope', 'reflective', 'elastic'].map((type) => (
                      <button
                        key={type}
                        className={`toggle-option-btn ${laces.type === type ? 'active' : ''}`}
                        onClick={() => setLaces(prev => ({ ...prev, type }))}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-option-group">
                  <span className="option-label">Thickness</span>
                  <div className="toggle-options-grid">
                    {['thin', 'medium', 'thick'].map((thickness) => (
                      <button
                        key={thickness}
                        className={`toggle-option-btn ${laces.thickness === thickness ? 'active' : ''}`}
                        onClick={() => setLaces(prev => ({ ...prev, thickness }))}
                      >
                        {thickness.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-option-group">
                  <span className="option-label">Laces Color</span>
                  <div className="colors-grid">
                    {LUXURY_PALETTES.popular.map(c => (
                      <button 
                        key={c} 
                        className={`color-bubble ${laces.color === c ? 'selected' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setLaces(prev => ({ ...prev, color: c }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SOLE */}
            {activeStep === 3 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Sole Type Options</h3>
                
                <div className="sole-types-list">
                  {[
                    { id: 'air', name: 'Air Sole', desc: 'Embedded heel chamber capsule containing organic fluid.' },
                    { id: 'foam', name: 'Foam Sole', desc: 'Responsive high-buoyancy superlight foam compounds.' },
                    { id: 'bubble', name: 'Bubble Sole', desc: 'Vaporized gel-pods offering extreme shock absorption.' },
                    { id: 'chunky', name: 'Chunky Sole', desc: 'Aggressive multi-layered platform sole for high style presence.' },
                    { id: 'running', name: 'Running Sole', desc: 'Aerodynamic tread geometry customized for road grip.' },
                    { id: 'lifestyle', name: 'Lifestyle Sole', desc: 'Flat retro vulcanized construction with organic finish.' }
                  ].map((s) => (
                    <div
                      key={s.id}
                      className={`sole-select-row ${soleType === s.id ? 'selected' : ''}`}
                      onClick={() => setSoleType(s.id)}
                    >
                      <div className="row-info">
                        <span className="sole-name">{s.name}</span>
                        <p className="sole-desc">{s.desc}</p>
                      </div>
                      <div className="radio-dot" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: MATERIAL */}
            {activeStep === 4 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Tactile Materials (Upper Coating)</h3>
                
                <div className="materials-grid">
                  {[
                    { id: 'leather', name: 'Leather', cost: '+ Rs. 2,000', desc: 'Full grain high-gloss premium calf leather.' },
                    { id: 'suede', name: 'Suede', cost: '+ Rs. 2,500', desc: 'Tactile textured nap split leather for organic aesthetic.' },
                    { id: 'mesh', name: 'Mesh', cost: 'Included', desc: 'Dual-layer breathable lattice performance mesh.' },
                    { id: 'knit', name: 'Knit', cost: '+ Rs. 1,000', desc: 'Seamless engineered zero-waste flexible yarn.' },
                    { id: 'canvas', name: 'Canvas', cost: '+ Rs. 500', desc: 'Vintage heavy-duty industrial weave cotton.' },
                    { id: 'recycled', name: 'Recycled Fabric', cost: '+ Rs. 1,000', desc: 'Eco-conscious ocean plastic woven textiles.' },
                    { id: 'vegan', name: 'Vegan Leather', cost: '+ Rs. 1,500', desc: 'Corn-starch organic bio-based composite leather.' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      className={`material-card-row ${material === m.id ? 'selected' : ''}`}
                      onClick={() => setMaterial(m.id)}
                    >
                      <div className="mat-details">
                        <span className="mat-name">{m.name}</span>
                        <p className="mat-desc">{m.desc}</p>
                      </div>
                      <span className="mat-cost-badge">{m.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: LOGO & GRAPHICS */}
            {activeStep === 5 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Brand & Signature Decal</h3>
                
                <div className="control-option-group">
                  <span className="option-label">Logo Type</span>
                  <div className="toggle-options-grid">
                    {(['none', 'text', 'image'] as const).map((type) => (
                      <button
                        key={type}
                        className={`toggle-option-btn ${logo.type === type ? 'active' : ''}`}
                        onClick={() => setLogo(prev => ({ ...prev, type }))}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {logo.type === 'text' && (
                  <div className="input-block animate-slide">
                    <label className="input-field-label">Custom Initials / Name (Max 5 letters)</label>
                    <input
                      type="text"
                      className="text-signature-input"
                      maxLength={5}
                      value={logo.value}
                      onChange={(e) => setLogo(prev => ({ ...prev, value: e.target.value.toUpperCase() }))}
                      placeholder="e.g. ODD"
                    />
                    <p className="field-hint">Tip: Drag the logo directly on the shoe side panel to reposition.</p>
                  </div>
                )}

                {logo.type === 'image' && (
                  <div className="input-block animate-slide">
                    <label className="input-field-label">Upload Vector / Transparent PNG Logo</label>
                    <div className="file-uploader-stage">
                      <Upload size={24} />
                      <span>Drop Logo Image Here</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="file-input-cover" 
                      />
                    </div>
                    <p className="field-hint">High resolution files recommended. Drag logo to position.</p>
                  </div>
                )}

                {logo.type !== 'none' && (
                  <div className="logo-scale-slider animate-slide">
                    <div className="slider-labels">
                      <span>Logo Scale</span>
                      <span>{Math.round(logo.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={logo.scale}
                      onChange={(e) => setLogo(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="slider-input"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: ACCESSORIES & DETAILS */}
            {activeStep === 6 && (
              <div className="step-content animate-fade">
                <h3 className="control-section-title">Hardware & Fine Details</h3>
                
                <div className="accessories-checkboxes-list">
                  {[
                    { id: 'laceTags', name: 'Metal Lace Tags (Deubré)', cost: '+ Rs. 500', desc: 'Glossy engraved metal tags at base of laces.' },
                    { id: 'goldEyelets', name: 'Gold Hardware Eyelets', cost: '+ Rs. 1,000', desc: 'Anodized brass gold loops replacing regular lace eyelets.' },
                    { id: 'reflectiveStrips', name: '3M Reflective Striping', cost: '+ Rs. 800', desc: 'Reflective stripes along heel counter for night presence.' },
                    { id: 'glowOutsole', name: 'Glow-in-the-Dark Outsole', cost: '+ Rs. 1,500', desc: 'Luminescent rubber compound sole that glows green.' },
                    { id: 'carbonHeel', name: 'Carbon Fiber Heel Plate', cost: '+ Rs. 2,000', desc: 'High-rigidity lightweight protective carbon plate at heel.' }
                  ].map((acc) => (
                    <div
                      key={acc.id}
                      className={`acc-checkbox-row ${accessories[acc.id as keyof typeof accessories] ? 'selected' : ''}`}
                      onClick={() => setAccessories(prev => ({
                        ...prev,
                        [acc.id]: !prev[acc.id as keyof typeof accessories]
                      }))}
                    >
                      <div className="check-box-outer">
                        <div className="check-box-dot" />
                      </div>
                      <div className="acc-info">
                        <span className="acc-title">{acc.name}</span>
                        <p className="acc-desc">{acc.desc}</p>
                      </div>
                      <span className="acc-cost">{acc.cost}</span>
                    </div>
                  ))}

                  {/* Text labels input */}
                  <div className="acc-text-inputs">
                    <div className="input-group-acc">
                      <label>Personalized Tongue Label (Max 8 Char)</label>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={accessories.tongueLabel} 
                        onChange={(e) => setAccessories(prev => ({ ...prev, tongueLabel: e.target.value }))}
                        placeholder="e.g. BOSS"
                      />
                    </div>
                    <div className="input-group-acc">
                      <label>Insole Bed Print Text (Max 15 Char)</label>
                      <input 
                        type="text" 
                        maxLength={15}
                        value={accessories.insoleText} 
                        onChange={(e) => setAccessories(prev => ({ ...prev, insoleText: e.target.value }))}
                        placeholder="e.g. MADE BY ME"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* STEP FOOTER: PRICE & PROGRESS CONTROLS */}
          <div className="configurator-footer-summary">
            {/* Pricing breakdown summary */}
            <div className="pricing-bar">
              <div className="pricing-info">
                <span className="label">Total Price</span>
                <span className="total-val animate-scale">
                  Rs. {pricing.total.toLocaleString()}
                </span>
              </div>
              <div className="size-selector-box">
                <label>US Size</label>
                <select value={size} onChange={(e) => setSize(parseFloat(e.target.value))}>
                  {[7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="navigation-actions-row">
              <button 
                className="step-nav-arrow-btn"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={18} /> Prev
              </button>

              {activeStep < steps.length - 1 ? (
                <button 
                  className="step-nav-arrow-btn primary-step-btn"
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  className="add-to-cart-cta-btn"
                  onClick={handleCheckoutAdd}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Bag</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* -------------------- MODAL: "DESIGNED BY YOU" CERTIFICATE OF AUTHENTICITY -------------------- */}
      {showCertificate && (
        <div className="certificate-modal-overlay">
          <div className="certificate-card">
            <button className="close-cert-btn" onClick={() => setShowCertificate(false)}>
              <X size={20} />
            </button>
            
            <div className="cert-header">
              <Award size={48} className="cert-gold-medal" />
              <h3>Certificate of Authenticity</h3>
              <p>ODDSHOE 1-OF-1 BESPOKE DESIGN STUDIO</p>
            </div>

            <div className="cert-body">
              <p className="cert-intro">This document certifies that the custom footwear described below was uniquely designed and ordered as a premium 1-of-1 creation.</p>
              
              <div className="cert-specs-table">
                <div className="spec-row">
                  <span className="spec-label">Design Name:</span>
                  <span className="spec-val">{designTitle}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Base Model:</span>
                  <span className="spec-val">{baseModel}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Material & Sole:</span>
                  <span className="spec-val">{material.toUpperCase()} / {soleType.toUpperCase()}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Serial Number:</span>
                  <span className="spec-val serial-txt">{certificateSerial}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Date Created:</span>
                  <span className="spec-val">{new Date().toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</span>
                </div>
              </div>

              <div className="cert-signature-section">
                <div className="sig-block">
                  <span className="sig-line">Antigravity Customizer</span>
                  <label>Studio Signature</label>
                </div>
                <div className="sig-block">
                  <span className="sig-line">{designTitle.length > 15 ? 'Customer Design' : designTitle}</span>
                  <label>Designer (You)</label>
                </div>
              </div>
            </div>

            <div className="cert-footer">
              <button className="print-btn" onClick={() => window.print()}>
                <Printer size={16} /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- FLOATING NOTIFICATION TOAST -------------------- */}
      {toastMessage && (
        <div className="floating-toast-alert animate-slide">
          <Sparkles size={16} color="var(--oddshoe-amber)" />
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        .customizer-fullscreen-layout {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at 50% 20%, #A2DBF3 0%, #7FC8E8 45%, #60B7DF 100%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          font-family: var(--font-body);
          overflow: hidden;
        }

        .customizer-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--glass-border-standard);
          z-index: 10;
        }

        .back-to-store-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          font-size: 0.95rem;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(255,255,255,0.3);
          border: 1px solid var(--glass-border-standard);
          transition: all var(--transition-fast);
        }

        .back-to-store-btn:hover {
          background: rgba(255,255,255,0.6);
          transform: translateX(-3px);
        }

        .design-title-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .title-display {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--oddshoe-navy-900);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-edit-input {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--oddshoe-navy-900);
          border: none;
          background: rgba(255,255,255,0.7);
          border-radius: 4px;
          padding: 2px 8px;
          outline: 1.5px solid var(--oddshoe-navy-900);
          text-align: center;
        }

        .edit-icon {
          opacity: 0.5;
        }

        .live-save-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: #2E7D32;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .icon-header-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.3);
          border: 1px solid var(--glass-border-standard);
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
          font-size: 0.85rem;
          transition: all var(--transition-fast);
        }

        .icon-header-btn:hover {
          background: rgba(255,255,255,0.6);
          transform: translateY(-2px);
        }

        /* workspace */
        .customizer-workspace {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          flex: 1;
          height: calc(100vh - 76px);
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .customizer-workspace {
            grid-template-columns: 1fr;
            grid-template-rows: 1.1fr 1fr;
            overflow-y: auto;
          }
        }

        /* Left side */
        .preview-stage-pane {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 32px 16px;
          border-right: 1px solid var(--glass-border-standard);
          overflow: hidden;
        }

        .stage-top-chips {
          display: flex;
          justify-content: space-between;
          z-index: 3;
        }

        .limited-badge {
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .delivery-est {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--glass-border-standard);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .interactive-drag-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: grab;
          z-index: 2;
        }

        .interactive-drag-container:active {
          cursor: grabbing;
        }

        .shoe-ambient-lighting {
          position: absolute;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%);
          pointer-events: none;
        }

        .svg-wrapper {
          width: 100%;
          max-width: 480px;
          height: auto;
          transition: transform 0.2s ease-out;
        }

        .drag-hint {
          position: absolute;
          bottom: 12px;
          background: rgba(11,30,45,0.7);
          color: #FFF;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 600;
          pointer-events: none;
          backdrop-filter: blur(4px);
        }

        .camera-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 3;
          background: rgba(255,255,255,0.4);
          padding: 8px 16px;
          border-radius: 24px;
          border: 1px solid var(--glass-border-standard);
        }

        .camera-angle-tab {
          padding: 6px 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.72rem;
          color: var(--oddshoe-navy-900);
          background: transparent;
          transition: all var(--transition-fast);
        }

        .camera-angle-tab.active {
          background: var(--oddshoe-navy-900);
          color: #FFF;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .zoom-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
        }

        .zoom-val {
          font-size: 0.76rem;
          font-weight: 800;
          min-width: 38px;
          text-align: center;
        }

        .quick-presets-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          z-index: 3;
        }

        .strip-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          color: var(--oddshoe-navy-900);
        }

        .presets-list {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
        }

        .preset-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.45);
          border: 1px solid var(--glass-border-standard);
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
          white-space: nowrap;
        }

        .preset-pill-btn:hover {
          background: rgba(255,255,255,0.7);
        }

        .preset-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Right side */
        .configurator-controls-pane {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .steps-progress-indicator {
          display: flex;
          border-bottom: 1px solid var(--glass-border-standard);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .step-nav-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 6px;
          gap: 4px;
          border-bottom: 3px solid transparent;
          min-width: 72px;
          opacity: 0.55;
          transition: all var(--transition-fast);
        }

        .step-nav-btn.active {
          opacity: 1;
          border-color: var(--oddshoe-amber);
        }

        .step-nav-btn.completed .step-num {
          background: #2E7D32;
          color: #FFF;
        }

        .step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--oddshoe-navy-900);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-label {
          font-size: 0.62rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* Step Details */
        .step-detail-card {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
        }

        .control-section-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--oddshoe-navy-900);
          margin-bottom: 18px;
        }

        /* Step 1: Base Grid */
        .base-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .base-grid {
            grid-template-columns: 1fr;
          }
        }

        .base-item-card {
          background: rgba(255,255,255,0.4);
          border: 1px solid var(--glass-border-standard);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .base-item-card.selected {
          border-color: var(--oddshoe-navy-900);
          background: rgba(255,255,255,0.85);
          box-shadow: var(--shadow-md);
        }

        .base-img-box {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .base-img-box img {
          max-height: 100%;
          width: auto;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.1));
        }

        .base-name {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          display: block;
        }

        .base-desc {
          font-size: 0.72rem;
          color: rgba(11,30,45,0.75);
          line-height: 1.4;
          margin-top: 4px;
        }

        .base-price {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          display: block;
          margin-top: 8px;
        }

        /* Step 2: Zones & Colors */
        .zones-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        .zone-select-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.35);
          border: 1px solid var(--glass-border-standard);
          transition: all var(--transition-fast);
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
        }

        .zone-select-btn.active {
          background: #FFF;
          border-color: var(--oddshoe-navy-900);
          box-shadow: var(--shadow-sm);
        }

        .zone-color-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15);
        }

        /* AI suggestions */
        .smart-suggestions-block {
          background: rgba(245, 166, 59, 0.08);
          border: 1px solid rgba(245, 166, 59, 0.35);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--oddshoe-amber-hover);
          text-transform: uppercase;
        }

        .suggestions-list {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .palette-row {
          display: flex;
          padding: 4px;
          background: rgba(255,255,255,0.7);
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .palette-row:hover {
          border-color: var(--oddshoe-amber);
        }

        .palette-color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          margin: 0 2px;
        }

        /* Premium picker */
        .premium-color-selectors {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .picker-header {
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--oddshoe-navy-900);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding-bottom: 4px;
        }

        .color-row-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .row-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(11,30,45,0.7);
        }

        .colors-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .color-bubble {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid #FFF;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .color-bubble.selected {
          transform: scale(1.22);
          border-color: var(--oddshoe-navy-900);
        }

        .custom-color-inputs .inputs-row {
          display: flex;
          gap: 16px;
        }

        .color-input-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .color-input-box label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
        }

        .color-input-box input[type="text"] {
          border: 1px solid var(--glass-border-standard);
          background: rgba(255,255,255,0.6);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          width: 90px;
        }

        .color-input-box input[type="color"] {
          border: none;
          background: transparent;
          width: 38px;
          height: 28px;
          cursor: pointer;
        }

        /* Laces */
        .control-option-group {
          margin-bottom: 20px;
        }

        .option-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          display: block;
          margin-bottom: 8px;
        }

        .toggle-options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .toggle-option-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.4);
          border: 1px solid var(--glass-border-standard);
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          transition: all var(--transition-fast);
        }

        .toggle-option-btn.active {
          background: var(--oddshoe-navy-900);
          color: #FFF;
        }

        /* Sole type lists */
        .sole-types-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sole-select-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.4);
          border: 1px solid var(--glass-border-standard);
          border-radius: 12px;
          padding: 12px 18px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sole-select-row.selected {
          background: #FFF;
          border-color: var(--oddshoe-navy-900);
        }

        .row-info .sole-name {
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--oddshoe-navy-900);
        }

        .row-info .sole-desc {
          font-size: 0.72rem;
          color: rgba(11,30,45,0.7);
          margin-top: 2px;
        }

        .radio-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--oddshoe-navy-900);
          position: relative;
        }

        .sole-select-row.selected .radio-dot::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--oddshoe-navy-900);
        }

        /* Materials */
        .materials-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .material-card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(255,255,255,0.4);
          border: 1px solid var(--glass-border-standard);
          border-radius: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .material-card-row.selected {
          background: #FFF;
          border-color: var(--oddshoe-navy-900);
        }

        .mat-details .mat-name {
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--oddshoe-navy-900);
        }

        .mat-details .mat-desc {
          font-size: 0.72rem;
          color: rgba(11,30,45,0.7);
          margin-top: 2px;
        }

        .mat-cost-badge {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          background: rgba(255,255,255,0.85);
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* Logo */
        .input-block {
          margin-top: 16px;
        }

        .input-field-label {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          display: block;
          margin-bottom: 6px;
        }

        .text-signature-input {
          width: 100%;
          border: 1px solid var(--glass-border-standard);
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          outline: none;
        }

        .text-signature-input:focus {
          border-color: var(--oddshoe-navy-900);
        }

        .file-uploader-stage {
          position: relative;
          border: 2px dashed rgba(11,30,45,0.3);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--oddshoe-navy-900);
          background: rgba(255,255,255,0.3);
        }

        .file-input-cover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .field-hint {
          font-size: 0.68rem;
          color: rgba(11,30,45,0.65);
          margin-top: 6px;
        }

        .logo-scale-slider {
          margin-top: 20px;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          margin-bottom: 6px;
        }

        .slider-input {
          width: 100%;
          accent-color: var(--oddshoe-navy-900);
        }

        /* Accessories */
        .accessories-checkboxes-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .acc-checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.4);
          border: 1px solid var(--glass-border-standard);
          border-radius: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .acc-checkbox-row.selected {
          background: #FFF;
          border-color: var(--oddshoe-navy-900);
        }

        .check-box-outer {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid var(--oddshoe-navy-900);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .acc-checkbox-row.selected .check-box-dot {
          width: 10px;
          height: 10px;
          background: var(--oddshoe-navy-900);
          border-radius: 1px;
        }

        .acc-info .acc-title {
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--oddshoe-navy-900);
          display: block;
        }

        .acc-info .acc-desc {
          font-size: 0.7rem;
          color: rgba(11,30,45,0.7);
          margin-top: 2px;
        }

        .acc-cost {
          margin-left: auto;
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
        }

        .acc-text-inputs {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-group-acc {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group-acc label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
        }

        .input-group-acc input {
          border: 1px solid var(--glass-border-standard);
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          outline: none;
        }

        /* Footer */
        .configurator-footer-summary {
          border-top: 1px solid var(--glass-border-standard);
          background: rgba(255, 255, 255, 0.7);
          padding: 16px 32px;
        }

        .pricing-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .pricing-info .label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(11,30,45,0.75);
          display: block;
        }

        .pricing-info .total-val {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--oddshoe-navy-900);
        }

        .size-selector-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .size-selector-box label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
        }

        .size-selector-box select {
          border: 1px solid var(--glass-border-standard);
          background: #FFF;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.8rem;
        }

        .navigation-actions-row {
          display: flex;
          gap: 12px;
        }

        .step-nav-arrow-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.85);
          border: 1px solid var(--glass-border-standard);
          color: var(--oddshoe-navy-900);
          font-weight: 800;
          font-size: 0.85rem;
        }

        .step-nav-arrow-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .primary-step-btn {
          background: var(--oddshoe-navy-900);
          color: #FFF;
          border: none;
        }

        .add-to-cart-cta-btn {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 10px;
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          font-weight: 800;
          font-size: 0.9rem;
          box-shadow: 0 4px 14px rgba(245, 166, 59, 0.35);
          transition: all var(--transition-fast);
        }

        .add-to-cart-cta-btn:hover {
          background: var(--oddshoe-amber-hover);
          transform: translateY(-2px);
        }

        /* Certificate Modal */
        .certificate-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 30, 45, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 24px;
        }

        .certificate-card {
          width: 100%;
          max-width: 520px;
          background: #FAF9F6;
          border: 8px double #C5A059;
          border-radius: 4px;
          padding: 32px;
          position: relative;
          color: #1A1A1A;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .close-cert-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          color: #888;
        }

        .cert-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-bottom: 2px solid #C5A059;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .cert-gold-medal {
          color: #C5A059;
          margin-bottom: 12px;
        }

        .cert-header h3 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #C5A059;
        }

        .cert-header p {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .cert-body {
          font-size: 0.85rem;
          line-height: 1.5;
          text-align: center;
        }

        .cert-intro {
          font-style: italic;
          margin-bottom: 20px;
          color: #444;
        }

        .cert-specs-table {
          background: rgba(197, 160, 89, 0.08);
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid rgba(197, 160, 89, 0.15);
        }

        .spec-row:last-child {
          border-bottom: none;
        }

        .spec-label {
          font-weight: 700;
          font-size: 0.76rem;
          color: #666;
        }

        .spec-val {
          font-weight: 800;
          font-size: 0.78rem;
          color: #1A1A1A;
        }

        .serial-txt {
          font-family: monospace;
          color: #C5A059;
          font-size: 0.95rem;
        }

        .cert-signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          padding: 0 16px;
        }

        .sig-block {
          display: flex;
          flex-direction: column;
          width: 42%;
        }

        .sig-line {
          font-family: 'Syne', cursive;
          font-size: 0.85rem;
          font-weight: 700;
          border-bottom: 1px solid #1A1A1A;
          padding-bottom: 4px;
          height: 24px;
        }

        .sig-block label {
          font-size: 0.62rem;
          font-weight: 700;
          color: #666;
          margin-top: 4px;
        }

        .cert-footer {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }

        .print-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #C5A059;
          color: #FFF;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.85rem;
        }

        /* Floating Toast Alert */
        .floating-toast-alert {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: var(--oddshoe-navy-900);
          color: #FFF;
          border-radius: 12px;
          padding: 12px 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          z-index: 10001;
        }

        /* CSS animations */
        .animate-fade {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slide {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
