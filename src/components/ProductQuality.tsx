import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import { ShoeSVG } from './ShoeSVG';

interface ProductQualityProps {
  onStartCustomizing: () => void;
}

export const ProductQuality: React.FC<ProductQualityProps> = ({ onStartCustomizing }) => {
  const [widgetColors, setWidgetColors] = useState({
    upper: '#FF007F',
    toeBox: '#00F0FF',
    heel: '#E0FF00',
    sidePanels: '#0B1E2D',
    tongue: '#FF007F',
    midsole: '#00F0FF',
    outsole: '#FF007F',
    airBubble: '#E0FF00',
    laceLoops: '#E0FF00',
    heelPull: '#E0FF00',
    stitching: '#FF007F',
  });

  const [widgetAngle, setWidgetAngle] = useState<'side' | 'top' | 'back'>('side');

  // Loop colors and angles to demonstrate customizability
  useEffect(() => {
    const colorways = [
      { upper: '#FF007F', toeBox: '#00F0FF', heel: '#E0FF00', sidePanels: '#0B1E2D', tongue: '#FF007F', midsole: '#00F0FF', outsole: '#FF007F', airBubble: '#E0FF00', laceLoops: '#E0FF00', heelPull: '#E0FF00', stitching: '#FF007F' },
      { upper: '#FFFFFF', toeBox: '#FFFFFF', heel: '#EAF6FC', sidePanels: '#BFE3F5', tongue: '#FFFFFF', midsole: '#EAF6FC', outsole: '#62B8DF', airBubble: '#BFE3F5', laceLoops: '#62B8DF', heelPull: '#4A9FCB', stitching: '#4A9FCB' },
      { upper: '#D50000', toeBox: '#111111', heel: '#D50000', sidePanels: '#111111', tongue: '#D50000', midsole: '#111111', outsole: '#D50000', airBubble: '#FFD700', laceLoops: '#FFFFFF', heelPull: '#FFFFFF', stitching: '#FFD700' },
      { upper: '#FAF0CA', toeBox: '#2A9D8F', heel: '#264653', sidePanels: '#F4A261', tongue: '#E76F51', midsole: '#F4A261', outsole: '#264653', airBubble: '#2A9D8F', laceLoops: '#E9C46A', heelPull: '#2A9D8F', stitching: '#E9C46A' }
    ];
    const angles: ('side' | 'top' | 'back')[] = ['side', 'top', 'back'];
    let idx = 0;
    
    const timer = setInterval(() => {
      idx = (idx + 1) % colorways.length;
      setWidgetColors(colorways[idx]);
      setWidgetAngle(angles[idx % angles.length]);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

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

        {/* Right Stage: Interactive Customizer Teaser Widget */}
        <div className="quality-right-stage customizer-teaser-widget" onClick={onStartCustomizing}>
          <div className="quality-circle-backdrop" />
          
          <div className="teaser-shoe-box animate-float">
            <ShoeSVG 
              baseModel="Runner"
              colors={widgetColors}
              laces={{ type: 'flat', thickness: 'medium', length: 'standard', material: 'cotton', color: '#FFF' }}
              soleType="air"
              material="mesh"
              logo={{ type: 'text', value: 'ODD', position: { x: 220, y: 180 }, scale: 0.9 }}
              accessories={{
                laceTags: true,
                goldEyelets: false,
                reflectiveStrips: false,
                glowOutsole: false,
                carbonHeel: false,
                tongueLabel: '',
                insoleText: ''
              }}
              angle={widgetAngle}
              zoom={0.9}
              rotationY={0}
            />
          </div>

          {/* Floating Spec Chip */}
          <div className="spec-chip">
            <Sparkles size={16} color="#F5A63B" />
            <span>Customize 1-of-1 Live</span>
          </div>

          {/* Premium Glass Card CTA Widget overlay */}
          <div className="widget-overlay-card">
            <div className="widget-header">
              <span className="live-pill">LIVE 3D</span>
              <h4>ODDSHOE CUSTOM LAB</h4>
            </div>
            <p className="widget-body-text">Create your bespoke sneaker. Mix & match colors, details, and materials.</p>
            <button className="design-now-btn">
              <span>Enter Design Studio</span>
              <ArrowUpRight size={18} />
            </button>
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

        /* Right Stage: Widget Styles */
        .customizer-teaser-widget {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 460px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid var(--glass-border-standard);
          border-radius: 28px;
          padding: 24px;
          cursor: pointer;
          transition: all var(--transition-spring);
          overflow: hidden;
          box-shadow: var(--glass-shadow);
        }

        .customizer-teaser-widget:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.38);
          box-shadow: 0 20px 40px rgba(11, 30, 45, 0.15);
          border-color: #FFF;
        }

        .teaser-shoe-box {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 440px;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quality-circle-backdrop {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(127, 200, 232, 0.6) 0%, rgba(74, 159, 203, 0.2) 100%);
          z-index: 1;
        }

        .spec-chip {
          position: absolute;
          top: 24px;
          right: 24px;
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

        /* Overlay Glass Card */
        .widget-overlay-card {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          z-index: 5;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 18px;
          padding: 16px 20px;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-fast);
        }

        .customizer-teaser-widget:hover .widget-overlay-card {
          background: rgba(255, 255, 255, 0.88);
          transform: scale(1.02);
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .live-pill {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        .widget-header h4 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
          letter-spacing: -0.01em;
        }

        .widget-body-text {
          font-size: 0.76rem;
          line-height: 1.45;
          color: rgba(11, 30, 45, 0.85);
          font-weight: 500;
          margin-bottom: 12px;
        }

        .design-now-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: var(--oddshoe-navy-900);
          color: #FFF;
          font-weight: 800;
          font-size: 0.8rem;
          border-radius: 10px;
          transition: all var(--transition-fast);
        }

        .customizer-teaser-widget:hover .design-now-btn {
          background: var(--oddshoe-amber);
          color: var(--oddshoe-navy-900);
        }

        @media (max-width: 480px) {
          .customizer-teaser-widget {
            min-height: 400px;
          }
          .widget-overlay-card {
            bottom: 12px;
            left: 12px;
            right: 12px;
            padding: 12px;
          }
          .widget-body-text {
            font-size: 0.72rem;
            margin-bottom: 8px;
          }
          .design-now-btn {
            padding: 8px;
          }
        }
      `}</style>
    </section>
  );
};
