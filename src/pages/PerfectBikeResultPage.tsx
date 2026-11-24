import { asset } from '../lib/asset';
import { ArrowLeft, CheckCircle2, GitCompare, RotateCcw, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, scorePerfectBikes } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export function PerfectBikeResultPage() {
  const {
    products,
    quizAnswers,
    resetQuiz,
    addToCart,
    sendBikeToCompare,
    openProductDetail,
    language,
    t,
    navigate,
  } = useStore();

  const ranked = scorePerfectBikes(quizAnswers, products);
  const winner = ranked[0];
  const runnerUps = ranked.slice(1, 3).map((r) => r.bike);
  const recommendedSize =
    winner.bike.sizes.find((s) => s.startsWith(quizAnswers.height)) || winner.bike.sizes[0];

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (winner.score / 100) * circumference;

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('backToHome')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            resetQuiz();
            navigate('perfect-bike-quiz');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-white hover:text-red-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('resultRetake')}</span>
        </button>
      </div>

      {/* Animated Match Reveal Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
      >
        <div
          onClick={() => openProductDetail(winner.bike.id)}
          className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-full bg-zinc-100 dark:bg-zinc-950 border-b lg:border-b-0 lg:border-e border-zinc-200/80 dark:border-zinc-800 overflow-hidden cursor-pointer"
        >
          <img
            src={asset(winner.bike.image)}
            alt={language === 'ar' ? winner.bike.nameAr : winner.bike.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-red-600 dark:text-red-500 block">
                  {t('resultTitle')}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('resultMatchScore')}
                </span>
              </div>

              {/* Circular SVG Fit Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-zinc-200 dark:text-zinc-800"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </svg>
                <span className="font-mono-tabular absolute text-xs font-extrabold text-zinc-950 dark:text-white">
                  {winner.score}%
                </span>
              </div>
            </div>

            <h1
              onClick={() => openProductDetail(winner.bike.id)}
              className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white cursor-pointer hover:text-red-600 transition-colors"
            >
              {language === 'ar' ? winner.bike.nameAr : winner.bike.name}
            </h1>

            <p className="font-mono-tabular text-2xl font-extrabold text-red-600 dark:text-red-500">
              {formatCurrency(winner.bike.price, language)}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-500 block">{t('elementLabel')}</span>
                <span className="font-bold text-zinc-950 dark:text-white">
                  {language === 'ar' ? winner.bike.elementAr : winner.bike.element}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">{t('preferredSizeLabel')}</span>
                <span className="font-mono-tabular font-bold text-red-600 dark:text-red-500">
                  {recommendedSize} · {winner.bike.wheelSize}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <h2 className="text-xs font-bold text-zinc-950 dark:text-white">
                {t('resultWhyFits')}
              </h2>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                {(language === 'ar' ? winner.reasonsAr : winner.reasons).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() =>
                addToCart(winner.bike, winner.bike.colors[0], recommendedSize, true)
              }
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('addToCart')}</span>
            </button>

            <button
              type="button"
              onClick={() => sendBikeToCompare(winner.bike.id)}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <GitCompare className="w-4 h-4" />
              <span>{t('pdpCompareAction')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Runner-Up Alternatives */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">
          {t('resultRunnerUps')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {runnerUps.map((bike) => (
            <ProductCard key={bike.id} product={bike} />
          ))}
        </div>
      </div>
    </section>
  );
}
