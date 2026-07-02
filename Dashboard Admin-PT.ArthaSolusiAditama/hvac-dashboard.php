<?php
// This file is included by dashboard.php. No standalone auth needed here.
$activeTab = $_GET['tab'] ?? 'overview';
$tabMap = ['overview' => 'overview', 'b2b' => 'b2b', 'b2c' => 'b2c', 'contracts' => 'b2b', 'ondemand' => 'b2c'];
$initTab = $tabMap[$activeTab] ?? 'overview';
$initB2bSubTab = ($activeTab === 'contracts' || $activeTab === 'b2b') ? 'contracts' : 'contracts';
$initB2cSubTab = ($activeTab === 'ondemand') ? 'ondemand' : 'ondemand';
?>
<!-- ===== HVAC ADMIN DASHBOARD — Mirrors AdminDashboardStandalone.jsx ===== -->

<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          space: ['Plus Jakarta Sans', 'sans-serif'],
          manrope: ['Plus Jakarta Sans', 'sans-serif']
        },
        animation: {
          'scale-up': 'scaleUp 0.2s ease-out forwards',
          'fade-in': 'fadeIn 0.2s ease-out forwards',
          'spin-slow': 'spin 3s linear infinite',
        },
        keyframes: {
          scaleUp: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
          fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } }
        }
      }
    }
  }
</script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">

<style>
  body { font-family: 'Inter', sans-serif; }
  .font-space { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-manrope { font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  @media print {
    body * { visibility: hidden !important; }
    #print-do-modal, #print-do-modal *, #print-b2c-modal, #print-b2c-modal * { visibility: visible !important; }
    #print-do-modal, #print-b2c-modal {
      position: absolute !important; left: 0 !important; top: 0 !important;
      width: 100% !important; height: auto !important; background: white !important;
      color: black !important; box-shadow: none !important; border: none !important;
      z-index: 99999 !important; overflow: visible !important; display: block !important;
    }
  }
</style>

<!-- ===== MAIN WRAPPER (replaces JSX's min-h-screen flex flex-col md:flex-row) ===== -->
<div class="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans" id="hvac-dashboard-root">
  <!-- Toast Container -->
  <div id="toast-container" class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"></div>

  <!-- ─── MAIN CONTENT ─── -->
  <div class="w-full p-6 md:p-8 space-y-6">





    <!-- Sub-Navigation B2B -->
    <div id="subnav-b2b" class="hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="bg-white border border-slate-200 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400 shadow-sm flex-1 w-full md:w-auto">
        <button onclick="switchB2bSubTab('contracts')" id="btn-b2b-contracts" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all hover:bg-slate-50 text-slate-500">B2B Kontrak Gedung</button>
        <button onclick="switchB2bSubTab('field-service')" id="btn-b2b-field-service" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all hover:bg-slate-50 text-slate-500">Operasional &amp; Teknisi</button>
        <button onclick="switchB2bSubTab('invoices')" id="btn-b2b-invoices" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all hover:bg-slate-50 text-slate-500">Faktur &amp; Pembayaran</button>
      </div>
      
      <!-- Invoices Action Button -->
      <div id="b2b-invoices-action" class="hidden w-full sm:w-auto">
        <button onclick="toggleInvoiceFilter()" id="invoice-filter-btn" class="w-full sm:w-auto px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold transition-all text-slate-600">
          Tampilkan Belum Bayar
        </button>
      </div>
    </div>

    <!-- Sub-Navigation B2C -->
    <div id="subnav-b2c" class="hidden bg-white border border-slate-200 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400 shadow-sm overflow-x-auto">
      <button onclick="switchB2cSubTab('ondemand')" id="btn-b2c-ondemand" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap hover:bg-slate-50 text-slate-500">B2C Pesanan &amp; Jasa</button>
      <button onclick="switchB2cSubTab('catalog')" id="btn-b2c-catalog" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap hover:bg-slate-50 text-slate-500">Katalog Produk B2C</button>
      <button onclick="switchB2cSubTab('cms')" id="btn-b2c-cms" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap hover:bg-slate-50 text-slate-500">CMS &amp; Banner Promo</button>
      <button onclick="switchB2cSubTab('emergency')" id="btn-b2c-emergency" class="flex-1 py-2.5 px-4 rounded-lg text-center transition-all whitespace-nowrap hover:bg-slate-50 text-slate-500">Tanggap Darurat</button>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: OVERVIEW                                        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-overview" class="space-y-8 animate-fade-in">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <span class="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Total Pendapatan</span>
            <h4 class="text-lg font-black font-manrope text-[#0F3D5E]" id="kpi-revenue">Rp 0</h4>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <span class="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Antrean Tiket B2B</span>
            <h4 class="text-lg font-black font-manrope text-[#0F3D5E]" id="kpi-b2b-tickets">0 Tiket Aktif</h4>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div>
            <span class="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Pesanan B2C Aktif</span>
            <h4 class="text-lg font-black font-manrope text-[#0F3D5E]" id="kpi-b2c-orders">0 Pekerjaan</h4>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <span class="text-[10px] uppercase font-black tracking-wider text-slate-400 font-space block">Invoice Overdue</span>
            <h4 class="text-lg font-black font-manrope text-[#0F3D5E]" id="kpi-overdue">0 Dokumen</h4>
          </div>
        </div>
      </div>

      <!-- Charts & Critical Tickets -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Donut Chart -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 class="font-extrabold text-sm text-[#0C3254]">Rasio Jenis Penjualan</h3>
            <p class="text-[11px] text-slate-400">Distribusi pendapatan B2B Kontrak Gedung vs B2C On-Demand.</p>
          </div>
          <div class="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EFF6FF" stroke-width="12"/>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0F3D5E" stroke-width="12" stroke-dasharray="163.3 251.2" stroke-dashoffset="0"/>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" stroke-width="12" stroke-dasharray="87.9 251.2" stroke-dashoffset="-163.3"/>
            </svg>
            <div class="absolute text-center">
              <span class="text-[10px] text-slate-400 block font-bold font-space uppercase">Rasio B2B</span>
              <strong class="text-lg font-black font-manrope text-[#0F3D5E]">65%</strong>
            </div>
          </div>
          <button onclick="switchTab('b2b')" class="w-full flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[#2563EB] hover:text-[#0F3D5E] uppercase tracking-wider transition-colors">
            Selengkapnya
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- Critical Tickets -->
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-extrabold text-sm text-[#0C3254]">Tiket Prioritas Kritis</h3>
              <p class="text-[11px] text-slate-400">Tiket B2B yang membutuhkan penanganan segera.</p>
            </div>
            <button onclick="switchTab('b2b')" class="flex items-center gap-1.5 text-[10px] font-extrabold text-[#2563EB] hover:text-[#0F3D5E] uppercase tracking-wider transition-colors">
              Lihat Semua
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div class="divide-y divide-slate-100 overflow-y-auto max-h-[260px] pr-2" id="critical-tickets-container">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2B — CONTRACTS                                -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2b-contracts" class="hidden space-y-6 animate-fade-in text-left">
      <!-- Contract Sub-Tabs -->
      <div class="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50">
        <button onclick="switchContractSubTab('list')" id="btn-ct-list" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Daftar Kontrak</button>
        <button onclick="switchContractSubTab('assets')" id="btn-ct-assets" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Kategori &amp; Inventaris Aset</button>
      </div>

      <!-- List Sub-Tab -->
      <div id="contract-view-list" class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div class="relative w-full sm:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="search-contracts" oninput="renderContracts()" placeholder="Cari klien, PIC..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none font-semibold">
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="openModal('modal-add-ticket')" class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white font-bold text-xs rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Buat Tiket Layanan B2B
            </button>
            <button onclick="openModal('modal-add-asset')" class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0F3D5E] font-bold text-xs rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Aset
            </button>
          </div>
        </div>
        <div id="contracts-list-container" class="space-y-6"><!-- Rendered by JS --></div>
      </div>

      <!-- Assets Sub-Tab -->
      <div id="contract-view-assets" class="hidden space-y-6">

        <div id="assets-by-category" class="space-y-6"><!-- Rendered by JS --></div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2B — FIELD SERVICE & DISPATCH                 -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2b-field-service" class="hidden space-y-6 animate-fade-in text-left">
      <!-- Field Service Header (Subnav + Action Button) -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <!-- Field Service Sub-Tabs -->
        <div class="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50">
          <button onclick="switchFieldSubTab('calendar')" id="btn-fs-calendar" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Kalender Dispatch</button>
          <button onclick="switchFieldSubTab('reports')" id="btn-fs-reports" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Validasi Laporan Harian</button>
        </div>
        
        <!-- Calendar Action Button -->
        <div id="fs-calendar-action" class="w-full sm:w-auto">
          <button onclick="openDispatchModal('2026-06-30')" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all w-full sm:w-auto justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Dispatch Penjadwalan Baru
          </button>
        </div>
      </div>

      <!-- Calendar Sub-Tab -->
      <div id="fs-view-calendar" class="space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-black text-xs text-[#0F3D5E] uppercase tracking-wider">Juni 2026</h4>
            <span class="text-[10px] text-slate-400 font-bold">Menampilkan Jadwal Tugas Aktif</span>
          </div>
          <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-2">
            <div class="py-1">Min</div><div class="py-1">Sen</div><div class="py-1">Sel</div><div class="py-1">Rab</div><div class="py-1">Kam</div><div class="py-1">Jum</div><div class="py-1">Sab</div>
          </div>
          <div class="grid grid-cols-7 gap-1 sm:gap-2" id="calendar-grid"><!-- Rendered by JS --></div>
        </div>
      </div>

      <!-- Reports Sub-Tab -->
      <div id="fs-view-reports" class="hidden space-y-6">

        <div id="daily-reports-container" class="grid grid-cols-1 gap-4"><!-- Rendered by JS --></div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2B — INVOICES                                 -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2b-invoices" class="hidden space-y-6 animate-fade-in">
      <!-- Webhook Simulation Bar -->
      <div id="webhook-simulation-bar" class="hidden bg-[#0F3D5E] text-white p-5 rounded-2xl border border-[#2563EB]/20 shadow-lg flex items-center justify-between animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          </div>
          <div>
            <span class="text-[10px] uppercase font-black tracking-widest text-[#2563EB] block">Status Koneksi Gateway Pembayaran</span>
            <p class="text-xs font-extrabold mt-0.5 text-slate-100" id="webhook-sim-text"></p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded text-slate-300" id="webhook-sim-invoice"></span>
        </div>
      </div>



      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 font-space font-bold uppercase tracking-wider bg-slate-50/20">
                <th class="p-4">Invoice ID</th>
                <th class="p-4">Perusahaan Klien</th>
                <th class="p-4">No. PO</th>
                <th class="p-4">Tanggal Terbit</th>
                <th class="p-4">Nominal</th>
                <th class="p-4 text-center">Status</th>
                <th class="p-4 text-center">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody id="invoices-table-body" class="divide-y divide-slate-100 font-medium"><!-- Rendered by JS --></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2C — ON-DEMAND ORDERS                         -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2c-ondemand" class="hidden space-y-6 animate-fade-in">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Status Tabs -->
        <div class="flex flex-wrap gap-1.5 order-2 sm:order-1">
          <button onclick="setB2cOrderFilter('all')" id="btn-filter-b2c-all" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#0F3D5E] text-white">Semua</button>
          <button onclick="setB2cOrderFilter('1')" id="btn-filter-b2c-1" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100">Menunggu Pembayaran</button>
          <button onclick="setB2cOrderFilter('2')" id="btn-filter-b2c-2" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100">Lunas / Diproses</button>
          <button onclick="setB2cOrderFilter('3')" id="btn-filter-b2c-3" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100">Dalam Pengiriman</button>
          <button onclick="setB2cOrderFilter('4')" id="btn-filter-b2c-4" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100">Selesai</button>
        </div>
        <!-- Search input -->
        <div class="relative w-full sm:w-64 order-1 sm:order-2">
          <input type="text" id="search-b2c-orders" oninput="renderB2cOrders()" placeholder="Cari ID, klien, atau produk..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0F3D5E] font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      <div id="b2c-orders-container" class="grid grid-cols-1 gap-6"><!-- Rendered by JS --></div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2C — CATALOG                                  -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2c-catalog" class="hidden space-y-6 animate-fade-in">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Search and Category Filters -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          <div class="relative flex-1 max-w-md">
            <input type="text" id="search-catalog" oninput="renderCatalog()" placeholder="Cari nama produk atau ID..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0F3D5E] font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <select id="filter-catalog-category" onchange="renderCatalog()" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-slate-700 w-full sm:w-44">
            <option value="all">Semua Kategori</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        <!-- Add Button -->
        <button aria-label="Edit Produk" onclick="openProductModal(null)" class="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Tambah Produk Baru
        </button>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 font-space font-bold uppercase tracking-wider bg-slate-50/20">
                <th class="p-4">ID</th>
                <th class="p-4">Nama Produk</th>
                <th class="p-4">Kategori</th>
                <th class="p-4">Harga</th>
                <th class="p-4">Status Stok</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody id="catalog-table-body" class="divide-y divide-slate-100 font-medium"><!-- Rendered by JS --></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2C — CMS & BANNERS                            -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2c-cms" class="hidden space-y-6 animate-fade-in">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Search and Status Filters -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
          <div class="relative flex-1 max-w-md">
            <input type="text" id="search-banners" oninput="renderBanners()" placeholder="Cari judul banner atau deskripsi..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0F3D5E] font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <select id="filter-banner-status" onchange="renderBanners()" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-slate-700 w-full sm:w-44">
            <option value="all">Semua Status</option>
            <option value="active">Aktif (Tampil)</option>
            <option value="inactive">Non-Aktif</option>
          </select>
        </div>
        <!-- Add Button -->
        <button onclick="openBannerModal(null)" class="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Unggah Banner Baru
        </button>
      </div>
      <div id="banners-container" class="grid grid-cols-1 md:grid-cols-2 gap-6"><!-- Rendered by JS --></div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TAB: B2C — EMERGENCY                                -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="tab-b2c-emergency" class="hidden space-y-6 animate-fade-in text-left">
      <!-- Emergency Sub-Tabs -->
      <div class="bg-slate-100/80 p-1 rounded-2xl flex gap-1 w-fit border border-slate-200/50">
        <button onclick="switchEmergencySubTab('alarm')" id="btn-em-alarm" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Pusat Krisis &amp; Alarm</button>
        <button onclick="switchEmergencySubTab('do')" id="btn-em-do" class="px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all">Delivery Order Darurat</button>
      </div>

      <!-- Alarm Sub-Tab -->
      <div id="em-view-alarm" class="space-y-6">
        <div id="emergency-alert-banner"><!-- Rendered by JS --></div>
      </div>

      <!-- DO Sub-Tab -->
      <div id="em-view-do" class="hidden space-y-6">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="font-extrabold text-sm text-[#0C3254]">Manajemen Delivery Order (DO) Darurat</h3>
            <p class="text-[11px] text-slate-400">Pencatatan suku cadang darurat dan perhitungan biaya penanganan krisis klien B2B.</p>
          </div>
          <button onclick="openModal('modal-add-do')" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Buat DO Darurat Baru
          </button>
        </div>
        <div id="emergency-dos-container" class="grid grid-cols-1 gap-4"><!-- Rendered by JS --></div>
      </div>
    </div>

  </div><!-- /main content -->
</div><!-- /hvac-dashboard-root -->

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- MODALS                                                          -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<!-- MODAL: ADD ASSET -->
<div id="modal-add-asset" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-add-asset')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Registrasi Aset Baru Klien</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-add-asset')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleAddAsset(event)" class="p-5 space-y-4">
      <div>
        <label class="block text-slate-500 mb-1">Pilih Perusahaan Klien</label>
        <select id="asset-client" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"></select>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Nama Aset (Unit HVAC)</label>
        <input type="text" id="asset-name" required placeholder="Contoh: York Water Cooled Chiller" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Spesifikasi Detail</label>
        <input type="text" id="asset-spec" required placeholder="Contoh: YMC2-1200 - 350 TR - R134a" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Lokasi Pemasangan</label>
        <input type="text" id="asset-location" placeholder="Contoh: Ruang Pompa Gedung Utama A" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Kondisi Aset Awal</label>
        <select id="asset-status" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
          <option value="Optimal">Optimal (Normal)</option>
          <option value="Maintenance">Maintenance (Pemeliharaan)</option>
          <option value="Breakdown">Breakdown (Kerusakan)</option>
        </select>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-add-asset')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold">Daftarkan Aset</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: ADD TICKET -->
<div id="modal-add-ticket" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-add-ticket')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Buat Tiket Layanan B2B</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-add-ticket')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleAddTicket(event)" class="p-5 space-y-4" novalidate>
      <div>
        <label class="block text-slate-500 mb-1">Pilih Perusahaan Klien</label>
        <select id="ticket-client" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"></select>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Tipe Tiket</label>
        <input type="text" id="ticket-type" placeholder="Contoh: Preventive Maintenance" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        <span id="error-ticket-type" class="text-red-500 text-[10px] font-bold mt-1 hidden">Tipe tiket wajib diisi</span>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Unit / Peralatan</label>
        <input type="text" id="ticket-unit" placeholder="Contoh: Chiller York - Main Hall" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        <span id="error-ticket-unit" class="text-red-500 text-[10px] font-bold mt-1 hidden">Unit / peralatan wajib diisi</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Prioritas</label>
          <select id="ticket-priority" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Status Awal</label>
          <select id="ticket-status-val" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
            <option value="Open">Open</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-add-ticket')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" id="btn-submit-ticket" class="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold flex items-center justify-center gap-2">
          <span id="spinner-submit-ticket" class="hidden w-3 h-3 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
          <span id="text-submit-ticket">Buat Tiket</span>
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: DISPATCH NEW SCHEDULE -->
<div id="modal-dispatch" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-dispatch')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Dispatch Tiket Penjadwalan (<span id="dispatch-date-label"></span>)</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-dispatch')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleCreateDispatch(event)" class="p-5 space-y-4 text-left" novalidate>
      <div>
        <label class="block text-slate-500 mb-1">Pilih Perusahaan Klien B2B</label>
        <select id="dispatch-client" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold"></select>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Tipe Penugasan</label>
        <select id="dispatch-type" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
          <option value="Preventive Maintenance">Preventive Maintenance (PM Berkala)</option>
          <option value="Repair">Repair (Perbaikan Kerusakan)</option>
          <option value="Installation">Installation (Pemasangan Unit Baru)</option>
        </select>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Spesifikasi Unit Aset</label>
        <input type="text" id="dispatch-unit" placeholder="Contoh: Chiller York Water Cooled - Lt B1" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        <span id="error-dispatch-unit" class="text-red-500 text-[10px] font-bold mt-1 hidden">Spesifikasi unit wajib diisi</span>
      </div>
      <div>
        <label class="block text-slate-500 mb-1 font-semibold text-xs uppercase tracking-wider">Tunjuk Teknisi Lapangan</label>
        <div class="relative mb-2">
          <input type="text" id="search-dispatch-tech" oninput="updateTechsChecklist('dispatch-tech-container', 'search-dispatch-tech', 'selected-dispatch-techs-list', 'selected-dispatch-techs-card')" placeholder="Cari nama teknisi..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2563EB] font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div id="dispatch-tech-container" class="space-y-2 border border-slate-200 rounded-lg p-3 bg-white max-h-32 overflow-y-auto">
          <label class="flex items-center gap-2.5 py-1 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="dispatch_techs[]" value="Supriadi &amp; Team" onchange="updateTechsChecklist('dispatch-tech-container', 'search-dispatch-tech', 'selected-dispatch-techs-list', 'selected-dispatch-techs-card')" class="dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Supriadi &amp; Team</span>
          </label>
          <label class="flex items-center gap-2.5 py-1.5 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="dispatch_techs[]" value="Ahmad &amp; Budi" onchange="updateTechsChecklist('dispatch-tech-container', 'search-dispatch-tech', 'selected-dispatch-techs-list', 'selected-dispatch-techs-card')" class="dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Ahmad &amp; Budi</span>
          </label>
          <label class="flex items-center gap-2.5 py-1.5 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="dispatch_techs[]" value="Roni" onchange="updateTechsChecklist('dispatch-tech-container', 'search-dispatch-tech', 'selected-dispatch-techs-list', 'selected-dispatch-techs-card')" class="dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Roni</span>
          </label>
        </div>
      </div>

      <!-- Card Teknisi Terpilih -->
      <div id="selected-dispatch-techs-card" class="hidden p-3 bg-blue-50/50 border border-blue-200 rounded-xl items-center gap-2 flex-wrap mt-2">
        <span class="text-[10px] font-extrabold text-blue-700"><i class="fas fa-check-circle"></i> Teknisi Terpilih:</span>
        <div id="selected-dispatch-techs-list" class="flex flex-wrap gap-1.5"></div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Status Penugasan</label>
          <select id="dispatch-status" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
            <option value="Scheduled" selected>Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Prioritas</label>
          <select id="dispatch-priority" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-dispatch')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" id="btn-submit-dispatch" class="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold flex items-center justify-center gap-2">
          <span id="spinner-submit-dispatch" class="hidden w-3 h-3 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
          <span id="text-submit-dispatch">Dispatch Jadwal</span>
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: EDIT DISPATCH EVENT -->
<div id="modal-edit-dispatch" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-edit-dispatch')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Edit / Reschedule Jadwal Tugas</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-edit-dispatch')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleUpdateDispatch(event)" class="p-5 space-y-4 text-left">
      <input type="hidden" id="edit-dispatch-id">
      <div>
        <label class="block text-slate-500 mb-1">Klien B2B</label>
        <input type="text" id="edit-dispatch-client" disabled class="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-500 font-bold">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Tanggal Tugas</label>
          <input type="date" id="edit-dispatch-date" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Tipe Penugasan</label>
          <select id="edit-dispatch-type" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
            <option value="Preventive Maintenance">Preventive Maintenance</option>
            <option value="Repair">Repair</option>
            <option value="Installation">Installation</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Spesifikasi Unit Aset</label>
        <input type="text" id="edit-dispatch-unit" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
      </div>
      <div>
        <label class="block text-slate-500 mb-1 font-semibold text-xs uppercase tracking-wider">Teknisi Lapangan</label>
        <div class="relative mb-2">
          <input type="text" id="search-edit-dispatch-tech" oninput="updateTechsChecklist('edit-dispatch-tech-container', 'search-edit-dispatch-tech', 'edit-selected-dispatch-techs-list', 'edit-selected-dispatch-techs-card')" placeholder="Cari nama teknisi..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#2563EB] font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 pointer-events-none" style="transform: translateY(-50%);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div id="edit-dispatch-tech-container" class="space-y-2 border border-slate-200 rounded-lg p-3 bg-white max-h-32 overflow-y-auto">
          <label class="flex items-center gap-2.5 py-1.5 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="edit_dispatch_techs[]" value="Supriadi &amp; Team" onchange="updateTechsChecklist('edit-dispatch-tech-container', 'search-edit-dispatch-tech', 'edit-selected-dispatch-techs-list', 'edit-selected-dispatch-techs-card')" class="edit-dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Supriadi &amp; Team</span>
          </label>
          <label class="flex items-center gap-2.5 py-1.5 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="edit_dispatch_techs[]" value="Ahmad &amp; Budi" onchange="updateTechsChecklist('edit-dispatch-tech-container', 'search-edit-dispatch-tech', 'edit-selected-dispatch-techs-list', 'edit-selected-dispatch-techs-card')" class="edit-dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Ahmad &amp; Budi</span>
          </label>
          <label class="flex items-center gap-2.5 py-1.5 px-1.5 cursor-pointer hover:bg-slate-50 rounded-lg select-none">
            <input type="checkbox" name="edit_dispatch_techs[]" value="Roni" onchange="updateTechsChecklist('edit-dispatch-tech-container', 'search-edit-dispatch-tech', 'edit-selected-dispatch-techs-list', 'edit-selected-dispatch-techs-card')" class="edit-dispatch-tech-checkbox w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <span class="text-xs font-semibold text-slate-700">Roni</span>
          </label>
        </div>
      </div>

      <!-- Card Teknisi Terpilih (Edit) -->
      <div id="edit-selected-dispatch-techs-card" class="hidden p-3 bg-blue-50/50 border border-blue-200 rounded-xl items-center gap-2 flex-wrap mt-2">
        <span class="text-[10px] font-extrabold text-blue-700"><i class="fas fa-check-circle"></i> Teknisi Terpilih:</span>
        <div id="edit-selected-dispatch-techs-list" class="flex flex-wrap gap-1.5"></div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Status Penugasan</label>
          <select id="edit-dispatch-status" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Prioritas</label>
          <select id="edit-dispatch-priority" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-semibold">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div class="flex justify-between items-center pt-2 gap-3">
        <button type="button" id="edit-dispatch-delete-btn" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all">Hapus Tugas</button>
        <div class="flex gap-2">
          <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-edit-dispatch')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
          <button type="submit" class="px-4 py-2 bg-[#0F3D5E] hover:bg-[#1a5276] text-white rounded-lg font-bold transition-all">Simpan</button>
        </div>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: REVIEW DAILY REPORT -->
