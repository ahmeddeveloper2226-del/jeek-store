import { asset } from '../lib/asset';
import { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroBikeVariant {
  id: string;
  productId: string;
  label: string;
  labelAr: string;
  lightImage: string;
  darkImage: string;
  isPureWhiteBg: boolean;
  weight: string;
  element: string;
  elementAr: string;
  hotspots: {
    id: string;
    x: number;
    y: number;
    title: string;
    titleAr: string;
    detail: string;
    detailAr: string;
  }[];
}

const HERO_VARIANTS: HeroBikeVariant[] = [
  {
    id: 'apex',
    productId: 'jeek-apex-r1',
    label: 'Apex Carbon R1',
    labelAr: 'أبيكس كربون R1',
    lightImage: '/src/assets/images/hero_bike_light_studio_1795133080552.jpg',
    darkImage: '/src/assets/images/hero_bike_dark_studio_1795133080605.jpg',
    isPureWhiteBg: true,
    weight: '7.4 kg',
    element: 'T800 Carbon Fiber',
    elementAr: 'ألياف كربون T800',
    hotspots: [
      {
        id: 'cockpit',
        x: 71,
        y: 23,
        title: 'Internal Aero Cockpit',
        titleAr: 'مقود هوائي مدمج',
        detail: 'Stealth cable routing · Integrated carbon stem',
        detailAr: 'تمديد داخلي مخفي مع رقبة كربون مدمجة',
      },
      {
        id: 'frame',
        x: 49,
        y: 35,
        title: 'T800 Monocoque Frame',
        titleAr: 'هيكل كربون أحادي T800',
        detail: 'Hand-laid crimson lacquer & raw carbon weave',
        detailAr: 'طلاء قرمزي فاخر مع ألياف كربون مكشوفة',
      },
      {
        id: 'wheel',
        x: 76,
        y: 66,
        title: '50mm Carbon Wheelset',
        titleAr: 'جنوط كربون ٥٠ مم',
        detail: 'Ceramic hubs · Flat-mount hydraulic disc brakes',
        detailAr: 'صرة سيراميك مع فرامل قرصية هيدروليكية',
      },
    ],
  },
  {
    id: 'vandal',
    productId: 'jeek-vandal-29',
    label: 'Vandal Trail 29',
    labelAr: 'فاندال تريل 29',
    lightImage: '/src/assets/images/bike_obsidian_trail_1795132241402.jpg',
    darkImage: '/src/assets/images/bike_obsidian_trail_1795132241402.jpg',
    isPureWhiteBg: false,
    weight: '12.6 kg',
    element: '6061 Hydroformed Alloy',
    elementAr: 'ألومنيوم 6061',
    hotspots: [
      {
        id: 'fork',
        x: 69,
        y: 45,
        title: '130mm Crimson Air Fork',
        titleAr: 'مساعد هوائي ١٣٠ مم',
        detail: 'Anodized lockout suspension for rough trails',
        detailAr: 'امتصاص صدمات احترافي للمسارات الوعرة',
      },
      {
        id: 'drive',
        x: 37,
        y: 65,
        title: 'SRAM SX Eagle 1x12',
        titleAr: 'ناقل حركة إيجل ١×١٢',
        detail: 'Wide-range climbing cassette',
        detailAr: 'نطاق تروس واسع للمرتفعات الصعبة',
      },
    ],
  },
  {
    id: 'phantom',
    productId: 'jeek-phantom-fixie',
    label: 'Phantom Fixie',
    labelAr: 'فانتوم فيكسي',
    lightImage: '/src/assets/images/bike_phantom_fixie_1795132241812.jpg',
    darkImage: '/src/assets/images/bike_phantom_fixie_1795132241812.jpg',
    isPureWhiteBg: false,
    weight: '9.2 kg',
    element: '4130 Chromoly Steel',
    elementAr: 'صلب كرومولي 4130',
    hotspots: [
      {
        id: 'saddle',
        x: 33,
        y: 22,
        title: 'Crimson Track Saddle',
        titleAr: 'مقعد سباقات قرمزي',
        detail: 'Slim urban sprint profile',
        detailAr: 'تصميم نحيف للانطلاق السريع',
      },
      {
        id: 'chain',
        x: 36,
        y: 66,
        title: '48T Flip-Flop Hub',
        titleAr: 'صرة بوجهين ٤٨ سن',
        detail: 'Run fixed gear or freewheel coasting',
        detailAr: 'تبديل سهل بين الثابت والحر',
      },
    ],
  },
];

export function HeroBike3D() {
  const { theme, language, t, heroDropNonce, triggerHeroDrop, openProductDetail } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const variant = HERO_VARIANTS[activeIdx];
  const imgSrc = theme === 'dark' ? variant.darkImage : variant.lightImage;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 150, damping: 24 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 24 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const activePin = useMemo(
    () => variant.hotspots.find((h) => h.id === activeHotspot) || null,
    [variant, activeHotspot],
  );

  return (
    <div className="relative w-full max-w-[1040px] mx-auto">
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ perspective: '1400px' }}
        className="relative w-full flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Bottom-to-Top Entrance Motion */}
        <motion.div
          key={`${variant.id}-${theme}-${heroDropNonce}`}
          initial={{ y: 180, opacity: 0, scale: 0.92, rotateX: 10 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full max-w-[880px] mx-auto"
        >
          {/* Seamless Studio Cyclorama Presentation (Zero jagged cutout artifacts) */}
          <div
            className={`relative w-full aspect-[16/9] overflow-hidden ${
              variant.isPureWhiteBg
                ? ''
                : 'rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-lg bg-zinc-100'
            }`}
          >
            <img
              src={asset(imgSrc)}
              alt={language === 'ar' ? variant.labelAr : variant.label}
              referrerPolicy="no-referrer"
              style={
                variant.isPureWhiteBg
                  ? {
                      maskImage:
                        'radial-gradient(92% 88% at 50% 50%, #000 72%, transparent 100%)',
                      WebkitMaskImage:
                        'radial-gradient(92% 88% at 50% 50%, #000 72%, transparent 100%)',
                    }
                  : undefined
              }
              className={`w-full h-full ${
                variant.isPureWhiteBg
                  ? theme === 'light'
                    ? 'object-contain mix-blend-multiply'
                    : 'object-contain'
                  : 'object-cover'
              }`}
            />

            {/* Precision Spec Hotspot Pins */}
            {variant.hotspots.map((pin) => {
              const isOpen = activeHotspot === pin.id;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setActiveHotspot(isOpen ? null : pin.id)}
                  aria-label={language === 'ar' ? pin.titleAr : pin.title}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: 'translate(-50%, -50%) translateZ(24px)',
                  }}
                  className={`absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 flex items-center justify-center text-xs font-bold cursor-pointer shadow-md ${
                    isOpen
                      ? 'bg-red-600 border-white text-white scale-110'
                      : 'bg-white/95 dark:bg-zinc-950/90 border-zinc-950/20 dark:border-white/25 text-zinc-950 dark:text-white hover:border-red-600 hover:text-red-600 hover:scale-110'
                  }`}
                >
                  {isOpen ? '×' : '+'}
                </button>
              );
            })}
          </div>

          {/* Floating Hotspot Detail Card */}
          {activePin && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto -mt-4 relative z-10 max-w-md rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-zinc-950 dark:text-white px-4 py-3 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-4 text-xs shadow-xl"
            >
              <div className="text-start">
                <p className="font-display font-bold">
                  {language === 'ar' ? activePin.titleAr : activePin.title}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                  {language === 'ar' ? activePin.detailAr : activePin.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openProductDetail(variant.productId)}
                className="text-red-600 dark:text-red-400 hover:underline font-bold whitespace-nowrap inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>{language === 'ar' ? 'عرض' : 'Inspect'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Clean Studio Control Strip */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1 gap-1">
          {HERO_VARIANTS.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setActiveHotspot(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeIdx === idx
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {language === 'ar' ? v.labelAr : v.label}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-mono-tabular font-semibold text-zinc-900 dark:text-zinc-200">
            {variant.weight}
          </span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ar' ? variant.elementAr : variant.element}</span>
        </div>

        <button
          type="button"
          onClick={triggerHeroDrop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('replayEntrance')}</span>
        </button>
      </div>
    </div>
  );
}
