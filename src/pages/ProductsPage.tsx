import { asset } from '../lib/asset';
import { useMemo, useState } from 'react';
import { ArrowLeft, GitCompare, Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency } from '../data/catalog';
import { useStore } from '../context/StoreContext';

type MaterialFilter = 'all' | 'carbon' | 'aluminum' | 'chromoly' | 'iron';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'weight-asc';

export function ProductsPage() {
  const { language, t, navigate, products } = useStore();
  const [search, setSearch] = useState('');
  const [material, setMaterial] = useState<MaterialFilter>('all');
  const [maxPrice, setMaxPrice] = useState(2600);
  const [sort, setSort] = useState<SortOption>('featured');

  const bikes = useMemo(() => {
    const base = products.filter((p) => p.category === 'bikes');
    const filtered = base.filter((b) => {
      const matchesMaterial = material === 'all' || b.elementKey === material;
      const matchesPrice = b.price <= maxPrice;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.nameAr.toLowerCase().includes(q) ||
        b.element.toLowerCase().includes(q) ||
        b.subCategory.toLowerCase().includes(q);
      return matchesMaterial && matchesPrice && matchesQuery;
    });

    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'weight-asc') return [...filtered].sort((a, b) => a.weightKg - b.weightKg);
    return filtered;
  }, [products, material, maxPrice, search, sort]);

  const materialTabs: { key: MaterialFilter; label: string; labelAr: string }[] = [
    { key: 'all', label: t('allMaterials'), labelAr: t('allMaterials') },
    { key: 'carbon', label: 'Carbon', labelAr: 'كربون' },
    { key: 'aluminum', label: 'Aluminum', labelAr: 'ألومنيوم' },
    { key: 'chromoly', label: 'Chromoly', labelAr: 'كرومولي' },
    { key: 'iron', label: 'Iron Alloy', labelAr: 'حديد' },
  ];

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

        <button
          type="button"
          onClick={() => navigate('compare')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>{t('navCompare')}</span>
        </button>
      </div>

      {/* Editorial Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center gap-2.5">
          <span className="font-mono-tabular text-xs font-semibold text-red-600 dark:text-red-400">
            {bikes.length} {t('itemsCount')}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t('productsTitle')}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            {t('productsSubtitle')}
          </p>
        </div>
        <div className="lg:col-span-5 h-48 lg:h-auto overflow-hidden border-t lg:border-t-0 lg:border-s border-zinc-200/80 dark:border-zinc-800">
          <img
            src={asset("/src/assets/images/detail_cockpit_macro_1795132717840.jpg")}
            alt="Jeek Bike Engineering"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Filter & Price Slider Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {materialTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setMaterial(tab.key)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                material === tab.key
                  ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-red-600 dark:border-red-600'
                  : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-400'
              }`}
            >
              {language === 'ar' ? tab.labelAr : tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 px-2">
            <span>{language === 'ar' ? 'الحد الأقصى:' : 'Max:'}</span>
            <input
              type="range"
              min={500}
              max={2600}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-red-600 cursor-pointer"
            />
            <span className="font-mono-tabular font-bold text-zinc-950 dark:text-white min-w-[74px]">
              {formatCurrency(maxPrice, language)}
            </span>
          </label>

          <div className="relative min-w-[210px] flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-9 pe-3 py-2 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort bikes"
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600 cursor-pointer"
          >
            <option value="featured">{t('sortFeatured')}</option>
            <option value="price-asc">{t('sortPriceAsc')}</option>
            <option value="price-desc">{t('sortPriceDesc')}</option>
            <option value="weight-asc">{t('sortWeightAsc')}</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {bikes.length === 0 ? (
        <div className="py-16 rounded-2xl text-center border border-dashed border-zinc-300 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
          {t('searchPlaceholder')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {bikes.map((bike) => (
            <ProductCard key={bike.id} product={bike} />
          ))}
        </div>
      )}
    </section>
  );
}