<div id="modal-review-report" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-review-report')"></div>
  <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Tinjau Laporan Harian Teknisi (<span id="review-report-id"></span>)</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-review-report')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-left" id="review-report-content"><!-- Rendered by JS --></div>
  </div>
</div>

<!-- MODAL: ADD EMERGENCY DO -->
<div id="modal-add-do" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-add-do')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Buat Delivery Order (DO) Darurat</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-add-do')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleSaveEmergencyDo(event)" class="p-5 space-y-4 text-left" novalidate>
      <div>
        <label class="block text-slate-500 mb-1">Pilih Klien B2B</label>
        <select id="do-client" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]"></select>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Jenis Darurat</label>
        <input type="text" id="do-type" value="Kebocoran Chiller Utama (Kritis)" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        <span id="error-do-type" class="text-red-500 text-[10px] font-bold mt-1 hidden">Jenis darurat wajib diisi</span>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Tindakan yang Diambil</label>
        <textarea id="do-action" rows="2" placeholder="Deskripsikan tindakan lapangan teknisi..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] resize-none"></textarea>
        <span id="error-do-action" class="text-red-500 text-[10px] font-bold mt-1 hidden">Tindakan wajib diisi</span>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Suku Cadang Dikirim</label>
        <input type="text" id="do-parts" placeholder="Contoh: Seal Gasket 4 Inch (2 Pcs)" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        <span id="error-do-parts" class="text-red-500 text-[10px] font-bold mt-1 hidden">Suku cadang wajib diisi</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Biaya Jasa (Rp)</label>
          <input type="number" id="do-base-fee" value="1500000" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Biaya Suku Cadang (Rp)</label>
          <input type="number" id="do-parts-cost" value="0" oninput="updateDoTotal()" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        </div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <span class="text-slate-400 text-[10px] block">Total Biaya DO Darurat</span>
        <strong class="text-[#0F3D5E] text-sm font-black font-manrope" id="do-total-display">Rp 1.500.000</strong>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-add-do')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" id="btn-submit-do" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center justify-center gap-2">
          <span id="spinner-submit-do" class="hidden w-3 h-3 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
          <span id="text-submit-do">Terbitkan DO</span>
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: PRINT DO -->
<div id="print-do-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('print-do-modal')"></div>
  <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center print:hidden">
      <h3 class="font-extrabold text-sm">Preview Berita Acara &amp; DO</h3>
      <div class="flex gap-2">
        <button onclick="window.print()" class="px-4 py-1.5 bg-white text-[#0F3D5E] font-bold text-xs rounded-lg hover:bg-slate-50">Cetak / Simpan PDF</button>
        <button aria-label="Tutup Modal" onclick="closeModal('print-do-modal')" class="text-slate-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="p-8 space-y-6" id="print-do-content"><!-- Rendered by JS --></div>
  </div>
</div>

<!-- MODAL: ADD/EDIT B2C PRODUCT -->
<div id="modal-product" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-product')"></div>
  <div class="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-6 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm" id="product-modal-title">Registrasi Produk B2C Baru</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-product')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleSaveProduct(event)" class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <span class="text-[10px] font-extrabold text-[#0F3D5E] uppercase tracking-widest block border-b border-slate-200/60 pb-2">Informasi Dasar Produk</span>
          <div>
            <label class="block text-slate-500 mb-1">Nama Produk AC / Peralatan</label>
            <input type="text" id="prod-name" required placeholder="Contoh: Panasonic Premium Inverter 1 HP" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Kategori Produk</label>
            <select id="prod-category" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
              <option value="Residential">Residential (Rumahan)</option>
              <option value="Commercial">Commercial (Bisnis)</option>
              <option value="Industrial">Industrial (Pabrik / HVAC Skala Besar)</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Harga / Rentang Harga</label>
            <input type="text" id="prod-price" required placeholder="Contoh: IDR 5.500.000 - 12.000.000" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Status Ketersediaan</label>
            <select id="prod-availability" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
              <option value="Ready Stock">Ready Stock</option>
              <option value="Indent (1 Minggu)">Indent (1 Minggu)</option>
              <option value="Indent (2 Minggu)">Indent (2 Minggu)</option>
              <option value="Indent (1 Bulan)">Indent (1 Bulan)</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Consultation Required">Consultation Required</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Foto Produk</label>
            <input type="file" id="prod-image-file" accept="image/*" multiple onchange="handleProductImageUpload(event)" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#2563EB] file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#0F3D5E] file:text-white hover:file:bg-[#15527d] file:cursor-pointer text-slate-500">
            <div id="prod-image-previews" class="flex gap-2 overflow-x-auto py-1 mt-1"></div>
          </div>
        </div>
        <div class="space-y-4 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
          <span class="text-[10px] font-extrabold text-[#0F3D5E] uppercase tracking-widest block border-b border-slate-200/60 pb-2">Detail Informasi Produk</span>
          <div>
            <label class="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Spesifikasi &amp; Dimensi</label>
            <textarea id="prod-spec-details" rows="4" placeholder="Kapasitas: 2 PK&#10;Daya Listrik: 1200 Watt" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"></textarea>
          </div>
          <div>
            <label class="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Fitur Utama</label>
            <textarea id="prod-features" rows="4" placeholder="Teknologi Eco Inverter&#10;Filter penyaring debu anti-alergi" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"></textarea>
          </div>
          <div>
            <label class="block text-slate-500 mb-1 text-[10px] uppercase font-black tracking-wider">Kelengkapan Paket</label>
            <textarea id="prod-inclusions" rows="4" placeholder="1x Unit Indoor AC&#10;1x Unit Outdoor AC&#10;1x Bracket &amp; Remote" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] font-bold text-xs resize-none"></textarea>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <input type="hidden" id="prod-editing-id">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-product')" class="px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" class="px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">Simpan Produk</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: ADD/EDIT B2C BANNER -->
<div id="modal-banner" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-banner')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm" id="banner-modal-title">Unggah Banner Promosi Baru</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-banner')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form onsubmit="handleSaveBanner(event)" class="p-5 space-y-4">
      <input type="hidden" id="banner-editing-id">
      <div>
        <label class="block text-slate-500 mb-1">Judul Banner (Headline)</label>
        <input type="text" id="banner-title" required placeholder="Contoh: Diskon 25% Hari Kemerdekaan" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Deskripsi Singkat</label>
        <textarea id="banner-desc" required rows="3" placeholder="Dapatkan penawaran terbatas..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB] resize-none"></textarea>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">File Gambar Poster</label>
        <input type="file" id="banner-image-file" accept="image/*" onchange="handleBannerImageUpload(event)" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#0F3D5E] file:text-white hover:file:bg-[#15527d] file:cursor-pointer text-slate-500">
        <div id="banner-img-preview" class="hidden mt-1 border border-slate-200 rounded-xl overflow-hidden h-24 w-full bg-slate-100">
          <img id="banner-img-preview-img" src="" alt="Preview" class="h-full w-full object-cover">
        </div>
      </div>
      <div>
        <label class="block text-slate-500 mb-1">Link Redirect (Saat Di-klik)</label>
        <input type="text" id="banner-link" placeholder="#contact atau #services" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-slate-500 mb-1">Harga Biasa (Rp)</label>
          <input type="number" id="banner-original-price" placeholder="150000" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        </div>
        <div>
          <label class="block text-slate-500 mb-1">Harga Promo (Rp)</label>
          <input type="number" id="banner-promo-price" placeholder="120000" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#2563EB]">
        </div>
      </div>
      <div class="flex items-center gap-2 pt-1">
        <input type="checkbox" id="banner-active" checked class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded">
        <label for="banner-active" class="text-slate-600 select-none">Aktifkan poster ini (langsung tayang)</label>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal('modal-banner')" class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-500 font-bold hover:bg-slate-50">Batal</button>
        <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">Simpan Banner</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: SERVICE HISTORY -->
<div id="modal-history" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('modal-history')"></div>
  <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up text-xs font-semibold">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center">
      <h3 class="font-extrabold text-sm">Histori Servis Aset</h3>
      <button aria-label="Tutup Modal" onclick="closeModal('modal-history')" class="text-slate-300 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="p-5 space-y-4" id="history-modal-content"><!-- Rendered by JS --></div>
  </div>
</div>

