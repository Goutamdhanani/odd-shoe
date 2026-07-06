import React from 'react';
import { Package, RotateCcw, Headphones } from 'lucide-react';
import { TRUST_ITEMS } from '../data/products';

interface TrustStripProps {
  variant?: 'top' | 'bottom';
}

export const TrustStrip: React.FC<TrustStripProps> = ({ variant = 'top' }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package size={26} strokeWidth={1.5} />;
      case 'RotateCcw':
        return <RotateCcw size={26} strokeWidth={1.5} />;
      case 'Headphones':
        return <Headphones size={26} strokeWidth={1.5} />;
      default:
        return <Package size={26} strokeWidth={1.5} />;
    }
  };

  return (
    <div className={`trust-strip-container ${variant}`}>
      <div className="trust-strip-content">
        {TRUST_ITEMS.map((item) => (
          <div key={item.id} className="trust-badge-card">
            <div className="trust-icon-box">
              {getIcon(item.iconName)}
            </div>
            <div className="trust-text-box">
              <h4 className="trust-title">{item.title}</h4>
              <p className="trust-subtitle">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .trust-strip-container {
          width: 100%;
          padding: 16px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .trust-strip-container.top {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        }

        .trust-strip-container.bottom {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          margin-top: 60px;
          padding: 32px 24px;
        }

        .trust-strip-content {
          max-width: 1280px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .trust-strip-content {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .trust-badge-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }

        .trust-badge-card:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .trust-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--oddshoe-navy-900);
          background: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .trust-text-box {
          display: flex;
          flex-direction: column;
        }

        .trust-title {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
        }

        .trust-subtitle {
          font-size: 0.78rem;
          color: rgba(11, 30, 45, 0.7);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
