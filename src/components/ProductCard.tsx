import React, { useState } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="oddshoe-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="card-badge-container">
        {product.isFeatured && <span className="card-tag featured">FEATURED</span>}
        {product.isTrending && <span className="card-tag trending">HOT DROP</span>}
      </div>

      {/* Wishlist Button */}
      <button 
        className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(product);
        }}
        aria-label="Add to Wishlist"
      >
        <Heart size={18} fill={isWishlisted ? '#F5A63B' : 'none'} stroke={isWishlisted ? '#F5A63B' : '#0B1E2D'} />
      </button>

      {/* Product Image Stage */}
      <div className="card-image-stage" onClick={() => onSelect(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={`card-shoe-img ${isHovered ? 'scale-up' : ''}`} 
          loading="lazy"
        />
        <div className="card-shoe-shadow" />
        
        {/* Quick View Hover Overlay */}
        {isHovered && (
          <button className="quick-view-chip" onClick={() => onSelect(product)}>
            <Eye size={14} /> Quick View
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="card-body">
        <span className="card-category-label">{product.category}</span>
        <h3 className="card-product-title" onClick={() => onSelect(product)}>
          {product.name}
        </h3>
        <p className="card-product-sub">{product.subtitle}</p>

        <div className="card-footer-row">
          <div className="price-tag">
            <span className="price-val">{product.formattedPrice}</span>
          </div>

          <button 
            className="add-to-bag-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            aria-label="Add to Bag"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .oddshoe-product-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border-standard);
          border-radius: 20px;
          padding: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
          box-shadow: var(--glass-shadow);
        }

        .oddshoe-product-card:hover {
          background: var(--glass-bg-hover);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(11, 30, 45, 0.12);
        }

        .card-badge-container {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          display: flex;
          gap: 6px;
        }

        .card-tag {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .card-tag.featured {
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
        }

        .card-tag.trending {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
        }

        .card-wishlist-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 5;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .card-wishlist-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        .card-image-stage {
          width: 100%;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          margin-top: 10px;
        }

        .card-shoe-img {
          max-width: 90%;
          max-height: 160px;
          object-fit: contain;
          filter: drop-shadow(0 12px 20px rgba(11, 30, 45, 0.18));
          transition: transform var(--transition-normal);
        }

        .card-shoe-img.scale-up {
          transform: scale(1.1) translateY(-6px) rotate(-2deg);
        }

        .card-shoe-shadow {
          width: 60%;
          height: 16px;
          background: radial-gradient(ellipse at center, rgba(11, 30, 45, 0.25) 0%, rgba(11, 30, 45, 0) 70%);
          border-radius: 50%;
          margin-top: -10px;
        }

        .quick-view-chip {
          position: absolute;
          bottom: 10px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeIn 0.2s ease;
        }

        .card-body {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
        }

        .card-category-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--oddshoe-sky-700);
          margin-bottom: 2px;
        }

        .card-product-title {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--oddshoe-navy-900);
          cursor: pointer;
          line-height: 1.2;
        }

        .card-product-sub {
          font-size: 0.8rem;
          color: rgba(11, 30, 45, 0.7);
          margin-top: 2px;
          margin-bottom: 14px;
        }

        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.4);
        }

        .price-val {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1rem;
          color: var(--oddshoe-navy-900);
        }

        .add-to-bag-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          position: relative;
          transition: all var(--transition-fast);
        }

        .add-to-bag-btn:hover {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          border-color: var(--oddshoe-amber);
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(245, 166, 59, 0.4);
        }

        @media (max-width: 640px) {
          .oddshoe-product-card {
            padding: 16px; /* Expanded padding using 8px system */
            border-radius: 14px;
          }
          .card-image-stage {
            height: 120px;
            margin-top: 8px; /* 8px system spacing */
          }
          .card-shoe-img {
            max-height: 90px;
          }
          .card-product-title {
            font-size: 0.85rem;
          }
          .card-product-sub {
            font-size: 0.7rem;
            margin-bottom: 8px; /* 8px system spacing */
          }
          .price-val {
            font-size: 0.85rem;
          }
          .add-to-bag-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }
          .card-wishlist-btn {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            top: 8px;
            right: 8px;
          }
          /* Invisible touch zone expansions to meet the 44px accessibility standard */
          .card-wishlist-btn::after, .add-to-bag-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 44px;
            height: 44px;
          }
          .card-wishlist-btn svg {
            width: 14px;
            height: 14px;
          }
          .card-tag {
            font-size: 0.58rem;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .card-badge-container {
            top: 8px;
            left: 8px;
          }
        }
      `}</style>
    </div>
  );
};
