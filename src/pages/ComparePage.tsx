import { asset } from '../lib/asset';
import { useState } from 'react';
import { ArrowLeft, Plus, Search, ShoppingBag, Star, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../data/catalog';

export function ComparePage() {
  const {
    products,
    compareSlots,
    updateCompareSlotQuery,
    selectCompareBike,
    addCompareSlot,
    removeCompareSlot,
    addToCart,
    openProductDetail,
    language,
    t,
    navigate,
  } = useStore();

  const [focusedSlotId, setFocusedSlotId] = useState<string | null>(null);
  const allBikes = products.filter((p) => p.category === 'bikes');

  const selectedBikes = compareSlots
    .map((s) => allBikes.find((b) => b.id === s.selectedBikeId))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const minWeight =
    selectedBikes.length >= 2 ? Math.min(...selectedBikes.map((b) => b.weightKg)) : null;
  const minPrice =
    selectedBikes.length >= 2 ? Math.min(...selectedBikes.map((b) => b.price)) : null;

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('backToHome')}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <p className="text-xs font-mono-tabular font-semibold text-red-600 dark:text-red-400 tracking-wide">
            {t('compareTitle')}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t('comparePrompt')}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {t('compareSubtitle')}
          </p>
        </div>

        {compareSlots.length < 4 && (
          <button
            type="button"
            onClick={addCompareSlot}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addBikeSlot')}</span>
          </button>
        )}
      </div>

      {/* Compare Slots + Inline + Card */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-5 min-w-[680px]"
          style={{
            gridTemplateColumns: `repeat(${compareSlots.length}, minmax(260px, 1fr))${
              compareSlots.length < 4 ? ' 110px' : ''
            }`,
          }}
        >
          {compareSlots.map((slot, idx) => {
            const bike = allBikes.find((b) => b.id === slot.selectedBikeId) || null;
            const q = slot.query.trim().toLowerCase();
            const filteredBikes = allBikes.filter(
              (b) =>
                !q ||
                b.name.toLowerCase().includes(q) ||
                b.nameAr.toLowerCase().includes(q) ||
                b.element.toLowerCase().includes(q) ||
                b.subCategory.toLowerCase().includes(q),
            );
            const showDropdown = focusedSlotId === slot.slotId;
            const isLightest = bike && minWeight !== null && bike.weightKg === minWeight;
            const isBestValue = bike && minPrice !== null && bike.price === minPrice;

            return (
              <div
                key={slot.slotId}
                className="flex flex-col rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
              >
                {/* Slot Header & Individual Search Bar */}
                <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 space-y-3 bg-zinc-50/70 dark:bg-zinc-950">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      0{idx + 1}
                    </span>
                    {compareSlots.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeCompareSlot(slot.slotId)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-red-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t('removeSlot')}</span>
                      </button>
                    )}
                  </div>

                  {/* Per-Slot Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      type="text"
                      value={slot.query}
                      onFocus={() => setFocusedSlotId(slot.slotId)}
                      onBlur={() => {
                        window.setTimeout(() => {
                          setFocusedSlotId((curr) => (curr === slot.slotId ? null : curr));
                        }, 180);
                      }}
                      onChange={(e) => {
                        updateCompareSlotQuery(slot.slotId, e.target.value);
                        setFocusedSlotId(slot.slotId);
                      }}
                      placeholder={t('searchBikeSlot')}
                      className="w-full ps-8 pe-3 py-2 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
                    />

                    {showDropdown && (
                      <div className="absolute z-20 inset-x-0 top-full mt-1 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 shadow-xl">
                        {filteredBikes.map((candidate) => (
                          <button
                            key={candidate.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectCompareBike(slot.slotId, candidate.id);
                              setFocusedSlotId(null);
                            }}
                            className="w-full text-start px-3 py-2.5 flex items-center gap-2.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 cursor-pointer"
                          >
                            <img
                              src={asset(candidate.image)}
                              alt={candidate.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-8 rounded-md object-cover shrink-0 bg-zinc-100"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-zinc-950 dark:text-white truncate">
                                {language === 'ar' ? candidate.nameAr : candidate.name}
                              </p>
                              <p className="text-[11px] text-zinc-500 truncate">
                                {formatCurrency(candidate.price, language)} ·{' '}
                                {language === 'ar' ? candidate.elementAr : candidate.element}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Bike Comparison Body */}
                {bike ? (
                  <div className="flex-1 flex flex-col">
                    <div
                      onClick={() => openProductDetail(bike.id)}
                      className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={asset(bike.image)}
                        alt={language === 'ar' ? bike.nameAr : bike.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      {(isLightest || isBestValue) && (
                        <p className="text-[11px] font-mono-tabular font-bold text-red-600 dark:text-red-400">
                          {isLightest
                            ? language === 'ar'
                              ? 'الأخف وزناً'
                              : 'Lightest Frame'
                            : language === 'ar'
                              ? 'أفضل سعر'
                              : 'Best Value'}
                        </p>
                      )}
                      <h2
                        onClick={() => openProductDetail(bike.id)}
                        className="font-display text-lg font-extrabold text-zinc-950 dark:text-white hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? bike.nameAr : bike.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-lg font-bold text-red-600 dark:text-red-500">
                          {formatCurrency(bike.price, language)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          <span className="font-mono-tabular">{bike.rating}</span>
                        </span>
                      </div>
                    </div>

                    <dl className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs flex-1">
                      <div className="px-4 py-3 flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specElement')}</dt>
                        <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                          {language === 'ar' ? bike.elementAr : bike.element}
                        </dd>
                      </div>
                      <div className="px-4 py-3 space-y-1.5">
                        <div className="flex justify-between gap-2">
                          <dt className="text-zinc-500 dark:text-zinc-400">{t('specWeight')}</dt>
                          <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                            {bike.weightKg} kg
                          </dd>
                        </div>
                        <div className="w-full h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-600"
                            style={{ width: `${Math.min(100, (bike.weightKg / 15) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="px-4 py-3 flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specWheelSize')}</dt>
                        <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                          {bike.wheelSize}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specDrivetrain')}</dt>
                        <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                          {language === 'ar' ? bike.drivetrainAr : bike.drivetrain}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specBrakes')}</dt>
                        <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                          {language === 'ar' ? bike.brakesAr : bike.brakes}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specSizes')}</dt>
                        <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                          {bike.sizes.join(' / ')}
                        </dd>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">{t('specColors')}</dt>
                        <dd className="flex items-center gap-1.5">
                          {bike.colors.map((c) => (
                            <span
                              key={c.name}
                              title={language === 'ar' ? c.nameAr : c.name}
                              className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-700"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </dd>
                      </div>
                    </dl>

                    <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => addToCart(bike, bike.colors[0], bike.sizes[0], true)}
                        className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('addToCart')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-[340px] flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    <Search className="w-7 h-7 mb-2 text-zinc-400" />
                    <p>{t('chooseBikePrompt')}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* + Add Another Bike Slot Button */}
          {compareSlots.length < 4 && (
            <button
              type="button"
              onClick={addCompareSlot}
              aria-label={t('addBikeSlot')}
              className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-red-600 dark:hover:border-red-500 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center gap-2 p-4 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl border border-current flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-center">{t('addBikeSlot')}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
