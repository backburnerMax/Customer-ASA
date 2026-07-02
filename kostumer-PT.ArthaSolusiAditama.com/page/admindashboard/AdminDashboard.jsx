import { useState, useEffect } from 'react';
import logoImg from '../assets/LogoArtha.png';
import { 
  BarChart3, Users, FileText, Settings, LogOut, Clock, 
  Plus, Check, ChevronRight, RefreshCw, Package, 
  Wrench, Activity, Eye, X, Search, Filter, Calendar,
  TrendingUp, UserCheck, DollarSign, Sliders, Edit2, Trash2, ChevronDown
} from 'lucide-react';

export default function AdminDashboardStandalone() {
  // Standalone Navigation & Tab States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'b2b', 'b2c'
  const [b2bSubTab, setB2bSubTab] = useState('contracts'); // 'contracts', 'field-service', 'invoices'
  const [b2cSubTab, setB2cSubTab] = useState('ondemand'); // 'ondemand', 'b2c-catalog', 'b2c-cms', 'emergency'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Detail States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [selectedHistoryAsset, setSelectedHistoryAsset] = useState(null);

  // Standalone Mock B2B Contracts Data
  const [contractsData, setContractsData] = useState([
    {
      id: 'CON-88029',
      clientName: 'PT Mitra Sukses Abadi',
      pic: 'Rendy Kurniadi',
      email: 'r.kurniadi@mitrasukses.co.id',
      phone: '+62 812-3456-7890',
      status: 'Active',
      startDate: '12 Jan 2024',
      endDate: '12 Jan 2027',
      slaResponse: '15 Mins',
      slaResolution: '2 Hours',
      assetsCount: 3,
      tickets: [
        { id: 'TKT-902', type: 'Preventive Maintenance', unit: 'Chiller York Water Cooled - Main Hall', date: '25 Juni 2026', status: 'Scheduled', priority: 'Low', tech: '-' },
        { id: 'TKT-845', type: 'Troubleshooting AC Leakage', unit: 'Daikin VRV System - 4th Floor Office', date: '19 Juni 2026', status: 'In Progress', priority: 'High', tech: 'Supriadi & Team' },
        { id: 'TKT-712', type: 'Compressor Replacement', unit: 'Euroklimat Chiller - Production Line B', date: '12 Juni 2026', status: 'Completed', priority: 'High', tech: 'Ahmad & Budi' }
      ],
      assets: [
        { id: 'ASA-EQ-001', name: 'Chiller York Water Cooled', spec: 'YMC2-1200 - 350 TR', location: 'Main Utility Building Room A', lastServiced: '10 Mei 2026', status: 'Optimal' },
        { id: 'ASA-EQ-002', name: 'Daikin VRV IV System', spec: 'RXQ30AYM - 30 HP', location: 'Office Tower 4th Floor', lastServiced: '19 Juni 2026', status: 'Maintenance' },
        { id: 'ASA-EQ-003', name: 'Euroklimat Air Handling Unit', spec: 'EKAH-80 - 12000 CFM', location: 'Production Line B', lastServiced: '12 Juni 2026', status: 'Optimal' }
      ]
    },
    {
      id: 'CON-88104',
      clientName: 'PT Nusantara Citra Mandiri',
      pic: 'Bambang Wijaya',
      email: 'bambang.w@ncm.co.id',
      phone: '+62 811-9876-5432',
      status: 'Active',
      startDate: '01 Mar 2025',
      endDate: '01 Mar 2028',
      slaResponse: '30 Mins',
      slaResolution: '4 Hours',
      assetsCount: 2,
      tickets: [
        { id: 'TKT-899', type: 'AHU Filter Replacement', unit: 'McQuay AHU - Hall C', date: '24 Juni 2026', status: 'Completed', priority: 'Medium', tech: 'Roni' },
        { id: 'TKT-910', type: 'Freon Refilling', unit: 'Daikin Split Duct - Server Room', date: '26 Juni 2026', status: 'Open', priority: 'High', tech: '-' }
      ],
      assets: [
        { id: 'ASA-EQ-044', name: 'McQuay Air Handling Unit', spec: 'MQ-AHU-50', location: 'Hall C Utility', lastServiced: '24 Juni 2026', status: 'Optimal' },
        { id: 'ASA-EQ-045', name: 'Daikin Split Duct AC', spec: 'FDR250NY14', location: 'Main Server Room 1st Floor', lastServiced: '15 Mei 2026', status: 'Optimal' }
      ]
    }
  ]);

  // Standalone Mock B2C On-Demand Orders Data
  const [b2cOrders, setB2cOrders] = useState([
    {
      id: 'ORD-55029',
      clientName: 'Agus Hermawan',
      email: 'agus.hermawan@gmail.com',
      phone: '+62 813-8888-9999',
      address: 'Jl. Sudirman No. 12, Batam',
      unitName: 'York Premium Split AC 1.5 HP',
      spec: 'YWM15C3 - R410A - 12000 BTU',
      price: 4850000,
      qty: 1,
      date: '24 Juni 2026',
      statusStep: 3, // 1: Dipesan, 2: Pembayaran Diverifikasi, 3: Pengiriman Unit, 4: Pemasangan Selesai
      statusText: 'Unit dalam Pengiriman',
      deliveryMethod: 'Kurir',
      historyLogs: [
        { title: 'Order Dipesan', desc: 'Pesanan unit AC telah diterima sistem.', date: '24 Juni 2026 09:30' },
        { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran via Bank Transfer diverifikasi.', date: '24 Juni 2026 11:15' },
        { title: 'Unit Dispatched', desc: 'Unit dikirim menggunakan Logistik PT. ASA.', date: '25 Juni 2026 08:00' }
      ]
    },
    {
      id: 'ORD-77082',
      clientName: 'Siti Rahma',
      email: 'siti.rahma@yahoo.com',
      phone: '+62 856-7777-1234',
      address: 'Cluster Anggrek Blok B No. 4, Batam Center',
      unitName: 'Value Vacuum Pump 1/4 HP',
      spec: 'VE115N - Single Stage - 1.8 CFM',
      price: 1250000,
      qty: 1,
      date: '25 Juni 2026',
      statusStep: 2,
      statusText: 'Pembayaran Diverifikasi',
      deliveryMethod: 'Ambil Sendiri',
      historyLogs: [
        { title: 'Order Dipesan', desc: 'Pesanan tools telah diterima sistem.', date: '25 Juni 2026 10:00' },
        { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran via Bank Transfer diverifikasi.', date: '25 Juni 2026 12:30' }
      ]
    },
    {
      id: 'ORD-55099',
      clientName: 'Heru Prasetyo',
      email: 'heru.p@outlook.com',
      phone: '+62 821-2222-3333',
      address: 'Komp. Ruko Nagoya Hill Blok A No. 10',
      unitName: 'Daikin Lite Split AC 1 HP',
      spec: 'FTCQ25S - R32 - 9000 BTU',
      price: 3650000,
      qty: 2,
      date: '22 Juni 2026',
      statusStep: 4,
      statusText: 'Pemasangan Selesai',
      deliveryMethod: 'Kurir',
      historyLogs: [
        { title: 'Order Dipesan', desc: 'Pesanan unit AC telah diterima.', date: '22 Juni 2026 14:00' },
        { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran lunas terkonfirmasi.', date: '22 Juni 2026 14:30' },
        { title: 'Unit Dispatched', desc: 'Kurir logistik mengirimkan unit.', date: '23 Juni 2026 09:00' },
        { title: 'Pemasangan Selesai', desc: 'Teknisi PT. ASA selesai menginstalasi unit.', date: '23 Juni 2026 13:00' }
      ]
    }
  ]);

  // Standalone Mock Invoices Data (B2B + B2C)
  const [invoices, setInvoices] = useState([
    { id: 'INV/2026/ASA/095', client: 'PT Mitra Sukses Abadi', amount: 38000000, date: '15 Juni 2026', status: 'Unpaid', daysOverdue: 11, po: 'PO-88029-432' },
    { id: 'INV/2026/ASA/098', client: 'PT Mitra Sukses Abadi', amount: 6200000, date: '20 Juni 2026', status: 'Unpaid', daysOverdue: 6, po: 'PO-88029-445' },
    { id: 'INV/2026/ASA/089', client: 'PT Mitra Sukses Abadi', amount: 14250000, date: '24 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88029-411' },
    { id: 'INV/2026/ASA/074', client: 'PT Mitra Sukses Abadi', amount: 8500000, date: '10 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88029-389' },
    { id: 'INV/2026/ASA/101', client: 'PT Nusantara Citra Mandiri', amount: 5200000, date: '24 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88104-102' }
  ]);

  // Form Inputs States
  const [newAsset, setNewAsset] = useState({ clientIndex: 0, name: '', spec: '', location: '', status: 'Optimal' });
  const [newTicket, setNewTicket] = useState({ clientIndex: 0, type: '', unit: '', priority: 'Medium', status: 'Open' });

  // B2C Products Catalog state
  const [b2cProducts, setB2cProducts] = useState(() => {
    const saved = localStorage.getItem('b2c_products');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Split AC', category: 'Residential', price: 'IDR 4.000.000 - 12.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' },
      { id: 2, name: 'Cassette AC', category: 'Commercial', price: 'IDR 12.000.000 - 35.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80' },
      { id: 3, name: 'Floor Standing AC', category: 'Commercial', price: 'IDR 15.000.000 - 45.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1604754743422-f7569f658abe?auto=format&fit=crop&w=600&q=80' },
      { id: 4, name: 'Ceiling Concealed AC', category: 'Commercial', price: 'IDR 10.000.000 - 28.000.000', availability: 'Indent (2 Minggu)', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
      { id: 5, name: 'VRF/VRV Systems', category: 'Industrial', price: 'Custom Quote Only', availability: 'Consultation Required', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' },
      { id: 6, name: 'Commercial HVAC Equipment', category: 'Industrial', price: 'Custom Quote Only', availability: 'Consultation Required', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
      { id: 7, name: 'Accessories', category: 'Residential', price: 'IDR 250.000 - 5.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80' }
    ];
  });

  // B2C Banners state
  const [b2cBanners, setB2cBanners] = useState(() => {
    const saved = localStorage.getItem('marketing_banners');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Diskon Spesial Cuci AC Berkala',
        desc: 'Dapatkan diskon 20% untuk pembersihan AC tipe split di rumah atau kantor Anda. Hubungi kami sekarang!',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
        link: '#contact',
        active: true
      },
      {
        id: 2,
        title: 'Solusi Chiller Industri Efisien',
        desc: 'Layanan maintenance komprehensif untuk unit chiller York & Daikin Anda dengan respon cepat 24/7.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        link: '#services',
        active: true
      }
    ];
  });

  // B2C Catalog / CMS Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Residential', price: '', availability: 'Ready Stock', image: '', images: [], specDetails: '', features: '', inclusions: '' });
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({ title: '', desc: '', image: '', link: '', originalPrice: '', promoPrice: '', active: true });

  const handleSaveProduct = (e) => {
    e.preventDefault();
    let updated;
    try {
      if (editingProduct) {
        updated = b2cProducts.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
      } else {
        let nextId = 1;
        if (b2cProducts && b2cProducts.length > 0) {
          const ids = b2cProducts.map(p => {
            const num = parseInt(p.id);
            return isNaN(num) ? 0 : num;
          });
          nextId = Math.max(...ids, 0) + 1;
        }
        updated = [...b2cProducts, { id: nextId, ...productForm }];
      }
      setB2cProducts(updated);
      localStorage.setItem('b2c_products', JSON.stringify(updated));
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Residential', price: '', availability: 'Ready Stock', image: '', images: [], specDetails: '', features: '', inclusions: '' });
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('exceeded')) {
        // Automatic Quota Recovery: Prune legacy oversized images (>150KB) to free up space
        const pruned = updated.map(p => {
          const hasOversizedMain = p.image && p.image.length > 150000;
          const prunedImages = p.images ? p.images.filter(img => img && img.length <= 150000) : [];
          
          return {
            ...p,
            image: hasOversizedMain 
              ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' 
              : p.image,
            images: prunedImages
          };
        });
        
        try {
          localStorage.setItem('b2c_products', JSON.stringify(pruned));
          setB2cProducts(pruned);
          setShowProductModal(false);
          setEditingProduct(null);
          setProductForm({ name: '', category: 'Residential', price: '', availability: 'Ready Stock', image: '', images: [], specDetails: '', features: '', inclusions: '' });
          alert("Penyimpanan browser penuh. Sistem telah otomatis membersihkan gambar lama yang terlalu besar. Produk baru Anda berhasil disimpan!");
          return;
        } catch (retryErr) {
          console.error("Gagal melakukan pemulihan kuota otomatis:", retryErr);
        }
      }
      console.error("Gagal menyimpan produk:", err);
      alert("Terjadi kesalahan saat menyimpan produk: " + err.message);
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      availability: product.availability,
      image: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      specDetails: product.specDetails || '',
      features: product.features || '',
      inclusions: product.inclusions || ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      const updated = b2cProducts.filter(p => p.id !== id);
      setB2cProducts(updated);
      localStorage.setItem('b2c_products', JSON.stringify(updated));
    }
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    let updated;
    if (editingBanner) {
      updated = b2cBanners.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b);
    } else {
      const nextId = b2cBanners.length > 0 ? Math.max(...b2cBanners.map(b => b.id)) + 1 : 1;
      updated = [...b2cBanners, { id: nextId, ...bannerForm }];
    }
    setB2cBanners(updated);
    localStorage.setItem('marketing_banners', JSON.stringify(updated));
    setShowBannerModal(false);
    setEditingBanner(null);
    setBannerForm({ title: '', desc: '', image: '', link: '', originalPrice: '', promoPrice: '', active: true });
  };

  const handleEditBannerClick = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      desc: banner.desc,
      image: banner.image,
      link: banner.link,
      originalPrice: banner.originalPrice || '',
      promoPrice: banner.promoPrice || '',
      active: banner.active
    });
    setShowBannerModal(true);
  };

  const handleToggleBannerActive = (id) => {
    const updated = b2cBanners.map(b => b.id === id ? { ...b, active: !b.active } : b);
    setB2cBanners(updated);
    localStorage.setItem('marketing_banners', JSON.stringify(updated));
  };

  const handleDeleteBanner = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
      const updated = b2cBanners.filter(b => b.id !== id);
      setB2cBanners(updated);
      localStorage.setItem('marketing_banners', JSON.stringify(updated));
    }
  };


  // ─── NEW B2B STATES ───
  const [contractSubTab, setContractSubTab] = useState('list'); // 'list', 'register', 'assign', 'assets'
  
  // Register Contract Form State
  const [newContractForm, setNewContractForm] = useState({
    clientName: '',
    pic: '',
    email: '',
    phone: '',
    startDate: '2026-07-01',
    endDate: '2029-07-01',
    slaResponse: '15 Mins',
    slaResolution: '2 Hours',
    contractPdfName: ''
  });

  // Client Assignment State (PO Catalog, Credit Limit, TOP)
  const [clientAssignments, setClientAssignments] = useState([
    { clientId: 'CON-88029', poCatalog: 'Katalog B2B York/Daikin Utama', creditLimit: 250000000, topDays: 45 },
    { clientId: 'CON-88104', poCatalog: 'Katalog B2B Umum', creditLimit: 100000000, topDays: 30 }
  ]);
  const [assignForm, setAssignForm] = useState({
    clientId: 'CON-88029',
    poCatalog: 'Katalog B2B York/Daikin Utama',
    creditLimit: 150000000,
    topDays: 30
  });

  // ─── NEW FIELD SERVICE STATES ───
  const [fieldServiceSubTab, setFieldServiceSubTab] = useState('calendar'); // 'calendar', 'reports'
  
  // Custom Calendar Events
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'EV-1', date: '2026-06-25', client: 'PT Mitra Sukses Abadi', type: 'Preventive Maintenance', unit: 'Chiller York - Main Hall', tech: 'Supriadi & Team', status: 'Scheduled' },
    { id: 'EV-2', date: '2026-06-19', client: 'PT Mitra Sukses Abadi', type: 'Repair', unit: 'Daikin VRV - 4th Floor', tech: 'Ahmad & Budi', status: 'In Progress' },
    { id: 'EV-3', date: '2026-06-24', client: 'PT Nusantara Citra Mandiri', type: 'Installation', unit: 'McQuay AHU - Hall C', tech: 'Roni', status: 'Completed' },
    { id: 'EV-4', date: '2026-06-26', client: 'PT Nusantara Citra Mandiri', type: 'Preventive Maintenance', unit: 'Daikin Split Duct - Server Room', tech: 'Supriadi', status: 'Scheduled' }
  ]);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-06-30');
  const [dispatchForm, setDispatchForm] = useState({
    clientId: 'CON-88029',
    type: 'Preventive Maintenance',
    unit: 'Chiller York Water Cooled',
    tech: 'Supriadi & Team'
  });

  // Daily Reports State
  const [dailyReports, setDailyReports] = useState([
    {
      id: 'REP-001',
      date: '2026-06-29',
      client: 'PT Mitra Sukses Abadi',
      tech: 'Supriadi & Team',
      taskType: 'Preventive Maintenance',
      unit: 'Chiller York Water Cooled - Main Hall',
      checklist: [
        { label: 'Cek Tekanan Freon (High & Low)', done: true },
        { label: 'Pembersihan Evaporator & Kondensor', done: true },
        { label: 'Pemeriksaan Arus Listrik Kompresor', done: true },
        { label: 'Kalibrasi Sensor Suhu', done: true }
      ],
      partsUsed: 'Oli Chiller York Oil15 (5 Liter)',
      notes: 'Tekanan chiller stabil, oli kompresor telah ditambah. Unit beroperasi normal.',
      status: 'Pending', // 'Pending', 'Approved', 'Revised'
      photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      signature: 'Rendy Kurniadi'
    },
    {
      id: 'REP-002',
      date: '2026-06-28',
      client: 'PT Nusantara Citra Mandiri',
      tech: 'Roni',
      taskType: 'Repair',
      unit: 'Daikin Split Duct - Server Room',
      checklist: [
        { label: 'Deteksi Kebocoran Pipa Tembaga', done: true },
        { label: 'Pengelasan Kebocoran Pipa', done: true },
        { label: 'Pengisian Ulang Freon R32', done: true }
      ],
      partsUsed: 'Freon R32 (2.5 kg), Pipa Tembaga 3/8 (1 meter)',
      notes: 'Kebocoran pada sambungan flare nut indoor telah diperbaiki dan diisi freon penuh.',
      status: 'Approved',
      photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      signature: 'Bambang Wijaya'
    }
  ]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // ─── BACKEND INTEGRATION POINT: LOAD INITIAL DATA FROM DATABASE ───
  /*
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [contractsRes, ordersRes, invoicesRes, reportsRes, eventsRes, bannersRes] = await Promise.all([
          fetch('/api/b2b/contracts'),
          fetch('/api/b2c/orders'),
          fetch('/api/invoices'),
          fetch('/api/reports/daily'),
          fetch('/api/calendar/events'),
          fetch('/api/marketing/banners')
        ]);
        
        setContractsData(await contractsRes.json());
        setB2cOrders(await ordersRes.json());
        setInvoices(await invoicesRes.json());
        setDailyReports(await reportsRes.json());
        setCalendarEvents(await eventsRes.json());
        setBanners(await bannersRes.json());
      } catch (err) {
        console.error("Gagal memuat data dashboard dari server backend:", err);
      }
    };
    loadDashboardData();
  }, []);
  */

  // ─── NEW EMERGENCY STATES ───
  const [emergencySubTab, setEmergencySubTab] = useState('alarm'); // 'alarm', 'do'
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  
  // Emergency DOs
  const [emergencyDos, setEmergencyDos] = useState([
    {
      id: 'EDO-2026-001',
      date: '2026-06-28',
      clientName: 'PT Mitra Sukses Abadi',
      emergencyType: 'Kebocoran Chiller Utama (Kritis)',
      actionTaken: 'Penggantian Seal Valve & Flushing Sistem',
      partsDispatched: 'Seal Gasket 4 Inch (2 Pcs), Chemical Flush (5 Liter)',
      baseFee: 1500000,
      partsCost: 850000,
      totalCost: 2350000,
      status: 'Dispatched'
    }
  ]);
  const [showDoModal, setShowDoModal] = useState(false);
  const [selectedDo, setSelectedDo] = useState(null);
  const [newEmergencyDo, setNewEmergencyDo] = useState({
    clientId: 'CON-88029',
    emergencyType: 'Kebocoran Chiller Utama (Kritis)',
    actionTaken: '',
    partsDispatched: '',
    baseFee: 1500000,
    partsCost: 0
  });

  // ─── B2C LOGISTICS & INVOICE PRINT STATES ───
  const [showB2cPrintModal, setShowB2cPrintModal] = useState(false);
  const [selectedB2cPrintOrder, setSelectedB2cPrintOrder] = useState(null);
  const [b2cTrackingForm, setB2cTrackingForm] = useState({
    courier: 'ASA Logistics',
    trackingNo: ''
  });

  // B2B Handlers
  const handleSaveContract = (e) => {
    e.preventDefault();
    const newId = `CON-${Math.floor(88000 + Math.random() * 999)}`;
    const contract = {
      id: newId,
      clientName: newContractForm.clientName,
      pic: newContractForm.pic,
      email: newContractForm.email,
      phone: newContractForm.phone,
      status: 'Active',
      startDate: newContractForm.startDate,
      endDate: newContractForm.endDate,
      slaResponse: newContractForm.slaResponse,
      slaResolution: newContractForm.slaResolution,
      assetsCount: 0,
      tickets: [],
      assets: []
    };

    // ─── BACKEND INTEGRATION POINT: POST NEW CONTRACT TO DATABASE ───
    /*
    fetch('/api/b2b/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract)
    })
    .then(res => res.json())
    .then(savedContract => {
      setContractsData([...contractsData, savedContract]);
    })
    .catch(err => console.error("Gagal menyimpan kontrak ke backend:", err));
    */

    setContractsData([...contractsData, contract]);
    setNewContractForm({
      clientName: '',
      pic: '',
      email: '',
      phone: '',
      startDate: '2026-07-01',
      endDate: '2029-07-01',
      slaResponse: '15 Mins',
      slaResolution: '2 Hours',
      contractPdfName: ''
    });
    setContractSubTab('list');
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    const exists = clientAssignments.some(a => a.clientId === assignForm.clientId);
    let updated;
    if (exists) {
      updated = clientAssignments.map(a => a.clientId === assignForm.clientId ? { ...a, ...assignForm } : a);
    } else {
      updated = [...clientAssignments, { ...assignForm }];
    }

    // ─── BACKEND INTEGRATION POINT: POST CLIENT ALLOCATION TO DATABASE ───
    /*
    fetch(`/api/b2b/contracts/${assignForm.clientId}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignForm)
    })
    .then(res => {
      if (res.ok) alert("Data kontrak berhasil disimpan di server.");
    })
    .catch(err => console.error("Gagal mengalokasikan data klien ke backend:", err));
    */

    setClientAssignments(updated);
    alert("Data kontrak & katalog khusus PO berhasil dialokasikan ke klien!");
  };

  // Field Service Handlers
  const handleCreateDispatch = (e) => {
    e.preventDefault();
    const client = contractsData.find(c => c.id === dispatchForm.clientId);
    const newEvent = {
      id: `EV-${Math.floor(100 + Math.random() * 900)}`,
      date: selectedDate,
      client: client ? client.clientName : 'Klien B2B',
      type: dispatchForm.type,
      unit: dispatchForm.unit,
      tech: dispatchForm.tech,
      status: 'Scheduled'
    };

    // ─── BACKEND INTEGRATION POINT: POST NEW DISPATCH EVENT TO DATABASE ───
    /*
    fetch('/api/calendar/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
    .then(res => res.json())
    .then(savedEvent => {
      setCalendarEvents([...calendarEvents, savedEvent]);
    })
    .catch(err => console.error("Gagal menjadwalkan tugas ke backend:", err));
    */

    setCalendarEvents([...calendarEvents, newEvent]);
    setShowDispatchModal(false);
  };

  const handleUpdateDispatch = (e) => {
    e.preventDefault();
    setCalendarEvents(calendarEvents.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
    setEditingEvent(null);
    alert("Jadwal tugas teknisi berhasil diperbarui!");
  };

  const handleDeleteDispatch = (id) => {
    if (confirm("Apakah Anda yakin ingin membatalkan/menghapus jadwal tugas ini?")) {
      setCalendarEvents(calendarEvents.filter(ev => ev.id !== id));
      setEditingEvent(null);
    }
  };

  const handleApproveReport = (reportId) => {
    setDailyReports(dailyReports.map(rep => rep.id === reportId ? { ...rep, status: 'Approved' } : rep));
    setSelectedReport(null);
    alert("Laporan Harian Teknisi Berhasil Disetujui!");
  };

  const handleReviseReport = (e) => {
    e.preventDefault();
    setDailyReports(dailyReports.map(rep => rep.id === selectedReport.id ? { ...rep, status: 'Revised', notes: `REVISI ADMIN: ${revisionNotes}` } : rep));
    setSelectedReport(null);
    setRevisionNotes('');
    alert("Permintaan Revisi Telah Dikirim ke Teknisi.");
  };

  // Emergency Center Siren Sound Generator (Web Audio API)
  const playSirenSound = () => {
    if (window.emergencySiren) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      
      // Infinite siren oscillation
      let isHigh = false;
      const interval = setInterval(() => {
        if (!window.emergencySiren) {
          clearInterval(interval);
          return;
        }
        const freq = isHigh ? 500 : 900;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        isHigh = !isHigh;
      }, 500);
      
      osc.start();
      window.emergencySiren = { osc, audioCtx, interval };
    } catch (e) {
      console.error("Web Audio API not supported or blocked", e);
    }
  };

  const stopSirenSound = () => {
    if (window.emergencySiren) {
      try {
        clearInterval(window.emergencySiren.interval);
        window.emergencySiren.osc.stop();
        window.emergencySiren.audioCtx.close();
      } catch (e) {}
      window.emergencySiren = null;
    }
  };

  const triggerEmergency = () => {
    setIsEmergencyActive(true);
    setEmergencyAlert({
      time: new Date().toLocaleTimeString(),
      client: 'PT Mitra Sukses Abadi',
      location: 'Main Utility Building - Lantai B1',
      issue: '🚨 HIGH PRESSURE ALERT: Chiller York mengalami lonjakan tekanan freon kritis!',
      triggerSource: 'Chatbot Telegram (N8N Automation)'
    });
    playSirenSound();
  };

  const deactivateEmergency = () => {
    setIsEmergencyActive(false);
    setEmergencyAlert(null);
    stopSirenSound();
    localStorage.setItem('emergency_trigger', JSON.stringify({ active: false }));
  };

  const handleSaveEmergencyDo = (e) => {
    e.preventDefault();
    const client = contractsData.find(c => c.id === newEmergencyDo.clientId);
    const total = Number(newEmergencyDo.baseFee) + Number(newEmergencyDo.partsCost);
    const newDo = {
      id: `EDO-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      clientName: client ? client.clientName : 'Klien B2B',
      emergencyType: newEmergencyDo.emergencyType,
      actionTaken: newEmergencyDo.actionTaken,
      partsDispatched: newEmergencyDo.partsDispatched,
      baseFee: Number(newEmergencyDo.baseFee),
      partsCost: Number(newEmergencyDo.partsCost),
      totalCost: total,
      status: 'Dispatched'
    };
    setEmergencyDos([...emergencyDos, newDo]);
    setShowDoModal(false);
    setNewEmergencyDo({
      clientId: 'CON-88029',
      emergencyType: 'Kebocoran Chiller Utama (Kritis)',
      actionTaken: '',
      partsDispatched: '',
      baseFee: 1500000,
      partsCost: 0
    });
  };

  // Helper to resize and compress uploaded images to prevent localStorage quota limits
  const resizeAndCompressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Define maximum dimensions (400px is perfect for product cards and fits in <15KB)
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as compressed JPEG (extremely small size, 100% clean background)
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper to format price input with Rupiah prefix and thousand separators (works for ranges too)
  const formatPriceInput = (value) => {
    const clean = value.replace(/Rp\s?/g, '').replace(/\./g, '');
    const formatted = clean.replace(/\d+/g, (match) => {
      return new Intl.NumberFormat('id-ID').format(parseInt(match));
    });
    return formatted ? `Rp ${formatted}` : '';
  };

  // B2C Logistics Resi Submission
  const handleSaveTracking = (orderId) => {
    if (!b2cTrackingForm.trackingNo) return;
    const timeStr = new Date().toLocaleString('id-ID');
    const updated = b2cOrders.map(ord => {
      if (ord.id === orderId) {
        const newLog = {
          title: `Driver Kantor Dispatched`,
          desc: `Unit sedang dikirim oleh driver internal Kantor. Info Driver: ${b2cTrackingForm.trackingNo}`,
          date: timeStr
        };
        return {
          ...ord,
          statusStep: 3,
          statusText: `Dalam Pengiriman oleh Driver Kantor (${b2cTrackingForm.trackingNo})`,
          historyLogs: [newLog, ...(ord.historyLogs || [])]
        };
      }
      return ord;
    });
    setB2cOrders(updated);
    setB2cTrackingForm({ courier: 'ASA Logistics', trackingNo: '' });
    alert("Informasi pengiriman driver kantor berhasil disimpan!");
  };

  // Update logic handlers (strictly local component state)
  const handleUpdateTicketStatus = (clientId, ticketId, newStatus) => {
    const updated = contractsData.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          tickets: client.tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
        };
      }
      return client;
    });
    setContractsData(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleVerifyInvoicePayment = (invId) => {
    setInvoices(invoices.map(inv => inv.id === invId ? { ...inv, status: 'Paid', daysOverdue: 0 } : inv));
  };

  // ─── SIMULASI WEBHOOK PAYMENT GATEWAY (AUTO-LUNAS VIA BACKEND) ───
  const [simulationLog, setSimulationLog] = useState(null);

  const handleSimulateWebhook = (invId) => {
    setSimulationLog({ id: invId, step: 1, text: "🕒 1. Kustomer menyelesaikan pembayaran di halaman checkout (Midtrans / Xendit)..." });
    
    setTimeout(() => {
      setSimulationLog({ id: invId, step: 2, text: "🔌 2. Payment Gateway mengirimkan Webhook POST (Notification) ke Backend API Anda..." });
    }, 1500);

    setTimeout(() => {
      setSimulationLog({ id: invId, step: 3, text: "💾 3. Backend Anda memverifikasi signature hash, lalu memperbarui status invoice menjadi 'Paid' di Database..." });
    }, 3000);

    setTimeout(() => {
      // Update state secara otomatis (mensimulasikan push data real-time via WebSocket)
      setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: 'Paid', daysOverdue: 0 } : inv));
      setSimulationLog({ id: invId, step: 4, text: "✅ 4. Backend memancarkan event WebSocket. Dashboard mendeteksi pembayaran lunas & ter-update otomatis!" });
    }, 4500);

    setTimeout(() => {
      setSimulationLog(null);
    }, 7500);
  };

  // Listen for B2B Chatbot Emergency Alarm triggers in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'emergency_trigger') {
        try {
          const trigger = JSON.parse(e.newValue);
          if (trigger && trigger.active) {
            setIsEmergencyActive(true);
            setEmergencyAlert({
              time: trigger.time,
              client: trigger.client || 'PT Mitra Sukses Abadi',
              location: trigger.location || 'Main Compressor Room',
              issue: trigger.issue || '🚨 TOMBOL DARURAT TRIGGERED DARI CHATBOT!',
              triggerSource: 'Chatbot Kustomer B2B'
            });
            playSirenSound();
          } else if (trigger && !trigger.active) {
            setIsEmergencyActive(false);
            setEmergencyAlert(null);
            stopSirenSound();
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll localStorage every 1.5 seconds for same-tab updates
    const interval = setInterval(() => {
      const raw = localStorage.getItem('emergency_trigger');
      if (raw) {
        try {
          const trigger = JSON.parse(raw);
          if (trigger && trigger.active && !isEmergencyActive) {
            setIsEmergencyActive(true);
            setEmergencyAlert({
              time: trigger.time,
              client: trigger.client || 'PT Mitra Sukses Abadi',
              location: trigger.location || 'Main Compressor Room',
              issue: trigger.issue || '🚨 TOMBOL DARURAT TRIGGERED DARI CHATBOT!',
              triggerSource: 'Chatbot Kustomer B2B'
            });
            playSirenSound();
          } else if (trigger && !trigger.active && isEmergencyActive) {
            setIsEmergencyActive(false);
            setEmergencyAlert(null);
            stopSirenSound();
          }
        } catch (err) {}
      }
    }, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isEmergencyActive]);

  /* 
  // ─── TEMPLATE INTEGRASI BACKEND REAL-TIME (WEBHOOK & WEBSOCKET) ───
  // Developer Backend bisa mengaktifkan kode di bawah ini:
  
  // import { io } from 'socket.io-client';

  // useEffect(() => {
  //   // 1. Ambil data invoice dari database Backend saat pertama kali load
  //   const fetchInvoices = async () => {
  //     try {
  //       const response = await fetch('/api/invoices');
  //       const data = await response.json();
  //       setInvoices(data);
  //     } catch (error) {
  //       console.error("Gagal mengambil data invoice:", error);
  //     }
  //   };
  //   fetchInvoices();

  //   // 2. Hubungkan ke WebSocket Server Backend untuk update otomatis secara Real-Time
  //   const socket = io('http://localhost:5000'); // Ganti dengan URL server backend Anda
  //   
  //   socket.on('invoice_updated', (updatedInvoice) => {
  //     // Update state secara instan tanpa perlu refresh halaman
  //     setInvoices(prevInvoices => 
  //       prevInvoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
  //     );
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  */

  const handleUpdateOrderStep = (orderId, step) => {
    const order = b2cOrders.find(o => o.id === orderId);
    const isPickup = order?.deliveryMethod === 'Ambil Sendiri';

    const stepsTextMap = {
      1: 'Order Dipesan & Menunggu Pembayaran',
      2: 'Pembayaran Diverifikasi & Persiapan',
      3: isPickup ? 'Barang Siap Diambil di Gudang' : 'Unit dalam Pengiriman Logistik',
      4: isPickup ? 'Barang Telah Diambil (Selesai)' : 'Pekerjaan / Pemasangan Selesai'
    };

    const updated = b2cOrders.map(ord => {
      if (ord.id === orderId) {
        const now = new Date();
        const timeStr = `${now.getDate()} Juni 2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newLog = {
          title: stepsTextMap[step],
          desc: isPickup && step === 4 
            ? `Serah terima barang selesai. Kustomer mengambil unit secara mandiri.` 
            : `Tahap pengerjaan diperbarui oleh admin ke langkah ${step}.`,
          date: timeStr
        };
        return { 
          ...ord, 
          statusStep: step,
          statusText: stepsTextMap[step],
          historyLogs: [newLog, ...(ord.historyLogs || [])]
        };
      }
      return ord;
    });
    setB2cOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = updated.find(o => o.id === orderId);
      setSelectedOrder(updatedOrder);
    }
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    const client = contractsData[newAsset.clientIndex];
    const assetItem = {
      id: `ASA-EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: newAsset.name,
      spec: newAsset.spec,
      location: newAsset.location || 'Gedung Klien',
      lastServiced: '-',
      status: newAsset.status
    };

    const updated = contractsData.map((c, idx) => {
      if (idx === Number(newAsset.clientIndex)) {
        return {
          ...c,
          assets: [...c.assets, assetItem],
          assetsCount: c.assetsCount + 1
        };
      }
      return c;
    });

    setContractsData(updated);
    setShowAddAssetModal(false);
    setNewAsset({ clientIndex: 0, name: '', spec: '', location: '', status: 'Optimal' });
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    const client = contractsData[newTicket.clientIndex];
    const now = new Date();
    const ticketItem = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      type: newTicket.type,
      unit: newTicket.unit,
      date: '26 Juni 2026',
      status: newTicket.status,
      priority: newTicket.priority,
      tech: '-'
    };

    const updated = contractsData.map((c, idx) => {
      if (idx === Number(newTicket.clientIndex)) {
        return {
          ...c,
          tickets: [ticketItem, ...c.tickets]
        };
      }
      return c;
    });

    setContractsData(updated);
    setShowAddTicketModal(false);
    setNewTicket({ clientIndex: 0, type: '', unit: '', priority: 'Medium', status: 'Open' });
  };

  // Math Computations
  const totalB2BRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalB2CRevenue = b2cOrders
    .reduce((sum, ord) => sum + (ord.price * ord.qty), 0);

  const totalRevenue = totalB2BRevenue + totalB2CRevenue;

  const totalContractsCount = contractsData.length;
  
  const allB2BTickets = contractsData.reduce((all, client) => {
    return [...all, ...client.tickets.map(t => ({ ...t, clientName: client.clientName, clientId: client.id }))];
  }, []);

  const pendingTicketsCount = allB2BTickets.filter(t => t.status !== 'Completed').length;
  const pendingOrdersCount = b2cOrders.filter(o => o.statusStep < 4).length;
  const unpaidInvoicesCount = invoices.filter(i => i.status === 'Unpaid').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 flex flex-col md:flex-row">
      
      {/* ─── SIDEBAR ─── */}
      <div className="w-full md:w-64 bg-[#0F3D5E] text-white p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                <img src={logoImg} alt="Artha Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-[#2563EB] block">Admin Portal</span>
                <span className="text-sm font-black font-manrope">PT. Artha Solusi Aditama</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5 text-slate-300">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Ringkasan Utama
            </button>
            <button 
              onClick={() => {
                setActiveTab('b2b');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'b2b' ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              B2B Layanan Kontrak
            </button>
            <button 
              onClick={() => {
                setActiveTab('b2c');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'b2c' ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              B2C Retail & Jasa
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/15 space-y-4">
          <div className="text-[11px] text-slate-350">
            <span className="block font-medium">Logged in as:</span>
            <strong className="block text-white font-extrabold mt-0.5">Bapak Ahmad Fauzi (General Manager)</strong>
          </div>
          
          <a 
            href="/"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-350 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar Dashboard
          </a>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold font-manrope text-[#0C3254]">Panel Administrator</h1>
            <p className="text-slate-400 text-xs mt-1">Dashboard frontend mandiri untuk mengelola kontrak B2B, perbaikan HVAC, dan pemesanan non-kontrak.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => {
                setActiveTab('overview');
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0C3254] font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Tampilan
            </button>
            <button 
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin mereset seluruh data simulasi? Semua gambar, produk kustom, kontrak, dan log yang tersimpan di browser akan dikosongkan ke pengaturan awal.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Reset Data Simulasi
            </button>
          </div>
        </div>

        {/* Sub-Navigation for B2B */}
        {activeTab === 'b2b' && (
          <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400 shadow-sm animate-fade-in">
            <button 
              onClick={() => setB2bSubTab('contracts')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all ${
                b2bSubTab === 'contracts' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              B2B Kontrak Gedung
            </button>
            <button 
              onClick={() => setB2bSubTab('field-service')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all ${
                b2bSubTab === 'field-service' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Operasional & Teknisi
            </button>
            <button 
              onClick={() => setB2bSubTab('invoices')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all ${
                b2bSubTab === 'invoices' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Faktur & Pembayaran
            </button>
          </div>
        )}

        {/* Sub-Navigation for B2C */}
        {activeTab === 'b2c' && (
          <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400 shadow-sm overflow-x-auto animate-fade-in">
            <button 
              onClick={() => setB2cSubTab('ondemand')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap ${
                b2cSubTab === 'ondemand' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              B2C Pesanan & Jasa
            </button>
            <button 
              onClick={() => setB2cSubTab('b2c-catalog')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap ${
                b2cSubTab === 'b2c-catalog' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Katalog Produk B2C
            </button>
            <button 
              onClick={() => setB2cSubTab('b2c-cms')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap ${
                b2cSubTab === 'b2c-cms' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              CMS & Banner Promo
            </button>
            <button 
              onClick={() => setB2cSubTab('emergency')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap ${
                b2cSubTab === 'emergency' 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Tanggap Darurat
            </button>
          </div>
        )}

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* KPI statistics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Total Pendapatan</span>
                  <h4 className="text-lg font-black font-manrope text-[#0F3D5E]">Rp {totalRevenue.toLocaleString('id-ID')}</h4>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Antrean Tiket B2B</span>
                  <h4 className="text-lg font-black font-manrope text-[#0F3D5E]">{pendingTicketsCount} Tiket Aktif</h4>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Pesanan B2C Aktif</span>
                  <h4 className="text-lg font-black font-manrope text-[#0F3D5E]">{pendingOrdersCount} Pekerjaan</h4>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Invoice Overdue</span>
                  <h4 className="text-lg font-black font-manrope text-[#0F3D5E]">{unpaidInvoicesCount} Dokumen</h4>
                </div>
              </div>
            </div>

            {/* Quick Analytics & Charts layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Analytics Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0C3254]">Rasio Jenis Penjualan</h3>
                  <p className="text-[11px] text-slate-400">Distribusi pendapatan B2B Kontrak Gedung vs B2C On-Demand.</p>
                </div>
                
                {/* SVG mock donut chart */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EFF6FF" strokeWidth="12" />
                    {/* B2B Segment (65%) */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0F3D5E" strokeWidth="12" 
                      strokeDasharray="163.3 251.2" strokeDashoffset="0" />
                    {/* B2C Segment (35%) */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" strokeWidth="12" 
                      strokeDasharray="87.9 251.2" strokeDashoffset="-163.3" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[10px] text-slate-450 block font-bold font-space uppercase">Rasio B2B</span>
                    <strong className="text-lg font-black font-manrope text-[#0F3D5E]">65%</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
                  <div className="border-l-4 border-[#0F3D5E] pl-2">
                    <span className="text-slate-400 block text-[10px]">Kontrak B2B</span>
                    <span className="text-[#0F3D5E] font-extrabold">Rp {totalB2BRevenue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-l-4 border-[#2563EB] pl-2">
                    <span className="text-slate-400 block text-[10px]">On-Demand B2C</span>
                    <span className="text-[#0F3D5E] font-extrabold">Rp {totalB2CRevenue.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* B2B Contract Tickets Queue list */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0C3254]">Antrean Layanan Kritis (B2B Kontrak)</h3>
                    <p className="text-[11px] text-slate-400">Jadwal PM dan penanganan kerusakan HVAC klien kontrak.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('b2b');
                      setB2bSubTab('contracts');
                    }}
                    className="text-[10px] font-bold text-[#2563EB] hover:text-[#0F3D5E] transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    Selengkapnya
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[260px] pr-2">
                  {allB2BTickets.slice(0, 4).map(ticket => (
                    <div key={ticket.id} className="py-3 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-[#0F3D5E] text-[11px] block">{ticket.id} — {ticket.clientName}</span>
                        <strong className="block text-slate-700 text-xs font-extrabold mt-0.5 truncate">{ticket.type}</strong>
                        <span className="text-[10px] text-slate-400">{ticket.unit}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black font-space uppercase block text-center mb-1.5 ${
                          ticket.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100/50' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 text-[8px] font-black font-space rounded uppercase tracking-wider ${
              ticket.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ─── TAB 2: B2B CONTRACT PORTAL ─── */}
        {activeTab === 'b2b' && b2bSubTab === 'contracts' && (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* Sub Tabs Navigation */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50 backdrop-blur-xs">
              {[
                { id: 'list', label: 'Daftar Kontrak' },
                { id: 'assets', label: 'Kategori & Inventaris Aset' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setContractSubTab(sub.id)}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
                    contractSubTab === sub.id
                      ? 'bg-white text-[#0F3D5E] shadow-sm'
                      : 'text-slate-555 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUB TAB 1: LIST CONTRACTS */}
            {contractSubTab === 'list' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Cari klien, PIC..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowAddTicketModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white font-bold text-xs rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Buat Tiket Layanan B2B
                    </button>
                  </div>
                </div>

                {contractsData
                  .filter(client => client.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(client => {
                    const assignment = clientAssignments.find(a => a.clientId === client.id);
                    return (
                      <div key={client.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-sm font-extrabold text-[#0C3254]">{client.clientName}</h2>
                              <span className="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide bg-blue-100 text-blue-800">
                                {client.id}
                              </span>
                              <span className="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide bg-emerald-100 text-emerald-800">
                                Kontrak Aktif
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-450 mt-1">
                              PIC: <strong className="text-slate-600">{client.pic}</strong> | {client.phone} | {client.email}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="text-[9px] text-slate-400 block font-semibold">Masa Berlaku Kontrak</span>
                            <strong className="text-xs text-[#0F3D5E] font-bold">{client.startDate} - {client.endDate}</strong>
                          </div>
                        </div>

                        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Spesifikasi Layanan Kontrak (SLA)</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                <span className="text-[9px] text-slate-400 block">SLA Respon</span>
                                <strong className="text-xs text-[#0F3D5E] font-bold">{client.slaResponse}</strong>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                <span className="text-[9px] text-slate-400 block">SLA Resolusi</span>
                                <strong className="text-xs text-[#0F3D5E] font-bold">{client.slaResolution}</strong>
                              </div>
                            </div>
                            {assignment && (
                              <div className="bg-[#2563EB]/10 p-3 rounded-xl border border-[#2563EB]/20 grid grid-cols-2 gap-3 mt-2">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Katalog khusus PO</span>
                                  <strong className="text-[10px] text-[#0F3D5E] font-bold truncate block">{assignment.poCatalog}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Limit Kredit & TOP</span>
                                  <strong className="text-[10px] text-[#0F3D5E] font-bold block">Rp {assignment.creditLimit.toLocaleString('id-ID')} ({assignment.topDays} Hari)</strong>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Inventaris Aset Unit Terdaftar ({client.assets ? client.assets.length : 0})</h4>
                            <div className="space-y-2">
                              {client.assets && client.assets.length > 0 ? (
                                client.assets.map(asset => (
                                  <div key={asset.id} className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-150 transition-colors">
                                    <div>
                                      <strong className="text-[11px] text-slate-700 font-bold block">{asset.name}</strong>
                                      <span className="text-[9px] text-slate-400 block">{asset.spec} | {asset.location}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${
                                      asset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {asset.status}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">Belum ada aset terdaftar untuk perusahaan ini.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}



            {/* SUB TAB 4: ASSETS & CATEGORIZATION */}
            {contractSubTab === 'assets' && (
              <div className="space-y-6 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-extrabold text-sm text-[#0C3254] mb-1">Inventaris & Kategori Aset HVAC Klien</h3>
                  <p className="text-[11px] text-slate-400">Pengelompokan tipe unit sewa klien beserta spesifikasi teknis model dan histori servisnya.</p>
                </div>

                {['Chiller', 'VRV / VRF System', 'Air Handling Unit (AHU)'].map(cat => {
                  const matchingAssets = contractsData.flatMap(c => 
                    (c.assets || []).map(a => ({ ...a, clientName: c.clientName }))
                  ).filter(a => {
                    if (cat === 'Chiller') return a.name.toLowerCase().includes('chiller');
                    if (cat === 'VRV / VRF System') return a.name.toLowerCase().includes('vrv') || a.name.toLowerCase().includes('vrf');
                    return a.name.toLowerCase().includes('ahu') || a.name.toLowerCase().includes('handling');
                  });

                  return (
                    <div key={cat} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 bg-[#0F3D5E]/5 flex justify-between items-center">
                        <span className="text-xs font-black text-[#0F3D5E] uppercase tracking-wider">{cat}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0F3D5E] text-white text-[10px] font-black font-space">
                          {matchingAssets.length} Unit
                        </span>
                      </div>

                      <div className="p-6 divide-y divide-slate-100">
                        {matchingAssets.length > 0 ? (
                          matchingAssets.map(asset => (
                            <div key={asset.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-xs text-slate-800 font-extrabold">{asset.name}</strong>
                                  <span className="px-1.5 py-0.5 bg-slate-150 text-slate-500 text-[8px] font-mono rounded">{asset.id}</span>
                                  <span className="text-[10px] text-[#2563EB] font-bold font-space">| {asset.clientName}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-500 font-semibold">
                                  <div>
                                    <span className="text-slate-400 block">Spesifikasi Model:</span>
                                    <span>{asset.spec}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block">Lokasi Instalasi:</span>
                                    <span>{asset.location}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block">Servis Terakhir:</span>
                                    <span>{asset.lastServiced || '-'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-between items-start md:items-end shrink-0 gap-2">
                                <span className={`px-2 py-0.5 text-[8px] font-black font-space rounded uppercase tracking-wider ${
                                  asset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {asset.status}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedHistoryAsset(asset)}
                                  className="text-[9px] text-[#3B82F6] hover:underline font-bold font-space uppercase"
                                >
                                  Lihat Histori Servis
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic text-center py-4">Belum ada unit terdaftar pada kategori ini.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ─── TAB 3: B2C ON-DEMAND PORTAL ─── */}
        {activeTab === 'b2c' && b2cSubTab === 'ondemand' && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/20">
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari pesanan kustomer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* B2C Orders Cards */}
            <div className="grid grid-cols-1 gap-6">
              {b2cOrders
                .filter(ord => ord.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || ord.id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(ord => (
                  <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    
                    {/* Order header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-[#0F3D5E]">{ord.clientName}</h4>
                          <span className="font-mono font-bold text-xs text-slate-500">({ord.id})</span>
                        </div>
                        <p className="text-[11px] text-slate-450 mt-1">
                          Alamat: {ord.address} | Telp: {ord.phone}
                        </p>
                        {ord.statusStep < 4 && (
                          <div className="mt-3 flex items-center gap-2">
                            {ord.deliveryMethod === 'Ambil Sendiri' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = b2cOrders.map(o => o.id === ord.id ? { 
                                    ...o, 
                                    deliveryMethod: 'Kurir',
                                    statusText: 'Unit dalam Persiapan Pengiriman',
                                    historyLogs: [{ title: 'Metode Pengiriman Diubah', desc: 'Pengambilan diubah kembali menjadi Kirim via Kurir Kantor.', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...(o.historyLogs || [])]
                                  } : o);
                                  setB2cOrders(updated);
                                  localStorage.setItem('b2c_orders', JSON.stringify(updated));
                                  alert("Metode diubah: Kirim via Kurir Kantor!");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-[#0F3D5E] bg-slate-100 hover:bg-slate-200 rounded-lg transition-all border border-slate-200 shadow-sm"
                              >
                                📦 Ubah ke Kirim via Kurir Kantor
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = b2cOrders.map(o => o.id === ord.id ? { 
                                    ...o, 
                                    deliveryMethod: 'Ambil Sendiri',
                                    statusText: 'Barang Siap Diambil di Kantor',
                                    historyLogs: [{ title: 'Metode Pengambilan Diubah', desc: 'Kustomer mengonfirmasi akan mengambil unit sendiri ke kantor PT. ASA.', date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...(o.historyLogs || [])]
                                  } : o);
                                  setB2cOrders(updated);
                                  localStorage.setItem('b2c_orders', JSON.stringify(updated));
                                  alert("Metode diubah: Kustomer Ambil Sendiri (Datang ke Kantor)!");
                                }}
                                className="inline-flex items-center px-3.5 py-1.5 text-[10px] font-extrabold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 shadow-sm cursor-pointer"
                              >
                                Ubah Metode: Kustomer Ambil Sendiri (Datang ke Kantor)
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Pembelian ({ord.qty} unit)</span>
                        <strong className="text-sm font-manrope font-black text-slate-700">Rp {(ord.price * ord.qty).toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: item specification */}
                      <div className="lg:col-span-4 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spesifikasi Item:</span>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <strong className="block text-slate-700 text-xs font-bold">{ord.unitName}</strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{ord.spec}</span>
                          <span className="text-[9px] text-[#2563EB] font-black tracking-wide uppercase block mt-2">Paid via Bank Transfer</span>
                        </div>
                      </div>

                      {/* Middle: Step updating buttons */}
                      <div className="lg:col-span-5 space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Tahap Pengiriman:</span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { step: 1, label: 'Dipesan', auto: true },
                            { step: 2, label: 'Lunas', auto: true },
                            { step: 3, label: ord.deliveryMethod === 'Ambil Sendiri' ? 'Siap Diambil' : 'Kirim', auto: false },
                            { step: 4, label: 'Selesai', auto: false }
                          ].map(st => {
                            const isCurrent = ord.statusStep === st.step;
                            if (st.auto) {
                              return (
                                <div
                                  key={st.step}
                                  className={`p-2 rounded-lg text-center border text-[10px] font-bold flex flex-col items-center justify-center select-none ${
                                    isCurrent 
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                      : 'bg-slate-50 border-slate-100 text-slate-400'
                                  }`}
                                >
                                  <span>{st.step}. {st.label}</span>
                                </div>
                              );
                            } else {
                              return (
                                <button
                                  key={st.step}
                                  type="button"
                                  onClick={() => handleUpdateOrderStep(ord.id, st.step)}
                                  className={`p-2 rounded-lg text-center transition-all border text-[10px] font-bold flex flex-col items-center justify-center ${
                                    isCurrent
                                      ? 'bg-[#0F3D5E] border-[#0F3D5E] text-white'
                                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <span>{st.step}. {st.label}</span>
                                </button>
                              );
                            }
                          })}
                        </div>
                        <div className="text-xs mt-2 text-slate-600 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                          Status Aktif: <strong className="text-[#0F3D5E]">{ord.statusText}</strong>
                        </div>

                        {/* Courier & Resi Input (Simulation) */}
                        {ord.statusStep === 3 && (
                          ord.deliveryMethod === 'Ambil Sendiri' ? (
                            <div className="mt-3 bg-blue-50/40 p-3 rounded-xl border border-blue-200/50 space-y-2 text-left animate-fade-in">
                              <span className="text-[9.5px] font-black text-[#0F3D5E] uppercase block">Konfirmasi Siap Diambil</span>
                              <p className="text-[10.5px] text-slate-600 font-semibold leading-relaxed">
                                Kustomer memilih **Ambil Mandiri** (Datang ke Kantor). Pastikan unit barang telah disiapkan di area serah terima kantor PT. ASA.
                              </p>
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStep(ord.id, 3)}
                                className="bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                              >
                                Konfirmasi Barang Siap Diambil
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2 text-left">
                              <span className="text-[9.5px] font-black text-[#0F3D5E] uppercase block">Pembaruan Logistik Kantor (PT. ASA)</span>
                              <div className="flex gap-1.5">
                                <div className="bg-slate-100 border border-slate-200 text-[10px] p-1.5 rounded-lg font-bold text-slate-700 flex items-center shrink-0">
                                  Kurir Internal ASA
                                </div>
                                <input
                                  type="text"
                                  placeholder="Nama Driver / No. Polisi..."
                                  value={b2cTrackingForm.trackingNo}
                                  onChange={e => setB2cTrackingForm({ ...b2cTrackingForm, trackingNo: e.target.value })}
                                  className="bg-white border border-slate-250 text-[10px] p-1.5 rounded-lg flex-1 focus:outline-none font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveTracking(ord.id)}
                                  className="bg-[#0F3D5E] hover:bg-[#0c304a] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  Kirim Barang
                                </button>
                              </div>
                            </div>
                          )
                        )}
                        
                        {/* Action buttons (Print) */}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedB2cPrintOrder(ord);
                              setShowB2cPrintModal(true);
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-bold bg-[#0F3D5E] hover:bg-[#15527d] text-white px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            <FileText className="w-3 h-3" />
                            Cetak Invoice & Label
                          </button>
                        </div>
                      </div>

                      {/* Right: history logs display */}
                      <div className="lg:col-span-3 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Riwayat Aktivitas Log ({ord.historyLogs.length}):</span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {ord.historyLogs.map((log, idx) => (
                            <div key={idx} className="p-2 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] leading-relaxed">
                              <span className="text-slate-400 font-medium block">{log.date}</span>
                              <strong className="text-slate-700 font-bold block">{log.title}</strong>
                              <span className="text-slate-500">{log.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ─── TAB: FIELD SERVICE & DISPATCH ─── */}
        {activeTab === 'b2b' && b2bSubTab === 'field-service' && (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* Sub Tabs Navigation */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50 backdrop-blur-xs">
              {[
                { id: 'calendar', label: 'Kalender Dispatch' },
                { id: 'reports', label: 'Validasi Laporan Harian' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setFieldServiceSubTab(sub.id)}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
                    fieldServiceSubTab === sub.id
                      ? 'bg-white text-[#0F3D5E] shadow-sm'
                      : 'text-slate-555 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUB TAB 1: CALENDAR DISPATCH */}
            {fieldServiceSubTab === 'calendar' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0C3254]">Kalender Penjadwalan & Dispatching Teknisi</h3>
                    <p className="text-[11px] text-slate-400">Peta jadwal pengerjaan Preventive Maintenance (PM), Repair, & Pemasangan Unit.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDate('2026-06-30');
                      setShowDispatchModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Dispatch Penjadwalan Baru
                  </button>
                </div>

                {/* Calendar Grid Mockup */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-xs text-[#0F3D5E] uppercase tracking-wider">Juni 2026</h4>
                    <span className="text-[10px] text-slate-450 font-bold">Menampilkan Jadwal Tugas Aktif</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d} className="py-1">{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty days to align starting day of June 2026 (starts on Monday, so 1 empty slot for Sunday) */}
                    <div className="aspect-square bg-slate-50/50 rounded-xl border border-slate-100 p-1"></div>
                    
                    {Array.from({ length: 30 }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
                      const dayEvents = calendarEvents.filter(ev => ev.date === dateStr);

                      return (
                        <div 
                          key={dayNum} 
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setShowDispatchModal(true);
                          }}
                          className="aspect-square bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer min-h-[90px]"
                        >
                          <span className="text-[10px] font-extrabold text-slate-450 block text-left">{dayNum}</span>
                          <div className="space-y-1 overflow-y-auto max-h-12 pr-0.5">
                            {dayEvents.map(ev => {
                              let colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
                              if (ev.type === 'Repair') colorClass = 'bg-rose-100 text-rose-800 border-rose-200';
                              if (ev.type === 'Installation') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                              
                              return (
                                <div 
                                  key={ev.id} 
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent opening create modal
                                    setEditingEvent(ev);
                                  }}
                                  className={`text-[8px] font-semibold px-1 py-0.5 rounded border ${colorClass} truncate text-left hover:brightness-95 transition-all`}
                                  title={`${ev.type} - ${ev.client} (${ev.tech})`}
                                >
                                  {ev.type.split(' ')[0]}: {ev.client.split(' ').slice(1, 3).join(' ')}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB TAB 2: VALIDATION DAILY REPORTS */}
            {fieldServiceSubTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-extrabold text-sm text-[#0C3254]">Validasi Laporan Harian Teknisi</h3>
                  <p className="text-[11px] text-slate-400">Verifikasi laporan pekerjaan lapangan yang diunggah oleh teknisi sebelum tiket dinyatakan selesai.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {dailyReports.map(rep => (
                    <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-xs text-slate-800 font-extrabold">{rep.client}</strong>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-mono rounded">{rep.id}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${
                            rep.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : rep.status === 'Revised' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Tugas: <span className="text-[#0F3D5E]">{rep.taskType}</span> | Unit: {rep.unit} | Teknisi: {rep.tech} | Tanggal: {rep.date}
                        </p>
                        {rep.notes && (
                          <div className="bg-slate-50 p-2 rounded-lg text-[9.5px] text-slate-600 border border-slate-200 mt-1 max-w-xl">
                            <strong>Catatan Pekerjaan:</strong> {rep.notes}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(rep);
                            setRevisionNotes('');
                          }}
                          className="px-4 py-2 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          Tinjau Detail Laporan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ─── TAB: EMERGENCY CENTER ─── */}
        {activeTab === 'b2c' && b2cSubTab === 'emergency' && (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* Sub Tabs Navigation */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50 backdrop-blur-xs">
              {[
                { id: 'alarm', label: 'Pusat Krisis & Alarm' },
                { id: 'do', label: 'Delivery Order Darurat' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setEmergencySubTab(sub.id)}
                  className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
                    emergencySubTab === sub.id
                      ? 'bg-white text-[#0F3D5E] shadow-sm'
                      : 'text-slate-555 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUB TAB 1: CRISIS ALARM PANEL */}
            {emergencySubTab === 'alarm' && (
              <div className="space-y-6">
                
                {/* Emergency Alert Banner */}
                {isEmergencyActive ? (
                  <div className="bg-rose-700 text-white p-6 rounded-2xl border border-rose-600 shadow-xl space-y-4 animate-pulse text-left">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 animate-bounce">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">STATUS: KRISIS DARURAT AKTIF</span>
                        <h3 className="font-extrabold text-base">{emergencyAlert?.issue}</h3>
                        <p className="text-xs text-rose-100 font-semibold">Klien: {emergencyAlert?.client} | Lokasi: {emergencyAlert?.location}</p>
                        <span className="text-[10px] text-rose-200 block mt-2">Waktu Trigger: {emergencyAlert?.time} | Sumber: {emergencyAlert?.triggerSource}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={deactivateEmergency}
                        className="px-5 py-2.5 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all"
                      >
                        Matikan Alarm Darurat
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewEmergencyDo({
                            ...newEmergencyDo,
                            clientId: 'CON-88029',
                            emergencyType: 'Kebocoran Chiller Utama (Kritis)',
                            actionTaken: 'Pengiriman teknisi darurat untuk menangani kegagalan katup tekanan.',
                            partsDispatched: 'Valve Seal Gasket York 4", Freon R134a (15 kg)',
                            baseFee: 1500000,
                            partsCost: 1200000
                          });
                          setEmergencySubTab('do');
                          setShowDoModal(true);
                        }}
                        className="px-5 py-2.5 bg-[#0F3D5E] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#1a5276] transition-all"
                      >
                        Buat DO Darurat
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0C3254]">Sistem Deteksi Sinyal Darurat</h3>
                      <p className="text-[11px] text-slate-400 mt-1 font-semibold">Sistem pemantauan siaga. Menunggu sinyal panggilan darurat dari unit kustomer.</p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerEmergency}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Uji Sinyal Panggilan Darurat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUB TAB 2: EMERGENCY DELIVERY ORDERS */}
            {emergencySubTab === 'do' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0C3254]">Manajemen Delivery Order (DO) Darurat</h3>
                    <p className="text-[11px] text-slate-400">Pencatatan suku cadang darurat dan perhitungan biaya penanganan krisis klien B2B.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDoModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Buat DO Darurat Baru
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {emergencyDos.map(edo => (
                    <div key={edo.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-slate-800 font-extrabold">{edo.clientName}</strong>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-mono rounded">{edo.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Tanggal DO: {edo.date} | Jenis Krisis: <span className="text-rose-600 font-bold">{edo.emergencyType}</span></span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-bold">Total Biaya Darurat</span>
                          <strong className="text-xs font-bold text-[#0C3254]">Rp {edo.totalCost.toLocaleString('id-ID')}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-semibold text-slate-500">
                        <div>
                          <span className="text-slate-450 block">Tindakan Lapangan:</span>
                          <span className="text-slate-700">{edo.actionTaken}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block">Suku Cadang Dikirim:</span>
                          <span className="text-slate-700">{edo.partsDispatched || '-'}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDo(edo);
                          }}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F3D5E] text-[10px] font-bold rounded-lg transition-all"
                        >
                          Cetak Berita Acara & DO
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ─── TAB 4: FACTURES & INVOICES ─── */}
        {activeTab === 'b2b' && b2bSubTab === 'invoices' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Webhook Simulation Progress Bar */}
            {simulationLog && (
              <div className="bg-[#0F3D5E] text-white p-5 rounded-2xl border border-[#2563EB]/20 shadow-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#2563EB] block">Status Koneksi Gateway Pembayaran</span>
                    <p className="text-xs font-extrabold mt-0.5 text-slate-100">{simulationLog.text}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded text-slate-300">Invoice: {simulationLog.id}</span>
                </div>
              </div>
            )}

            {/* Header & stats */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/20">
              <div>
                <h3 className="font-extrabold text-sm text-[#0C3254] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  Faktur & Pembayaran Tagihan B2B
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Tinjau invoice yang terbit dan verifikasi konfirmasi bukti transfer po kustomer.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setStatusFilter(statusFilter === 'All' ? 'Unpaid' : 'All')}
                  className={`flex-1 sm:flex-none px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                    statusFilter === 'Unpaid' 
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {statusFilter === 'Unpaid' ? 'Tampilkan Semua' : 'Tampilkan Belum Bayar'}
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-450 font-space font-bold uppercase tracking-wider bg-slate-50/20">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Perusahaan Klien</th>
                      <th className="p-4">No. PO</th>
                      <th className="p-4">Tanggal Terbit</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {invoices
                      .filter(inv => statusFilter === 'All' ? true : inv.status === statusFilter)
                      .map(inv => (
                        <tr key={inv.id} className={`hover:bg-slate-50/40 ${inv.status === 'Unpaid' ? 'bg-red-50/5' : ''}`}>
                          <td className="p-4 font-mono font-bold text-slate-800">{inv.id}</td>
                          <td className="p-4 text-slate-700 font-bold">{inv.client}</td>
                          <td className="p-4 font-mono text-slate-500">{inv.po}</td>
                          <td className="p-4 text-slate-400">{inv.date}</td>
                          <td className="p-4">
                            <strong className="text-slate-700 font-manrope font-extrabold">Rp {inv.amount.toLocaleString('id-ID')}</strong>
                            {inv.daysOverdue > 0 && (
                              <span className="text-[10px] text-red-500 font-bold block mt-0.5">{inv.daysOverdue} Hari Terlambat</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide ${
                                inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {inv.status === 'Paid' ? 'LUNAS' : 'BELUM BAYAR'}
                              </span>
                              <div className="text-[9px] text-slate-400 font-mono">
                                {inv.status === 'Paid' ? 'Gateway: Midtrans (Settled)' : 'Gateway: Xendit VA (Pending)'}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col gap-1.5 items-center justify-center">
                              {inv.status === 'Unpaid' ? (
                                <>
                                  <button
                                    onClick={() => handleSimulateWebhook(inv.id)}
                                    className="px-3 py-1.5 bg-[#0F3D5E] hover:bg-[#0c304a] text-white font-bold text-[10px] rounded-lg transition-all shadow-sm hover:shadow"
                                  >
                                    Sinkronisasi Gateway
                                  </button>
                                  <span className="text-[9px] text-slate-400 font-medium">atau ubah status:</span>
                                </>
                              ) : null}
                              <select
                                value={inv.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: newStatus, daysOverdue: newStatus === 'Paid' ? 0 : i.daysOverdue } : i));
                                }}
                                className="bg-white border border-slate-250 text-[10px] font-bold p-1 rounded focus:outline-none focus:border-[#2563EB] text-slate-700"
                              >
                                <option value="Unpaid">Belum Bayar (Pending)</option>
                                <option value="Paid">Lunas (Settled)</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ─── TAB: B2C CATALOG ─── */}
        {activeTab === 'b2c' && b2cSubTab === 'b2c-catalog' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 bg-slate-50/20">
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Residential', price: '', availability: 'Ready Stock' });
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Produk Baru
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-450 font-space font-bold uppercase tracking-wider bg-slate-50/20">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nama Produk</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga</th>
                      <th className="p-4">Status Stok</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {b2cProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/40">
                        <td className="p-4 font-mono text-slate-450">#{p.id}</td>
                        <td className="p-4 font-bold text-slate-700">{p.name}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase ${
                            p.category === 'Residential' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            p.category === 'Commercial' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-manrope font-semibold text-slate-600">{p.price}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            p.availability.includes('Ready') ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.availability.includes('Ready') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 text-slate-500 hover:text-[#0F3D5E] hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ─── TAB: B2C CMS & BANNERS ─── */}
        {activeTab === 'b2c' && b2cSubTab === 'b2c-cms' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 bg-slate-50/20">
              <button 
                onClick={() => {
                  setEditingBanner(null);
                  setBannerForm({ title: '', desc: '', image: '', link: '', active: true });
                  setShowBannerModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Unggah Banner Baru
              </button>
            </div>

            {/* Banner List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {b2cBanners.map(banner => (
                <div key={banner.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Thumbnail */}
                    <div className="h-44 w-full bg-slate-100 relative">
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleBannerActive(banner.id)}
                          className={`px-2.5 py-1 text-[9px] font-black font-space rounded-lg shadow-md transition-all ${
                            banner.active 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-500 text-white'
                          }`}
                        >
                          {banner.active ? 'AKTIF (Tampil)' : 'NON-AKTIF'}
                        </button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-sm text-[#0F3D5E]">{banner.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">{banner.desc}</p>
                      
                      {/* Price Tag (E-commerce Style - Highly Prominent) */}
                      {(banner.originalPrice || banner.promoPrice) && (
                        <div className="flex items-baseline gap-2.5 pt-1.5 pb-1.5 px-3.5 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                          {banner.promoPrice ? (
                            <>
                              <span className="text-red-600 font-black text-base">
                                Rp {Number(banner.promoPrice).toLocaleString('id-ID')}
                              </span>
                              {banner.originalPrice && (
                                <span className="text-slate-400 line-through text-xs font-semibold">
                                  Rp {Number(banner.originalPrice).toLocaleString('id-ID')}
                                </span>
                              )}
                              <span className="bg-rose-100 text-rose-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg">
                                Promo
                              </span>
                            </>
                          ) : (
                            banner.originalPrice && (
                              <span className="text-[#0F3D5E] font-black text-base">
                                Rp {Number(banner.originalPrice).toLocaleString('id-ID')}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {banner.link && (
                        <div className="text-[10px] text-slate-450 font-semibold">
                          Link Redirect: <span className="text-[#3B82F6] font-mono">{banner.link}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3.5 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">ID: #{banner.id}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditBannerClick(banner)}
                        className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:text-[#0F3D5E] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Konten
                      </button>
                      <button 
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-55 rounded-lg text-[10px] font-bold transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ─── MODAL: ADD/EDIT B2C PRODUCT ─── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">{editingProduct ? 'Ubah Informasi Produk B2C' : 'Registrasi Produk B2C Baru'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Basic Info & Photo */}
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold text-[#0F3D5E] uppercase tracking-widest block border-b border-slate-200/60 pb-2">Informasi Dasar Produk</span>
                  
                  <div>
                    <label className="block text-slate-500 mb-1">Nama Produk AC / Peralatan</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Panasonic Premium Inverter 1 HP"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Kategori Produk</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Residential">Residential (Rumahan)</option>
                      <option value="Commercial">Commercial (Bisnis)</option>
                      <option value="Industrial">Industrial (Pabrik / HVAC Skala Besar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Harga / Rentang Harga</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Rp 5.500.000 - Rp 12.000.000"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: formatPriceInput(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Status Ketersediaan</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-left focus:outline-none focus:border-[#2563EB] flex justify-between items-center font-medium text-slate-700"
                      >
                        <span>{productForm.availability || 'Pilih Status Ketersediaan...'}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>
                      
                      {showAvailabilityDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                          {[
                            'Ready Stock',
                            'Indent (1 Minggu)',
                            'Indent (2 Minggu)',
                            'Indent (1 Bulan)',
                            'Out of Stock',
                            'Tulis Custom...'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                if (opt === 'Tulis Custom...') {
                                  setProductForm({ ...productForm, availability: 'Custom' });
                                } else {
                                  setProductForm({ ...productForm, availability: opt });
                                }
                                setShowAvailabilityDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 transition-colors block font-bold"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Text input if Custom is selected or typed */}
                    {(productForm.availability === 'Custom' || (
                      !['Ready Stock', 'Indent (1 Minggu)', 'Indent (2 Minggu)', 'Indent (1 Bulan)', 'Out of Stock'].includes(productForm.availability) && 
                      productForm.availability !== ''
                    )) && (
                      <div className="mt-2 animate-fade-in">
                        <input 
                          type="text"
                          required
                          placeholder="Tulis status ketersediaan kustom..."
                          value={productForm.availability === 'Custom' ? '' : productForm.availability}
                          onChange={e => setProductForm({ ...productForm, availability: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">
                      Foto Produk (Bisa Pilih Lebih Dari 1 Foto untuk Galeri)
                      {!editingProduct && (!productForm.images || productForm.images.length === 0) && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file"
                        accept="image/*"
                        multiple
                        required={!editingProduct && (!productForm.images || productForm.images.length === 0)}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            const processedImages = [];
                            let processedCount = 0;
                            
                            files.forEach((file, index) => {
                              resizeAndCompressImage(file, (compressedBase64) => {
                                processedImages[index] = compressedBase64;
                                processedCount++;
                                
                                if (processedCount === files.length) {
                                  // Filter out any empty items and update state
                                  const finalImgs = processedImages.filter(Boolean);
                                  setProductForm({
                                    ...productForm,
                                    image: finalImgs[0] || '',
                                    images: [...(productForm.images || []), ...finalImgs]
                                  });
                                }
                              });
                            });
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#2563EB] file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#0F3D5E] file:text-white hover:file:bg-[#15527d] file:cursor-pointer cursor-pointer text-slate-500"
                      />
                      
                      {/* Mini-thumbnail Manager */}
                      {productForm.images && productForm.images.length > 0 && (
                        <div className="mt-1 space-y-1.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Kelola Gambar Terunggah:</span>
                          <div className="flex gap-2 overflow-x-auto py-1">
                            {productForm.images.map((img, idx) => (
                              <div key={idx} className="relative w-14 h-14 border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center group">
                                <img src={img} alt={`Preview ${idx}`} className="max-w-full max-h-full object-contain p-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImgs = productForm.images.filter((_, i) => i !== idx);
                                    setProductForm({
                                      ...productForm,
                                      image: newImgs[0] || '',
                                      images: newImgs
                                    });
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black shadow-md hover:bg-red-600 transition-colors"
                                >
                                  &times;
                                </button>
                                {idx === 0 && (
                                  <span className="absolute bottom-0 left-0 right-0 bg-[#0F3D5E] text-white text-[7px] font-bold text-center py-0.5 uppercase tracking-wider">
                                    Utama
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Customer Info */}
                <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-[#0F3D5E] uppercase tracking-widest block border-b border-slate-200/60 pb-2">Detail Informasi Produk (Tampilan Kustomer)</span>
                    
                    <div>
                      <label className="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Spesifikasi & Dimensi (Satu Item Per Baris)</label>
                      <textarea 
                        rows="4"
                        placeholder="Contoh:&#10;Kapasitas: 2 PK&#10;Daya Listrik: 1200 Watt&#10;Tipe Refrigerator: R32"
                        value={productForm.specDetails}
                        onChange={e => setProductForm({ ...productForm, specDetails: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Fitur Utama (Satu Item Per Baris)</label>
                      <textarea 
                        rows="4"
                        placeholder="Contoh:&#10;Teknologi Eco Inverter hemat listrik&#10;Filter penyaring debu anti-alergi&#10;Garansi kompresor 5 tahun"
                        value={productForm.features}
                        onChange={e => setProductForm({ ...productForm, features: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Kelengkapan Paket (Satu Item Per Baris)</label>
                      <textarea 
                        rows="4"
                        placeholder="Contoh:&#10;1x Unit Indoor AC&#10;1x Unit Outdoor AC&#10;1x Bracket & Remote Control&#10;1x Buku Panduan & Garansi"
                        value={productForm.inclusions}
                        onChange={e => setProductForm({ ...productForm, inclusions: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD/EDIT B2C BANNER ─── */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBannerModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">{editingBanner ? 'Ubah Materi Banner Promo' : 'Unggah Banner Promosi Baru'}</h3>
              <button onClick={() => setShowBannerModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveBanner} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-500 mb-1">Judul Banner (Headline)</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Diskon 25% Hari Kemerdekaan"
                  value={bannerForm.title}
                  onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Deskripsi Singkat (Promo Detail)</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Contoh: Dapatkan penawaran terbatas untuk pemasangan AC tipe split inverter..."
                  value={bannerForm.desc}
                  onChange={e => setBannerForm({ ...bannerForm, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">
                  File Gambar Poster (Rekomendasi 1200x500 px)
                  {!editingBanner && !bannerForm.image && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="file"
                    accept="image/*"
                    required={!editingBanner && !bannerForm.image}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        resizeAndCompressImage(file, (compressedBase64) => {
                          setBannerForm({ ...bannerForm, image: compressedBase64 });
                        });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#2563EB] file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#0F3D5E] file:text-white hover:file:bg-[#15527d] file:cursor-pointer cursor-pointer text-slate-500"
                  />
                  {bannerForm.image && (
                    <div className="mt-1 border border-slate-200 rounded-xl overflow-hidden h-24 w-full bg-slate-100 flex items-center justify-center relative">
                      <img 
                        src={bannerForm.image} 
                        alt="Preview Poster" 
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Pratinjau Aspek
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Link Redirect (Saat Di-klik)</label>
                <input 
                  type="text"
                  placeholder="Contoh: #contact atau #products atau /products"
                  value={bannerForm.link}
                  onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Harga Biasa (Rp)</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 150000"
                    value={bannerForm.originalPrice}
                    onChange={e => setBannerForm({ ...bannerForm, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Harga Promo (Rp)</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 120000"
                    value={bannerForm.promoPrice}
                    onChange={e => setBannerForm({ ...bannerForm, promoPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="banner-active"
                  checked={bannerForm.active}
                  onChange={e => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label htmlFor="banner-active" className="text-slate-600 select-none">Aktifkan poster ini (langsung tayang)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                >
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: ADD ASSET MODAL ─── */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddAssetModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Registrasi Aset Baru Klien</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-500 mb-1">Pilih Perusahaan Klien</label>
                <select
                  value={newAsset.clientIndex}
                  onChange={e => setNewAsset({ ...newAsset, clientIndex: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  {contractsData.map((c, idx) => (
                    <option key={c.id} value={idx}>{c.clientName} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Nama Aset (Unit HVAC)</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: York Water Cooled Chiller"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Spesifikasi Detail</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: YMC2-1200 - 350 TR - R134a"
                  value={newAsset.spec}
                  onChange={e => setNewAsset({ ...newAsset, spec: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Lokasi Pemasangan</label>
                <input 
                  type="text"
                  placeholder="Contoh: Ruang Pompa Gedung Utama A"
                  value={newAsset.location}
                  onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Kondisi Aset Awal</label>
                <select
                  value={newAsset.status}
                  onChange={e => setNewAsset({ ...newAsset, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Optimal">Optimal (Normal)</option>
                  <option value="Maintenance">Maintenance (Pemeliharaan)</option>
                  <option value="Breakdown">Breakdown (Kerusakan)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Daftarkan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD TICKET MODAL ─── */}
      {/* ─── MODAL: DISPATCH TICKET SCHEDULE ─── */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDispatchModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Dispatch Tiket Penjadwalan ({selectedDate})</h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDispatch} className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-slate-500 mb-1">Pilih Perusahaan Klien B2B</label>
                <select
                  value={dispatchForm.clientId}
                  onChange={e => setDispatchForm({ ...dispatchForm, clientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  {contractsData.map(c => (
                    <option key={c.id} value={c.id}>{c.clientName} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tipe Penugasan</label>
                <select
                  value={dispatchForm.type}
                  onChange={e => setDispatchForm({ ...dispatchForm, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Preventive Maintenance">Preventive Maintenance (PM Berkala)</option>
                  <option value="Repair">Repair (Perbaikan Kerusakan)</option>
                  <option value="Installation">Installation (Pemasangan Unit Baru)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Spesifikasi Unit Aset</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Chiller York Water Cooled - Lt B1"
                  value={dispatchForm.unit}
                  onChange={e => setDispatchForm({ ...dispatchForm, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tunjuk Teknisi Lapangan</label>
                <select
                  value={dispatchForm.tech}
                  onChange={e => setDispatchForm({ ...dispatchForm, tech: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  <option value="Supriadi & Team">Supriadi & Team (Spesialis Chiller - Beban Kerja: Rendah)</option>
                  <option value="Ahmad & Budi">Ahmad & Budi (Spesialis VRV - Beban Kerja: Sedang)</option>
                  <option value="Roni">Roni (Spesialis Split Duct - Beban Kerja: Tinggi)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold animate-pulse-glow"
                >
                  Dispatch Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT / RESCHEDULE DISPATCH ─── */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingEvent(null)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Edit / Reschedule Jadwal Tugas</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateDispatch} className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-slate-500 mb-1">Klien B2B</label>
                <input
                  type="text"
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-500 font-bold"
                  value={editingEvent.client}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Tanggal Tugas</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                    value={editingEvent.date}
                    onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Tipe Penugasan</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                    value={editingEvent.type}
                    onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
                  >
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Repair">Repair</option>
                    <option value="Installation">Installation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Spesifikasi Unit Aset</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                  value={editingEvent.unit}
                  onChange={e => setEditingEvent({ ...editingEvent, unit: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Teknisi Lapangan</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                  value={editingEvent.tech}
                  onChange={e => setEditingEvent({ ...editingEvent, tech: e.target.value })}
                >
                  <option value="Supriadi & Team">Supriadi & Team (Spesialis Chiller)</option>
                  <option value="Ahmad & Budi">Ahmad & Budi (Spesialis VRV)</option>
                  <option value="Roni">Roni (Spesialis Split Duct)</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteDispatch(editingEvent.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-lg font-bold transition-all"
                >
                  Hapus Tugas
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: REVIEW DAILY REPORT ─── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Tinjau Laporan Harian Teknisi ({selectedReport.id})</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-left">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Nama Klien</span>
                  <strong className="text-[#0F3D5E] text-xs font-bold">{selectedReport.client}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Teknisi Penanggungjawab</span>
                  <strong className="text-slate-700 text-xs font-bold">{selectedReport.tech}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Unit yang Dikerjakan</span>
                  <strong className="text-slate-700 text-xs font-bold">{selectedReport.unit}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Tanggal Pelaksanaan</span>
                  <strong className="text-slate-700 text-xs font-bold">{selectedReport.date}</strong>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-2">Checklist Uji Kelayakan Unit</span>
                <div className="space-y-1.5">
                  {selectedReport.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600 font-semibold">
                      <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center text-[8px] font-black font-space">✓</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts & Spareparts */}
              <div>
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1">Suku Cadang / Bahan yang Digunakan</span>
                <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-bold">{selectedReport.partsUsed || 'Tidak Ada Suku Cadang Terpakai'}</p>
              </div>

              {/* Photo Evidence & Customer Signature */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1">Foto Bukti Lapangan</span>
                  <img src={selectedReport.photo} alt="Bukti Lapangan" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1">Tanda Tangan Penerima (Customer)</span>
                  <div className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative">
                    <span className="font-space font-black italic text-slate-400 text-sm border-b-2 border-slate-300 px-4 py-1">{selectedReport.signature}</span>
                    <span className="absolute bottom-2 right-2 text-[8px] text-slate-400">Verifikasi Digital</span>
                  </div>
                </div>
              </div>

              {/* Revision input */}
              <form onSubmit={handleReviseReport} className="border-t border-slate-100 pt-4 space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">Berikan Instruksi Revisi (Jika Ditolak)</label>
                <textarea
                  placeholder="Contoh: Lampiran foto pengerjaan pipa indoor kurang jelas. Tolong upload ulang."
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-semibold"
                  rows={2}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={!revisionNotes}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold disabled:opacity-50 transition-all"
                  >
                    Tolak & Minta Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveReport(selectedReport.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all"
                  >
                    Setujui Laporan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE EMERGENCY DELIVERY ORDER ─── */}
      {showDoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDoModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Buat Delivery Order (DO) Darurat</h3>
              <button onClick={() => setShowDoModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEmergencyDo} className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-slate-500 mb-1">Pilih Perusahaan Klien B2B</label>
                <select
                  value={newEmergencyDo.clientId}
                  onChange={e => setNewEmergencyDo({ ...newEmergencyDo, clientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"
                >
                  {contractsData.map(c => (
                    <option key={c.id} value={c.id}>{c.clientName} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tipe Krisis Darurat</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Chiller Temperature High Crisis"
                  value={newEmergencyDo.emergencyType}
                  onChange={e => setNewEmergencyDo({ ...newEmergencyDo, emergencyType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tindakan Mitigasi Lapangan</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Pengelasan darurat pipa kondensor & flushing"
                  value={newEmergencyDo.actionTaken}
                  onChange={e => setNewEmergencyDo({ ...newEmergencyDo, actionTaken: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Spare Parts yang Dikirim</label>
                <input 
                  type="text"
                  placeholder="Contoh: Freon R134a (10 kg), Copper Pipe 1/2 (2 meter)"
                  value={newEmergencyDo.partsDispatched}
                  onChange={e => setNewEmergencyDo({ ...newEmergencyDo, partsDispatched: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Biaya Transport & Penanganan</label>
                  <input 
                    type="number"
                    required
                    value={newEmergencyDo.baseFee}
                    onChange={e => setNewEmergencyDo({ ...newEmergencyDo, baseFee: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Biaya Spare Parts (Rupiah)</label>
                  <input 
                    type="number"
                    required
                    value={newEmergencyDo.partsCost}
                    onChange={e => setNewEmergencyDo({ ...newEmergencyDo, partsCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow transition-all"
                >
                  Buat & Kirim DO Darurat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: PRINT EMERGENCY DELIVERY ORDER ─── */}
      {selectedDo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedDo(null)} />
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center print:hidden">
              <h3 className="font-extrabold text-sm">Preview Delivery Order Darurat</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="px-3 py-1 bg-[#2563EB] hover:bg-[#7db035] text-[#0F3D5E] font-black rounded-lg text-[10px]"
                >
                  Cetak DO
                </button>
                <button onClick={() => setSelectedDo(null)} className="text-slate-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Print Area */}
            <div className="p-8 space-y-6 text-left bg-white text-slate-800 font-sans leading-relaxed">
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0F3D5E] tracking-tight">DELIVERY ORDER (DO) DARURAT</h2>
                  <span className="text-[10px] text-slate-450 font-bold block">No. Dokumen: {selectedDo.id}</span>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-semibold">
                  <strong className="text-slate-800 text-xs block">ANTIGRAVITY HVAC SERVICES</strong>
                  <span>Gedung HVAC Solution, Jakarta, Indonesia</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] font-semibold text-slate-650">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Klien Penerima</span>
                  <strong className="text-slate-800 text-xs font-bold">{selectedDo.clientName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] uppercase">Tanggal Dokumen</span>
                  <strong className="text-slate-800 text-xs font-bold">{selectedDo.date}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Detail Penanganan Darurat</h4>
                <table className="w-full text-left text-xs border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <th className="p-2 border border-slate-200">Deskripsi</th>
                      <th className="p-2 border border-slate-200 text-right">Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-700">
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-200">
                        <strong className="block text-slate-800">{selectedDo.emergencyType}</strong>
                        <span className="text-[10px] text-slate-500">Tindakan: {selectedDo.actionTaken}</span>
                      </td>
                      <td className="p-2 border border-slate-200 text-right">Rp {selectedDo.baseFee.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-200">
                        <strong>Pengiriman Suku Cadang Darurat</strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Item: {selectedDo.partsDispatched || 'Tidak Anda'}</span>
                      </td>
                      <td className="p-2 border border-slate-200 text-right">Rp {selectedDo.partsCost.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="bg-slate-50 font-black text-[#0F3D5E]">
                      <td className="p-2 border border-slate-200 text-right">TOTAL TAGIHAN DARURAT</td>
                      <td className="p-2 border border-slate-200 text-right text-sm">Rp {selectedDo.totalCost.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-8 text-center pt-8 text-[11px] font-bold text-slate-650">
                <div>
                  <span className="block mb-12">Diserahkan Oleh (Antigravity)</span>
                  <div className="border-b border-slate-300 w-36 mx-auto font-black italic"></div>
                  <span className="text-[10px] text-slate-400 block mt-1">Teknisi On-Call</span>
                </div>
                <div>
                  <span className="block mb-12">Diterima Oleh (Klien)</span>
                  <div className="border-b border-slate-300 w-36 mx-auto font-black italic"></div>
                  <span className="text-[10px] text-slate-400 block mt-1">PIC Operational Gedung</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: PRINT B2C INVOICE & SHIPPING LABEL ─── */}
      {showB2cPrintModal && selectedB2cPrintOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowB2cPrintModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center print:hidden">
              <h3 className="font-extrabold text-sm">Preview Cetak Invoice & Label Pengiriman</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="px-3 py-1 bg-[#2563EB] hover:bg-[#7db035] text-[#0F3D5E] font-black rounded-lg text-[10px]"
                >
                  Cetak Dokumen
                </button>
                <button onClick={() => setShowB2cPrintModal(false)} className="text-slate-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Print Area */}
            <div className="p-8 space-y-6 text-left bg-white text-slate-800 font-sans leading-relaxed max-h-[80vh] overflow-y-auto">
              {/* Part 1: Invoice */}
              <div className="border-b-2 border-dashed border-slate-200 pb-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-black text-[#0F3D5E]">INVOICE PENJUALAN RETAIL</h2>
                    <span className="text-[10px] text-slate-450 block font-bold">No: INV-{selectedB2cPrintOrder.id}</span>
                  </div>
                  <div className="text-right text-[9px] text-slate-450">
                    <strong className="block text-slate-850 text-xs">ANTIGRAVITY RETAIL STORE</strong>
                    <span>Tanggal Transaksi: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10.5px] font-semibold text-slate-650">
                  <div>
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Pembeli:</span>
                    <strong className="text-slate-800 text-xs font-bold block">{selectedB2cPrintOrder.clientName}</strong>
                    <p>{selectedB2cPrintOrder.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Status Pembayaran:</span>
                    <strong className="text-emerald-600 text-xs font-black uppercase">LUNAS (VERIFIED PG)</strong>
                  </div>
                </div>

                <table className="w-full text-xs border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <th className="p-2 border border-slate-200">Item</th>
                      <th className="p-2 border border-slate-200 text-center">Qty</th>
                      <th className="p-2 border border-slate-200 text-right">Harga Satuan</th>
                      <th className="p-2 border border-slate-200 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-700">
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-200">
                        <strong className="block text-slate-850">{selectedB2cPrintOrder.unitName}</strong>
                        <span className="text-[10px] text-slate-500">{selectedB2cPrintOrder.spec}</span>
                      </td>
                      <td className="p-2 border border-slate-200 text-center">{selectedB2cPrintOrder.qty}</td>
                      <td className="p-2 border border-slate-200 text-right">Rp {selectedB2cPrintOrder.price.toLocaleString('id-ID')}</td>
                      <td className="p-2 border border-slate-200 text-right">Rp {(selectedB2cPrintOrder.price * selectedB2cPrintOrder.qty).toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="bg-slate-50 font-black text-[#0F3D5E]">
                      <td colSpan="3" className="p-2 border border-slate-200 text-right">TOTAL LUNAS</td>
                      <td className="p-2 border border-slate-200 text-right text-sm">Rp {(selectedB2cPrintOrder.price * selectedB2cPrintOrder.qty).toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Part 2: Shipping Label */}
              <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-xs text-[#0C3254] tracking-wider uppercase">LABEL PENGIRIMAN UNIT</h3>
                  <span className="px-2 py-0.5 bg-[#0F3D5E] text-white text-[9px] font-black rounded font-space">B2C LOGISTICS</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px] font-semibold text-slate-650">
                  <div>
                    <span className="text-slate-450 block text-[8.5px] uppercase font-bold">Penerima:</span>
                    <strong className="text-slate-800 text-xs font-bold block">{selectedB2cPrintOrder.clientName}</strong>
                    <p className="text-[10px] text-slate-600 font-semibold mt-1">
                      {selectedB2cPrintOrder.address}
                    </p>
                    <p className="mt-1">Telp: {selectedB2cPrintOrder.phone}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div>
                      <span className="text-slate-450 block text-[8.5px] uppercase font-bold">Kurir Mitra:</span>
                      <span className="text-slate-700 font-black text-xs">ASA Logistics / JNE Express</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-450 block text-[8.5px] uppercase font-bold">Isi Paket:</span>
                      <span className="text-slate-700">{selectedB2cPrintOrder.unitName} ({selectedB2cPrintOrder.qty} Unit)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddTicketModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm">Buat Tiket Gangguan/Layanan Baru</h3>
              <button onClick={() => setShowAddTicketModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTicket} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-500 mb-1">Pilih Perusahaan Klien</label>
                <select
                  value={newTicket.clientIndex}
                  onChange={e => {
                    const idx = Number(e.target.value);
                    setNewTicket({ 
                      ...newTicket, 
                      clientIndex: idx,
                      unit: contractsData[idx]?.assets[0]?.name || ''
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  {contractsData.map((c, idx) => (
                    <option key={c.id} value={idx}>{c.clientName} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Jenis Layanan / Kerusakan</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Overhaul Kompresor Utama"
                  value={newTicket.type}
                  onChange={e => setNewTicket({ ...newTicket, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Pilih Unit Aset Gangguan</label>
                <select
                  value={newTicket.unit}
                  onChange={e => setNewTicket({ ...newTicket, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">-- Pilih Aset --</option>
                  {contractsData[newTicket.clientIndex]?.assets.map(asset => (
                    <option key={asset.id} value={asset.name}>{asset.name} ({asset.id})</option>
                  ))}
                  <option value="Semua Unit Gedung">Lainnya / Semua Unit Gedung</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Prioritas Tiket</label>
                <select
                  value={newTicket.priority}
                  onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Low">Low (Rendah)</option>
                  <option value="Medium">Medium (Menengah)</option>
                  <option value="High">High (Kritis/Darurat)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTicketModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold"
                >
                  Buat Tiket Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ─── MODAL: VIEW SERVICE HISTORY ─── */}
      {selectedHistoryAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedHistoryAsset(null)} />
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
            <div className="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm">Histori Servis & Pemeliharaan</h3>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">ID Aset: {selectedHistoryAsset.id} — {selectedHistoryAsset.name}</p>
              </div>
              <button onClick={() => setSelectedHistoryAsset(null)} className="text-slate-300 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Asset quick details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Klien & Lokasi</span>
                  <span className="text-slate-700 font-extrabold text-xs block truncate mt-0.5">
                    {selectedHistoryAsset.clientName || 'Klien B2B'} — {selectedHistoryAsset.location || 'Area Utama'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Status Kondisi</span>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 text-[8px] font-black font-space rounded uppercase tracking-wider ${
                      selectedHistoryAsset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedHistoryAsset.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline of service logs */}
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-[#0F3D5E] uppercase tracking-widest block border-b border-slate-100 pb-2">Log Riwayat Servis (Komprehensif)</span>
                
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 max-h-60 overflow-y-auto pr-2 py-1">
                  {[
                    {
                      date: '12 Mei 2026',
                      type: 'Preventive Maintenance (PM)',
                      technician: 'Budi Santoso',
                      status: 'Normal',
                      note: 'Pembersihan sirip kondensor & evaporator, pengecekan tekanan freon R134a (stabil pada 120 psi), dan pengetatan koneksi terminal kabel motor kompresor.'
                    },
                    {
                      date: '18 Mar 2026',
                      type: 'Corrective Maintenance (Perbaikan)',
                      technician: 'Rian Hidayat',
                      status: 'Selesai',
                      note: 'Pengisian ulang oli kompresor, penggantian seal gasket pipa evaporator yang aus untuk mencegah kebocoran mikro, serta penggantian filter dryer.'
                    },
                    {
                      date: '15 Jan 2026',
                      type: 'Pentaulihan & Uji Fungsi (Commissioning)',
                      technician: 'Tim Teknisi ASA',
                      status: 'Selesai',
                      note: 'Instalasi perdana unit di area atap/roof deck. Penarikan kabel power utama, tes tekanan nitrogen 350 psi lolos uji 24 jam, pemvakuman sistem, dan startup operasional awal.'
                    }
                  ].map((log, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1 bg-white border-2 border-[#2563EB] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        <span className="bg-[#2563EB] rounded-full w-1.5 h-1.5" />
                      </span>
                      
                      <div className="space-y-1 text-slate-600 font-medium">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-[#0F3D5E]">{log.type}</span>
                          <span className="text-[9px] text-slate-400 font-bold font-space">{log.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{log.note}</p>
                        <div className="text-[9px] text-slate-400 flex justify-between pt-1">
                          <span>Teknisi: <strong className="text-slate-500 font-extrabold">{log.technician}</strong></span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{log.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 bg-slate-50 border-t border-slate-150">
              <button
                type="button"
                onClick={() => setSelectedHistoryAsset(null)}
                className="px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white rounded-lg font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
