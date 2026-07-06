import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES, PRODUCTS_CATALOG } from '../data/products';
import { Product } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onSelectProduct,
  onAddToCart
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const trendingProduct = PRODUCTS_CATALOG[0]; // Green m123

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTouchStartTime(Date.now());
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    // Only swipe if horizontal drag is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Prevent default scrolling on horizontal swipe
      if (e.cancelable) {
        e.preventDefault();
      }
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const touchEndX = e.changedTouches[0].clientX;
    const duration = Date.now() - touchStartTime;
    const diffX = touchEndX - touchStartX;
    const velocity = diffX / duration;

    // Snapping thresholds: 80px displacement or high velocity swipe
    if (diffX < -80 || velocity < -0.4) {
      handleNext();
    } else if (diffX > 80 || velocity > 0.4) {
      handlePrev();
    }
    
    setDragOffset(0);
  };

  return (
    <section 
      id="hero" 
      className="oddshoe-hero"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Soft Radial Ambient Glow */}
      <div className="hero-radial-glow animate-glow" />

      {/* Massive Edge-to-Edge Display Typography ("ODD SHOE") */}
      <div className="hero-typography-backdrop">
        <div 
          className="hero-typography-track"
          style={{
            transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset * 0.3}px))`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {HERO_SLIDES.map((slide) => (
            <div key={`typo-${slide.id}`} className="hero-typography-slide-item">
              <h1 className="display-hero-text">
                {slide.heroText || 'ODD SHOE'}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* Floating 3D Sneaker Hero Shot Slider */}
      <div className="hero-shoe-slider-container">
        <div 
          className="hero-shoe-slider-track"
          style={{
            transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {HERO_SLIDES.map((slide) => (
            <div key={`shoe-stage-${slide.id}`} className="hero-shoe-slide-item">
              <div className="hero-shoe-stage-inner">
                <img 
                  src={slide.image} 
                  alt={slide.name} 
                  className="hero-shoe-image animate-float"
                  onClick={() => onSelectProduct(slide)}
                />
                <div className="hero-shoe-shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content Left: Tagline & CTA Slider */}
      <div className="hero-content-slider-container">
        <div 
          className="hero-content-slider-track"
          style={{
            transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset * 0.7}px))`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {HERO_SLIDES.map((slide) => (
            <div key={`content-${slide.id}`} className="hero-content-slide-item">
              <div className="hero-badge">
                <Sparkles size={14} className="badge-sparkle" />
                <span>NEW DROP 2026</span>
              </div>
              <h2 className="hero-tagline">{slide.subtitle}</h2>
              <p className="hero-description">{slide.description}</p>
              <div className="hero-cta-group">
                <button className="primary-explore-btn" onClick={onExploreClick}>
                  <span>Explore</span>
                  <ArrowUpRight size={18} className="cta-arrow" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Controls: Pagination */}
      <div className="hero-carousel-controls">
        <button className="ctrl-arrow" onClick={handlePrev} aria-label="Previous Drop">
          <ChevronLeft size={20} />
        </button>
        <span className="slide-counter">
          0{currentSlideIndex + 1}/0{HERO_SLIDES.length}
        </span>
        <button className="ctrl-arrow" onClick={handleNext} aria-label="Next Drop">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Floating Side Callout: Our Trending Arrivals */}
      <div className="trending-arrivals-card">
        <div className="trending-thumb-box">
          <img src={trendingProduct.image} alt={trendingProduct.name} />
        </div>
        <div className="trending-info">
          <h4 className="trending-heading">Our Trending Arrivals</h4>
          <p className="trending-sub">Vivid multi-layer sole edition</p>
          <button 
            className="trending-shop-btn"
            onClick={() => onAddToCart(trendingProduct)}
          >
            Shop Now
          </button>
        </div>
      </div>

      <style>{`
        .oddshoe-hero {
          position: relative;
          min-height: calc(100vh - 120px);
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 40px 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          touch-action: pan-y;
        }

        .hero-radial-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(127, 200, 232, 0) 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* Enormous background display type */
        .hero-typography-backdrop {
          position: absolute;
          top: 28%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-typography-track {
          display: flex;
          width: 100%;
          will-change: transform;
        }

        .hero-typography-slide-item {
          width: 100%;
          flex-shrink: 0;
          text-align: center;
        }

        .hero-typography-backdrop .display-hero-text {
          font-size: clamp(5rem, 18vw, 15rem);
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 15px 30px rgba(11, 30, 45, 0.08);
          white-space: nowrap;
        }

        /* 3D Floating Shoe Stage Slider */
        .hero-shoe-slider-container {
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -45%);
          z-index: 4;
          width: 580px;
          max-width: 90vw;
          overflow: visible;
          pointer-events: auto;
        }

        .hero-shoe-slider-track {
          display: flex;
          width: 100%;
          will-change: transform;
        }

        .hero-shoe-slide-item {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-shoe-stage-inner {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .hero-shoe-image {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 25px 40px rgba(11, 30, 45, 0.28));
          transition: transform var(--transition-spring);
        }

        .hero-shoe-stage-inner:hover .hero-shoe-image {
          transform: scale(1.06) translateY(-10px) rotate(-3deg);
        }

        .hero-shoe-shadow {
          width: 70%;
          height: 30px;
          background: radial-gradient(ellipse at center, rgba(11, 30, 45, 0.35) 0%, rgba(11, 30, 45, 0) 70%);
          border-radius: 50%;
          margin-top: -20px;
          filter: blur(8px);
        }

        /* Left Side Tagline & Action Slider */
        .hero-content-slider-container {
          position: relative;
          z-index: 5;
          max-width: 440px;
          margin-top: 180px;
          overflow: hidden;
          width: 100%;
        }

        .hero-content-slider-track {
          display: flex;
          width: 100%;
          will-change: transform;
        }

        .hero-content-slide-item {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border-standard);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--oddshoe-navy-900);
          margin-bottom: 12px;
          box-shadow: var(--glass-shadow);
          align-self: flex-start;
        }

        .badge-sparkle {
          color: var(--oddshoe-amber);
        }

        .hero-tagline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 2.2rem;
          color: var(--oddshoe-white);
          text-shadow: 0 4px 12px rgba(11, 30, 45, 0.15);
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .hero-description {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--oddshoe-navy-900);
          opacity: 0.85;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .primary-explore-btn {
          padding: 12px 28px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.4);
          color: var(--oddshoe-white);
          font-weight: 700;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: all var(--transition-fast);
          box-shadow: 0 8px 24px rgba(11, 30, 45, 0.12);
        }

        .primary-explore-btn:hover {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          border-color: var(--oddshoe-amber);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(245, 166, 59, 0.4);
        }

        .primary-explore-btn:hover .cta-arrow {
          transform: translate(3px, -3px);
        }

        .cta-arrow {
          transition: transform var(--transition-fast);
        }

        /* Carousel Controls (01/05) */
        .hero-carousel-controls {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 18px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border-standard);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          padding: 8px 20px;
          border-radius: 30px;
          box-shadow: var(--glass-shadow);
        }

        .ctrl-arrow {
          color: var(--oddshoe-white);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
          min-width: 44px;
          min-height: 44px;
        }

        .ctrl-arrow:hover {
          transform: scale(1.2);
        }

        .slide-counter {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          color: var(--oddshoe-white);
        }

        /* Side Callout Card: Trending Arrivals */
        .trending-arrivals-card {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border-standard);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          margin-top: 240px;
          max-width: 320px;
          transition: all var(--transition-normal);
        }

        .trending-arrivals-card:hover {
          background: var(--glass-bg-hover);
          transform: translateY(-3px);
        }

        .trending-thumb-box {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .trending-thumb-box img {
          width: 90%;
          height: auto;
          filter: drop-shadow(0 4px 6px rgba(11,30,45,0.15));
        }

        .trending-info {
          display: flex;
          flex-direction: column;
        }

        .trending-heading {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--oddshoe-navy-900);
        }

        .trending-sub {
          font-size: 0.72rem;
          color: rgba(11, 30, 45, 0.75);
          margin-bottom: 6px;
        }

        .trending-shop-btn {
          align-self: flex-start;
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.6);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
          transition: all var(--transition-fast);
        }

        .trending-shop-btn:hover {
          background: var(--oddshoe-amber);
          border-color: var(--oddshoe-amber);
        }

        .trending-shop-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 1024px) {
          .oddshoe-hero {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding-bottom: 120px;
          }
          .hero-content-slider-container {
            margin-top: 360px;
            align-items: center;
            max-width: 100%;
          }
          .hero-content-slide-item {
            align-items: center;
            text-align: center;
          }
          .hero-badge {
            align-self: center;
          }
          .hero-cta-group {
            justify-content: center;
          }
          .trending-arrivals-card {
            margin-top: 20px;
          }
          .hero-shoe-slider-container {
            top: 25%;
            width: 420px;
          }
        }

        @media (max-width: 768px) {
          .oddshoe-hero {
            padding: 16px 16px 80px;
          }

          .hero-radial-glow {
            width: 400px;
            height: 400px;
          }

          .hero-typography-backdrop {
            top: 24%;
          }

          .hero-typography-backdrop .display-hero-text {
            font-size: clamp(3rem, 15vw, 5.5rem);
            color: rgba(255, 255, 255, 0.45);
            text-shadow: 0 10px 20px rgba(11, 30, 45, 0.05);
          }

          .hero-shoe-slider-container {
            width: 300px;
            top: 24%;
          }

          .hero-content-slider-container {
            margin-top: 224px;
            padding: 0 16px;
          }

          .hero-badge {
            margin-bottom: 8px;
          }

          .hero-tagline {
            font-size: 1.8rem;
            line-height: 1.2;
            letter-spacing: -0.01em;
            max-width: 290px;
            margin-bottom: 8px;
          }

          .hero-description {
            font-size: 0.85rem;
            max-width: 320px;
            line-height: 1.55;
            color: var(--oddshoe-navy-900);
            opacity: 0.7;
            margin-top: 8px;
            margin-bottom: 24px;
          }

          .primary-explore-btn {
            padding: 12px 28px;
          }

          .primary-explore-btn:active {
            transform: scale(0.96) translateY(0);
            background: rgba(255, 255, 255, 0.6);
          }

          .hero-carousel-controls {
            bottom: 24px;
            padding: 6px 16px;
          }

          .ctrl-arrow {
            min-width: 44px;
            min-height: 44px;
          }

          .trending-arrivals-card {
            margin-top: 24px;
          }
        }
      `}</style>
    </section>
  );
};
