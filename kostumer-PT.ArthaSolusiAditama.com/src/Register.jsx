import { useState, useRef, useEffect } from 'react'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2,
  Snowflake, Shield, Wrench, Globe, ArrowRight, Camera, Upload
} from 'lucide-react'
import logoImg from '../assets/LogoArtha.png'

// ─── Social SVG Icons ─────────────────────────────────────────────
const IconLinkedin  = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
const IconFacebook  = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
const IconInstagram = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
const IconTwitter   = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>

// ─── Steps Definition ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Profile Pribadi', desc: 'Foto, nama lengkap, username, & email' },
  { id: 2, label: 'Kontak & Alamat', desc: 'Nomor HP & alamat tinggal' },
  { id: 3, label: 'Sosial & Keamanan', desc: 'Tautan sosial media & password' }
]

// ─── Upload Preview Component ─────────────────────────────────────
function AvatarUpload({ preview, onUpload, shape = 'circle', label, subLabel }) {
  const ref = useRef()
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
      {/* Preview */}
      <div
        onClick={() => ref.current.click()}
        className={`relative shrink-0 cursor-pointer group overflow-hidden border-2 border-dashed border-slate-300 hover:border-[#0F3D5E] transition-all bg-white
          ${shape === 'circle' ? 'w-[72px] h-[72px] rounded-full' : 'w-[72px] h-[72px] rounded-2xl'}`}
      >
        {preview
          ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-[#0F3D5E] transition-colors">
              <Camera className="w-6 h-6" />
            </div>
        }
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit]">
          <Upload className="w-4 h-4 text-white" />
        </div>
        {/* @ badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#0F3D5E] rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-white text-[7px] font-black">@</span>
        </div>
      </div>
      <div>
        <p className="font-bold text-sm text-[#0F3D5E] font-manrope">{label}</p>
        <p className="text-slate-400 text-xs mt-0.5 font-manrope">{subLabel}</p>
        <button type="button" onClick={() => ref.current.click()}
          className="mt-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-650 hover:border-[#0F3D5E] hover:text-[#0F3D5E] transition-all font-space">
          Choose File
        </button>
      </div>
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ─── Section Label ────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-black font-space uppercase tracking-widest text-slate-400 mb-3 mt-1">
      {children}
    </p>
  )
}

// ─── Input Field Helper ───────────────────────────────────────────
function Field({ label, optional, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
        {label}
        {optional && <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, text: '' }
  let score = 0
  if (pw.length >= 8) score += 1
  if (/[a-zA-Z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1
  
  let text = 'Very Weak'
  if (score === 2) text = 'Weak'
  if (score === 3) text = 'Medium'
  if (score === 4) text = 'Strong ✓'
  return { score, text }
}

export default function AuthNonContractPage() {
  const isLoggedOut = new URLSearchParams(window.location.search).get('logout') === '1'
  const [mode, setMode]           = useState(() => {
    const path = window.location.pathname.replace(/\/$/, '').toLowerCase()
    return path.includes('/login') ? 'login' : 'register'
  })
  const [step, setStep]           = useState(1)
  const [showPassword, setShowPw] = useState(false)
  const [showConfirm, setShowCf]  = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]       = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)

  // ── Forgot Password States ──
  const [forgotStep, setForgotStep] = useState(0) // 0: Normal login, 1: Email input, 2: OTP input, 3: New password input, 4: Success
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotPw, setForgotPw] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(t => t - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address' })
      return
    }
    setErrors({})
    setOtpLoading(true)
    setTimeout(() => {
      setOtpLoading(false)
      setForgotStep(2)
      setResendTimer(30)
    }, 1000)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setErrors({ forgotOtp: 'Verification code must be 6 digits' })
      return
    }
    setErrors({})
    setOtpLoading(true)
    setTimeout(() => {
      setOtpLoading(false)
      setForgotStep(3)
    }, 1000)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    const err = {}
    if (forgotPw.length < 8) {
      err.forgotPw = 'At least 8 characters required'
    }
    if (forgotPw !== forgotConfirm) {
      err.forgotConfirm = 'Passwords do not match'
    }
    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }
    setErrors({})
    setResetLoading(true)
    setTimeout(() => {
      setResetLoading(false)
      setForgotStep(4)
    }, 1200)
  }

  const [form, setForm] = useState({
    profilePic: null,
    nik: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
    password: '',
    confirm: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGoogleLogin = () => {
    if (googleLoading) return
    setGoogleLoading(true)
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        email: 'customer.retail@gmail.com',
        firstName: 'Retail',
        lastName: 'Customer'
      }));
      setGoogleLoading(false);
      setMode('login');
      setSubmitted(true);
    }, 1000);
  };

  const validate1 = () => {
    const e = {}
    if (!form.nik.trim()) {
      e.nik = 'NIK is required'
    } else if (!/^\d{16}$/.test(form.nik.trim())) {
      e.nik = 'NIK must be exactly 16 digits'
    }
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim())  e.lastName  = 'Last name is required'
    if (!form.username.trim())  e.username  = 'Username is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return !Object.keys(e).length
  }

  const validate2 = () => {
    const e = {}
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const validate3 = () => {
    const e = {}
    const hasLetter = /[a-zA-Z]/.test(form.password)
    const hasNumber = /[0-9]/.test(form.password)
    const hasSymbol = /[^a-zA-Z0-9]/.test(form.password)

    if (form.password.length < 8) {
      e.password = 'At least 8 characters'
    } else if (!hasLetter || !hasNumber || !hasSymbol) {
      e.password = 'Must contain letters, numbers, and symbols'
    }
    
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    
    setErrors(e)
    return !Object.keys(e).length
  }

  const validateLogin = () => {
    const e = {}
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = 'Invalid email address'
    if (!form.password)                   e.password = 'Password is required'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'login') {
      if (validateLogin()) setSubmitted(true)
    } else {
      if (step === 1 && validate1()) { setStep(2); setErrors({}); return }
      if (step === 2 && validate2()) { setStep(3); setErrors({}); return }
      if (step === 3 && validate3()) setSubmitted(true)
    }
  }

  const inputCls = (f) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-manrope transition-all outline-none
     ${errors[f]
       ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
       : 'border-slate-200 bg-slate-50 focus:border-[#0F3D5E] focus:bg-white focus:ring-2 focus:ring-[#0F3D5E]/15'}`

  const socialCls = 'w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0F3D5E] focus:bg-white focus:ring-2 focus:ring-[#0F3D5E]/15 text-sm font-manrope transition-all outline-none'

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D5E] to-[#1a5276]">
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-4 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        {form.profilePic && (
          <img src={form.profilePic} alt="profile" className="w-16 h-16 rounded-full object-cover mx-auto -mt-2 mb-4 border-4 border-white shadow-md" />
        )}
        <h2 className="text-2xl font-black font-manrope text-[#0F3D5E] mb-2">
          {mode === 'login' ? 'Welcome Back!' : 'Registration Successful!'}
        </h2>
        <p className="text-slate-500 text-sm font-manrope mb-8">
          {mode === 'login'
            ? 'You have successfully signed in to the PT. ASA Customer Portal (Retail/Non-Contract).'
            : `Hi ${form.firstName}! Your retail account has been created. You can now access standard services.`}
        </p>
        <a href="/dashboard-noncontract"
          className="inline-block w-full py-3.5 bg-[#0F3D5E] hover:bg-[#082940] text-white font-bold font-manrope rounded-xl text-sm transition-all shadow-md">
          Open Dashboard →
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-stretch bg-slate-100 font-manrope">

      {/* LEFT — Branded Navy Panel */}
      <div className="hidden lg:flex lg:w-[38%] relative flex-col justify-between overflow-hidden select-none"
        style={{ 
          backgroundImage: 'linear-gradient(to bottom, rgba(13, 51, 81, 0.75) 0%, rgba(4, 15, 26, 0.9) 100%), url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

        {/* Glow layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Logo (Invisible to prevent layout shift) */}
        <div className="relative z-10 px-10 pt-24 invisible">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="PT. ASA" className="w-9 h-9 object-contain" />
            <div>
              <span className="block text-white font-black text-sm tracking-widest font-space uppercase">PT. Artha Solusi Aditama</span>
              <span className="block text-sky-400 text-[10px] font-bold tracking-wider font-space mt-0.5">Solution With Care</span>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 mx-6 my-auto px-8 py-8 rounded-3xl bg-[#071F33]/70 backdrop-blur-md border border-white/10 shadow-2xl text-left">
          <h1 className="text-white text-3xl font-black font-manrope leading-tight mb-6">
            {mode === 'login' ? 'Welcome\nBack.' : 'Register as\nRetail Client.'}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-10 max-w-xs">
            {mode === 'login'
              ? 'Sign in to access retail maintenance services, request support, and track your work orders.'
              : 'Register your details to request direct technical support for non-contract HVACR maintenance.'}
          </p>

          {/* Step list for register with dynamic timeline connector matching user specifications */}
          {mode === 'register' && (
            <div className="space-y-6 relative pl-1">
              {STEPS.map((s, idx) => {
                const isActive   = step === s.id
                const isComplete = step > s.id
                return (
                  <div key={s.id} className="flex items-start gap-4 relative text-left">
                    {/* Step Connector Line */}
                    {idx < STEPS.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 -translate-x-1/2 bg-white/10">
                        <div 
                          className="w-full bg-sky-400 transition-all duration-500 origin-top"
                          style={{
                            height: isComplete ? '100%' : '0%',
                          }}
                        />
                      </div>
                    )}

                    {/* Indicator Circle */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10
                        ${isComplete ? 'border-sky-400 bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                        : isActive   ? 'border-sky-300 bg-sky-500/10 text-sky-300'
                        : 'border-white/15 bg-white/5 text-white/30'}`}>
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : isActive ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        )}
                      </div>
                    </div>

                    {/* Step Label/Info */}
                    <div className={`transition-opacity duration-300 ${(!isActive && !isComplete) ? 'opacity-40' : 'opacity-100'}`}>
                      <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{s.label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom pills */}
        <div className="relative z-10 px-10 pb-10">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Shield, text: 'Direct Repair Request' },
              { icon: Wrench, text: 'No Contract Needed' },
              { icon: Snowflake, text: 'Transparent Pricing' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full">
                <Icon className="w-3 h-3 text-sky-400" />
                <span className="text-slate-300 text-[11px] font-medium font-space">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col items-center justify-center px-6 pt-24 pb-12">
          <div className="w-full max-w-xl">

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <img src={logoImg} alt="PT. ASA" className="w-8 h-8 object-contain" />
              <span className="font-black text-[#0F3D5E] font-space text-sm tracking-widest uppercase">PT. Artha Solusi Aditama</span>
            </div>

            {/* Header */}
            {forgotStep === 0 && (
              <div className="mb-6 text-left">
                <h2 className="text-2xl font-black font-manrope text-[#0F3D5E]">
                  {mode === 'login' ? 'Sign In' :
                   step === 1 ? 'Profile Pribadi' :
                   step === 2 ? 'Kontak & Alamat' : 'Sosial & Keamanan'}
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-manrope">
                  {mode === 'login' ? 'Enter your credentials to access the Customer Portal.' :
                   step === 1 ? 'Unggah foto profil dan lengkapi data identitas aktif Anda.' :
                   step === 2 ? 'Isi nomor telepon dan alamat untuk kebutuhan logistik teknisi.' :
                   'Tautkan sosial media Anda dan buat password yang aman.'}
                </p>
              </div>
            )}

            {/* Progress bar */}
            {mode === 'register' && forgotStep === 0 && (
              <div className="flex gap-1.5 mb-8">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= s.id ? 'bg-[#0F3D5E]' : 'bg-slate-100'}`} />
                ))}
              </div>
            )}

            {forgotStep === 0 ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">

                {/* ──────────────────────────────────────────
                    LOGIN MODE
                    ────────────────────────────────────────── */}
                {mode === 'login' && (
                  <>
                    {isLoggedOut && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4 animate-fade-in text-left">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Anda telah berhasil keluar (Logged out successfully).</span>
                      </div>
                    )}
                    <Field label="Email" error={errors.email}>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" id="login-email" placeholder="e.g. budi@gmail.com"
                          className={`${inputCls('email')} pl-10`}
                          value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </Field>
                    <Field label="Password" error={errors.password}>
                      <div className="flex justify-end -mt-4 mb-1">
                        <button 
                          type="button" 
                          onClick={() => { setForgotStep(1); setErrors({}); }}
                          className="text-[#0F3D5E] text-xs font-semibold hover:underline bg-transparent border-none p-0 outline-none cursor-pointer font-manrope"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type={showPassword ? 'text' : 'password'} id="login-pw"
                          placeholder="Enter your password"
                          className={`${inputCls('password')} pl-10 pr-11`}
                          value={form.password} onChange={e => set('password', e.target.value)} />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#0F3D5E] w-4 h-4 rounded" />
                      <span className="text-slate-500 text-sm">Remember me on this device</span>
                    </label>
                  </>
                )}

                {/* ──────────────────────────────────────────
                    REGISTER MODE: STEP 1
                    ────────────────────────────────────────── */}
                {mode === 'register' && step === 1 && (
                  <>
                    <AvatarUpload
                      preview={form.profilePic}
                      onUpload={v => set('profilePic', v)}
                      shape="circle"
                      label="Unggah Foto Profil"
                      subLabel="Format berkas yang diterima: PNG, SVG atau JPEG."
                    />

                    <SectionLabel>General Information</SectionLabel>
                    <div className="mb-4">
                      <Field label="NIK (Nomor Induk Kependudukan)" error={errors.nik}>
                        <input type="text" id="reg-nik" placeholder="e.g. 3273012345678901"
                          maxLength={16}
                          className={inputCls('nik')}
                          value={form.nik} onChange={e => set('nik', e.target.value.replace(/\D/g, ''))} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First Name" error={errors.firstName}>
                        <input type="text" id="reg-fn" placeholder="e.g. Budi"
                          className={inputCls('firstName')}
                          value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                      </Field>
                      <Field label="Last Name" error={errors.lastName}>
                        <input type="text" id="reg-ln" placeholder="e.g. Santoso"
                          className={inputCls('lastName')}
                          value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Username" error={errors.username}>
                        <input type="text" id="reg-username" placeholder="e.g. budisantoso"
                          className={inputCls('username')}
                          value={form.username} onChange={e => set('username', e.target.value)} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" id="reg-email" placeholder="e.g. budi@gmail.com"
                            className={`${inputCls('email')} pl-10`}
                            value={form.email} onChange={e => set('email', e.target.value)} />
                        </div>
                      </Field>
                    </div>
                  </>
                )}

                {/* ──────────────────────────────────────────
                    REGISTER MODE: STEP 2
                    ────────────────────────────────────────── */}
                {mode === 'register' && step === 2 && (
                  <>
                    <SectionLabel>Contact & Address</SectionLabel>
                    <div className="space-y-4">
                      <Field label="No HP / WhatsApp" error={errors.phone}>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" id="reg-phone" placeholder="e.g. +62 812-XXXX-XXXX"
                            className={`${inputCls('phone')} pl-10`}
                            value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                      </Field>
                      <Field label="Alamat" optional error={errors.address}>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" id="reg-address" placeholder="e.g. Jl. Sudirman No. 12, Batam"
                            className={`${inputCls('address')} pl-10`}
                            value={form.address} onChange={e => set('address', e.target.value)} />
                        </div>
                      </Field>
                    </div>
                  </>
                )}

                {/* ──────────────────────────────────────────
                    REGISTER MODE: STEP 3
                    ────────────────────────────────────────── */}
                {mode === 'register' && step === 3 && (
                  <>
                    <SectionLabel>Social Media Links</SectionLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                          LinkedIn <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <IconLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0077B5]" />
                          <input type="url" id="reg-li" placeholder="URL" className={socialCls}
                            value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                          Instagram <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <IconInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E1306C]" />
                          <input type="url" id="reg-ig" placeholder="URL" className={socialCls}
                            value={form.instagram} onChange={e => set('instagram', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                          Facebook <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <IconFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1877F2]" />
                          <input type="url" id="reg-fb" placeholder="URL" className={socialCls}
                            value={form.facebook} onChange={e => set('facebook', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider font-space mb-1.5">
                          Twitter / X <span className="normal-case text-slate-350 font-normal tracking-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <IconTwitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input type="url" id="reg-tw" placeholder="URL" className={socialCls}
                            value={form.twitter} onChange={e => set('twitter', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <SectionLabel>Security</SectionLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Password" error={errors.password}>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type={showPassword ? 'text' : 'password'} id="reg-pw"
                            placeholder="Min. 8 characters"
                            className={`${inputCls('password')} pl-10 pr-11`}
                            value={form.password} onChange={e => set('password', e.target.value)} />
                          <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {form.password && (() => {
                          const { score, text } = getPasswordStrength(form.password)
                          return (
                            <div className="mt-2 space-y-1">
                              <div className="flex gap-1">
                                {[1,2,3,4].map(i => (
                                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                                    score >= i
                                      ? i<=1?'bg-red-400':i===2?'bg-yellow-400':i===3?'bg-blue-400':'bg-emerald-500'
                                      : 'bg-slate-100'}`} />
                                ))}
                              </div>
                              <p className="text-xs text-slate-400 font-space">{text}</p>
                            </div>
                          )
                        })()}
                      </Field>
                      <Field label="Confirm Password" error={errors.confirm}>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type={showConfirm ? 'text' : 'password'} id="reg-cf"
                            placeholder="Confirm password"
                            className={`${inputCls('confirm')} pl-10 pr-11`}
                            value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                          <button type="button" onClick={() => setShowCf(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </Field>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                      <input type="checkbox" className="accent-[#0F3D5E] w-4 h-4 mt-0.5 shrink-0 rounded" required />
                      <span className="text-slate-500 text-sm leading-relaxed">
                        I agree to the <a href="/contact" className="text-[#0F3D5E] font-semibold hover:underline">Terms & Conditions</a> and{' '}
                        <a href="/contact" className="text-[#0F3D5E] font-semibold hover:underline">Privacy Policy</a> of PT. Artha Solusi Aditama.
                      </span>
                    </label>
                  </>
                )}

                {/* Action Buttons with persistent height container */}
                <div className="space-y-3 mt-4">
                  <button type="submit"
                    className="w-full py-4 bg-[#0F3D5E] hover:bg-[#082940] active:scale-[0.99] text-white font-bold font-manrope rounded-xl text-sm transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 flex items-center justify-center gap-2">
                    <span>{mode === 'login' ? 'Sign In' : step === 3 ? 'Create Account' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {mode === 'register' && (
                    <button type="button" onClick={() => { if (step > 1) { setStep(s => s - 1); setErrors({}) } }}
                      className={`w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all font-manrope ${step > 1 ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
                      ← Kembali ke Langkah Sebelumnya
                    </button>
                  )}
                </div>

                {mode === 'login' && (
                  <>
                    <div className="relative flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-slate-300 text-xs font-space font-bold">OR</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <button type="button" onClick={handleGoogleLogin} disabled={googleLoading}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 transition-all text-sm font-bold text-slate-700 font-manrope shadow-sm active:scale-[0.98] disabled:opacity-50">
                      {googleLoading ? (
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                      ) : (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      )}
                      {googleLoading ? 'Connecting...' : 'Sign in with Google'}
                    </button>
                  </>
                )}

                {/* Mode toggle */}
                <p className="text-center text-sm text-slate-400 font-manrope pb-2">
                  {mode === 'login'
                    ? <>Don't have an account?{' '}<button type="button" onClick={() => { setMode('register'); setStep(1); setErrors({}) }} className="text-[#0F3D5E] font-black hover:underline">Register Now</button></>
                    : <>Already have an account?{' '}<button type="button" onClick={() => { setMode('login'); setErrors({}) }} className="text-[#0F3D5E] font-black hover:underline">Sign In</button></>
                  }
                </p>
              </form>
            ) : forgotStep === 1 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black font-manrope text-[#0F3D5E]">Forgot Password</h2>
                  <p className="text-slate-400 text-sm mt-1 font-manrope">Enter your registered email address to receive a 6-digit OTP code.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6 text-left">
                  <Field label="Email Address" error={errors.forgotEmail}>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="e.g. budi@gmail.com"
                        className={`${inputCls('forgotEmail')} pl-10`}
                        value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                    </div>
                  </Field>

                  <button type="submit" disabled={otpLoading}
                    className="w-full py-4 bg-[#0F3D5E] hover:bg-[#082940] active:scale-[0.99] text-white font-bold font-manrope rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                    {otpLoading ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>

                  <button type="button" onClick={() => setForgotStep(0)}
                    className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all font-manrope">
                    ← Back to Sign In
                  </button>
                </form>
              </>
            ) : forgotStep === 2 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black font-manrope text-[#0F3D5E]">Verify OTP</h2>
                  <p className="text-slate-400 text-sm mt-1 font-manrope">We've sent a 6-digit verification code to <span className="font-bold text-slate-700">{forgotEmail}</span>.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
                  <Field label="OTP Verification Code" error={errors.forgotOtp}>
                    <input type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3.5 rounded-xl border text-center text-lg font-space font-bold tracking-[0.2em] transition-all bg-slate-50 focus:bg-white focus:border-[#0F3D5E] outline-none"
                      value={forgotOtp} onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ''))} />
                  </Field>

                  <button type="submit" disabled={otpLoading || forgotOtp.length !== 6}
                    className="w-full py-4 bg-[#0F3D5E] hover:bg-[#082940] active:scale-[0.99] text-white font-bold font-manrope rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                    {otpLoading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <span className="text-slate-400 text-sm font-manrope">Resend code in {resendTimer}s</span>
                    ) : (
                      <button type="button" onClick={(e) => { setResendTimer(30); handleSendOtp(e); }}
                        className="text-[#0F3D5E] text-sm font-bold hover:underline">
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button type="button" onClick={() => setForgotStep(1)}
                    className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all font-manrope">
                    ← Back to Email Input
                  </button>
                </form>
              </>
            ) : forgotStep === 3 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black font-manrope text-[#0F3D5E]">Create New Password</h2>
                  <p className="text-slate-400 text-sm mt-1 font-manrope">Please set a secure, strong password for your account.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6 text-left">
                  <Field label="New Password" error={errors.forgotPw}>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} placeholder="New Password"
                        className={`${inputCls('forgotPw')} pl-10 pr-11`}
                        value={forgotPw} onChange={e => setForgotPw(e.target.value)} />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Confirm New Password" error={errors.forgotConfirm}>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm New Password"
                        className={`${inputCls('forgotConfirm')} pl-10 pr-11`}
                        value={forgotConfirm} onChange={e => setForgotConfirm(e.target.value)} />
                      <button type="button" onClick={() => setShowCf(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>

                  <button type="submit" disabled={resetLoading}
                    className="w-full py-4 bg-[#0F3D5E] hover:bg-[#082940] active:scale-[0.99] text-white font-bold font-manrope rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                    {resetLoading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black font-manrope text-[#0F3D5E]">Password Updated!</h2>
                  <p className="text-slate-500 text-sm font-manrope max-w-sm mx-auto">
                    Your password has been successfully updated. You can now log in using your new password.
                  </p>
                  <button type="button" onClick={() => {
                    setForgotStep(0);
                    setForgotEmail('');
                    setForgotOtp('');
                    setForgotPw('');
                    setForgotConfirm('');
                  }}
                    className="w-full py-4 bg-[#0F3D5E] hover:bg-[#082940] text-white font-bold font-manrope rounded-xl text-sm shadow-lg transition-all mt-6">
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
