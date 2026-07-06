import React, { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = query.trim() === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-box">
          <Search size={22} color="#0B1E2D" />
          <input
            type="text"
            placeholder="Search ODDSHOE drops, categories (e.g. Green m123, Air Series)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="search-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {query.trim() !== '' && (
          <div className="search-results-list">
            {filtered.length === 0 ? (
              <div className="no-results">No drops found matching "{query}"</div>
            ) : (
              filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="search-result-item"
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="result-info">
                    <span className="result-title">{item.name}</span>
                    <span className="result-sub">{item.subtitle}</span>
                  </div>
                  <span className="result-price">{item.formattedPrice}</span>
                  <ArrowUpRight size={16} color="#0B1E2D" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        .search-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 30, 45, 0.65);
          backdrop-filter: blur(14px);
          z-index: 350;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
        }

        .search-modal-card {
          width: 100%;
          max-width: 680px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 30px 60px rgba(11, 30, 45, 0.3);
        }

        .search-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px;
          border-radius: 14px;
          background: var(--oddshoe-sky-100);
          border: 1px solid var(--oddshoe-sky-300);
        }

        .search-input-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: var(--oddshoe-navy-900);
          outline: none;
        }

        .search-results-list {
          margin-top: 14px;
          max-height: 340px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .no-results {
          padding: 20px;
          text-align: center;
          color: rgba(11, 30, 45, 0.6);
          font-weight: 600;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .search-result-item:hover {
          background: var(--oddshoe-sky-100);
        }

        .search-result-item img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .result-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .result-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--oddshoe-navy-900);
        }

        .result-sub {
          font-size: 0.78rem;
          color: rgba(11, 30, 45, 0.7);
        }

        .result-price {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--oddshoe-navy-900);
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};
