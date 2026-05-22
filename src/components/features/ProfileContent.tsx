/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  BadgeCheck, EyeOff, Eye, ShieldCheck, Lock, Fingerprint, History, Settings, 
  Languages, Bell, Users, LogOut, Trash2, Scan, IdCard, Plane, Shield, 
  Key, Smartphone, Camera, Check, X, ChevronRight, UserCheck, AlertTriangle, 
  RefreshCw, Award, Landmark, CheckCircle2, CircleDot
} from 'lucide-react';
import { USER_PROFILE_PHOTO } from '../../constants/data';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileContentProps {
  showSensitiveData: boolean;
  setShowSensitiveData: (show: boolean) => void;
  bi: string;
  phone: string;
  nif: string;
  passport: string;
  verificationStatus: string;
  hasFacialAuth: boolean;
  hasTwoFactor: boolean;
  govPin: string;
  setBi: (bi: string) => void;
  setPhone: (phone: string) => void;
  setNif: (nif: string) => void;
  setPassport: (passport: string) => void;
  setVerificationStatus: (status: string) => void;
  setHasFacialAuth: (val: boolean) => void;
  setHasTwoFactor: (val: boolean) => void;
  setGovPin: (pin: string) => void;
  contactsCount: number;
  setTab: (tab: string) => void;
  handleLogout: (clearAll?: boolean) => void;
}

