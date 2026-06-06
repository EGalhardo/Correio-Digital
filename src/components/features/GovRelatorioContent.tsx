/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Calendar,
  ChevronDown,
  Check,
  Briefcase,
  Users,
  Building2,
  Lock,
  Globe,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Correspondence } from '../../types';

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
  // State for interactive configurations
  const [selectedDate, setSelectedDate] = useState('2026-05-03');
  const [selectedType, setSelectedType] = useState<'usuarios' | 'instituicoes' | 'financeiro_caixa'>('usuarios');
  const [chartTab, setChartTab] = useState<'provincia' | 'meses'>('provincia');
  const [exporting, setExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Multiplier or modifier based on selected report types to show fully-reactive updates
  const multiplier = useMemo(() => {
    switch (selectedType) {
      case 'usuarios': return 1.25;
      case 'instituicoes': return 0.95;
      case 'financeiro_caixa': return 1.0;
      default: return 1.0;
    }
  }, [selectedType]);

  // Dynamic KPI stats based on selection
  const kpis = useMemo(() => {
    if (selectedType === 'usuarios') {
      return {
        c1_title: "Usuários Totais",
        c1_val: (12500 * multiplier).toLocaleString('pt-AO', { maximumFractionDigits: 0 }),
        c1_badge: "+14.2% ao mês",
        c1_color: "text-[#00A859]",
        c1_bgColor: "bg-emerald-50 border-emerald-100 text-[#00A859]",
        c1_icon: <Users size={18} />,

        c2_title: "Novos Cadastros",
        c2_val: (3200 * multiplier).toLocaleString('pt-AO', { maximumFractionDigits: 0 }),
        c2_badge: "+8.4% Meta",
        c2_color: "text-blue-600",
        c2_bgColor: "bg-blue-50 border-blue-100 text-blue-600",
        c2_icon: <TrendingUp size={18} />,

        c3_title: "Acessos Diários",
        c3_val: (9300 * multiplier).toLocaleString('pt-AO', { maximumFractionDigits: 0 }),
        c3_badge: "Altamente Ativos",
        c3_color: "text-indigo-600",
        c3_bgColor: "bg-indigo-50 border-indigo-100 text-indigo-500",
        c3_icon: <Globe size={18} />,

        c4_title: "Envios por Usuário",
        c4_val: Math.round(15 * multiplier),
        c4_type: "Média Semanal"
      };
    } else if (selectedType === 'instituicoes') {
      return {
        c1_title: "Instituições Integradas",
        c1_val: Math.round(1250 * multiplier).toLocaleString('pt-AO'),
        c1_badge: "+5.1% ao ano",
        c1_color: "text-blue-600",
        c1_bgColor: "bg-blue-50 border-blue-100 text-blue-600",
        c1_icon: <Building2 size={18} />,

        c2_title: "Governos Locais",
        c2_val: Math.round(320 * multiplier).toLocaleString('pt-AO'),
        c2_badge: "Interligação Total",
        c2_color: "text-orange-600",
        c2_bgColor: "bg-orange-50 border-orange-100 text-orange-600",
        c2_icon: <Globe size={18} />,

        c3_title: "Canais API Ativos",
        c3_val: Math.round(930 * multiplier).toLocaleString('pt-AO'),
        c3_badge: "Protocolos Activos",
        c3_color: "text-emerald-600",
        c3_bgColor: "bg-emerald-50 border-emerald-100 text-[#00A859]",
        c3_icon: <LinkIcon size={18} />,

        c4_title: "Ofícios Chancelados",
        c4_val: Math.round(1523 * multiplier * 10),
        c4_type: "Volume Mensal"
      };
    } else {
      // financeiro_caixa (Matches the original visual exactly)
      return {
        c1_title: "Receitas",
        c1_val: `Kz ${(12500 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
        c1_badge: "Verificado",
        c1_color: "text-[#00A859]",
        c1_bgColor: "bg-emerald-50 border-emerald-100 text-[#00A859]",
        c1_icon: <TrendingUp size={18} />,

        c2_title: "Despesas",
        c2_val: `Kz ${(3200 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
        c2_badge: "Custo Operacional",
        c2_color: "text-rose-600",
        c2_bgColor: "bg-rose-50 border-rose-100 text-rose-500",
        c2_icon: <ArrowDownRight size={18} />,

        c3_title: "Saldo",
        c3_val: `Kz ${(9300 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
        c3_badge: "Liquidez chancelada",
        c3_color: "text-blue-600",
        c3_bgColor: "bg-blue-50 border-blue-100 text-blue-600",
        c3_icon: <span className="font-mono font-bold text-xs">Kz</span>,

        c4_title: "Transações",
        c4_val: `Kz ${Math.round(15 * multiplier)}`,
        c4_type: "Total Diário"
      };
    }
  }, [selectedType, multiplier]);

  // Main Bar Chart monthly or province dataset (side-by-side)
  const chartData = useMemo(() => {
    if (chartTab === 'provincia') {
      // By Province (Luanda, Benguela, Huambo, Huíla, Cabinda, Uíge)
      if (selectedType === 'usuarios') {
        return [
          { name: 'Luanda', Entradas: 25000, Saidas: 11000 },
          { name: 'Benguela', Entradas: 18000, Saidas: 8500 },
          { name: 'Huambo', Entradas: 21000, Saidas: 9000 },
          { name: 'Huíla', Entradas: 19500, Saidas: 8100 },
          { name: 'Cabinda', Entradas: 16000, Saidas: 7500 },
          { name: 'Uíge', Entradas: 12000, Saidas: 5000 },
        ];
      } else if (selectedType === 'instituicoes') {
        return [
          { name: 'Luanda', Entradas: 450, Saidas: 180 },
          { name: 'Benguela', Entradas: 320, Saidas: 140 },
          { name: 'Huambo', Entradas: 380, Saidas: 160 },
          { name: 'Huíla', Entradas: 310, Saidas: 110 },
          { name: 'Cabinda', Entradas: 250, Saidas: 90 },
          { name: 'Uíge', Entradas: 190, Saidas: 70 },
        ];
      } else {
        return [
          { name: 'Luanda', Entradas: 19000 * multiplier, Saidas: 9000 * multiplier },
          { name: 'Benguela', Entradas: 14000 * multiplier, Saidas: 7500 * multiplier },
          { name: 'Huambo', Entradas: 16500 * multiplier, Saidas: 8000 * multiplier },
          { name: 'Huíla', Entradas: 12500 * multiplier, Saidas: 6100 * multiplier },
          { name: 'Cabinda', Entradas: 11000 * multiplier, Saidas: 5500 * multiplier },
          { name: 'Uíge', Entradas: 8500 * multiplier, Saidas: 4000 * multiplier },
        ];
      }
    } else {
      // Evolution level of use by Months (Jan, Fev, Mar, Abr, Mai, Jun)
      if (selectedType === 'usuarios') {
        return [
          { name: 'Jan', Entradas: 15000, Saidas: 8000 },
          { name: 'Fev', Entradas: 18000, Saidas: 9500 },
          { name: 'Mar', Entradas: 22000, Saidas: 11000 },
          { name: 'Abr', Entradas: 19000, Saidas: 8500 },
          { name: 'Mai', Entradas: 25000, Saidas: 12100 },
          { name: 'Jun', Entradas: 28000, Saidas: 13500 },
        ];
      } else if (selectedType === 'instituicoes') {
        return [
          { name: 'Jan', Entradas: 210, Saidas: 90 },
          { name: 'Fev', Entradas: 260, Saidas: 120 },
          { name: 'Mar', Entradas: 310, Saidas: 155 },
          { name: 'Abr', Entradas: 280, Saidas: 130 },
          { name: 'Mai', Entradas: 390, Saidas: 170 },
          { name: 'Jun', Entradas: 480, Saidas: 220 },
        ];
      } else {
        return [
          { name: 'Jan', Entradas: 15000 * multiplier, Saidas: 8000 * multiplier },
          { name: 'Fev', Entradas: 18000 * multiplier, Saidas: 9550 * multiplier },
          { name: 'Mar', Entradas: 22000 * multiplier, Saidas: 11000 * multiplier },
          { name: 'Abr', Entradas: 19000 * multiplier, Saidas: 8500 * multiplier },
          { name: 'Mai', Entradas: 25000 * multiplier, Saidas: 12100 * multiplier },
          { name: 'Jun', Entradas: 28000 * multiplier, Saidas: 13500 * multiplier },
        ];
      }
    }
  }, [selectedType, chartTab, multiplier]);

  // Simulated export action
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setShowToast(true);
      
      try {
        const csvRows = [
          ["ID do Relatorio", "Tipo de Servico", "Data de Emissao", "KPI 1", "KPI 2", "KPI 3", "KPI 4"],
          [`REP-2026-${selectedType.toUpperCase()}`, selectedType, selectedDate, kpis.c1_val, kpis.c2_val, kpis.c3_val, kpis.c4_val]
        ];
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(";")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Relatorio_${selectedType}_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  // Helper component to avoid raw icon references
  function LinkIcon(props: React.ComponentProps<typeof Globe>) {
    return <Globe {...props} />;
  }

  return (
    <div className="pb-24 text-left animate-fadeIn space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Dynamic Toast feedback */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00A859] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 font-sans font-bold text-xs uppercase tracking-wider"
          >
            <Check size={16} />
            <span>Relatório Exportado com Sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Layout Block (Matches Top Header Row of the Image) */}
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main Title on Left */}
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-sans">
                {selectedType === 'usuarios' ? 'Painel de Adesão de Usuários' : selectedType === 'instituicoes' ? 'Painel de Interconexão Institucional' : 'Relatórios Financeiros'}
              </h1>
            </div>
          </div>

          {/* Date Picker + Export Button Group on Right */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 font-sans">
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs font-bold shadow-3xs cursor-pointer focus-within:border-blue-500 transition-colors">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-0 outline-none text-slate-700 font-bold focus:ring-0 w-28 text-right pr-1 cursor-pointer"
              />
              <Calendar size={14} className="text-slate-400 ml-1.5 pointer-events-none" />
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className={`flex items-center gap-1.5 px-4 h-9.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-3xs hover:shadow-xs active:scale-95 disabled:opacity-75 cursor-pointer`}
            >
              <Download size={14} className={exporting ? 'animate-bounce' : ''} />
              <span>{exporting ? 'Exportando' : 'Exportar'}</span>
            </button>
          </div>
        </div>

        {/* Gray separator line */}
        <div className="h-[1px] bg-slate-100" />

        {/* Dropdown containing "Usuarios", "Instituicoes" and "Financeiro" */}
        <div className="relative inline-block w-full font-sans">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-700 text-xs sm:text-sm font-black uppercase tracking-wide cursor-pointer focus:border-blue-500 hover:bg-slate-100/60 outline-none transition-all appearance-none"
          >
            <option value="usuarios">👥 Relatório Demográfico & Atividade de Usuários (Angola)</option>
            <option value="instituicoes">🏢 Relatório de Integração de Organismos & Instituições</option>
            <option value="financeiro_caixa">💵 Relatório Financeiro Geral & Fluxo de Caixa (Correio Digital)</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards Row (Grid of 4 beautifully designed indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/80 rounded-[22px] p-5 shadow-3xs flex justify-between items-center bg-gradient-to-br from-white to-slate-50/20">
          <div>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 font-sans">{kpis.c1_title}</span>
            <p className={`text-xl md:text-2xl font-black ${kpis.c1_color} font-mono tracking-tight mt-1.5`}>
              {kpis.c1_val}
            </p>
          </div>
          <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 border ${kpis.c1_bgColor}`}>
            {kpis.c1_icon}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/80 rounded-[22px] p-5 shadow-3xs flex justify-between items-center bg-gradient-to-br from-white to-slate-50/20">
          <div>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 font-sans">{kpis.c2_title}</span>
            <p className={`text-xl md:text-2xl font-black ${kpis.c2_color} font-mono tracking-tight mt-1.5`}>
              {kpis.c2_val}
            </p>
          </div>
          <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 border ${kpis.c2_bgColor}`}>
            {kpis.c2_icon}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/80 rounded-[22px] p-5 shadow-3xs flex justify-between items-center bg-gradient-to-br from-white to-slate-50/20">
          <div>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 font-sans">{kpis.c3_title}</span>
            <p className={`text-xl md:text-2xl font-black ${kpis.c3_color} font-mono tracking-tight mt-1.5`}>
              {kpis.c3_val}
            </p>
          </div>
          <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 border ${kpis.c3_bgColor}`}>
            {kpis.c3_icon}
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/80 rounded-[22px] p-5 shadow-3xs flex justify-between items-center bg-gradient-to-br from-white to-slate-50/20">
          <div>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 font-sans">{kpis.c4_title}</span>
            <p className="text-xl md:text-2xl font-black text-slate-800 font-mono tracking-tight mt-1.5">
              {kpis.c4_val}
            </p>
          </div>
          <div className="w-[42px] h-[42px] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <FileText size={18} />
          </div>
        </div>

      </div>

      {/* 3. Main Chart Card Layout (Análise do Período - Barras por províncias ou meses) */}
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs">
        
        {/* Toggle with beautiful tabs built inside the top header of the chart */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <h3 className="font-sans font-black text-xs sm:text-sm text-slate-800 uppercase tracking-tight">
              {selectedType === 'usuarios' 
                ? `Adesão de Usuários - ${chartTab === 'provincia' ? 'Distribuição por Província' : 'Nível de Uso por Meses'}` 
                : selectedType === 'instituicoes' 
                ? `Atividade Institucional - ${chartTab === 'provincia' ? 'Instituições por Província' : 'Volume Digital por Meses'}` 
                : `Fluxo de Caixa - ${chartTab === 'provincia' ? 'Movimentos por Província' : 'Resultados Mensais'}`}
            </h3>
          </div>

          {/* Interactive Toggle Pill on the Chart Card */}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl shrink-0 self-start sm:self-auto font-sans">
            <button
              onClick={() => setChartTab('provincia')}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${chartTab === 'provincia' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Por Província
            </button>
            <button
              onClick={() => setChartTab('meses')}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${chartTab === 'meses' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Nível Mensal
            </button>
          </div>
        </div>

        {/* Dual Bar Chart side-by-side using recharts */}
        <div className="h-[280px] sm:h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                labelClassName="font-bold text-slate-800"
              />
              <Bar 
                dataKey="Entradas" 
                fill="#00A859" 
                radius={[4, 4, 0, 0]} 
                name={selectedType === 'usuarios' ? 'Total (Ativos)' : selectedType === 'instituicoes' ? 'Total (Integrados)' : 'Entradas (Faturamento)'} 
              />
              <Bar 
                dataKey="Saidas" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                name={selectedType === 'usuarios' ? 'Inactivos / Pendentes' : selectedType === 'instituicoes' ? 'Inactivos / Pendentes' : 'Saídas (Custos)'} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Column Lists Layout (Reactive Content based on selected main dropdown) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column Box */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <ArrowUpRight size={18} className="text-[#00A859]" />
            <h3 className="font-sans font-black text-sm text-[#00A859] uppercase tracking-wider">
              {selectedType === 'usuarios' ? 'Canais Mais Populares de Registo' : selectedType === 'instituicoes' ? 'Órgãos de Administração Central' : 'Entradas principais'}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedType === 'usuarios' ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Adesão por Chave BI Digital</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Sincronização Integrada</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      {Math.round(7892 * multiplier).toLocaleString('pt-AO')} Users
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                      Nacional
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Criação Presencial BUAP / GAE</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Balcão de Atendimento</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      {Math.round(3714 * multiplier).toLocaleString('pt-AO')} Users
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                      Físico
                    </span>
                  </div>
                </div>
              </>
            ) : selectedType === 'instituicoes' ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Ministérios e Secretarias de Estado</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Interconexão via Chancelaria</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      {Math.round(410 * multiplier).toLocaleString('pt-AO')} Órgãos
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                      Ativo
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Bancos e Entidades Financeiras</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">API de Validação e Custódia</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      {Math.round(180 * multiplier).toLocaleString('pt-AO')} Entidades
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                      VIP API
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/40 transition-colors">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Venda de Produtos</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">14:30</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      Kz {(7892 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-[#00A859] font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                      Vendas
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/40 transition-colors">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Prestação de Serviços</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">10:15</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      Kz {(3714 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-[#00A859] font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                      Serviços
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column Box */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <ArrowDownRight size={18} className="text-rose-600" />
            <h3 className="font-sans font-black text-sm text-rose-600 uppercase tracking-wider">
              {selectedType === 'usuarios' ? 'Problemas ou Bounces Registados' : selectedType === 'instituicoes' ? 'Órgãos Territoriais e Municipais' : 'Saídas principais'}
            </h3>
          </div>

          <div className="space-y-3">
            {selectedType === 'usuarios' ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Erros de Chave BI Expirada</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Necessita de actualização presencial</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                      {Math.round(2042 * multiplier).toLocaleString('pt-AO')} Casos
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-rose-50 text-rose-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-rose-100">
                      Erros
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Cancelamentos Solicitados</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Pedido Formal por Migração</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                      {Math.round(928 * multiplier).toLocaleString('pt-AO')} Casos
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-rose-50 text-rose-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-rose-100">
                      Pedidos
                    </span>
                  </div>
                </div>
              </>
            ) : selectedType === 'instituicoes' ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Administrações Municipais</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Canais Oficiais Interligados</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                      {Math.round(180 * multiplier).toLocaleString('pt-AO')} Autarquias
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                      Coberto
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Embaixadas e Representações</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Chancelaria no Estrangeiro</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-blue-600 font-mono block">
                      {Math.round(45 * multiplier).toLocaleString('pt-AO')} Postos
                    </span>
                    <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                      Diáspora
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/40 transition-colors">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Compra de Material</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">16:45</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                      Kz {(2042 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-rose-100">
                      Suprimentos
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/40 transition-colors">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Pagamento de Conta</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">09:30</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                      Kz {(928 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[9px] uppercase rounded-md tracking-wider mt-1 border border-rose-100">
                      Contas
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* 5. Autenticação e Protocolos Section Grid Block */}
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Wallet size={16} className="text-slate-500" />
          <h3 className="font-sans font-black text-xs sm:text-sm text-slate-800 uppercase tracking-tight">
            {selectedType === 'usuarios' ? 'Métodos de Autenticação Usados' : selectedType === 'instituicoes' ? 'Protocolos de Enlace API' : 'Métodos de Pagamento'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {selectedType === 'usuarios' ? (
            <>
              {/* SMS Lock */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Chave SMS Móvel</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Mobile OTP</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(5903 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>

              {/* BI Code */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-500 shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Leitor de BI</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide font-sans">SmartCard</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(3814 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>

              {/* Certificado Chancelado */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-500 shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Chave Autenticada</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Private Key</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(1634 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>
            </>
          ) : selectedType === 'instituicoes' ? (
            <>
              {/* REST API */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Globe size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">REST API Segura</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">JSON HTTP</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(5903 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>

              {/* Servidor Público Gov */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-500 shrink-0">
                    <Settings size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Portal Chancelaria</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide font-sans">Dashboard</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(3814 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>

              {/* Webhooks */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-500 shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Webhooks SSL/TLS</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Sockets</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  {Math.round(1634 * multiplier).toLocaleString('pt-AO')}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Dinheiro */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Dinheiro</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Cash</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  Kz {(5903 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                </span>
              </div>

              {/* Cartão */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-500 shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Cartão</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide font-sans">Card</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  Kz {(3814 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                </span>
              </div>

              {/* Transferência */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-500 shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 font-sans">Transferência</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Transfer</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                  Kz {(1634 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                </span>
              </div>
            </>
          )}

        </div>
      </div>

      {/* 6. Últimas Transações / Historial de Auditoria List Block */}
      <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Briefcase size={16} className="text-slate-500" />
          <h3 className="font-sans font-black text-xs sm:text-sm text-slate-800 uppercase tracking-tight">
            {selectedType === 'usuarios' ? 'Últimos Registos e Eventos de Usuários' : selectedType === 'instituicoes' ? 'Historial de Auditoria de Integração' : 'Últimas Transações'}
          </h3>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          
          {selectedType === 'usuarios' ? (
            <>
              {/* Row 1 */}
              <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Registo Completo • Dr. Manuel Silva</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">16:20 via GAE Luanda</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">Nova Conta</span>
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                    Ativado
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Chave Renovada • Engenheiro António Carlos</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">15:45 via Portal Web</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-blue-600 font-mono block">Segurança</span>
                  <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                    Sincronizado
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Registo Completo • Dr. Sandra Santos</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">14:30 via BUAP Benguela</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">Nova Conta</span>
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                    Ativado
                  </span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Alerta de Chave Bloqueada por Tentativas</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">13:15 no IP Governamental</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-amber-600 font-mono block">Alerta</span>
                  <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-amber-100">
                    Bloqueado
                  </span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-center justify-between py-3.5 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Adesão por Chave BI • Dra. Laurinda João</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">11:20 via Chancelaria Huambo</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">Nova Conta</span>
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                    Ativado
                  </span>
                </div>
              </div>
            </>
          ) : selectedType === 'instituicoes' ? (
            <>
              {/* Row 1 */}
              <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Sincronização Cadastral • Ministério das Finanças (MINFIN)</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">16:20 via Webhook Seguro SSL</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-blue-600 font-mono block">Chamada API</span>
                  <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                    Sincronizado
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Globe size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Enlace de Órgão Local • Administração Municipal de Cacuaco</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">15:45 via Chancelaria Luanda</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">Sincronização</span>
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                    Ativo
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Emissão de Credencial • Ministério da Administração do Território</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">14:30 via API REST</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-blue-600 font-mono block">Segurança</span>
                  <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100">
                    Chave Emitida
                  </span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Sincronização de Assinaturas Interrompida</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">13:15 no SME Central</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-amber-600 font-mono block">Advertência</span>
                  <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-amber-100">
                    Timeout
                  </span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-center justify-between py-3.5 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Auditoria Regular Concluída com Sucesso</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">11:20 por Chancelaria Nacional</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">Concluído</span>
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-[#00A859] text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-emerald-100">
                    Regularizado
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Row 1: Venda - Cliente João */}
              <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Venda - Cliente João</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">16:20</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                    +Kz {(1499 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100 select-none">
                    Receita
                  </span>
                </div>
              </div>

              {/* Row 2: Compra - Fornecedor ABC */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <ArrowDownRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Compra - Fornecedor ABC</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">15:45</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                    Kz {(799 * multiplier).toLocaleString('pt-AO')}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-rose-100 select-none">
                    Despesa
                  </span>
                </div>
              </div>

              {/* Row 3: Venda - Cliente Maria */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Venda - Cliente Maria</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">14:30</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                    +Kz {(2199 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100 select-none">
                    Receita
                  </span>
                </div>
              </div>

              {/* Row 4: Pagamento - Energia */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <ArrowDownRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Pagamento - Energia</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">13:15</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-rose-600 font-mono block">
                    Kz {(449 * multiplier).toLocaleString('pt-AO')}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-rose-100 select-none">
                    Despesa
                  </span>
                </div>
              </div>

              {/* Row 5: Venda - Cliente Pedro */}
              <div className="flex items-center justify-between py-3.5 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00A859] shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">Venda - Cliente Pedro</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">11:20</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-[#00A859] font-mono block">
                    +Kz {(2887 * multiplier).toLocaleString('pt-AO', { minimumFractionDigits: 3 })}
                  </span>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-wider mt-1 border border-blue-100 select-none">
                    Receita
                  </span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
