import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_LOGO } from '../data/catalog';

export function IntroSplash() {
  const { language, t } = useStore();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = window.setTimeout(
      () => setVisible(false),
      prefersReducedMotion ? 320 : 1750,
    );

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="jeek-intro-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 select-none"
          role="presentation"
        >
          {/* Soft crimson radial studio glow */}
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.12)_0%,transparent_58%)] dark:bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.22)_0%,transparent_58%)]"
          />

          {/* Subtle Skip trigger */}
          <motion.button
            type="button"
            onClick={() => setVisible(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.25 }}
            className="absolute top-6 end-6 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 dark:hover:border-white transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </motion.button>

          {/* Center Lockup: Zooming Logo + Inclined Two-Tone Shop Name */}
          <motion.div
            initial={{ scale: 0.88 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.12, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Logo Emblem Container */}
            <div className="relative flex items-center justify-center">
              {/* Outer kinetic orbital ring */}
              <motion.div
                aria-hidden="true"
                initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 270 }}
                transition={{
                  scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.5 },
                  rotate: { duration: 2.2, ease: 'linear', repeat: Infinity },
                }}
                className="absolute w-56 h-56 sm:w-76 sm:h-76 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 border-t-2 border-t-red-600 dark:border-t-red-500"
              />

              {/* Pulse wave on arrival */}
              <motion.div
                aria-hidden="true"
                initial={{ scale: 0.7, opacity: 0.65 }}
                animate={{ scale: 1.55, opacity: 0 }}
                transition={{ duration: 1.05, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-red-600/50 dark:border-red-500/50"
              />

              {/* Circular Jeek Logo Zooming In */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-44 h-44 sm:w-64 sm:h-64 rounded-full p-1 bg-gradient-to-tr from-zinc-950 via-red-600 to-zinc-950 dark:from-white dark:via-red-500 dark:to-white shadow-[0_28px_72px_-16px_rgba(220,38,38,0.4)]"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <img
                    src={asset(STORE_LOGO)}
                    alt="Jeek Store"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              </motion.div>
            </div>

            {/* Shop Name Zooming In with Signature Inclined Two-Tone Gradient */}
            <motion.div
              initial={{ scale: 0.62, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 px-2 py-1 leading-none font-syne text-4xl sm:text-6xl font-extrabold tracking-tight jeek-split-store whitespace-nowrap"
            >
              {t('storeName')}
            </motion.div>

            {/* Clean crimson hairline reveal rule */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.58, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 h-0.5 w-24 sm:w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-red-600 to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
