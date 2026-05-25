/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Mail, 
  Inbox, 
  Send, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Fingerprint,
  Scan,
  IdCard,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  ChevronRight,
  Sliders,
  Eye,
  Activity,
  Settings,
  Layers,
  Smartphone,
  Ban,
  Key
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

// Elegant monthly trend data to populate the modern minimalist charts
const GENERAL_TREND_DATA = [
  { month: 'Jan', mensagens: 14200, naoLidas: 410, enviadas: 12100, solicitacoes: 4150 },
  { month: 'Fev', mensagens: 16800, naoLidas: 380, enviadas: 14800, solicitacoes: 5200 },
  { month: 'Mar', mensagens: 19500, naoLidas: 390, enviadas: 17200, solicitacoes: 6300 },
  { month: 'Abr', mensagens: 21000, naoLidas: 290, enviadas: 19100, solicitacoes: 7800 },
  { month: 'Mai', mensagens: 24580, naoLidas: 320, enviadas: 21450, solicitacoes: 8920 },
];

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

interface GovContactsContentProps {
  bi?: string;
  setBi?: (val: string) => void;
  nif?: string;
  setNif?: (val: string) => void;
  phone?: string;
  setPhone?: (val: string) => void;
  passport?: string;
  setPassport?: (val: string) => void;
  profileName?: string;
  setProfileName?: (val: string) => void;
  userBirthDate?: string;
  setUserBirthDate?: (val: string) => void;
  userFiliation?: string;
  setUserFiliation?: (val: string) => void;
  userMaritalStatus?: string;
  setUserMaritalStatus?: (val: string) => void;
  verificationStatus?: string;
  setVerificationStatus?: (val: string) => void;
  hasFacialAuth?: boolean;
  setHasFacialAuth?: (val: boolean) => void;
  hasTwoFactor?: boolean;
  setHasTwoFactor?: (val: boolean) => void;
  govPin?: string;
  setGovPin?: (val: string) => void;
  addAuditLog?: (action: string, type?: 'info' | 'warning' | 'critical' | 'success') => void;
  auditLogs?: AuditLog[];
}