export function ProfileContent({
  showSensitiveData,
  setShowSensitiveData,
  bi,
  phone,
  nif,
  passport,
  verificationStatus,
  hasFacialAuth,
  hasTwoFactor,
  govPin,
  setBi,
  setPhone,
  setNif,
  setPassport,
  setVerificationStatus,
  setHasFacialAuth,
  setHasTwoFactor,
  setGovPin,
  contactsCount,
  setTab,
  handleLogout,
}: ProfileContentProps) {
  // Modal states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfiguringSecurity, setIsConfiguringSecurity] = useState(false);

  // Verification Wizard states
  const [verifyStep, setVerifyStep] = useState(1);
  const [tempBi, setTempBi] = useState(bi);
  const [tempNif, setTempNif] = useState(nif);
  const [tempPassport, setTempPassport] = useState(passport);
  const [tempPhone, setTempPhone] = useState(phone);
  
  // Biometric capture states
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [webcamBlocked, setWebcamBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Security configuration states
  const [tempPin, setTempPin] = useState(govPin);
  const [temp2FA, setTemp2FA] = useState(hasTwoFactor);
  const [tempFacial, setTempFacial] = useState(hasFacialAuth);

  // Log audit logs local helper simulate
  const [auditLogs, setAuditLogs] = useState<Array<{action: string, time: string}>>([
    { action: 'Acesso renovado via BI Digital', time: 'Hoje, 15:30' },
    { action: 'Sincronização com Registos SME', time: 'Ontem, 09:24' },
    { action: 'Verificação Parcial Validada', time: '12/05/2026' }
  ]);

  // Handle webcam stream start
  const startWebcam = async () => {
    setIsCapturing(true);
    setCaptureProgress(0);
    setCaptureSuccess(false);
    setWebcamBlocked(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 320, facingMode: 'user' } 
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera fallback triggered or blocked:", err);
      setWebcamBlocked(true);
    }
  };

  // Stop Webcam stream
  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setIsCapturing(false);
  };

  // Biometric Progress Simulation effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCapturing && captureProgress < 100) {
      timer = setTimeout(() => {
        setCaptureProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          return next >= 100 ? 100 : next;
        });
      }, 300);
    } else if (isCapturing && captureProgress === 100) {
      setCaptureSuccess(true);
      stopWebcam();
    }
    return () => clearTimeout(timer);
  }, [isCapturing, captureProgress]);

  // Clean up webcam on unmount / modal close
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // Confirm verification process
  const handleFinalizeVerification = () => {
    setBi(tempBi);
    setNif(tempNif);
    setPassport(tempPassport);
    setPhone(tempPhone);
    setGovPin(tempPin);
    setHasTwoFactor(temp2FA);
    setHasFacialAuth(tempFacial);
    setVerificationStatus('Totalmente verificado');
    
    // Add event log
    const newLog = { action: 'Autenticação Avançada validada pelo SME', time: 'Agora mesmo' };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsVerifying(false);
    setVerifyStep(1);
    setCaptureSuccess(false);
  };

  const handleUpdateSecuritySettings = () => {
    setGovPin(tempPin);
    setHasTwoFactor(temp2FA);
    setHasFacialAuth(tempFacial);
    
    const newLog = { action: 'Definições de PIN segurança atualizadas', time: 'Agora mesmo' };
    setAuditLogs(prev => [newLog, ...prev]);
    setIsConfiguringSecurity(false);
  };

  return (
    <section className="space-y-6">
      {/* Identity Header */}
      <div className="bg-white md:border border-slate-100 rounded-[32px] md:rounded-[48px] p-6 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden group">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
        
        <div className="relative">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[56px] border-4 border-slate-50 p-1.5 md:p-2 bg-white shadow-2xl relative">
            <img 
              src={USER_PROFILE_PHOTO} 
              alt="Perfil" 
              className="w-full h-full rounded-[24px] md:rounded-[48px] object-cover shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 text-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-xl border-4 border-white ${
              verificationStatus === 'Totalmente verificado' 
                ? 'bg-emerald-500' 
                : verificationStatus === 'Parcialmente verificado'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}>
              {verificationStatus === 'Totalmente verificado' ? (
                <BadgeCheck size={20} className="md:w-8 md:h-8" />
              ) : verificationStatus === 'Parcialmente verificado' ? (
                <Fingerprint size={20} className="md:w-8 md:h-8 animate-pulse" />
              ) : (
                <Shield size={20} className="md:w-8 md:h-8" />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase mb-0">Edlasio Galhardo</h2>
              <div className="flex justify-center md:block">
                {verificationStatus === 'Totalmente verificado' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-2xs">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Totalmente verificado
                  </span>
                ) : verificationStatus === 'Parcialmente verificado' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                    <CircleDot size={12} className="text-amber-500" /> Parcialmente verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 animate-pulse">
                    <Shield size={12} className="text-red-500" /> Não verificado
                  </span>
                )}
              </div>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">ID Única Digital &bull; República de Angola</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {/* National ID */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field shadow-3xs hover:bg-slate-100/50 transition-colors">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Número de BI</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? bi : bi.replace(/\(?[A-Z0-9]{6}\)?$/, '******')}
                </div>
              </div>
              <button 
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="p-2.5 text-slate-400 hover:text-primary transition-colors active:scale-90"
              >
                {showSensitiveData ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Phone */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field shadow-3xs hover:bg-slate-100/50 transition-colors">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Telefone Principal</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? phone : phone.replace(/\d{3} \d{3}$/, '*** ***')}
                </div>
              </div>
              <div className="p-2.5 text-emerald-500 bg-white rounded-xl shadow-xs border border-emerald-50">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* NIF */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field shadow-3xs hover:bg-slate-100/50 transition-colors">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contribuinte (NIF)</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? nif : nif.replace(/\d{4}$/, '****')}
                </div>
              </div>
              <div className="p-2.5 text-indigo-500 bg-white rounded-xl shadow-xs border border-indigo-50">
                <IdCard size={18} />
              </div>
            </div>

            {/* Passport */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field shadow-3xs hover:bg-slate-100/50 transition-colors">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Passaporte</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? passport : passport.replace(/[A-Z0-9]{4}$/, '****')}
                </div>
              </div>
              <div className="p-2.5 text-slate-600 bg-white rounded-xl shadow-xs border border-slate-100">
                <Plane size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Identity Verification Banner/Cta */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-905 rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-indigo-950/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-28 -mt-28 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-slate-800/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest rounded-full border ${
                verificationStatus === 'Totalmente verificado' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20 animate-pulse'
              }`}>
                {verificationStatus}
              </span>
              <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Identidade Oficial Segura</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight">Portal de Credenciais Digitais</h3>
            <p className="text-indigo-150 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              O seu portal do Correio Digital de Angola opera com autenticação multifatorial. Mantenha os seus dados validados biometricamente e use o seu PIN para assinar correspondência de efeito legal do Estado.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5 w-full md:w-auto">
            {verificationStatus !== 'Totalmente verificado' ? (
              <button 
                onClick={() => {
                  setTempBi(bi);
                  setTempNif(nif);
                  setTempPassport(passport);
                  setTempPhone(phone);
                  setVerifyStep(1);
                  setIsVerifying(true);
                }}
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Scan size={16} /> Iniciar Certificação Digital
              </button>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4.5 text-center flex flex-col items-center">
                <span className="text-emerald-300 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 justify-center">
                  <BadgeCheck size={16} /> Identidade Digital Consolidada
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1 font-mono uppercase tracking-wider">Assinaturas Oficiais Habilitadas</span>
              </div>
            )}
            
            <button 
              onClick={() => {
                setTempPin(govPin);
                setTemp2FA(hasTwoFactor);
                setTempFacial(hasFacialAuth);
                setIsConfiguringSecurity(true);
              }}
              className="w-full md:w-auto bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 ring-1 ring-white/20 cursor-pointer"
            >
              <Settings size={14} /> Gerir PIN e 2FA
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Security Center */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">Segurança</h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Protecção de Identidade</p>
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${hasTwoFactor ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Autenticação Biométrica', value: hasFacialAuth ? 'Activada' : 'Seleção Facial ausente', icon: <Fingerprint size={20} />, status: hasFacialAuth ? 'success' : 'neutral' },
              { label: 'Assinatura Digital SME', value: verificationStatus === 'Totalmente verificado' ? 'Certificada' : 'Em homologação', icon: <BadgeCheck size={20} />, status: verificationStatus === 'Totalmente verificado' ? 'success' : 'neutral' },
              { label: 'Autenticação em Dois Fatores', value: hasTwoFactor ? 'Chave Ativa' : 'Inativa', icon: <Smartphone size={20} />, status: hasTwoFactor ? 'success' : 'warning' },
              { label: 'Código PIN Governamental', value: govPin ? 'Configurado' : 'Não definido', icon: <Key size={20} />, status: govPin ? 'success' : 'warning' },
              { label: 'Histórico de Acessos', value: 'Ver logs de auditoria', icon: <History size={20} />, status: 'neutral', action: () => setIsConfiguringSecurity(true) },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={item.action}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-orange-600 transition-colors">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'success' 
                    ? 'text-emerald-600' 
                    : item.status === 'warning' 
                    ? 'text-amber-600' 
                    : 'text-slate-400'
                }`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Preferences */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">Preferências</h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Configuração do Sistema</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Idioma da Interface', value: 'Português', icon: <Languages size={20} /> },
              { label: 'Notificações de Estado', value: 'Ativas', icon: <Bell size={20} /> },
              { label: 'Segurança de Acesso', value: verificationStatus === 'Totalmente verificado' ? 'Máximo (Selo Nacional)' : 'Parcial', icon: <ShieldCheck size={20} /> },
              { label: 'Círculo de Confiança', value: `${contactsCount} Membros`, icon: <Users size={20} />, action: () => setTab('contatos') },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-primary transition-colors">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.value}</span>
                  <Settings className="text-slate-300 group-hover:rotate-90 transition-transform" size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-blue-900 rounded-[28px] md:rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 relative overflow-hidden shadow-xl mt-2 md:mt-0 text-left">
         <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid-profile" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid-profile)" /></svg>
         </div>
         
         <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
            <div className="w-11 h-11 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white border border-white/20 shrink-0">
               <ShieldCheck size={24} className="md:w-7 md:h-7" />
            </div>
            <div>
               <h4 className="text-base md:text-xl font-black mb-0.5 md:mb-1">Protecção de Dados Pessoais</h4>
               <p className="text-white/70 text-[10px] md:text-sm font-medium max-w-sm">Desta forma, os seus dados estão salvaguardados nos termos da Lei nº 22/11 da República de Angola.</p>
            </div>
         </div>
         
         <button className="w-full md:w-auto bg-white text-primary px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 cursor-pointer border-0">
            Exportar Relatórios
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-6">
        <button
          onClick={() => handleLogout(false)}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 md:py-5 bg-white border border-line rounded-2xl md:rounded-3xl font-black text-sm text-slate-600 active:bg-slate-50 transition-all shadow-sm cursor-pointer"
        >
          <LogOut size={18} className="text-slate-400" />
          Sair da Conta
        </button>
        <button
          onClick={() => {
            if(confirm("Deseja apagar todos os dados locais e restaurar os padrões?")) handleLogout(true);
          }}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 md:py-5 bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl font-black text-sm text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm cursor-pointer"
        >
          <Trash2 size={18} />
          Limpar Dados Locais
        </button>
      </div>

      {/* --- IDENTITY VERIFICATION WIZARD MODAL --- */}
      <AnimatePresence>
        {isVerifying && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-indigo-950 text-white">
                <div>
                  <h3 className="font-extrabold text-white text-base md:text-lg flex items-center gap-2 uppercase tracking-tight">
                    <Scan className="text-orange-400" size={20} />
                    Validação de Identidade Digital
                  </h3>
                  <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mt-0.5">
                    Processo Homologado pelo SME & Ministério da Ciência
                  </p>
                </div>
                <button 
                  onClick={() => {
                    stopWebcam();
                    setIsVerifying(false);
                  }}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress Tracker Steps */}
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-150 flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${verifyStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>1</span>
                  <span className={verifyStep === 1 ? 'text-primary' : ''}>Credenciais</span>
                </div>
                <div className="w-8 h-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${verifyStep >= 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>2</span>
                  <span className={verifyStep === 2 ? 'text-primary' : ''}>Digitalização Facial</span>
                </div>
                <div className="w-8 h-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${verifyStep >= 3 ? 'bg-primary text-white' : 'bg-slate-200'}`}>3</span>
                  <span className={verifyStep === 3 ? 'text-primary' : ''}>Segurança</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {verifyStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-xs text-slate-700 leading-relaxed font-semibold">
                      <Landmark className="text-secondary shrink-0 mt-0.5" size={18} />
                      <span>
                        Para homologar a sua identidade, introduza e valide os seus identificadores oficiais nacionais em vigor. Estes dados serão processados via canais encriptados seguros do SME e AGT.
                      </span>
                    </div>

                    <div className="space-y-3">
                      <label className="grid gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número de Bilhete de Identidade (BI)</span>
                        <div className="relative">
                          <input 
                            type="text"
                            maxLength={14}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:bg-white transition-all font-mono"
                            value={tempBi}
                            onChange={(e) => setTempBi(e.target.value.toUpperCase())}
                          />
                        </div>
                      </label>

                      <label className="grid gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número de Identificação Fiscal (NIF)</span>
                        <input 
                          type="text"
                          maxLength={10}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:bg-white transition-all font-mono"
                          value={tempNif}
                          onChange={(e) => setTempNif(e.target.value.replace(/\D/g, ''))}
                        />
                      </label>

                      <label className="grid gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Número do Passaporte</span>
                        <input 
                          type="text"
                          maxLength={9}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:bg-white transition-all font-mono"
                          value={tempPassport}
                          onChange={(e) => setTempPassport(e.target.value.toUpperCase())}
                        />
                      </label>

                      <label className="grid gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Telefone Principal Associado</span>
                        <input 
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:bg-white transition-all font-mono"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {verifyStep === 2 && (
                  <div className="space-y-4 text-center">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex gap-3 text-xs text-slate-700 leading-relaxed font-semibold text-left">
                      <Camera className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                      <span>
                        A captura biométrica realiza o mapeamento 3D facial e selfie de autenticação. Os seus vetores biométricos serão selados criptograficamente.
                      </span>
                    </div>

                    {/* Camera Feed Container */}
                    <div className="relative mx-auto w-56 h-56 rounded-full border-4 border-slate-100 overflow-hidden shadow-xl bg-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
                      
                      {isCapturing && (
                        <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping pointer-events-none z-20" />
                      )}

                      {/* Moving Scanning Bar */}
                      {isCapturing && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse z-20" style={{
                          animation: 'scan-motion 2s infinite ease-in-out',
                          position: 'absolute'
                        }} />
                      )}

                      {captureSuccess ? (
                        <div className="flex flex-col items-center justify-center text-emerald-400 gap-1.5 z-10 bg-slate-950/80 w-full h-full p-4">
                          <BadgeCheck size={36} className="text-emerald-500" />
                          <span className="text-xs uppercase font-black tracking-widest text-[#10B981]">Biometria Gravada</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Selfie de Identificação Selada</span>
                        </div>
                      ) : isCapturing ? (
                        <div className="w-full h-full relative">
                          {webcamBlocked ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-indigo-200 gap-1">
                              <Camera size={26} className="text-indigo-400 animate-bounce" />
                              <span className="text-[10px] font-black uppercase">Detetor de Face</span>
                              <span className="text-[9px] text-slate-300">Biometria simulada inteligente activa</span>
                              <div className="w-32 bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-indigo-400 h-full" style={{ width: `${captureProgress}%` }} />
                              </div>
                              <span className="text-[9px] font-mono mt-1">{captureProgress}%</span>
                            </div>
                          ) : (
                            <>
                              <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="w-full h-full object-cover rounded-full"
                              />
                              <div className="absolute bottom-4 left-0 right-0 z-20 text-white flex flex-col items-center">
                                <span className="bg-indigo-600/90 text-[8.5px] px-2 py-0.5 rounded-full font-black uppercase text-center tracking-wider block">
                                  A mapear: {captureProgress}%
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2.5 p-4 text-center">
                          <Camera size={40} className="text-slate-500" />
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-450 leading-relaxed">
                            Câmara em Espera
                          </p>
                          <p className="text-[8.5px] text-slate-500 font-medium">
                            Clique abaixo para iniciar o reconhecimento facial seguro
                          </p>
                        </div>
                      )}
                    </div>

                    {!isCapturing && !captureSuccess && (
                      <button 
                        onClick={startWebcam}
                        className="w-full max-w-sm mx-auto bg-primary text-white rounded-xl py-3.5 font-bold hover:bg-primary/95 transition-all text-xs uppercase tracking-wider block cursor-pointer border-0 shadow-lg"
                      >
                        Ativar Câmara em modo Biométrico
                      </button>
                    )}

                    {isCapturing && (
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse block">
                        Por favor, olhe fixamente para a câmara e não se mova...
                      </span>
                    )}

                    {captureSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl inline-flex items-center gap-2 max-w-md text-left">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-emerald-800 text-[10.5px] font-bold">
                          Assinatura biométrica facial certificada e vinculada à sua ID do SME nacional.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {verifyStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex gap-3 text-xs text-slate-700 leading-relaxed font-semibold">
                      <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
                      <span>
                        Configure os seus fatores de segurança fundamentais. O PIN governamental é obrigatório para assinar documentos de validade jurídica civis e fiscais.
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* PIN setup */}
                      <label className="grid gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">PIN Governamental de Assinatura (4 dígitos)</span>
                        <input 
                          type="password"
                          maxLength={4}
                          placeholder="••••"
                          value={tempPin}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-lg font-mono font-black tracking-[0.5em] focus:outline-none focus:border-indigo-500"
                          onChange={(e) => setTempPin(e.target.value.replace(/\D/g, ''))}
                        />
                      </label>

                      {/* 2FA Toggle */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 block">Autenticação em Dois Fatores (2FA)</span>
                          <span className="text-[10.5px] text-slate-400 block font-medium">Requer verificação adicional por código OTP no telemóvel ao fazer login.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={temp2FA}
                            onChange={(e) => setTemp2FA(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      {/* Facial Authentication Toggle */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 block">Ativar Login Facial Biométrico</span>
                          <span className="text-[10.5px] text-slate-400 block font-medium">Permite autenticação direta no Correio Digital via câmara digital.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={tempFacial}
                            onChange={(e) => setTempFacial(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
                      <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl w-full text-center space-y-2">
                        <Award className="text-emerald-600 mx-auto" size={28} />
                        <h4 className="text-slate-800 font-black text-sm uppercase tracking-wide">Pronto Para Selagem de Identidade</h4>
                        <p className="text-slate-500 text-xs">
                          Ao concluir, a sua conta assumirá o estatuto de <strong>Totalmente Verificado</strong> na infraestrutura de Angola.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="p-6 border-t border-slate-150 flex gap-3 bg-slate-50">
                {verifyStep > 1 && (
                  <button 
                    onClick={() => {
                      stopWebcam();
                      setVerifyStep(prev => prev - 1);
                    }}
                    className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-extrabold text-xs uppercase rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    Retroceder
                  </button>
                )}
                
                {verifyStep < 3 ? (
                  <button 
                    onClick={() => {
                      if (verifyStep === 2 && !captureSuccess) {
                        alert("Por favor, conclua a digitalização biométrica facial antes de avançar.");
                        return;
                      }
                      setVerifyStep(prev => prev + 1);
                    }}
                    className="flex-1 py-3.5 bg-primary text-white font-extrabold text-xs uppercase rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-0"
                  >
                    Avançar <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalizeVerification}
                    disabled={!tempPin || tempPin.length < 4}
                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase rounded-xl hover:opacity-95 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border-0 disabled:opacity-50"
                  >
                    Concluir e Selar Identidade <Check size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PIN AND 2FA SECURITY CONFIGURATION PANEL --- */}
      <AnimatePresence>
        {isConfiguringSecurity && (
          <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 text-left flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base uppercase tracking-tight text-white leading-tight">Configuração de Segurança</h3>
                    <p className="text-[9px] text-slate-450 uppercase tracking-widest font-bold">Identidade Digital de Angola</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsConfiguringSecurity(false)}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  {/* PIN Govern */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Alterar Código PIN Governamental (4 dígitos)</label>
                    <input 
                      type="password"
                      maxLength={4}
                      value={tempPin}
                      placeholder="••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:border-orange-500"
                      onChange={(e) => setTempPin(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  {/* 2FA switch */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Autenticação 2 Fatores (2FA)</span>
                      <span className="text-[10px] text-slate-400 block">Requer confirmação SMS ou Authenticator</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={temp2FA}
                        onChange={(e) => setTemp2FA(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Facial state switch */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Login por Biometria Facial</span>
                      <span className="text-[10px] text-slate-400 block">Usar mapeamento facial na autenticação</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tempFacial}
                        onChange={(e) => setTempFacial(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="pt-4 border-t border-slate-150">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">Logs de Atividade Recentes</span>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {auditLogs.map((log, el) => (
                      <div key={el} className="flex justify-between items-center text-[11px] py-1 text-slate-600 font-semibold">
                        <span className="truncate">{log.action}</span>
                        <span className="text-slate-400 font-mono shrink-0 ml-2">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setIsConfiguringSecurity(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-extrabold text-xs uppercase rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleUpdateSecuritySettings}
                  disabled={!tempPin || tempPin.length < 4}
                  className="flex-1 py-3 bg-primary text-white font-extrabold text-xs uppercase rounded-xl hover:opacity-95 shadow-md cursor-pointer border-0 disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan-motion {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </section>
  );
}
