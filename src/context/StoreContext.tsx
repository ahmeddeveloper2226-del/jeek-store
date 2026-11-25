// jeek-store/src/context/StoreContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { PRODUCTS } from '../data/catalog';
import { auth, db } from '../lib/firebase';
import { DEFAULT_MAINTENANCE_CONFIG } from '../data/maintenanceConfig';
import { getTranslation, TranslationKey } from '../data/translations';
import {
  CartItem,
  CategoryId,
  CompareSlot,
  Language,
  MaintenanceOrder,
  MaintenanceServiceConfig,
  Order,
  PageRoute,
  Product,
  ProductColor,
  QuizAnswers,
  Theme,
  UserProfile,
} from '../types';

interface StoreContextValue {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  route: PageRoute;
  navigate: (route: PageRoute) => void;
  selectedProductId: string;
  openProductDetail: (productId: string) => void;
  activeCategoryFilter: CategoryId | 'all';
  setActiveCategoryFilter: (cat: CategoryId | 'all') => void;
  products: Product[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, color?: ProductColor, size?: string, openDrawer?: boolean) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  cartCount: number;
  cartSubtotal: number;
  orders: Order[];
  placeOrder: (customerName: string, phone: string, address: string) => Order;
  cancelOrder: (order: Order) => void;
  maintenanceOrders: MaintenanceOrder[];
  createMaintenanceRequest: (input: {
    customerName: string;
    phone: string;
    address: string;
    bikeModel: string;
    frameElement: string;
    frameElementAr: string;
    serviceFocus: string;
    serviceFocusAr: string;
    reportedIssue: string;
  }) => MaintenanceOrder;
  maintenanceConfig: MaintenanceServiceConfig;
  compareSlots: CompareSlot[];
  updateCompareSlotQuery: (slotId: string, query: string) => void;
  selectCompareBike: (slotId: string, bikeId: string | null) => void;
  addCompareSlot: () => void;
  removeCompareSlot: (slotId: string) => void;
  sendBikeToCompare: (bikeId: string) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  quizAnswers: QuizAnswers;
  setQuizAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
  resetQuiz: () => void;
  heroDropNonce: number;
  triggerHeroDrop: () => void;
  user: User | null;
  signInWithGoogle: () => void;
  signOutUser: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jeek Rider',
  handle: '@jeek_rider',
  city: 'Cairo',
  heightCm: 177,
  inseamCm: 82,
  preferredSize: 'M',
  ridingStyle: 'Urban Street & Gravel',
  ridingStyleAr: 'شوارع المدينة والطرق الحصوية',
  address: '',
};

const DEFAULT_QUIZ: QuizAnswers = {
  terrain: 'city',
  material: 'aluminum',
  stance: 'balanced',
  height: 'M',
  budget: 'mid',
};

