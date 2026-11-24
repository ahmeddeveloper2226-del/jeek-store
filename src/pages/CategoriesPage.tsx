import { asset } from '../lib/asset';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

export function CategoriesPage() {
  const { t, navigate, activeCategoryFilter, setActiveCategoryFilter, products } = useStore();

  const categories: {
    id: CategoryId;
    title: string;
    desc: string;
    image: string;
  }[] = [
    {
      id: 'bikes',
      title: t('catBikes'),
      desc: t('catBikesDesc'),
      image: '/src/assets/images/bike_crimson_apex_1795132241297.jpg',
    },
    {
      id: 'accessories',
      title: t('catAccessories'),
      desc: t('catAccessoriesDesc'),
      image: '/src/assets/images/cat_accessories_1795132241553.jpg',
    },
    {
      id: 'spare-parts',
      title: t('catSpareParts'),
      desc: t('catSparePartsDesc'),
      image: '/src/assets/images/cat_spare_parts_1795132240789.jpg',
    },
    {
      id: 'safety',
      title: t('catSafety'),
      desc: t('catSafetyDesc'),
      image: '/src/assets/images/cat_safety_1795132241059.jpg',
    },
  ];

  const activeCat: CategoryId = activeCategoryFilter === 'all' ? 'bikes' : activeCategoryFilter;
  const items = products.filter((p) => p.category === activeCat);

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-10">
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

      <div className="space-y-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {t('categoriesTitle')}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {t('categoriesSubtitle')}
        </p>
      </div>

      {/* 4 Department Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
          const isSelected = activeCat === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`group text-start flex flex-col rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-red-600 bg-zinc-950 text-white dark:bg-zinc-900 shadow-lg'
                  : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-zinc-500 shadow-xs'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800">
                <img
                  src={asset(cat.image)}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-extrabold tracking-tight">
                      {cat.title}
                    </h2>
                    <span
                      className={`font-mono-tabular text-xs font-semibold ${
                        isSelected ? 'text-red-400' : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {count} {t('itemsCount')}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-xs leading-relaxed ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {cat.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Items in Active Category */}
      <div className="pt-4 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3">
          <h3 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">
            {categories.find((c) => c.id === activeCat)?.title}
          </h3>
          <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">
            {items.length} {t('itemsCount')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
