import { asset } from '../lib/asset';
import { useState } from 'react';
import { ArrowLeft, Check, Edit3, Heart, MapPin, Package, Ruler } from 'lucide-react';
import { STORE_LOGO } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export function ProfilePage() {
  const { profile, updateProfile, favorites, orders, products, language, t, navigate } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const savedProducts = products.filter((p) => favorites.includes(p.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(draft);
    setEditing(false);
  };

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
          {t('profileTitle')}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {t('profileSubtitle')}
        </p>
      </div>

      {/* Rider Passport Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-zinc-950 via-red-600 to-zinc-950 dark:from-white dark:via-red-500 dark:to-white shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={asset(STORE_LOGO)}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-zinc-950 dark:text-white">
                  {profile.name}
                </h2>
                <p className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">
                  {profile.handle} · {profile.city}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDraft(profile);
                setEditing((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('editProfile')}</span>
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="space-y-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('fullName')}
                </span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('heightLabel')} (cm)
                </span>
                <input
                  type="number"
                  value={draft.heightCm}
                  onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('inseamLabel')} (cm)
                </span>
                <input
                  type="number"
                  value={draft.inseamCm}
                  onChange={(e) => setDraft({ ...draft, inseamCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white"
                />
              </label>

              <label className="space-y-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('preferredSizeLabel')}
                </span>
                <select
                  value={draft.preferredSize}
                  onChange={(e) => setDraft({ ...draft, preferredSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </label>

              <label className="sm:col-span-2 space-y-1 text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('addressLabel')}
                </span>
                <input
                  type="text"
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white"
                />
              </label>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('saveProfile')}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('heightLabel')}
                </span>
                <p className="font-mono-tabular text-lg font-bold text-zinc-950 dark:text-white">
                  {profile.heightCm} cm
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('inseamLabel')}
                </span>
                <p className="font-mono-tabular text-lg font-bold text-zinc-950 dark:text-white">
                  {profile.inseamCm} cm
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('preferredSizeLabel')}
                </span>
                <p className="font-mono-tabular text-lg font-bold text-red-600 dark:text-red-500">
                  {profile.preferredSize}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('ridingStyleLabel')}
                </span>
                <p className="text-sm font-bold text-zinc-950 dark:text-white">
                  {language === 'ar' ? profile.ridingStyleAr : profile.ridingStyle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Metrics & Quick Links */}
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between gap-6 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <Package className="w-4 h-4 text-red-600" />
                <span>{t('totalOrdersLabel')}</span>
              </span>
              <span className="font-mono-tabular text-xl font-extrabold text-zinc-950 dark:text-white">
                {orders.length}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <Heart className="w-4 h-4 text-red-600" />
                <span>{t('savedFavorites')}</span>
              </span>
              <span className="font-mono-tabular text-xl font-extrabold text-zinc-950 dark:text-white">
                {savedProducts.length}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{t('addressLabel')}</span>
              </span>
              <p className="font-medium text-zinc-950 dark:text-white">{profile.address}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('perfect-bike-quiz')}
            className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Ruler className="w-4 h-4" />
            <span>{t('yourPerfectBike')}</span>
          </button>
        </div>
      </div>

      {/* Saved Builds Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3">
          <h2 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">
            {t('savedFavorites')}
          </h2>
          <span className="font-mono-tabular text-xs text-zinc-500 dark:text-zinc-400">
            {savedProducts.length} {t('itemsCount')}
          </span>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-12 rounded-2xl text-center border border-dashed border-zinc-300 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
            {t('noFavorites')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
