/* eslint-disable no-unused-vars, no-undef */
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Settings, 
  Activity, 
  Clock, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  PhoneCall,
  Search,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Lock,
  Mail,
  LogOut,
  X,
  Camera,
  Upload,
  Save,
  Eye,
  EyeOff,
  Bell,
  ExternalLink
} from 'lucide-react';
import ChatbotWidget from '../components/ChatbotWidget';
import { formatRupiah, parseRupiah, formatTanggalID, getTodayISO } from '../utils/formatters';


const isVideoUrl = (url) => {
  if (!url) return false;
  return url.includes('video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
};

export default function CustomerDashboard() {
  // Login State (Active by default per request)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isContractRegistered, setIsContractRegistered] = useState(true); // Toggle to simulate "Register Contract by Admin" requirement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Dashboard Tabs State
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAsset, setSelectedAsset] = useState(null);
  // Task 2: default date pakai hari ini (real-time) bukan hardcode
  const [newRequest, setNewRequest] = useState({ unit: '', issue: '', priority: 'High', desc: '', date: getTodayISO() });
  const [docFilter, setDocFilter] = useState('all');

  // B2B Interactive UI States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Input Bukti, 2: Verifikasi, 3: Success Lunas
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAssetInput, setNewAssetInput] = useState({
    name: '',
    type: 'AC',
    acModel: 'Split Wall Standard',
    spec: '',
    location: '',
    category: 'Pemasangan',
    status: 'Optimal'
  });

  const [showTechReportModal, setShowTechReportModal] = useState(false);
  const [selectedTechReport, setSelectedTechReport] = useState(null);

  // N8N Automation & Emergency States
  const [n8nStatus, setN8nStatus] = useState('Connected'); // Connected, Transmitting, Idle
  const [jwtToken, setJwtToken] = useState('JWT-ASA-B2B-88029-SECURE-KEY-992');
  const [nominalDO, setNominalDO] = useState('Rp 1.850.000');

  // Bell notification modal
  const [isBellModalOpen, setIsBellModalOpen] = useState(false);
  const [showBellToast, setShowBellToast] = useState(true);

  // Profile / Settings State
  const [profileData, setProfileData] = useState({
    name: 'Rendy Kurniadi',
    email: 'r.kurniadi@mitrasukses.co.id',
    phone: '+62 812-3456-7890',
    company: 'PT Mitra Sukses Abadi',
    address: 'Kawasan Industri Batamindo Lot 12, Batam',
    pic: 'Rendy Kurniadi',
    profilePic: null,
    password: '',
    confirm: ''
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const profileFileRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileData(prev => ({ ...prev, profilePic: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileData.name) errs.name = 'Nama wajib diisi';
    if (!profileData.email) errs.email = 'Email wajib diisi';
    if (!profileData.phone) errs.phone = 'Nomor telepon wajib diisi';
    if (profileData.password && profileData.password.length < 8) errs.password = 'Minimal 8 karakter';
    if (profileData.password && profileData.password !== profileData.confirm) errs.confirm = 'Password tidak cocok';
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setProfileErrors({});
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3500);
  };

  // Calendar State — calMonth/calYear untuk display, selectedDate untuk highlight
  // Task 2: selectedDate default hari ini (bukan hardcode)
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => getTodayISO());
  const [activeProjectIdx, setActiveProjectIdx] = useState(-1);

  // Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [activeLightboxImageIdx, setActiveLightboxImageIdx] = useState(0);

  // Photo/Video Attachment Uploader State
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttached = files.map(file => {
      const blobUrl = URL.createObjectURL(file);
      // Append mime type as hash so we can identify it later in the image array
      const preview = `${blobUrl}#${file.type}`;
      return {
        name: file.name,
        type: file.type,
        preview: preview
      };
    });
    setAttachedFiles(prev => [...prev, ...newAttached]);
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Simulated Attendance / Visit Data for Client with multiple projects per day
  const [attendanceData, setAttendanceData] = useState({
    '2026-06-01': {
      status: 'selesai',
      projects: [
        {
          name: 'Project A - Inspeksi York Chiller',
          unit: 'Chiller York Water Cooled',
          issue: 'Inspeksi & Kebocoran Evaporator',
          technician: 'Supriadi & Ahmad',
          checkIn: '08:00',
          checkOut: '12:00',
          note: 'Melakukan pengetesan kebocoran pipa evaporator dan pengisian refrigerant R134a pada Chiller York.',
          images: [
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'York_Chiller_Report.pdf', size: '1.4 MB' },
            { name: 'Checklist_Evaporator.pdf', size: '850 KB' }
          ]
        },
        {
          name: 'Project B - Pembersihan Kondensor',
          unit: 'Chiller York Water Cooled',
          issue: 'Flushing & Pembersihan Kondensor',
          technician: 'Ahmad',
          checkIn: '13:00',
          checkOut: '17:00',
          note: 'Melakukan brushing tube kondensor dan flushing endplate untuk menurunkan temperatur kerja unit.',
          images: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Condenser_Brushing_Log.pdf', size: '920 KB' }
          ]
        }
      ]
    },
    '2026-06-05': {
      status: 'selesai',
      projects: [
        {
          name: 'Project A - Daikin VRV Maintenance',
          unit: 'Daikin VRV IV System',
          issue: 'Preventive Maintenance & Pembersihan Filter',
          technician: 'Supriadi',
          checkIn: '08:15',
          checkOut: '17:00',
          note: 'Pembersihan filter udara unit indoor, pengecekan tegangan kompresor, dan tes drainase kondensat lantai 4.',
          images: [
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Daikin_VRV_Filter_Report.pdf', size: '1.1 MB' }
          ]
        }
      ]
    },
    '2026-06-10': {
      status: 'darurat',
      projects: [
        {
          name: 'Project A - Darurat: Panel Trip (Breakdown)',
          unit: 'Chiller Utama (Main Utility)',
          issue: 'Darurat: Panel Kelistrikan Trip (Mati Total)',
          technician: 'Budi & Ahmad',
          checkIn: '09:00',
          checkOut: '12:00',
          note: 'Pemeriksaan darurat karena terjadi trip kelistrikan terminal magnetik chiller utama. Unit chiller mati total (Breakdown) dan membutuhkan perbaikan sirkuit kontrol segera.',
          images: [
            'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Panel_Electrical_Log.pdf', size: '750 KB' }
          ]
        }
      ]
    },
    '2026-06-12': {
      status: 'selesai',
      projects: [
        {
          name: 'Project A - Penggantian Kompresor Chiller Euroklimat',
          unit: 'Euroklimat Air Handling Unit',
          issue: 'Penggantian Kompresor Terbakar (Burnout)',
          technician: 'Supriadi & Budi',
          checkIn: '08:00',
          checkOut: '12:00',
          note: 'Melakukan uninstallation kompresor yang terbakar (burnout) dan menaikkan unit kompresor pengganti.',
          images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Euroklimat_Replacement_SOP.pdf', size: '2.5 MB' }
          ]
        },
        {
          name: 'Project B - Pengelasan Pipa Tembaga & Vacuum',
          unit: 'Euroklimat Air Handling Unit',
          issue: 'Pengelasan Sambungan Pipa Tembaga & Vacuum',
          technician: 'Ahmad & Budi',
          checkIn: '13:00',
          checkOut: '17:00',
          note: 'Pengelasan sambungan pipa discharge/suction, dilanjutkan proses vacuum sistem hingga 500 microns.',
          images: [
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Vacuum_System_Report.pdf', size: '1.2 MB' }
          ]
        }
      ]
    },
    '2026-06-15': {
      status: 'tertunda',
      projects: [
        {
          name: 'Project A - Kebocoran VRV (Menunggu Part)',
          unit: 'Daikin VRV IV System',
          issue: 'Kebocoran Sirkuit VRV (Menunggu Joint Branch)',
          technician: 'Ahmad',
          checkIn: '07:55',
          checkOut: '17:00',
          note: 'Penekanan gas nitrogen (N2) pada sirkuit VRV lantai 4 untuk melacak titik kebocoran pipa joint. Perbaikan sementara ditunda menunggu pengiriman pipa tembaga & joint branch Daikin resmi.',
          images: [
            'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'VRV_Leakage_N2_Test.pdf', size: '1.8 MB' }
          ]
        }
      ]
    },
    '2026-06-19': {
      status: 'perbaikan',
      projects: [
        {
          name: 'Project A - Troubleshooting AC Leakage',
          unit: 'Daikin VRV IV System',
          issue: 'Troubleshooting AC Leakage (Flare Nut)',
          technician: 'Budi',
          checkIn: '08:30',
          checkOut: '12:00',
          note: 'Menemukan kebocoran flare nut pada unit indoor lantai 4 room C, dilakukan flare ulang dan re-tightening.',
          images: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Daikin_Leakage_Resolved.pdf', size: '1.5 MB' }
          ]
        },
        {
          name: 'Project B - Testing & Commissioning VRV',
          unit: 'Daikin VRV IV System',
          issue: 'Testing & Commissioning Unit Indoor',
          technician: 'Budi',
          checkIn: '13:00',
          checkOut: '17:00',
          note: 'Running test unit indoor lantai 4, pengecekan temperatur udara suplai dan hisap (delta T optimal 12 derajat C).',
          images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'Commissioning_Report_VRV.pdf', size: '2.1 MB' }
          ]
        }
      ]
    },
    '2026-06-23': {
      status: 'darurat',
      projects: [
        {
          name: 'Project A - Chiller York (Multi-Aktivitas)',
          unit: 'Chiller York Water Cooled',
          issue: 'Darurat: Perbaikan PCB + PM Chiller',
          technician: 'Supriadi & Ahmad',
          checkIn: '07:30',
          checkOut: '17:00',
          // Multi-activity: each entry rendered as a separate section in the detail view
          activities: [
            {
              type: 'urgent',
              label: 'Perbaikan Darurat',
              title: 'Perbaikan PCB Chiller (Breakdown)',
              issue: 'PCB Kontrol Chiller Terbakar – Unit Mati Total',
              technician: 'Supriadi & Ahmad',
              checkIn: '07:30',
              checkOut: '12:00',
              note: `Unit Chiller York tiba-tiba mati total pada pukul 06:45 WIB. Setelah investigasi awal, ditemukan PCB modul kontrol utama terbakar (burnout) akibat lonjakan tegangan. Tim teknisi melakukan:\n1. Isolasi unit & pengamanan panel kelistrikan.\n2. Penggantian PCB modul kontrol dengan unit cadangan.\n3. Pengujian kembali sistem refrigerasi dan sirkuit kontrol.\n4. Unit kembali beroperasi normal pukul 11:50 WIB.\nCatatan: Rekomendasi pemasangan stabilizer tegangan untuk pencegahan ke depan.`,
              images: [
                'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
              ],
              files: [
                { name: 'PCB_Breakdown_Report_2306.pdf', size: '1.8 MB' },
                { name: 'Electrical_Inspection_Log.pdf', size: '920 KB' }
              ]
            },
            {
              type: 'pm',
              label: 'PM Chiller',
              title: 'Preventive Maintenance (PM) – Chiller York',
              issue: 'Jadwal PM Bulanan: Inspeksi & Pembersihan Sistem',
              technician: 'Ahmad',
              checkIn: '13:00',
              checkOut: '17:00',
              note: `Pelaksanaan jadwal PM bulanan rutin pada unit Chiller York Water Cooled setelah pemulihan darurat pagi hari. Pekerjaan meliputi:\n1. Pembersihan strainer & filter refrigerant.\n2. Pengecekan tekanan refrigerant R134a (suction 4.2 bar, discharge 16.8 bar - normal).\n3. Pembersihan kondensor & evaporator (manual brushing).\n4. Pengujian seluruh sensor suhu dan tekanan.\n5. Pengisian lembar checklist PM & tanda tangan teknisi.\nStatus unit: Beroperasi Normal. Jadwal PM berikutnya: 23 Juli 2026.`,
              images: [
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
              ],
              files: [
                { name: 'PM_Checklist_York_Jun2026.pdf', size: '2.1 MB' },
                { name: 'Refrigerant_Pressure_Log.pdf', size: '750 KB' }
              ]
            }
          ]
        },
        {
          name: 'Project B - Inspeksi Unit AHU Ruang Produksi',
          unit: 'Euroklimat Air Handling Unit',
          issue: 'Inspeksi V-Belt & Arus Listrik Motor AHU',
          technician: 'Supriadi',
          checkIn: '13:00',
          checkOut: '15:30',
          note: 'Pengecekan V-belt motor AHU dan pengukuran arus listrik motor blower. V-belt dalam kondisi baik.',
          images: [
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          ],
          files: [
            { name: 'AHU_Blower_Checklist.pdf', size: '890 KB' }
          ]
        }
      ]
    },
    '2026-06-25': {
      status: 'tiket',
      projects: [
        {
          name: 'Project A - Jadwal Preventative Maintenance (PM)',
          unit: 'Semua Unit Gedung (Chiller & VRV)',
          issue: 'Jadwal Preventive Maintenance (PM) Bulanan',
          technician: 'Belum Ditugaskan',
          checkIn: '-',
          checkOut: '-',
          note: 'Jadwal PM bulanan rutin untuk seluruh unit Chiller dan VRV gedung kustomer.',
          images: [
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          ],
          files: []
        }
      ]
    }
  });

  const getProjectStyle = (proj, isActive) => {
    if (!proj) return {
      cardCls: 'border-slate-200 bg-white text-slate-800 hover:border-slate-350',
      badgeCls: 'bg-slate-100 text-slate-500 border-slate-200/50',
      label: 'Umum'
    };

    const text = ((proj.name || '') + ' ' + (proj.issue || '')).toLowerCase();
    
    let isUrgent = text.includes('darurat') || text.includes('urgent') || text.includes('breakdown');
    let isPm = text.includes('pm') || text.includes('preventive') || text.includes('maintenance') || text.includes('inspeksi') || text.includes('standby') || text.includes('monitoring');
    let isRepair = text.includes('perbaikan') || text.includes('troubleshooting') || text.includes('penggantian') || text.includes('pengelasan') || text.includes('kebocoran') || text.includes('repair');

    if (isUrgent) {
      return {
        cardCls: isActive 
          ? 'border-red-500 bg-red-50/20 ring-2 ring-red-500/10 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-red-300 hover:bg-red-50/5',
        badgeCls: 'bg-red-100 text-red-800 border-red-200',
        label: 'Darurat/Kritis (Breakdown)'
      };
    } else if (isPm) {
      return {
        cardCls: isActive 
          ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/10 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/5',
        badgeCls: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Report PM'
      };
    } else {
      return {
        cardCls: isActive 
          ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/10 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/5',
        badgeCls: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Pekerjaan Selesai'
      };
    }
  };

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
      case 'selesai':
      case 'hadir':
      case 'perbaikan':
      case 'izin':
      case 'sakit':
      case 'cuti':
      case 'tertunda':
      case 'not checked out':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-50';
      case 'tiket':
      case 'alpha':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-50';
      case 'darurat':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-50';
      default:
        return 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SIMULASI: localStorage sebagai shared state sementara sebelum backend API
  // siap. Key 'b2b_contracts_data' dan 'b2b_invoices' digunakan bersama dengan
  // hvac-dashboard.php (admin) agar perubahan admin langsung terlihat di sini.
  // TODO(API): Ganti useState initializer dengan fetch GET /api/b2b/contracts
  // TODO(API): Ganti useState initializer dengan fetch GET /api/b2b/invoices
  // ─────────────────────────────────────────────────────────────────────────

  // Task 1: tickets + assets digabung dalam key 'b2b_contracts_data' (sync dengan admin)
  const MOCK_TICKETS = [
    { id: 'TKT-902', type: 'Preventive Maintenance', unit: 'Chiller York Water Cooled - Main Hall', date: '25 Juni 2026', status: 'Scheduled', priority: 'Low' },
    { id: 'TKT-845', type: 'Troubleshooting AC Leakage', unit: 'Daikin VRV System - 4th Floor Office', date: '19 Juni 2026', status: 'In Progress', priority: 'High' },
    { id: 'TKT-712', type: 'Compressor Replacement', unit: 'Euroklimat Chiller - Production Line B', date: '12 Juni 2026', status: 'Completed', priority: 'High' }
  ];
  const MOCK_ASSETS = [
    { id: 'ASA-EQ-001', name: 'Chiller York Water Cooled', spec: 'YMC2-1200 - R134a - 350 TR', installDate: '12 Jan 2024', warrantyUntil: '12 Jan 2027', location: 'Main Utility Building Room A', lastServiced: '10 Mei 2026', status: 'Optimal', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
    { id: 'ASA-EQ-002', name: 'Daikin VRV IV System', spec: 'RXQ30AYM - Multi-Split - 30 HP', installDate: '05 Mar 2024', warrantyUntil: '05 Mar 2026', location: 'Office Tower 4th Floor', lastServiced: '19 Juni 2026', status: 'Maintenance', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' },
    { id: 'ASA-EQ-003', name: 'Euroklimat Air Handling Unit', spec: 'EKAH-80 - 12000 CFM', installDate: '18 Okt 2023', warrantyUntil: '18 Okt 2025', location: 'Production Line B', lastServiced: '12 Juni 2026', status: 'Optimal', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' }
  ];

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('b2b_contracts_data');
    if (saved) {
      try { return JSON.parse(saved).tickets || MOCK_TICKETS; } catch { return MOCK_TICKETS; }
    }
    return MOCK_TICKETS;
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('b2b_contracts_data');
    if (saved) {
      try { return JSON.parse(saved).assets || MOCK_ASSETS; } catch { return MOCK_ASSETS; }
    }
    return MOCK_ASSETS;
  });

  // Sync tickets + assets ke localStorage key bersama
  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('b2b_contracts_data') || '{}');
    localStorage.setItem('b2b_contracts_data', JSON.stringify({ ...current, tickets, assets }));
  }, [tickets, assets]);

  // Cross-tab sync: refresh saat admin dashboard update data di tab lain
  useEffect(() => {
    const syncContractsData = () => {
      const saved = localStorage.getItem('b2b_contracts_data');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.assets) setAssets(parsed.assets);
      } catch {}
    };
    window.addEventListener('storage', syncContractsData);
    window.addEventListener('focus', syncContractsData);
    return () => {
      window.removeEventListener('storage', syncContractsData);
      window.removeEventListener('focus', syncContractsData);
    };
  }, []);

  // Task 1: invoices sync dengan key 'b2b_invoices'
  const MOCK_INVOICES = [
    { id: 'INV/2026/ASA/089', ao: 'AO-2026-4421', po: 'PO-88029-411', title: 'Troubleshooting & Perbaikan PCB Modul Chiller York', date: '24 Juni 2026', amount: 'Rp 14.250.000', status: 'Sudah Dibayar', size: '1.2 MB' },
    { id: 'INV/2026/ASA/074', ao: 'AO-2026-3912', po: 'PO-88029-389', title: 'Preventive Maintenance Bulanan Chiller & VRV Gedung', date: '10 Juni 2026', amount: 'Rp 8.500.000', status: 'Sudah Dibayar', size: '890 KB' },
    { id: 'INV/2026/ASA/095', ao: 'AO-2026-4550', po: 'PO-88029-432', title: 'Penggantian Kompresor Terbakar - Chiller Euroklimat', date: '15 Juni 2026', amount: 'Rp 38.000.000', status: 'Belum Dibayar', size: '2.1 MB', daysOverdue: 11 },
    { id: 'INV/2026/ASA/098', ao: 'AO-2026-4601', po: 'PO-88029-445', title: 'Pemesanan Joint Branch & Pipa Tembaga Daikin VRV IV', date: '20 Juni 2026', amount: 'Rp 6.200.000', status: 'Belum Dibayar', size: '950 KB', daysOverdue: 6 }
  ];

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('b2b_invoices');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return MOCK_INVOICES;
  });

  useEffect(() => {
    localStorage.setItem('b2b_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Cross-tab sync untuk invoices
  useEffect(() => {
    const syncInvoices = () => {
      const saved = localStorage.getItem('b2b_invoices');
      if (saved) { try { setInvoices(JSON.parse(saved)); } catch {} }
    };
    window.addEventListener('storage', syncInvoices);
    window.addEventListener('focus', syncInvoices);
    return () => {
      window.removeEventListener('storage', syncInvoices);
      window.removeEventListener('focus', syncInvoices);
    };
  }, []);

  const customerData = {
    name: 'PT Mitra Sukses Abadi',
    code: 'CUST-88029',
    pic: 'Rendy Kurniadi',
    phone: '+62 812-3456-7890',
    email: 'r.kurniadi@mitrasukses.co.id',
    address: 'Kawasan Industri Batamindo Lot 12, Batam',
    assets: assets
  };

  const unpaidInvoices = invoices.filter(inv => inv.status === 'Belum Dibayar');
  const unpaidCount = unpaidInvoices.length;
  // Task 5: gunakan parseRupiah + formatRupiah (utils/formatters)
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + parseRupiah(inv.amount), 0);
  const unpaidTotalStr = formatRupiah(unpaidTotal);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase() === 'r.kurniadi@mitrasukses.co.id' && password === 'mitrasukses') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Email atau Password kustomer salah.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newRequest.unit || !newRequest.issue) return;
    
    // Task 2: tanggal tiket baru pakai tanggal REAL saat ini (bukan hardcode)
    const todayISO = getTodayISO();
    const newTkt = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      type: newRequest.issue,
      unit: newRequest.unit,
      // TODO(API): ganti dengan timestamp dari server response POST /api/b2b/tickets
      date: formatTanggalID(new Date()),
      status: 'Open',
      priority: newRequest.priority
    };

    setTickets([newTkt, ...tickets]);

    // Calendar update: set calendar date ke hari ini atau input date
    const reqDate = newRequest.date || todayISO;
    const dateParts = reqDate.split('-');
    if (dateParts.length === 3) {
      setCalYear(Number(dateParts[0]));
      setCalMonth(Number(dateParts[1]));
    }
    setSelectedDate(reqDate);

    // Map attached photo/video previews, fallback to generic HVAC image if empty
    const uploadedImages = attachedFiles.length > 0 
      ? attachedFiles.map(f => f.preview) 
      : [
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
        ];

    const existingRecord = attendanceData[reqDate] || { status: 'darurat', projects: [] };
    const newProjectObj = {
      name: `Project ${String.fromCharCode(65 + existingRecord.projects.length)} - Urgent: ${newRequest.issue}`,
      unit: newRequest.unit,
      issue: newRequest.issue,
      technician: 'On Progress',
      checkIn: '08:00',
      checkOut: '-',
      note: `Deskripsi masalah: ${newRequest.desc || 'Menunggu kedatangan tim emergency PT ASA.'}`,
      images: uploadedImages,
      files: []
    };

    const nextIdx = existingRecord.projects.length;
    setActiveProjectIdx(nextIdx);

    setAttendanceData(prev => {
      const existing = prev[reqDate] || { status: 'darurat', projects: [] };
      const updatedProjects = [...existing.projects, newProjectObj];
      return {
        ...prev,
        [reqDate]: {
          status: 'darurat',
          projects: updatedProjects
        }
      };
    });

    setAttachedFiles([]); // Clear uploader state
    setNewRequest({ unit: '', issue: '', priority: 'High', desc: '', date: '2026-06-24' });
    setActiveTab('overview'); // Jump to calendar overview
  };

  // Calculate dynamic stats
  const totalAssetsCount = customerData.assets.length;
  const optimalAssetsCount = customerData.assets.filter(a => a.status === 'Optimal').length;
  
  const activeTicketsCount = tickets.filter(t => t.status !== 'Completed').length;
  
  // Find the closest upcoming PM ticket date
  const pmTickets = tickets.filter(t => t.type.toLowerCase().includes('preventive') || t.type.toLowerCase().includes('pm') || t.type.toLowerCase().includes('maintenance'));
  const nextPmDate = pmTickets.length > 0 ? pmTickets[0].date : 'Belum Ada';

  // Find the latest active troubleshooting ticket for progress card
  const activeTroubleshooting = tickets.find(t => t.status !== 'Completed') || tickets[0];

  const getStepState = (status, stepIdx) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') {
      return { done: true, active: stepIdx === 4 };
    }
    if (s === 'in progress' || s === 'on progress' || s === 'open') {
      if (s === 'open') {
        if (stepIdx <= 1) return { done: true, active: stepIdx === 1 };
      } else {
        if (stepIdx <= 3) return { done: true, active: stepIdx === 3 };
      }
      return { done: false, active: false };
    }
    if (stepIdx === 1) return { done: true, active: true };
    return { done: false, active: false };
  };

  // DASHBOARD MAIN CONTENT SCREEN
  if (!isContractRegistered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-150 p-8 max-w-md w-full text-center shadow-lg space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Akses Terkunci</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Akun kustomer ini (<span className="font-mono text-[#0F3D5E] font-bold">r.kurniadi@mitrasukses.co.id</span>) belum terdaftar dalam sistem kontrak B2B aktif.
            </p>
          </div>
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-medium text-left leading-relaxed">
            <strong>Catatan B2B:</strong> Akun ini harus melalui proses <strong>Register Contract by Admin</strong> terlebih dahulu di portal admin agar dapat mengakses dasbor operasional dan pemeliharaan HVAC.
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsContractRegistered(true)}
              className="w-full py-3 bg-[#0F3D5E] hover:bg-[#15466b] text-white text-xs font-extrabold uppercase font-space tracking-wider rounded-xl shadow-md transition-all"
            >
              Simulasi Register Kontrak (Admin)
            </button>
            <a
              href="/"
              className="block w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 pt-12 pb-20">
      {/* Demo helper badge to toggle contract state */}
      <div className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-2 text-[10px] font-bold text-slate-600">
        <span>B2B Contract:</span>
        <button 
          onClick={() => setIsContractRegistered(false)}
          className="bg-red-550 text-white px-2 py-0.5 rounded-full font-black uppercase hover:bg-red-650 transition-colors"
          style={{ background: '#DC2626' }}
        >
          Unregister
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-[#0F3D5E] text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl">
          {/* Watermark gear - subtle brand element */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.06] pointer-events-none">
            <svg viewBox="0 0 100 100" fill="white"><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="22" fill="#0F3D5E"/><rect x="46" y="4" width="8" height="16" rx="2" fill="white"/><rect x="46" y="80" width="8" height="16" rx="2" fill="white"/><rect x="4" y="46" width="16" height="8" rx="2" fill="white"/><rect x="80" y="46" width="16" height="8" rx="2" fill="white"/></svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left: Company Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope tracking-tight text-white">{customerData.name}</h1>
              <p className="text-blue-200 text-sm mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Customer ID: <strong className="text-white">{customerData.code}</strong></span>
                <span className="text-blue-400">|</span>
                <span>PIC: <strong className="text-white">{customerData.pic}</strong></span>
                <span className="text-blue-400">|</span>
                <span className="text-blue-200">{customerData.email}</span>
              </p>
            </div>

            {/* Right: Actions + Profile */}
            <div className="flex items-center gap-3 shrink-0">
              {/* 🔔 Bell Notification — Invoice Belum Dibayar */}
              <div className="relative">
                <button
                  onClick={() => setIsBellModalOpen(prev => !prev)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:brightness-110 shadow-md"
                  style={{background: '#1D4E8F'}}
                  title="Notifikasi Tagihan"
                >
                  <Bell className="w-5 h-5 text-white" />
                  {/* Badge angka */}
                  {unpaidCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#0F3D5E] animate-pulse">
                      {unpaidCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Emergency Hotline — solid red (darurat) */}
              <a
                href="https://wa.me/628117710113"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 font-black font-space text-xs rounded-xl shadow-md transition-all hover:brightness-110 flex items-center gap-2"
                style={{background: '#DC2626', color: '#fff'}}
              >
                <PhoneCall className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency Hotline</span>
              </a>

              {/* Customer Profile CTA — klik ke tab Pengaturan Profil */}
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-3 pl-3 border-l-2 border-white/30 group hover:opacity-90 transition-all cursor-pointer"
                title="Buka Pengaturan Profil"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-extrabold text-white leading-tight group-hover:text-[#8DC63F] transition-colors">{customerData.pic}</div>
                  <div className="text-[10px] text-[#8DC63F] font-space font-black uppercase tracking-wide flex items-center justify-end gap-1">
                    PIC / Admin
                    <Settings className="w-3 h-3 opacity-70" />
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black font-manrope shadow-lg border-2 border-[#8DC63F] shrink-0 group-hover:scale-105 transition-transform overflow-hidden"
                  style={{background: '#1D4E8F'}}
                >
                  {profileData.profilePic ? (
                    <img src={profileData.profilePic} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    customerData.pic.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Menu Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'overview', label: 'Ringkasan', icon: Activity },
            { id: 'assets', label: 'Daftar Unit HVAC', icon: Wrench },
            { id: 'tickets', label: 'Tiket Servis & PM', icon: Clock },
            { id: 'request', label: 'Hubungi Admin & Tips', icon: PhoneCall },
            { id: 'docs', label: 'Katalog PO & Invoice', icon: FileText },
            { id: 'settings', label: 'Pengaturan Profil', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all border ${
                activeTab === tab.id
                  ? tab.id === 'request'
                    ? 'bg-red-600 text-white border-red-650 shadow-lg shadow-red-900/20'
                    : 'bg-[#0F3D5E] text-white border-[#0F3D5E] shadow-lg shadow-slate-900/10'
                  : tab.id === 'request'
                    ? 'bg-red-50/30 border border-red-100 hover:bg-red-50 text-red-600 font-bold'
                    : 'bg-white border border-slate-100 hover:bg-slate-50 text-slate-650 hover:text-slate-950'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${
                activeTab === tab.id 
                  ? 'text-white' 
                  : tab.id === 'request' 
                    ? 'text-red-500' 
                    : 'text-slate-400'
              }`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Outer Layout Grid replaced with wrapper for compatibility with closing div */}
        <div className="w-full">
          <div className="w-full">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 min-h-[500px] shadow-sm">
              
              {/* Overview TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Ringkasan Layanan</h2>
                    <p className="text-slate-400 text-xs mt-1">Status dan aktivitas sistem HVAC PT. Artha Solusi Aditama di gedung Anda.</p>
                  </div>                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-space block">Sistem Optimal</span>
                        <h4 className="text-2xl font-black font-manrope text-[#0F3D5E]">{optimalAssetsCount} <span className="text-xs text-slate-500 font-normal">dari {totalAssetsCount} unit</span></h4>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-space block">Tiket Servis Aktif</span>
                        <h4 className="text-2xl font-black font-manrope text-[#0F3D5E]">{activeTicketsCount} <span className="text-xs text-slate-500 font-normal">tiket</span></h4>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-space block">Jadwal PM Terdekat</span>
                        <h4 className="text-sm font-extrabold font-manrope text-[#0F3D5E] mt-1">{nextPmDate}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Active Services / Work Progress Panel */}
                  {activeTroubleshooting && (
                    <div className="space-y-4">
                      <h3 className="font-manrope font-bold text-sm text-[#0F3D5E] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Progres Troubleshooting Terkini
                      </h3>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 pb-4 mb-4">
                          <div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider font-space ${
                              activeTroubleshooting.priority === 'High' || activeTroubleshooting.priority === 'Urgent'
                                ? 'bg-red-100 text-red-650'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {activeTroubleshooting.priority} Priority
                            </span>
                            <h4 className="font-manrope font-black text-sm text-slate-800 mt-1.5">{activeTroubleshooting.unit} - {activeTroubleshooting.type}</h4>
                            <p className="text-slate-400 text-xs mt-0.5">
                              Lokasi: {customerData.assets.find(a => a.name === activeTroubleshooting.unit || (activeTroubleshooting.unit || '').includes(a.name))?.location || 'Main Gedung / Utility Room'}
                            </p>
                          </div>
                          <span className={`text-xs font-bold font-space px-3 py-1 rounded-xl ${
                            activeTroubleshooting.status === 'Completed'
                              ? 'text-emerald-650 bg-emerald-50 border border-emerald-250/30'
                              : 'text-[#3B82F6] bg-blue-50 border border-blue-200/30'
                          }`}>
                            {activeTroubleshooting.status}
                          </span>
                        </div>

                        {/* Interactive Visual Progress Stepper */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                          {[
                            { title: 'Telah Diterima', desc: 'Tiket dibuat', step: 1 },
                            { title: 'Kunjungan Lapangan', desc: 'Teknisi tiba', step: 2 },
                            { title: 'Analisis & Perbaikan', desc: 'Sedang diperbaiki', step: 3 },
                            { title: 'Selesai & Laporan', desc: 'Menunggu konfirmasi', step: 4 }
                          ].map((stepItem, idx) => {
                            const { done, active } = getStepState(activeTroubleshooting.status, stepItem.step);
                            return (
                              <div key={idx} className="relative flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                                    active 
                                      ? 'bg-[#3B82F6] text-white ring-4 ring-blue-500/10'
                                      : done 
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-slate-800">{stepItem.title}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 pl-8">{stepItem.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}                  {/* Calendar Component matching absent-list.php */}
                  <div className="space-y-4 pt-2 animate-fade-in">
                    <h3 className="font-manrope font-bold text-sm text-[#0F3D5E] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Kalender Kunjungan & Kehadiran Teknisi
                    </h3>
                    
                    <div className="flex flex-col gap-6">
                      
                      {/* Top: The Calendar Table Grid (Full Width) */}
                      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                          <span className="font-extrabold text-sm text-slate-800 font-manrope">Status Bulanan</span>
                          <div className="flex items-center gap-2">
                            <select 
                              value={calMonth} 
                              onChange={(e) => {
                                setCalMonth(Number(e.target.value));
                                setActiveProjectIdx(-1);
                              }}
                              className="border border-slate-250 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {[
                                { val: 1, label: 'Januari' },
                                { val: 2, label: 'Februari' },
                                { val: 3, label: 'Maret' },
                                { val: 4, label: 'April' },
                                { val: 5, label: 'Mei' },
                                { val: 6, label: 'Juni' },
                                { val: 7, label: 'Juli' },
                                { val: 8, label: 'Agustus' },
                                { val: 9, label: 'September' },
                                { val: 10, label: 'Oktober' },
                                { val: 11, label: 'November' },
                                { val: 12, label: 'Desember' }
                              ].map(m => (
                                <option key={m.val} value={m.val}>{m.label}</option>
                              ))}
                            </select>
                            
                            <select 
                              value={calYear} 
                              onChange={(e) => {
                                setCalYear(Number(e.target.value));
                                setActiveProjectIdx(-1);
                              }}
                              className="border border-slate-250 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {[2023, 2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-center table-fixed border-collapse min-w-[320px]">
                            <thead>
                              <tr className="border-b border-slate-100">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                  <th key={day} className="pb-3 text-[11px] font-extrabold text-slate-400 font-space uppercase tracking-wider">{day}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const days = getCalendarDays();
                                const rows = [];
                                for (let i = 0; i < days.length; i += 7) {
                                  rows.push(days.slice(i, i + 7));
                                }
                                return rows.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((day, dIdx) => {
                                      if (day === null) {
                                        return <td key={dIdx} className="p-1.5"></td>;
                                      }
                                      const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                      const record = attendanceData[dateStr];
                                      const status = record ? record.status : 'empty';
                                      const cls = getStatusClasses(status);
                                      const isSelected = selectedDate === dateStr;
                                      return (
                                        <td key={dIdx} className="p-1.5">
                                          <div className="flex justify-center items-center">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedDate(dateStr);
                                                setActiveProjectIdx(-1);
                                              }}
                                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${cls} ${
                                                isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-md z-10' : ''
                                              }`}
                                              title={`Lihat kegiatan ${dateStr}`}
                                            >
                                              {day}
                                            </button>
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>

                        {/* Legends aligned with dashboard logic */}
                        <div className="mt-5 pt-4 border-t border-slate-150 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold text-slate-500 font-space">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-md inline-block"></span>
                            <span>Pekerjaan Selesai</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-blue-100 border border-blue-200 rounded-md inline-block"></span>
                            <span>Report PM</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-red-100 border border-red-200 rounded-md inline-block"></span>
                            <span>Darurat/Kritis (Breakdown)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-white border border-slate-200 border-dashed rounded-md inline-block"></span>
                            <span>Tidak Ada Jadwal</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Selected Date & Multi-Project Selector Cards & Detail Panel */}
                      <div className="w-full space-y-5">
                        
                        {/* Selected Date Header */}
                        <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-2xl px-5 py-4">
                          <div>
                            <span className="font-bold text-[10px] uppercase font-space text-slate-400 tracking-wider block">Tanggal Terpilih</span>
                            <div className="font-manrope font-black text-sm sm:text-base text-[#0F3D5E]">
                              {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                          {selectedDate !== '2026-06-23' && (
                            <button 
                              onClick={() => {
                                setSelectedDate('2026-06-23');
                                setCalMonth(6);
                                setCalYear(2026);
                                setActiveProjectIdx(-1);
                              }} 
                              className="text-xs text-blue-600 hover:text-blue-800 font-extrabold bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100 transition-colors shadow-sm"
                            >
                              Kembali ke Hari Ini
                            </button>
                          )}
                        </div>

                        {/* If projects exist on the selected date */}
                        {attendanceData[selectedDate] && attendanceData[selectedDate].projects?.length > 0 ? (
                          <div className="space-y-6">
                            
                            {/* Project/Activity Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {attendanceData[selectedDate].projects.map((proj, idx) => {
                                const isActive = activeProjectIdx === idx;
                                const style = getProjectStyle(proj, isActive);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveProjectIdx(idx)}
                                    className={`p-5 rounded-2xl border text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between h-full group ${style.cardCls}`}
                                  >
                                    <div className="w-full">
                                      <div className="flex justify-between items-start gap-2 mb-3">
                                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-lg tracking-wider font-space border ${style.badgeCls}`}>
                                          {style.label}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold font-space whitespace-nowrap">
                                          {proj.checkIn !== '-' ? `${proj.checkIn} - ${proj.checkOut}` : 'Jadwal Hari Ini'}
                                        </span>
                                      </div>
                                      
                                      <h4 className="font-manrope font-black text-[#0F3D5E] text-sm group-hover:text-blue-900 transition-colors line-clamp-2">
                                        {(proj.name || '').includes(' - ') ? proj.name.split(' - ').slice(1).join(' - ') : proj.name}
                                      </h4>
                                      
                                      <p className="text-xs text-slate-500 mt-1 font-semibold font-manrope">
                                        Unit: <span className="text-slate-750 font-bold">{proj.unit || "Umum"}</span>
                                      </p>
                                    </div>
                                    
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 w-full">
                                      <span className="truncate max-w-[130px]" title={proj.technician}>
                                        Teknisi: <strong className="text-slate-650">{proj.technician}</strong>
                                      </span>
                                      <span className={`text-[10px] font-bold flex items-center gap-1 group-hover:underline shrink-0 ${isActive ? 'text-blue-600 font-black' : 'text-slate-500'}`}>
                                        {isActive ? 'Terpilih' : 'Lihat Rincian'} 
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active Project Details Card */}
                            {(() => {
                              const currentProj = attendanceData[selectedDate].projects[activeProjectIdx];
                              if (!currentProj) {
                                return (
                                  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
                                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-600">
                                      <Activity className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                      <p className="font-extrabold font-manrope text-[#0F3D5E] text-sm">Pilih Proyek / Kegiatan</p>
                                      <p className="text-slate-400 max-w-sm">Tekan salah satu kartu proyek di atas untuk menampilkan detail pengerjaan, laporan aktivitas, serta dokumentasi foto dan video dari teknisi.</p>
                                    </div>
                                  </div>
                                );
                              }

                              const currentStyle = getProjectStyle(currentProj, true);

                              return (
                                <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-fade-in shadow-inner">
                                  
                                  {/* Project Header */}
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
                                    <div>
                                      <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg tracking-wider font-space border ${currentStyle.badgeCls}`}>
                                        {currentStyle.label}
                                      </span>
                                      <h3 className="font-manrope font-black text-[#0F3D5E] text-base sm:text-lg mt-2">
                                        {currentProj.name || `Project ${String.fromCharCode(65 + activeProjectIdx)}`}
                                      </h3>
                                    </div>
                                    <div className="text-xs font-bold font-space px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-650 shadow-sm flex flex-col items-end gap-0.5">
                                      <span className="text-[9px] text-slate-400 font-medium">WAKTU KUNJUNGAN</span>
                                      <span className="text-slate-850 font-extrabold">{currentProj.checkIn} - {currentProj.checkOut}</span>
                                    </div>
                                  </div>

                                  {/* ── MULTI-ACTIVITY: render each sub-activity as its own section ── */}
                                  {currentProj.activities && currentProj.activities.length > 0 ? (
                                    <div className="space-y-8">
                                      {currentProj.activities.map((act, actIdx) => {
                                        const isUrgentAct = act.type === 'urgent';
                                        const isPmAct = act.type === 'pm';
                                        const sectionBorder = isUrgentAct
                                          ? 'border-red-200 bg-red-50/30'
                                          : isPmAct
                                            ? 'border-blue-200 bg-blue-50/20'
                                            : 'border-slate-200 bg-white';
                                        const headerBg = isUrgentAct
                                          ? 'bg-red-500'
                                          : isPmAct
                                            ? 'bg-blue-600'
                                            : 'bg-slate-600';

                                        return (
                                          <div key={actIdx} className={`rounded-2xl border overflow-hidden ${sectionBorder}`}>
                                            {/* Activity Section Header */}
                                            <div className={`flex items-center justify-between px-5 py-3 ${headerBg}`}>
                                              <div className="flex items-center gap-2.5">
                                                <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md tracking-wider font-space border bg-white/20 text-white border-white/30`}>
                                                  {act.label || (isUrgentAct ? 'Darurat' : 'PM Chiller')}
                                                </span>
                                                <h4 className="font-manrope font-black text-white text-sm">{act.title}</h4>
                                              </div>
                                              <span className="text-[10px] font-bold font-space text-white/80 whitespace-nowrap bg-black/20 px-2.5 py-1 rounded-lg">
                                                {act.checkIn} – {act.checkOut}
                                              </span>
                                            </div>

                                            <div className="p-5 space-y-5">
                                              {/* Activity Images */}
                                              {act.images && act.images.length > 0 && (
                                                <div className="space-y-2">
                                                  <span className="text-slate-400 block font-space uppercase text-[9px] font-bold text-center">Dokumentasi Lapangan</span>
                                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                                    {act.images.slice(0, 3).map((imgUrl, imgIdx) => {
                                                      const isLastVis = imgIdx === 2 && act.images.length > 3;
                                                      const remaining = act.images.length - 3;
                                                      return (
                                                        <div
                                                          key={imgIdx}
                                                          onClick={() => {
                                                            setLightboxImages(act.images);
                                                            setActiveLightboxImageIdx(imgIdx);
                                                            setIsLightboxOpen(true);
                                                          }}
                                                          className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer aspect-video max-h-[140px] bg-slate-900"
                                                        >
                                                          {isVideoUrl(imgUrl) ? (
                                                            <video src={imgUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" muted playsInline />
                                                          ) : (
                                                            <img src={imgUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                          )}
                                                          {isLastVis ? (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                              <span className="text-white font-space font-black text-xs">+{remaining} Media</span>
                                                            </div>
                                                          ) : (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                              <span className="text-[8px] font-bold font-space bg-black/65 text-white px-1.5 py-0.5 rounded">Media {imgIdx + 1}</span>
                                                            </div>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}

                                              {/* Activity Info Grid */}
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Left: table */}
                                                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm text-xs">
                                                  <table className="w-full text-left border-collapse">
                                                    <thead>
                                                      <tr className="bg-slate-50 border-b border-slate-150 font-space font-bold text-[9px] uppercase tracking-wider text-slate-400">
                                                        <th className="p-3 w-1/3">Kategori</th>
                                                        <th className="p-3 w-2/3">Detail</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                      <tr>
                                                        <td className="p-3 font-bold text-slate-500 bg-slate-50/10">Unit HVAC</td>
                                                        <td className="p-3 font-extrabold text-[#0F3D5E] font-manrope">{currentProj.unit}</td>
                                                      </tr>
                                                      <tr>
                                                        <td className="p-3 font-bold text-slate-500 bg-slate-50/10">Masalah</td>
                                                        <td className="p-3 font-semibold text-slate-700 leading-normal">{act.issue}</td>
                                                      </tr>
                                                      <tr>
                                                        <td className="p-3 font-bold text-slate-500 bg-slate-50/10">Teknisi</td>
                                                        <td className="p-3 font-semibold text-slate-700">{act.technician}</td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>

                                                {/* Right: note + files */}
                                                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-xs flex flex-col gap-3">
                                                  <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Laporan Aktivitas</span>
                                                  <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{act.note}</p>
                                                  {act.files && act.files.length > 0 && (
                                                    <div className="space-y-2 pt-3 border-t border-slate-100">
                                                      <span className="text-[#0F3D5E] block font-space uppercase text-[9px] font-black tracking-wider">Laporan Hasil Kunjungan & Inspeksi</span>
                                                      <div className="space-y-1.5">
                                                        {act.files.map((file, fIdx) => (
                                                          <a
                                                            key={fIdx}
                                                            href={`#download-${file.name}`}
                                                            onClick={(e) => { e.preventDefault(); showToast(`Membuka: ${file.name}`, 'info'); }}
                                                            className="flex items-center justify-between p-2.5 bg-blue-50/40 hover:bg-blue-50 rounded-xl text-[11px] font-semibold text-[#0F3D5E] border border-blue-100 transition-colors shadow-sm"
                                                          >
                                                            <div className="flex items-center gap-1.5 truncate">
                                                              <FileText className="w-3.5 h-3.5 text-blue-650 shrink-0" />
                                                              <span className="truncate">{file.name}</span>
                                                            </div>
                                                            <span className="text-[8px] text-blue-750 shrink-0 bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold">{file.size}</span>
                                                          </a>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Divider between activities (except last) */}
                                            {actIdx < currentProj.activities.length - 1 && (
                                              <div className="mx-5 border-t-2 border-dashed border-slate-200" />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    /* ── SINGLE ACTIVITY (standard layout) ── */
                                    <div className="space-y-6">
                                      {/* Top: Media/Gallery Panel (Full Width) */}
                                      {currentProj.images && currentProj.images.length > 0 ? (
                                        <div className="space-y-3">
                                          <span className="text-slate-400 block font-space uppercase text-[9px] font-bold text-center">Galeri Dokumentasi Lapangan</span>
                                          
                                          {currentProj.images.length === 1 ? (
                                            <div 
                                              onClick={() => {
                                                setLightboxImages(currentProj.images);
                                                setActiveLightboxImageIdx(0);
                                                setIsLightboxOpen(true);
                                              }}
                                              className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-sm cursor-pointer aspect-video max-h-[220px] max-w-sm mx-auto bg-slate-900"
                                            >
                                              {isVideoUrl(currentProj.images[0]) ? (
                                                <video src={currentProj.images[0]} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" muted loop playsInline autoPlay />
                                              ) : (
                                                <img src={currentProj.images[0]} alt={currentProj.name} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" />
                                              )}
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                                <span className="text-[10px] font-bold font-space bg-black/60 text-white px-2.5 py-1 rounded backdrop-blur-sm">Lihat 1 Dokumentasi</span>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="space-y-3">
                                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                                                {currentProj.images.slice(0, 3).map((imgUrl, imgIdx) => {
                                                  const isLastVisible = imgIdx === 2 && currentProj.images.length > 3;
                                                  const remainingCount = currentProj.images.length - 3;
                                                  return (
                                                    <div 
                                                      key={imgIdx}
                                                      onClick={() => {
                                                        setLightboxImages(currentProj.images);
                                                        setActiveLightboxImageIdx(imgIdx);
                                                        setIsLightboxOpen(true);
                                                      }}
                                                      className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer aspect-video max-h-[140px] md:max-h-[180px] bg-slate-900"
                                                    >
                                                      {isVideoUrl(imgUrl) ? (
                                                        <video src={imgUrl} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" muted playsInline />
                                                      ) : (
                                                        <img src={imgUrl} alt="" className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" />
                                                      )}
                                                      {isLastVisible ? (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                                                          <span className="text-white font-space font-black text-xs sm:text-sm">+{remainingCount} Media</span>
                                                        </div>
                                                      ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                          <span className="text-[8px] font-bold font-space bg-black/65 text-white px-1.5 py-0.5 rounded">Media {imgIdx + 1}</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                              {currentProj.images.length > 3 && (
                                                <div className="flex gap-2 pb-1 overflow-x-auto justify-center">
                                                  {currentProj.images.slice(3).map((imgUrl, imgIdx) => {
                                                    const absoluteIdx = imgIdx + 3;
                                                    return (
                                                      <button key={absoluteIdx} type="button"
                                                        onClick={() => { setLightboxImages(currentProj.images); setActiveLightboxImageIdx(absoluteIdx); setIsLightboxOpen(true); }}
                                                        className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 hover:scale-105 transition-all shrink-0 bg-slate-950"
                                                      >
                                                        {isVideoUrl(imgUrl) ? <video src={imgUrl} className="w-full h-full object-cover" muted playsInline /> : <img src={imgUrl} alt="" className="w-full h-full object-cover" />}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="border border-slate-200/80 rounded-2xl p-6 text-center text-slate-455 bg-white text-xs">Tidak ada dokumentasi foto/video dari teknisi.</div>
                                      )}

                                      {/* Bottom: Information Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm text-xs">
                                            <table className="w-full text-left border-collapse">
                                              <thead>
                                                <tr className="bg-slate-50/70 border-b border-slate-150 font-space font-bold text-[9px] uppercase tracking-wider text-slate-400">
                                                  <th className="p-3.5 w-1/3">Kategori</th>
                                                  <th className="p-3.5 w-2/3">Keterangan / Detail</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-100">
                                                <tr>
                                                  <td className="p-3.5 font-bold text-slate-500 bg-slate-50/10">Unit HVAC</td>
                                                  <td className="p-3.5 font-extrabold text-[#0F3D5E] font-manrope">{currentProj.unit || "Unit Gedung (Umum)"}</td>
                                                </tr>
                                                <tr>
                                                  <td className="p-3.5 font-bold text-slate-500 bg-slate-50/10">Masalah / Tiket</td>
                                                  <td className="p-3.5 font-semibold text-slate-700 leading-normal">{currentProj.issue || currentProj.name}</td>
                                                </tr>
                                                <tr>
                                                  <td className="p-3.5 font-bold text-slate-500 bg-slate-50/10">Teknisi Lapangan</td>
                                                  <td className="p-3.5 font-semibold text-slate-700">{currentProj.technician || "Belum Ditugaskan"}</td>
                                                </tr>
                                                <tr>
                                                  <td className="p-3.5 font-bold text-slate-500 bg-slate-50/10">Assign by AO</td>
                                                  <td className="p-3.5 font-semibold text-slate-700 flex items-center gap-2">
                                                    <span className="bg-blue-100 text-blue-850 text-[9px] font-black px-1.5 py-0.5 rounded font-space">AO-2026-4421</span>
                                                    <span className="font-bold text-slate-800">Ahmad Fauzi (Sales Officer)</span>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs h-full flex flex-col justify-between">
                                            <div>
                                              <div className="flex justify-between items-center mb-2">
                                                <span className="text-slate-400 font-space uppercase text-[9px] font-bold">Laporan Aktivitas & Tindakan</span>
                                                <button
                                                  onClick={() => {
                                                    setSelectedTechReport({
                                                      date: selectedDate,
                                                      unit: currentProj.unit || 'Unit Gedung (Umum)',
                                                      technician: currentProj.technician || 'Supriadi & Team',
                                                      ao: 'AO-2026-4421',
                                                      type: (currentProj.name + ' ' + currentProj.issue).toLowerCase().includes('pm') ? 'Preventive Maintenance (PM)' : 'Repair / Perbaikan',
                                                      details: currentProj.note
                                                    });
                                                    setShowTechReportModal(true);
                                                  }}
                                                  className="text-[9px] font-black font-space uppercase tracking-wide bg-[#8DC63F] text-[#0F3D5E] px-2.5 py-1.5 rounded-lg border border-[#8DC63F] hover:bg-[#7db237] transition-all"
                                                >
                                                  Form Laporan Harian
                                                </button>
                                              </div>
                                              <p className="text-slate-700 font-medium leading-relaxed">{currentProj.note}</p>
                                            </div>
                                            {currentProj.files && currentProj.files.length > 0 && (
                                              <div className="space-y-2.5 mt-4 pt-3 border-t border-slate-100">
                                                <span className="text-[#0F3D5E] block font-space uppercase text-[9px] font-black tracking-wider">Laporan Hasil Kunjungan & Inspeksi</span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  {currentProj.files.map((file, fIdx) => (
                                                    <a key={fIdx} href={`#download-${file.name}`}
                                                      onClick={(e) => { e.preventDefault(); showToast(`Membuka/Mengunduh berkas: ${file.name}`, 'info'); }}
                                                      className="flex items-center justify-between p-2.5 bg-blue-50/40 hover:bg-blue-50 rounded-xl text-[11px] font-semibold text-[#0F3D5E] border border-blue-100 transition-colors shadow-sm"
                                                    >
                                                      <div className="flex items-center gap-1.5 truncate">
                                                        <FileText className="w-3.5 h-3.5 text-blue-650 shrink-0" />
                                                        <span className="truncate">{file.name}</span>
                                                      </div>
                                                      <span className="text-[8px] text-blue-750 shrink-0 bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold">{file.size}</span>
                                                    </a>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons inside Report */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-200/50">
                                    <a 
                                      href={`https://wa.me/628117710113?text=Halo%20Admin%20PT.%20ASA,%20saya%20ingin%20menanyakan%20mengenai%20laporan%20inspeksi%20tanggal%20${selectedDate}.`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="py-3 px-4 border border-slate-250 hover:border-slate-400 bg-white text-slate-700 font-bold font-space text-xs text-center transition-all flex items-center justify-center gap-2 rounded-none shadow-sm"
                                    >
                                      <PhoneCall className="w-4 h-4 text-slate-500" />
                                      Hubungi Admin (Contact Us)
                                    </a>

                                    <a 
                                      href={`https://wa.me/628117710113?text=EMERGENCY%20BREAKDOWN!%20Laporan%20Inspeksi%20Kritis%20pada%20tanggal%20${selectedDate}%20butuh%20tindakan%20segera.`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="py-3 px-4 bg-red-650 hover:bg-red-750 text-white font-extrabold font-space text-xs text-center transition-all flex items-center justify-center gap-2 rounded-none shadow-md"
                                    >
                                      <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                                      TOMBOL DARURAT
                                    </a>
                                  </div>

                                </div>
                              );
                            })()}

                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl py-12 text-center text-slate-400 text-xs font-medium">
                            Tidak ada kunjungan teknisi pada tanggal ini.
                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                  {/* Quick Device List Panel */}
                  <div className="space-y-4">
                    <h3 className="font-manrope font-bold text-sm text-[#0F3D5E]">Daftar Aset Unit (3 Terpasang)</h3>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                      {customerData.assets.map(asset => (
                        <div key={asset.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                          <div>
                            <h4 className="font-semibold text-sm text-[#0F3D5E]">{asset.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.id} • {asset.spec}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg tracking-wider font-space ${
                            asset.status === 'Optimal' ? 'bg-emerald-50/10 border border-emerald-50/20 text-emerald-600' : 'bg-amber-50/10 border border-amber-50/20 text-amber-600'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Assets List TAB */}
              {activeTab === 'assets' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Daftar Aset Unit HVACR</h2>
                      <p className="text-slate-400 text-xs mt-1">Daftar inventori unit pendingin industri yang dipasang dan dikelola oleh PT. ASA.</p>
                    </div>
                    <button
                      onClick={() => setShowAddAssetModal(true)}
                      className="px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#184a6e] text-white text-xs font-extrabold uppercase font-space tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Unit HVAC (Manual)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.map(asset => (
                      <div 
                        key={asset.id} 
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover:shadow-md ${
                          selectedAsset?.id === asset.id ? 'border-[#3B82F6] bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2 items-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono font-bold">{asset.id}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-space font-black uppercase tracking-wide">
                              {asset.category || 'PM'}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-lg tracking-wider font-space ${
                            asset.status === 'Optimal' ? 'bg-emerald-50/10 text-emerald-600' : 'bg-amber-50/10 text-amber-600'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                        <h4 className="font-manrope font-black text-slate-800 text-sm">{asset.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{asset.spec}</p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                          <span>Lokasi: <strong>{asset.location}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Asset Details Sub-Panel */}
                  {selectedAsset && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-6 space-y-4 text-left animate-fade-in">
                      <div className="border-b border-slate-200/50 pb-3">
                        <h3 className="font-manrope font-bold text-sm text-[#0F3D5E] uppercase tracking-wide font-space">Detail Spesifikasi Aset</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Sertifikat garansi resmi dan tanggal inspeksi rutin.</p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        {selectedAsset.image && (
                          <div className="w-full md:w-48 h-48 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                            <img 
                              src={selectedAsset.image} 
                              alt={selectedAsset.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Nama Model</span>
                            <span className="font-bold text-slate-700">{selectedAsset.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Detail Kapasitas</span>
                            <span className="font-bold text-slate-700">{selectedAsset.spec}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Tanggal Instalasi</span>
                            <span className="font-bold text-slate-700">{selectedAsset.installDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Masa Garansi</span>
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              {selectedAsset.warrantyUntil}
                              <span className="text-[9px] font-extrabold uppercase font-space text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Lokasi Unit</span>
                            <span className="font-bold text-slate-700">{selectedAsset.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-space uppercase text-[9px] font-bold">Inspeksi Terakhir</span>
                            <span className="font-bold text-slate-700">{selectedAsset.lastServiced}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Service Tickets TAB */}
              {activeTab === 'tickets' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black font-manrope text-[#0F3D5E]">Riwayat Tiket Servis & PM</h2>
                    <p className="text-slate-400 text-xs mt-1">Daftar penanganan keluhan teknis (Troubleshooting) dan Perawatan Berkala (Preventive Maintenance).</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-space font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-2">Tiket ID</th>
                          <th className="pb-3">Jenis Kerusakan</th>
                          <th className="pb-3">Unit HVAC</th>
                          <th className="pb-3">Tanggal Kerja</th>
                          <th className="pb-3">Prioritas</th>
                          <th className="pb-3 text-right pr-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tickets.map(ticket => (
                          <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 pl-2 font-mono font-bold text-slate-800">{ticket.id}</td>
                            <td className="py-4 font-semibold text-slate-700">{ticket.type}</td>
                            <td className="py-4 text-slate-500">{ticket.unit}</td>
                            <td className="py-4 text-slate-400">{ticket.date}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold font-space uppercase ${
                                ticket.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-200/30' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="py-4 text-right pr-2">
                              <span className={`px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase font-space border ${
                                ticket.status === 'Completed' 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : ticket.status === 'In Progress'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}>
                                {ticket.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Service Request Form TAB */}
              {activeTab === 'request' && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div>
                    <h2 className="text-xl font-black font-manrope text-[#0C3254] flex items-center gap-2">
                      <PhoneCall className="w-5 h-5 text-[#8DC63F]" />
                      Hubungi Admin & Pusat Bantuan Darurat
                    </h2>
                    <p className="text-slate-450 text-xs mt-1">Halaman ini menyediakan akses langsung ke kontak darurat admin PT. ASA serta tips pemecahan masalah mandiri untuk unit HVAC Anda.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Contact Admin */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* N8N Workflow & JWT Secure Token Panel */}
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
                        <h3 className="text-xs font-black font-space text-[#0F3D5E] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                          <span>Status Otomasi Penanganan Darurat</span>
                          <span className="flex items-center gap-1.5 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full lowercase font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            {n8nStatus}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-450 leading-relaxed">
                          Alur pengiriman pesan dan pengkondisian tiket dihubungkan langsung ke sistem otomatisasi <strong>N8N</strong> untuk integrasi bot ke tim lapangan.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase font-space">Security Authorization</span>
                            <div className="text-xs font-mono font-bold text-slate-700 truncate" title={jwtToken}>
                              {jwtToken}
                            </div>
                            <span className="inline-block text-[8px] font-black bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-space">JWT KEY ASSIGNED</span>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase font-space">Nominal Delivery Order (DO)</span>
                            <div className="text-sm font-black font-manrope text-[#0F3D5E]">
                              {nominalDO}
                            </div>
                            <span className="inline-block text-[8px] font-black bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-space">EST. PENANGANAN</span>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Call Box - Brand Identity: #0F3D5E navy + #2563EB blue + #8DC63F green */}
                      <div className="relative text-white p-6 rounded-none space-y-5 overflow-hidden" style={{background: 'linear-gradient(135deg, #0F3D5E 0%, #1a5276 60%, #1e3a8a 100%)'}}>
                        {/* Decorative gear icon watermark */}
                        <div className="absolute -right-4 -top-4 w-28 h-28 opacity-5">
                          <svg viewBox="0 0 100 100" fill="white"><path d="M50 10 L58 25 L75 20 L70 37 L85 45 L70 53 L75 70 L58 65 L50 80 L42 65 L25 70 L30 53 L15 45 L30 37 L25 20 L42 25 Z"/></svg>
                        </div>
                        <div className="absolute -right-2 -bottom-8 w-36 h-36 opacity-[0.04] rounded-full border-4 border-white"></div>

                        <div className="space-y-2 relative">
                          <h3 className="text-lg font-black font-manrope leading-snug">
                            Hubungi Admin<br/>
                            <span style={{color: '#8DC63F'}}>PT. Artha Solusi Aditama</span>
                          </h3>
                          <p className="text-blue-100 text-xs leading-relaxed">
                            Jika unit HVAC Anda mengalami kerusakan kritis (Breakdown) atau mati total, silakan hubungi tim helpdesk kami langsung untuk penanganan instan.
                          </p>
                        </div>

                        <div className="space-y-3 pt-1 relative">
                          <a 
                            href="https://wa.me/6281234567890?text=Halo%20Admin%20PT%20ASA,%20kami%20memerlukan%20bantuan%20darurat%20untuk%20unit%20HVAC%20kami%20yang%20mengalami%20masalah."
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3.5 font-extrabold text-xs uppercase font-space rounded-none transition-all tracking-wider shadow-lg hover:brightness-110 hover:scale-[1.01]"
                            style={{background: '#25D366', color: '#fff'}}
                          >
                            <PhoneCall className="w-4 h-4" />
                            Hubungi via Whatsapp (Respon Cepat)
                          </a>
                          <a 
                            href="tel:0215558829"
                            className="flex items-center justify-center gap-2 w-full py-2.5 font-bold text-xs uppercase font-space rounded-none transition-all tracking-wide border hover:brightness-125"
                            style={{borderColor: 'rgba(255,255,255,0.2)', color: 'white', background: 'rgba(255,255,255,0.07)'}}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            Telepon Hotline: 021-555-8829
                          </a>

                          <div className="border-t pt-3 mt-1 grid grid-cols-2 gap-4 text-xs" style={{borderColor: 'rgba(255,255,255,0.12)'}}>
                            <div>
                              <div className="text-[10px] font-bold uppercase font-space" style={{color: '#8DC63F'}}>Jam Operasional</div>
                              <div className="font-bold text-white mt-0.5">24 Jam / 7 Hari</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase font-space" style={{color: '#8DC63F'}}>Email Helpdesk</div>
                              <div className="font-bold text-white mt-0.5 text-[11px]">service@arthasolusi.co.id</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Tips & Solutions */}
                    <div className="lg:col-span-6 space-y-5">
                      <div className="border border-slate-200 bg-white p-6 rounded-none space-y-5">
                        <h3 className="text-sm font-black font-space text-[#0C3254] uppercase tracking-wide border-b border-slate-100 pb-3">
                          Panduan Solusi & Tips Mandiri
                        </h3>

                        {/* FAQ 1 */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Bagaimana jika AC tidak dingin atau tidak panas?
                          </h4>
                          <div className="text-slate-500 text-xs leading-relaxed space-y-1.5 pl-4">
                            <p>Jika unit AC tidak mengeluarkan udara dingin atau panas sesuai pengaturan remote, lakukan pemeriksaan mandiri berikut:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-500">
                              <li><strong>Periksa Mode Remote</strong>: Pastikan remote control diatur ke mode **COOL** (pendinginan) atau **HEAT** (pemanasan) dengan benar.</li>
                              <li><strong>Periksa Filter Udara</strong>: Jika filter tersumbat debu, cuci filter agar sirkulasi udara lancar kembali.</li>
                              <li><strong>Periksa Unit Outdoor</strong>: Pastikan kipas pembuangan unit outdoor tidak terhalang oleh barang-barang di sekelilingnya.</li>
                              <li><strong>Periksa Panel Listrik</strong>: Periksa apakah sekring listrik (MCB) untuk unit AC dalam keadaan trip/off.</li>
                            </ol>
                          </div>
                        </div>

                        {/* FAQ 2 */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Bagaimana jika unit AC mengeluarkan suara bising?
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed pl-4">
                            Suara bising biasanya ditimbulkan oleh getaran penutup unit atau komponen blower yang kotor/aus. Bersihkan filter terlebih dahulu. Jika suara bising masih berlanjut, hubungi admin untuk melakukan pengecekan motor fan demi menghindari kerusakan lebih parah.
                          </p>
                        </div>

                        {/* FAQ 3 */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Kapan unit HVAC perlu perawatan intensif?
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed pl-4">
                            Sangat disarankan untuk melakukan perawatan berkala (cuci unit dan inspeksi tekanan freon) setiap **3 bulan sekali** untuk menjaga efisiensi konsumsi daya listrik serta mencegah kerusakan sistem kompresor utama.
                          </p>
                        </div>

                        {/* FAQ 4 */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Mengapa unit AC indoor mengeluarkan tetesan air (bocor)?
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed pl-4">
                            Tetesan air biasanya disebabkan oleh saluran drainase kondensat yang tersumbat debu atau lumut, sehingga air penampungan meluap. Pembersihan saringan air dan penyemprotan pipa drainase oleh teknisi kami akan langsung menyelesaikan masalah ini.
                          </p>
                        </div>

                        {/* FAQ 5 */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Apa yang harus dilakukan jika AC berbau kurang sedap?
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed pl-4">
                            Bau kurang sedap biasanya timbul dari akumulasi kuman atau bakteri pada koil evaporator atau saluran udara akibat kelembapan tinggi. Gunakan pembersih anti-bakteri saat pencucian AC berkala atau hubungi kami untuk desinfeksi menyeluruh.
                          </p>
                        </div>

                        {/* FAQ 6 */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h4 className="text-xs font-extrabold text-slate-805 flex items-start gap-1.5 leading-snug">
                            <span className="text-[#8DC63F] font-black font-space">Q:</span>
                            Bagaimana cara memantau progres tiket servis yang dikirim?
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed pl-4">
                            Setiap keluhan yang telah dikonfirmasi akan tercantum di tab **"Tiket Servis & PM"** pada dasbor Anda. Anda dapat melihat status pekerjaan dari persiapan teknisi hingga selesai secara real-time.
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents & Reports TAB */}
              {activeTab === 'docs' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Section 2: Invoice & Transaksi Resmi */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-black font-manrope text-[#0C3254]">Katalog PO & Invoice Resmi</h2>
                      <p className="text-slate-400 text-xs mt-1">Kelola dan telusuri dokumen Purchase Order (PO) serta Invoice dari setiap transaksi bisnis Anda.</p>
                    </div>

                    {/* Filter Tab Bar - Interactive & Custom Styled */}
                    <div className="flex border border-slate-200 bg-slate-50 rounded-none p-1 gap-1">
                      {[
                        { id: 'all', label: 'Semua Dokumen' },
                        { id: 'paid', label: 'Sudah Dibayar' },
                        { id: 'unpaid', label: 'Belum Dibayar' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setDocFilter(f.id)}
                          className={`flex-1 md:flex-none text-center px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                            docFilter === f.id
                              ? 'bg-[#0C3254] text-white shadow-sm font-black'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                          }`}
                        >
                          {f.label}
                          {f.id === 'unpaid' && unpaidCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black">{unpaidCount}</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Unpaid Invoice Alert Banner — Professional B2B */}
                    {docFilter !== 'paid' && unpaidCount > 0 && (
                      <div
                        className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 cursor-pointer group"
                        style={{
                          background: '#0F3D5E',
                          borderRadius: '0',
                        }}
                        onClick={() => setDocFilter('unpaid')}
                      >
                        {/* Subtle gear watermark */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none w-20 h-20">
                          <svg viewBox="0 0 100 100" fill="white"><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="22" fill="#0F3D5E"/><rect x="46" y="4" width="8" height="16" rx="2" fill="white"/><rect x="46" y="80" width="8" height="16" rx="2" fill="white"/><rect x="4" y="46" width="16" height="8" rx="2" fill="white"/><rect x="80" y="46" width="16" height="8" rx="2" fill="white"/></svg>
                        </div>

                        {/* Left: icon + text */}
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Icon block */}
                          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{background: '#DC2626'}}>
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-manrope font-extrabold text-white text-sm leading-tight">
                                {unpaidCount} Invoice Belum Dibayar
                              </span>
                            </div>
                            <p className="text-blue-200 text-xs mt-0.5 font-inter leading-relaxed">
                              Total tagihan belum lunas:&nbsp;
                              <strong className="text-white font-extrabold font-manrope">{unpaidTotalStr}</strong>
                              &nbsp;— segera selesaikan untuk menjaga kelancaran layanan kontrak.
                            </p>
                          </div>
                        </div>

                        {/* Right: CTA */}
                        <button
                          type="button"
                          className="shrink-0 flex items-center gap-2 px-4 py-2 font-manrope font-extrabold text-xs rounded-lg border-2 transition-all group-hover:brightness-110 whitespace-nowrap"
                          style={{
                            borderColor: '#8DC63F',
                            color: '#8DC63F',
                            background: 'rgba(141,198,63,0.08)'
                          }}
                          onClick={(e) => { e.stopPropagation(); setDocFilter('unpaid'); }}
                        >
                          Lihat Detail Tagihan
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}


                    <div className="overflow-x-auto border border-slate-200 rounded-none bg-white">
                      <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-space font-bold uppercase tracking-wider text-slate-400">
                            <th className="p-4">No. Invoice</th>
                            <th className="p-4">No. AO & PO</th>
                            <th className="p-4">Deskripsi Pekerjaan / Layanan</th>
                            <th className="p-4">Tanggal & Nominal</th>
                            <th className="p-4 text-center">Status Transaksi</th>
                            <th className="p-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {invoices
                           .filter(inv => {
                            if (docFilter === 'paid') return inv.status === 'Sudah Dibayar';
                            if (docFilter === 'unpaid') return inv.status === 'Belum Dibayar';
                            return true;
                          })
                          .sort((a, b) => {
                            // Unpaid always floats to the top
                            if (a.status === 'Belum Dibayar' && b.status !== 'Belum Dibayar') return -1;
                            if (a.status !== 'Belum Dibayar' && b.status === 'Belum Dibayar') return 1;
                            return 0;
                          })
                          .map((inv, idx) => (
                            <tr
                              key={idx}
                              className="transition-colors"
                              style={inv.status === 'Belum Dibayar' ? {background: '#FFFBEB'} : {}}
                            >
                              <td className="p-4 font-mono font-bold text-slate-800">
                                {inv.status === 'Belum Dibayar' && (
                                  <span className="block text-[9px] font-black uppercase font-space mb-0.5" style={{color: '#DC2626'}}>● Belum Lunas</span>
                                )}
                                {inv.id}
                              </td>
                              <td className="p-4 space-y-1.5">
                                <div className="flex items-center gap-1.5"><span className="text-[9px] px-1.5 py-0.5 font-black rounded-sm" style={{background: '#E2E8F0', color: '#475569'}}>AO</span> <strong className="font-mono text-slate-800 text-xs">{inv.ao}</strong></div>
                                <div className="flex items-center gap-1.5"><span className="text-[9px] px-1.5 py-0.5 font-black rounded-sm" style={{background: '#DBEAFE', color: '#1D4ED8'}}>PO</span> <strong className="font-mono text-slate-800 text-xs">{inv.po}</strong></div>
                              </td>
                              <td className="p-4 text-slate-700 font-bold max-w-[220px] truncate" title={inv.title}>{inv.title}</td>
                              <td className="p-4 space-y-0.5">
                                <div className="text-slate-400 text-xs">{inv.date}</div>
                                <div className="font-black text-sm font-manrope" style={{color: inv.status === 'Belum Dibayar' ? '#DC2626' : '#0F3D5E'}}>{inv.amount}</div>
                              </td>
                              <td className="p-4 text-center">
                                {inv.status === 'Sudah Dibayar' ? (
                                  <span
                                    className="badge-paid inline-flex items-center gap-1.5 px-3 py-1.5 font-manrope font-extrabold text-[11px] tracking-wide text-white rounded-lg select-none"
                                    style={{background: '#8DC63F', letterSpacing: '0.04em'}}
                                  >
                                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    Sudah Dibayar
                                  </span>
                                ) : (
                                  <span
                                    className="badge-unpaid inline-flex items-center gap-1.5 px-3 py-1.5 font-manrope font-extrabold text-[11px] tracking-wide text-white rounded-lg select-none"
                                    style={{background: '#DC2626', letterSpacing: '0.04em'}}
                                  >
                                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                                    Belum Dibayar
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-center flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                {inv.status === 'Belum Dibayar' && (
                                  <button 
                                    onClick={() => {
                                      setSelectedInvoiceForPayment(inv);
                                      setPaymentStep(1);
                                      setShowPaymentModal(true);
                                    }}
                                    className="text-[10px] font-black font-space uppercase px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs transition-all"
                                  >
                                    Bayar PO
                                  </button>
                                )}
                                <button onClick={() => showToast(`Mengunduh Invoice ${inv.id}`, 'info')} className="text-[10px] font-bold font-space uppercase px-3 py-1.5 border border-slate-200 rounded-none hover:bg-[#0C3254] hover:border-[#0C3254] hover:text-white transition-all text-slate-600 shadow-sm whitespace-nowrap">
                                  Unduh ({inv.size})
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ─── TAB: PENGATURAN PROFIL ─── */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div>
                    <h2 className="text-xl font-black font-manrope" style={{color: '#0F3D5E'}}>Pengaturan Profil</h2>
                    <p className="text-slate-400 text-xs mt-1">Perbarui data identitas PIC dan pengaturan akun kontrak B2B Anda.</p>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-6">

                    {/* Success Banner */}
                    {profileSaveSuccess && (
                      <div className="p-4 flex items-center gap-3 rounded-xl text-xs font-bold animate-fade-in" style={{background: '#f0fdf4', border: '1px solid #86efac', color: '#166534'}}>
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{color: '#16a34a'}} />
                        Profil berhasil diperbarui!
                      </div>
                    )}

                    {/* Profile Picture Card */}
                    <div className="flex items-center gap-5 p-5 rounded-2xl" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}>
                      <div
                        className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed hover:border-[#0F3D5E] transition-all"
                        style={{borderColor: '#cbd5e1', background: '#fff'}}
                        onClick={() => profileFileRef.current?.click()}
                      >
                        {profileData.profilePic ? (
                          <img src={profileData.profilePic} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-black font-manrope" style={{color: '#1D4E8F', background: 'linear-gradient(135deg,#dbeafe,#eff6ff)'}}>
                            {profileData.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-sm font-manrope" style={{color: '#0F3D5E'}}>Foto Profil PIC</p>
                        <p className="text-slate-400 text-xs mt-0.5">Klik untuk unggah foto identitas Anda (JPG/PNG).</p>
                        <button
                          type="button"
                          onClick={() => profileFileRef.current?.click()}
                          className="mt-2 px-3 py-1.5 text-xs font-bold rounded-lg border hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-all"
                          style={{background: '#fff', borderColor: '#e2e8f0', color: '#475569'}}
                        >
                          <Camera className="w-3.5 h-3.5 inline mr-1" />Pilih Foto
                        </button>
                        <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                      </div>
                    </div>

                    {/* Info Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Nama PIC */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Nama PIC</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={e => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all"
                          style={{borderColor: profileErrors.name ? '#DC2626' : '#e2e8f0', background: '#fff'}}
                          onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                          onBlur={e => e.target.style.borderColor = profileErrors.name ? '#DC2626' : '#e2e8f0'}
                        />
                        {profileErrors.name && <p className="text-xs mt-1" style={{color:'#DC2626'}}>{profileErrors.name}</p>}
                      </div>

                      {/* Nama Perusahaan */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Nama Perusahaan</label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={e => setProfileData({...profileData, company: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all"
                          style={{borderColor: '#e2e8f0', background: '#fff'}}
                          onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={e => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all"
                          style={{borderColor: profileErrors.email ? '#DC2626' : '#e2e8f0', background: '#fff'}}
                          onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                          onBlur={e => e.target.style.borderColor = profileErrors.email ? '#DC2626' : '#e2e8f0'}
                        />
                        {profileErrors.email && <p className="text-xs mt-1" style={{color:'#DC2626'}}>{profileErrors.email}</p>}
                      </div>

                      {/* Telepon */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Nomor Telepon</label>
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={e => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all"
                          style={{borderColor: profileErrors.phone ? '#DC2626' : '#e2e8f0', background: '#fff'}}
                          onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                          onBlur={e => e.target.style.borderColor = profileErrors.phone ? '#DC2626' : '#e2e8f0'}
                        />
                        {profileErrors.phone && <p className="text-xs mt-1" style={{color:'#DC2626'}}>{profileErrors.phone}</p>}
                      </div>

                      {/* Alamat — full width */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Alamat Kantor</label>
                        <textarea
                          rows={2}
                          value={profileData.address}
                          onChange={e => setProfileData({...profileData, address: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all resize-none"
                          style={{borderColor: '#e2e8f0', background: '#fff'}}
                          onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="p-5 rounded-2xl space-y-4" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}>
                      <h3 className="text-xs font-black font-space uppercase tracking-wider flex items-center gap-2" style={{color: '#0F3D5E'}}>
                        <Lock className="w-3.5 h-3.5" /> Ubah Password
                        <span className="text-slate-400 font-normal normal-case tracking-normal">(Kosongkan jika tidak ingin mengubah)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Password Baru</label>
                          <div className="relative">
                            <input
                              type={showPass ? 'text' : 'password'}
                              value={profileData.password}
                              onChange={e => setProfileData({...profileData, password: e.target.value})}
                              className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border outline-none transition-all"
                              style={{borderColor: profileErrors.password ? '#DC2626' : '#e2e8f0', background: '#fff'}}
                              onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                              onBlur={e => e.target.style.borderColor = profileErrors.password ? '#DC2626' : '#e2e8f0'}
                              placeholder="Min. 8 karakter"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {profileErrors.password && <p className="text-xs mt-1" style={{color:'#DC2626'}}>{profileErrors.password}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-space" style={{color: '#64748b'}}>Konfirmasi Password</label>
                          <div className="relative">
                            <input
                              type={showConfirm ? 'text' : 'password'}
                              value={profileData.confirm}
                              onChange={e => setProfileData({...profileData, confirm: e.target.value})}
                              className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border outline-none transition-all"
                              style={{borderColor: profileErrors.confirm ? '#DC2626' : '#e2e8f0', background: '#fff'}}
                              onFocus={e => e.target.style.borderColor = '#0F3D5E'}
                              onBlur={e => e.target.style.borderColor = profileErrors.confirm ? '#DC2626' : '#e2e8f0'}
                              placeholder="Ulangi password"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {profileErrors.confirm && <p className="text-xs mt-1" style={{color:'#DC2626'}}>{profileErrors.confirm}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="px-6 py-2.5 text-sm font-bold rounded-xl border transition-all hover:bg-slate-50"
                        style={{borderColor: '#e2e8f0', color: '#475569'}}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-black font-space uppercase tracking-wider rounded-xl transition-all hover:brightness-110 flex items-center gap-2 shadow-md"
                        style={{background: '#0F3D5E', color: '#fff'}}
                      >
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          </div>

          {/* Footer Contact Panel */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200 pt-8 text-xs text-slate-400">
            <p>© 2026 PT. Artha Solusi Aditama. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-bold justify-center md:justify-end">
              <div>Email Support: <a href="mailto:service@pt-asa.com" className="text-slate-700 hover:underline">service@pt-asa.com</a></div>
              <div>Hotline Kantor: <span className="text-slate-700">+62 811-7710-113</span></div>
            </div>
          </div>

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

      {/* ─── BELL NOTIFICATION MODAL ─── */}
      {isBellModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            aria-label="Tutup Notifikasi" onClick={() => setIsBellModalOpen(false)}
          />

          {/* Modal Panel */}
          <div
            className="fixed top-[124px] right-4 sm:right-6 lg:right-8 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
            style={{border: '1px solid #e2e8f0', background: '#fff'}}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{background: '#0F3D5E'}}>
              <div className="flex items-center gap-3">
                {/* Replica of header bell button */}
                <div className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-[#1D4E8F] shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center border border-[#0F3D5E]">
                    {unpaidCount}
                  </span>
                </div>
                <div>
                  <div className="font-manrope font-extrabold text-white text-sm leading-tight">Notifikasi Tagihan</div>
                  <div className="text-blue-200 text-[10px] font-space font-black uppercase tracking-wider mt-0.5">{unpaidCount} INVOICE BELUM DIBAYAR</div>
                </div>
              </div>
              <button
                aria-label="Tutup Notifikasi" onClick={() => setIsBellModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice List */}
            <div className="divide-y divide-slate-100">
              {unpaidInvoices.map((inv, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Invoice ID + badge */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono font-bold text-slate-700 text-xs">{inv.id}</span>
                        <span className="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide text-white" style={{background: '#DC2626'}}>
                          BELUM LUNAS
                        </span>
                      </div>
                      {/* Description */}
                      <p className="text-xs text-slate-600 font-manrope leading-snug mb-2.5">{inv.title}</p>
                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400">
                        <span>{inv.date}</span>
                        <span className="font-extrabold font-manrope" style={{color: '#DC2626'}}>{inv.amount}</span>
                        <span>
                          <span className="font-bold" style={{color: '#D97706'}}>{inv.daysOverdue} hari</span> terlambat
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* CTA per invoice */}
                  <button
                    onClick={() => {
                      setIsBellModalOpen(false);
                      setActiveTab('docs');
                      setDocFilter('unpaid');
                    }}
                    className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 font-manrope font-extrabold text-[11px] rounded-lg transition-all hover:brightness-105"
                    style={{background: '#EFF6FF', color: '#0F3D5E', border: '1px solid #BFDBFE'}}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Lihat di Katalog PO
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 flex items-center justify-between" style={{background: '#f8fafc', borderTop: '1px solid #e2e8f0'}}>
              <span className="text-xs text-slate-400 font-inter">
                Total: <strong className="font-manrope font-extrabold" style={{color: '#DC2626'}}>{unpaidTotalStr}</strong>
              </span>
              <button
                onClick={() => {
                  setIsBellModalOpen(false);
                  setActiveTab('docs');
                  setDocFilter('unpaid');
                }}
                className="flex items-center gap-1.5 px-4 py-2 font-manrope font-extrabold text-xs rounded-lg transition-all hover:brightness-110 text-white shadow-sm"
                style={{background: '#0F3D5E'}}
              >
                Lihat Semua Tagihan
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {showBellToast && unpaidCount > 0 && (
        <div
          className="fixed bottom-24 right-6 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-2xl shadow-2xl animate-fade-in cursor-pointer hover:brightness-105 transition-all w-[340px] max-w-[calc(100vw-3rem)]"
          style={{ background: '#0F3D5E', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={() => {
            setIsBellModalOpen(true);
            setShowBellToast(false);
          }}
        >
          <div className="flex items-center gap-3">
            {/* Red Bell Icon Box */}
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-md shrink-0"
              style={{ background: '#DC2626' }}
            >
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-manrope font-extrabold text-white text-sm leading-tight">
                Notifikasi Tagihan
              </div>
              <div className="text-blue-300 text-[10px] font-space font-black uppercase tracking-wider mt-0.5">
                {unpaidCount} INVOICE BELUM DIBAYAR
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBellToast(false);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-300 hover:text-white hover:bg-white/10 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── B2B WORKFLOW MODALS ─── */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        invoice={selectedInvoiceForPayment} 
        onPaymentSuccess={(invId) => {
          // Update invoice state to paid
          setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: 'Sudah Dibayar' } : inv));
          showToast('Pembayaran berhasil diverifikasi secara otomatis!', 'success');
        }} 
      />

      <AddAssetModal 
        isOpen={showAddAssetModal} 
        onClose={() => setShowAddAssetModal(false)} 
        onAddAsset={(newAsset) => {
          setAssets(prev => [newAsset, ...prev]);
          showToast('Aset unit HVAC baru berhasil didaftarkan!', 'success');
        }} 
      />

      <TechReportModal 
        isOpen={showTechReportModal} 
        onClose={() => setShowTechReportModal(false)} 
        report={selectedTechReport} 
      />

      {/* Toast Notification */}
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

      {/* B2B Floating Chatbot Widget */}
      <ChatbotWidget type="b2b" />
    </div>
  );
}

// ─── HELPER COMPONENTS FOR B2B WORKFLOW MODALS ───

// 1. ASSIGN PEMBAYARAN MODAL
function PaymentModal({ isOpen, onClose, invoice, onPaymentSuccess }) {
  const [step, setStep] = React.useState(1);
  const [file, setFile] = React.useState(null);
  const [bank, setBank] = React.useState('Mandiri');
  const [error, setError] = React.useState('');

  if (!isOpen || !invoice) return null;

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) { setError('Silakan unggah bukti transfer terlebih dahulu.'); return; }
    setError('');
    
    // Simulate Assigning Payment -> Verification -> Success
    setStep(2);
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        onPaymentSuccess(invoice.id);
        setStep(1);
        setFile(null);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 text-xs font-semibold">
        <div className="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-extrabold text-sm font-manrope">Assign Pembayaran PO</h3>
          <button aria-label="Tutup Modal" onClick={onClose} className="text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {step === 1 && (
          <form onSubmit={handleUpload} className="p-6 space-y-4" novalidate>
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase font-space block">Invoice Terpilih</span>
              <strong className="text-slate-800 font-mono text-sm block mt-0.5">{invoice.id}</strong>
              <span className="text-slate-500 block mt-1 leading-normal">{invoice.title}</span>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between text-xs">
                <span className="text-slate-450">Nominal Tagihan:</span>
                <strong className="text-red-600 font-manrope font-black">{invoice.amount}</strong>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1.5 font-space uppercase text-[9px] font-bold">Pilih Rekening Tujuan ASA</label>
              <select 
                value={bank} 
                onChange={(e) => setBank(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#8DC63F]"
              >
                <option value="Mandiri">Bank Mandiri — 109-00-1234567-8 (PT. Artha Solusi Aditama)</option>
                <option value="BCA">Bank BCA — 326-889921-0 (PT. Artha Solusi Aditama)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1.5 font-space uppercase text-[9px] font-bold">Unggah Bukti Transfer PO</label>
              <div className="border-2 border-dashed border-slate-250 hover:border-[#0F3D5E] rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setError('');
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-bold">
                  {file ? file.name : 'Pilih Berkas atau Seret ke Sini'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Format: JPG, PNG, PDF (Maks. 5MB)</p>
              </div>
              {error && (
                <span className="text-red-500 text-[10px] font-bold mt-1 block">{error}</span>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                aria-label="Tutup Modal" onClick={onClose}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F3D5E] hover:bg-[#15466b] text-white rounded-xl shadow-md font-extrabold font-space uppercase tracking-wider"
              >
                Kirim Bukti Bayar
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="p-10 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-[#0F3D5E] border-slate-200 rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h4 className="text-sm font-black font-manrope text-[#0F3D5E]">Memproses Verifikasi Pembayaran</h4>
              <p className="text-[11px] text-slate-450">Sistem N8N tengah mengintegrasikan data bukti transfer ke finance PT. ASA...</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black font-manrope text-emerald-800">Success Pembayaran</h4>
              <p className="text-[11px] text-slate-450">Bukti transfer terverifikasi lunas. Status tagihan diperbarui menjadi LUNAS.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. TAMBAH UNIT HVAC MANUAL MODAL
function AddAssetModal({ isOpen, onClose, onAddAsset }) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('AC');
  const [acModel, setAcModel] = React.useState('Split Wall Standard');
  const [spec, setSpec] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [category, setCategory] = React.useState('Pemasangan');
  const [status, setStatus] = React.useState('Optimal');
  const [errors, setErrors] = React.useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const err = {};
    if (!name.trim()) err.name = 'Nama unit/model wajib diisi';
    if (!spec.trim()) err.spec = 'Spesifikasi detail wajib diisi';
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    
    setErrors({});
    
    const newAsset = {
      id: `ASA-EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: type === 'AC' ? `AC ${acModel} ${name}` : `${type} ${name}`,
      spec,
      installDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      warrantyUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      location: location || 'Gedung Klien',
      lastServiced: '-',
      category,
      status,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    };

    onAddAsset(newAsset);
    setName('');
    setSpec('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 text-xs font-semibold">
        <div className="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-extrabold text-sm font-manrope">Registrasi Aset HVAC Baru</h3>
          <button aria-label="Tutup Modal" onClick={onClose} className="text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto" novalidate>
          
          <div>
            <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Jenis Unit HVAC</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F] font-bold"
            >
              <option value="AC">AC (Air Conditioner)</option>
              <option value="Chiller">Chiller</option>
              <option value="Pompa">Pompa</option>
              <option value="Motor">Motor</option>
              <option value="Exhaust">Exhaust</option>
              <option value="Blower">Blower</option>
              <option value="Mini Chiller">Mini Chiller</option>
            </select>
          </div>

          {type === 'AC' && (
            <div className="animate-fade-in">
              <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Model AC (Pilih dari 6 Model)</label>
              <select 
                value={acModel} 
                onChange={(e) => setAcModel(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F] font-bold"
              >
                <option value="Split Wall Standard">1. Split Wall Standard</option>
                <option value="Cassette Industry">2. Cassette Industry</option>
                <option value="Standing Floor">3. Standing Floor</option>
                <option value="VRV System">4. VRV System</option>
                <option value="Split Duct">5. Split Duct</option>
                <option value="Window Unit">6. Window Unit</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Nama / Model Unit</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="Contoh: Daikin Premium 2PK"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F]"
            />
            {errors.name && (
              <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Spesifikasi Detail / Kapasitas</label>
            <input 
              type="text" 
              value={spec}
              onChange={(e) => {
                setSpec(e.target.value);
                if (errors.spec) setErrors(prev => ({ ...prev, spec: null }));
              }}
              placeholder="Contoh: JT150G-P8Y1 - 18000 BTU - R32"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F]"
            />
            {errors.spec && (
              <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.spec}</span>
            )}
          </div>


          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Kategori Layanan</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F] font-bold"
              >
                <option value="Pemasangan">Pemasangan</option>
                <option value="PM">PM (Preventive Maintenance)</option>
                <option value="Repair">Repair (Perbaikan)</option>
                <option value="Supply">Supply</option>
                <option value="Piping">Piping</option>
                <option value="Electrical">Electrical</option>
                <option value="Sparepart">Sparepart</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Kondisi Awal</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F] font-bold"
              >
                <option value="Optimal">Optimal (Normal)</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Breakdown">Breakdown (Kerusakan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-space uppercase text-[9px] font-bold">Lokasi Pemasangan Unit</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gedung A Lantai 2"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#8DC63F]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              aria-label="Tutup Modal" onClick={onClose}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-extrabold font-space uppercase tracking-wider"
            >
              Daftarkan Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. TECHNICIAN DAILY REPORT FORM MODAL
function TechReportModal({ isOpen, onClose, report }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 text-xs font-semibold flex flex-col">
        {/* Header */}
        <div className="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-extrabold text-sm font-manrope">Form Laporan Harian Teknisi</h3>
            <span className="text-[10px] text-blue-200 font-mono">PT. Artha Solusi Aditama</span>
          </div>
          <button aria-label="Tutup Modal" onClick={onClose} className="text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Report Document Sheet */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] bg-slate-50/50">
          {/* Document Header */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase font-space">NO. LAPORAN HARI / AO</span>
                <strong className="text-[#0F3D5E] font-mono text-sm block mt-0.5">{report.ao}</strong>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg uppercase font-space">
                PM & Repair Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold font-space block text-[9px] uppercase">TANGGAL KERJA</span>
                <span className="text-slate-700 font-bold">{new Date(report.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold font-space block text-[9px] uppercase">TEKNISI PELAKSANA</span>
                <span className="text-slate-700 font-bold">{report.technician}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold font-space block text-[9px] uppercase">UNIT HVAC GANGGUAN</span>
                <span className="text-slate-700 font-bold font-manrope">{report.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold font-space block text-[9px] uppercase">CABANG LAPORAN</span>
                <span className="text-blue-700 font-black">{report.type}</span>
              </div>
            </div>
          </div>

          {/* Action Log / Notes */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-space block border-b border-slate-100 pb-1.5">Tindakan & Catatan Harian Teknisi</span>
            <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line text-[11px]">{report.details}</p>
          </div>

          {/* Signatures replica */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-space block border-b border-slate-100 pb-1.5 mb-4">Verifikasi & Tanda Tangan</span>
            <div className="grid grid-cols-2 gap-6 text-center text-[10px] font-bold text-slate-600">
              <div className="space-y-12">
                <span>Teknisi Lapangan,</span>
                <div className="font-space font-black text-slate-800 border-t border-slate-200 pt-2">{report.technician.split('&')[0]}</div>
              </div>
              <div className="space-y-12">
                <span>Account Officer (AO),</span>
                <div className="font-space font-black text-slate-800 border-t border-slate-200 pt-2">Ahmad Fauzi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold font-space uppercase tracking-wider"
          >
            Cetak Laporan
          </button>
          <button
            aria-label="Tutup Modal" onClick={onClose}
            className="px-5 py-2 bg-[#0F3D5E] hover:bg-[#15466b] text-white rounded-xl text-xs font-extrabold font-space uppercase tracking-wider"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

