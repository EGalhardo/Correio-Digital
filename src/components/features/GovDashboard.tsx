import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Mail,
  FileText,
  Send,
  Clock,
  ArrowRight,
  RefreshCcw,
  X,
  Activity,
  Database,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  MapPin,
  User,
  Shield,
  Scan,
  Fingerprint,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label as RechartsLabel,
} from "recharts";

import { Document, AppMode, UserRequest } from "../../types";

interface Institution {
  name: string;
  status: "online" | "manutenção" | "offline";
  delay: string;
  baseDelay: number;
}

interface ProvinceData {
  name: string;
  count: number;
  id: string;
}

interface GovDashboardProps {
  onNavigate?: (tabId: string) => void;
  documents?: Document[];
  emergencyMode?: boolean;
  userRequests?: UserRequest[];
  isMobile?: boolean;
}

export function GovDashboard({
  onNavigate,
  documents = [],
  emergencyMode = false,
  appMode = "admin",
  userRequests = [],
  isMobile = false,
}: GovDashboardProps & { appMode?: AppMode }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [matchingThreshold, setMatchingThreshold] = useState(85);
  const [antiSpoofingEnforced, setAntiSpoofingEnforced] = useState(true);

  const mapPins = useMemo(
    () => [
      { id: "cabinda", name: "Cabinda", top: "5%", left: "21%", count: 86732 },
      { id: "zaire", name: "Zaire", top: "18%", left: "30%", count: 42150 },
      { id: "uige", name: "Uíge", top: "22%", left: "45%", count: 78940 },
      { id: "bengo", name: "Bengo", top: "31%", left: "27%", count: 35420 },
      { id: "luanda", name: "Luanda", top: "33%", left: "21%", count: 412540 },
      { id: "cuanza-norte", name: "Cuanza Norte", top: "31%", left: "38%", count: 52130 },
      { id: "cuanza-sul", name: "Cuanza Sul", top: "45%", left: "33%", count: 89450 },
      { id: "malanje", name: "Malanje", top: "33%", left: "51%", count: 71200 },
      { id: "lunda-norte", name: "Lunda Norte", top: "24%", left: "68%", count: 65410 },
      { id: "lunda-sul", name: "Lunda Sul", top: "38%", left: "74%", count: 58920 },
      { id: "moxico", name: "Moxico", top: "55%", left: "75%", count: 83240 },
      { id: "bie", name: "Bié", top: "53%", left: "52%", count: 76430 },
      { id: "huambo", name: "Huambo", top: "54%", left: "41%", count: 114530 },
      { id: "benguela", name: "Benguela", top: "56%", left: "25%", count: 125430 },
      { id: "huila", name: "Huíla", top: "72%", left: "33%", count: 98234 },
      { id: "namibe", name: "Namibe", top: "74%", left: "18%", count: 62540 },
      { id: "cunene", name: "Cunene", top: "85%", left: "34%", count: 49750 },
      { id: "cuando-cubango", name: "Cuando Cubango", top: "76%", left: "59%", count: 51240 },
    ],
    [],
  );

  // BI Data
  const categoryData = useMemo(
    () => [
      { name: "SME", value: 12, color: "#3b82f6" },
      { name: "AGT", value: 15, color: "#dc2626" },
      { name: "ENDE", value: 8, color: "#f59e0b" },
      { name: "EPAL", value: 7, color: "#06b6d4" },
      { name: "Tribunal", value: 10, color: "#8b5cf6" },
      { name: "Hospital", value: 9, color: "#10b981" },
      { name: "Ministerios", value: 11, color: "#0f172a" },
      { name: "Polícia Nacional", value: 6, color: "#1d4ed8" },
      { name: "Notário", value: 5, color: "#ec4899" },
      { name: "Registo Civil", value: 6, color: "#14b8a6" },
      { name: "Seguro Social", value: 6, color: "#f97316" },
      { name: "Administradoras", value: 5, color: "#64748b" },
    ],
    [],
  );

  const provinceData = useMemo<ProvinceData[]>(
    () => [
      { id: "luanda", name: "Luanda", count: 412540 },
      { id: "benguela", name: "Benguela", count: 125430 },
      { id: "huambo", name: "Huambo", count: 114530 },
      { id: "huila", name: "Huíla", count: 98234 },
      { id: "cuanza-sul", name: "Cuanza Sul", count: 89450 },
      { id: "cabinda", name: "Cabinda", count: 86732 },
      { id: "moxico", name: "Moxico", count: 83240 },
      { id: "uige", name: "Uíge", count: 78940 },
      { id: "bie", name: "Bié", count: 76430 },
      { id: "malanje", name: "Malanje", count: 71200 },
      { id: "lunda-norte", name: "Lunda Norte", count: 65410 },
      { id: "namibe", name: "Namibe", count: 62540 },
      { id: "lunda-sul", name: "Lunda Sul", count: 58920 },
      { id: "cuanza-norte", name: "Cuanza Norte", count: 52130 },
      { id: "cuando-cubango", name: "Cuando Cubango", count: 51240 },
      { id: "cunene", name: "Cunene", count: 49750 },
      { id: "zaire", name: "Zaire", count: 42150 },
      { id: "bengo", name: "Bengo", count: 35420 },
    ],
    [],
  );

  // KPI Data
  const kpis = useMemo(
    () => [
      {
        label: "Correspondências Enviadas",
        value: "1.248.752",
        change: "+12,5% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
      {
        label: "Correspondências Entregues",
        value: "932.540",
        change: "+9,8% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
      {
        label: "Pendentes",
        value: "316.212",
        change: "-5,3% vs mês anterior",
        up: false,
        color: "text-red-500",
      },
      {
        label: "Taxa de Sucesso",
        value: "92,4%",
        change: "+7,6% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
    ],
    [],
  );

  const activities = useMemo(
    () => [
      {
        id: 1,
        action: "Correspondência Fiscal enviada",
        time: "20/05/2025 10:42",
        org: "AGT",
        status: "success",
      },
      {
        id: 2,
        action: "Notificação de Educação entregue",
        time: "20/05/2025 10:35",
        org: "MED",
        status: "success",
      },
      {
        id: 3,
        action: "BI Digital emitido",
        time: "20/05/2025 10:28",
        org: "SME",
        status: "success",
      },
      {
        id: 4,
        action: "Validação por QR Code realizada",
        time: "20/05/2025 10:15",
        org: "Gov",
        status: "success",
      },
      {
        id: 5,
        action: "Correspondência de Justiça entregue",
        time: "20/05/2025 10:05",
        org: "MINJUS",
        status: "success",
      },
    ],
    [],
  );

  const [institutions] = useState<Institution[]>([
    { name: "SME", status: "online", delay: "12ms", baseDelay: 12 },
    { name: "AGT", status: "online", delay: "24ms", baseDelay: 24 },
    { name: "ENDE", status: "online", delay: "18ms", baseDelay: 18 },
    { name: "EPAL", status: "online", delay: "15ms", baseDelay: 15 },
  ]);

  const chartData = useMemo(
    () => [
      { time: "08:00", reqs: 400 },
      { time: "10:00", reqs: 600 },
      { time: "12:00", reqs: 800 },
      { time: "14:00", reqs: 700 },
      { time: "16:00", reqs: 900 },
      { time: "18:00", reqs: 1200 },
      { time: "20:00", reqs: 500 },
    ],
    [],
  );

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div
      id="gov-dashboard-wrapper"
      className="min-h-screen bg-slate-50 text-slate-600 p-4 md:p-8 font-sans"
    >
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        {/* Top Header Section */}
        <header
          id="gov-header"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-100"
        >
          <div>
            <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">
              Painel Nacional de Correspondência
            </h1>
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Correio Digital Angola &bull; Administração Central
            </p>
          </div>
          
          {/* Symmetrical central monitoring badge */}
          <div className="flex items-center gap-2 bg-slate-100/50 border border-slate-200/50 px-3.5 py-1.5 rounded-full shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">
              Monitoramento Ativo
            </span>
          </div>
        </header>

        {/* Resumo Geral - KPI panel */}
        <section
          id="resumo-geral-section"
          className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                Resumo Geral
              </h2>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Consolidado de Emissão e Fluxo de Correspondências no Território
              Nacional
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* KPI 1: Enviadas */}
            <div
              id="kpi-enviadas"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[0].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[0].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <TrendingUp size={12} /> {kpis[0].change}
              </div>
            </div>

            {/* KPI 2: Entregues */}
            <div
              id="kpi-entregues"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[1].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[1].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <TrendingUp size={12} /> {kpis[1].change}
              </div>
            </div>

            {/* KPI 3: Pendentes */}
            <div
              id="kpi-pendentes"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[2].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[2].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 w-fit px-2.5 py-1 rounded-lg border border-red-100/50 flex items-center gap-1.5">
                <TrendingDown size={12} /> {kpis[2].change}
              </div>
            </div>

            {/* KPI 4: Taxa de Sucesso (with animated gauge) */}
            <div
              id="kpi-taxas"
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                  {kpis[3].label}
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                  {kpis[3].value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <TrendingUp size={12} /> {kpis[3].change}
                </div>
              </div>

              <div className="w-12 h-12 relative shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="stroke-emerald-500 fill-none"
                    strokeWidth="4"
                    strokeDasharray="131.9"
                    strokeDashoffset="10.0"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facial Security Integration Section */}
        <section
          id="gov-facials-integration-section"
          className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                  Módulo de Segurança Facial & Biometria
                </h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  Sincronizado com o Core Neural de Identidade Nacional
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              <Fingerprint size={12} className="animate-pulse" />
              BIOMETRIA ATIVA
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Core Metrics Cards */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block mb-2">Métricas Ativas do Servidor</span>
              
              {/* Stat 1 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Modelos Registrados</span>
                  <span className="text-xl font-black text-slate-950 font-mono mt-1 block">15.240 faces</span>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Scan size={18} />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Acurácia de Matching</span>
                  <span className="text-xl font-black text-indigo-650 font-mono mt-1 block">98.67%</span>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShieldCheck size={18} />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fraudes de Spoofing Evitadas</span>
                  <span className="text-xl font-black text-red-600 font-mono mt-1 block">48 tentativas</span>
                </div>
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <ShieldAlert size={18} />
                </div>
              </div>
            </div>

            {/* Column 2: Live Feed list */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">Histórico de Validações Recentes</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {/* Attempt 1 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Edlasio Galhardo</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Cidadão</span>
                      <span>&bull;</span>
                      <span>Hoje, 20:15</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">98.8% match</span>
                  </div>
                </div>

                {/* Attempt 2 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Afonso Henriques</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Instituição (MINFIN)</span>
                      <span>&bull;</span>
                      <span>Hoje, 18:42</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">99.4% match</span>
                  </div>
                </div>

                {/* Attempt 3 */}
                <div className="p-3 bg-red-50/40 hover:bg-red-50/60 border border-red-100/70 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-red-950 truncate block">Desconhecido (#9381)</span>
                    <span className="text-[9px] font-mono text-red-500 flex items-center gap-1 mt-0.5">
                      <span>Tentativa inválida</span>
                      <span>&bull;</span>
                      <span>Hoje, 15:30</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-red-600 uppercase font-black tracking-wider block">BLOQUEADO</span>
                    <span className="text-[9px] font-mono text-red-500 font-bold">Liveness Falhou</span>
                  </div>
                </div>

                {/* Attempt 4 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Cláudia Simões</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Cidadão</span>
                      <span>&bull;</span>
                      <span>Hoje, 10:24</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">96.5% match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Slider details & Liveness switch representation */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block mb-2">Controlo Integrado do Painel</span>
              
              <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Lock size={120} />
                </div>
                
                {/* Liveness active state */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block font-mono">Anti-Spoofing</span>
                    <span className="text-xs font-bold mt-1 block">Liveness Ativo</span>
                  </div>
                  <button
                    onClick={() => setAntiSpoofingEnforced(!antiSpoofingEnforced)}
                    className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                      antiSpoofingEnforced ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${antiSpoofingEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* matching rate slider view */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-indigo-400 mb-1.5 font-mono">
                    <span>Mínimo de Confiança</span>
                    <span className="text-white font-black">{matchingThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="75" 
                    max="99" 
                    value={matchingThreshold} 
                    onChange={(e) => setMatchingThreshold(+e.target.value)}
                    className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="pt-1.5 flex items-center gap-1.5 text-[8.5px] font-mono text-slate-450 tracking-wider">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  SISTEMA TOTALMENTE ENCRIPTADO
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Category Donut Card */}
          <section
            id="categoria-card"
            className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[480px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">
                Correspondências por Categoria
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 min-h-0">
              <div className="w-full md:w-[45%] h-[200px] md:h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        fontSize: "10px",
                        fontFamily: 'monospace'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
                    Fluxo
                  </span>
                  <span className="text-xl font-black text-slate-900 italic tracking-tighter leading-none mt-1">
                    100%
                  </span>
                </div>
              </div>

              <div className="w-full md:w-[55%] space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar grid grid-cols-2 gap-x-4">
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-[11px] p-2 hover:bg-slate-50 rounded-xl transition-colors border border-slate-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-650 uppercase tracking-widest text-[9px] truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-black text-slate-950 font-mono text-[10px] shrink-0 ml-1">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Outline Map container */}
          <section
            id="provincia-card"
            className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[480px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">
                Distribuição por Província
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 items-center justify-center">
              {/* Visual Maps Representation: Angola Provinces Map */}
              <div className="w-full md:w-[50%] h-[240px] md:h-full flex flex-col items-center justify-center relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 overflow-hidden group/map select-none">
                
                {/* Sized aspect ratio wrapper ensuring perfect coordinate synchronization */}
                <div className="relative w-[190px] h-[220px]">
                  <img
                    src="https://i.postimg.cc/J008DY8G/Mapa-de-Angola-Provincias.gif"
                    alt="Mapa de Angola Províncias"
                    className="absolute w-full h-full object-contain transition-all duration-300 group-hover/map:brightness-[0.98]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Tactical Crosslines active on hover */}
                  {hoveredProvince && (
                    <>
                      {/* Horizontal Targeting Line */}
                      <div 
                        className="absolute left-0 right-0 h-[1px] border-b border-dashed border-red-500/40 pointer-events-none transition-all duration-300 z-10"
                        style={{ 
                          top: mapPins.find(p => p.id === hoveredProvince)?.top || "50%" 
                        }}
                      />
                      {/* Vertical Targeting Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-[1px] border-r border-dashed border-red-500/40 pointer-events-none transition-all duration-300 z-10"
                        style={{ 
                          left: mapPins.find(p => p.id === hoveredProvince)?.left || "50%" 
                        }}
                      />
                    </>
                  )}

                  {/* Pins Overlays */}
                  {mapPins.map((pin) => {
                    const isHovered = hoveredProvince === pin.id;
                    const isSelected = selectedProvince === pin.id;
                    return (
                      <div
                        key={pin.id}
                        className="absolute transition-all duration-300 cursor-pointer z-20"
                        style={{
                          top: pin.top,
                          left: pin.left,
                          transform: "translate(-50%, -50%)"
                        }}
                        onMouseEnter={() => setHoveredProvince(pin.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          setSelectedProvince(selectedProvince === pin.id ? null : pin.id);
                        }}
                      >
                        {/* Interactive Highlight Pulse Wave */}
                        <div 
                          className={`absolute w-8 h-8 -top-3 -left-3 rounded-full border transition-all duration-500 ${
                            isHovered 
                              ? "border-red-500 bg-red-500/15 scale-125" 
                              : isSelected
                              ? "border-red-600 bg-red-600/15 scale-110"
                              : "border-transparent"
                          }`}
                        />

                        {/* Secondary Pin Glow */}
                        <span className={`absolute inline-flex rounded-full opacity-75 animate-ping -top-1.5 -left-1.5 ${
                          isHovered 
                            ? "h-4 w-4 bg-red-600" 
                            : isSelected
                            ? "h-4 w-4 bg-red-700"
                            : "h-3 w-3 bg-red-400/20"
                        }`} />

                        {/* Core Dot Indicator */}
                        <div 
                          className={`w-2.5 h-2.5 rounded-full shadow-md transition-all duration-300 ${
                            isHovered 
                              ? "bg-red-650 scale-125 ring-4 ring-red-100" 
                              : isSelected
                              ? "bg-red-700 scale-115 ring-4 ring-red-200"
                              : "bg-red-500 hover:bg-red-650 hover:scale-110 ring-2 ring-white"
                          }`}
                        />

                        {/* Floating Tactile HUD Card Overlay */}
                        {isHovered && (
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-slate-900/95 border border-red-500/40 text-white rounded-xl p-2.5 shadow-xl whitespace-nowrap pointer-events-none z-30 font-mono text-[8px] flex flex-col gap-0.5 min-w-[130px] transition-all duration-200">
                            <span className="font-sans font-black uppercase text-red-500 text-[9px] tracking-wide mb-0.5 flex items-center justify-between">
                              {pin.name}
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                            </span>
                            <div className="flex justify-between gap-3 text-slate-350">
                              <span>Correspondências:</span>
                              <span className="font-black text-white text-[9px]">{pin.count.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-slate-400 text-[7px] border-t border-slate-800/65 pt-1 mt-0.5">
                              <span>Canal CDA:</span>
                              <span className="text-green-400 font-bold uppercase tracking-widest text-[7px]">Ativo</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-1.5 left-2.5 flex items-center gap-1.5 font-mono text-[7px] font-black text-slate-400 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  MAPA DE PROVÍNCIAS &bull; CDA RESUMO
                </div>
              </div>

              {/* Province listings matching layout exact specifications */}
              <div className="w-full md:w-[50%] flex flex-col justify-between h-full min-h-[220px]">
                <div className="space-y-1.5 overflow-y-auto max-h-[190px] pr-1 custom-scrollbar">
                  {provinceData.map((prov) => {
                    const isHovered = hoveredProvince === prov.id;
                    const isSelected = selectedProvince === prov.id;
                    return (
                      <div
                        key={prov.name}
                        onMouseEnter={() => setHoveredProvince(prov.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          setSelectedProvince(selectedProvince === prov.id ? null : prov.id);
                        }}
                        className={`flex justify-between items-center text-[10px] p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          isHovered
                            ? "bg-red-50/50 border-red-200 text-red-950 scale-[1.02] shadow-sm"
                            : isSelected
                            ? "bg-red-50/70 border-red-300 text-red-950 scale-[1.01] shadow-sm"
                            : "bg-slate-50/30 border-transparent hover:bg-slate-50 hover:border-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="font-bold uppercase tracking-widest group-hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
                          {prov.name}
                        </span>
                        <span
                          className={`font-mono font-black tracking-tighter ${
                            isHovered
                              ? "text-red-650"
                              : isSelected
                              ? "text-red-700"
                              : "text-slate-950"
                          }`}
                        >
                          {prov.count.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub regional interactive diagnostic card */}
                <div className="mt-3 p-3 bg-slate-50/90 border border-slate-100/80 rounded-2xl min-h-[56px] flex items-center justify-between text-[10px] text-slate-500 transition-all duration-300">
                  {selectedProvince ? (
                    <div className="w-full flex justify-between items-center transition-all animate-fadeIn">
                      <div>
                        <span className="font-mono text-[8px] font-black uppercase text-red-600 block leading-none mb-1 tracking-wider">
                          Província Ativa: {provinceData.find(p => p.id === selectedProvince)?.name}
                        </span>
                        <p className="text-[9px] text-slate-400 font-medium font-sans">
                          Canal seguro CDA estabelecido e operando com {provinceData.find(p => p.id === selectedProvince)?.count.toLocaleString()} registros ativos.
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProvince(null);
                        }}
                        className="p-1 px-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-800 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider shadow-sm transition-all shrink-0 hover:bg-slate-50"
                      >
                        Desativar
                      </button>
                    </div>
                  ) : (
                    <p className="italic text-[9px] text-slate-400 mx-auto text-center font-medium leading-relaxed max-w-[200px] font-sans">
                      Selecione uma província no mapa ou na lista acima para diagnósticos integrados regionais.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
