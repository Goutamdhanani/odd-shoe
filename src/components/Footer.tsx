import React from 'react';
import { TrustStrip } from './TrustStrip';
import { Send, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="oddshoe-footer">
      {/* Repeated Trust Strip at Bottom */}
      <TrustStrip variant="bottom" />

      {/* Main Footer Content */}
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="brand-lockup">
            <span className="brand-wordmark">
              <span className="brand-odd">ODD</span>
              <span className="brand-shoe">SHOE</span>
            </span>
          </div>
          <p className="footer-bio">
            High-production sneaker drops featuring organic liquid soles, 3D sculpt geometry, and extreme cloud comfort. Walk like a boss.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="links-col">
            <h4 className="links-title">Drops</h4>
            <a href="#products">Air Series</a>
            <a href="#products">Drop 01</a>
            <a href="#products">Organic Wave</a>
            <a href="#products">Custom Tech</a>
          </div>

          <div className="links-col">
            <h4 className="links-title">Support</h4>
            <a href="#quality">Product Quality</a>
            <a href="#quality">Size Guide</a>
            <a href="#">Track Order</a>
            <a href="#">Return Policy</a>
          </div>
        </div>

        <div className="footer-newsletter-col">
          <h4 className="links-title">Drop Access</h4>
          <p className="newsletter-sub">Subscribe to get notified 15 minutes before new 3D sneaker drops go live.</p>
          
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to ODDSHOE Drop Alerts!'); }}>
            <input type="email" placeholder="Enter your email address..." required />
            <button type="submit" aria-label="Subscribe">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom-bar">
        <span>© 2026 ODDSHOE Inc. All Rights Reserved.</span>
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Back to Top">
          <span>Back to top</span>
          <ArrowUp size={16} />
        </button>
      </div>

      <style>{`
        .oddshoe-footer {
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .footer-inner {
          max-width: 1380px;
          margin: 40px auto 0;
          padding: 40px 32px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr;
          gap: 50px;
        }

        @media (max-width: 900px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .footer-bio {
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(11, 30, 45, 0.85);
          max-width: 360px;
          font-weight: 500;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .links-title {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .links-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .links-col a {
          font-size: 0.86rem;
          color: rgba(11, 30, 45, 0.8);
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .links-col a:hover {
          color: var(--oddshoe-white);
        }

        .newsletter-sub {
          font-size: 0.85rem;
          color: rgba(11, 30, 45, 0.8);
          margin-bottom: 14px;
          line-height: 1.4;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          padding: 4px;
        }

        .newsletter-form input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          color: var(--oddshoe-navy-900);
          font-weight: 600;
        }

        .newsletter-form button {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-bottom-bar {
          max-width: 1380px;
          margin: 0 auto;
          padding: 24px 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(11, 30, 45, 0.7);
        }

        .scroll-top-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--oddshoe-navy-900);
        }
      `}</style>
    </footer>
  );
};
