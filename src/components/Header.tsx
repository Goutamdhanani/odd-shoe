import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, Heart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onNavigateSection: (sectionId: string) => void;
  wishlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onNavigateSection,
  wishlistCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);

  return (
    <header className="oddshoe-header">
      <div className="header-inner">
        {/* Brand Lockup */}
        <a href="#" className="brand-lockup" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-logo-chip">
            <svg viewBox="0 0 40 40" className="brand-icon">
              <rect width="40" height="40" rx="10" fill="#0B1E2D" />
              <path d="M12 26 C16 12, 24 12, 28 26 C24 30, 16 30, 12 26 Z" fill="#7FC8E8" />
              <circle cx="18" cy="20" r="2.5" fill="#F5A63B" />
            </svg>
          </div>
          <span className="brand-wordmark">
            <span className="brand-odd">ODD</span>
            <span className="brand-shoe">SHOE</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button className="nav-link active" onClick={() => onNavigateSection('hero')}>
            HOME
          </button>

          <div 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setProductsDropdown(true)}
            onMouseLeave={() => setProductsDropdown(false)}
          >
            <button className="nav-link dropdown-trigger" onClick={() => onNavigateSection('products')}>
              OUR PRODUCT'S <ChevronDown size={14} className={`chevron ${productsDropdown ? 'open' : ''}`} />
            </button>

            {productsDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => { onNavigateSection('products'); setProductsDropdown(false); }}>All Drop Catalog</button>
                <button onClick={() => { onNavigateSection('products'); setProductsDropdown(false); }}>Air Series</button>
                <button onClick={() => { onNavigateSection('products'); setProductsDropdown(false); }}>Organic Wave</button>
                <button onClick={() => { onNavigateSection('products'); setProductsDropdown(false); }}>Custom Tech</button>
              </div>
            )}
          </div>

          <button className="nav-link" onClick={() => onNavigateSection('quality')}>
            QUALITY
          </button>

          <button className="nav-link" onClick={() => onNavigateSection('footer')}>
            ABOUT
          </button>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          <button className="action-btn" onClick={onOpenSearch} aria-label="Search">
            <Search size={20} strokeWidth={2} />
          </button>

          <button className="action-btn wishlist-btn" aria-label="Wishlist">
            <Heart size={20} strokeWidth={2} />
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </button>

          <button className="action-btn cart-btn" onClick={onOpenCart} aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={2} />
            {cartCount > 0 && <span className="action-badge pulse">{cartCount}</span>}
          </button>

          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <button className="mobile-link" onClick={() => { onNavigateSection('hero'); setMobileMenuOpen(false); }}>HOME</button>
            <button className="mobile-link" onClick={() => { onNavigateSection('products'); setMobileMenuOpen(false); }}>OUR PRODUCTS</button>
            <button className="mobile-link" onClick={() => { onNavigateSection('quality'); setMobileMenuOpen(false); }}>QUALITY</button>
            <button className="mobile-link" onClick={() => { onNavigateSection('footer'); setMobileMenuOpen(false); }}>ABOUT</button>
          </div>
        </div>
      )}

      <style>{`
        .oddshoe-header {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(127, 200, 232, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
          padding: 14px 32px;
        }

        .header-inner {
          max-width: 1380px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .brand-logo-chip {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 8px rgba(11,30,45,0.2));
        }

        .brand-wordmark {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
        }

        .brand-odd {
          color: var(--oddshoe-white);
        }

        .brand-shoe {
          color: var(--oddshoe-navy-900);
          margin-left: 2px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .nav-link {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.05em;
          color: var(--oddshoe-navy-900);
          opacity: 0.85;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
        }

        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: var(--oddshoe-white);
        }

        .dropdown-trigger .chevron {
          transition: transform 0.2s ease;
        }

        .dropdown-trigger .chevron.open {
          transform: rotate(180deg);
        }

        .nav-dropdown-wrapper {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          box-shadow: var(--shadow-lg);
          padding: 10px 0;
          width: 180px;
          display: flex;
          flex-direction: column;
          z-index: 120;
        }

        .dropdown-menu button {
          padding: 10px 18px;
          text-align: left;
          font-weight: 600;
          font-size: 0.84rem;
          color: var(--oddshoe-navy-900);
          transition: background 0.2s ease;
        }

        .dropdown-menu button:hover {
          background: var(--oddshoe-sky-100);
          color: var(--oddshoe-navy-900);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .action-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          position: relative;
          transition: all 0.25 ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.7);
          transform: translateY(-1px);
        }

        .action-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          font-weight: 800;
          font-size: 0.72rem;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--oddshoe-white);
        }

        .mobile-toggle-btn {
          display: none;
          color: var(--oddshoe-navy-900);
          padding: 6px;
        }

        @media (max-width: 880px) {
          .desktop-nav {
            display: none;
          }

          .mobile-toggle-btn {
            display: flex;
          }
        }

        .mobile-menu-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: rgba(11, 30, 45, 0.95);
          backdrop-filter: blur(20px);
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mobile-link {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--oddshoe-white);
          text-align: left;
        }
      `}</style>
    </header>
  );
};
