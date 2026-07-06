import React from 'react';
import { ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductQualityProps {
  onAddToCart?: (product: Product) => void;
}

export const ProductQuality: React.FC<ProductQualityProps> = () => {
  const qualityFeatures = [
    {
      icon: <Award size={24} />,
      title: 'Best Quality Shoes',
      desc: 'Precision 3D lattice upper materials fused with high-buoyancy organic liquid cloud pods.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Long Lasting',
      desc: 'Tested for over 500,000 extreme impact flex cycles with anti-abrasion tread compound.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Best Value',
      desc: 'Direct-from-studio sneaker drops with lifetime material replacement guarantee.'
    }
  ];

  return (
    <section id="quality" className="oddshoe-quality-section">
      <div className="quality-inner">
        {/* Left Content Side */}
        <div className="quality-left">
          <div className="header-title-box">
            <h2 className="section-title">Our Product Quality</h2>
            <div className="title-underline" />
          </div>

          <div className="quality-feature-list">
            {qualityFeatures.map((feat, idx) => (
              <div key={idx} className="quality-feature-card">
                <div className="feat-icon-box">
                  {feat.icon}
                </div>
                <div className="feat-text">
                  <h3 className="feat-title">{feat.title}</h3>
                  <p className="feat-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Featured Render Stage */}
        <div className="quality-right-stage">
          <div className="quality-circle-backdrop" />
          <img 
            src="/shoes/quality_green.png" 
            alt="Emerald Quality Sneaker Drop" 
            className="quality-shoe-img animate-float"
          />
          <div className="quality-shoe-shadow" />

          {/* Floating Spec Chip */}
          <div className="spec-chip">
            <Sparkles size={16} color="#F5A63B" />
            <span>Organic Liquid Sole v3.4</span>
          </div>
        </div>
      </div>

      <style>{`
        .oddshoe-quality-section {
          max-width: 1380px;
          margin: 80px auto 40px;
          padding: 0 32px;
          position: relative;
          z-index: 10;
        }

        .quality-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 900px) {
          .quality-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .quality-feature-list {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .quality-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 20px 24px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .quality-feature-card:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: translateX(6px);
        }

        .feat-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 16px rgba(11, 30, 45, 0.15);
        }

        .feat-text {
          display: flex;
          flex-direction: column;
        }

        .feat-title {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--oddshoe-navy-900);
          margin-bottom: 4px;
        }

        .feat-desc {
          font-size: 0.85rem;
          line-height: 1.5;
          color: rgba(11, 30, 45, 0.8);
          font-weight: 500;
        }

        /* Right Stage with Circular Cutout */
        .quality-right-stage {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 420px;
        }

        .quality-circle-backdrop {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, #4A9FCB 0%, #2F88B6 100%);
          box-shadow: 0 20px 50px rgba(74, 159, 203, 0.4);
          z-index: 1;
        }

        .quality-shoe-img {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 480px;
          height: auto;
          filter: drop-shadow(0 30px 40px rgba(11, 30, 45, 0.35));
        }

        .quality-shoe-shadow {
          position: relative;
          z-index: 2;
          width: 70%;
          height: 24px;
          background: radial-gradient(ellipse at center, rgba(11, 30, 45, 0.4) 0%, rgba(11, 30, 45, 0) 70%);
          border-radius: 50%;
          margin-top: -15px;
        }

        .spec-chip {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 4;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--oddshoe-white);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--oddshoe-navy-900);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </section>
  );
};
