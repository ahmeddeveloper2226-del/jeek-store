// jeek-store/src/components/Header.tsx
import { asset } from '../lib/asset';
import { LogIn, LogOut, Moon, ShoppingBag, Sun } from 'lucide-react';
import { DeviceSwitch } from './DeviceSwitch';
import { STORE_LOGO } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export function Header() {
  const {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t,
    navigate,
    cartCount,
    setIsCartOpen,
    user,
    signInWithGoogle,
    signOutUser,
  } = useStore();

  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-4 sm:py-5 grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
        {/* Top Left: English / Arabic Language Switch */}
        <div className="flex flex-col items-start justify-start gap-2 pt-2">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Switch language between English and Arabic"
            className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5 text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:border-zinc-400 dark:hover:border-zinc-600"
          >
            <span
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              EN
            </span>
            <span
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'ar'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              AR
            </span>
          </button>
          <DeviceSwitch language={language} />
        </div>

        {/* Top Center: Store Circular Logo + "Jeek Store" directly below */}
        <div className="flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="group flex flex-col items-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-0.5 bg-gradient-to-tr from-zinc-950 via-red-600 to-zinc-950 dark:from-white dark:via-red-500 dark:to-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                <img
                  src={asset(STORE_LOGO)}
                  alt="Jeek Store Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            </div>
            <span className="inline-block px-1.5 py-0.5 leading-none font-syne text-xl sm:text-2xl font-extrabold tracking-tight jeek-split-store group-hover:scale-[1.03] transition-transform whitespace-nowrap shrink-0">
              {t('storeName')}
            </span>
          </button>
        </div>

        {/* Top Right: Cart Icon + Light/Dark Theme Switch */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-1.5">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={t('cartTitle')}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-500 transition-colors cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="font-mono-tabular absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={user ? signOutUser : signInWithGoogle}
            aria-label={user ? 'Sign out' : 'Sign in with Google'}
            title={user ? user.email || '' : ''}
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white text-xs font-semibold hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {user ? <LogOut className="w-3.5 h-3.5 text-red-600" /> : <LogIn className="w-3.5 h-3.5 text-red-600" />}
            <span className="hidden sm:inline max-w-[110px] truncate">
              {user
                ? (user.displayName || user.email || '').split(' ')[0]
                : language === 'ar'
                  ? 'دخول جوجل'
                  : 'Google Sign in'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white text-xs font-semibold hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">{t('lightMode')}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">{t('darkMode')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
