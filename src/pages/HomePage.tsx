import { asset } from '../lib/asset';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Crosshair, Layers, Shield, Wrench, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroBike3D } from '../components/HeroBike3D';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

const MATERIALS_LAB = [
  {
    key: 'carbon',
    title: 'T800 Carbon Fiber',
    titleAr: 'ألياف كربون T800',
    stat: '7.4 kg',
    summary: 'Monocoque wind-tunnel layup delivering maximum stiffness and featherweight climbs.',
    summaryAr: 'تصميم كربون أحادي فائق الخفة والصلابة لتحويل كامل الطاقة إلى سرعة.',
  },
  {
    key: 'aluminum',
    title: '6061 & 7005 Aluminum',
    titleAr: 'ألومنيوم 6061 و 7005',
    stat: '9.8 – 12.6 kg',
    summary: 'Hydroformed aerospace tubes built for agile trail handling and zero-rust longevity.',
    summaryAr: 'أنابيب ألومنيوم مشكلة هيدروليكياً تجمع بين القوة والرشاقة ومقاومة الصدأ.',
  },
  {
    key: 'chromoly',
    title: '4130 Chromoly Steel',
    titleAr: 'صلب كرومولي 4130',
    stat: '9.2 kg',
    summary: 'Double-butted street track tubing that smooths out harsh city asphalt vibrations.',
    summaryAr: 'صلب كرومولي مزدوج السماكة يمتص اهتزازات الشوارع بسلاسة.',
  },
  {
    key: 'iron',
    title: 'High-Tensile Iron Alloy',
    titleAr: 'سبيكة حديد عالية الصلابة',
    stat: '11.1 kg',
    summary: 'Thick-walled street freestyle chassis engineered for heavy drops and skatepark grinds.',
    summaryAr: 'هيكل فائق المتانة مصمم للقفزات القوية وحركات الشوارع.',
  },
];