<!-- MODAL: B2C PRINT INVOICE & LABEL -->
<div id="print-b2c-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4">
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="Tutup Modal" onclick="closeModal('print-b2c-modal')"></div>
  <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 animate-scale-up">
    <div class="bg-[#0F3D5E] text-white px-5 py-4 flex justify-between items-center print:hidden">
      <h3 class="font-extrabold text-sm">Preview Invoice &amp; Label Kurir</h3>
      <div class="flex gap-2">
        <button onclick="window.print()" class="px-4 py-1.5 bg-white text-[#0F3D5E] font-bold text-xs rounded-lg hover:bg-slate-50">Cetak / Simpan PDF</button>
        <button aria-label="Tutup Modal" onclick="closeModal('print-b2c-modal')" class="text-slate-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="p-8 space-y-6" id="print-b2c-content"><!-- Rendered by JS --></div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- JAVASCRIPT ENGINE                                               -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<script>
// ─────────────────────────────────────────────────────────────────────────────
// SIMULASI: localStorage digunakan sebagai "shared database" sementara antara
// Admin Dashboard (file ini) dan Customer Dashboard B2B (CustomerDashboard.jsx)
// sebelum backend API siap. Key yang digunakan SAMA dengan React component.
// TODO(API): Ganti fungsi loadXxx() dengan fetch() saat backend siap.
// ─────────────────────────────────────────────────────────────────────────────

// ─── FORMATTER HELPERS (vanilla JS — mirror dari src/utils/formatters.js) ────

/** Format angka ke Rupiah Indonesia. @param {number|string} value @returns {string} */
function formatRupiah(value) {
  if (value === null || value === undefined) return 'Rp 0';
  const num = typeof value === 'string' ? Number(value.replace(/[^0-9]/g, '')) : Number(value);
  if (isNaN(num)) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
}

/** Format Date ke tanggal Bahasa Indonesia panjang. @param {Date} [date] @returns {string} */
function formatTanggalID(date) {
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date || new Date());
  } catch(e) { return (date || new Date()).toLocaleDateString('id-ID'); }
}

/** Tanggal hari ini sebagai ISO string (YYYY-MM-DD). @returns {string} */
function getTodayISO() { return new Date().toISOString().split('T')[0]; }

// ─── DEFAULT MOCK DATA ────────────────────────────────────────────────────────
// Hanya dipakai saat localStorage kosong (pertama kali / setelah reset).
// TODO(API): Ganti dengan response dari GET /api/b2b/contracts

const MOCK_CONTRACTS_DATA = [
  {
    id: 'CON-88029', clientName: 'PT Mitra Sukses Abadi', pic: 'Rendy Kurniadi',
    email: 'r.kurniadi@mitrasukses.co.id', phone: '+62 812-3456-7890',
    status: 'Active', startDate: '12 Jan 2024', endDate: '12 Jan 2027',
    slaResponse: '15 Mins', slaResolution: '2 Hours', assetsCount: 3,
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
    id: 'CON-88104', clientName: 'PT Nusantara Citra Mandiri', pic: 'Bambang Wijaya',
    email: 'bambang.w@ncm.co.id', phone: '+62 811-9876-5432',
    status: 'Active', startDate: '01 Mar 2025', endDate: '01 Mar 2028',
    slaResponse: '30 Mins', slaResolution: '4 Hours', assetsCount: 2,
    tickets: [
      { id: 'TKT-899', type: 'AHU Filter Replacement', unit: 'McQuay AHU - Hall C', date: '24 Juni 2026', status: 'Completed', priority: 'Medium', tech: 'Roni' },
      { id: 'TKT-910', type: 'Freon Refilling', unit: 'Daikin Split Duct - Server Room', date: '26 Juni 2026', status: 'Open', priority: 'High', tech: '-' }
    ],
    assets: [
      { id: 'ASA-EQ-044', name: 'McQuay Air Handling Unit', spec: 'MQ-AHU-50', location: 'Hall C Utility', lastServiced: '24 Juni 2026', status: 'Optimal' },
      { id: 'ASA-EQ-045', name: 'Daikin Split Duct AC', spec: 'FDR250NY14', location: 'Main Server Room 1st Floor', lastServiced: '15 Mei 2026', status: 'Optimal' }
    ]
  }
];

const MOCK_INVOICES = [
  { id: 'INV/2026/ASA/095', client: 'PT Mitra Sukses Abadi', amount: 38000000, date: '15 Juni 2026', status: 'Unpaid', daysOverdue: 11, po: 'PO-88029-432' },
  { id: 'INV/2026/ASA/098', client: 'PT Mitra Sukses Abadi', amount: 6200000, date: '20 Juni 2026', status: 'Unpaid', daysOverdue: 6, po: 'PO-88029-445' },
  { id: 'INV/2026/ASA/089', client: 'PT Mitra Sukses Abadi', amount: 14250000, date: '24 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88029-411' },
  { id: 'INV/2026/ASA/074', client: 'PT Mitra Sukses Abadi', amount: 8500000, date: '10 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88029-389' },
  { id: 'INV/2026/ASA/101', client: 'PT Nusantara Citra Mandiri', amount: 5200000, date: '24 Juni 2026', status: 'Paid', daysOverdue: 0, po: 'PO-88104-102' }
];

const MOCK_CALENDAR_EVENTS = [
  { id: 'EV-1', date: '2026-06-25', client: 'PT Mitra Sukses Abadi', type: 'Preventive Maintenance', unit: 'Chiller York - Main Hall', tech: 'Supriadi & Team', status: 'Scheduled' },
  { id: 'EV-2', date: '2026-06-19', client: 'PT Mitra Sukses Abadi', type: 'Repair', unit: 'Daikin VRV - 4th Floor', tech: 'Ahmad & Budi', status: 'In Progress' },
  { id: 'EV-3', date: '2026-06-24', client: 'PT Nusantara Citra Mandiri', type: 'Installation', unit: 'McQuay AHU - Hall C', tech: 'Roni', status: 'Completed' },
  { id: 'EV-4', date: '2026-06-26', client: 'PT Nusantara Citra Mandiri', type: 'Preventive Maintenance', unit: 'Daikin Split Duct - Server Room', tech: 'Supriadi', status: 'Scheduled' }
];

const MOCK_DAILY_REPORTS = [
  {
    id: 'REP-001', date: '2026-06-29', client: 'PT Mitra Sukses Abadi', tech: 'Supriadi & Team',
    taskType: 'Preventive Maintenance', unit: 'Chiller York Water Cooled - Main Hall',
    checklist: [
      { label: 'Cek Tekanan Freon (High & Low)', done: true },
      { label: 'Pembersihan Evaporator & Kondensor', done: true },
      { label: 'Pemeriksaan Arus Listrik Kompresor', done: true },
      { label: 'Kalibrasi Sensor Suhu', done: true }
    ],
    partsUsed: 'Oli Chiller York Oil15 (5 Liter)',
    notes: 'Tekanan chiller stabil, oli kompresor telah ditambah. Unit beroperasi normal.',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    signature: 'Rendy Kurniadi'
  },
  {
    id: 'REP-002', date: '2026-06-28', client: 'PT Nusantara Citra Mandiri', tech: 'Roni',
    taskType: 'Repair', unit: 'Daikin Split Duct - Server Room',
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
];

// ─── LOAD / SAVE FUNCTIONS ────────────────────────────────────────────────────
// TODO(API): Ganti isi loadXxx() dengan fetch() dan saveXxx() dengan POST/PATCH.

function loadContractsData() {
  try {
    const saved = localStorage.getItem('b2b_contracts_data');
    if (saved) { const p = JSON.parse(saved); return Array.isArray(p) ? p : MOCK_CONTRACTS_DATA; }
  } catch(e) {}
  return MOCK_CONTRACTS_DATA;
}
function saveContractsData() {
  try { localStorage.setItem('b2b_contracts_data', JSON.stringify(contractsData)); } catch(e) {}
}

function loadInvoices() {
  try { const s = localStorage.getItem('b2b_invoices'); if (s) return JSON.parse(s); } catch(e) {}
  return MOCK_INVOICES;
}
function saveInvoices() {
  try { localStorage.setItem('b2b_invoices', JSON.stringify(invoices)); } catch(e) {}
}

function loadCalendarEvents() {
  try { const s = localStorage.getItem('b2b_calendar_events'); if (s) return JSON.parse(s); } catch(e) {}
  return MOCK_CALENDAR_EVENTS;
}
function saveCalendarEvents() {
  try { localStorage.setItem('b2b_calendar_events', JSON.stringify(calendarEvents)); } catch(e) {}
}

function loadDailyReports() {
  try { const s = localStorage.getItem('b2b_daily_reports'); if (s) return JSON.parse(s); } catch(e) {}
  return MOCK_DAILY_REPORTS;
}
function saveDailyReports() {
  try { localStorage.setItem('b2b_daily_reports', JSON.stringify(dailyReports)); } catch(e) {}
}

// ─── DATA STORE (dimuat dari localStorage / MOCK) ─────────────────────────────
let contractsData  = loadContractsData();
let invoices       = loadInvoices();
let calendarEvents = loadCalendarEvents();
let dailyReports   = loadDailyReports();

let clientAssignments = [
  { clientId: 'CON-88029', poCatalog: 'Katalog B2B York/Daikin Utama', creditLimit: 250000000, topDays: 45 },
  { clientId: 'CON-88104', poCatalog: 'Katalog B2B Umum', creditLimit: 100000000, topDays: 30 }
];

let b2cOrders = [
  {
    id: 'ORD-55029', clientName: 'Agus Hermawan', email: 'agus.hermawan@gmail.com',
    phone: '+62 813-8888-9999', address: 'Jl. Sudirman No. 12, Batam',
    unitName: 'York Premium Split AC 1.5 HP', spec: 'YWM15C3 - R410A - 12000 BTU',
    price: 4850000, qty: 1, date: '24 Juni 2026', statusStep: 3,
    statusText: 'Unit dalam Pengiriman', deliveryMethod: 'Kurir',
    historyLogs: [
      { title: 'Order Dipesan', desc: 'Pesanan unit AC telah diterima sistem.', date: '24 Juni 2026 09:30' },
      { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran via Bank Transfer diverifikasi.', date: '24 Juni 2026 11:15' },
      { title: 'Unit Dispatched', desc: 'Unit dikirim menggunakan Logistik PT. ASA.', date: '25 Juni 2026 08:00' }
    ]
  },
  {
    id: 'ORD-77082', clientName: 'Siti Rahma', email: 'siti.rahma@yahoo.com',
    phone: '+62 856-7777-1234', address: 'Cluster Anggrek Blok B No. 4, Batam Center',
    unitName: 'Value Vacuum Pump 1/4 HP', spec: 'VE115N - Single Stage - 1.8 CFM',
    price: 1250000, qty: 1, date: '25 Juni 2026', statusStep: 2,
    statusText: 'Pembayaran Diverifikasi', deliveryMethod: 'Ambil Sendiri',
    historyLogs: [
      { title: 'Order Dipesan', desc: 'Pesanan tools telah diterima sistem.', date: '25 Juni 2026 10:00' },
      { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran via Bank Transfer diverifikasi.', date: '25 Juni 2026 12:30' }
    ]
  },
  {
    id: 'ORD-55099', clientName: 'Heru Prasetyo', email: 'heru.p@outlook.com',
    phone: '+62 821-2222-3333', address: 'Komp. Ruko Nagoya Hill Blok A No. 10',
    unitName: 'Daikin Lite Split AC 1 HP', spec: 'FTCQ25S - R32 - 9000 BTU',
    price: 3650000, qty: 2, date: '22 Juni 2026', statusStep: 4,
    statusText: 'Pemasangan Selesai', deliveryMethod: 'Kurir',
    historyLogs: [
      { title: 'Order Dipesan', desc: 'Pesanan unit AC telah diterima.', date: '22 Juni 2026 14:00' },
      { title: 'Pembayaran Diverifikasi', desc: 'Pembayaran lunas terkonfirmasi.', date: '22 Juni 2026 14:30' },
      { title: 'Unit Dispatched', desc: 'Kurir logistik mengirimkan unit.', date: '23 Juni 2026 09:00' },
      { title: 'Pemasangan Selesai', desc: 'Teknisi PT. ASA selesai menginstalasi unit.', date: '23 Juni 2026 13:00' }
    ]
  }
];

let emergencyDos = [
  {
    id: 'EDO-2026-001', date: '2026-06-28', clientName: 'PT Mitra Sukses Abadi',
    emergencyType: 'Kebocoran Chiller Utama (Kritis)',
    actionTaken: 'Penggantian Seal Valve & Flushing Sistem',
    partsDispatched: 'Seal Gasket 4 Inch (2 Pcs), Chemical Flush (5 Liter)',
    baseFee: 1500000, partsCost: 850000, totalCost: 2350000, status: 'Dispatched'
  }
];

let b2cProducts = JSON.parse(localStorage.getItem('b2c_products') || 'null') || [
  { id: 1, name: 'Split AC', category: 'Residential', price: 'IDR 4.000.000 - 12.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 2, name: 'Cassette AC', category: 'Commercial', price: 'IDR 12.000.000 - 35.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 3, name: 'Floor Standing AC', category: 'Commercial', price: 'IDR 15.000.000 - 45.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1604754743422-f7569f658abe?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 4, name: 'Ceiling Concealed AC', category: 'Commercial', price: 'IDR 10.000.000 - 28.000.000', availability: 'Indent (2 Minggu)', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 5, name: 'VRF/VRV Systems', category: 'Industrial', price: 'Custom Quote Only', availability: 'Consultation Required', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 6, name: 'Commercial HVAC Equipment', category: 'Industrial', price: 'Custom Quote Only', availability: 'Consultation Required', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', images: [] },
  { id: 7, name: 'Accessories & Tools', category: 'Residential', price: 'IDR 250.000 - 5.000.000', availability: 'Ready Stock', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', images: [] }
];

let b2cBanners = JSON.parse(localStorage.getItem('marketing_banners') || 'null') || [
  { id: 1, title: 'Diskon Spesial Cuci AC Berkala', desc: 'Dapatkan diskon 20% untuk pembersihan AC.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80', link: '#contact', active: true, originalPrice: '', promoPrice: '' },
  { id: 2, title: 'Solusi Chiller Industri Efisien', desc: 'Layanan maintenance komprehensif untuk unit chiller York & Daikin.', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', link: '#services', active: true, originalPrice: '', promoPrice: '' }
];

// ─── STATE ────────────────────────────────────────────────────────
let activeTab = '<?= $initTab ?>';
let activeB2bSubTab = '<?= $initB2bSubTab ?>';
let activeB2cSubTab = '<?= $initB2cSubTab ?>';
let activeContractSubTab = 'list';
let activeFieldSubTab = 'calendar';
let activeEmergencySubTab = 'alarm';
let invoiceFilterUnpaid = false;
let isEmergencyActive = false;
let emergencyAlert = null;
let dispatchDate = getTodayISO(); // Task 2: default hari ini
let productImages = [];
let bannerImageData = '';
let selectedDoForPrint = null;
let selectedB2cOrderForPrint = null;
let b2cTrackingNos = {};

// ─── CROSS-TAB SYNC (Task 1) ──────────────────────────────────────────────────
// Saat CustomerDashboard.jsx (tab lain) update localStorage, admin dashboard
// ini otomatis reload data dan re-render view yang aktif.
window.addEventListener('storage', function(e) {
  if (e.key === 'b2b_contracts_data') {
    contractsData = loadContractsData();
    if (activeTab === 'b2b') renderContracts();
    renderKPIs(); renderCriticalTickets();
  } else if (e.key === 'b2b_invoices') {
    invoices = loadInvoices();
    if (activeTab === 'b2b' && activeB2bSubTab === 'invoices') renderInvoices();
    renderKPIs();
  } else if (e.key === 'b2b_calendar_events') {
    calendarEvents = loadCalendarEvents();
    if (activeTab === 'b2b' && activeB2bSubTab === 'field-service') renderCalendar();
  } else if (e.key === 'b2b_daily_reports') {
    dailyReports = loadDailyReports();
    if (activeTab === 'b2b' && activeB2bSubTab === 'field-service') renderDailyReports();
  }
});

// ─── TAB SWITCHING ────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;

  // Hide all tabs
  ['tab-overview','tab-b2b-contracts','tab-b2b-field-service','tab-b2b-invoices','tab-b2c-ondemand','tab-b2c-catalog','tab-b2c-cms','tab-b2c-emergency'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Hide both subnavs
  document.getElementById('subnav-b2b').classList.add('hidden');
  document.getElementById('subnav-b2c').classList.add('hidden');

  // Update nav dropdown value
  const navDropdown = document.getElementById('nav-dropdown-main');
  if (navDropdown && navDropdown.value !== tab) {
    navDropdown.value = tab;
  }

  if (tab === 'overview') {
    document.getElementById('tab-overview').classList.remove('hidden');
    renderKPIs();
    renderCriticalTickets();
  } else if (tab === 'b2b') {
    document.getElementById('subnav-b2b').classList.remove('hidden');
    switchB2bSubTab(activeB2bSubTab);
  } else if (tab === 'b2c') {
    document.getElementById('subnav-b2c').classList.remove('hidden');
    switchB2cSubTab(activeB2cSubTab);
  }
}

function switchB2bSubTab(sub) {
  activeB2bSubTab = sub;
  ['tab-b2b-contracts','tab-b2b-field-service','tab-b2b-invoices'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['btn-b2b-contracts','btn-b2b-field-service','btn-b2b-invoices'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove('bg-[#2563EB]','text-white','hover:bg-[#1d4ed8]');
      btn.classList.add('text-slate-500','hover:bg-slate-50');
    }
  });
  const activeBtn = document.getElementById('btn-b2b-' + sub);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#2563EB]','text-white','hover:bg-[#1d4ed8]');
    activeBtn.classList.remove('text-slate-500','hover:bg-slate-50');
  }

  // Toggle invoice filter button visibility in header
  const invoiceAction = document.getElementById('b2b-invoices-action');
  if (invoiceAction) {
    if (sub === 'invoices') invoiceAction.classList.remove('hidden');
    else invoiceAction.classList.add('hidden');
  }

  if (sub === 'contracts') {
    document.getElementById('tab-b2b-contracts').classList.remove('hidden');
    switchContractSubTab(activeContractSubTab);
    renderContracts();
  } else if (sub === 'field-service') {
    document.getElementById('tab-b2b-field-service').classList.remove('hidden');
    switchFieldSubTab(activeFieldSubTab);
  } else if (sub === 'invoices') {
    document.getElementById('tab-b2b-invoices').classList.remove('hidden');
    renderInvoices();
  }
}

function switchB2cSubTab(sub) {
  activeB2cSubTab = sub;
  ['tab-b2c-ondemand','tab-b2c-catalog','tab-b2c-cms','tab-b2c-emergency'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['btn-b2c-ondemand','btn-b2c-catalog','btn-b2c-cms','btn-b2c-emergency'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove('bg-[#2563EB]','text-white','hover:bg-[#1d4ed8]');
      btn.classList.add('text-slate-500','hover:bg-slate-50');
    }
  });
  const activeBtn = document.getElementById('btn-b2c-' + sub);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#2563EB]','text-white','hover:bg-[#1d4ed8]');
    activeBtn.classList.remove('text-slate-500','hover:bg-slate-50');
  }

  if (sub === 'ondemand') { document.getElementById('tab-b2c-ondemand').classList.remove('hidden'); renderB2cOrders(); }
  else if (sub === 'catalog') { document.getElementById('tab-b2c-catalog').classList.remove('hidden'); renderCatalog(); }
  else if (sub === 'cms') { document.getElementById('tab-b2c-cms').classList.remove('hidden'); renderBanners(); }
  else if (sub === 'emergency') { document.getElementById('tab-b2c-emergency').classList.remove('hidden'); switchEmergencySubTab(activeEmergencySubTab); }
}

function switchContractSubTab(sub) {
  activeContractSubTab = sub;
  ['contract-view-list','contract-view-assets'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['btn-ct-list','btn-ct-assets'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.classList.remove('bg-white','text-[#0F3D5E]','shadow-sm'); btn.classList.add('text-slate-500','hover:text-slate-900'); }
  });
  const activeBtn = document.getElementById('btn-ct-' + (sub === 'list' ? 'list' : 'assets'));
  if (activeBtn) { activeBtn.classList.add('bg-white','text-[#0F3D5E]','shadow-sm'); activeBtn.classList.remove('text-slate-500'); }

  if (sub === 'list') { document.getElementById('contract-view-list').classList.remove('hidden'); renderContracts(); }
  else { document.getElementById('contract-view-assets').classList.remove('hidden'); renderAssetsByCategory(); }
}

