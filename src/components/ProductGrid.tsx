import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Filter } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Drop 01', 'Air Series', 'Organic Wave', 'Custom Tech'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="products" className="oddshoe-products-section">
      <div className="section-header">
        <div className="header-title-box">
          <h2 className="section-title">Our Product's</h2>
          <div className="title-underline" />
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistIds.includes(product.id)}
          />
        ))}
      </div>

      <style>{`
        .oddshoe-products-section {
          max-width: 1380px;
          margin: 60px auto 40px;
          padding: 0 32px;
          position: relative;
          z-index: 10;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title-box {
          position: relative;
        }

        .title-underline {
          width: 60px;
          height: 4px;
          background: var(--oddshoe-amber);
          border-radius: 2px;
          margin-top: 6px;
        }

        .category-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pill-btn {
          padding: 8px 18px;
          border-radius: 20px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border-standard);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          font-weight: 700;
          font-size: 0.84rem;
          color: var(--oddshoe-navy-900);
          transition: all var(--transition-fast);
        }

        .pill-btn:hover {
          background: var(--glass-bg-hover);
        }

        .pill-btn:active {
          transform: scale(0.95);
        }

        .pill-btn.active {
          background: var(--oddshoe-navy-900);
          color: var(--oddshoe-white);
          border-color: var(--oddshoe-navy-900);
          box-shadow: 0 4px 12px rgba(11, 30, 45, 0.15);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        @media (max-width: 640px) {
          .category-pills {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            width: 100%;
            padding: 4px 4px 8px;
            gap: 8px;
          }
          .category-pills::-webkit-scrollbar {
            display: none;
          }
          .pill-btn {
            flex-shrink: 0;
            font-size: 0.8rem;
            padding: 8px 16px;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px; /* Align to 8px system */
          }
          .oddshoe-products-section {
            padding: 0 16px;
            margin: 40px auto 24px; /* Align to 8px system */
          }
        }
      `}</style>
    </section>
  );
};
