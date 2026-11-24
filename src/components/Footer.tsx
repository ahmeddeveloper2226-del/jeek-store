// jeek-store/src/components/Footer.tsx
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { language } = useStore();
  return (
    <>
      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 pt-8 pb-44 sm:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
            {language === 'ar' ? 'جيك ستور © 2026' : '© 2026 Jeek Store'}
          </span>
        </div>
      </footer>
      {/* Credit pinned to the very bottom of the screen, below the floating nav */}
      <div className="fixed bottom-0 inset-x-0 z-30 py-1 text-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs pointer-events-none">
        <span dir="ltr" className="font-mono-tabular text-[10px] text-zinc-500 dark:text-zinc-400">
          developed by IntelligentEra . Ahmed Mohamed
        </span>
      </div>
    </>
  );
}
