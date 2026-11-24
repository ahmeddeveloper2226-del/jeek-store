import { asset } from '../lib/asset';
import { ArrowLeft, CheckCircle2, Clock, Package, RotateCw, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../data/catalog';
import { Order, OrderStatus } from '../types';

export function OrdersPage() {
  const { orders, products, language, t, navigate, openProductDetail, addToCart } = useStore();

  const statusMeta = (status: OrderStatus) => {
    if (status === 'Delivered') {
      return {
        label: t('statusDelivered'),
        icon: CheckCircle2,
        step: 3,
        textClass: 'text-zinc-950 dark:text-white',
      };
    }
    if (status === 'In Transit') {
      return {
        label: t('statusInTransit'),
        icon: Truck,
        step: 2,
        textClass: 'text-red-600 dark:text-red-400',
      };
    }
    return {
      label: t('statusPreparing'),
      icon: Clock,
      step: 1,
      textClass: 'text-red-600 dark:text-red-400',
    };
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((snap, idx) => {
      const product = products.find((p) => p.id === snap.productId);
      if (!product) return;
      const color =
        product.colors.find((c) => c.name === snap.colorName) || product.colors[0];
      addToCart(product, color, snap.size, idx === order.items.length - 1);
    });
  };

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

      <div className="space-y-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {t('ordersTitle')}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {t('ordersSubtitle')}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 rounded-2xl text-center border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Package className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('emptyOrders')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const meta = statusMeta(order.status);
            const StatusIcon = meta.icon;

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 space-y-5 shadow-xs"
              >
                {/* Order Summary Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400">{t('orderId')} </span>
                      <span className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                        #{order.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400">{t('orderDate')}: </span>
                      <span className="font-mono-tabular font-semibold text-zinc-900 dark:text-zinc-200">
                        {order.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400">{t('orderAddress')}: </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        {order.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${meta.textClass}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{meta.label}</span>
                    </div>
                    <span className="font-mono-tabular text-base font-extrabold text-zinc-950 dark:text-white">
                      {formatCurrency(order.total, language)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-950 dark:text-white hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{language === 'ar' ? 'إعادة الطلب' : 'Reorder'}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="grid grid-cols-3 gap-2.5 text-[11px] font-semibold">
                  {[
                    { step: 1, label: t('statusPreparing') },
                    { step: 2, label: t('statusInTransit') },
                    { step: 3, label: t('statusDelivered') },
                  ].map((s) => (
                    <div key={s.step} className="space-y-1.5">
                      <div
                        className={`h-1.5 w-full rounded-full ${
                          meta.step >= s.step
                            ? 'bg-red-600'
                            : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                      />
                      <span
                        className={
                          meta.step >= s.step
                            ? 'text-zinc-950 dark:text-white'
                            : 'text-zinc-400 dark:text-zinc-600'
                        }
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Line Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${item.productId}-${idx}`}
                      onClick={() => openProductDetail(item.productId)}
                      className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                    >
                      <img
                        src={asset(item.image)}
                        alt={language === 'ar' ? item.nameAr : item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-900 shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-display text-sm font-bold text-zinc-950 dark:text-white truncate">
                          {language === 'ar' ? item.nameAr : item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-zinc-300 dark:border-zinc-700"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{language === 'ar' ? item.colorNameAr : item.colorName}</span>
                          <span>·</span>
                          <span className="font-mono-tabular">{item.size}</span>
                          <span>·</span>
                          <span className="font-mono-tabular">×{item.quantity}</span>
                        </div>
                        <p className="font-mono-tabular text-xs font-bold text-red-600 dark:text-red-500">
                          {formatCurrency(item.unitPrice * item.quantity, language)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
