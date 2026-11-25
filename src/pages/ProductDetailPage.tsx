// jeek-store/src/pages/ProductDetailPage.tsx
import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  GitCompare,
  Heart,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export function ProductDetailPage() {
  const {
    products,
    selectedProductId,
    language,
    t,
    navigate,
    addToCart,
    favorites,
    toggleFavorite,
    sendBikeToCompare,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeImage, setActiveImage] = useState(product.image);
  const [riderHeight, setRiderHeight] = useState(176);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setSelectedColorIdx(0);
    setSelectedSize(product.sizes[0]);
    setActiveImage(product.image);
  }, [product]);

  const gallery =
    product.category === 'bikes'
      ? [
          product.image,
          '/src/assets/images/detail_cockpit_macro_1795132717840.jpg',
          '/src/assets/images/hero_street_editorial_1795132717746.jpg',
        ]
      : [product.image];

  const recommendedFit =
    riderHeight < 168 ? 'S' : riderHeight < 180 ? 'M' : riderHeight < 190 ? 'L' : 'XL';

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const isFav = favorites.includes(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addToCart(product, activeColor, selectedSize, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-14">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(product.category === 'bikes' ? 'products' : 'categories')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('pdpBack')}</span>
        </button>
      </div>

      {/* Main Split Gallery + Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Big Studio Image + Angle Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            <img
              src={asset(activeImage)}
              alt={language === 'ar' ? product.nameAr : product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((imgSrc, idx) => (
                <button
                  key={`${imgSrc}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`aspect-[16/10] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    activeImage === imgSrc
                      ? 'border-red-600 ring-1 ring-red-600'
                      : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={asset(imgSrc)}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Engineering Highlights */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-3">
            <h2 className="font-display text-sm font-bold text-zinc-950 dark:text-white">
              {t('pdpHighlights')}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              {(language === 'ar' ? product.highlightsAr : product.highlights).map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-red-600 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{language === 'ar' ? product.subCategoryAr : product.subCategory}</span>
              <span className="inline-flex items-center gap-1 font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                {product.rating}
              </span>
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {language === 'ar' ? product.nameAr : product.name}
            </h1>

            <p className="font-mono-tabular text-2xl font-extrabold text-red-600 dark:text-red-500 pt-1">
              {formatCurrency(product.price, language)}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {language === 'ar' ? product.descriptionAr : product.description}
          </p>

          {/* Element & Weight Quick Line */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block">{t('elementLabel')}</span>
              <span className="font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? product.elementAr : product.element}
              </span>
            </div>
            {product.weightKg > 0 && (
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block">{t('specWeight')}</span>
                <span className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                  {product.weightKg} kg
                </span>
              </div>
            )}
          </div>

          {/* Colorway Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-950 dark:text-white">
                {t('pdpSelectColor')}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {language === 'ar' ? activeColor.nameAr : activeColor.name}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  aria-label={language === 'ar' ? c.nameAr : c.name}
                  className={`w-8 h-8 rounded-full border transition-transform cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 scale-110 border-zinc-950 dark:border-white'
                      : 'border-zinc-300 dark:border-zinc-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-950 dark:text-white">
                {t('pdpSelectSize')}
              </span>
              <span className="font-mono-tabular text-zinc-500 dark:text-zinc-400">
                {product.wheelSize}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono-tabular font-bold border transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950'
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-red-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="space-y-2.5 pt-2">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('addedToCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-label="Toggle favorite"
                className="w-12 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 hover:border-red-600 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFav ? 'fill-red-600 text-red-600' : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                />
              </button>
            </div>

            {product.category === 'bikes' && (
              <button
                type="button"
                onClick={() => sendBikeToCompare(product.id)}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <GitCompare className="w-4 h-4" />
                <span>{t('pdpCompareAction')}</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {language === 'ar'
                ? 'شحن مجاني مجمّع بنسبة ٩٥٪ وضمان هيكل سنتين'
                : 'Complimentary 95% pre-built delivery & 2-year frame warranty'}
            </span>
          </div>
        </div>
      </div>

      {/* Geometry, Interactive Height-to-Size Fit Calculator & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-10">
        {/* Spec & Geometry Table */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
            {t('pdpGeometry')}
          </h2>
          <dl className="divide-y divide-zinc-200/80 dark:divide-zinc-800 text-xs">
            {(product.details || []).map((d, i) => (
              <div key={`${d.name}-${i}`} className="py-2.5 flex justify-between gap-4">
                <dt className="text-zinc-500">{d.name}</dt>
                <dd className="font-semibold text-zinc-950 dark:text-white text-end">{d.value}</dd>
              </div>
            ))}
            {product.drivetrain !== 'N/A' && (
            <div className="py-2.5 flex justify-between">
              <dt className="text-zinc-500">{t('specDrivetrain')}</dt>
              <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                {language === 'ar' ? product.drivetrainAr : product.drivetrain}
              </dd>
            </div>
            )}
            {product.brakes !== 'N/A' && (
            <div className="py-2.5 flex justify-between">
              <dt className="text-zinc-500">{t('specBrakes')}</dt>
              <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                {language === 'ar' ? product.brakesAr : product.brakes}
              </dd>
            </div>
            )}
            {product.fork !== 'N/A' && (
            <div className="py-2.5 flex justify-between">
              <dt className="text-zinc-500">{t('specFork')}</dt>
              <dd className="font-semibold text-zinc-950 dark:text-white text-end">
                {language === 'ar' ? product.forkAr : product.fork}
              </dd>
            </div>
            )}
            {product.geometry && (
              <>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">Head Tube Angle</dt>
                  <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                    {product.geometry.headAngle}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">Reach / Stack</dt>
                  <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                    {product.geometry.reach} / {product.geometry.stack}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">Wheelbase</dt>
                  <dd className="font-mono-tabular font-semibold text-zinc-950 dark:text-white">
                    {product.geometry.wheelbase}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Interactive Rider Height Sizing Calculator */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-red-600" />
              <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
                {t('pdpFitGuide')}
              </h2>
            </div>
            <span className="font-mono-tabular text-sm font-extrabold text-red-600">
              {recommendedFit}
            </span>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">{t('heightLabel')}</span>
              <span className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                {riderHeight} cm
              </span>
            </div>
            <input
              type="range"
              min={155}
              max={200}
              value={riderHeight}
              onChange={(e) => setRiderHeight(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800 text-xs font-mono-tabular">
            {[
              { size: 'S', range: '155 – 167 cm' },
              { size: 'M', range: '168 – 179 cm' },
              { size: 'L', range: '180 – 189 cm' },
              { size: 'XL', range: '190 – 200 cm' },
            ].map((row) => (
              <div
                key={row.size}
                className={`py-2 px-2.5 rounded-md flex justify-between ${
                  recommendedFit === row.size
                    ? 'bg-red-600/10 text-red-600 dark:text-red-400 font-bold'
                    : ''
                }`}
              >
                <span>{row.size}</span>
                <span>{row.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rider Feedback */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
            {t('pdpReviews')}
          </h2>
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-950 dark:text-white">
                      {rev.rider} · {rev.city}
                    </span>
                    <span className="font-mono-tabular font-bold text-red-600">
                      {rev.rating} ★
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {language === 'ar' ? rev.commentAr : rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {language === 'ar'
                ? 'معتمد من فريق جيك ستور بتقييم جودة ٤.٩ من ٥.'
                : 'Verified Jeek Workshop drop · Rated 4.9/5 by our street test crew.'}
            </p>
          )}
        </div>
      </div>

      {/* Related Drops */}
      <div className="space-y-6 pt-4">
        <h2 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">
          {language === 'ar' ? 'قطع ودراجات مكملة' : 'Complete Your Setup'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}