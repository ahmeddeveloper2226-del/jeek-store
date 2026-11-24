import { useStore } from '../context/StoreContext';

export function Footer() {
  const { language } = useStore();
  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 pt-8 pb-32 sm:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
          {language === 'ar' ? 'جيك ستور © 2026' : '© 2026 Jeek Store'}
        </span>
        <span dir="ltr" className="font-mono-tabular text-[11px] text-zinc-500 dark:text-zinc-400">
          developed by IntelligentEra . Ahmed Mohamed
        </span>
      </div>
    </footer>
  );
}
