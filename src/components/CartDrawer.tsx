import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: number, newQty: number) => void;
  onRemoveItem: (productId: string, size: number) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const formattedTotal = `Rs. ${totalAmount.toLocaleString('en-IN')}`;

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <ShoppingBag size={22} color="#0B1E2D" />
            <h3 className="drawer-title">Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-meter-box">
          <div className="meter-text">
            <span>🎉 You qualify for <strong>FREE Express Worldwide Shipping</strong></span>
          </div>
          <div className="meter-bar-track">
            <div className="meter-bar-fill" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-items-list">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-icon-box">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <h4 className="empty-title">Your bag is empty</h4>
              <p className="empty-sub">Explore our 3D sneaker drops and claim your pair.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="cart-item-card">
                <div className="item-img-stage">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <h4 className="item-name">{item.product.name}</h4>
                  <div className="item-meta-row">
                    <span className="meta-badge">US Size: {item.selectedSize}</span>
                  </div>
                  <span className="item-price">{item.product.formattedPrice}</span>

                  <div className="item-controls-row">
                    <div className="qty-stepper">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="trash-btn" 
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
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

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-val">{formattedTotal}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Express Delivery</span>
              <span className="summary-val free">FREE</span>
            </div>

            <button className="checkout-cta-btn" onClick={onOpenCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="secure-badge-row">
              <ShieldCheck size={16} color="#0B1E2D" />
              <span>256-Bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-overlay {
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

        .cart-overlay.open {
          background: rgba(11, 30, 45, 0.55);
          backdrop-filter: blur(10px);
          pointer-events: auto;
        }

        .cart-drawer-panel {
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

        .cart-overlay.open .cart-drawer-panel {
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
        }

        .shipping-meter-box {
          margin: 16px 0;
          background: var(--oddshoe-sky-100);
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--oddshoe-sky-300);
        }

        .meter-text {
          font-size: 0.78rem;
          color: var(--oddshoe-navy-900);
          margin-bottom: 6px;
        }

        .meter-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(11, 30, 45, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .meter-bar-fill {
          height: 100%;
          background: var(--oddshoe-amber);
          border-radius: 3px;
        }

        .drawer-items-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 4px;
        }

        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: rgba(11, 30, 45, 0.6);
        }

        .empty-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--oddshoe-sky-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--oddshoe-navy-900);
        }

        .empty-title {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--oddshoe-navy-900);
        }

        .empty-sub {
          font-size: 0.85rem;
          margin-top: 4px;
        }

        .cart-item-card {
          display: flex;
          gap: 14px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(11, 30, 45, 0.08);
        }

        .item-img-stage {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          background: var(--oddshoe-sky-100);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-img-stage img {
          width: 85%;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(11,30,45,0.15));
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
        }

        .item-meta-row {
          margin-top: 2px;
        }

        .meta-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--oddshoe-sky-700);
        }

        .item-price {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          margin-top: 4px;
        }

        .item-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        .qty-stepper {
          display: flex;
          align-items: center;
          background: rgba(11, 30, 45, 0.06);
          border-radius: 8px;
          padding: 2px 6px;
          gap: 8px;
          font-weight: 800;
          font-size: 0.85rem;
        }

        .trash-btn {
          color: #E63946;
          padding: 4px;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .trash-btn:hover {
          opacity: 1;
        }

        .drawer-footer {
          padding-top: 16px;
          border-top: 1px solid rgba(11, 30, 45, 0.1);
          margin-top: auto;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .summary-label {
          color: rgba(11, 30, 45, 0.7);
          font-weight: 600;
        }

        .summary-val {
          font-weight: 800;
          color: var(--oddshoe-navy-900);
        }

        .summary-val.free {
          color: #2A9D8F;
        }

        .checkout-cta-btn {
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
          margin-top: 12px;
          transition: all 0.25s ease;
        }

        .checkout-cta-btn:hover {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          transform: translateY(-2px);
        }

        .secure-badge-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(11, 30, 45, 0.6);
          margin-top: 10px;
        }

        @media (max-width: 480px) {
          .cart-drawer-panel {
            padding: 16px;
          }
          .empty-icon-box {
            width: 60px;
            height: 60px;
          }
          .checkout-cta-btn {
            padding: 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};
