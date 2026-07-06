import React from 'react';
import { ShieldCheck, Zap, Award } from 'lucide-react';

export const ProductQuality: React.FC = () => {
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
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .quality-left {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-title-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .title-underline {
          width: 80px;
          height: 4px;
          background: var(--oddshoe-navy-900);
          margin: 12px auto 0;
          border-radius: 2px;
        }

        .quality-feature-list {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .quality-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 18px;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border-standard);
          transition: all var(--transition-normal);
          box-shadow: var(--glass-shadow);
        }

        .quality-feature-card:hover {
          background: var(--glass-bg-hover);
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
      `}</style>
    </section>
  );
};

export default ProductQuality;
