import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, Heart, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type?: 'cart' | 'wishlist';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'cart',
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="oddshoe-toast">
      <div className="toast-icon">
        {type === 'cart' ? <ShoppingBag size={20} color="#F5A63B" /> : <Heart size={20} color="#F5A63B" fill="#F5A63B" />}
      </div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>

      <style>{`
        .oddshoe-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 400;
          background: rgba(11, 30, 45, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--oddshoe-white);
          box-shadow: 0 16px 36px rgba(11, 30, 45, 0.3);
          animation: slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUpToast {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-message {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .toast-close {
          color: rgba(255, 255, 255, 0.6);
          margin-left: 8px;
        }

        .toast-close:hover {
          color: var(--oddshoe-white);
        }
      `}</style>
    </div>
  );
};
