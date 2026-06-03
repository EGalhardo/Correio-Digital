/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  BarChart4, 
  RefreshCcw, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertTriangle,
  Layers,
  Filter,
  Check,
  Building,
  Activity,
  Printer,
  Users,
  Briefcase,
  Layers3,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Correspondence } from '../../types';

interface ReportConfig {
  type: string;
  format: 'pdf' | 'xlsx' | 'csv';
  period: string;
  source: string;
}

interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  period: string;
  generatedBy: string;
  date: string;
  size: string;
}

export interface GovRelatorioContentProps {
  correspondences?: Correspondence[];
  auditLogs?: {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'info' | 'warning' | 'critical' | 'success';
  }[];
}

export function GovRelatorioContent({
  correspondences = [],
  auditLogs = []
}: GovRelatorioContentProps) {
  const [activeTab, setActiveTab] = useState<'instituicoes' | 'usuarios' | 'total'>('instituicoes');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);

  const stats = useMemo(() => {
    const totalCor = correspondences.length;
    const lidasCor = correspondences.filter(c => c.status === 'Lida').length;
    const naoLidasCor = correspondences.filter(c => c.status === 'Não Lida').length;
    const enviadasCor = correspondences.filter(c => c.status === 'Enviada').length;

    const totalAudits = auditLogs.length;
    const faceIdAudits = auditLogs.filter(log => 
      log.action.toLowerCase().includes('facial') || 
      log.action.toLowerCase().includes('biométr') || 
      log.action.toLowerCase().includes('biometria') ||
      log.action.toLowerCase().includes('facescan') ||
      log.action.toLowerCase().includes('face progress')
    ).length;

    // Static base + dynamic size reflecting entries
    const baseExportedBytes = 1.45 * 1024 * 1024; // 1.45 MB
    const dynamicBytes = totalAudits * 12300 + totalCor * 8600; 
    const totalBytesFormatted = ((baseExportedBytes + dynamicBytes) / (1024 * 1024)).toFixed(2) + ' MB';

    return {
      totalCor,
      lidasCor,
      naoLidasCor,
      enviadasCor,
      totalAudits,
      faceIdAudits,
      totalBytesFormatted
    };
  }, [correspondences, auditLogs]);
  
  // Custom Config for Report Generation inside the "Total" tab
  const [config, setConfig] = useState<ReportConfig>({
    type: 'audit_log',
    format: 'pdf',
    period: 'last_30_days',
    source: 'all'
  });

  // Saved reports history
  const [history, setHistory] = useState<GeneratedReport[]>([
    {
      id: 'REP-2026-001',
      title: 'Relatório Consolidado de Interoperabilidade',
      type: 'Interoperabilidade',
      format: 'PDF',
      period: 'Maio 2026',
      generatedBy: 'Edlasio Galhardo',
      date: '28/05/2026',
      size: '2.4 MB'
    },
    {
      id: 'REP-2026-002',
      title: 'Estatísticas de Emissões SME & Bilhetes (BI)',
      type: 'Emissões Oficiais',
      format: 'XLSX',
      period: 'Ano de 2026',
      generatedBy: 'Sistema Autonómio',
      date: '25/05/2026',
      size: '1.8 MB'
    },
    {
      id: 'REP-2026-003',
      title: 'Auditoria Completa de Eventos SOC-SECURE',
      type: 'Segurança Cibernética',
      format: 'PDF',
      period: 'Últimas 24 Horas',
      generatedBy: 'Edlasio Galhardo',
      date: '15/05/2026',
      size: '890 KB'
    },
    {
      id: 'REP-2026-004',
      title: 'Taxas e Arrecadações AGT de Documentação',
      type: 'Taxas / Receita',
      format: 'CSV',
      period: 'Abril 2026',
      generatedBy: 'Kambanza Neto',
      date: '02/05/2026',
      size: '12.1 MB'
    }
  ]);

  // Analytics Sample Data
  const monthlyData = [
    { name: 'Jan', emissões: 1400, auditorias: 240, falhas: 12 },
    { name: 'Fev', emissões: 1800, auditorias: 310, falhas: 18 },
    { name: 'Mar', emissões: 2300, auditorias: 400, falhas: 8 },
    { name: 'Abr', emissões: 2100, auditorias: 380, falhas: 15 },
    { name: 'Mai', emissões: 2900, auditorias: 520, falhas: 5 },
    { name: 'Jun', emissões: 3400, auditorias: 610, falhas: 3 },
  ];

  const sourceData = [
    { name: 'SME (Passaportes)', valor: 1200 },
    { name: 'AGT (NIF)', valor: 1850 },
    { name: 'Min. Justiça (BI)', valor: 2600 },
    { name: 'PNA (Multas)', valor: 850 },
    { name: 'Min. Saúde', valor: 450 },
  ];

  const triggerGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setProgress(0);
    setSuccessMsg(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Build title
            let title = 'Relatório de ';
            if (config.type === 'audit_log') title += 'Logs de Auditoria ';
            else if (config.type === 'emissions') title += 'Emissão de Documentos ';
            else if (config.type === 'revenue') title += 'Receitas & Taxas ';
            else title += 'Desempenho da Rede Interoperável ';

            if (config.period === 'today') title += '(Hoje)';
            else if (config.period === 'last_7_days') title += '(Últimos 7 dias)';
            else title += '(Últimos 30 dias)';

            const newRep: GeneratedReport = {
              id: `REP-2026-0${history.length + 1}`,
              title,
              type: config.type === 'audit_log' ? 'Auditoria' : config.type === 'emissions' ? 'Emissões' : 'Geral',
              format: config.format.toUpperCase() as 'PDF' | 'XLSX' | 'CSV',
              period: config.period === 'today' ? 'Hoje' : config.period === 'last_7_days' ? 'Últimos 7 dias' : 'Últimos 30 dias',
              generatedBy: 'Edlasio Galhardo',
              date: new Date().toLocaleDateString('pt-AO'),
              size: config.format === 'pdf' ? '1.2 MB' : config.format === 'xlsx' ? '650 KB' : '150 KB'
            };

            setHistory(prev => [newRep, ...prev]);
            setIsGenerating(false);
            setSuccessMsg(true);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="pb-24 text-left animate-fadeIn">
      {/* Banner Header - Redesigned to White Background, Gray Border & Adapted Text Colors */}
      <div className="p-8 md:p-10 rounded-[32px] bg-white border border-slate-200 relative overflow-hidden mb-8 shadow-xs">
        {/* Subtle Decorative Background Wave for design polish */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-750">
              <BarChart4 size={16} />
            </div>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-indigo-650">
              MINDIS &bull; Centro de Telemetria Geral
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-slate-950">
            Relatórios Estratégicos
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-3 leading-relaxed">
            Monitorização em tempo real de emissões, fluxos de autenticação, acessos do cidadão e performance geral do ecossistema do Estado de Angola.
          </p>
        </div>
      </div>

      {/* Tabs Navigation - Updated options to 'Instituições', 'Usuários', and 'Total' */}
      <div className="flex border-b border-slate-200 mb-8 max-w-lg">
        <button
          onClick={() => {
            setActiveTab('instituicoes');
            setSuccessMsg(false);
          }}
          className={`pb-3 px-4 font-black text-xs uppercase tracking-wider relative cursor-pointer border-0 transition-all ${
            activeTab === 'instituicoes' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Instituições
          {activeTab === 'instituicoes' && (
            <motion.div layoutId="rel_bar" className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('usuarios');
            setSuccessMsg(false);
          }}
          className={`pb-3 px-4 font-black text-xs uppercase tracking-wider relative cursor-pointer border-0 transition-all ${
            activeTab === 'usuarios' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Usuários
          {activeTab === 'usuarios' && (
            <motion.div layoutId="rel_bar" className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('total');
            setSuccessMsg(false);
          }}
          className={`pb-3 px-4 font-black text-xs uppercase tracking-wider relative cursor-pointer border-0 transition-all ${
            activeTab === 'total' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Total
          {activeTab === 'total' && (
            <motion.div layoutId="rel_bar" className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Tab Area Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'instituicoes' && (
          <motion.div
            key="instituicoes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Cards Grid specific to Institutions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0">
                  <Building size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Órgãos Interligados</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">5 Ministérios</p>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp size={10} /> Canal Operacional Ativo
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">APIs Desportadas</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">24 Endpoints</p>
                  <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5 mt-0.5">
                    Interoperabilidade instantatória
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">SLA Médio dos Canais</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">99.98%</p>
                  <span className="text-[9px] text-emerald-600 font-bold mt-0.5 block">Disponibilidade Excelente</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Requisições Governamentais</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">435 / min</p>
                  <span className="text-[9px] text-amber-600 font-bold mt-0.5 block">Taxa de carga moderada</span>
                </div>
              </div>
            </div>

            {/* Charts representation for Institutions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Bar Chart for Source/Ministry Distribution */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] p-6 shadow-3xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-sans font-black text-sm text-slate-950 uppercase tracking-tight">Consumo de APIs Interoperáveis por Órgão</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">Métricas de tráfego recolhido no barramento central de comunicação</span>
                  </div>
                  <Building size={16} className="text-indigo-650" />
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Acessos Registados" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* General Health and Protocol Checklist */}
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-3xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-sans font-black text-sm text-slate-950 uppercase tracking-tight">Estado de Ligação</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">Status das pontes aduaneira e civil</span>
                  </div>
                  <Activity size={16} className="text-emerald-500" />
                </div>

                <div className="space-y-4 my-auto">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-black uppercase text-slate-700">AGT (Serviço Fiscal)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">ATIVO</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-black uppercase text-slate-700">SME (Migração/Passaportes)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">ATIVO</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-black uppercase text-slate-700">MINJUS (Registo Civil)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">ATIVO</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-black uppercase text-slate-700">PNA (Portal de Trânsito)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-150">MANUTENÇÃO</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase">Última Auditoria: Há 26 minutos</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Layers size={14} className="text-indigo-600" /> Resumo Estrutural Tecnológico
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                O ecossistema institucional apresenta comunicações altamente integradas. O Ministério da Justiça e dos Direitos Humanos representa a maior base de consultas (<strong className="text-slate-900">2,600 acessos mensais</strong> devido às verificações estruturais de Bilhete de Identidade), seguido de perto pelas validações eletrónicas de NIF providas pela Administração Geral Tributária (AGT). O tempo de ping entre os datacenters de Luanda permanece estável com zero falhas críticas registadas.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'usuarios' && (
          <motion.div
            key="usuarios"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Cards Grid specific to Users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Acessos de Cidadãos</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">13,900</p>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp size={10} /> +12% este mês
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Latência de Consulta</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">1.2 segundos</p>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    Estabilidade de Rede
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <FileCheck size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Emissões Certificadas</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">{(4310 + stats.totalCor).toLocaleString('pt-AO')} Unids</p>
                  <span className="text-[9px] text-indigo-600 font-bold mt-0.5 block">Documentos Digitais & Expedientes</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-3xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Avisos de Segurança</span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter mt-0.5">
                    {auditLogs.filter(l => l.type === 'critical').length} Ativos
                  </p>
                  <span className={`text-[9px] font-bold mt-0.5 block ${
                    auditLogs.filter(l => l.type === 'critical').length > 0 ? 'text-red-600 font-black' : 'text-emerald-600'
                  }`}>
                    {auditLogs.some(l => l.action.includes('SOC-AN-2026')) ? 'ALERTA SOC-AN ATIVO' : 'Integridade total'}
                  </span>
                </div>
              </div>
            </div>

            {/* Area Chart mapping Citizen interaction */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-3xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-sans font-black text-sm text-slate-950 uppercase tracking-tight">Evolução Mensal de Interações (Cidadão Digital)</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">Quantidade consolidada de emissões oficiais contra acessos globais de conformidade</span>
                </div>
                <Users size={16} className="text-indigo-600" />
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEmit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="emissões" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorEmit)" name="Emissão de Documentos" />
                    <Area type="monotone" dataKey="auditorias" stroke="#0891b2" strokeWidth={2} fillOpacity={0} name="Acessos do Usuário" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Explanatory text block for Users tab */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Users size={14} className="text-indigo-600" /> Atividade e Tráfego do Cidadão
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                O tráfego de cidadãos alcançou um pico histórico no mês de Junho. A plataforma registrou mais de <strong className="text-slate-900">3,400 emissões de chancelarias públicas</strong>, com a maioria delas originadas em Luanda, Benguela, e Huambo. O canal "Correio Digital de Angola" garantiu o recebimento seguro de notificações governamentais com uma incrível taxa de visualização de 85% nas primeiras duas horas após envio institucional.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'total' && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Grid with Form to generate AND metadata summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Column - Generate New Report */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-6 shadow-3xs text-left">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-sans font-black text-lg text-slate-950 uppercase tracking-tight flex items-center gap-2">
                    <Filter size={18} className="text-indigo-600" /> Parâmetros de Filtro do Relatório
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase font-mono tracking-wider mt-0.5">Customize o âmbito dos dados extraídos do sistema</p>
                </div>

                <form onSubmit={triggerGenerate} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Report Type */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Tipo de Relatório</label>
                      <select
                        value={config.type}
                        onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all"
                      >
                        <option value="audit_log">Logs de Auditoria de Acesso (SME/AGT/MinJus)</option>
                        <option value="emissions">Taxas de Emissão de Documentação Oficial</option>
                        <option value="revenue">Análise Financeira e Arrecadação AGT</option>
                        <option value="sla">Relatório Geral SLA / Uptime Tecnológico</option>
                      </select>
                    </div>

                    {/* Format */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Formato de Exportação</label>
                      <select
                        value={config.format}
                        onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as 'pdf' | 'xlsx' | 'csv' }))}
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all"
                      >
                        <option value="pdf">Documento Seguro PDF (.pdf)</option>
                        <option value="xlsx">Planilha Consolidada Excel (.xlsx)</option>
                        <option value="csv">Valores Separados por Vírgulas (.csv)</option>
                      </select>
                    </div>

                    {/* Period selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Período Fiscal / de Tempo</label>
                      <select
                        value={config.period}
                        onChange={(e) => setConfig(prev => ({ ...prev, period: e.target.value }))}
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all"
                      >
                        <option value="today">Hoje (últimas horas)</option>
                        <option value="last_7_days">Últimos 7 dias</option>
                        <option value="last_30_days">Últimos 30 dias</option>
                        <option value="annual">Ano Corrente (2026)</option>
                      </select>
                    </div>

                    {/* Institution/Source Filter */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Fonte Governamental</label>
                      <select
                        value={config.source}
                        onChange={(e) => setConfig(prev => ({ ...prev, source: e.target.value }))}
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all"
                      >
                        <option value="all">Todas as Fontes Conectadas</option>
                        <option value="agt">AGT - Administracão Geral Tributária</option>
                        <option value="sme">SME - Serviço de Migração e Estrangeiros</option>
                        <option value="minjus">Ministério da Justiça e Direitos Humanos</option>
                        <option value="pna">Polícia Nacional de Angola</option>
                      </select>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-2">
                            <RefreshCcw className="animate-spin text-indigo-600" size={12} />
                            Compilando e Processando Registos...
                          </span>
                          <span className="text-xs font-mono font-black text-indigo-700">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border">
                          <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeInOut" }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-[11px] font-semibold"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="uppercase font-black text-emerald-900 tracking-wider">Sucesso! Relatório Gerado com Sucesso</p>
                          <p className="text-[10px] font-medium text-emerald-700 font-sans mt-0.5">O novo relatório consolidado foi adicionado com êxito à grelha de histórico.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Telemetria de Estado Reativo Atual (Dynamic Counters Panel) */}
                  <div className="bg-slate-50 border border-slate-205 rounded-[24px] p-5 my-3 text-left">
                    <h4 className="font-sans font-black text-[10px] text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Activity size={12} className="animate-pulse" /> Telemetria em Tempo Real (Estado Reativo Central)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Total de Ofícios</span>
                        <span className="text-sm font-mono font-black text-slate-900 block mt-0.5">{stats.totalCor}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Não Lidas (Pedentes)</span>
                        <span className="text-sm font-mono font-black text-amber-600 block mt-0.5">{stats.naoLidasCor}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Auditorias Biométricas</span>
                        <span className="text-sm font-mono font-black text-sky-650 block mt-0.5">{stats.faceIdAudits}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block font-sans">Volume de Dados</span>
                        <span className="text-sm font-mono font-black text-indigo-650 block mt-0.5">{stats.totalBytesFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-6 py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      <Printer size={14} />
                      <span>Iniciar Geração de Relatório</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Info Sidebar Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-6 text-left flex flex-col justify-between">
                <div>
                  <h4 className="font-sans font-black text-sm text-slate-900 uppercase tracking-tight mb-3">Auditoria Permanente</h4>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
                    Como Administrador Central, as ações de emissão ou geração de arquivos de telemetria geral são permanentemente registadas em logs criptográficos à prova de adulteração do Estado de Angola.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 mt-0.5 shrink-0">1</span>
                      <p className="text-[11px] text-slate-500 font-medium">Os PDFs gerados incluem chancela eletrónica governamental.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 mt-0.5 shrink-0">2</span>
                      <p className="text-[11px] text-slate-500 font-medium">A exportação em Excel permite análise por colunas.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 mt-0.5 shrink-0">3</span>
                      <p className="text-[11px] text-slate-500 font-medium font-sans">Todos os downloads são salvos em base local segura.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 mt-6 md:mt-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">ID Operador</span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 block bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 mt-1">
                    CDA-ADMIN-AUTH-77X-9233
                  </span>
                </div>
              </div>
            </div>

            {/* Historical report list of total compiled files - Beautiful modular cards */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-3xs text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-sans font-black text-sm text-slate-900 uppercase tracking-tight">Ficheiros de Relatório Consolidado Disponíveis</h3>
                <span className="font-mono text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  {history.length} Ficheiros Locais
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((rep) => (
                  <div 
                    key={rep.id}
                    className="bg-white border border-slate-205 rounded-[28px] p-5 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Title & Format Badge */}
                      <div className="flex justify-between items-start gap-2.5">
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-display font-medium text-slate-900 text-xs sm:text-sm leading-tight block truncate uppercase">{rep.title}</span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 block mt-0.5">UUID: {rep.id.toUpperCase()}</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border shrink-0 select-none ${
                          rep.format === 'PDF' ? 'bg-red-50 text-red-750 border-red-150' : 
                          rep.format === 'XLSX' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' : 
                          'bg-amber-50 text-amber-800 border-amber-150'
                        }`}>
                          {rep.format}
                        </span>
                      </div>

                      {/* Info Details Row */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-[10.5px] font-bold text-slate-600">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-display">Tipo Relatório</span>
                          <span className="text-indigo-650 block truncate mt-0.5">{rep.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-display">Período Analisado</span>
                          <span className="text-slate-800 block truncate mt-0.5">{rep.period}</span>
                        </div>
                      </div>

                      {/* Footer Row: Meta values */}
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                        <span>DATA: {rep.date}</span>
                        <span>TAMANHO: {rep.size}</span>
                      </div>
                    </div>

                    {/* Action trigger */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                        }}
                        className="w-full py-1.5 px-3 border border-slate-205 hover:border-slate-405 bg-white text-slate-650 hover:text-slate-950 rounded-xl text-[9.5px] font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                        title="Visualizar Relatório de Auditoria"
                      >
                        <Download size={12} /> Visualizar &amp; Descarregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Dynamic Certified Report Modal (Impressão da Chancelaria) */}
      <AnimatePresence>
        {selectedReport && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-slate-900 z-[500]"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed top-1/2 left-1/2 w-[95%] max-w-4xl bg-white rounded-[32px] shadow-3xl z-[501] overflow-hidden max-h-[85vh] flex flex-col font-sans"
            >
              {/* Header */}
              <div className="bg-slate-900 border-b border-slate-805 p-6 md:p-8 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 text-indigo-400">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">Chancelaria Pública • Previsão Consolidada</span>
                    <h4 className="text-sm md:text-base font-black italic uppercase tracking-tight leading-none mt-1">{selectedReport.title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0 text-white flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Printable Body Area */}
              <div className="p-8 md:p-10 space-y-6 overflow-y-auto flex-1 bg-slate-50 text-slate-800 text-left">
                {/* Government Header */}
                <div className="text-center space-y-2 mb-6">
                  <div className="w-14 h-14 mx-auto mb-2 select-none opacity-90">
                    <img referrerPolicy="no-referrer" src="https://i.postimg.cc/Rq5TKbdk/Correio-Digital-Angola.png" alt="Emblema de Angola" className="w-full mix-blend-multiply" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 leading-none">REPÚBLICA DE ANGOLA</h3>
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">MINISTÉRIO DAS TELECOMUNICAÇÕES, TECNOLOGIAS DE INFORMAÇÃO E COMUNICAÇÃO SOCIAL</h4>
                  <div className="h-[2px] w-24 bg-gradient-to-r from-red-600 to-amber-500 mx-auto" />
                </div>

                {/* Report Meta Info Table */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-xs font-bold">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">UUID do Ficheiro</span>
                    <span className="text-slate-800 block font-mono mt-0.5">{selectedReport.id}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Tipo do Relatório</span>
                    <span className="text-slate-850 block mt-0.5">{selectedReport.type}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Data da Geração</span>
                    <span className="text-slate-850 block mt-0.5">{selectedReport.date}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Responsável Técnico</span>
                    <span className="text-slate-850 block mt-0.5">{selectedReport.generatedBy}</span>
                  </div>
                </div>

                {/* Dynamic List Rendering */}
                <div className="space-y-3">
                  <h5 className="font-sans font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <Activity size={12} className="text-indigo-600 animate-pulse" /> Rastreio de Registos Reativos (Fonte Segura)
                  </h5>

                  {selectedReport.type === 'Auditoria' || selectedReport.title.toLowerCase().includes('auditoria') || selectedReport.title.toLowerCase().includes('segurança') ? (
                    <div className="border border-slate-205 rounded-[20px] overflow-hidden bg-white shadow-3xs max-h-60 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider sticky top-0">
                            <th className="py-3 px-4">Timestamp</th>
                            <th className="py-3 px-4">Utilizador / Operador</th>
                            <th className="py-3 px-4">Acção Registada</th>
                            <th className="py-3 px-4 text-center">Nível</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-4 font-mono text-[9.5px] text-slate-400">{log.timestamp}</td>
                              <td className="py-3 px-4 font-black text-slate-900">{log.user}</td>
                              <td className="py-3 px-4">{log.action}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                                  log.type === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                                  log.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                                  log.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
                                  'bg-blue-50 text-blue-800 border-blue-200'
                                }`}>
                                  {log.type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-slate-205 rounded-[20px] overflow-hidden bg-white shadow-3xs max-h-60 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider sticky top-0">
                            <th className="py-3 px-4">Ofício ID</th>
                            <th className="py-3 px-4">Órgão Emissor</th>
                            <th className="py-3 px-4">Cidadão de Destino</th>
                            <th className="py-3 px-4">Assunto Expediente</th>
                            <th className="py-3 px-4 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {correspondences.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-4 font-mono font-black text-indigo-700">{c.id}</td>
                              <td className="py-3 px-4 font-black text-slate-905">{c.sender}</td>
                              <td className="py-3 px-4 font-medium">{c.recipient}</td>
                              <td className="py-3 px-4 truncate max-w-[200px]" title={c.subject}>{c.subject}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                  c.status === 'Lida' ? 'bg-emerald-50 text-emerald-800 border-emerald-20 border-emerald-200' : 
                                  c.status === 'Não Lida' ? 'bg-amber-50 text-amber-805 border-amber-200' : 
                                  'bg-blue-50 text-blue-850 border-blue-250'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Certifications footer */}
                  <div className="bg-white border p-4 rounded-xl mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-slate-400 font-bold text-[8.5px] leading-tight select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 block shrink-0">✓</span>
                      <span>ASSINADO ELECTRONICAMENTE VIA CHAVE INTEGRADO DE SEGURANÇA SECTORIAL DO ESTADO</span>
                    </div>
                    <span>CÓDIGO PROTOCOLO: SHA256-EMERGENCIA-SECURE-STRICT-2026</span>
                  </div>
                </div>
              </div>

              {/* Action columns */}
              <div className="bg-slate-100 border-t p-6 flex justify-end gap-3 rounded-b-[32px] shrink-0">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2.5 bg-white border hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Fechar Visualização
                </button>
                <button
                  onClick={() => {
                    alert(`Descarregando ficheiro oficial compilado ${selectedReport.id} (${selectedReport.format})...`);
                    window.print();
                  }}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={12} /> Imprimir / PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