function readIds(key: string): string[] {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function newestFirst<T extends { createdAtMs?: number; date: string }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => (b.createdAtMs ?? Date.parse(b.date) ?? 0) - (a.createdAtMs ?? Date.parse(a.date) ?? 0),
  );
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('jeek-apex-r1');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heroDropNonce, setHeroDropNonce] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [guestOrders, setGuestOrders] = useState<Order[]>([]);
  const [accountOrders, setAccountOrders] = useState<Order[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jeek_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => readIds('jeek_my_orders_v2'));
  const [myMaintIds, setMyMaintIds] = useState<string[]>(() => readIds('jeek_my_maint_v2'));

  const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([]);

  const [maintenanceConfig, setMaintenanceConfig] =
    useState<MaintenanceServiceConfig>(DEFAULT_MAINTENANCE_CONFIG);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jeek_favorites_v1');
      return saved ? JSON.parse(saved) : ['jeek-apex-r1', 'jeek-phantom-fixie'];
    } catch {
      return ['jeek-apex-r1', 'jeek-phantom-fixie'];
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('jeek_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [compareSlots, setCompareSlots] = useState<CompareSlot[]>([
    { slotId: 'slot-1', query: '', selectedBikeId: 'jeek-apex-r1' },
    { slotId: 'slot-2', query: '', selectedBikeId: 'jeek-vandal-29' },
  ]);

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ);

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync language + RTL direction on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Persist cart, orders, favorites, profile
  useEffect(() => {
    try {
      localStorage.setItem('jeek_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('jeek_favorites_v1', JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('jeek_profile_v1', JSON.stringify(profile));
    } catch {
      // ignore storage errors
    }
  }, [profile]);

  // Live catalog + maintenance settings from Firestore
  useEffect(() => {
    if (!db) return;
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (snap.empty) return;
        const list = snap.docs.map((d) => d.data() as Product);
        list.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
        setProducts(list);
      },
      () => {},
    );
    const unsubConfig = onSnapshot(
      doc(db, 'config', 'maintenance'),
      (snap) => {
        if (snap.exists()) {
          setMaintenanceConfig({ ...DEFAULT_MAINTENANCE_CONFIG, ...(snap.data() as Partial<MaintenanceServiceConfig>) });
        }
      },
      () => {},
    );
    return () => {
      unsubProducts();
      unsubConfig();
    };
  }, []);

  // Remember which orders belong to this device (order documents are private; only their
  // unguessable ids are kept here) and follow their live status.
  useEffect(() => {
    try {
      localStorage.setItem('jeek_my_orders_v2', JSON.stringify(myOrderIds));
      localStorage.setItem('jeek_my_maint_v2', JSON.stringify(myMaintIds));
    } catch {
      // ignore storage errors
    }
  }, [myOrderIds, myMaintIds]);

  useEffect(() => {
    if (!db) return;
    const found = new Map<string, Order>();
    const unsubs = myOrderIds.map((id) =>
      onSnapshot(
        doc(db, 'orders', id),
        (snap) => {
          if (snap.exists()) found.set(id, snap.data() as Order);
          else found.delete(id);
          setGuestOrders(newestFirst([...found.values()]));
        },
        () => {},
      ),
    );
    if (myOrderIds.length === 0) setGuestOrders([]);
    return () => unsubs.forEach((u) => u());
  }, [myOrderIds]);

  useEffect(() => {
    if (!db) return;
    const found = new Map<string, MaintenanceOrder>();
    const unsubs = myMaintIds.map((id) =>
      onSnapshot(
        doc(db, 'maintenanceOrders', id),
        (snap) => {
          if (snap.exists()) found.set(id, snap.data() as MaintenanceOrder);
          else found.delete(id);
          setMaintenanceOrders(newestFirst([...found.values()]));
        },
        () => {},
      ),
    );
    if (myMaintIds.length === 0) setMaintenanceOrders([]);
    return () => unsubs.forEach((u) => u());
  }, [myMaintIds]);

  const orders = newestFirst(
    [...guestOrders, ...accountOrders].filter(
      (o, i, all) => all.findIndex((x) => (x.docId || x.id) === (o.docId || o.id)) === i,
    ),
  );

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Signed-in customers also see their orders from any device.
  useEffect(() => {
    if (!db || !user) {
      setAccountOrders([]);
      return;
    }
    return onSnapshot(
      query(collection(db, 'orders'), where('uid', '==', user.uid)),
      (snap) => setAccountOrders(newestFirst(snap.docs.map((d) => d.data() as Order))),
      () => {},
    );
  }, [user]);

  const signInWithGoogle = () => {
    if (!auth) return;
    signInWithPopup(auth, new GoogleAuthProvider()).catch((err: { code?: string }) => {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      window.alert(
        language === 'ar'
          ? 'تعذر تسجيل الدخول بحساب جوجل. حاول مرة أخرى.'
          : 'Google sign-in failed. Please try again.',
      );
    });
  };

  const signOutUser = () => {
    if (auth) void fbSignOut(auth);
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  const t = (key: TranslationKey) => getTranslation(language, key);

  const navigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    navigate('product-detail');
  };

  const addToCart = (
    product: Product,
    color?: ProductColor,
    size?: string,
    openDrawer = true,
  ) => {
    const chosenColor = color || product.colors[0];
    const chosenSize = size || product.sizes[0];
    const key = `${product.id}__${chosenColor.name}__${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === key);
      if (existing) {
        return prev.map((item) =>
          item.id === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: key,
          productId: product.id,
          selectedColor: chosenColor,
          selectedSize: chosenSize,
          quantity: 1,
        },
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const placeOrder = (customerName: string, phone: string, address: string): Order => {
    const orderRef = db ? doc(collection(db, 'orders')) : null;
    const docId = orderRef ? orderRef.id : `local-${Date.now()}`;
    const newOrder: Order = {
      id: `JK-${Math.floor(100000 + Math.random() * 900000)}`,
      docId,
      ...(user ? { uid: user.uid } : {}),
      createdAtMs: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      total: cartSubtotal,
      customerName: customerName || profile.name,
      phone: phone,
      paymentMethod: 'Card / Cash on Delivery',
      address: address || profile.address,
      items: cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return {
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            image: product.image,
            colorName: item.selectedColor.name,
            colorNameAr: item.selectedColor.nameAr,
            colorHex: item.selectedColor.hex,
            size: item.selectedSize,
            quantity: item.quantity,
            unitPrice: product.price,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    };

    if (orderRef) {
      setMyOrderIds((prev) => [docId, ...prev]);
      setDoc(orderRef, newOrder).catch((err: { code?: string; message?: string }) => {
        console.error('Order failed:', err);
        setMyOrderIds((prev) => prev.filter((x) => x !== docId));
        const code = err?.code ? ` (${err.code})` : '';
        window.alert(
          (language === 'ar'
            ? 'تعذر إرسال الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
            : 'We could not send your order. Please check your connection and try again.') + code,
        );
      });
    } else {
      setGuestOrders((prev) => [newOrder, ...prev]);
    }
    setCart([]);
    setIsCartOpen(false);
    navigate('orders');
    return newOrder;
  };

  // Customers can only cancel while the order is still "Preparing" (enforced by Firestore rules too).
  const cancelOrder = (order: Order) => {
    if (order.status !== 'Preparing') return;
    if (db && order.docId && !order.docId.startsWith('local-')) {
      updateDoc(doc(db, 'orders', order.docId), { status: 'Cancelled' }).catch(
        (err: { code?: string }) => {
          console.error('Cancel failed:', err);
          window.alert(
            (language === 'ar'
              ? 'تعذر إلغاء الطلب. ربما تم تحديث حالته بالفعل.'
              : 'Could not cancel this order. Its status may have just changed.') +
              (err?.code ? ` (${err.code})` : ''),
          );
        },
      );
    } else {
      setGuestOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'Cancelled' } : o)),
      );
    }
  };

  const createMaintenanceRequest = (input: {
    customerName: string;
    phone: string;
    address: string;
    bikeModel: string;
    frameElement: string;
    frameElementAr: string;
    serviceFocus: string;
    serviceFocusAr: string;
    reportedIssue: string;
  }): MaintenanceOrder => {
    const today = new Date().toISOString().slice(0, 10);
    const est = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    const maintRef = db ? doc(collection(db, 'maintenanceOrders')) : null;
    const maintDocId = maintRef ? maintRef.id : `local-${Date.now()}`;

    const newTicket: MaintenanceOrder = {
      id: `MN-${Math.floor(100000 + Math.random() * 900000)}`,
      docId: maintDocId,
      createdAtMs: Date.now(),
      date: today,
      estimatedCompletion: est,
      status: 'Preparing',
      customerName: input.customerName || profile.name,
      phone: input.phone,
      address: input.address || profile.address,
      serviceMode: 'Jeek Van Pickup & Delivery',
      serviceModeAr: 'استلام وتوصيل بفان جيك (من الباب للباب)',
      bikeModel: input.bikeModel || 'Jeek Custom Bike',
      bikeModelAr: input.bikeModel || 'دراجة جيك',
      frameElement: input.frameElement,
      frameElementAr: input.frameElementAr,
      serialNumber: `JK-D2D-${Math.floor(10000 + Math.random() * 89999)}`,
      servicePackage: `Door to Door Maintenance · ${input.serviceFocus}`,
      servicePackageAr: `صيانة من الباب للباب · ${input.serviceFocusAr}`,
      reportedIssue:
        input.reportedIssue ||
        'Door to Door pickup requested for full bike checkup & calibration.',
      reportedIssueAr:
        input.reportedIssue ||
        'طلب استلام من الباب للباب لفحص الدراجة ومعايرتها.',
      technician: '',
      technicianNotes: '',
      checklist: [
        {
          id: 'c1',
          label: 'Doorstep Van Pickup & Frame Intake Tagging',
          labelAr: 'استلام الدراجة من الباب وتسجيل الهيكل',
          done: false,
        },
        {
          id: 'c2',
          label: 'Safety, Brake & Torque Inspection',
          labelAr: 'فحص الأمان والفرامل وعزم الربط',
          done: false,
        },
        {
          id: 'c3',
          label: 'Precision Calibration & Return Delivery',
          labelAr: 'المعايرة الدقيقة والتوصيل لباب المنزل',
          done: false,
        },
      ],
      charges: [],
      total: 0,
    };

    if (maintRef) {
      setMyMaintIds((prev) => [maintDocId, ...prev]);
      setDoc(maintRef, newTicket).catch(() => {
        setMyMaintIds((prev) => prev.filter((x) => x !== maintDocId));
        window.alert(
          language === 'ar'
            ? 'تعذر إرسال طلب الصيانة. يرجى المحاولة مرة أخرى.'
            : 'We could not send your maintenance request. Please try again.',
        );
      });
    } else {
      setMaintenanceOrders((prev) => [newTicket, ...prev]);
    }
    return newTicket;
  };

  const updateCompareSlotQuery = (slotId: string, query: string) => {
    setCompareSlots((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, query } : slot)),
    );
  };

  const selectCompareBike = (slotId: string, bikeId: string | null) => {
    setCompareSlots((prev) =>
      prev.map((slot) =>
        slot.slotId === slotId ? { ...slot, selectedBikeId: bikeId, query: '' } : slot,
      ),
    );
  };

  const addCompareSlot = () => {
    if (compareSlots.length >= 4) return;
    setCompareSlots((prev) => [
      ...prev,
      {
        slotId: `slot-${Date.now()}`,
        query: '',
        selectedBikeId: null,
      },
    ]);
  };

  const removeCompareSlot = (slotId: string) => {
    if (compareSlots.length <= 2) return;
    setCompareSlots((prev) => prev.filter((slot) => slot.slotId !== slotId));
  };

  const sendBikeToCompare = (bikeId: string) => {
    setCompareSlots((prev) => {
      if (prev.some((s) => s.selectedBikeId === bikeId)) return prev;
      const emptyIndex = prev.findIndex((s) => !s.selectedBikeId);
      if (emptyIndex !== -1) {
        return prev.map((s, idx) =>
          idx === emptyIndex ? { ...s, selectedBikeId: bikeId, query: '' } : s,
        );
      }
      if (prev.length < 4) {
        return [...prev, { slotId: `slot-${Date.now()}`, query: '', selectedBikeId: bikeId }];
      }
      return prev.map((s, idx) =>
        idx === prev.length - 1 ? { ...s, selectedBikeId: bikeId, query: '' } : s,
      );
    });
    navigate('compare');
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const resetQuiz = () => {
    setQuizAnswers(DEFAULT_QUIZ);
  };

  const triggerHeroDrop = () => {
    setHeroDropNonce((n) => n + 1);
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        t,
        route,
        navigate,
        selectedProductId,
        openProductDetail,
        activeCategoryFilter,
        setActiveCategoryFilter,
        products,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        cartCount,
        cartSubtotal,
        orders,
        placeOrder,
        cancelOrder,
        maintenanceOrders,
        createMaintenanceRequest,
        maintenanceConfig,
        compareSlots,
        updateCompareSlotQuery,
        selectCompareBike,
        addCompareSlot,
        removeCompareSlot,
        sendBikeToCompare,
        favorites,
        toggleFavorite,
        profile,
        updateProfile,
        quizAnswers,
        setQuizAnswers,
        resetQuiz,
        heroDropNonce,
        triggerHeroDrop,
        user,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}