function switchFieldSubTab(sub) {
  activeFieldSubTab = sub;
  ['fs-view-calendar','fs-view-reports'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['btn-fs-calendar','btn-fs-reports'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.classList.remove('bg-white','text-[#0F3D5E]','shadow-sm'); btn.classList.add('text-slate-500'); }
  });
  const shortId = sub === 'calendar' ? 'calendar' : 'reports';
  const activeBtn = document.getElementById('btn-fs-' + shortId);
  if (activeBtn) { activeBtn.classList.add('bg-white','text-[#0F3D5E]','shadow-sm'); activeBtn.classList.remove('text-slate-500'); }

  // Toggle calendar action button visibility in header card
  const calendarAction = document.getElementById('fs-calendar-action');
  if (calendarAction) {
    if (sub === 'calendar') calendarAction.classList.remove('hidden');
    else calendarAction.classList.add('hidden');
  }

  if (sub === 'calendar') { document.getElementById('fs-view-calendar').classList.remove('hidden'); renderCalendar(); }
  else { document.getElementById('fs-view-reports').classList.remove('hidden'); renderDailyReports(); }
}

function switchEmergencySubTab(sub) {
  activeEmergencySubTab = sub;
  ['em-view-alarm','em-view-do'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  ['btn-em-alarm','btn-em-do'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.classList.remove('bg-white','text-[#0F3D5E]','shadow-sm'); btn.classList.add('text-slate-500'); }
  });
  const shortId = sub === 'alarm' ? 'alarm' : 'do';
  const activeBtn = document.getElementById('btn-em-' + shortId);
  if (activeBtn) { activeBtn.classList.add('bg-white','text-[#0F3D5E]','shadow-sm'); activeBtn.classList.remove('text-slate-500'); }

  if (sub === 'alarm') { document.getElementById('em-view-alarm').classList.remove('hidden'); renderEmergencyAlarm(); }
  else { document.getElementById('em-view-do').classList.remove('hidden'); renderEmergencyDos(); }
}

// ─── MODAL HELPERS ─────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto bg-[#0F3D5E] text-white py-3.5 px-5 shadow-2xl flex items-center gap-3 border-l-4 rounded-xl text-xs font-semibold tracking-wide font-space transition-all duration-300 transform translate-y-2 opacity-0 max-w-sm`;
  
  if (type === 'success') {
    toast.classList.add('border-emerald-500');
    toast.innerHTML = `
      <div class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">✓</div>
      <div class="text-left flex-1">${message}</div>
      <button class="ml-3 text-slate-400 hover:text-white text-base font-bold shrink-0">&times;</button>
    `;
  } else if (type === 'error') {
    toast.classList.add('border-red-500');
    toast.innerHTML = `
      <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">✕</div>
      <div class="text-left flex-1">${message}</div>
      <button class="ml-3 text-slate-400 hover:text-white text-base font-bold shrink-0">&times;</button>
    `;
  } else {
    toast.classList.add('border-blue-500');
    toast.innerHTML = `
      <div class="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">i</div>
      <div class="text-left flex-1">${message}</div>
      <button class="ml-3 text-slate-400 hover:text-white text-base font-bold shrink-0">&times;</button>
    `;
  }
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);
  
  const dismiss = () => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  };
  
  toast.querySelector('button').onclick = dismiss;
  setTimeout(dismiss, 4000);
}


// ─── OVERVIEW RENDERER (all widgets) ──────────────────────────────
function renderKPIs() { renderOverview(); }
function renderCriticalTickets() { renderOverview(); }

