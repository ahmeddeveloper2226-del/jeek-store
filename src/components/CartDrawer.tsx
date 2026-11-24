import { asset } from '../lib/asset';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    products,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    placeOrder,
    profile,
    user,
    language,
    t,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.displayName || profile.name);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(profile.address);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder(customerName.trim() || profile.name, phone.trim(), address.trim() || profile.address);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md h-full bg-white dark:bg-zinc-950 border-s border-zinc-200 dark:border-zinc-800 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Drawer Top */}
        <div className="px-6 py-5 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
              {t('cartTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="w-14 h-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display font-bold text-zinc-950 dark:text-white">
                {t('cartEmpty')}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                {t('cartEmptySub')}
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <img
                    src={asset(product.image)}
                    alt={language === 'ar' ? product.nameAr : product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 rounded-lg object-cover bg-white dark:bg-zinc-950 shrink-0 border border-zinc-200/80 dark:border-zinc-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-bold text-zinc-950 dark:text-white truncate">
                        {language === 'ar' ? product.nameAr : product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span
                        className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-700"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>
                        {language === 'ar'
                          ? item.selectedColor.nameAr
                          : item.selectedColor.name}
                      </span>
                      <span>·</span>
                      <span className="font-mono-tabular">{item.selectedSize}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono-tabular px-2.5 text-xs font-bold text-zinc-950 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono-tabular text-sm font-bold text-zinc-950 dark:text-white">
                        {formatCurrency(product.price * item.quantity, language)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <form
            onSubmit={handleCheckout}
            className="border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-5 space-y-4"
          >
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>{t('shipping')}</span>
                <span className="font-semibold text-zinc-950 dark:text-white">
                  {t('freeShipping')}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-zinc-950 dark:text-white pt-1.5 border-t border-zinc-200/80 dark:border-zinc-800">
                <span>{t('subtotal')}</span>
                <span className="font-mono-tabular text-red-600 dark:text-red-500">
                  {formatCurrency(cartSubtotal, language)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-bold text-zinc-950 dark:text-white">
                {t('checkoutTitle')}
              </p>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('fullName')}
                className="w-full px-3 py-2.5 rounded-lg text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phone')}
                className="w-full px-3 py-2.5 rounded-lg text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('shippingAddress')}
                className="w-full px-3 py-2.5 rounded-lg text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold tracking-tight transition-colors shadow-sm cursor-pointer"
            >
              {t('placeOrder')}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