export function HomePage() {
  const { language, t, navigate, setActiveCategoryFilter, products } = useStore();
  const topSales = products.filter((p) => p.isTopSale).slice(0, 5);
  const [activeMatIdx, setActiveMatIdx] = useState(0);
  const activeMat = MATERIALS_LAB[activeMatIdx];

  const openCategory = (catId: CategoryId) => {
    setActiveCategoryFilter(catId);
    navigate('categories');
  };

  const tickerText =
    language === 'ar'
      ? 'جيك ستور · سرعة الشارع · ألياف كربون T800 · ألومنيوم 6061 · كرومولي 4130 · شحن وتجميع مجاني · '
      : 'JEEK STORE · STREET VELOCITY · T800 CARBON · 6061 ALUMINUM · 4130 CHROMOLY · 95% PRE-BUILT DELIVERY · ';

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Hero Real-Photo Studio Stage */}
      <section className="relative w-full bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
        {/* Middle-Right Little Square: "Your Perfect Bike" */}
        <motion.button
          type="button"
          onClick={() => navigate('perfect-bike-quiz')}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          aria-label={t('yourPerfectBike')}
          className="absolute end-4 sm:end-8 top-4 sm:top-1/2 sm:-translate-y-1/2 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950/95 dark:bg-white/95 text-white dark:text-zinc-950 border border-red-600/80 shadow-[0_14px_34px_-10px_rgba(220,38,38,0.45)] hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200 p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group"
        >
          <Crosshair className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
          <span className="font-display text-[11px] sm:text-xs font-bold leading-tight">
            {t('yourPerfectBike')}
          </span>
          <span className="text-[10px] opacity-75 font-mono-tabular">
            {t('yourPerfectBikeSub')}
          </span>
        </motion.button>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 pt-2 pb-14 flex flex-col items-center text-center">
          <HeroBike3D />

          {/* Directly Under the Hero Bike: "Jeek" */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <h1 className="inline-block px-2 pb-1 font-syne text-6xl sm:text-8xl font-extrabold tracking-tighter leading-none jeek-split-wordmark">
              {t('heroBrand')}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md text-balance">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#top-sales"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-tight transition-colors shadow-sm"
              >
                {t('topSales')}
              </a>
              <button
                type="button"
                onClick={() => navigate('products')}
                className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors cursor-pointer"
              >
                {t('viewAllProducts')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kinetic Ticker */}
      <div className="w-full bg-zinc-950 dark:bg-red-600 text-white overflow-hidden py-3">
        <div className="animate-jeek-marquee font-display text-xs font-bold tracking-widest whitespace-nowrap">
          <span className="px-2">{tickerText}</span>
          <span className="px-2">{tickerText}</span>
          <span className="px-2">{tickerText}</span>
          <span className="px-2">{tickerText}</span>
        </div>
      </div>

      {/* Top Sales Section (5 Signature Bikes) */}
      <section id="top-sales" className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-1.5">
            <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
              01 · {language === 'ar' ? 'الأكثر مبيعاً' : 'SIGNATURE COLLECTION'}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {t('topSales')}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              {t('topSalesDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('products')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-950 dark:text-white hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>{t('viewAllProducts')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* Asymmetric 5-Bike Editorial Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {topSales.map((bike, idx) => (
            <motion.div
              key={bike.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className={idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
            >
              <ProductCard product={bike} featured={idx === 0} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Editorial Lookbook & Element Lab */}
      <section className="w-full border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/30">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 min-h-[320px] shadow-sm">
            <img
              src={asset("/src/assets/images/hero_street_editorial_1795132717746.jpg")}
              alt="Jeek Store Street Lookbook"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-7 sm:p-9 text-white">
              <span className="text-xs font-mono-tabular font-semibold text-red-400">
                {language === 'ar' ? 'تصوير الشارع · جيك ستور' : 'STREET LOOKBOOK · CAIRO EDITION'}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight mt-1.5 text-balance">
                {language === 'ar'
                  ? 'هياكل مصممة للطرق الحقيقية.'
                  : 'Engineered for concrete, dirt, and night sprints.'}
              </h3>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-7 sm:p-9 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400">
                  02 · {language === 'ar' ? 'مختبر الخامات' : 'ELEMENT LAB'}
                </span>
                <span className="font-mono-tabular text-xs font-bold text-zinc-500">
                  {activeMat.stat}
                </span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar' ? activeMat.titleAr : activeMat.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {language === 'ar' ? activeMat.summaryAr : activeMat.summary}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {MATERIALS_LAB.map((m, idx) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setActiveMatIdx(idx)}
                    className={`px-3.5 py-2.5 rounded-xl text-start text-xs font-bold border transition-colors cursor-pointer ${
                      activeMatIdx === idx
                        ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-red-600 dark:border-red-600'
                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-red-600'
                    }`}
                  >
                    {language === 'ar' ? m.titleAr : m.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <img
                src={asset("/src/assets/images/detail_cockpit_macro_1795132717840.jpg")}
                alt="CNC Crankset Macro"
                referrerPolicy="no-referrer"
                className="w-24 h-18 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-bold text-zinc-950 dark:text-white">
                  {language === 'ar' ? 'قارن الخامات والأوزان' : 'Compare Specs Live'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('compare')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <span>{t('navCompare')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Department Quick-Launch Strip */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-16 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { id: 'bikes' as CategoryId, label: t('catBikes'), icon: Zap },
            { id: 'accessories' as CategoryId, label: t('catAccessories'), icon: Layers },
            { id: 'spare-parts' as CategoryId, label: t('catSpareParts'), icon: Wrench },
            { id: 'safety' as CategoryId, label: t('catSafety'), icon: Shield },
          ].map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => openCategory(dept.id)}
                className="group p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-600 dark:hover:border-red-500 text-start flex items-center justify-between gap-3 transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-2">
                  <Icon className="w-5 h-5 text-red-600" />
                  <p className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                    {dept.label}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
