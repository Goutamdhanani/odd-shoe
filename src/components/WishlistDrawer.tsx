import React from 'react';
import { X, Trash2, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveItem: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveItem,
  onAddToCart
}) => {
  const wishlistItems = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className={`wishlist-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="wishlist-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <Heart size={22} fill="#FF6B4A" color="#FF6B4A" />
            <h3 className="drawer-title">Favorites ({wishlistItems.length})</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Favorites">
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="drawer-items-list">
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist-state">
              <div className="empty-icon-box">
                <Heart size={48} strokeWidth={1} />
              </div>
              <h4 className="empty-title">Your wishlist is empty</h4>
              <p className="empty-sub">Tap the heart on any product drop to save it here.</p>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div key={product.id} className="wishlist-item-card">
                <div className="item-img-stage">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="item-details">
                  <h4 className="item-name">{product.name}</h4>
                  <span className="item-price">{product.formattedPrice}</span>

                  <div className="wishlist-controls-row">
                    <button 
                      className="add-to-bag-btn"
                      onClick={() => {
                        onAddToCart(product);
                        onClose(); // Optional: close wishlist when adding to bag so they see the bag
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>

                    <button 
                      className="trash-btn" 
                      onClick={() => onRemoveItem(product)}
                      aria-label="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .wishlist-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 30, 45, 0);
          backdrop-filter: blur(0px);
          z-index: 250;
          display: flex;
          justify-content: flex-end;
          pointer-events: none;
          transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wishlist-overlay.open {
          background: rgba(11, 30, 45, 0.55);
          backdrop-filter: blur(10px);
          pointer-events: auto;
        }

        .wishlist-drawer-panel {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: -20px 0 50px rgba(11, 30, 45, 0.25);
          display: flex;
          flex-direction: column;
          padding: 24px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wishlist-overlay.open .wishlist-drawer-panel {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(11, 30, 45, 0.1);
        }

        .drawer-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drawer-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--oddshoe-navy-900);
        }

        .drawer-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(11, 30, 45, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          transition: background var(--transition-fast);
        }

        .drawer-close-btn:hover {
          background: rgba(11, 30, 45, 0.12);
        }

        .drawer-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Custom Scrollbar for Drawer */
        .drawer-items-list::-webkit-scrollbar {
          width: 6px;
        }
        .drawer-items-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .drawer-items-list::-webkit-scrollbar-thumb {
          background: rgba(11, 30, 45, 0.15);
          border-radius: 10px;
        }

        .empty-wishlist-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          text-align: center;
          height: 100%;
        }

        .empty-icon-box {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(11, 30, 45, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(11, 30, 45, 0.25);
          margin-bottom: 24px;
        }

        .empty-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--oddshoe-navy-900);
          margin-bottom: 8px;
        }

        .empty-sub {
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          opacity: 0.7;
          line-height: 1.5;
          max-width: 260px;
        }

        .wishlist-item-card {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(11, 30, 45, 0.08);
          border-radius: 16px;
          transition: transform var(--transition-normal);
        }

        .wishlist-item-card:hover {
          transform: translateY(-2px);
        }

        .item-img-stage {
          width: 85px;
          height: 85px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--oddshoe-sky-100), var(--oddshoe-sky-300));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-img-stage img {
          width: 95%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 8px 12px rgba(11, 30, 45, 0.15));
        }

        .item-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }

        .item-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1rem;
          color: var(--oddshoe-navy-900);
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .item-price {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
        }

        .wishlist-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .add-to-bag-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }

        .add-to-bag-btn:hover {
          background: #173852;
          transform: translateY(-1px);
        }

        .add-to-bag-btn:active {
          transform: translateY(0);
        }

        .trash-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(11, 30, 45, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .trash-btn:hover {
          background: rgba(220, 38, 38, 0.1);
          color: rgb(220, 38, 38);
        }
      `}</style>
    </div>
  );
};
