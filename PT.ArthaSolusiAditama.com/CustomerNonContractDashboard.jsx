/* eslint-disable no-unused-vars, no-undef */
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Activity, 
  Clock, 
  Wrench, 
  FileText, 
  Plus, 
  CheckCircle2, 
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Calendar,
  Lock,
  Mail,
  LogOut,
  MapPin,
  CreditCard,
  ShoppingBag,
  Check,
  Truck,
  Phone,
  Camera,
  Upload,
  X,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import logoImg from '../assets/LogoArtha.png';
import industrialChillerImg from '../assets/industrial_chiller.png';
import ChatbotWidget from '../components/ChatbotWidget';
import { formatRupiah, parseRupiah, formatTanggalID, getTodayISO } from '../utils/formatters';

import { AC_MODELS, TOOL_MODELS, MOCK_BANNERS, MOCK_ACTIVE_ORDERS, MOCK_ACTIVE_TOOL_ORDERS, MOCK_TRANSACTIONS, MOCK_ATTENDANCE_DATA } from '../mockData/b2cData';

const isVideoUrl = (url) => {
  if (!url) return false;
  return url.includes('video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
};

export default function CustomerNonContractDashboard() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [orderSubTab, setOrderSubTab] = useState('units'); // 'units' or 'tools'
  const [errors, setErrors] = useState({});

  // B2C Banners State (CMS Marketing)
  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('marketing_banners');
    return saved ? JSON.parse(saved) : MOCK_BANNERS;
  });

  // B2C Products Sync State
  const [localB2cProducts, setLocalB2cProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem('b2c_products');
      if (saved) {
        try {
          setLocalB2cProducts(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse b2c_products", e);
        }
      }
    };
    loadProducts();
    window.addEventListener('storage', loadProducts);
    window.addEventListener('focus', loadProducts);
    return () => {
      window.removeEventListener('storage', loadProducts);
      window.removeEventListener('focus', loadProducts);
    };
  }, []);

  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play banners
  useEffect(() => {
    const activeBannersCount = banners ? banners.filter(b => b.active).length : 0;
    if (activeBannersCount <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev === activeBannersCount - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [detailTab, setDetailTab] = useState('spec');
  const [activeDetailImgIdx, setActiveDetailImgIdx] = useState(0);
  const [cartPopupItem, setCartPopupItem] = useState(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('Transfer');
  const [checkoutNote, setCheckoutNote] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [activeLightboxImageIdx, setActiveLightboxImageIdx] = useState(0);

  // User Profile State (Matching AuthNonContractPage register form fields)
  const [profile, setProfile] = useState({
    profilePic: null,
    nik: '3273012345678901',
    firstName: 'Retail',
    lastName: 'Customer',
    username: 'customer.retail',
    email: 'customer.retail@gmail.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 12, Batam',
    password: '',
    confirm: ''
  });

  // Active AC Orders State for Tracker
  const [activeOrders, setActiveOrders] = useState(() => {
    const saved = localStorage.getItem('noncontract_active_orders');
    if (saved) return JSON.parse(saved);
    return MOCK_ACTIVE_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('noncontract_active_orders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  // Active Tool Orders State for Tracker
  const [activeToolOrders, setActiveToolOrders] = useState(() => {
    const saved = localStorage.getItem('noncontract_active_tool_orders');
    if (saved) return JSON.parse(saved);
    return MOCK_ACTIVE_TOOL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('noncontract_active_tool_orders', JSON.stringify(activeToolOrders));
  }, [activeToolOrders]);

  // Past Transaction History State
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  // Calendar State
  // Task 2: calMonth/calYear/selectedDate default ke hari ini (real-time)
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => getTodayISO());
  const [activeProjectIdx, setActiveProjectIdx] = useState(-1);

  // Simulated Attendance / Visit Data for Client with only PM and Perbaikan (Minta Perbaikan)
  const [attendanceData, setAttendanceData] = useState(MOCK_ATTENDANCE_DATA);

  const getCalendarDays = () => {
    const firstWday = new Date(calYear, calMonth - 1, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const days = [];
    for (let i = 0; i < firstWday; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pm':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-50';
      case 'perbaikan':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-50';
      default:
        return 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50';
    }
  };

  const getProjectStyle = (proj, isActive) => {
    if (!proj) return {
      cardCls: 'border-slate-200 bg-white text-slate-800 hover:border-slate-350',
      badgeCls: 'bg-slate-100 text-slate-500 border-slate-200/50',
      label: 'Umum'
    };

    const isPm = proj.name.toLowerCase().includes('pm') || proj.issue.toLowerCase().includes('preventive');
    if (isPm) {
      return {
        cardCls: isActive 
          ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/10 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/5',
        badgeCls: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Jadwal PM'
      };
    } else {
      return {
        cardCls: isActive 
          ? 'border-red-500 bg-red-50/20 ring-2 ring-red-500/10 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-red-300 hover:bg-red-50/5',
        badgeCls: 'bg-red-100 text-red-800 border-red-200',
        label: 'Minta Perbaikan'
      };
    }
  };

  // Order AC unit action
  const handleOrderAC = (model) => {
    const confirmOrder = window.confirm(`Apakah Anda yakin ingin memesan ${model.name} seharga Rp ${model.price.toLocaleString('id-ID')}?`);
    if (!confirmOrder) return;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrd = {
      id: orderId,
      unitName: model.name,
      spec: model.spec,
      price: model.price,
      date: 'Hari Ini',
      statusStep: 1,
      statusText: 'Pesanan Diterima',
      historyLogs: [
        { title: 'Order Dipesan', desc: 'Pesanan unit AC telah diterima sistem. Menunggu verifikasi pembayaran.', date: 'Hari Ini' }
      ]
    };

    setActiveOrders([newOrd, ...activeOrders]);
    
    // Add to transaction history as pending/paid
    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      item: `Pembelian ${model.name}`,
      date: 'Hari Ini',
      amount: model.price + 500000, // include standard installation fee
      status: 'Paid',
      method: 'Bank Transfer'
    };
    setTransactions([newTx, ...transactions]);

    showToast(`Pemesanan ${model.name} Berhasil! Silakan periksa status pelacakan pengiriman di tab pesanan Anda.`, 'success');
    setOrderSubTab('units');
    setActiveTab('orders');
  };

  // Order Tool action
  const handleOrderTool = (tool) => {
    const confirmOrder = window.confirm(`Apakah Anda yakin ingin memesan ${tool.name} seharga Rp ${tool.price.toLocaleString('id-ID')}?`);
    if (!confirmOrder) return;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrd = {
      id: orderId,
      unitName: tool.name,
      spec: tool.spec,
      price: tool.price,
      date: 'Hari Ini',
      statusStep: 1,
      statusText: 'Pesanan Diterima',
      historyLogs: [
        { title: 'Order Dipesan', desc: 'Pesanan tools telah diterima sistem. Menunggu verifikasi pembayaran.', date: 'Hari Ini' }
      ]
    };

    setActiveToolOrders([newOrd, ...activeToolOrders]);
    
    // Add to transaction history as pending/paid
    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      item: `Pembelian ${tool.name}`,
      date: 'Hari Ini',
      amount: tool.price,
      status: 'Paid',
      method: 'Bank Transfer'
    };
    setTransactions([newTx, ...transactions]);

    showToast(`Pemesanan ${tool.name} Berhasil! Silakan periksa status pelacakan pengiriman di tab pesanan Anda.`, 'success');
    setOrderSubTab('tools');
    setActiveTab('orders');
  };

  // Add to cart helper
  const handleAddToCart = (item, type) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, type, qty: 1 }];
    });
    setCartPopupItem(item.name);
    setTimeout(() => {
      setCartPopupItem((current) => current === item.name ? null : current);
    }, 3000);
  };

  // Update cart quantity
  const handleUpdateQty = (itemId, change) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.qty + change;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Remove from cart helper
  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Cart checkout helper
  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setActiveTab('checkout');
  };

  // Final confirmation checkout submit
  const handleConfirmCheckoutSubmit = () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);

    setTimeout(() => {
      const newAcOrders = [];
      const newToolOrders = [];
      const newTransactions = [];

      cart.forEach((item) => {
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrd = {
          id: orderId,
          unitName: item.name,
          spec: item.spec,
          price: item.price * item.qty,
          qty: item.qty,
          // TODO(API): ganti dengan format tanggal dari server response POST /api/b2c/orders
          date: formatTanggalID(new Date()),
          statusStep: 1,
          statusText: 'Pesanan Diterima',
          historyLogs: [
            { title: 'Order Dipesan', desc: `Pesanan ${item.type === 'unit' ? 'unit AC' : 'tools'} (${item.qty} pcs) diterima via ${checkoutPaymentMethod} (${checkoutShippingMethod === 'delivery' ? 'Pengantaran' : 'Ambil di Tempat'}).`, date: formatTanggalID(new Date()) }
          ]
        };

        if (item.type === 'unit') {
          newAcOrders.push(newOrd);
        } else {
          newToolOrders.push(newOrd);
        }

        newTransactions.push({
          id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
          item: `Pembelian ${item.qty}x ${item.name}`,
          // TODO(API): ganti dengan date dari server POST /api/b2c/transactions
          date: formatTanggalID(new Date()),
          amount: item.price * item.qty,
          status: 'Paid',
          method: checkoutPaymentMethod
        });
      });

      // TODO(API): Ganti ini dengan call axios.post('/api/b2c/checkout', { cart })
      // dan update state berdasarkan response.
      if (newAcOrders.length > 0) {
        setActiveOrders((prev) => [...newAcOrders, ...prev]);
        setOrderSubTab('units');
      }
      if (newToolOrders.length > 0) {
        setActiveToolOrders((prev) => [...newToolOrders, ...prev]);
        setOrderSubTab('tools');
      }

      setTransactions((prev) => [...newTransactions, ...prev]);
      setCart([]);
      setCheckoutLoading(false);
      setActiveTab('orders');
      showToast("Checkout Berhasil! Silakan periksa status pelacakan pengiriman pesanan Anda.", "success");
    }, 1800);
  };

  // Avatar Upload Helper
  const handleAvatarChange = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfile(prev => ({ ...prev, profilePic: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // Save Settings handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const err = {};
    if (!profile.firstName) err.firstName = 'First Name is required';
    if (!profile.lastName) err.lastName = 'Last Name is required';
    if (!profile.phone) err.phone = 'Phone number is required';
    if (profile.password && profile.password.length < 8) err.password = 'At least 8 characters required';
    if (profile.password && profile.password !== profile.confirm) err.confirm = 'Passwords do not match';

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari Customer Portal?');
    if (confirmLogout) {
      window.location.href = '/login-noncontract?logout=1';
    }
  };

  const inputCls = (f) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-manrope transition-all outline-none bg-slate-50 focus:bg-white
     ${errors[f]
       ? 'border-red-400 focus:ring-2 focus:ring-red-200'
       : 'border-slate-200 focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/15'}`;

  // Tracker Step Config
  const TRACKER_STEPS = [
    { step: 1, label: 'Order Dipesan', icon: FileText, desc: 'Pesanan AC berhasil diterima oleh sistem PT. ASA' },
    { step: 2, label: 'Pembayaran Diverifikasi', icon: CreditCard, desc: 'Pembayaran transaksi telah terverifikasi lunas' },
    { step: 3, label: 'Unit Dikirim', icon: Truck, desc: 'Unit AC sedang dikirim oleh logistik kami ke alamat Anda' },
    { step: 4, label: 'Pemasangan Selesai', icon: Wrench, desc: 'Teknisi telah menyelesaikan pemasangan dan unit optimal' }
  ];

  const TOOL_TRACKER_STEPS = [
    { step: 1, label: 'Order Dipesan', icon: FileText, desc: 'Pesanan tools berhasil diterima oleh sistem PT. ASA' },
    { step: 2, label: 'Pembayaran Diverifikasi', icon: CreditCard, desc: 'Pembayaran transaksi telah terverifikasi lunas' },
    { step: 3, label: 'Tools Dikirim', icon: Truck, desc: 'Peralatan sedang dikirim oleh kurir ke alamat Anda' },
    { step: 4, label: 'Diterima Selesai', icon: CheckCircle2, desc: 'Alat telah diterima dengan baik oleh kustomer' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 pt-12 pb-20">
      
      {/* ────────────────────────────────────────────────────────────────
          NAVBAR LOGO CONTAINER & USER BADGE
          ──────────────────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-[#0F3D5E] text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl border border-slate-200/10">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-white/10 flex items-center justify-center text-white text-xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
              )}
              <div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider font-space">
                  Retail Client Portal (Non-Contract)
                </span>
                <h1 className="text-2xl font-extrabold font-manrope tracking-tight mt-1 text-white">{profile.firstName} {profile.lastName}</h1>
                <p className="text-slate-350 text-xs mt-1 flex items-center gap-2">
                  <span>Client ID: <strong className="text-white">CUST-NC-294</strong></span>
                  <span className="text-slate-650">•</span>
                  <span>Username: <strong className="text-white">@{profile.username}</strong></span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold font-space text-xs rounded-xl shadow-md transition-all flex items-center gap-2 relative"
              >
                <ShoppingCart className="w-4 h-4" />
                Keranjang
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                )}
              </button>
              <a 
                href="https://wa.me/628117710113" 
                target="_blank" 
                rel="noreferrer" 
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-space text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Contact Us (WhatsApp)
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold font-space text-xs rounded-xl border border-white/15 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="grid grid-cols-5 gap-3 mb-8 w-full">
          {[
            { id: 'catalog', label: 'Katalog Produk', icon: ShoppingBag },
            { id: 'orders', label: 'Pelacakan Status', icon: Truck },
            { id: 'history', label: 'Riwayat Transaksi', icon: Clock },
            { id: 'settings', label: 'Pengaturan Akun', icon: Settings },
            { id: 'contact', label: 'Hubungi Kami', icon: PhoneCall }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={`flex items-center justify-center h-14 rounded-2xl transition-all border w-full ${
                activeTab === tab.id
                  ? 'bg-[#0F3D5E] text-white border-[#0F3D5E] shadow-lg shadow-slate-900/10'
                  : 'bg-white border border-slate-100 hover:bg-slate-50 text-slate-655 hover:text-slate-950'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>

        {/* ────────────────────────────────────────────────────────────────
            MAIN CONTENT CARDS
            ──────────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 min-h-[500px] shadow-sm">

          {/* TAB: KATALOG PRODUK */}
          {activeTab === 'catalog' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Promo Banner Carousel */}
              {banners && banners.filter(b => b.active).length > 0 && (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/6.5] max-h-[360px] bg-slate-950 group border border-slate-100 mb-6">
                  {banners.filter(b => b.active).map((banner, idx) => (
                    <div 
                      key={banner.id} 
                      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center ${
                        idx === activeSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
                      }`}
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={banner.image} 
                          alt={banner.title} 
                          className="w-full h-full object-cover opacity-75 transition-transform duration-10000 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 max-w-2xl sm:max-w-3xl w-full px-6 sm:px-12 text-left space-y-2.5 text-white">
                        <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-black text-[9px] uppercase font-space tracking-wider inline-block">
                          PROMO TERKINI
                        </span>
                        <h3 className="text-sm sm:text-xl lg:text-2xl font-black font-manrope tracking-tight leading-tight max-w-xl">
                          {banner.title}
                        </h3>

                        {/* Price Tag (E-commerce Style on Dashboard Carousel - Highly Prominent) */}
                        {(banner.originalPrice || banner.promoPrice) && (
                          <div className="flex items-baseline gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl w-fit border border-white/15 shadow-lg">
                            {banner.promoPrice ? (
                              <>
                                <span className="text-red-400 font-black text-base sm:text-xl md:text-2xl tracking-tight">
                                  Rp {Number(banner.promoPrice).toLocaleString('id-ID')}
                                </span>
                                {banner.originalPrice && (
                                  <span className="text-slate-400 line-through text-[10px] sm:text-xs font-semibold opacity-75">
                                    Rp {Number(banner.originalPrice).toLocaleString('id-ID')}
                                  </span>
                                )}
                              </>
                            ) : (
                              banner.originalPrice && (
                                <span className="text-white font-black text-base sm:text-xl md:text-2xl tracking-tight">
                                  Rp {Number(banner.originalPrice).toLocaleString('id-ID')}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        <p className="text-[10px] sm:text-xs text-slate-250 font-normal leading-relaxed max-w-2xl line-clamp-2">
                          {banner.desc}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Prev / Next buttons */}
                  {banners.filter(b => b.active).length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveSlide(prev => (prev === 0 ? banners.filter(b => b.active).length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20"
                      >
                        <ChevronLeft className="w-4.5 h-4.5 text-white" />
                      </button>
                      <button 
                        onClick={() => setActiveSlide(prev => (prev === banners.filter(b => b.active).length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20"
                      >
                        <ChevronRight className="w-4.5 h-4.5 text-white" />
                      </button>
                    </>
                  )}

                  {/* Navigation dots */}
                  {banners.filter(b => b.active).length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                      {banners.filter(b => b.active).map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === activeSlide ? 'bg-[#3B82F6] w-4' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Katalog Produk</h2>
                  <p className="text-slate-400 text-xs mt-1">Jelajahi dan beli unit pendingin udara AC industri atau peralatan HVAC berkualitas tinggi.</p>
                </div>

                {/* Sub Tab buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
                  <button
                    onClick={() => setOrderSubTab('units')}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      orderSubTab === 'units'
                        ? 'bg-white text-[#0F3D5E] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Pemesanan Unit
                  </button>
                  <button
                    onClick={() => setOrderSubTab('tools')}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      orderSubTab === 'tools'
                        ? 'bg-white text-[#0F3D5E] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tools
                  </button>
                </div>
              </div>
              {/* Grid or Detail Conditional */}
              {selectedDetailProduct ? (
                <div className="bg-white p-2 sm:p-6 animate-fade-in border border-slate-200 shadow-sm rounded-none">
                  {/* Back button */}
                  <button 
                    onClick={() => setSelectedDetailProduct(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#0C3254] text-xs font-bold font-space uppercase mb-8 transition-colors group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Kembali Ke Katalog
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                      {(() => {
                        // Dynamically build the gallery array
                        const galleryImages = selectedDetailProduct.images && selectedDetailProduct.images.length > 0 
                          ? selectedDetailProduct.images 
                          : [
                              selectedDetailProduct.img,
                              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
                              'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
                              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
                            ].filter(Boolean);

                        return (
                          <>
                            <div className="w-full h-[400px] border border-slate-200 bg-white flex items-center justify-center p-6 relative">
                              <img 
                                src={galleryImages[activeDetailImgIdx] || selectedDetailProduct.img} 
                                alt={selectedDetailProduct.name} 
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {galleryImages.map((thumbUrl, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveDetailImgIdx(idx)}
                                  className={`w-20 h-20 border p-2 flex items-center justify-center bg-white transition-all shrink-0 ${
                                    activeDetailImgIdx === idx 
                                      ? 'border-[#0C3254] ring-1 ring-[#0C3254] rounded-none' 
                                      : 'border-slate-200 hover:border-slate-400 rounded-none'
                                  }`}
                                >
                                  <img src={thumbUrl} alt="thumbnail" className="max-w-full max-h-full object-contain" />
                                </button>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Right Column: Information & Actions */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                      <div>
                        <h2 className="text-2xl font-black font-manrope text-[#0C3254] leading-tight">
                          {selectedDetailProduct.name}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-2">{selectedDetailProduct.spec}</p>

                        {/* Tabs list matching the screenshot tabs */}
                        <div className="flex border-b border-slate-200 mt-8 gap-6 text-[11px] font-bold uppercase tracking-wider font-space">
                          <button
                            onClick={() => setDetailTab('spec')}
                            className={`pb-3 transition-colors ${
                              detailTab === 'spec' 
                                ? 'border-b-2 border-[#0C3254] text-[#0C3254]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Dimensi / Spek
                          </button>
                          <button
                            onClick={() => setDetailTab('features')}
                            className={`pb-3 transition-colors ${
                              detailTab === 'features' 
                                ? 'border-b-2 border-[#0C3254] text-[#0C3254]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Fitur Utama
                          </button>
                          <button
                            onClick={() => setDetailTab('contents')}
                            className={`pb-3 transition-colors ${
                              detailTab === 'contents' 
                                ? 'border-b-2 border-[#0C3254] text-[#0C3254]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Kelengkapan
                          </button>
                        </div>

                        {/* Tab Contents */}
                        <div className="mt-6">
                          <ul className="space-y-3.5 text-xs text-slate-600 font-medium pl-4 list-disc marker:text-[#0C3254]">
                            {(() => {
                              // If it's a custom uploaded product and has custom details, use them
                              if (selectedDetailProduct.id.includes('LOCAL')) {
                                const customData = {
                                  spec: selectedDetailProduct.specDetails 
                                    ? selectedDetailProduct.specDetails.split('\n').map(s => s.trim()).filter(Boolean)
                                    : ['Spesifikasi detail tidak dicantumkan oleh admin.'],
                                  features: selectedDetailProduct.features 
                                    ? selectedDetailProduct.features.split('\n').map(s => s.trim()).filter(Boolean)
                                    : ['Fitur utama tidak dicantumkan oleh admin.'],
                                  contents: selectedDetailProduct.inclusions 
                                    ? selectedDetailProduct.inclusions.split('\n').map(s => s.trim()).filter(Boolean)
                                    : ['Kelengkapan paket tidak dicantumkan oleh admin.']
                                };
                                return customData[detailTab].map((bullet, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">{bullet}</li>
                                ));
                              }

                              // Otherwise, fallback to the default static lists
                              const defaultData = selectedDetailProduct.id.startsWith('AC') 
                                ? {
                                    spec: [
                                      'Kapasitas pendinginan yang efisien & merata',
                                      'Refrigerant ramah lingkungan berkualitas tinggi',
                                      'Konsumsi daya hemat energi (teknologi Eco Inverter)',
                                      'Sirkulasi udara hening & minim getaran kompresor',
                                      'Dilengkapi penyaring filter udara anti-bakteri canggih'
                                    ],
                                    features: [
                                      'Fast Cooling: Mampu mendinginkan ruangan lebih cepat',
                                      'Smart Control terintegrasi dengan sensor suhu ruangan pintar',
                                      'Kompresor tangguh tahan fluktuasi tegangan listrik ekstrim',
                                      'Coil evaporator dilapisi pelindung anti-karat Gold Fin coating'
                                    ],
                                    contents: [
                                      '1 Unit Indoor AC Lengkap',
                                      '1 Unit Outdoor AC Premium',
                                      'Remote Control Wireless + Battery Pack',
                                      'Kartu Garansi Resmi & Sertifikat Kalibrasi ASA',
                                      'Buku Petunjuk Operasional & Kelayakan Unit'
                                    ]
                                  }
                                : {
                                    spec: [
                                      'Material casing luar tebal anti-korosi & anti-shock',
                                      'Tingkat presisi pengerjaan mekanik berskala mikron',
                                      'Desain modular praktis mudah dibawa bepergian',
                                      'Konsumsi baterai / motor handal dengan torsi seimbang',
                                      'Kompatibilitas luas dengan aneka tipe refrigerant HVAC'
                                    ],
                                    features: [
                                      'Fitur proteksi kelebihan beban / korsleting otomatis',
                                      'Tampilan layar dual-scale analog/digital presisi tinggi',
                                      'Kasing penyimpanan luar tahan banting dari ABS komposit',
                                      'Grip pegangan ergonomis berlapis karet anti slip'
                                    ],
                                    contents: [
                                      '1 Unit Tools ASA Original',
                                      'Tas / Hard Case Pelindung Eksklusif',
                                      'Set Konektor & Selang Tambahan',
                                      'Sertifikat Kalibrasi & QC Lulus Uji',
                                      'Buku Manual Panduan Kerja Teknisi'
                                    ]
                                  };
                              return defaultData[detailTab].map((bullet, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">{bullet}</li>
                              ));
                            })()}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Price & Call-To-Action */}
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space">
                            Estimasi Harga
                          </span>
                          {selectedDetailProduct.isNegotiable ? (
                            <span className="text-xl font-black text-amber-600 font-space tracking-wider uppercase">
                              Negosiasi Kontrak
                            </span>
                          ) : (
                            <span className="text-2xl font-black text-[#0C3254] font-space">
                              Rp {selectedDetailProduct.price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4">
                          {selectedDetailProduct.isNegotiable ? (
                            <a
                              href={`https://wa.me/628117710113?text=Halo%20Admin%20PT.%20ASA,%20saya%20tertarik%20untuk%20melakukan%20negosiasi%20pembelian%20produk%20${encodeURIComponent(selectedDetailProduct.name)}%20(ID:%20${selectedDetailProduct.id})`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-8 py-3.5 bg-[#0C3254] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider font-space flex items-center justify-center transition-colors shadow-sm rounded-none"
                            >
                              Hubungi Kami &rsaquo;
                            </a>
                          ) : (
                            <div className="flex items-center gap-4">
                              {cart.find(item => item.id === selectedDetailProduct.id) ? (
                                <div className="flex items-center gap-3 border border-slate-200 p-1 bg-slate-50">
                                  <button
                                    onClick={() => handleUpdateQty(selectedDetailProduct.id, -1)}
                                    className="w-8 h-8 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors shadow-sm"
                                  >
                                    -
                                  </button>
                                  <span className="font-bold text-sm px-2 text-[#0C3254] font-space">
                                    {cart.find(item => item.id === selectedDetailProduct.id).qty} Pcs
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQty(selectedDetailProduct.id, 1)}
                                    className="w-8 h-8 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors shadow-sm"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(selectedDetailProduct, selectedDetailProduct.id.startsWith('AC') ? 'unit' : 'tool')}
                                  className="px-8 py-3.5 bg-[#0C3254] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider font-space transition-colors shadow-sm rounded-none"
                                >
                                  Beli Sekarang &rsaquo;
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Grid of items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {(() => {
                      const localProducts = localB2cProducts || [];
                      
                      const parsePrice = (priceVal, defaultVal) => {
                        if (!priceVal) return defaultVal;
                        if (typeof priceVal === 'number') return priceVal;
                        if (typeof priceVal === 'string') {
                          const lower = priceVal.toLowerCase();
                          if (lower.includes('custom') || lower.includes('nego') || lower.includes('hubungi')) {
                            return null;
                          }
                          // Extract the first sequence of numbers, e.g., "IDR 4.000.000 - 12.000.000" -> 4000000
                          const firstGroup = priceVal.match(/\d[\d.,]*/);
                          if (firstGroup) {
                            const clean = parseInt(firstGroup[0].replace(/[^0-9]/g, ''));
                            return isNaN(clean) ? defaultVal : clean;
                          }
                          const clean = parseInt(priceVal.replace(/[^0-9]/g, ''));
                          return isNaN(clean) ? defaultVal : clean;
                        }
                        return defaultVal;
                      };

                      const isNego = (priceVal) => {
                        if (!priceVal) return false;
                        if (typeof priceVal === 'string') {
                          const lower = priceVal.toLowerCase();
                          return lower.includes('custom') || lower.includes('nego') || lower.includes('hubungi');
                        }
                        return false;
                      };

                      if (orderSubTab === 'units') {
                        const mappedLocal = localProducts
                          .filter(p => p && (p.category === 'Residential' || p.category === 'Commercial'))
                          .map(p => ({
                            id: `AC-LOCAL-${p.id}`,
                            name: p.name || 'Produk Baru',
                            spec: p.availability || 'Ready Stock',
                            price: parsePrice(p.price, 4500000),
                            isNegotiable: isNego(p.price),
                            img: p.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
                            images: p.images || (p.image ? [p.image] : []),
                            specDetails: p.specDetails || '',
                            features: p.features || '',
                            inclusions: p.inclusions || ''
                          }));
                        return [...AC_MODELS, ...mappedLocal];
                      } else {
                        const mappedLocal = localProducts
                          .filter(p => p && p.category === 'Industrial')
                          .map(p => ({
                            id: `TL-LOCAL-${p.id}`,
                            name: p.name || 'Produk Baru',
                            spec: p.availability || 'Ready Stock',
                            price: parsePrice(p.price, 1250000),
                            isNegotiable: isNego(p.price),
                            img: p.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
                            images: p.images || (p.image ? [p.image] : []),
                            specDetails: p.specDetails || '',
                            features: p.features || '',
                            inclusions: p.inclusions || ''
                          }));
                        return [...TOOL_MODELS, ...mappedLocal];
                      }
                    })().map(model => {
                      const itemInCart = cart.find(item => item.id === model.id);
                      const qtyInCart = itemInCart ? itemInCart.qty : 0;

                      const isUploadedImage = model.img && (model.img.startsWith('data:') || model.img.startsWith('blob:'));

                      return (
                        <div 
                          key={model.id} 
                          className="bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between p-6 text-left border border-slate-200 rounded-none shadow-sm"
                        >
                          {/* Image Box (Background removed if custom uploaded) */}
                          <div 
                            onClick={() => { setSelectedDetailProduct(model); setDetailTab('spec'); setActiveDetailImgIdx(0); }}
                            className={`w-full h-44 flex items-center justify-center mb-6 cursor-pointer transition-all rounded-xl ${
                              isUploadedImage ? 'bg-transparent' : 'bg-slate-50/50'
                            }`}
                          >
                            <img 
                              src={model.img} 
                              alt={model.name} 
                              className="max-w-full max-h-full object-contain p-2 hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          
                          {/* Details Area */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 
                                onClick={() => { setSelectedDetailProduct(model); setDetailTab('spec'); setActiveDetailImgIdx(0); }}
                                className="font-manrope font-extrabold text-[#0C3254] text-base tracking-tight leading-snug hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {model.name} <span className="text-blue-500 font-normal ml-0.5">&rsaquo;</span>
                              </h4>
                              <p className="text-xs text-slate-450 mt-2 leading-relaxed font-medium">{model.spec}</p>
                            </div>

                            {/* Professional Horizontal Colored Splitter */}
                            <div className="flex h-[2px] w-full mt-6 mb-4">
                              <div className="bg-[#0C3254] w-[75%]"></div>
                              <div className="bg-[#8DC63F] w-[25%]"></div>
                            </div>

                            <div className="flex items-center justify-between w-full">
                              {/* Price / Status */}
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-space">
                                  Harga {orderSubTab === 'units' ? 'Unit' : 'Alat'}
                                </span>
                                {model.isNegotiable ? (
                                  <span className="text-amber-600 font-black text-sm uppercase tracking-wider font-space">
                                    Negosiasi
                                  </span>
                                ) : (
                                  <span className="font-black text-[#0C3254] text-base font-space">
                                    Rp {model.price.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => { setSelectedDetailProduct(model); setDetailTab('spec'); setActiveDetailImgIdx(0); }}
                                  className="text-slate-400 hover:text-[#0C3254] font-extrabold text-[10px] tracking-wider uppercase font-space transition-colors hover:underline"
                                >
                                  Detail ›
                                </button>
                                
                                {model.isNegotiable ? (
                                  <a
                                    href={`https://wa.me/628117710113?text=Halo%20Admin%20PT.%20ASA,%20saya%20tertarik%20untuk%20melakukan%20negosiasi%20pembelian%20produk%20${encodeURIComponent(model.name)}%20(ID:%20${model.id})`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#0C3254] hover:text-blue-600 font-extrabold text-xs flex items-center gap-1 tracking-wider uppercase font-space transition-colors hover:underline"
                                  >
                                    Hubungi Kami &rsaquo;
                                  </a>
                                ) : qtyInCart > 0 ? (
                                  <div className="flex items-center gap-2 border border-slate-150 rounded-full p-0.5 bg-slate-50">
                                    <button
                                      onClick={() => handleUpdateQty(model.id, -1)}
                                      className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors shadow-sm text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold text-[11px] px-1.5 text-[#0C3254] font-space">{qtyInCart} Pcs</span>
                                    <button
                                      onClick={() => handleUpdateQty(model.id, 1)}
                                      className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors shadow-sm text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(model, orderSubTab === 'units' ? 'unit' : 'tool')}
                                    className="text-[#0C3254] hover:text-blue-600 font-extrabold text-xs flex items-center gap-1 tracking-wider uppercase font-space transition-colors hover:underline"
                                  >
                                    Beli Sekarang &rsaquo;
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: CHECKOUT FORM */}
          {activeTab === 'checkout' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black font-manrope text-[#0C3254] uppercase tracking-wider">Checkout Pesanan</h2>
                <p className="text-slate-400 text-xs mt-1">Tinjau pesanan Anda, pilih metode pengiriman, dan jadwalkan instalasi unit pendingin oleh teknisi PT. ASA.</p>
              </div>

              {cart.length === 0 ? (
                <div className="border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4 bg-white rounded-none shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-slate-350" />
                  <p className="font-extrabold font-manrope text-[#0C3254]">Keranjang Belanja Anda Kosong</p>
                  <p className="text-slate-400 text-xs max-w-sm">Silakan tambahkan beberapa unit pendingin atau HVAC tools dari katalog terlebih dahulu.</p>
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="px-6 py-2.5 bg-[#0C3254] text-white font-bold text-xs uppercase tracking-wider font-space hover:bg-blue-800 rounded-none shadow-sm transition-colors"
                  >
                    Kembali Ke Katalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Review Items & Summary */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-4">
                      <h3 className="font-manrope font-extrabold text-[#0C3254] text-sm uppercase tracking-wide border-b border-slate-100 pb-3">Daftar Item Pesanan</h3>
                      
                      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-2">
                        {cart.map((item) => (
                          <div key={item.id} className="py-4 flex gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-white border border-slate-100 flex items-center justify-center p-1 shrink-0 rounded-none">
                                <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs font-manrope leading-snug">{item.name}</h4>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{item.spec}</span>
                                
                                {/* Quantity controls inside checkout */}
                                <div className="flex items-center gap-1.5 mt-2">
                                  <button 
                                    onClick={() => handleUpdateQty(item.id, -1)}
                                    className="w-5 h-5 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="text-[11px] font-bold font-space px-1.5 text-[#0C3254]">{item.qty} Pcs</span>
                                  <button 
                                    onClick={() => handleUpdateQty(item.id, 1)}
                                    className="w-5 h-5 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                                  >
                                    +
                                  </button>
                                  <span className="text-[10px] text-slate-400 font-medium ml-2">@ Rp {item.price.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className="font-bold text-xs text-[#0C3254] font-space block">
                                Rp {(item.price * item.qty).toLocaleString('id-ID')}
                              </span>
                              <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-red-500 hover:text-red-750 text-[10px] uppercase font-bold mt-1 font-space transition-colors hover:underline"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                        <span className="font-extrabold text-[#0C3254] text-xs uppercase tracking-wider font-space">Total Estimasi Belanja</span>
                        <span className="font-black text-lg text-[#0C3254] font-space">
                          Rp {cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Summary Panel */}
                    <div className="bg-[#8DC63F]/5 border border-[#8DC63F]/20 p-5 rounded-none space-y-2 text-left">
                      <h4 className="font-space font-extrabold text-[10px] uppercase tracking-wider text-[#0C3254]">Ringkasan Pemasangan & Logistik</h4>
                      <div className="text-xs text-slate-700 space-y-1 font-medium font-space">
                        <p><span className="text-slate-400 uppercase text-[9px] block">Metode Penanganan:</span> {checkoutShippingMethod === 'delivery' ? 'Pengantaran & Instalasi Teknisi PT. ASA' : 'Ambil Mandiri di Workshop PT. ASA'}</p>
                        <p className="mt-2"><span className="text-slate-400 uppercase text-[9px] block">Lokasi Pemasangan:</span> {checkoutAddress}</p>
                        <p className="mt-2"><span className="text-slate-400 uppercase text-[9px] block">Jadwal Rencana Kunjungan:</span> {checkoutDate.replace('T', ' Jam ')} WIB</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Checkout Config Form */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-6">
                      
                      {/* Payment Method */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space mb-2">Metode Pembayaran</label>
                        <select 
                          value={checkoutPaymentMethod}
                          onChange={(e) => setCheckoutPaymentMethod(e.target.value)}
                          className="w-full border border-slate-250 p-3 bg-white text-xs font-semibold text-slate-800 rounded-none focus:outline-none focus:border-[#0C3254]"
                        >
                          <option value="Transfer Bank">Transfer Bank Virtual Account PT. ASA</option>
                          <option value="QRIS / E-Wallet">QRIS Otomatis / GoPay / OVO</option>
                          <option value="Cash on Delivery">Bayar di Tempat (Setelah Instalasi Selesai)</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space mb-2">Catatan Pemasangan / Petunjuk Lokasi</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Unit diletakkan di lantai 2 sebelah kanan lift..."
                          value={checkoutNote}
                          onChange={(e) => setCheckoutNote(e.target.value)}
                          className="w-full border border-slate-250 p-3 text-xs font-medium text-slate-800 rounded-none focus:outline-none focus:border-[#0C3254]"
                        />
                      </div>

                      {/* Delivery/Pickup Select */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space mb-2">Pilihan Pengiriman & Supervisi</label>
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={() => setCheckoutShippingMethod('delivery')}
                            className={`w-full p-4 border text-left flex justify-between items-center transition-all rounded-none ${
                              checkoutShippingMethod === 'delivery'
                                ? 'border-[#0C3254] bg-[#0C3254]/5'
                                : 'border-slate-200 hover:border-slate-350 bg-white'
                            }`}
                          >
                            <div>
                              <span className="font-extrabold text-xs text-[#0C3254] block">Layanan Pengantaran & Pasang</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Dikirim dan diinstal langsung oleh teknisi bersertifikat PT. ASA</span>
                            </div>
                            <span className="px-2 py-0.5 bg-[#8DC63F] text-[#0C3254] font-black text-[9px] uppercase tracking-wide rounded-none shrink-0">
                              Rekomendasi
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCheckoutShippingMethod('pickup')}
                            className={`w-full p-4 border text-left flex justify-between items-center transition-all rounded-none ${
                              checkoutShippingMethod === 'pickup'
                                ? 'border-[#0C3254] bg-[#0C3254]/5'
                                : 'border-slate-200 hover:border-slate-350 bg-white'
                            }`}
                          >
                            <div>
                              <span className="font-extrabold text-xs text-slate-800 block">Ambil Sendiri ke Workshop ASA</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Pengambilan barang mandiri ke gudang utama (Batam Centre)</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Shipping Address Textarea */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space mb-2">Alamat Pengantaran & Instalasi</label>
                        <textarea 
                          rows="3"
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="w-full border border-slate-250 p-3 text-xs font-semibold text-slate-800 rounded-none focus:outline-none focus:border-[#0C3254] resize-none"
                        ></textarea>
                      </div>

                      {/* Schedule Picker */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-space mb-2">Jadwal Pengerjaan Supervisi / Kunjungan</label>
                        <input 
                          type="datetime-local" 
                          value={checkoutDate}
                          onChange={(e) => setCheckoutDate(e.target.value)}
                          className="w-full border border-slate-250 p-3 text-xs font-semibold text-slate-800 rounded-none focus:outline-none focus:border-[#0C3254] font-space"
                        />
                      </div>

                      {/* Submit & Back buttons */}
                      <div className="pt-2 space-y-3">
                        <button
                          type="button"
                          disabled={checkoutLoading}
                          onClick={handleConfirmCheckoutSubmit}
                          className={`w-full py-4 ${checkoutLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0C3254] hover:bg-blue-800'} text-white font-extrabold font-space text-xs uppercase tracking-wider shadow-sm transition-colors rounded-none flex items-center justify-center gap-2`}
                        >
                          {checkoutLoading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
                              <span>Memproses...</span>
                            </>
                          ) : (
                            <span>Konfirmasi Checkout &rarr;</span>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setActiveTab('catalog')}
                          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-500 font-extrabold font-space text-xs uppercase tracking-wider border border-slate-200 transition-colors rounded-none"
                        >
                          Kembali Ke Katalog
                        </button>
                      </div>

                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PELACAKAN PESANAN (TRACKER ONLY) */}
          {activeTab === 'orders' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Status Pelacakan Pesanan</h2>
                  <p className="text-slate-400 text-xs mt-1">Lacak status progress pengiriman dan pemasangan pesanan Anda secara langsung.</p>
                </div>

                {/* Sub Tab buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
                  <button
                    onClick={() => setOrderSubTab('units')}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      orderSubTab === 'units'
                        ? 'bg-white text-[#0F3D5E] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Pemesanan Unit
                  </button>
                  <button
                    onClick={() => setOrderSubTab('tools')}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                      orderSubTab === 'tools'
                        ? 'bg-white text-[#0F3D5E] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tools
                  </button>
                </div>
              </div>

              {/* Order Tracker Logs Section */}
              {(orderSubTab === 'units' ? activeOrders : activeToolOrders).length > 0 ? (
                <div className="space-y-5">
                  <h3 className="font-manrope font-bold text-sm text-[#0F3D5E] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Status Pelacakan Pesanan Aktif ({orderSubTab === 'units' ? 'Unit AC' : 'Tools'})
                  </h3>

                  {(orderSubTab === 'units' ? activeOrders : activeToolOrders).map((ord) => (
                    <div key={ord.id} className="bg-slate-50 border border-slate-155 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                      {/* Order info */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg tracking-wider font-space bg-blue-100 text-blue-800">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold font-space">{ord.date}</span>
                          </div>
                          <h4 className="font-manrope font-black text-[#0F3D5E] text-base mt-2">
                            {ord.unitName} <span className="text-slate-400 font-normal">({ord.qty || 1} Pcs)</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 font-semibold">{ord.spec}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-455 block font-space font-bold uppercase">Nilai Transaksi</span>
                          <span className="font-black text-slate-800 text-base font-space">
                            Rp {ord.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Tracker Steps */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        {(orderSubTab === 'units' ? TRACKER_STEPS : TOOL_TRACKER_STEPS).map((stepItem, idx) => {
                          const isDone = ord.statusStep >= stepItem.step;
                          const isActive = ord.statusStep === stepItem.step;
                          return (
                            <div key={idx} className="relative flex flex-col items-start gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold relative ${
                                  isActive 
                                    ? 'bg-[#3B82F6] text-white ring-4 ring-blue-500/30'
                                    : isDone 
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-400'
                                }`}>
                                  {isActive && (
                                    <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                                  )}
                                  {isDone ? <Check className="w-4 h-4" /> : <stepItem.icon className="w-4 h-4" />}
                                </span>
                                <span className="text-xs font-bold text-slate-800">{stepItem.label}</span>
                              </div>
                              <p className="text-[10px] text-slate-450 pl-9 leading-normal">{stepItem.desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Log History */}
                      <div className="bg-white border border-slate-150 rounded-xl p-5 space-y-4">
                        <span className="text-[#0F3D5E] block font-space uppercase text-[9px] font-black tracking-wider">Log Progress Riwayat Pelacakan</span>
                        <div className="relative pl-4 border-l border-slate-200 space-y-4 ml-1">
                          {ord.historyLogs.map((log, lIdx) => (
                            <div key={lIdx} className="relative text-xs">
                              {/* Dot connector */}
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500/20" />
                              <div className="flex justify-between items-center gap-2">
                                <strong className="text-slate-800 font-manrope">{log.title}</strong>
                                <span className="text-[9px] text-slate-400 font-bold font-space">{log.date}</span>
                              </div>
                              <p className="text-slate-500 text-[11px] mt-1 leading-normal">{log.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-slate-350" />
                  <p className="font-extrabold font-manrope text-[#0F3D5E]">
                    {orderSubTab === 'units' ? 'Belum Ada Unit AC Dipesan' : 'Belum Ada Peralatan Tools Dipesan'}
                  </p>
                  <p className="text-slate-400 max-w-sm">
                    {orderSubTab === 'units' 
                      ? 'Anda dapat melakukan pemesanan unit AC baru di tab Katalog dan melacak statusnya di sini.' 
                      : 'Anda dapat melakukan pemesanan peralatan HVAC baru di tab Katalog dan melacak statusnya di sini.'}
                  </p>
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="mt-2 px-4 py-2 bg-[#0F3D5E] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#082940]"
                  >
                    Buka Katalog Produk
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-black font-manrope text-[#0C3254]">Riwayat Transaksi & Pembayaran</h2>
                <p className="text-slate-400 text-xs mt-1">Daftar pembelian AC unit dan pembayaran maintenance servis PT. Artha Solusi Aditama.</p>
              </div>

              {/* Transactions Table */}
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 font-space font-bold text-[10px] uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-2">ID Transaksi</th>
                        <th className="py-4 px-2">Deskripsi Item</th>
                        <th className="py-4 px-2">Tanggal</th>
                        <th className="py-4 px-2 text-right">Jumlah (IDR)</th>
                        <th className="py-4 px-2">Metode</th>
                        <th className="py-4 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="py-5 px-2 font-mono font-bold text-[#0C3254] text-xs">{tx.id}</td>
                          <td className="py-5 px-2 font-manrope font-semibold text-slate-800 text-xs">{tx.item}</td>
                          <td className="py-5 px-2 text-slate-500 font-space text-[11px]">{tx.date}</td>
                          <td className="py-5 px-2 text-right font-bold font-space text-slate-800 text-xs">
                            Rp {tx.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-5 px-2 text-slate-500 font-space text-[11px]">{tx.method}</td>
                          <td className="py-5 px-2 text-center">
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-extrabold uppercase tracking-wide">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in text-left w-full">
              <div>
                <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Pengaturan Akun & Profil</h2>
                <p className="text-slate-400 text-xs mt-1">Ubah data identitas retail kustomer Anda dan perbarui kata sandi akun.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {saveSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Profil kustomer berhasil diperbarui!</span>
                  </div>
                )}

                {/* Profile Pic Upload */}
                <div className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="relative shrink-0 overflow-hidden rounded-full w-[72px] h-[72px] border-2 border-dashed border-slate-300 hover:border-[#0F3D5E] transition-all bg-white cursor-pointer group">
                    {profile.profilePic ? (
                      <img src={profile.profilePic} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-[#0F3D5E] transition-colors">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit]">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0F3D5E] font-manrope">Foto Profil Kustomer</p>
                    <p className="text-slate-400 text-xs mt-0.5 font-manrope">Ubah atau pasang foto identitas resmi Anda.</p>
                    <label className="mt-2.5 px-3 py-1 bg-white border border-slate-250 rounded-lg text-xs font-bold text-slate-655 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-all inline-block cursor-pointer">
                      Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NIK */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      NIK (Nomor Induk Kependudukan)
                    </label>
                    <input 
                      type="text" 
                      maxLength={16} 
                      className={inputCls('nik')}
                      value={profile.nik} 
                      onChange={e => setProfile({ ...profile, nik: e.target.value.replace(/\D/g, '') })} 
                    />
                    {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
                  </div>
                  {/* Username */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      Username
                    </label>
                    <input 
                      type="text" 
                      className={inputCls('username')}
                      value={profile.username} 
                      disabled
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Username tidak dapat diubah.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      className={inputCls('firstName')}
                      value={profile.firstName} 
                      onChange={e => setProfile({ ...profile, firstName: e.target.value })} 
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      className={inputCls('lastName')}
                      value={profile.lastName} 
                      onChange={e => setProfile({ ...profile, lastName: e.target.value })} 
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className={inputCls('email')}
                      value={profile.email} 
                      disabled
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Email terikat pada akun retail.</p>
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                      No HP / WhatsApp
                    </label>
                    <input 
                      type="text" 
                      className={inputCls('phone')}
                      value={profile.phone} 
                      onChange={e => setProfile({ ...profile, phone: e.target.value })} 
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Alamat */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                    Alamat Lengkap
                  </label>
                  <input 
                    type="text" 
                    className={inputCls('address')}
                    value={profile.address} 
                    onChange={e => setProfile({ ...profile, address: e.target.value })} 
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="border-t border-slate-200/50 pt-5 space-y-4">
                  <h4 className="font-manrope font-bold text-sm text-[#0F3D5E] uppercase tracking-wide font-space">Perbarui Password</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                        Password Baru <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>
                      </label>
                      <input 
                        type="password" 
                        placeholder="Minimal 8 karakter"
                        className={inputCls('password')}
                        value={profile.password} 
                        onChange={e => setProfile({ ...profile, password: e.target.value })} 
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    {/* Confirm */}
                    <div>
                      <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                        Konfirmasi Password Baru
                      </label>
                      <input 
                        type="password" 
                        placeholder="Confirm password"
                        className={inputCls('confirm')}
                        value={profile.confirm} 
                        onChange={e => setProfile({ ...profile, confirm: e.target.value })} 
                      />
                      {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-6 py-3 bg-[#0F3D5E] hover:bg-[#082940] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-slate-900/10"
                >
                  {saveLoading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Hubungi Kami (Contact Us)</h2>
                <p className="text-slate-400 text-xs mt-1">Dapatkan respon bantuan cepat dari tim operasional PT. Artha Solusi Aditama.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left Card: Contact Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider font-space">
                      Emergency Support Line
                    </span>
                    <h3 className="font-manrope font-black text-[#0F3D5E] text-lg mt-2">Dukungan Darurat (24/7)</h3>
                    <p className="text-slate-500 text-xs leading-normal">Untuk kendala HVAC industri darurat (breakdown chiller utama atau gangguan sirkuit kelistrikan panel AC gedung), segera hubungi tim emergency teknisi kami.</p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-200 text-blue-650">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase font-space">Telepon Kantor</span>
                        <p className="text-slate-800 text-xs font-bold font-space">+62 811-771-0113</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-200 text-blue-650">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase font-space">Email Hubungan</span>
                        <p className="text-slate-800 text-xs font-bold font-space">support@arthasolusiaditama.co.id</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-200 text-blue-650">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase font-space">Alamat Kantor Pusat</span>
                        <p className="text-slate-800 text-xs font-bold font-space leading-normal">
                          Ruko Mega Legenda Block B2 No. 6, Batam Centre, Kota Batam, Kepulauan Riau
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://wa.me/628117710113" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-space text-xs rounded-xl text-center shadow-md block transition-all"
                  >
                    Direct Chat WhatsApp
                  </a>
                </div>

                {/* Right Card: FAQ */}
                <div className="border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
                  <h3 className="font-manrope font-black text-[#0F3D5E] text-base">Pertanyaan Umum (FAQ)</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800">Berapa biaya instalasi unit AC baru?</h4>
                      <p className="text-slate-500 leading-normal">Biaya jasa instalasi standar berkisar antara Rp 300,000 - Rp 600,000 tergantung pada kapasitas HP unit AC dan panjang instalasi pipa tembaga di lapangan.</p>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-slate-800">Berapa lama garansi resmi unit AC?</h4>
                      <p className="text-slate-500 leading-normal">Setiap pembelian AC unit resmi melalui PT. Artha Solusi Aditama mendapatkan garansi kompresor pabrik 3 tahun dan garansi sparepart 1 tahun.</p>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-slate-800">Kapan teknisi akan tiba setelah saya order?</h4>
                      <p className="text-slate-500 leading-normal">Unit AC dikirimkan dalam 1-2 hari kerja. Teknisi kami akan ditugaskan dan menghubungi Anda 1 hari sebelum pengiriman untuk konfirmasi jadwal pemasangan di alamat Anda.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Lightbox Gallery Modal Overlay */}
      {isLightboxOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-fade-in">

          {/* Main Display Image */}
          <div className="relative max-w-4xl w-full flex items-center justify-center">
            
            {/* Nav Left */}
            {lightboxImages.length > 1 && (
              <button 
                type="button"
                onClick={() => setActiveLightboxImageIdx((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-4 bg-black/50 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all text-xl font-bold font-mono z-40 select-none"
              >
                &lt;
              </button>
            )}

            {/* Media Wrapper */}
            <div className="relative inline-block max-h-[70vh] max-w-full">
              {/* Close button */}
              <button 
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 -right-2 md:-right-10 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50"
                title="Tutup"
              >
                <X className="w-6 h-6" />
              </button>

              {isVideoUrl(lightboxImages[activeLightboxImageIdx]) ? (
                <video 
                  src={lightboxImages[activeLightboxImageIdx]} 
                  controls 
                  autoPlay 
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-white/10 shadow-2xl animate-fade-in"
                />
              ) : (
                <img 
                  src={lightboxImages[activeLightboxImageIdx]} 
                  alt={`Dokumentasi ${activeLightboxImageIdx + 1}`} 
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-white/10 shadow-2xl animate-fade-in" 
                />
              )}
            </div>

            {/* Nav Right */}
            {lightboxImages.length > 1 && (
              <button 
                type="button"
                onClick={() => setActiveLightboxImageIdx((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 sm:right-4 bg-black/50 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all text-xl font-bold font-mono z-40 select-none"
              >
                &gt;
              </button>
            )}
          </div>

          {/* Indicator text & thumbnails bar */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-white/60 text-xs font-bold font-space uppercase">
              Media {activeLightboxImageIdx + 1} dari {lightboxImages.length}
            </p>

            {lightboxImages.length > 1 && (
              <div className="flex justify-center gap-2 max-w-md overflow-x-auto px-4 py-2 bg-black/40 rounded-2xl backdrop-blur-sm border border-white/5">
                {lightboxImages.map((imgUrl, imgIdx) => (
                  <button
                    key={imgIdx}
                    type="button"
                    onClick={() => setActiveLightboxImageIdx(imgIdx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden transition-all shrink-0 border-2 ${
                      activeLightboxImageIdx === imgIdx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {isVideoUrl(imgUrl) ? (
                      <video src={imgUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Slide-over Cart Drawer */}
      <div className={`fixed inset-0 z-[120] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-label="Tutup Keranjang" onClick={() => setIsCartOpen(false)}></div>
        
        {/* Sliding Panel */}
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#0F3D5E]" />
              <h3 className="font-manrope font-black text-[#0F3D5E] text-base">Keranjang Belanja</h3>
            </div>
            <button 
              aria-label="Tutup Keranjang" onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl relative">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-manrope font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.spec}</p>
                    <div className="text-[11px] font-black text-[#0F3D5E] mt-1.5">
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                    
                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold px-2">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-500 hover:text-red-750 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-300" />
                <p className="font-extrabold font-manrope text-sm text-[#0F3D5E]">Keranjang Belanja Kosong</p>
                <p className="text-xs text-slate-400 max-w-xs">Silakan pilih produk dari katalog untuk menambahkannya ke keranjang Anda.</p>
                <button
                  onClick={() => { setIsCartOpen(false); setActiveTab('catalog'); }}
                  className="px-4 py-2 bg-[#0F3D5E] text-white font-bold text-xs rounded-lg hover:bg-[#082940]"
                >
                  Belanja Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Footer with summary and checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-150 bg-slate-50 text-left space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Subtotal ({cart.reduce((sum, i) => sum + i.qty, 0)} Item)</span>
                <span className="font-black text-sm text-[#0F3D5E] font-space">
                  Rp {cart.reduce((sum, i) => sum + i.price * i.qty, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                *Catatan: Harga di atas belum termasuk biaya pengiriman dan biaya jasa pemasangan standar (untuk unit AC).
              </p>
              
              <button
                onClick={handleCartCheckout}
                className="w-full py-3 bg-[#0F3D5E] hover:bg-[#082940] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Checkout Pesanan
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && activeTab === 'catalog' && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0C3254] text-white py-4 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row justify-between items-center gap-4 rounded-none border-t border-blue-900/50 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white relative rounded-none border border-white/15">
              <ShoppingCart className="w-5 h-5 text-[#8DC63F]" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#8DC63F] text-[#0C3254] font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-none shadow-sm">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-sm font-manrope">Anda memiliki produk dalam keranjang</p>
              <p className="text-slate-350 text-[11px]">Silakan klik tombol di samping untuk memproses pembelian unit/alat.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold font-space text-xs uppercase tracking-wider transition-colors rounded-none w-full sm:w-auto text-center"
            >
              Detail Keranjang
            </button>
            <button
              onClick={handleCartCheckout}
              className="px-8 py-3 bg-[#8DC63F] hover:bg-[#7db235] text-[#0C3254] font-black font-space text-xs uppercase tracking-wider transition-colors rounded-none shadow-md w-full sm:w-auto text-center"
            >
              Beli Sekarang &rsaquo;
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification for Adding to Cart */}
      {cartPopupItem && (
        <div className={`fixed ${cart.length > 0 && activeTab === 'catalog' ? 'bottom-24' : 'bottom-6'} right-6 z-[200] bg-slate-900 text-white py-3.5 px-5 shadow-2xl flex items-center gap-3 border-l-4 border-emerald-500 rounded-none text-xs font-semibold tracking-wide font-space transition-all duration-300`}>
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
          <div className="text-left">
            <span className="text-slate-400 block text-[8px] uppercase tracking-wider font-extrabold">Ditambahkan Ke Keranjang</span>
            <span className="font-bold text-white text-xs">{cartPopupItem}</span>
          </div>
          <button 
            onClick={() => setCartPopupItem(null)}
            className="ml-4 text-slate-400 hover:text-white transition-colors text-base font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* General Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] bg-[#0F3D5E] border-l-4 ${toast.type === 'error' ? 'border-[#DC2626]' : toast.type === 'info' ? 'border-[#2563EB]' : 'border-[#8DC63F]'} text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 max-w-sm animate-fade-in`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${toast.type === 'error' ? 'bg-[#DC2626]' : toast.type === 'info' ? 'bg-[#2563EB]' : 'bg-[#8DC63F]'}`}>
              {toast.type === 'error' ? '✕' : toast.type === 'info' ? 'i' : '✓'}
            </div>
            <div className="text-left">
              <p className="font-extrabold text-xs font-manrope">{toast.type === 'error' ? 'Gagal' : toast.type === 'info' ? 'Info' : 'Berhasil'}</p>
              <p className="text-[10px] text-blue-200">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:bg-white/10 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* B2C Floating Chatbot Widget */}
      <ChatbotWidget type="b2c" />
    </div>
  );
}

