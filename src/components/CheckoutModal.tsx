import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.m@example.com',
    address: '42 Cyber Wave Way, Suite 101',
    city: 'Mumbai',
    postalCode: '400001',
    paymentMethod: 'card'
  });

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const formattedTotal = `Rs. ${totalAmount.toLocaleString('en-IN')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti trigger');
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="checkout-card" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {step === 'details' ? (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-header">
              <Sparkles size={20} color="#F5A63B" />
              <h3 className="checkout-title">Express Drop Checkout</h3>
            </div>

            <div className="checkout-grid">
              {/* Shipping Details */}
              <div className="form-column">
                <h4 className="form-section-title">Shipping Destination</h4>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div className="summary-column">
                <h4 className="form-section-title">Order Summary</h4>

                <div className="checkout-items-preview">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="preview-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="preview-info">
                        <span className="preview-name">{item.product.name} (US {item.selectedSize})</span>
                        <span className="preview-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="preview-price">{item.product.formattedPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="payment-method-selector">
                  <h4 className="form-section-title">Payment Mode</h4>
                  <div className="payment-options">
                    <label className={`pay-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      />
                      <CreditCard size={18} />
                      <span>Credit / Debit Card</span>
                    </label>
                    <label className={`pay-option ${formData.paymentMethod === 'upi' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      />
                      <Truck size={18} />
                      <span>UPI / Instant Transfer</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-total-box">
                  <div className="total-line">
                    <span>Total Amount</span>
                    <span className="total-amount">{formattedTotal}</span>
                  </div>

                  <button type="submit" className="pay-now-btn">
                    Confirm Order & Pay {formattedTotal}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="success-screen">
            <div className="success-icon-stage">
              <CheckCircle2 size={72} color="#2A9D8F" />
            </div>
            <h3 className="success-title">Order Drop Confirmed!</h3>
            <p className="success-msg">
              Thank you, <strong>{formData.fullName}</strong>. Your ODDSHOE pair is being prepped for express shipment.
            </p>
            <div className="order-number-chip">
              Order ID: #ODD-2026-{(Math.floor(Math.random() * 900000) + 100000)}
            </div>

            <button className="finish-btn" onClick={handleFinish}>
              Back to Store
            </button>
          </div>
        )}
      </div>

      <style>{`
        .checkout-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 30, 45, 0.65);
          backdrop-filter: blur(14px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .checkout-card {
          width: 100%;
          max-width: 860px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          position: relative;
          box-shadow: 0 30px 60px rgba(11, 30, 45, 0.3);
          max-height: 90vh;
          overflow-y: auto;
        }

        .checkout-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(11, 30, 45, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkout-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .checkout-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--oddshoe-navy-900);
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-section-title {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.92rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--oddshoe-navy-900);
          margin-bottom: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 14px;
        }

        .form-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: rgba(11, 30, 45, 0.8);
          margin-bottom: 4px;
        }

        .form-group input {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(11, 30, 45, 0.2);
          background: rgba(255, 255, 255, 0.8);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--oddshoe-navy-900);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .checkout-items-preview {
          background: var(--oddshoe-sky-100);
          border-radius: 14px;
          padding: 12px;
          max-height: 160px;
          overflow-y: auto;
          margin-bottom: 18px;
        }

        .preview-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .preview-item img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .preview-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .preview-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
        }

        .preview-qty {
          font-size: 0.72rem;
          color: rgba(11, 30, 45, 0.6);
        }

        .preview-price {
          font-size: 0.8rem;
          font-weight: 800;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .pay-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(11, 30, 45, 0.15);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .pay-option.active {
          border-color: var(--oddshoe-navy-900);
          background: rgba(11, 30, 45, 0.05);
        }

        .checkout-total-box {
          margin-top: 16px;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          font-weight: 800;
          font-size: 1.1rem;
          margin-bottom: 14px;
        }

        .pay-now-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.25s ease;
          box-shadow: 0 8px 20px rgba(245, 166, 59, 0.35);
        }

        .pay-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(245, 166, 59, 0.5);
        }

        .success-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon-stage {
          margin-bottom: 20px;
        }

        .success-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 2rem;
          color: var(--oddshoe-navy-900);
        }

        .success-msg {
          font-size: 1rem;
          color: rgba(11, 30, 45, 0.8);
          margin-top: 8px;
          max-width: 420px;
        }

        .order-number-chip {
          margin-top: 20px;
          background: var(--oddshoe-sky-100);
          padding: 8px 18px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          border: 1px solid var(--oddshoe-sky-300);
        }

        .finish-btn {
          margin-top: 32px;
          padding: 14px 36px;
          border-radius: 12px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          font-weight: 800;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};
