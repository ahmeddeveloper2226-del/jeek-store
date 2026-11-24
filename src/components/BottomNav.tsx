// jeek-store/src/components/BottomNav.tsx
import { asset } from '../lib/asset';
import type { ComponentType } from 'react';
import { ArrowLeftRight, Bike, Home, LayoutGrid, Package, User, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_LOGO } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types';

const NAV_ITEMS: {
  route: PageRoute;
  labelKey:
    | 'navHome'
    | 'navProducts'
    | 'navCategories'
    | 'navMaintenance'
    | 'navOrders'
    | 'navCompare'
    | 'navProfile';
  icon: ComponentType<{ className?: string }>;
}[] = [
  { route: 'home', labelKey: 'navHome', icon: Home },
  { route: 'products', labelKey: 'navProducts', icon: Bike },
  { route: 'categories', labelKey: 'navCategories', icon: LayoutGrid },
  { route: 'maintenance', labelKey: 'navMaintenance', icon: Wrench },
  { route: 'orders', labelKey: 'navOrders', icon: Package },
  { route: 'compare', labelKey: 'navCompare', icon: ArrowLeftRight },
  { route: 'profile', labelKey: 'navProfile', icon: User },
];

export function BottomNav() {
  const { route, navigate, t, compareSlots, orders } = useStore();

  return (
    <>
      {/* Quiet Store Footer Stamp */}
      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200 mt-20 pb-32 sm:pb-36">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2.5">
            <img
              src={asset(STORE_LOGO)}
              alt="Jeek Store"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full bg-zinc-950 object-contain p-0.5 border border-zinc-300 dark:border-zinc-700"
            />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {t('storeName')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{t('footerTagline')}</span>
          </div>
          <span className="font-mono-tabular">© 2026 {t('storeName')}</span>
        </div>
      </footer>

      {/* Always-Visible App-Style Floating Bottom Navigation Bar */}
      <div className="fixed bottom-7 sm:bottom-8 inset-x-0 z-40 px-2.5 sm:px-6 pointer-events-none">
        <nav
          aria-label="App navigation"
          className="pointer-events-auto max-w-[780px] mx-auto grid grid-cols-7 items-center gap-0.5 sm:gap-1 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/92 dark:bg-zinc-950/92 backdrop-blur-xl shadow-[0_14px_38px_-10px_rgba(9,9,11,0.2)] dark:shadow-[0_14px_38px_-10px_rgba(0,0,0,0.8)] p-1 sm:p-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              route === item.route ||
              (item.route === 'products' && route === 'product-detail');

            const badgeCount =
              item.route === 'compare'
                ? compareSlots.filter((s) => Boolean(s.selectedBikeId)).length
                : item.route === 'orders'
                  ? orders.length
                  : 0;

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 px-0.5 sm:px-1 rounded-xl transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="jeek-app-nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-red-50/90 dark:bg-red-950/45 border border-red-200/70 dark:border-red-900/60"
                  />
                )}

                <span className="relative z-10 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  {badgeCount > 0 && item.route === 'compare' && (
                    <span className="font-mono-tabular absolute -top-1.5 -end-2.5 min-w-4 h-4 px-1 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold flex items-center justify-center">
                      {badgeCount}
                    </span>
                  )}
                </span>

                <span className="relative z-10 text-[9px] sm:text-[11px] font-display font-bold tracking-tight leading-none truncate max-w-full">
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
