import { asset } from '../lib/asset';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MaintenanceOrder, OrderStatus } from '../types';

export function MaintenancePage() {
  const {
    language,
    t,
    navigate,
    profile,
    maintenanceOrders,
    createMaintenanceRequest,
    maintenanceConfig,
  } = useStore();

  const gallery =
    maintenanceConfig.galleryImages.length > 0
      ? maintenanceConfig.galleryImages
      : ['/src/assets/images/maintenance_door_to_door_1795444135290.jpg'];

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedFocusIdx, setSelectedFocusIdx] = useState(0);
  const [selectedElementIdx, setSelectedElementIdx] = useState(0);
  const [bikeChoice, setBikeChoice] = useState<string>(
    maintenanceConfig.bikeModels[0]?.id || '__custom__',
  );
  const [customBikeModel, setCustomBikeModel] = useState('');
  const [customerName, setCustomerName] = useState(profile.name);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(profile.address);
  const [reportedIssue, setReportedIssue] = useState('');
  const [justBooked, setJustBooked] = useState<MaintenanceOrder | null>(null);

  useEffect(() => {
    if (!gallery.includes(activeImage)) {
      setActiveImage(gallery[0]);
    }
  }, [gallery, activeImage]);

  useEffect(() => {
    if (selectedFocusIdx >= maintenanceConfig.maintenanceTypes.length) {
      setSelectedFocusIdx(0);
    }
  }, [maintenanceConfig.maintenanceTypes.length, selectedFocusIdx]);

  useEffect(() => {
    if (selectedElementIdx >= maintenanceConfig.frameMaterials.length) {
      setSelectedElementIdx(0);
    }
  }, [maintenanceConfig.frameMaterials.length, selectedElementIdx]);

  useEffect(() => {
    const validIds = maintenanceConfig.bikeModels.map((b) => b.id);
    if (bikeChoice !== '__custom__' && !validIds.includes(bikeChoice)) {
      setBikeChoice(validIds[0] || '__custom__');
    }
    if (!maintenanceConfig.allowCustomBike && bikeChoice === '__custom__' && validIds[0]) {
      setBikeChoice(validIds[0]);
    }
  }, [maintenanceConfig.bikeModels, maintenanceConfig.allowCustomBike, bikeChoice]);

  const selectedFocus = maintenanceConfig.maintenanceTypes[selectedFocusIdx] ||
    maintenanceConfig.maintenanceTypes[0] || {
      id: 'default',
      en: 'General Maintenance',
      ar: 'صيانة عامة',
    };

  const selectedElement = maintenanceConfig.frameMaterials[selectedElementIdx] ||
    maintenanceConfig.frameMaterials[0] || {
      id: 'default',
      en: 'Alloy / Carbon',
      ar: 'ألومنيوم / كربون',
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedBike = maintenanceConfig.bikeModels.find((b) => b.id === bikeChoice);
    const resolvedBike =
      bikeChoice === '__custom__'
        ? customBikeModel.trim() || 'Custom Bicycle'
        : matchedBike
          ? language === 'ar'
            ? matchedBike.ar
            : matchedBike.en
          : bikeChoice;

    const created = createMaintenanceRequest({
      customerName: customerName.trim() || profile.name,
      phone: phone.trim(),
      address: address.trim() || profile.address,
      bikeModel: matchedBike ? matchedBike.en : resolvedBike,
      frameElement: selectedElement.en,
      frameElementAr: selectedElement.ar,
      serviceFocus: selectedFocus.en,
      serviceFocusAr: selectedFocus.ar,
      reportedIssue: reportedIssue.trim(),
    });

    setJustBooked(created);
    setReportedIssue('');
  };

  const statusMeta = (status: OrderStatus) => {
    if (status === 'Delivered') {
      return {
        label: t('statusDelivered'),
        icon: CheckCircle2,
        step: 3,
        textClass: 'text-emerald-600 dark:text-emerald-400',
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

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-12">
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

      {/* Page Title */}
      <div className="space-y-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {language === 'ar' ? 'الصيانة' : 'Maintenance'}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {language === 'ar' ? maintenanceConfig.descriptionAr : maintenanceConfig.descriptionEn}
        </p>
      </div>

      {/* Confirmation Notice */}
      {justBooked && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-display text-sm font-extrabold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? `تم تسجيل طلب ${maintenanceConfig.titleAr} (#${justBooked.id})`
                  : `${maintenanceConfig.titleEn} Ordered (#${justBooked.id})`}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                {language === 'ar'
                  ? 'سيتم التواصل معك لتأكيد موعد الاستلام إلى عنوانك.'
                  : 'Our service dispatch team will follow up for your bike pickup shortly.'}
              </p>
            </div>
          </div>
          <span className="font-mono-tabular text-xs font-bold text-red-600 dark:text-red-400">
            #{justBooked.id} · {t('statusPreparing')}
          </span>
        </div>
      )}

      {/* Door to Door Maintenance Product-Style Showcase & Order Module (NO PRICE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Studio Photography & Service Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            <img
              src={asset(activeImage)}
              alt={language === 'ar' ? maintenanceConfig.titleAr : maintenanceConfig.titleEn}
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
                    alt={`${maintenanceConfig.titleEn} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Service Highlights */}
          {maintenanceConfig.highlights.length > 0 && (
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
              <h2 className="font-display text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>
                  {language === 'ar'
                    ? `مميزات ${maintenanceConfig.titleAr}`
                    : `${maintenanceConfig.titleEn} Highlights`}
                </span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                {maintenanceConfig.highlights.map((hl) => (
                  <li key={hl.id} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-red-600 shrink-0" />
                    <span>{language === 'ar' ? hl.ar : hl.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Contiguous Product-Style Ordering Card WITHOUT Price */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm"
        >
          <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {language === 'ar' ? maintenanceConfig.kickerAr : maintenanceConfig.kickerEn}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar' ? maintenanceConfig.badgeAr : maintenanceConfig.badgeEn}
                </span>
              </span>
            </div>

            <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {language === 'ar' ? maintenanceConfig.titleAr : maintenanceConfig.titleEn}
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {language === 'ar'
              ? maintenanceConfig.descriptionAr
              : maintenanceConfig.descriptionEn}
          </p>

          {/* Logistics Spec Strip (Editable Pickup Mode & Turnaround, No Price) */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block">
                {language === 'ar'
                  ? maintenanceConfig.pickupModeLabelAr
                  : maintenanceConfig.pickupModeLabelEn}
              </span>
              <span className="font-bold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? maintenanceConfig.pickupModeAr
                  : maintenanceConfig.pickupModeEn}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block">
                {language === 'ar'
                  ? maintenanceConfig.turnaroundLabelAr
                  : maintenanceConfig.turnaroundLabelEn}
              </span>
              <span className="font-mono-tabular font-bold text-zinc-950 dark:text-white">
                {language === 'ar'
                  ? maintenanceConfig.turnaroundAr
                  : maintenanceConfig.turnaroundEn}
              </span>
            </div>
          </div>

          {/* 1. Service Focus Picker */}
          {maintenanceConfig.maintenanceTypes.length > 0 && (
            <div className="space-y-2.5">
              <span className="block text-xs font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'اختر نوع الصيانة المطلوبة' : 'Select Maintenance Type'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {maintenanceConfig.maintenanceTypes.map((focus, idx) => (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => setSelectedFocusIdx(idx)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold text-start border transition-colors cursor-pointer ${
                      selectedFocusIdx === idx
                        ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-red-600 dark:border-red-600'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-950 dark:hover:border-white'
                    }`}
                  >
                    {language === 'ar' ? focus.ar : focus.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Bike Model Selector */}
          <div className="space-y-2.5">
            <label className="block space-y-1.5">
              <span className="block text-xs font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'الدراجة الخاصة بك' : 'Select Bike Model'}
              </span>
              <select
                value={bikeChoice}
                onChange={(e) => setBikeChoice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
              >
                {maintenanceConfig.bikeModels.map((b) => (
                  <option key={b.id} value={b.id}>
                    {language === 'ar' ? b.ar : b.en}
                  </option>
                ))}
                {maintenanceConfig.allowCustomBike && (
                  <option value="__custom__">
                    {language === 'ar' ? 'دراجة أخرى (اكتب الاسم)' : 'Other Bike (Enter Model)'}
                  </option>
                )}
              </select>
            </label>

            {maintenanceConfig.allowCustomBike && bikeChoice === '__custom__' && (
              <input
                type="text"
                required
                value={customBikeModel}
                onChange={(e) => setCustomBikeModel(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'مثال: Trek Madone / دراجتي الخاصة'
                    : 'e.g. Custom Road or MTB Bike'
                }
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
              />
            )}
          </div>

          {/* 3. Frame Material Picker */}
          {maintenanceConfig.frameMaterials.length > 0 && (
            <div className="space-y-2">
              <span className="block text-xs font-bold text-zinc-950 dark:text-white">
                {language === 'ar' ? 'خامة الهيكل' : 'Frame Material'}
              </span>
              <div className="flex flex-wrap gap-2">
                {maintenanceConfig.frameMaterials.map((el, idx) => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => setSelectedElementIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedElementIdx === idx
                        ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-950 dark:hover:border-white'
                    }`}
                  >
                    {language === 'ar' ? el.ar : el.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Doorstep Contact & Notes */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('fullName')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('shippingAddress')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
            <textarea
              rows={2}
              value={reportedIssue}
              onChange={(e) => setReportedIssue(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'اشرح حالة الدراجة أو أي مشكلة تلاحظها (اختياري)...'
                  : 'Describe what needs attention (optional)...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold tracking-tight flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            <span>
              {language === 'ar'
                ? `طلب ${maintenanceConfig.titleAr}`
                : `Order ${maintenanceConfig.titleEn}`}
            </span>
          </button>
        </form>
      </div>

      {/* Live Maintenance Bookings List (Without Price) */}
      {maintenanceOrders.length > 0 && (
        <div className="space-y-5 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-extrabold text-zinc-950 dark:text-white">
              {language === 'ar' ? 'طلبات الصيانة الخاصة بك' : 'Your Maintenance Orders'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {language === 'ar'
                ? 'تابع حالة استلام وصيانة دراجتك مباشرة.'
                : 'Track live van pickup, workshop tuning, and return delivery status.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {maintenanceOrders.map((job) => {
              const meta = statusMeta(job.status);
              const StatusIcon = meta.icon;

              return (
                <article
                  key={job.id}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="space-y-1">
                      <span className="font-mono-tabular text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        #{job.id} · {job.date}
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-zinc-950 dark:text-white">
                        {language === 'ar' ? job.servicePackageAr : job.servicePackage}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {language === 'ar' ? job.bikeModelAr : job.bikeModel} ·{' '}
                        {language === 'ar' ? job.frameElementAr : job.frameElement}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold shrink-0 ${meta.textClass}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  {/* Progress Steps */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
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

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{job.address}</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {language === 'ar' ? job.reportedIssueAr : job.reportedIssue}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