function renderOverview() {
  const allTickets  = contractsData.flatMap(c => c.tickets.map(t => ({...t, clientName: c.clientName, clientId: c.id})));
  const allAssets   = contractsData.flatMap(c => (c.assets||[]).map(a => ({...a, clientName: c.clientName})));
  const pendingTickets  = allTickets.filter(t => t.status !== 'Completed');
  const pendingOrders   = b2cOrders.filter(o => o.statusStep < 4);
  const unpaidInvs  = invoices.filter(i => i.status === 'Unpaid');
  const paidInvs    = invoices.filter(i => i.status === 'Paid');
  const b2bRevenue  = paidInvs.reduce((s,i) => s+i.amount, 0);
  const b2cRevenue  = b2cOrders.reduce((s,o) => s+(o.price*o.qty), 0);
  const totalRev    = b2bRevenue + b2cRevenue;
  const activeClients = contractsData.length;
  const dispatchCount = calendarEvents.length;
  const approvedReps  = dailyReports.filter(r => r.status === 'Approved').length;
  const totalReps     = dailyReports.length;

  const fmt = v => 'Rp ' + v.toLocaleString('id-ID');

  // ── KPI Cards ──
  const el = id => document.getElementById(id);
  if (el('kpi-revenue'))       { el('kpi-revenue').textContent = fmt(totalRev); el('kpi-revenue-sub').textContent = `B2B ${fmt(b2bRevenue)} + B2C ${fmt(b2cRevenue)}`; }
  if (el('kpi-b2b-tickets'))   { el('kpi-b2b-tickets').textContent = pendingTickets.length; el('kpi-tickets-sub').textContent = pendingTickets.filter(t=>t.priority==='High').length + ' prioritas tinggi'; }
  if (el('kpi-b2c-orders'))    { el('kpi-b2c-orders').textContent = pendingOrders.length; el('kpi-orders-sub').textContent = b2cOrders.length + ' total pesanan'; }
  if (el('kpi-overdue'))       { el('kpi-overdue').textContent = unpaidInvs.length + ' Invoice'; el('kpi-overdue-sub').textContent = fmt(unpaidInvs.reduce((s,i)=>s+i.amount,0)); }
  if (el('kpi-active-clients')){ el('kpi-active-clients').textContent = activeClients; el('kpi-clients-sub').textContent = allAssets.length + ' unit terdaftar'; }
  if (el('kpi-dispatches'))    { el('kpi-dispatches').textContent = dispatchCount; el('kpi-dispatches-sub').textContent = 'bulan ini'; }
  if (el('kpi-unpaid-count'))  { el('kpi-unpaid-count').textContent = unpaidInvs.length; if(el('kpi-overdue-sub')) el('kpi-overdue-sub').textContent = fmt(unpaidInvs.reduce((s,i)=>s+i.amount,0)); }
  if (el('kpi-validated-reports')){ el('kpi-validated-reports').textContent = approvedReps; el('kpi-reports-sub').textContent = `dari ${totalReps} laporan`; }

  // ── Donut Chart ──
  if (totalRev > 0) {
    const circ = 2 * Math.PI * 38; // r=38 → 238.76
    const b2bFrac = b2bRevenue / totalRev;
    const b2cFrac = b2cRevenue / totalRev;
    const b2bArc = (b2bFrac * circ).toFixed(1);
    const b2cArc = (b2cFrac * circ).toFixed(1);
    const db2b = el('donut-b2b'); const db2c = el('donut-b2c');
    if(db2b) { db2b.setAttribute('stroke-dasharray', `${b2bArc} ${circ}`); db2b.setAttribute('stroke-dashoffset', '0'); }
    if(db2c) { db2c.setAttribute('stroke-dasharray', `${b2cArc} ${circ}`); db2c.setAttribute('stroke-dashoffset', `-${b2bArc}`); }
    if(el('donut-pct')) el('donut-pct').textContent = Math.round(b2bFrac * 100) + '%';
    if(el('overview-b2b-rev')) el('overview-b2b-rev').textContent = fmt(b2bRevenue);
    if(el('overview-b2c-rev')) el('overview-b2c-rev').textContent = fmt(b2cRevenue);
    if(el('overview-total-rev')) el('overview-total-rev').textContent = fmt(totalRev);
  }

  // ── Invoice Aging ──
  const agingCnt = el('invoice-aging-container');
  if (agingCnt) {
    const groups = [
      { label: 'Lunas', color: 'bg-emerald-500', count: paidInvs.length, total: paidInvs.reduce((s,i)=>s+i.amount,0) },
      { label: 'Belum Bayar', color: 'bg-red-500', count: unpaidInvs.length, total: unpaidInvs.reduce((s,i)=>s+i.amount,0) },
      { label: 'Menunggak >30 Hari', color: 'bg-rose-800', count: unpaidInvs.filter(i=>i.daysOverdue>30).length, total: unpaidInvs.filter(i=>i.daysOverdue>30).reduce((s,i)=>s+i.amount,0) },
    ];
    const maxC = Math.max(...groups.map(g=>g.count), 1);
    agingCnt.innerHTML = groups.map(g => `
      <div class="space-y-1">
        <div class="flex justify-between text-[10px] font-semibold">
          <span class="text-slate-500">${g.label}</span>
          <span class="font-bold text-slate-700">${g.count} inv — ${fmt(g.total)}</span>
        </div>
        <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="${g.color} h-full rounded-full transition-all" style="width:${Math.round((g.count/maxC)*100)}%"></div>
        </div>
      </div>`).join('');
    if(el('inv-paid-total')) el('inv-paid-total').textContent = fmt(paidInvs.reduce((s,i)=>s+i.amount,0));
    if(el('inv-unpaid-total')) el('inv-unpaid-total').textContent = fmt(unpaidInvs.reduce((s,i)=>s+i.amount,0));
  }

  // ── B2C Pipeline ──
  const pipelineCnt = el('b2c-pipeline-container');
  if (pipelineCnt) {
    const stages = [
      { label: '1 — Dipesan', step: 1, color: 'bg-slate-400' },
      { label: '2 — Pembayaran', step: 2, color: 'bg-amber-400' },
      { label: '3 — Pengiriman / Siap Ambil', step: 3, color: 'bg-sky-500' },
      { label: '4 — Selesai', step: 4, color: 'bg-emerald-500' },
    ];
    const maxS = Math.max(...stages.map(s => b2cOrders.filter(o=>o.statusStep===s.step).length), 1);
    pipelineCnt.innerHTML = stages.map(s => {
      const cnt = b2cOrders.filter(o => o.statusStep === s.step).length;
      return `
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-slate-500 font-semibold w-44 shrink-0">${s.label}</span>
          <div class="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="${s.color} h-full rounded-full" style="width:${Math.round((cnt/Math.max(b2cOrders.length,1))*100)}%"></div>
          </div>
          <span class="text-[10px] font-black text-slate-700 w-5 text-right">${cnt}</span>
        </div>`;
    }).join('');
  }

  // ── Critical Tickets ──
  const ticketCnt = el('critical-tickets-container');
  if (ticketCnt) {
    const sorted = [...allTickets].sort((a,b) => (a.priority==='High'?0:1)-(b.priority==='High'?0:1));
    ticketCnt.innerHTML = sorted.length ? sorted.map(ticket => `
      <div class="py-3 flex justify-between items-center gap-3">
        <div class="min-w-0">
          <span class="font-mono font-bold text-[#0F3D5E] text-[10px] block">${ticket.id} — ${ticket.clientName}</span>
          <strong class="block text-slate-700 text-xs font-extrabold mt-0.5 truncate">${ticket.type}</strong>
          <span class="text-[10px] text-slate-400">${ticket.unit}</span>
        </div>
        <div class="text-right shrink-0">
          <span class="px-2 py-0.5 rounded-lg text-[8px] font-black font-space uppercase block text-center mb-1 ${ticket.priority==='High'?'bg-red-50 text-red-600 border border-red-100':'bg-slate-100 text-slate-500'}">${ticket.priority}</span>
          <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${ticket.status==='Completed'?'bg-emerald-100 text-emerald-800':ticket.status==='In Progress'?'bg-blue-100 text-blue-800':'bg-amber-100 text-amber-800'}">${ticket.status}</span>
        </div>
      </div>`).join('') :
      '<p class="text-[11px] text-slate-400 italic py-4 text-center">Tidak ada tiket aktif.</p>';
  }

  // ── Technician Workload ──
  const techCnt = el('tech-workload-container');
  if (techCnt) {
    const techMap = {};
    calendarEvents.forEach(ev => {
      if (!techMap[ev.tech]) techMap[ev.tech] = 0;
      techMap[ev.tech]++;
    });
    allTickets.filter(t=>t.status!=='Completed').forEach(t => {
      const tech = t.assignedTo || 'Belum Ditugaskan';
      if (!techMap[tech]) techMap[tech] = 0;
      techMap[tech]++;
    });
    const entries = Object.entries(techMap).sort((a,b)=>b[1]-a[1]).slice(0, 5);
    const maxW = Math.max(...entries.map(e=>e[1]), 1);
    techCnt.innerHTML = entries.length ? entries.map(([tech, cnt]) => `
      <div class="space-y-1">
        <div class="flex justify-between text-[10px]">
          <span class="font-semibold text-slate-600">${tech}</span>
          <span class="font-black text-[#0F3D5E]">${cnt} tugas</span>
        </div>
        <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="bg-[#0F3D5E] h-full rounded-full" style="width:${Math.round((cnt/maxW)*100)}%"></div>
        </div>
      </div>`).join('') :
      '<p class="text-[11px] text-slate-400 italic">Belum ada data beban kerja.</p>';
  }

  // ── Asset Health ──
  const assetHCnt = el('asset-health-container');
  if (assetHCnt) {
    const statMap = {};
    allAssets.forEach(a => { statMap[a.status] = (statMap[a.status]||0)+1; });
    const statusCfg = {
      'Optimal': { color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
      'Perlu Perhatian': { color: 'bg-amber-400', badge: 'bg-amber-100 text-amber-800' },
      'Rusak': { color: 'bg-red-500', badge: 'bg-red-100 text-red-800' },
    };
    const total = allAssets.length || 1;
    assetHCnt.innerHTML = allAssets.length ? Object.entries(statMap).map(([status, cnt]) => {
      const cfg = statusCfg[status] || { color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' };
      return `
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 text-[9px] font-black rounded-lg ${cfg.badge} w-36 text-center shrink-0">${status}</span>
          <div class="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="${cfg.color} h-full rounded-full" style="width:${Math.round((cnt/total)*100)}%"></div>
          </div>
          <span class="text-[10px] font-black text-slate-700 w-14 text-right">${cnt} / ${total} unit</span>
        </div>`;
    }).join('') :
    '<p class="text-[11px] text-slate-400 italic">Belum ada aset terdaftar.</p>';
  }

  // ── Recent Daily Reports ──
  const repCnt = el('recent-reports-container');
  if (repCnt) {
    const recent = [...dailyReports].slice(0, 5);
    repCnt.innerHTML = recent.length ? recent.map(rep => `
      <div class="flex justify-between items-start p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
        <div class="min-w-0">
          <span class="font-mono text-[10px] text-[#0F3D5E] font-bold block">${rep.id} — ${rep.client}</span>
          <strong class="block text-slate-700 text-xs mt-0.5 truncate">${rep.unit}</strong>
          <span class="text-[9px] text-slate-400">${rep.tech} · ${rep.date}</span>
        </div>
        <div class="shrink-0 ml-3 flex flex-col items-end gap-1.5">
          <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${rep.status==='Approved'?'bg-emerald-100 text-emerald-800':rep.status==='Rejected'?'bg-red-100 text-red-800':'bg-amber-100 text-amber-700'}">${rep.status==='Approved'?'Disetujui':rep.status==='Rejected'?'Ditolak':'Menunggu'}</span>
          ${rep.status!=='Approved'?`<button onclick="openReportReview('${rep.id}')" class="text-[9px] font-bold text-[#2563EB] hover:underline">Review →</button>`:''}
        </div>
      </div>`).join('') :
    '<p class="text-[11px] text-slate-400 italic py-2">Belum ada laporan teknisi.</p>';
  }
}


// ─── CONTRACTS RENDERER ────────────────────────────────────────────
function renderContracts() {
  const query = (document.getElementById('search-contracts')?.value || '').toLowerCase();
  const container = document.getElementById('contracts-list-container');
  if (!container) return;

  const filtered = contractsData.filter(c => c.clientName.toLowerCase().includes(query) || c.pic.toLowerCase().includes(query));
  container.innerHTML = filtered.map(client => {
    const assignment = clientAssignments.find(a => a.clientId === client.id);
    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
        <div class="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-sm font-extrabold text-[#0C3254]">${client.clientName}</h2>
              <span class="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide bg-blue-100 text-blue-800">${client.id}</span>
              <span class="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide bg-emerald-100 text-emerald-800">Kontrak Aktif</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-1">PIC: <strong class="text-slate-600">${client.pic}</strong> | ${client.phone} | ${client.email}</p>
          </div>
          <div class="text-left md:text-right">
            <span class="text-[9px] text-slate-400 block font-semibold">Masa Berlaku Kontrak</span>
            <strong class="text-xs text-[#0F3D5E] font-bold">${client.startDate} - ${client.endDate}</strong>
          </div>
        </div>

        <div class="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div class="space-y-3">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Spesifikasi Layanan Kontrak (SLA)</h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-[9px] text-slate-400 block">SLA Respon</span>
                <strong class="text-xs text-[#0F3D5E] font-bold">${client.slaResponse}</strong>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-[9px] text-slate-400 block">SLA Resolusi</span>
                <strong class="text-xs text-[#0F3D5E] font-bold">${client.slaResolution}</strong>
              </div>
            </div>
            ${assignment ? `
            <div class="bg-[#2563EB]/10 p-3 rounded-xl border border-[#2563EB]/20 grid grid-cols-2 gap-3 mt-2">
              <div>
                <span class="text-[9px] text-slate-500 block">Katalog khusus PO</span>
                <strong class="text-[10px] text-[#0F3D5E] font-bold truncate block">${assignment.poCatalog}</strong>
              </div>
              <div>
                <span class="text-[9px] text-slate-500 block">Limit Kredit & TOP</span>
                <strong class="text-[10px] text-[#0F3D5E] font-bold block">Rp ${assignment.creditLimit.toLocaleString('id-ID')} (${assignment.topDays} Hari)</strong>
              </div>
            </div>` : ''}

            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-4">Tiket Layanan Aktif</h4>
            <div class="space-y-2">
              ${client.tickets.map(t => `
                <div class="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span class="font-mono text-[10px] text-[#0F3D5E] font-bold">${t.id}</span>
                    <strong class="block text-[11px] text-slate-700">${t.type}</strong>
                    <span class="text-[9px] text-slate-400">${t.unit}</span>
                  </div>
                  <div class="text-right">
                    <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase block mb-1 ${t.priority === 'High' ? 'bg-red-100 text-red-800' : t.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}">${t.priority}</span>
                    <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">${t.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
            <button type="button" onclick="openTicketAddForClient('${client.id}')" class="text-[9px] text-[#3B82F6] hover:underline font-bold font-space uppercase mt-1">+ Tambah Tiket Baru</button>
          </div>

          <div>
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Inventaris Aset Unit Terdaftar (${client.assets ? client.assets.length : 0})</h4>
            <div class="space-y-2">
              ${(client.assets || []).length > 0 ? (client.assets || []).map(asset => `
                <div class="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-200 transition-colors">
                  <div>
                    <strong class="text-[11px] text-slate-700 font-bold block">${asset.name}</strong>
                    <span class="text-[9px] text-slate-400 block">${asset.spec} | ${asset.location}</span>
                    <span class="text-[9px] text-slate-400">Servis Terakhir: ${asset.lastServiced}</span>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${asset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${asset.status}</span>
                    <button type="button" onclick="openHistoryModal('${asset.id}', '${asset.name}')" class="text-[9px] text-[#3B82F6] hover:underline font-bold font-space uppercase">Lihat Histori Servis</button>
                  </div>
                </div>
              `).join('') : '<p class="text-[11px] text-slate-400 italic">Belum ada aset terdaftar.</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── ASSETS BY CATEGORY ────────────────────────────────────────────
function renderAssetsByCategory() {
  const container = document.getElementById('assets-by-category');
  if (!container) return;
  const cats = ['Chiller', 'VRV / VRF System', 'Air Handling Unit (AHU)'];
  container.innerHTML = cats.map(cat => {
    const allAssets = contractsData.flatMap(c => (c.assets||[]).map(a => ({...a, clientName: c.clientName})));
    const matching = allAssets.filter(a => {
      if (cat === 'Chiller') return a.name.toLowerCase().includes('chiller');
      if (cat === 'VRV / VRF System') return a.name.toLowerCase().includes('vrv') || a.name.toLowerCase().includes('vrf');
      return a.name.toLowerCase().includes('ahu') || a.name.toLowerCase().includes('handling');
    });
    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-[#0F3D5E]/5 flex justify-between items-center">
          <span class="text-xs font-black text-[#0F3D5E] uppercase tracking-wider">${cat}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-[#0F3D5E] text-white text-[10px] font-black font-space">${matching.length} Unit</span>
        </div>
        <div class="p-6 divide-y divide-slate-100">
          ${matching.length > 0 ? matching.map(asset => `
            <div class="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between gap-4">
              <div class="space-y-1.5 flex-1">
                <div class="flex items-center gap-2">
                  <strong class="text-xs text-slate-800 font-extrabold">${asset.name}</strong>
                  <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-mono rounded">${asset.id}</span>
                  <span class="text-[10px] text-[#2563EB] font-bold font-space">| ${asset.clientName}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-500 font-semibold">
                  <div><span class="text-slate-400 block">Spesifikasi Model:</span><span>${asset.spec}</span></div>
                  <div><span class="text-slate-400 block">Lokasi Instalasi:</span><span>${asset.location}</span></div>
                  <div><span class="text-slate-400 block">Servis Terakhir:</span><span>${asset.lastServiced || '-'}</span></div>
                </div>
              </div>
              <div class="flex flex-col justify-between items-start md:items-end shrink-0 gap-2">
                <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase tracking-wider ${asset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${asset.status}</span>
                <button type="button" onclick="openHistoryModal('${asset.id}', '${asset.name}')" class="text-[9px] text-[#3B82F6] hover:underline font-bold font-space uppercase">Lihat Histori Servis</button>
              </div>
            </div>
          `).join('') : '<p class="text-[11px] text-slate-400 italic text-center py-4">Belum ada unit terdaftar pada kategori ini.</p>'}
        </div>
      </div>
    `;
  }).join('');
}

// ─── CALENDAR RENDERER ─────────────────────────────────────────────
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  let html = '<div class="aspect-square bg-slate-50/50 rounded-xl border border-slate-100 p-1"></div>';
  for (let i = 1; i <= 30; i++) {
    const dayNum = i;
    const dateStr = `2026-06-${String(dayNum).padStart(2,'0')}`;
    const dayEvents = calendarEvents.filter(ev => ev.date === dateStr);
    html += `
      <div onclick="openDispatchModal('${dateStr}')" class="aspect-square bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer min-h-[90px]">
        <span class="text-[10px] font-extrabold text-slate-400 block text-left">${dayNum}</span>
        <div class="space-y-1 overflow-y-auto max-h-12">
          ${dayEvents.map(ev => {
            let colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
            if (ev.type === 'Repair') colorClass = 'bg-rose-100 text-rose-800 border-rose-200';
            if (ev.type === 'Installation') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            return `<div onclick="event.stopPropagation(); openEditDispatchModal('${ev.id}')" class="text-[8px] font-semibold px-1 py-0.5 rounded border ${colorClass} truncate text-left hover:brightness-95 transition-all" title="${ev.type} - ${ev.client} (${ev.tech})">${ev.type.split(' ')[0]}: ${ev.client.split(' ').slice(1,3).join(' ')}</div>`;
          }).join('')}
        </div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

// ─── DAILY REPORTS RENDERER ────────────────────────────────────────
function renderDailyReports() {
  const container = document.getElementById('daily-reports-container');
  if (!container) return;
  container.innerHTML = dailyReports.map(rep => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
      <div class="space-y-1.5 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <strong class="text-xs text-slate-800 font-extrabold">${rep.client}</strong>
          <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-mono rounded">${rep.id}</span>
          <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${rep.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : rep.status === 'Revised' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${rep.status}</span>
        </div>
        <p class="text-[10px] text-slate-500 font-semibold">Tugas: <span class="text-[#0F3D5E]">${rep.taskType}</span> | Unit: ${rep.unit} | Teknisi: ${rep.tech} | Tanggal: ${rep.date}</p>
        ${rep.notes ? `<div class="bg-slate-50 p-2 rounded-lg text-[9.5px] text-slate-600 border border-slate-200 mt-1 max-w-xl"><strong>Catatan Pekerjaan:</strong> ${rep.notes}</div>` : ''}
      </div>
      <div class="shrink-0">
        <button type="button" onclick="openReportReview('${rep.id}')" class="px-4 py-2 bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-xs rounded-xl shadow-sm transition-all">Tinjau Detail Laporan</button>
      </div>
    </div>
  `).join('');
}

// ─── INVOICES RENDERER ─────────────────────────────────────────────
function renderInvoices() {
  const tbody = document.getElementById('invoices-table-body');
  if (!tbody) return;
  const filtered = invoiceFilterUnpaid ? invoices.filter(i => i.status === 'Unpaid') : invoices;
  tbody.innerHTML = filtered.map(inv => `
    <tr class="hover:bg-slate-50/40 ${inv.status === 'Unpaid' ? 'bg-red-50/5' : ''}">
      <td class="p-4 font-mono font-bold text-slate-800">${inv.id}</td>
      <td class="p-4 text-slate-700 font-bold">${inv.client}</td>
      <td class="p-4 font-mono text-slate-500">${inv.po}</td>
      <td class="p-4 text-slate-400">${inv.date}</td>
      <td class="p-4">
        <strong class="text-slate-700 font-manrope font-extrabold">Rp ${inv.amount.toLocaleString('id-ID')}</strong>
        ${inv.daysOverdue > 0 ? `<span class="text-[10px] text-red-500 font-bold block mt-0.5">${inv.daysOverdue} Hari Terlambat</span>` : ''}
      </td>
      <td class="p-4 text-center">
        <div class="space-y-1">
          <span class="px-2 py-0.5 text-[9px] font-black font-space rounded uppercase tracking-wide ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">${inv.status === 'Paid' ? 'LUNAS' : 'BELUM BAYAR'}</span>
          <div class="text-[9px] text-slate-400 font-mono">${inv.status === 'Paid' ? 'Gateway: Midtrans (Settled)' : 'Gateway: Xendit VA (Pending)'}</div>
        </div>
      </td>
      <td class="p-4 text-center">
        <div class="flex flex-col gap-1.5 items-center justify-center">
          ${inv.status === 'Unpaid' ? `
            <button onclick="simulateWebhook('${inv.id}')" class="px-3 py-1.5 bg-[#0F3D5E] hover:bg-[#0c304a] text-white font-bold text-[10px] rounded-lg transition-all shadow-sm">Sinkronisasi Gateway</button>
            <span class="text-[9px] text-slate-400 font-medium">atau ubah status:</span>
          ` : ''}
          <select onchange="updateInvoiceStatus('${inv.id}', this.value)" class="bg-white border border-slate-200 text-[10px] font-bold p-1 rounded focus:outline-none focus:border-[#2563EB] text-slate-700">
            <option value="Unpaid" ${inv.status === 'Unpaid' ? 'selected' : ''}>Belum Bayar (Pending)</option>
            <option value="Paid" ${inv.status === 'Paid' ? 'selected' : ''}>Lunas (Settled)</option>
          </select>
        </div>
      </td>
    </tr>
  `).join('');
}

let activeB2cOrderFilter = 'all';
function setB2cOrderFilter(val) {
  activeB2cOrderFilter = val;
  ['all', '1', '2', '3', '4'].forEach(v => {
    const btn = document.getElementById(`btn-filter-b2c-${v}`);
    if (btn) {
      if (v === val) {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#0F3D5E] text-white";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100";
      }
    }
  });
  renderB2cOrders();
}

// ─── B2C ORDERS RENDERER ───────────────────────────────────────────
function renderB2cOrders() {
  const query = (document.getElementById('search-b2c-orders')?.value || '').toLowerCase();
  const container = document.getElementById('b2c-orders-container');
  if (!container) return;
  const filtered = b2cOrders.filter(o => {
    const matchesQuery = o.clientName.toLowerCase().includes(query) || o.id.toLowerCase().includes(query);
    const matchesFilter = activeB2cOrderFilter === 'all' || o.statusStep === Number(activeB2cOrderFilter);
    return matchesQuery && matchesFilter;
  });

  container.innerHTML = filtered.map(ord => {
    const stepsLabels = ['', 'Dipesan', 'Lunas', ord.deliveryMethod === 'Ambil Sendiri' ? 'Siap Diambil' : 'Kirim', 'Selesai'];
    const steps = [1,2,3,4].map(s => {
      const isCurrent = ord.statusStep === s;
      const isAuto = s <= 2;
      if (isAuto) {
        return `<div class="p-2 rounded-lg text-center border text-[10px] font-bold flex flex-col items-center justify-center select-none ${isCurrent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}"><span>${s}. ${stepsLabels[s]}</span></div>`;
      }
      return `<button type="button" onclick="updateOrderStep('${ord.id}', ${s})" class="p-2 rounded-lg text-center transition-all border text-[10px] font-bold flex flex-col items-center justify-center ${isCurrent ? 'bg-[#0F3D5E] border-[#0F3D5E] text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}"><span>${s}. ${stepsLabels[s]}</span></button>`;
    }).join('');

    const trackingInput = ord.statusStep === 3 ? (ord.deliveryMethod === 'Ambil Sendiri' ? `
      <div class="mt-3 bg-blue-50/40 p-3 rounded-xl border border-blue-200/50 space-y-2 text-left">
        <span class="text-[9.5px] font-black text-[#0F3D5E] uppercase block">Konfirmasi Siap Diambil</span>
        <p class="text-[10.5px] text-slate-600 font-semibold">Kustomer memilih Ambil Mandiri. Pastikan unit telah disiapkan di area serah terima.</p>
        <button type="button" onclick="updateOrderStep('${ord.id}', 3)" class="bg-[#0F3D5E] hover:bg-[#15527d] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm">Konfirmasi Barang Siap Diambil</button>
      </div>
    ` : `
      <div class="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2 text-left">
        <span class="text-[9.5px] font-black text-[#0F3D5E] uppercase block">Pembaruan Logistik Kantor (PT. ASA)</span>
        <div class="flex gap-1.5">
          <div class="bg-slate-100 border border-slate-200 text-[10px] p-1.5 rounded-lg font-bold text-slate-700 flex items-center shrink-0">Kurir Internal ASA</div>
          <input type="text" id="tracking-${ord.id}" placeholder="Nama Driver / No. Polisi..." class="bg-white border border-slate-200 text-[10px] p-1.5 rounded-lg flex-1 focus:outline-none font-semibold">
          <button type="button" onclick="saveTracking('${ord.id}')" class="bg-[#0F3D5E] hover:bg-[#0c304a] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all">Kirim Barang</button>
        </div>
      </div>
    `) : '';

    const deliveryBtn = ord.statusStep < 4 ? `
      <div class="mt-3">
        ${ord.deliveryMethod === 'Ambil Sendiri' ? `
          <button type="button" onclick="changeDeliveryMethod('${ord.id}', 'Kurir')" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-[#0F3D5E] bg-slate-100 hover:bg-slate-200 rounded-lg transition-all border border-slate-200 shadow-sm">📦 Ubah ke Kirim via Kurir Kantor</button>
        ` : `
          <button type="button" onclick="changeDeliveryMethod('${ord.id}', 'Ambil Sendiri')" class="inline-flex items-center px-3.5 py-1.5 text-[10px] font-extrabold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 shadow-sm cursor-pointer">Ubah Metode: Kustomer Ambil Sendiri</button>
        `}
      </div>
    ` : '';

    return `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-extrabold text-sm text-[#0F3D5E]">${ord.clientName}</h4>
              <span class="font-mono font-bold text-xs text-slate-500">(${ord.id})</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Alamat: ${ord.address} | Telp: ${ord.phone}</p>
            ${deliveryBtn}
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Total Pembelian (${ord.qty} unit)</span>
            <strong class="text-sm font-manrope font-black text-slate-700">Rp ${(ord.price * ord.qty).toLocaleString('id-ID')}</strong>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-4 space-y-2">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spesifikasi Item:</span>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong class="block text-slate-700 text-xs font-bold">${ord.unitName}</strong>
              <span class="text-[10px] text-slate-500 block mt-0.5">${ord.spec}</span>
              <span class="text-[9px] text-[#2563EB] font-black tracking-wide uppercase block mt-2">Paid via Bank Transfer</span>
            </div>
          </div>
          <div class="lg:col-span-5 space-y-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Tahap Pengiriman:</span>
            <div class="grid grid-cols-4 gap-1.5">${steps}</div>
            <div class="text-xs mt-2 text-slate-600 font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 block"></span>
              Status Aktif: <strong class="text-[#0F3D5E]">${ord.statusText}</strong>
            </div>
            ${trackingInput}
            <div class="mt-3 flex gap-2">
              <button type="button" onclick="openB2cPrintModal('${ord.id}')" class="flex items-center gap-1.5 text-[10px] font-bold bg-[#0F3D5E] hover:bg-[#15527d] text-white px-3 py-1.5 rounded-lg shadow-sm transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Cetak Invoice &amp; Label
              </button>
            </div>
          </div>
          <div class="lg:col-span-3 space-y-2">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Riwayat Aktivitas Log (${ord.historyLogs.length}):</span>
            <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              ${ord.historyLogs.map(log => `
                <div class="p-2 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] leading-relaxed">
                  <span class="text-slate-400 font-medium block">${log.date}</span>
                  <strong class="text-slate-700 font-bold block">${log.title}</strong>
                  <span class="text-slate-500">${log.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── CATALOG RENDERER ──────────────────────────────────────────────
function renderCatalog() {
  const tbody = document.getElementById('catalog-table-body');
  if (!tbody) return;
  
  const query = (document.getElementById('search-catalog')?.value || '').toLowerCase();
  const category = document.getElementById('filter-catalog-category')?.value || 'all';
  
  const filtered = b2cProducts.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query) || p.id.toString().includes(query);
    const matchesCategory = category === 'all' || p.category === category;
    return matchesQuery && matchesCategory;
  });

  tbody.innerHTML = filtered.map(p => `
    <tr class="hover:bg-slate-50/40">
      <td class="p-4 font-mono text-slate-400">#${p.id}</td>
      <td class="p-4 font-bold text-slate-700">${p.name}</td>
      <td class="p-4">
        <span class="px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase ${p.category === 'Residential' ? 'bg-blue-50 text-blue-600 border border-blue-100' : p.category === 'Commercial' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}">${p.category}</span>
      </td>
      <td class="p-4 font-manrope font-semibold text-slate-600">${p.price}</td>
      <td class="p-4">
        <span class="inline-flex items-center gap-1 text-[10px] font-bold ${p.availability.includes('Ready') ? 'text-emerald-600' : 'text-amber-600'}">
          <span class="w-1.5 h-1.5 rounded-full ${p.availability.includes('Ready') ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
          ${p.availability}
        </span>
      </td>
      <td class="p-4 text-center">
        <div class="flex gap-2 justify-center">
          <button aria-label="Edit Produk" onclick="openProductModal(${p.id})" class="p-1.5 text-slate-500 hover:text-[#0F3D5E] hover:bg-slate-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button aria-label="Hapus Produk" onclick="deleteProduct(${p.id})" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── BANNERS RENDERER ──────────────────────────────────────────────
function renderBanners() {
  const container = document.getElementById('banners-container');
  if (!container) return;
  
  const query = (document.getElementById('search-banners')?.value || '').toLowerCase();
  const status = document.getElementById('filter-banner-status')?.value || 'all';
  
  const filtered = b2cBanners.filter(b => {
    const matchesQuery = b.title.toLowerCase().includes(query) || b.desc.toLowerCase().includes(query);
    const matchesStatus = status === 'all' || (status === 'active' && b.active) || (status === 'inactive' && !b.active);
    return matchesQuery && matchesStatus;
  });

  container.innerHTML = filtered.map(banner => `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        <div class="h-44 w-full bg-slate-100 relative">
          <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'">
          <div class="absolute top-3 right-3">
            <button onclick="toggleBannerActive(${banner.id})" class="px-2.5 py-1 text-[9px] font-black font-space rounded-lg shadow-md transition-all ${banner.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}">${banner.active ? 'AKTIF (Tampil)' : 'NON-AKTIF'}</button>
          </div>
        </div>
        <div class="p-5 space-y-2">
          <h4 class="font-extrabold text-sm text-[#0F3D5E]">${banner.title}</h4>
          <p class="text-xs text-slate-500 leading-relaxed">${banner.desc}</p>
          ${(banner.originalPrice || banner.promoPrice) ? `
            <div class="flex items-baseline gap-2.5 pt-1.5 pb-1.5 px-3.5 bg-slate-50 rounded-xl border border-slate-100 w-fit">
              ${banner.promoPrice ? `
                <span class="text-red-600 font-black text-base">Rp ${Number(banner.promoPrice).toLocaleString('id-ID')}</span>
                ${banner.originalPrice ? `<span class="text-slate-400 line-through text-xs font-semibold">Rp ${Number(banner.originalPrice).toLocaleString('id-ID')}</span>` : ''}
                <span class="bg-rose-100 text-rose-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg">Promo</span>
              ` : `<span class="text-[#0F3D5E] font-black text-base">Rp ${Number(banner.originalPrice).toLocaleString('id-ID')}</span>`}
            </div>
          ` : ''}
          ${banner.link ? `<div class="text-[10px] text-slate-400 font-semibold">Link Redirect: <span class="text-[#3B82F6] font-mono">${banner.link}</span></div>` : ''}
        </div>
      </div>
      <div class="px-5 py-3.5 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center">
        <span class="text-[10px] text-slate-400 font-mono">ID: #${banner.id}</span>
        <div class="flex gap-2">
          <button onclick="openBannerModal(${banner.id})" class="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:text-[#0F3D5E] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Konten
          </button>
          <button onclick="deleteBanner(${banner.id})" class="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── EMERGENCY ALARM RENDERER ──────────────────────────────────────
function renderEmergencyAlarm() {
  const banner = document.getElementById('emergency-alert-banner');
  if (!banner) return;
  if (isEmergencyActive && emergencyAlert) {
    banner.innerHTML = `
      <div class="bg-rose-700 text-white p-6 rounded-2xl border border-rose-600 shadow-xl space-y-4 animate-pulse text-left">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">STATUS: KRISIS DARURAT AKTIF</span>
            <h3 class="font-extrabold text-base">${emergencyAlert.issue}</h3>
            <p class="text-xs text-rose-100 font-semibold">Klien: ${emergencyAlert.client} | Lokasi: ${emergencyAlert.location}</p>
            <span class="text-[10px] text-rose-200 block mt-2">Waktu Trigger: ${emergencyAlert.time} | Sumber: ${emergencyAlert.triggerSource}</span>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" onclick="deactivateEmergency()" class="px-5 py-2.5 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all">Matikan Alarm Darurat</button>
          <button type="button" onclick="switchEmergencySubTab('do'); openModal('modal-add-do');" class="px-5 py-2.5 bg-[#0F3D5E] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#1a5276] transition-all">Buat DO Darurat</button>
        </div>
      </div>
    `;
  } else {
    banner.innerHTML = `
      <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto">
        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <h3 class="font-extrabold text-sm text-[#0C3254]">Sistem Deteksi Sinyal Darurat</h3>
          <p class="text-[11px] text-slate-400 mt-1 font-semibold">Sistem pemantauan siaga. Menunggu sinyal panggilan darurat dari unit kustomer.</p>
        </div>
        <button type="button" onclick="triggerEmergency()" class="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all">Uji Sinyal Panggilan Darurat</button>
      </div>
    `;
  }
}

// ─── EMERGENCY DOs RENDERER ────────────────────────────────────────
function renderEmergencyDos() {
  const container = document.getElementById('emergency-dos-container');
  if (!container) return;
  container.innerHTML = emergencyDos.map(edo => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div class="flex justify-between items-start border-b border-slate-100 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <strong class="text-xs text-slate-800 font-extrabold">${edo.clientName}</strong>
            <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-mono rounded">${edo.id}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-bold block mt-0.5">Tanggal DO: ${edo.date} | Jenis Krisis: <span class="text-rose-600 font-bold">${edo.emergencyType}</span></span>
        </div>
        <div class="text-right">
          <span class="text-[9px] text-slate-400 block font-bold">Total Biaya Darurat</span>
          <strong class="text-xs font-bold text-[#0C3254]">Rp ${edo.totalCost.toLocaleString('id-ID')}</strong>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-semibold text-slate-500">
        <div><span class="text-slate-400 block">Tindakan Lapangan:</span><span class="text-slate-700">${edo.actionTaken}</span></div>
        <div><span class="text-slate-400 block">Suku Cadang Dikirim:</span><span class="text-slate-700">${edo.partsDispatched || '-'}</span></div>
      </div>
      <div class="pt-2 flex gap-2">
        <button type="button" onclick="openPrintDo('${edo.id}')" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F3D5E] text-[10px] font-bold rounded-lg transition-all">Cetak Berita Acara &amp; DO</button>
      </div>
    </div>
  `).join('');
}

// ─── ACTION HANDLERS ───────────────────────────────────────────────
function resetViews() {
  activeTab = 'overview';
  switchTab('overview');
}

function resetSimulatedData() {
  if (confirm('Apakah Anda yakin ingin mereset seluruh data simulasi? Semua gambar, produk kustom, dan log yang tersimpan di browser akan dikosongkan.')) {
    localStorage.clear();
    location.reload();
  }
}

function toggleInvoiceFilter() {
  invoiceFilterUnpaid = !invoiceFilterUnpaid;
  const btn = document.getElementById('invoice-filter-btn');
  if (btn) {
    if (invoiceFilterUnpaid) {
      btn.classList.add('bg-red-50','border-red-200','text-red-600');
      btn.classList.remove('bg-white','border-slate-200','text-slate-600');
      btn.textContent = 'Tampilkan Semua';
    } else {
      btn.classList.remove('bg-red-50','border-red-200','text-red-600');
      btn.classList.add('bg-white','border-slate-200','text-slate-600');
      btn.textContent = 'Tampilkan Belum Bayar';
    }
  }
  renderInvoices();
}

function updateInvoiceStatus(id, newStatus) {
  invoices = invoices.map(i => i.id === id ? {...i, status: newStatus, daysOverdue: newStatus === 'Paid' ? 0 : i.daysOverdue} : i);
  renderInvoices();
}

function simulateWebhook(invId) {
  const bar = document.getElementById('webhook-simulation-bar');
  const textEl = document.getElementById('webhook-sim-text');
  const invEl = document.getElementById('webhook-sim-invoice');
  if (bar) { bar.classList.remove('hidden'); invEl.textContent = 'Invoice: ' + invId; }
  const steps = [
    { delay: 0, text: '🕒 1. Kustomer menyelesaikan pembayaran di halaman checkout (Midtrans / Xendit)...' },
    { delay: 1500, text: '🔌 2. Payment Gateway mengirimkan Webhook POST (Notification) ke Backend API Anda...' },
    { delay: 3000, text: '💾 3. Backend Anda memverifikasi signature hash, lalu memperbarui status invoice menjadi "Paid" di Database...' },
    { delay: 4500, text: '✅ 4. Backend memancarkan event WebSocket. Dashboard mendeteksi pembayaran lunas & ter-update otomatis!' }
  ];
  steps.forEach(s => setTimeout(() => { if (textEl) textEl.textContent = s.text; }, s.delay));
  setTimeout(() => {
    invoices = invoices.map(i => i.id === invId ? {...i, status: 'Paid', daysOverdue: 0} : i);
    renderInvoices();
    if (bar) bar.classList.add('hidden');
  }, 6000);
}

function updateOrderStep(ordId, step) {
  const ord = b2cOrders.find(o => o.id === ordId);
  const isPickup = ord?.deliveryMethod === 'Ambil Sendiri';
  const stepsTextMap = {1:'Order Dipesan & Menunggu Pembayaran',2:'Pembayaran Diverifikasi & Persiapan',3:isPickup?'Barang Siap Diambil di Gudang':'Unit dalam Pengiriman Logistik',4:isPickup?'Barang Telah Diambil (Selesai)':'Pekerjaan / Pemasangan Selesai'};
  const now = new Date();
  const timeStr = `${now.getDate()} Juni 2026 ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  b2cOrders = b2cOrders.map(o => {
    if (o.id === ordId) {
      const newLog = {title: stepsTextMap[step], desc: `Tahap pengerjaan diperbarui oleh admin ke langkah ${step}.`, date: timeStr};
      return {...o, statusStep: step, statusText: stepsTextMap[step], historyLogs: [newLog, ...(o.historyLogs||[])]};
    }
    return o;
  });
  renderB2cOrders();
}

function changeDeliveryMethod(ordId, newMethod) {
  b2cOrders = b2cOrders.map(o => {
    if (o.id === ordId) {
      const timeStr = new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      const newLog = {title:'Metode Pengiriman Diubah', desc: newMethod === 'Ambil Sendiri' ? 'Kustomer akan mengambil unit sendiri ke kantor PT. ASA.' : 'Pengiriman diubah via Kurir Kantor.', date: timeStr};
      return {...o, deliveryMethod: newMethod, historyLogs: [newLog, ...(o.historyLogs||[])]};
    }
    return o;
  });
  renderB2cOrders();
}

function saveTracking(ordId) {
  const input = document.getElementById('tracking-' + ordId);
  if (!input || !input.value) return;
  const val = input.value;
  const timeStr = new Date().toLocaleString('id-ID');
  b2cOrders = b2cOrders.map(o => {
    if (o.id === ordId) {
      const newLog = {title: 'Driver Kantor Dispatched', desc: `Unit sedang dikirim oleh driver internal Kantor. Info Driver: ${val}`, date: timeStr};
      return {...o, statusStep: 3, statusText: `Dalam Pengiriman oleh Driver Kantor (${val})`, historyLogs: [newLog, ...(o.historyLogs||[])]};
    }
    return o;
  });
  renderB2cOrders();
  showToast('Informasi pengiriman driver kantor berhasil disimpan!', 'success');
}

function handleAddAsset(e) {
  e.preventDefault();
  const clientSel = document.getElementById('asset-client');
  const clientId = clientSel.value;
  const name = document.getElementById('asset-name').value;
  const spec = document.getElementById('asset-spec').value;
  const location = document.getElementById('asset-location').value;
  const status = document.getElementById('asset-status').value;
  const asset = { id: 'ASA-EQ-' + Math.floor(100 + Math.random()*900), name, spec, location: location || 'Gedung Klien', lastServiced: '-', status };
  contractsData = contractsData.map(c => c.id === clientId ? {...c, assets: [...c.assets, asset], assetsCount: c.assetsCount + 1} : c);
  closeModal('modal-add-asset');
  renderContracts();
  e.target.reset();
}

function handleAddTicket(e) {
  e.preventDefault();
  const clientEl = document.getElementById('ticket-client');
  const typeEl = document.getElementById('ticket-type');
  const unitEl = document.getElementById('ticket-unit');
  
  let hasError = false;
  document.getElementById('error-ticket-type')?.classList.add('hidden');
  document.getElementById('error-ticket-unit')?.classList.add('hidden');
  
  if (!typeEl.value.trim()) {
    document.getElementById('error-ticket-type')?.classList.remove('hidden');
    hasError = true;
  }
  if (!unitEl.value.trim()) {
    document.getElementById('error-ticket-unit')?.classList.remove('hidden');
    hasError = true;
  }
  if (hasError) return;
  
  const submitBtn = document.getElementById('btn-submit-ticket');
  const spinner = document.getElementById('spinner-submit-ticket');
  const btnText = document.getElementById('text-submit-ticket');
  
  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (btnText) btnText.textContent = 'Memproses...';
  
  setTimeout(() => {
    const clientId = clientEl.value;
    const type = typeEl.value;
    const unit = unitEl.value;
    const priority = document.getElementById('ticket-priority').value;
    const status = document.getElementById('ticket-status-val').value;
    const ticket = { id: 'TKT-' + Math.floor(100+Math.random()*900), type, unit,
      // TODO(API): ganti dengan timestamp dari server response POST /api/b2b/tickets
      date: formatTanggalID(new Date()),
      status, priority, tech: '-' };
    contractsData = contractsData.map(c => c.id === clientId ? {...c, tickets: [ticket, ...c.tickets]} : c);
    saveContractsData(); // Task 1: sync ke localStorage agar CustomerDashboard.jsx ikut update
    
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = 'Buat Tiket';
    
    closeModal('modal-add-ticket');
    renderContracts();
    renderOverview();
    showToast('Tiket layanan B2B berhasil dibuat!', 'success');
    e.target.reset();
  }, 1500);
}

function openTicketAddForClient(clientId) {
  const sel = document.getElementById('ticket-client');
  if (sel) sel.value = clientId;
  openModal('modal-add-ticket');
}

function populateClientSelects() {
  const selectors = ['asset-client', 'ticket-client', 'dispatch-client', 'do-client'];
  selectors.forEach(selId => {
    const sel = document.getElementById(selId);
    if (sel) {
      sel.innerHTML = contractsData.map(c => `<option value="${c.id}">${c.clientName} (${c.id})</option>`).join('');
    }
  });
}

function openDispatchModal(dateStr) {
  dispatchDate = dateStr;
  document.getElementById('dispatch-date-label').textContent = dateStr;
  populateClientSelects();
  openModal('modal-dispatch');
}

function handleCreateDispatch(e) {
  e.preventDefault();
  const clientEl = document.getElementById('dispatch-client');
  const typeEl = document.getElementById('dispatch-type');
  const unitEl = document.getElementById('dispatch-unit');
  const statusEl = document.getElementById('dispatch-status');
  const priorityEl = document.getElementById('dispatch-priority');
  
  let hasError = false;
  document.getElementById('error-dispatch-unit')?.classList.add('hidden');
  
  if (!unitEl.value.trim()) {
    document.getElementById('error-dispatch-unit')?.classList.remove('hidden');
    hasError = true;
  }
  if (hasError) return;
  
  const submitBtn = document.getElementById('btn-submit-dispatch');
  const spinner = document.getElementById('spinner-submit-dispatch');
  const btnText = document.getElementById('text-submit-dispatch');
  
  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (btnText) btnText.textContent = 'Memproses...';
  
  setTimeout(() => {
    const clientId = clientEl.value;
    const type = typeEl.value;
    const unit = unitEl.value;
    const status = statusEl.value;
    const priority = priorityEl.value;
    
    // Get checked techs from checkboxes
    const selectedTechs = Array.from(document.querySelectorAll('.dispatch-tech-checkbox:checked')).map(cb => cb.value);
    const tech = selectedTechs.length > 0 ? selectedTechs.join(', ') : '-';
    
    const client = contractsData.find(c => c.id === clientId);
    calendarEvents.push({ id: 'EV-' + Math.floor(100+Math.random()*900), date: dispatchDate, client: client ? client.clientName : 'Klien B2B', type, unit, tech, status, priority });
    saveCalendarEvents(); // Task 1: sync ke localStorage
    
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = 'Dispatch Jadwal';
    
    closeModal('modal-dispatch');
    renderCalendar();
    renderOverview();
    showToast('Jadwal dispatch teknisi berhasil diterbitkan!', 'success');
    e.target.reset();
    document.querySelectorAll('.dispatch-tech-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('search-dispatch-tech').value = '';
    updateTechsChecklist('dispatch-tech-container', 'search-dispatch-tech', 'selected-dispatch-techs-list', 'selected-dispatch-techs-card');
  }, 1500);
}


function openEditDispatchModal(evId) {
  const ev = calendarEvents.find(e => e.id === evId);
  if (!ev) return;
  document.getElementById('edit-dispatch-id').value = ev.id;
  document.getElementById('edit-dispatch-client').value = ev.client;
  document.getElementById('edit-dispatch-date').value = ev.date;
  document.getElementById('edit-dispatch-type').value = ev.type;
  document.getElementById('edit-dispatch-unit').value = ev.unit;
  document.getElementById('edit-dispatch-status').value = ev.status || 'Scheduled';
  document.getElementById('edit-dispatch-priority').value = ev.priority || 'Medium';
  
  // Set checked state of checkboxes based on ev.tech
  document.querySelectorAll('.edit-dispatch-tech-checkbox').forEach(cb => cb.checked = false);
  if (ev.tech && ev.tech !== '-') {
    const assignedTechs = ev.tech.split(',').map(t => t.trim());
    document.querySelectorAll('.edit-dispatch-tech-checkbox').forEach(cb => {
      if (assignedTechs.includes(cb.value)) {
        cb.checked = true;
      }
    });
  }
  
  // Reset search and refresh checklist
  document.getElementById('search-edit-dispatch-tech').value = '';
  updateTechsChecklist('edit-dispatch-tech-container', 'search-edit-dispatch-tech', 'edit-selected-dispatch-techs-list', 'edit-selected-dispatch-techs-card');
  
  document.getElementById('edit-dispatch-delete-btn').onclick = () => deleteDispatch(evId);
  openModal('modal-edit-dispatch');
}

function handleUpdateDispatch(e) {
  e.preventDefault();
  const id = document.getElementById('edit-dispatch-id').value;
  const date = document.getElementById('edit-dispatch-date').value;
  const type = document.getElementById('edit-dispatch-type').value;
  const unit = document.getElementById('edit-dispatch-unit').value;
  const status = document.getElementById('edit-dispatch-status').value;
  const priority = document.getElementById('edit-dispatch-priority').value;
  
  // Get checked techs from checkboxes
  const selectedTechs = Array.from(document.querySelectorAll('.edit-dispatch-tech-checkbox:checked')).map(cb => cb.value);
  const tech = selectedTechs.length > 0 ? selectedTechs.join(', ') : '-';
  
  calendarEvents = calendarEvents.map(ev => ev.id === id ? {...ev, date, type, unit, tech, status, priority} : ev);
  saveCalendarEvents(); // Task 1: sync ke localStorage
  closeModal('modal-edit-dispatch');
  renderCalendar();
  showToast('Jadwal tugas teknisi berhasil diperbarui!', 'success');
}

// Helper to filter technicians checklist
function updateTechsChecklist(containerId, searchInpId, selectedListId, selectedCardId) {
  const container = document.getElementById(containerId);
  const searchInp = document.getElementById(searchInpId);
  const list = document.getElementById(selectedListId);
  const card = document.getElementById(selectedCardId);
  if (!container || !list || !card) return;
  
  const q = searchInp ? searchInp.value.toLowerCase().trim() : '';
  const labels = Array.from(container.querySelectorAll('label'));
  const selectedTechs = [];
  
  labels.forEach(label => {
    const cb = label.querySelector('input[type="checkbox"]');
    if (!cb) return;
    const val = cb.value;
    const text = label.querySelector('span').textContent.toLowerCase();
    
    // Search filter
    if (q === '') {
      label.style.display = 'flex';
    } else {
      label.style.display = text.includes(q) ? 'flex' : 'none';
    }
    
    if (cb.checked) {
      selectedTechs.push(val);
    }
  });
  
  if (selectedTechs.length > 0) {
    card.classList.remove('hidden');
    card.classList.add('flex');
    list.innerHTML = selectedTechs.map(tech => `
      <span class="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
        <span>${tech}</span>
        <button type="button" onclick="uncheckTech('${containerId}', '${tech}', '${searchInpId}', '${selectedListId}', '${selectedCardId}')" class="text-red-500 hover:text-red-700 text-xs font-black shrink-0">&times;</button>
      </span>
    `).join('');
  } else {
    card.classList.remove('flex');
    card.classList.add('hidden');
    list.innerHTML = '';
  }
}

window.uncheckTech = function(containerId, value, searchInpId, selectedListId, cardId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cb = container.querySelector(`input[value="${value}"]`);
  if (cb) {
    cb.checked = false;
    updateTechsChecklist(containerId, searchInpId, selectedListId, cardId);
  }
}

function deleteDispatch(id) {
  if (confirm('Apakah Anda yakin ingin menghapus jadwal tugas ini?')) {
    calendarEvents = calendarEvents.filter(ev => ev.id !== id);
    saveCalendarEvents(); // Task 1: sync ke localStorage
    closeModal('modal-edit-dispatch');
    renderCalendar();
  }
}

function openReportReview(repId) {
  const rep = dailyReports.find(r => r.id === repId);
  if (!rep) return;
  document.getElementById('review-report-id').textContent = rep.id;
  document.getElementById('review-report-content').innerHTML = `
    <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div><span class="text-slate-400 block text-[9px] uppercase">Nama Klien</span><strong class="text-[#0F3D5E] text-xs font-bold">${rep.client}</strong></div>
      <div><span class="text-slate-400 block text-[9px] uppercase">Teknisi Penanggungjawab</span><strong class="text-slate-700 text-xs font-bold">${rep.tech}</strong></div>
      <div><span class="text-slate-400 block text-[9px] uppercase">Unit yang Dikerjakan</span><strong class="text-slate-700 text-xs font-bold">${rep.unit}</strong></div>
      <div><span class="text-slate-400 block text-[9px] uppercase">Tanggal Pelaksanaan</span><strong class="text-slate-700 text-xs font-bold">${rep.date}</strong></div>
    </div>
    <div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Checklist Uji Kelayakan Unit</span>
      <div class="space-y-1.5">
        ${rep.checklist.map(item => `<div class="flex items-center gap-2 text-slate-600 font-semibold text-xs"><span class="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center text-[8px] font-black">✓</span><span>${item.label}</span></div>`).join('')}
      </div>
    </div>
    <div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Suku Cadang / Bahan yang Digunakan</span>
      <p class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs">${rep.partsUsed || 'Tidak Ada Suku Cadang Terpakai'}</p>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Foto Bukti Lapangan</span>
        <img src="${rep.photo}" alt="Bukti Lapangan" class="w-full h-32 object-cover rounded-xl border border-slate-200">
      </div>
      <div>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tanda Tangan Penerima</span>
        <div class="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative">
          <span class="font-space font-black italic text-slate-400 text-sm border-b-2 border-slate-300 px-4 py-1">${rep.signature}</span>
          <span class="absolute bottom-2 right-2 text-[8px] text-slate-400">Verifikasi Digital</span>
        </div>
      </div>
    </div>
    <form onsubmit="handleReviseReport(event,'${rep.id}')" class="border-t border-slate-100 pt-4 space-y-2">
      <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Berikan Instruksi Revisi (Jika Ditolak)</label>
      <textarea id="revision-notes-${rep.id}" placeholder="Contoh: Lampiran foto kurang jelas. Tolong upload ulang." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-semibold text-xs" rows="2"></textarea>
      <div class="flex justify-end gap-2 pt-2">
        <button type="submit" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-all">Tolak &amp; Minta Revisi</button>
        <button type="button" onclick="approveReport('${rep.id}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-all">Setujui Laporan</button>
      </div>
    </form>
  `;
  openModal('modal-review-report');
}

function approveReport(repId) {
  dailyReports = dailyReports.map(r => r.id === repId ? {...r, status: 'Approved'} : r);
  closeModal('modal-review-report');
  renderDailyReports();
  showToast('Laporan Harian Teknisi Berhasil Disetujui!', 'success');
}

function handleReviseReport(e, repId) {
  e.preventDefault();
  const notes = document.getElementById('revision-notes-' + repId)?.value;
  if (!notes) return;
  dailyReports = dailyReports.map(r => r.id === repId ? {...r, status: 'Revised', notes: 'REVISI ADMIN: ' + notes} : r);
  closeModal('modal-review-report');
  renderDailyReports();
  showToast('Permintaan Revisi Telah Dikirim ke Teknisi.', 'success');
}

function triggerEmergency() {
  isEmergencyActive = true;
  emergencyAlert = {
    time: new Date().toLocaleTimeString(),
    client: 'PT Mitra Sukses Abadi',
    location: 'Main Utility Building - Lantai B1',
    issue: '🚨 HIGH PRESSURE ALERT: Chiller York mengalami lonjakan tekanan freon kritis!',
    triggerSource: 'Chatbot Telegram (N8N Automation)'
  };
  playSiren();
  renderEmergencyAlarm();
}

function deactivateEmergency() {
  isEmergencyActive = false;
  emergencyAlert = null;
  stopSiren();
  localStorage.setItem('emergency_trigger', JSON.stringify({active: false}));
  renderEmergencyAlarm();
}

// ─── SIREN ─────────────────────────────────────────────────────────
function playSiren() {
  if (window._emergencySiren) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    let isHigh = false;
    const interval = setInterval(() => {
      if (!window._emergencySiren) { clearInterval(interval); return; }
      osc.frequency.setValueAtTime(isHigh ? 500 : 900, audioCtx.currentTime);
      isHigh = !isHigh;
    }, 500);
    osc.start();
    window._emergencySiren = {osc, audioCtx, interval};
  } catch(e) { console.warn('Web Audio API error:', e); }
}

function stopSiren() {
  if (window._emergencySiren) {
    try { clearInterval(window._emergencySiren.interval); window._emergencySiren.osc.stop(); window._emergencySiren.audioCtx.close(); } catch(e){}
    window._emergencySiren = null;
  }
}

// ─── EMERGENCY DO ──────────────────────────────────────────────────
function updateDoTotal() {
  const base = Number(document.getElementById('do-base-fee')?.value || 0);
  const parts = Number(document.getElementById('do-parts-cost')?.value || 0);
  const el = document.getElementById('do-total-display');
  if (el) el.textContent = 'Rp ' + (base + parts).toLocaleString('id-ID');
}

function handleSaveEmergencyDo(e) {
  e.preventDefault();
  const clientEl = document.getElementById('do-client');
  const typeEl = document.getElementById('do-type');
  const actionEl = document.getElementById('do-action');
  const partsEl = document.getElementById('do-parts');
  const baseFeeEl = document.getElementById('do-base-fee');
  const partsCostEl = document.getElementById('do-parts-cost');
  
  let hasError = false;
  document.getElementById('error-do-type')?.classList.add('hidden');
  document.getElementById('error-do-action')?.classList.add('hidden');
  document.getElementById('error-do-parts')?.classList.add('hidden');
  
  if (!typeEl.value.trim()) {
    document.getElementById('error-do-type')?.classList.remove('hidden');
    hasError = true;
  }
  if (!actionEl.value.trim()) {
    document.getElementById('error-do-action')?.classList.remove('hidden');
    hasError = true;
  }
  if (!partsEl.value.trim()) {
    document.getElementById('error-do-parts')?.classList.remove('hidden');
    hasError = true;
  }
  if (hasError) return;
  
  const submitBtn = document.getElementById('btn-submit-do');
  const spinner = document.getElementById('spinner-submit-do');
  const btnText = document.getElementById('text-submit-do');
  
  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (btnText) btnText.textContent = 'Memproses...';
  
  setTimeout(() => {
    const clientId = clientEl.value;
    const client = contractsData.find(c => c.id === clientId);
    const baseFee = Number(baseFeeEl.value || 0);
    const partsCost = Number(partsCostEl.value || 0);
    const edo = {
      id: 'EDO-2026-' + Math.floor(100+Math.random()*900),
      // TODO(API): ganti dengan format tanggal dari server response POST /api/b2b/emergency-dos
      date: getTodayISO(),
      clientName: client ? client.clientName : 'Klien B2B',
      emergencyType: typeEl.value,
      actionTaken: actionEl.value,
      partsDispatched: partsEl.value,
      baseFee, partsCost, totalCost: baseFee + partsCost, status: 'Dispatched'
    };
    emergencyDos.push(edo);
    
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = 'Terbitkan DO';
    
    closeModal('modal-add-do');
    renderEmergencyDos();
    showToast(`Delivery Order Darurat ${edo.id} berhasil diterbitkan!`, 'success');
    e.target.reset();
  }, 1500);
}


function openPrintDo(doId) {
  const edo = emergencyDos.find(d => d.id === doId);
  if (!edo) return;
  document.getElementById('print-do-content').innerHTML = `
    <div class="space-y-6 text-slate-800 text-sm">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-lg font-black text-[#0F3D5E]">PT. ARTHA SOLUSI ADITAMA</h2>
          <p class="text-xs text-slate-500">Jl. Teknologi HVAC No. 1, Batam • +62 811-XXX-XXXX</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 block uppercase font-black">Delivery Order Darurat</span>
          <strong class="text-base font-black text-rose-700">${edo.id}</strong>
          <p class="text-xs text-slate-400 mt-0.5">Tanggal: ${edo.date}</p>
        </div>
      </div>
      <hr>
      <div class="grid grid-cols-2 gap-6">
        <div><span class="text-[10px] text-slate-400 uppercase block font-black">Klien</span><strong class="text-sm font-extrabold">${edo.clientName}</strong></div>
        <div><span class="text-[10px] text-slate-400 uppercase block font-black">Jenis Darurat</span><strong class="text-sm font-extrabold text-rose-700">${edo.emergencyType}</strong></div>
        <div class="col-span-2"><span class="text-[10px] text-slate-400 uppercase block font-black">Tindakan yang Diambil</span><p class="text-sm font-medium">${edo.actionTaken}</p></div>
        <div class="col-span-2"><span class="text-[10px] text-slate-400 uppercase block font-black">Suku Cadang Dikirim</span><p class="text-sm font-medium">${edo.partsDispatched || '-'}</p></div>
      </div>
      <hr>
      <div class="bg-slate-50 p-4 rounded-xl">
        <div class="flex justify-between items-center"><span class="text-xs font-semibold text-slate-500">Biaya Jasa Darurat</span><span class="text-sm font-bold">Rp ${edo.baseFee.toLocaleString('id-ID')}</span></div>
        <div class="flex justify-between items-center mt-1"><span class="text-xs font-semibold text-slate-500">Biaya Suku Cadang</span><span class="text-sm font-bold">Rp ${edo.partsCost.toLocaleString('id-ID')}</span></div>
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-200"><span class="font-black text-[#0F3D5E]">TOTAL BIAYA DO DARURAT</span><strong class="text-lg font-black text-[#0F3D5E]">Rp ${edo.totalCost.toLocaleString('id-ID')}</strong></div>
      </div>
      <div class="grid grid-cols-2 gap-8 pt-4">
        <div class="text-center"><div class="h-16 border-b-2 border-slate-400 mb-1"></div><span class="text-xs text-slate-400">Teknisi yang Bertugas</span></div>
        <div class="text-center"><div class="h-16 border-b-2 border-slate-400 mb-1"></div><span class="text-xs text-slate-400">Perwakilan Klien</span></div>
      </div>
    </div>
  `;
  openModal('print-do-modal');
}

// ─── B2C PRINT ─────────────────────────────────────────────────────
function openB2cPrintModal(ordId) {
  const ord = b2cOrders.find(o => o.id === ordId);
  if (!ord) return;
  document.getElementById('print-b2c-content').innerHTML = `
    <div class="space-y-6 text-slate-800 text-sm">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-lg font-black text-[#0F3D5E]">PT. ARTHA SOLUSI ADITAMA</h2>
          <p class="text-xs text-slate-500">Jl. Teknologi HVAC No. 1, Batam</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 block uppercase font-black">Invoice Penjualan B2C</span>
          <strong class="text-base font-black text-[#0F3D5E]">${ord.id}</strong>
          <p class="text-xs text-slate-400 mt-0.5">Tanggal: ${ord.date}</p>
        </div>
      </div>
      <hr>
      <div class="grid grid-cols-2 gap-4">
        <div><span class="text-[10px] text-slate-400 uppercase block font-black">Pembeli</span><strong>${ord.clientName}</strong><p class="text-xs text-slate-500">${ord.address}</p><p class="text-xs text-slate-500">${ord.phone}</p></div>
        <div><span class="text-[10px] text-slate-400 uppercase block font-black">Detail Pesanan</span><p class="text-xs"><strong>${ord.unitName}</strong></p><p class="text-xs text-slate-500">${ord.spec}</p><p class="text-xs font-bold text-[#2563EB] mt-1">Metode: ${ord.deliveryMethod}</p></div>
      </div>
      <table class="w-full text-xs border-collapse mt-4">
        <thead><tr class="bg-slate-50 text-left"><th class="p-2 border border-slate-200">Item</th><th class="p-2 border border-slate-200 text-center">Qty</th><th class="p-2 border border-slate-200 text-right">Harga/Unit</th><th class="p-2 border border-slate-200 text-right">Subtotal</th></tr></thead>
        <tbody><tr><td class="p-2 border border-slate-200">${ord.unitName}<br><span class="text-slate-400">${ord.spec}</span></td><td class="p-2 border border-slate-200 text-center">${ord.qty}</td><td class="p-2 border border-slate-200 text-right">Rp ${ord.price.toLocaleString('id-ID')}</td><td class="p-2 border border-slate-200 text-right font-bold">Rp ${(ord.price*ord.qty).toLocaleString('id-ID')}</td></tr></tbody>
        <tfoot><tr class="bg-[#0F3D5E] text-white"><td colspan="3" class="p-2 font-black">TOTAL</td><td class="p-2 text-right font-black">Rp ${(ord.price*ord.qty).toLocaleString('id-ID')}</td></tr></tfoot>
      </table>
      <div class="mt-4 border-2 border-dashed border-slate-300 p-4 rounded-xl">
        <span class="text-[10px] font-black text-slate-400 uppercase block mb-2">Label Pengiriman / Kurir</span>
        <div class="flex justify-between"><div><strong class="block text-xs">${ord.clientName}</strong><p class="text-xs text-slate-500">${ord.address}</p><p class="text-xs">${ord.phone}</p></div><div class="text-right"><span class="text-[9px] text-slate-400 block">No. Order</span><strong class="font-black font-mono">${ord.id}</strong><span class="block text-[9px] text-slate-400 mt-1">Metode: ${ord.deliveryMethod}</span></div></div>
      </div>
    </div>
  `;
  openModal('print-b2c-modal');
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────
function openProductModal(prodId) {
  productImages = [];
  document.getElementById('prod-image-previews').innerHTML = '';
  if (prodId === null) {
    document.getElementById('product-modal-title').textContent = 'Registrasi Produk B2C Baru';
    document.getElementById('prod-editing-id').value = '';
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-category').value = 'Residential';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-availability').value = 'Ready Stock';
    document.getElementById('prod-spec-details').value = '';
    document.getElementById('prod-features').value = '';
    document.getElementById('prod-inclusions').value = '';
  } else {
    const p = b2cProducts.find(x => x.id === prodId);
    if (!p) return;
    document.getElementById('product-modal-title').textContent = 'Ubah Informasi Produk B2C';
    document.getElementById('prod-editing-id').value = p.id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-availability').value = p.availability;
    document.getElementById('prod-spec-details').value = p.specDetails || '';
    document.getElementById('prod-features').value = p.features || '';
    document.getElementById('prod-inclusions').value = p.inclusions || '';
    productImages = p.images || (p.image ? [p.image] : []);
    renderProductImagePreviews();
  }
  openModal('modal-product');
}

function handleProductImageUpload(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    resizeAndCompress(file, (b64) => {
      productImages.push(b64);
      renderProductImagePreviews();
    });
  });
}

function renderProductImagePreviews() {
  const container = document.getElementById('prod-image-previews');
  if (!container) return;
  container.innerHTML = productImages.map((img, idx) => `
    <div class="relative w-14 h-14 border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center group">
      <img src="${img}" alt="Preview ${idx}" class="max-w-full max-h-full object-contain p-1">
      <button type="button" aria-label="Hapus Gambar" onclick="removeProductImage(${idx})" class="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black shadow-md hover:bg-red-600">&times;</button>
      ${idx === 0 ? `<span class="absolute bottom-0 left-0 right-0 bg-[#0F3D5E] text-white text-[7px] font-bold text-center py-0.5 uppercase">Utama</span>` : ''}
    </div>
  `).join('');
}

function removeProductImage(idx) {
  productImages.splice(idx, 1);
  renderProductImagePreviews();
}

function handleSaveProduct(e) {
  e.preventDefault();
  const editingId = document.getElementById('prod-editing-id').value;
  const prod = {
    name: document.getElementById('prod-name').value,
    category: document.getElementById('prod-category').value,
    price: document.getElementById('prod-price').value,
    availability: document.getElementById('prod-availability').value,
    specDetails: document.getElementById('prod-spec-details').value,
    features: document.getElementById('prod-features').value,
    inclusions: document.getElementById('prod-inclusions').value,
    image: productImages[0] || '',
    images: productImages
  };
  if (editingId) {
    b2cProducts = b2cProducts.map(p => String(p.id) === String(editingId) ? {...p, ...prod} : p);
  } else {
    const nextId = b2cProducts.length > 0 ? Math.max(...b2cProducts.map(p => Number(p.id)||0)) + 1 : 1;
    b2cProducts.push({id: nextId, ...prod});
  }
  try { localStorage.setItem('b2c_products', JSON.stringify(b2cProducts)); } catch(err) { console.warn('localStorage quota exceeded'); }
  closeModal('modal-product');
  renderCatalog();
}

function deleteProduct(id) {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
    b2cProducts = b2cProducts.filter(p => p.id !== id);
    localStorage.setItem('b2c_products', JSON.stringify(b2cProducts));
    renderCatalog();
  }
}

// ─── BANNER MODAL ──────────────────────────────────────────────────
function openBannerModal(bannerId) {
  bannerImageData = '';
  document.getElementById('banner-img-preview').classList.add('hidden');
  if (bannerId === null) {
    document.getElementById('banner-modal-title').textContent = 'Unggah Banner Promosi Baru';
    document.getElementById('banner-editing-id').value = '';
    document.getElementById('banner-title').value = '';
    document.getElementById('banner-desc').value = '';
    document.getElementById('banner-link').value = '';
    document.getElementById('banner-original-price').value = '';
    document.getElementById('banner-promo-price').value = '';
    document.getElementById('banner-active').checked = true;
  } else {
    const b = b2cBanners.find(x => x.id === bannerId);
    if (!b) return;
    document.getElementById('banner-modal-title').textContent = 'Ubah Materi Banner Promo';
    document.getElementById('banner-editing-id').value = b.id;
    document.getElementById('banner-title').value = b.title;
    document.getElementById('banner-desc').value = b.desc;
    document.getElementById('banner-link').value = b.link;
    document.getElementById('banner-original-price').value = b.originalPrice || '';
    document.getElementById('banner-promo-price').value = b.promoPrice || '';
    document.getElementById('banner-active').checked = b.active;
    bannerImageData = b.image;
    if (b.image) {
      document.getElementById('banner-img-preview').classList.remove('hidden');
      document.getElementById('banner-img-preview-img').src = b.image;
    }
  }
  openModal('modal-banner');
}

function handleBannerImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    resizeAndCompress(file, (b64) => {
      bannerImageData = b64;
      document.getElementById('banner-img-preview').classList.remove('hidden');
      document.getElementById('banner-img-preview-img').src = b64;
    });
  }
}

function handleSaveBanner(e) {
  e.preventDefault();
  const editingId = document.getElementById('banner-editing-id').value;
  const bannerData = {
    title: document.getElementById('banner-title').value,
    desc: document.getElementById('banner-desc').value,
    image: bannerImageData,
    link: document.getElementById('banner-link').value,
    originalPrice: document.getElementById('banner-original-price').value,
    promoPrice: document.getElementById('banner-promo-price').value,
    active: document.getElementById('banner-active').checked
  };
  if (editingId) {
    b2cBanners = b2cBanners.map(b => String(b.id) === String(editingId) ? {...b, ...bannerData} : b);
  } else {
    const nextId = b2cBanners.length > 0 ? Math.max(...b2cBanners.map(b => b.id)) + 1 : 1;
    b2cBanners.push({id: nextId, ...bannerData});
  }
  try { localStorage.setItem('marketing_banners', JSON.stringify(b2cBanners)); } catch(err) {}
  closeModal('modal-banner');
  renderBanners();
}

function toggleBannerActive(id) {
  b2cBanners = b2cBanners.map(b => b.id === id ? {...b, active: !b.active} : b);
  localStorage.setItem('marketing_banners', JSON.stringify(b2cBanners));
  renderBanners();
}

function deleteBanner(id) {
  if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
    b2cBanners = b2cBanners.filter(b => b.id !== id);
    localStorage.setItem('marketing_banners', JSON.stringify(b2cBanners));
    renderBanners();
  }
}

// ─── SERVICE HISTORY MODAL ─────────────────────────────────────────
function openHistoryModal(assetId, assetName) {
  const el = document.getElementById('history-modal-content');
  if (!el) return;
  const asset = contractsData.flatMap(c => c.assets || []).find(a => a.id === assetId);
  el.innerHTML = `
    <div class="space-y-3">
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span class="text-[10px] text-slate-400 block uppercase font-black mb-1">Unit Aset</span>
        <strong class="text-sm text-[#0F3D5E]">${assetName}</strong>
        <p class="text-[10px] text-slate-400 mt-0.5">${asset ? asset.spec + ' | ' + asset.location : ''}</p>
      </div>
      <div class="space-y-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Riwayat Servis Terdaftar</span>
        ${dailyReports.filter(r => r.unit.toLowerCase().includes(assetName.toLowerCase().split(' ')[0])).map(rep => `
          <div class="p-3 bg-white border border-slate-200 rounded-xl text-xs">
            <div class="flex justify-between items-center mb-1">
              <strong class="text-slate-700">${rep.taskType}</strong>
              <span class="px-2 py-0.5 text-[8px] font-black font-space rounded uppercase ${rep.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${rep.status}</span>
            </div>
            <p class="text-slate-500">Teknisi: ${rep.tech} | Tanggal: ${rep.date}</p>
            <p class="text-slate-600 mt-1">${rep.notes}</p>
          </div>
        `).join('') || '<p class="text-[11px] text-slate-400 italic">Belum ada histori servis terdaftar untuk aset ini.</p>'}
      </div>
      <div class="flex justify-end pt-2">
        <button type="button" aria-label="Tutup Modal" onclick="closeModal(\'modal-history\')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-lg transition-all">Tutup</button>
      </div>
    </div>
  `;
  openModal('modal-history');
}

// ─── IMAGE COMPRESSION ─────────────────────────────────────────────
function resizeAndCompress(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h *= MAX/w; w = MAX; } } else { if (h > MAX) { w *= MAX/h; h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ─── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateClientSelects();
  switchTab('<?= $initTab ?>');

  // Poll emergency triggers from localStorage
  setInterval(() => {
    const raw = localStorage.getItem('emergency_trigger');
    if (raw) {
      try {
        const trigger = JSON.parse(raw);
        if (trigger && trigger.active && !isEmergencyActive) {
          isEmergencyActive = true;
          emergencyAlert = {
            time: trigger.time || new Date().toLocaleTimeString(),
            client: trigger.client || 'PT Mitra Sukses Abadi',
            location: trigger.location || 'Main Compressor Room',
            issue: trigger.issue || '🚨 TOMBOL DARURAT TRIGGERED DARI CHATBOT!',
            triggerSource: 'Chatbot Kustomer B2B'
          };
          playSiren();
          if (activeB2cSubTab === 'emergency' && activeEmergencySubTab === 'alarm') renderEmergencyAlarm();
        } else if (trigger && !trigger.active && isEmergencyActive) {
          isEmergencyActive = false;
          emergencyAlert = null;
          stopSiren();
          if (activeB2cSubTab === 'emergency' && activeEmergencySubTab === 'alarm') renderEmergencyAlarm();
        }
      } catch(err) {}
    }
  }, 1500);
});
</script>


