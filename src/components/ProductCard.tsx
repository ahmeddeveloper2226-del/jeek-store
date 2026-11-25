// jeek-store/src/components/ProductCard.tsx
import { asset } from '../lib/asset';
import { useState } from 'react';
import { Bike, Check, GitCompare, Heart, ShoppingBag, Star } from 'lucide-react';
import { useDeviceMode } from '../lib/deviceMode';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../data/catalog';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured: featuredProp = false }: ProductCardProps) {
  const phone = useDeviceMode() === 'phone';
  const featured = featuredProp && !phone;
  const {
    language,
    t,
    addToCart,
    openProductDetail,
    favorites,
    toggleFavorite,
    sendBikeToCompare,
  } = useStore();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const selectedColor = product.colors[selectedColorIdx] || product.colors[0];
  const isFav = favorites.includes(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, selectedSize, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendBikeToCompare(product.id);
  };

  return (
    <article
      onClick={() => openProductDetail(product.id)}
      className={`group flex flex-col ${
        featured ? 'lg:flex-row' : ''
      } h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-600 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.12)]`}
    >
      {/* Studio Image Surface */}
      <div
        className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-950 ${
          featured
            ? 'lg:w-[54%] aspect-[4/3] lg:aspect-auto border-b lg:border-b-0 lg:border-e border-zinc-200/80 dark:border-zinc-800'
            : 'aspect-[4/3] w-full border-b border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        {!imgError ? (
          <img
            src={asset(product.image)}
            alt={language === 'ar' ? product.nameAr : product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 text-zinc-500">
            <Bike className="w-10 h-10 text-red-600" />
            <span className="text-xs font-medium px-3 text-center">
              {language === 'ar' ? product.nameAr : product.name}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute ${phone ? 'top-1.5 inset-x-1.5' : 'top-3.5 inset-x-3.5'} flex items-center justify-between pointer-events-none`}>
          {product.category === 'bikes' ? (
            <button
              type="button"
              onClick={handleCompare}
              title={t('pdpCompareAction')}
              aria-label={t('pdpCompareAction')}
              className={`pointer-events-auto ${phone ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleFavorite}
            aria-label="Save bike"
            className={`pointer-events-auto ${phone ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div
        className={`${phone ? 'p-2.5' : 'p-5'} flex-1 flex flex-col justify-between ${phone ? 'gap-2' : 'gap-4'} ${
          featured ? 'lg:p-8' : ''
        }`}
      >
        <div className={phone ? 'space-y-2' : 'space-y-3.5'}>
          {/* Available Colors Directly Under Image */}
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  title={language === 'ar' ? c.nameAr : c.name}
                  aria-label={language === 'ar' ? c.nameAr : c.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 scale-110 border-zinc-950 dark:border-white'
                      : 'border-zinc-300 dark:border-zinc-600 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className={`${phone ? 'hidden' : ''} text-[11px] text-zinc-500 dark:text-zinc-400 ms-1.5 truncate max-w-[115px]`}>
                {language === 'ar' ? selectedColor.nameAr : selectedColor.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono-tabular font-semibold text-zinc-700 dark:text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Model Name & Subtle Kicker */}
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-red-600 dark:text-red-400 font-semibold">
                {language === 'ar' ? product.subCategoryAr : product.subCategory}
              </span>
              {product.weightKg > 0 && (
                <>
                  <span className="mx-1.5">·</span>
                  <span className="font-mono-tabular">{product.weightKg} kg</span>
                </>
              )}
            </p>
            <h3
              className={`font-display font-bold tracking-tight text-zinc-950 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors ${
                featured ? 'text-2xl sm:text-3xl' : phone ? 'text-sm' : 'text-lg sm:text-xl'
              }`}
            >
              {language === 'ar' ? product.nameAr : product.name}
            </h3>
          </div>

          {featured && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>
          )}

          {/* Element & Interactive Size Selector */}
          <div className="space-y-2.5 text-xs">
            <div className={`${phone ? 'hidden' : 'flex'} items-center justify-between gap-2 py-2 border-y border-zinc-100 dark:border-zinc-800/80`}>
              <span className="text-zinc-500 dark:text-zinc-400">{t('elementLabel')}</span>
              <span className="font-semibold text-zinc-950 dark:text-zinc-100 text-end">
                {language === 'ar' ? product.elementAr : product.element}
              </span>
            </div>

            <div
              className="flex items-center justify-between gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-zinc-500 dark:text-zinc-400 shrink-0">
                {t('sizeLabel')} · {product.wheelSize}
              </span>
              <div className="flex flex-wrap items-center justify-end gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2 py-0.5 rounded-md font-mono-tabular text-[11px] font-semibold border transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950'
                        : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-red-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price + Add to Cart CTA */}
        <div className={`pt-2 border-t border-zinc-100 dark:border-zinc-800 flex ${phone ? 'flex-col items-stretch gap-2' : 'items-center justify-between gap-3'}`}>
          <span className={`font-mono-tabular ${phone ? "text-base" : "text-xl"} font-bold text-zinc-950 dark:text-white`}>
            {formatCurrency(product.price, language)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 ${phone ? 'px-2 py-2' : 'px-4 py-2.5'} rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              justAdded
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('addedToCart')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}