export function GovContactsContent({
  bi = '009874562LA041',
  setBi,
  nif = '241098451',
  setNif,
  phone = '+244 923 456 789',
  setPhone,
  passport = 'AO-P129384',
  setPassport,
  profileName = 'Edlasio Galhardo',
  setProfileName,
  userBirthDate = '12/03/1995',
  setUserBirthDate,
  userFiliation = 'António Galhardo & Maria Conceição',
  setUserFiliation,
  userMaritalStatus = 'Solteiro',
  setUserMaritalStatus,
  verificationStatus = 'Totalmente verificado',
  setVerificationStatus,
  hasFacialAuth = true,
  setHasFacialAuth,
  hasTwoFactor = false,
  setHasTwoFactor,
  govPin = '1234',
  setGovPin,
  addAuditLog,
  auditLogs = []
}: GovContactsContentProps) {
  
  // Custom Tab switcher for Admin view: "analytics" vs "master-control"
  const [activeTab, setActiveTab] = useState<'analytics' | 'master-control'>('master-control');

  // Search and filters for Citizen / operator lists
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'user' | 'institution'>('all');
  const [selectedAdminUser, setSelectedAdminUser] = useState<string | null>(null);

  // Search for the historical protocol fraud system
  const [protocolSearchQuery, setProtocolSearchQuery] = useState('');

  // Local storage / reactive permission states for users
  const [citizenPermissions, setCitizenPermissions] = useState({
    tramite: true,
    emissao: true,
    recepcao: true
  });

  const [institutionPermissions, setInstitutionPermissions] = useState({
    tramite: true,
    emissao: true,
    recepcao: true
  });

  // Mock secondary users to populate a full control center
  const mockCitizens = useMemo(() => {
    return [
      {
        id: 'primary-citizen',
        type: 'user',
        name: profileName,
        bi: bi,
        nif: nif,
        phone: phone,
        passport: passport,
        maritalStatus: userMaritalStatus,
        birthDate: userBirthDate,
        filiation: userFiliation,
        verificationStatus: verificationStatus,
        hasFacialAuth: hasFacialAuth,
        hasTwoFactor: hasTwoFactor,
        govPin: govPin,
        permissions: citizenPermissions,
        setPermissions: setCitizenPermissions
      },
      {
        id: 'citizen-2',
        type: 'user',
        name: 'Kiara de Sousa',
        bi: '003214565LA099',
        nif: '540921827',
        phone: '+244 912 884 551',
        passport: 'AO-P927451',
        maritalStatus: 'Casada',
        birthDate: '04/11/1993',
        filiation: 'Carlos de Sousa & Joana de Sousa',
        verificationStatus: 'Totalmente verificado',
        hasFacialAuth: true,
        hasTwoFactor: true,
        govPin: '9001',
        permissions: { tramite: true, emissao: true, recepcao: true }
      },
      {
        id: 'citizen-3',
        type: 'user',
        name: 'Manuel Bernardo',
        bi: '004568123LA088',
        nif: '109283745',
        phone: '+244 931 772 101',
        passport: 'AO-P401928',
        maritalStatus: 'Divorciado',
        birthDate: '29/08/1987',
        filiation: 'Domingos Bernardo & Isabel Bernardo',
        verificationStatus: 'Não verificado',
        hasFacialAuth: false,
        hasTwoFactor: false,
        govPin: '3321',
        permissions: { tramite: false, emissao: false, recepcao: true }
      },
      {
        id: 'institution-1',
        type: 'institution',
        name: 'Agente Tributário #AG-401 (AGT)',
        bi: '001092834LA001',
        nif: '990182745',
        phone: '+244 922 400 110',
        passport: 'N/A',
        maritalStatus: 'N/A',
        birthDate: 'N/A',
        filiation: 'Ministério das Finanças',
        verificationStatus: 'Totalmente verificado',
        hasFacialAuth: true,
        hasTwoFactor: true,
        govPin: '8820',
        permissions: institutionPermissions,
        setPermissions: setInstitutionPermissions
      },
      {
        id: 'institution-2',
        type: 'institution',
        name: 'Serviço de Migração e Estrangeiros (SME)',
        bi: '002837461LA021',
        nif: '990382012',
        phone: '+244 911 300 900',
        passport: 'N/A',
        maritalStatus: 'N/A',
        birthDate: 'N/A',
        filiation: 'Ministério do Interior',
        verificationStatus: 'Totalmente verificado',
        hasFacialAuth: true,
        hasTwoFactor: false,
        govPin: '1100',
        permissions: { tramite: true, emissao: true, recepcao: true }
      }
    ];
  }, [
    profileName, bi, nif, phone, passport, userMaritalStatus, userBirthDate, userFiliation, 
    verificationStatus, hasFacialAuth, hasTwoFactor, govPin, citizenPermissions, institutionPermissions
  ]);

  // Historical unified database for updates (Anti-Fraud Certifications)
  const [cadastralUpdates, setCadastralUpdates] = useState([
    {
      id: '1',
      protocol: 'REG-UP-983145',
      timestamp: '25/05/2026, 11:42:15',
      operator: 'Operador #CDA-401',
      citizenName: 'Edlasio Galhardo',
      bi: '009874562LA041',
      signature: 'SHA256-ECDSA-4ea91b0c9f182e02',
      details: 'Alteração de Estado Civil para Solteiro & Actualização de Filiação'
    },
    {
      id: '2',
      protocol: 'REG-UP-102586',
      timestamp: '24/05/2026, 16:15:30',
      operator: 'Agente #SME-902',
      citizenName: 'Kiara de Sousa',
      bi: '003214565LA099',
      signature: 'SHA256-ECDSA-1a48c9bf20ef1351',
      details: 'Retificação de Data de Nascimento para 04/11/1993'
    },
    {
      id: '3',
      protocol: 'REG-UP-772183',
      timestamp: '22/05/2026, 09:30:11',
      operator: 'Operador #CDA-110',
      citizenName: 'Manuel Bernardo',
      bi: '004568123LA088',
      signature: 'SHA256-ECDSA-fa351dcd12fca1b9',
      details: 'Emissão e Validação de Passaporte AO-P927451'
    }
  ]);

  // Handle live toggle changes for active citizen permissions
  const togglePermission = (userId: string, key: 'tramite' | 'emissao' | 'recepcao') => {
    if (userId === 'primary-citizen') {
      const nextPerms = { ...citizenPermissions, [key]: !citizenPermissions[key] };
      setCitizenPermissions(nextPerms);
      
      const permLabel = key === 'tramite' ? 'Trâmite de Expediente' : key === 'emissao' ? 'Emissão de Documentos Virtuais' : 'Receção de Correspondências';
      const stateLabel = nextPerms[key] ? 'ATIVADA' : 'REVOGADA';
      addAuditLog?.(`[ADMIN] Permissão para ${permLabel} do cidadão ${profileName} foi ${stateLabel} com efeito imediato.`, 'warning');
    } else if (userId === 'institution-1') {
      const nextPerms = { ...institutionPermissions, [key]: !institutionPermissions[key] };
      setInstitutionPermissions(nextPerms);
      
      const permLabel = key === 'tramite' ? 'Trâmite de Expediente' : key === 'emissao' ? 'Emissão de Documentos Virtuais' : 'Receção de Correspondências';
      const stateLabel = nextPerms[key] ? 'ATIVADA' : 'REVOGADA';
      addAuditLog?.(`[ADMIN] Permissão para ${permLabel} da entidade ${mockCitizens[3].name} foi ${stateLabel} com efeito imediato.`, 'warning');
    } else {
      // Toggle for mock accounts just to show reactive behavior
      addAuditLog?.(`[ADMIN] Permissão alterada com sucesso no registro em cache.`, 'info');
    }
  };

  // Changing global user security factors in live environment
  const handleSecurityParamChange = (userId: string, factor: 'face' | '2fa' | 'verification', value: any) => {
    if (userId === 'primary-citizen') {
      if (factor === 'face' && setHasFacialAuth) {
        setHasFacialAuth(value);
        addAuditLog?.(`[ADMIN] Segurança Central: Autenticação Facial do cidadão ${profileName} alterada para ${value ? 'ATIVO' : 'INATIVO'}.`, 'warning');
      }
      if (factor === '2fa' && setHasTwoFactor) {
        setHasTwoFactor(value);
        addAuditLog?.(`[ADMIN] Segurança Central: Autenticação em Duas Etapas (2FA) do cidadão ${profileName} alterada para ${value ? 'ATIVO' : 'INATIVO'}.`, 'warning');
      }
      if (factor === 'verification' && setVerificationStatus) {
        setVerificationStatus(value);
        addAuditLog?.(`[ADMIN] Regulamentação Civil: Estado de Verificação de ${profileName} redefinido para ${value}.`, 'success');
      }
    } else {
      addAuditLog?.(`[ADMIN] Alterado fator de segurança para o registro #${userId} (Simulado).`, 'info');
    }
  };

  // Filter listings based on requirements
  const filteredUsers = useMemo(() => {
    return mockCitizens.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.bi.includes(userSearchQuery);
      const matchesType = userTypeFilter === 'all' || u.type === userTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [mockCitizens, userSearchQuery, userTypeFilter]);

  // Render sensitive records when selected
  const selectedUserObject = useMemo(() => {
    return mockCitizens.find(u => u.id === selectedAdminUser) || null;
  }, [mockCitizens, selectedAdminUser]);

  // Filter the cryptographic seal audit protocol list
  const filteredProtocols = useMemo(() => {
    return cadastralUpdates.filter(p => {
      return (
        p.protocol.toLowerCase().includes(protocolSearchQuery.toLowerCase()) ||
        p.citizenName.toLowerCase().includes(protocolSearchQuery.toLowerCase()) ||
        p.operator.toLowerCase().includes(protocolSearchQuery.toLowerCase()) ||
        p.bi.toLowerCase().includes(protocolSearchQuery.toLowerCase())
      );
    });
  }, [cadastralUpdates, protocolSearchQuery]);


  return (
    <div className="pb-24">
      {/* Central Unified Admin Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Users size={16} />
            </div>
            <span className="font-mono text-xs font-black uppercase text-indigo-600 tracking-[0.2em]">
              Admin Central &bull; Gestão Dupla
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
            Utilizadores &amp; Segurança
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-2 max-w-xl">
            Painel unificado de supervisão. Administre permissões, mitigue fraudes e gerencie os fatores de segurança para cidadãos e operadores institucionais de Angola.
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('master-control')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-0 ${
              activeTab === 'master-control' 
                ? 'bg-white text-indigo-650 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Centro de Controlo
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-0 ${
              activeTab === 'analytics' 
                ? 'bg-white text-indigo-650 shadow-xs font-black' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Painel Analítico
          </button>
        </div>
      </div>

      {/* CONDITIONALLY RENDER ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Modern Bento Grid - 4 Metric Graph Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Metric 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[360px]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="font-mono text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                      Tráfego Total
                    </span>
                  </div>
                  <h3 className="font-sans text-xs font-bold text-slate-450 uppercase tracking-widest">
                    Mensagens Gerais
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-950">
                    24,580
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    <ArrowUpRight size={12} /> +17.2% este mês
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GENERAL_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMensagens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" name="Mensagens" dataKey="mensagens" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMensagens)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[360px]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="font-mono text-[10px] font-black uppercase text-red-600 tracking-wider">
                      Controle Crítico
                    </span>
                  </div>
                  <h3 className="font-sans text-xs font-bold text-slate-450 uppercase tracking-widest">
                    Mensagens Não Lidas
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-red-600">
                    320
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    Redução de -22%
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GENERAL_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNaoLidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" name="Não Lidas" dataKey="naoLidas" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNaoLidas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Metric 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[360px]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-mono text-[10px] font-black uppercase text-amber-500 tracking-wider">
                      Envios de Sistema
                    </span>
                  </div>
                  <h3 className="font-sans text-xs font-bold text-slate-450 uppercase tracking-widest">
                    Mensagens Enviadas
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-950">
                    21,450
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    <ArrowUpRight size={12} /> +15.5% desvio
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GENERAL_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnviadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" name="Enviadas" dataKey="enviadas" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnviadas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Metric 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[360px]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                      Serviços Gov-CDA
                    </span>
                  </div>
                  <h3 className="font-sans text-xs font-bold text-slate-450 uppercase tracking-widest">
                    Solicitações de Doc. Digital
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-emerald-600">
                    8,920
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    <ArrowUpRight size={12} /> Alta demanda (+25%)
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GENERAL_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSolicitacoes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" name="Solicitações" dataKey="solicitacoes" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolicitacoes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bottom Card Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-2 bg-white border border-slate-100/90 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-600">
                      Integridade do Barramento
                    </span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase mb-2 leading-none text-slate-950">
                    Resumo Usuários
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-sm">
                    Esta área consolida o controle estatístico de adesão, autenticação e atividades operacionais dos usuários gerais no ecossistema CDA.
                  </p>
                </div>
                
                <div className="space-y-3 font-sans text-xs text-slate-500 self-center">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Usuários Ativos na Plataforma:</span>
                    <span className="font-bold text-indigo-600">18,420</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Novos Usuários (Este Mês):</span>
                    <span className="font-mono text-emerald-600 font-bold">+1,240 (+12.5%)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Sessões Ativas Simultâneas:</span>
                    <span className="text-emerald-600 font-bold">342 Online</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium text-slate-500">Taxa de Autenticação com Sucesso:</span>
                    <span className="text-slate-800 font-bold">99.2%</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono tracking-wider text-slate-400 uppercase">
                <span>Servidor Gateway:</span>
                <span className="font-bold text-slate-600">Luanda Gate-L04</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}


      {/* CENTRAL COMPREHENSIVE CONTROL CENTER */}
      {activeTab === 'master-control' && (
        <div className="space-y-10 animate-fadeIn text-left">
          
          {/* SECTION 1: UNIFIED USER AND OPERATOR CONTROL BOARD */}
          <div className="bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <div>
                  <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                    Controlo Central de Cidadãos &amp; Operadores
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">
                    Área Regulamentar do Administrador do ecossistema CDA
                  </span>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={13} />
                  <input
                    type="text"
                    placeholder="Pesquisar por Nome ou BI..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-full sm:w-[200px] bg-slate-55 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-55 border border-slate-200 rounded-xl text-[11px] font-black uppercase text-slate-600 cursor-pointer outline-none"
                >
                  <option value="all">TODOS OS INDIVÍDUOS</option>
                  <option value="user">CIDADÃO (USUÁRIO)</option>
                  <option value="institution">OPERADOR (INSTITUIÇÃO)</option>
                </select>
              </div>
            </div>

            {/* Dual Grid: Table & Settings detailed side panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
              
              {/* User Table List */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-550">
                        <th className="py-3 px-4">Utilizador / Organismo</th>
                        <th className="py-3 px-3">Número BI</th>
                        <th className="py-3 px-3">Estado Regulamentar</th>
                        <th className="py-3 px-3">Segurança</th>
                        <th className="py-3 px-4 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {filteredUsers.map((user) => {
                        const isMain = user.id === 'primary-citizen';
                        const isPrimaryInst = user.id === 'institution-1';
                        
                        return (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedAdminUser(user.id)}
                            className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${
                              selectedAdminUser === user.id ? 'bg-indigo-50/60 font-medium' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                  user.type === 'institution' 
                                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                    : 'bg-indigo-50 text-indigo-650 border-indigo-100'
                                }`}>
                                  {user.type === 'institution' ? <Shield size={14} className="stroke-[2.5]" /> : <IdCard size={14} />}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 leading-tight flex items-center gap-1.5 uppercase">
                                    {user.name} 
                                    {isMain && <span className="text-[8px] bg-indigo-100 text-indigo-750 px-1 py-0.5 rounded font-black tracking-widest font-mono">TU</span>}
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                                    {user.type === 'institution' ? 'Agente Público' : 'Cidadão Angola'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 font-mono font-bold text-[11px] text-slate-650 shrink-0">
                              {user.bi}
                            </td>

                            <td className="py-3.5 px-3">
                              {user.verificationStatus === 'Totalmente verificado' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-wider">
                                  <CheckCircle2 size={10} /> Verificado
                                </span>
                              ) : user.verificationStatus === 'Parcialmente verificado' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-wider">
                                  <TrendingUp size={10} /> Parcial
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-650 border border-red-150 text-[9px] font-black uppercase tracking-wider">
                                  <Ban size={10} /> Não Verif.
                                </span>
                              )}
                            </td>

                            {/* Column showing active security triggers indicators in miniature tags */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5">
                                {/* Facial Scan check */}
                                <span title={user.hasFacialAuth ? "Reconhecimento Facial: ATIVO" : "Reconhecimento Facial: INATIVO"} className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  user.hasFacialAuth 
                                    ? 'bg-teal-50 text-teal-600 border-teal-150' 
                                    : 'bg-slate-100 text-slate-300 border-slate-200'
                                }`}>
                                  <Scan size={10} className="stroke-[2.5]" />
                                </span>

                                {/* 2FA Check */}
                                <span title={user.hasTwoFactor ? "Autenticação em Duas Etapas: ATIVA" : "Autenticação em Duas Etapas: INATIVA"} className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  user.hasTwoFactor 
                                    ? 'bg-purple-50 text-purple-650 border-purple-150' 
                                    : 'bg-slate-100 text-slate-300 border-slate-200'
                                }`}>
                                  <Smartphone size={10} className="stroke-[2.5]" />
                                </span>

                                {/* PIN Check */}
                                <span title={user.govPin ? `Código PIN Autenticado: ${user.govPin}` : "PIN: INATIVO"} className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  user.govPin 
                                    ? 'bg-blue-50 text-blue-600 border-blue-150' 
                                    : 'bg-slate-100 text-slate-300 border-slate-200'
                                }`}>
                                  <Key size={10} className="stroke-[2.5]" />
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAdminUser(user.id);
                                }}
                                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-250 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-3xs cursor-pointer transition-colors"
                              >
                                Gerir
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            <span className="text-[10px] font-bold uppercase tracking-wider block">Nenhum resultado para a pesquisa...</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* Detailed management sidebar card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
                {selectedUserObject ? (
                  <div className="space-y-6">
                    {/* Header profile description */}
                    <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white border ${
                        selectedUserObject.type === 'institution' 
                          ? 'bg-amber-600 border-amber-500' 
                          : 'bg-indigo-600 border-indigo-500'
                      }`}>
                        {selectedUserObject.type === 'institution' ? <Shield size={18} /> : <UserCheck size={18} />}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 uppercase text-xs leading-tight">
                          {selectedUserObject.name}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          ID: {selectedUserObject.id} &bull; Registo Ativo
                        </span>
                      </div>
                    </div>

                    {/* SENSITIVE DATA BOX */}
                    <div className="bg-white border border-slate-150 p-3.5 rounded-xl space-y-2.5 text-[11px]">
                      <div className="font-black text-[9px] text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-1 flex items-center justify-between">
                        <span>Ficha Civil Protegida</span>
                        <Lock size={10} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-sans">
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Número de BI</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedUserObject.bi}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Estado Civil</span>
                          <span className="font-bold text-slate-800 uppercase">{selectedUserObject.maritalStatus}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Nascimento</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedUserObject.birthDate}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Contribuinte (NIF)</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedUserObject.nif}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Filiação (Progenitores)</span>
                          <span className="font-bold text-slate-800 uppercase leading-normal">{selectedUserObject.filiation}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Telefone</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedUserObject.phone}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Nº Passaporte</span>
                          <span className="font-bold text-slate-800 font-mono uppercase">{selectedUserObject.passport}</span>
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE CONTROLS FOR SYSTEM PERMISSIONS (Requirement 3) */}
                    <div className="space-y-3.5 border-t border-b border-slate-200/80 py-4">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-800 tracking-widest uppercase font-mono mb-1 flex items-center gap-1.5">
                          <Sliders size={12} className="text-indigo-600" /> Permissões do Sistema
                        </h5>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">Revogue ou autorize trâmites de correio e documentos com efeito imediato.</p>
                      </div>

                      <div className="space-y-2.5 bg-white border border-slate-150 p-3 rounded-xl">
                        {/* Option 1 */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-left text-[11px]">
                            <span className="font-bold text-slate-850 block leading-none">Trâmite de Expedientes</span>
                            <span className="text-[8px] mt-0.5 text-slate-400 font-medium block">Poder de protocolar processos online</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePermission(selectedUserObject.id, 'tramite')}
                            className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-wider cursor-pointer border-0 transition-all ${
                              selectedUserObject.permissions.tramite 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-650 hover:bg-red-100'
                            }`}
                          >
                            {selectedUserObject.permissions.tramite ? 'Autorizado' : 'Suspenso'}
                          </button>
                        </div>

                        {/* Option 2 */}
                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2.5">
                          <div className="text-left text-[11px]">
                            <span className="font-bold text-slate-850 block leading-none">Emissão de Docs Virtuais</span>
                            <span className="text-[8px] mt-0.5 text-slate-400 font-medium block">Poder de requisitar bilhetes e certidões</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePermission(selectedUserObject.id, 'emissao')}
                            className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-wider cursor-pointer border-0 transition-all ${
                              selectedUserObject.permissions.emissao 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-650 hover:bg-red-100'
                            }`}
                          >
                            {selectedUserObject.permissions.emissao ? 'Autorizado' : 'Suspenso'}
                          </button>
                        </div>

                        {/* Option 3 */}
                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2.5">
                          <div className="text-left text-[11px]">
                            <span className="font-bold text-slate-850 block leading-none">Receção de Correspondências</span>
                            <span className="text-[8px] mt-0.5 text-slate-400 font-medium block">Segurança de recepção de cartas fiscais</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePermission(selectedUserObject.id, 'recepcao')}
                            className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-wider cursor-pointer border-0 transition-all ${
                              selectedUserObject.permissions.recepcao 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-650 hover:bg-red-100'
                            }`}
                          >
                            {selectedUserObject.permissions.recepcao ? 'Autorizado' : 'Suspenso'}
                          </button>
                        </div>
                      </div>
                    </div>


                    {/* SECURITY CONTROLS PANEL */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-800 tracking-widest uppercase font-mono mb-1 flex items-center gap-1.5">
                          <ShieldAlert size={12} className="text-rose-500" /> Parâmetros de Segurança Activos
                        </h5>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">Configurações de login duplo, biometria facial e regras civis.</p>
                      </div>

                      <div className="space-y-3 bg-white border border-slate-150 p-3 rounded-xl">
                        {/* Autenticação Facial Switch */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-left">
                            <span className="font-bold text-[11px] text-slate-850 block leading-none">Reconhecimento Facial (Scan)</span>
                            <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Permitir login por selfie fiduciária</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSecurityParamChange(selectedUserObject.id, 'face', !selectedUserObject.hasFacialAuth)}
                            className={`w-10 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer border-0 relative ${
                              selectedUserObject.hasFacialAuth ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          >
                            <span className={`block w-5- h-5.5 w-[22px] h-[22px] bg-white rounded-full transition-transform shadow-xs ${
                              selectedUserObject.hasFacialAuth ? 'translate-x-[14px]' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* 2FA Switch */}
                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
                          <div className="text-left">
                            <span className="font-bold text-[11px] text-slate-850 block leading-none">Autenticação Dupla (SMS/OTP)</span>
                            <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Segurança acrescida via telemóvel</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSecurityParamChange(selectedUserObject.id, '2fa', !selectedUserObject.hasTwoFactor)}
                            className={`w-10 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer border-0 relative ${
                              selectedUserObject.hasTwoFactor ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          >
                            <span className={`block w-[22px] h-[22px] bg-white rounded-full transition-transform shadow-xs ${
                              selectedUserObject.hasTwoFactor ? 'translate-x-[14px]' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* State dropdown selector (Verificado vs Não Verificado) */}
                        <div className="border-t border-slate-100 pt-3 space-y-1.5">
                          <label className="block text-[8px] text-slate-400 font-black uppercase tracking-wider text-left">ESTADO DE VERIFICAÇÃO RECONHECIDO</label>
                          <select
                            value={selectedUserObject.verificationStatus}
                            onChange={(e) => handleSecurityParamChange(selectedUserObject.id, 'verification', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 cursor-pointer rounded-lg px-2 py-1.5 text-[10px] font-black uppercase text-slate-700 outline-none"
                          >
                            <option value="Totalmente verificado">Totalmente Verificado</option>
                            <option value="Parcialmente verificado">Parcialmente Verificado</option>
                            <option value="Não verificado">Não verificado (Suspenso)</option>
                          </select>
                        </div>
                      </div>
                    </div>


                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    <Sliders size={24} className="mx-auto text-slate-300 mb-2" />
                    <span className="text-[10px] font-black tracking-widest uppercase block">Selecione um Utilizador</span>
                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 leading-normal">
                      Ao selecionar, poderá gerir os parâmetros de segurança e as permissões reguladas da conta.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>


          {/* SECTION 2: ANTI-FRAUD CADASTRIAL AUDIT LOG SEARCH AND SELO VERIFICATION (Requirement 2) */}
          <div className="bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                <div>
                  <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                    Auditoria de Alterações Cadastrais e Mitigação de Fraudes
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">
                    Registos selados eletronicamente &bull; Histórico Geral e Imutável de Eventos do Sistema
                  </span>
                </div>
              </div>

              {/* Protocol search query filter */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Pesquisar por Protocolo, Operador ou BI..."
                  value={protocolSearchQuery}
                  onChange={(e) => setProtocolSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 w-full sm:w-[280px]"
                />
              </div>
            </div>

            {/* Logs List with cryptography badges */}
            <div className="space-y-4">
              {filteredProtocols.map((log) => (
                <div key={log.id} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2 text-left">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-750 font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        {log.protocol}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">
                        {log.timestamp}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-650 bg-emerald-50/80 border border-emerald-100 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                        <ShieldCheck size={10} className="text-emerald-500" /> Selado e Imutável
                      </span>
                    </div>

                    <p className="text-xs text-slate-850 font-extrabold uppercase tracking-tight">
                      {log.details}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] text-slate-450 uppercase tracking-wider font-sans font-bold">
                      <span>Operador: <strong className="font-extrabold text-slate-650 font-mono">{log.operator}</strong></span>
                      <span>&bull;</span>
                      <span>Cidadão Alvo: <strong className="font-extrabold text-slate-650 uppercase">{log.citizenName} (BI: {log.bi})</strong></span>
                    </div>
                  </div>

                  {/* Cryptographic Seal Hash Signature certificate display */}
                  <div className="bg-white border border-slate-200/80 p-3 rounded-xl flex items-center gap-3 self-start md:self-auto shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Lock size={14} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-mono font-black uppercase tracking-wider">Assinatura do Selo</span>
                      <span className="font-mono text-[9px] font-black text-slate-700 tracking-wider">
                        {log.signature}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProtocols.length === 0 && (
                <div className="p-8 border border-dashed border-slate-250 rounded-2xl text-center text-slate-450">
                  <AlertTriangle className="mx-auto text-slate-300 mb-2" size={24} />
                  <span className="text-[10px] font-black tracking-widest uppercase block">Nenhum protocolo ou selo localizado</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase leading-normal">Verifique a grafia do código de auditoria digital inserido.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}


      {/* CENTRAL BRANDING STATUS FOOTER */}
      <div className="mt-12 bg-slate-55 border border-slate-150 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <Layers className="text-indigo-650 shrink-0" size={20} />
          <div>
            <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Conexão Unificada de Administração Geral (CDA)
            </h5>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Protocolo de segurança robusto de ponta-a-ponta e distribuição certificada de credenciais governamentais.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-mono text-[9px] font-black text-indigo-750 uppercase tracking-widest">
            Barramento Activo: Central-Admin-Gateway
          </span>
        </div>
      </div>

    </div>
  );
}
