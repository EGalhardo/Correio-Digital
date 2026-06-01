/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Landmark, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  History,
  Shield,
  ShieldCheck,
  Plane,
  Smartphone,
  Eye,
  EyeOff,
  IdCard,
  User,
  Sparkles,
  Settings,
  Check,
  Bell,
  Globe
} from 'lucide-react';
import { USER_PROFILE_PHOTO } from '../../constants/data';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

interface GovPerfilContentProps {
  logs: AuditLog[];
  emergencyMode: boolean;
  onToggleEmergency: (active: boolean) => void;
  bi?: string;
  phone?: string;
  nif?: string;
  passport?: string;
  profileName?: string;
  userBirthDate?: string;
  userFiliation?: string;
  userMaritalStatus?: string;
  hasFacialAuth?: boolean;
  hasTwoFactor?: boolean;
  govPin?: string;
}

export function GovPerfilContent({ 
  logs, 
  emergencyMode, 
  onToggleEmergency,
  bi = '009874562LA041',
  phone = '+244 923 888 777',
  nif = '5401328901',
  passport = 'AO-P123456',
  profileName = 'Edlasio Galhardo',
  userBirthDate = '12/03/1995',
  userFiliation = 'António Galhardo & Maria Conceição',
  userMaritalStatus = 'Solteiro',
  hasFacialAuth = true,
  hasTwoFactor = false,
  govPin = '1234'
}: GovPerfilContentProps) {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  // Local interface configuration states
  const [interfaceLanguage, setInterfaceLanguage] = useState<'PT' | 'EN'>('PT');
  const [activeSessions, setActiveSessions] = useState(3);
  const [notificationChannel, setNotificationChannel] = useState<'PUSH' | 'SMS' | 'EMAIL'>('PUSH');
  const [privacyMode, setPrivacyMode] = useState<'PADRÃO' | 'MILITARIZADA'>('PADRÃO');

  return (
    <div className="pb-24 space-y-6 md:space-y-8 select-none font-sans text-left">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Shield size={16} />
            </div>
            <span className="font-mono text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
              Admin &bull; Perfil de Autoridade
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
            Conta Administrativa
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-2 max-w-xl">
            Credenciais de segurança nacional, ficha de habilitação de autoridade e controle do barramento unificado do Estado.
          </p>
        </div>
      </div>

      {/* Primary Header Card (Edlasio Galhardo & Metadata 2x2) */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm flex flex-col xl:flex-row items-center gap-6 xl:gap-10 relative overflow-hidden">
        {/* Absolute Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/20 rounded-full blur-3xl pointer-events-none -z-1" />
        
        {/* Avatar squircle on the left */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 z-10">
          <img 
            src={USER_PROFILE_PHOTO} 
            alt="Foto de Edlasio Galhardo" 
            className="w-full h-full object-cover rounded-[32px] shadow-sm border border-slate-150"
            referrerPolicy="no-referrer"
          />
          {/* Circular green check confirmed badge */}
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-md">
            <Check size={18} strokeWidth={3} />
          </div>
        </div>

        {/* Info on the right with 2x2 grid */}
        <div className="flex-1 w-full text-center xl:text-left space-y-4 xl:space-y-6 z-10">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center xl:justify-start">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase mb-0">
                {profileName}
              </h2>
              <div className="flex justify-center md:block">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-3xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-0.5" /> Estado: Activo
                </span>
              </div>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
              ID Única Digital &bull; República de Angola
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {/* National ID Card (BI) */}
            <div className="bg-transparent border border-slate-200 rounded-2xl p-4 flex items-center justify-between group shadow-3xs transition-colors">
              <div className="min-w-0 text-left">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Número de BI
                </div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base tracking-wider truncate">
                  {showSensitiveData ? bi : bi.replace(/\(?[A-Z0-9]{6}\)?$/, '******')}
                </div>
              </div>
              <button 
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors active:scale-95 bg-white rounded-xl shadow-3xs border border-slate-200"
              >
                {showSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Telephone Card */}
            <div className="bg-transparent border border-slate-200 rounded-2xl p-4 flex items-center justify-between group shadow-3xs transition-colors">
              <div className="min-w-0 text-left">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Telefone Principal
                </div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base tracking-wider truncate">
                  {showSensitiveData ? phone : phone.replace(/\d{3} \d{3}$/, '*** ***')}
                </div>
              </div>
              <div className="p-2.5 text-emerald-500 bg-white rounded-xl shadow-3xs border border-slate-200">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* Tax ID Contribuinte Card */}
            <div className="bg-transparent border border-slate-200 rounded-2xl p-4 flex items-center justify-between group shadow-3xs transition-colors">
              <div className="min-w-0 text-left">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Contribuinte (NIF)
                </div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base tracking-wider truncate">
                  {showSensitiveData ? nif : nif.replace(/\d{4}$/, '****')}
                </div>
              </div>
              <div className="p-2.5 text-indigo-500 bg-white rounded-xl shadow-3xs border border-slate-200">
                <IdCard size={18} />
              </div>
            </div>

            {/* Passport Card */}
            <div className="bg-transparent border border-slate-200 rounded-2xl p-4 flex items-center justify-between group shadow-3xs transition-colors">
              <div className="min-w-0 text-left">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Passaporte
                </div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base tracking-wider truncate">
                  {showSensitiveData ? passport : passport.replace(/[A-Z0-9]{4}$/, '****')}
                </div>
              </div>
              <div className="p-2.5 text-slate-500 bg-white rounded-xl shadow-3xs border border-slate-200">
                <Plane size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Card: Cadastro Eletrónico Harmonizado */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm text-left">
        {/* Forms Field Block - Non-Editable with lock indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Nome Completo */}
          <div className="space-y-1 bg-transparent border border-slate-200 p-4 rounded-2xl relative group">
            <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Nome Completo
            </span>
            <div className="text-slate-900 font-black text-sm uppercase tracking-tight flex items-center justify-between">
              <span>{profileName}</span>
              <Lock size={12} className="text-slate-300" />
            </div>
          </div>

          {/* Número de BI */}
          <div className="space-y-1 bg-transparent border border-slate-200 p-4 rounded-2xl relative group">
            <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Número de BI
            </span>
            <div className="text-slate-900 font-mono font-bold text-sm tracking-widest flex items-center justify-between">
              <span>{bi}</span>
              <Lock size={12} className="text-slate-300" />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-1 bg-transparent border border-slate-200 p-4 rounded-2xl relative group">
            <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Data de Nascimento
            </span>
            <div className="text-slate-900 font-mono font-bold text-sm tracking-wider flex items-center justify-between">
              <span>{userBirthDate}</span>
              <Lock size={12} className="text-slate-300" />
            </div>
          </div>

          {/* Estado Civil */}
          <div className="space-y-1 bg-transparent border border-slate-200 p-4 rounded-2xl relative group">
            <span className="block text-[8px] md:text-[9px] font-[900] text-slate-400 uppercase tracking-widest">
              Estado Civil
            </span>
            <div className="text-slate-900 font-black text-sm uppercase tracking-tight flex items-center justify-between">
              <span>{userMaritalStatus}</span>
              <Lock size={12} className="text-slate-300" />
            </div>
          </div>

          {/* Filiação */}
          <div className="space-y-1 bg-transparent border border-slate-200 p-4 rounded-2xl relative group sm:col-span-2">
            <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Filiação (Progenitores)
            </span>
            <div className="text-slate-900 font-extrabold text-sm uppercase tracking-tight flex items-center justify-between">
              <span>{userFiliation}</span>
              <Lock size={12} className="text-slate-300" />
            </div>
          </div>
          
        </div>
      </div>

      {/* Third Section: Split Dual Columns layout as shown in attached image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Column 1: SEGURANÇA */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          
          <div className="space-y-6 md:space-y-8">
            {/* Security Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 shrink-0">
                  <Lock size={22} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">
                    Segurança
                  </h3>
                  <p className="text-[9px] @md:text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    PROTECÇÃO DE IDENTIDADE
                  </p>
                </div>
              </div>
              {/* Pulse status indicator at top-right corner of card */}
              <div className="w-2.5 h-2.5 rounded-full bg-amber-550 bg-amber-500 animate-pulse relative">
                <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-60" />
              </div>
            </div>

            {/* List Rows of Security Settings */}
            <div className="space-y-3">
              
              {/* Autenticação Biométrica */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <span className="text-xs font-bold text-slate-700">Autenticação Biométrica</span>
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl ${
                  hasFacialAuth 
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-150' 
                    : 'text-slate-400 bg-slate-100 border border-slate-200'
                }`}>
                  {hasFacialAuth ? 'ACTIVADA' : 'INATIVA'}
                </span>
              </div>

              {/* Assinatura Digital SME */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <span className="text-xs font-bold text-slate-700">Assinatura Digital SME</span>
                <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl text-emerald-600 bg-emerald-50 border border-emerald-150">
                  CERTIFICADA
                </span>
              </div>

              {/* Autenticação em Dois Fatores */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <span className="text-xs font-bold text-slate-700 font-sans">Autenticação em Dois Fatores</span>
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl ${
                  hasTwoFactor 
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-150' 
                    : 'text-amber-600 bg-amber-50 border border-amber-150'
                }`}>
                  {hasTwoFactor ? 'ACTIVADA' : 'INATIVA'}
                </span>
              </div>

              {/* Código PIN Governamental */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <span className="text-xs font-bold text-slate-700">Código PIN Governamental</span>
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl ${
                  govPin 
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-150' 
                    : 'text-slate-400 bg-slate-100 border border-slate-200'
                }`}>
                  {govPin ? 'CONFIGURADO' : 'NÃO DEFINIDO'}
                </span>
              </div>

              {/* Histórico de Acessos clickable action */}
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="w-full text-left p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <History size={14} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700">Histórico de Acessos</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                  {showLogs ? 'OCULTAR AUDITORIA' : 'VER LOGS DE AUDITORIA'}
                </span>
              </button>

            </div>
          </div>
          
        </div>

        {/* Column 2: PREFERÊNCIAS */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          
          <div className="space-y-6 md:space-y-8">
            {/* Preferences Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0">
                  <Settings size={22} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">
                    Preferências
                  </h3>
                  <p className="text-[9px] @md:text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    CONFIGURAÇÃO DO SISTEMA
                  </p>
                </div>
              </div>

              {/* Action Button: ABRIR CENTRAL */}
              <button 
                onClick={() => alert("A Central unificada de dados de acesso do utilizador está habilitada localmente.")}
                className="px-3.5 py-1.5 bg-transparent border border-slate-200 text-slate-800 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                ABRIR CENTRAL
              </button>
            </div>

            {/* List Rows of Preferences Settings */}
            <div className="space-y-3">
              
              {/* Idioma da Interface */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Idioma da Interface</span>
                </div>
                <button
                  onClick={() => setInterfaceLanguage(prev => prev === 'PT' ? 'EN' : 'PT')}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-white rounded-xl shadow-3xs border border-slate-150 hover:bg-slate-50/50 cursor-pointer"
                >
                  {interfaceLanguage === 'PT' ? 'PORTUGUÊS ▾' : 'ENGLISH ▾'}
                </button>
              </div>

              {/* Notificações & Canal */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <Bell size={13} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Notificações & Canal</span>
                </div>
                <button
                  onClick={() => setNotificationChannel(prev => prev === 'PUSH' ? 'SMS' : prev === 'SMS' ? 'EMAIL' : 'PUSH')}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-white rounded-xl shadow-3xs border border-slate-150 hover:bg-slate-50/50 cursor-pointer"
                >
                  NOTIFICAÇÃO {notificationChannel} ▾
                </button>
              </div>

              {/* Privacidade & Biometria */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Privacidade & Biometria</span>
                </div>
                <button
                  onClick={() => setPrivacyMode(prev => prev === 'PADRÃO' ? 'MILITARIZADA' : 'PADRÃO')}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-white rounded-xl shadow-3xs border border-slate-150 hover:bg-slate-50/50 cursor-pointer"
                >
                  {privacyMode === 'PADRÃO' ? 'PADRÃO ▾' : 'CDA MÁXIMA ▾'}
                </button>
              </div>

              {/* Sessões & Dispositivos */}
              <div className="p-4 bg-transparent border border-slate-200 rounded-2xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <Smartphone size={13} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Sessões & Dispositivos</span>
                </div>
                <button
                  onClick={() => setActiveSessions(prev => prev === 3 ? 1 : 3)}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-white rounded-xl shadow-3xs border border-slate-150 hover:bg-slate-50/50 cursor-pointer"
                >
                  {activeSessions} {activeSessions === 1 ? 'ACTIVA' : 'ACTIVAS'} ▾
                </button>
              </div>

            </div>
          </div>
          
        </div>

      </div>

      {/* Slide-out System Logs Section */}
      {showLogs && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-150/60 rounded-[32px] p-6 md:p-8 shadow-sm text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#2563eb]" />
              <h4 className="font-sans text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                Logs de Auditoria de Acesso unificado (SME/AGT)
              </h4>
            </div>
            <span className="font-mono text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              {logs.length} Registros Activos
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold uppercase tracking-widest">
                Sem eventos registados recentemente.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-100/30 transition-all font-mono text-[10px]">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      log.type === 'critical' ? 'bg-red-500 animate-pulse' :
                      log.type === 'warning' ? 'bg-amber-500' :
                      log.type === 'success' ? 'bg-emerald-505 bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <span className="font-bold text-slate-800 uppercase">{log.action}</span>
                  </div>
                  <div className="text-slate-400 font-semibold mt-1.5 sm:mt-0">
                    {log.timestamp} &bull; <span className="font-bold text-indigo-600 font-sans">{log.user}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
}
