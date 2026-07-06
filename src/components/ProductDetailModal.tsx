import React, { useState } from 'react';
import { X, ShoppingBag, Star, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: number, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[2] || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
  };

  return (
    <div className="oddshoe-modal-backdrop" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        <div className="modal-grid">
          {/* Left Column: Shoe Render Stage */}
          <div className="modal-shoe-stage">
            <span className="stage-bg-badge">{product.category}</span>
            <img src={product.image} alt={product.name} className="modal-shoe-img" />
            <div className="modal-shoe-shadow" />
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="modal-info-col">
            <div className="modal-rating-row">
              <div className="star-rating">
                <Star size={16} fill="#F5A63B" stroke="none" />
                <span className="rating-val">{product.rating}</span>
              </div>
              <span className="rating-count">(142 verified drops)</span>
            </div>

            <h2 className="modal-product-title">{product.name}</h2>
            <p className="modal-product-sub">{product.subtitle}</p>

            <div className="modal-price-row">
              <span className="modal-price">{product.formattedPrice}</span>
              <span className="modal-tax-tag">Includes all taxes & duties</span>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Size Selector */}
            <div className="option-section">
              <div className="option-label-row">
                <span className="option-title">Select US Size</span>
                <span className="size-guide-link">Size Guide</span>
              </div>
              <div className="size-grid">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="option-section quantity-section">
              <span className="option-title">Quantity</span>
              <div className="quantity-ctrl">
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <div className="modal-action-row">
              <button className="modal-add-btn" onClick={handleAdd}>
                <ShoppingBag size={20} />
                <span>Add To Bag — {product.formattedPrice}</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="modal-guarantees">
              <div className="guarantee-item">
                <Truck size={16} /> <span>Express Delivery in 48 Hours</span>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} /> <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .oddshoe-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 30, 45, 0.65);
          backdrop-filter: blur(14px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease;
        }

        .modal-content-card {
          width: 100%;
          max-width: 940px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(11, 30, 45, 0.25);
          padding: 36px;
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(11, 30, 45, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .modal-content-card {
            padding: 24px;
            max-height: 90vh;
            overflow-y: auto;
          }
        }

        .modal-shoe-stage {
          background: radial-gradient(circle, #EAF6FC 0%, #BFE3F5 100%);
          border-radius: 20px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .stage-bg-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.6);
          padding: 4px 10px;
          border-radius: 10px;
          color: var(--oddshoe-navy-900);
        }

        .modal-shoe-img {
          width: 100%;
          max-width: 320px;
          height: auto;
          filter: drop-shadow(0 20px 30px rgba(11, 30, 45, 0.25));
        }

        .modal-shoe-shadow {
          width: 70%;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(11, 30, 45, 0.3) 0%, rgba(11, 30, 45, 0) 70%);
          border-radius: 50%;
          margin-top: -10px;
        }

        .modal-info-col {
          display: flex;
          flex-direction: column;
        }

        .modal-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .star-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
        }

        .rating-count {
          font-size: 0.78rem;
          color: rgba(11, 30, 45, 0.6);
        }

        .modal-product-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--oddshoe-navy-900);
          line-height: 1.1;
        }

        .modal-product-sub {
          font-size: 0.9rem;
          color: var(--oddshoe-sky-700);
          font-weight: 700;
          margin-top: 4px;
        }

        .modal-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin: 14px 0;
        }

        .modal-price {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--oddshoe-navy-900);
        }

        .modal-tax-tag {
          font-size: 0.75rem;
          color: rgba(11, 30, 45, 0.6);
        }

        .modal-description {
          font-size: 0.88rem;
          line-height: 1.5;
          color: rgba(11, 30, 45, 0.8);
          margin-bottom: 20px;
        }

        .option-section {
          margin-bottom: 18px;
        }

        .option-label-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .option-title {
          font-weight: 800;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--oddshoe-navy-900);
        }

        .size-guide-link {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--oddshoe-sky-700);
          cursor: pointer;
          text-decoration: underline;
        }

        .size-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .size-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(11, 30, 45, 0.05);
          border: 1px solid rgba(11, 30, 45, 0.15);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          transition: all 0.2s ease;
        }

        .size-btn.active {
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          border-color: var(--oddshoe-navy-900);
        }

        .quantity-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .quantity-ctrl {
          display: flex;
          align-items: center;
          background: rgba(11, 30, 45, 0.06);
          border-radius: 10px;
          padding: 4px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--oddshoe-white);
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
        }

        .qty-val {
          width: 36px;
          text-align: center;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
        }

        .modal-action-row {
          margin-top: 24px;
        }

        .modal-add-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 10px 20px rgba(11, 30, 45, 0.2);
        }

        .modal-add-btn:hover {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(245, 166, 59, 0.4);
        }

        .modal-guarantees {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(11, 30, 45, 0.1);
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(11, 30, 45, 0.7);
        }
      `}</style>
    </div>
  );
};
