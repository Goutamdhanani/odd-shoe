import React, { useState } from 'react';
import { Header } from './components/Header';
import { TrustStrip } from './components/TrustStrip';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductQuality } from './components/ProductQuality';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { PRODUCTS_CATALOG } from './data/products';
import { Product, CartItem } from './types';
import { Customizer } from './components/Customizer';

export const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'customizer'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('customizer') === 'true' ? 'customizer' : 'store';
  });
  const [products] = useState<Product[]>(PRODUCTS_CATALOG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-1']);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'cart' | 'wishlist' } | null>(null);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedSize?: number, quantity: number = 1) => {
    const sizeToUse = selectedSize || product.sizes[0] || 9;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === sizeToUse
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, selectedSize: sizeToUse, quantity }];
    });

    setToast({
      message: `Added ${product.name} (US ${sizeToUse}) to your bag!`,
      type: 'cart'
    });
  };

  const handleUpdateQuantity = (productId: string, size: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string, size: number) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  // Wishlist Handler
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        setToast({ message: `Removed ${product.name} from wishlist.`, type: 'wishlist' });
        return prev.filter((id) => id !== product.id);
      } else {
        setToast({ message: `Added ${product.name} to your wishlist!`, type: 'wishlist' });
        return [...prev, product.id];
      }
    });
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="oddshoe-page-wrapper">
      {view === 'customizer' ? (
        <Customizer
          onClose={() => setView('store')}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
          {/* Main Sticky Header */}
          <Header
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNavigateSection={handleNavigateSection}
            wishlistCount={wishlistIds.length}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onStartCustomizing={() => {
              setView('customizer');
              window.scrollTo({ top: 0 });
            }}
          />

          {/* Hero Section with "ODD SHOE" Oversized Display Type & Floating 3D Render */}
          <Hero
            onExploreClick={() => handleNavigateSection('products')}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
          />

          {/* Products Grid Section */}
          <ProductGrid
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />

          {/* Product Quality Section */}
          <ProductQuality
            onStartCustomizing={() => {
              setView('customizer');
              window.scrollTo({ top: 0 });
            }}
          />

          {/* Footer Section */}
          <Footer />
        </>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, size, qty) => {
          handleAddToCart(p, size, qty);
          setSelectedProduct(null);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onRemoveItem={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onSuccess={() => setCart([])}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Notification Toast */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
