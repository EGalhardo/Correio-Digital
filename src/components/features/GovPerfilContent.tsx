import React from 'react';
import { motion } from 'motion/react';
import { 
  Landmark, 
  ArrowUpRight, 
  ArrowDownRight,
  Layers, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
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

// Elegant monthly trend data optimized for corporate institutional overview with approved and non-approved document requests
const INSTITUTIONAL_TREND_DATA = [
  { month: 'Jan', mensagens: 14200, naoLidas: 410, enviadas: 12100, solicitacoes: 4150, solicitacoesNaoAprovadas: 190 },
  { month: 'Fev', mensagens: 16800, naoLidas: 380, enviadas: 14800, solicitacoes: 5200, solicitacoesNaoAprovadas: 210 },
  { month: 'Mar', mensagens: 19500, naoLidas: 390, enviadas: 17200, solicitacoes: 6300, solicitacoesNaoAprovadas: 180 },
  { month: 'Abr', mensagens: 21000, naoLidas: 290, enviadas: 19100, solicitacoes: 7800, solicitacoesNaoAprovadas: 140 },
  { month: 'Mai', mensagens: 24580, naoLidas: 320, enviadas: 21450, solicitacoes: 8920, solicitacoesNaoAprovadas: 120 },
];

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
}

export function GovPerfilContent({ logs, emergencyMode, onToggleEmergency }: GovPerfilContentProps) {
  // Always display full data of the trend
  const displayedData = INSTITUTIONAL_TREND_DATA;

  // Modern styling properties for the charts of 5 metrics
  const metrics = [
    {
      key: 'mensagens',
      title: 'Mensagens Totais',
      sub: 'Monitoramento de Fluxo',
      value: '24,580',
      color: '#3b82f6', // Azure Blue
      bgGrad: 'instColorMensagens',
      change: '+17.2%',
      isPositive: true,
      description: 'Total acumulado de correspondências interligadas este mês'
    },
    {
      key: 'naoLidas',
      title: 'Mensagens Não Lidas',
      sub: 'Controle de Resposta',
      value: '320',
      color: '#f43f5e', // Hot Rose
      bgGrad: 'instColorNaoLidas',
      change: '-22.0%',
      isPositive: true, // actually positive in terms of performance (less unread messages)
      description: 'Mensagens pendentes de triagem nas caixas institucionais'
    },
    {
      key: 'enviadas',
      title: 'Mensagens Enviadas',
      sub: 'Taxa de Entrega',
      value: '21,450',
      color: '#fbbf24', // Yellow Gold
      bgGrad: 'instColorEnviadas',
      change: '+15.5%',
      isPositive: true,
      description: 'Mensagens com protocolo de envio autenticado pelo CDA'
    },
    {
      key: 'solicitacoes',
      title: 'Solicitacões Doc. Digital Aprovada',
      sub: 'Emissão de Credenciais',
      value: '8,920',
      color: '#10b981', // Emerald Green
      bgGrad: 'instColorSolicitacoes',
      change: '+25.0%',
      isPositive: true,
      description: 'Requisições de bilhete e certidão eletrónica deferidas e homologadas'
    },
    {
      key: 'solicitacoesNaoAprovadas',
      title: 'Solicitacões Doc. Digital Não Aprovada',
      sub: 'Análise de Inconsistências',
      value: '120',
      color: '#f97316', // Bright Orange
      bgGrad: 'instColorSolicitacoesNaoAprovadas',
      change: '-14.2%',
      isPositive: true, // positive because unapproved requests decreased
      description: 'Requisições canceladas ou indeferidas por inconformidade cadastral'
    }
  ];

  return (
    <div className="pb-24">
      {/* Title Header Section */}
      <div className="mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Landmark size={16} />
            </div>
            <span className="font-mono text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
              Admin &bull; Painel Corporativo
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
            Instituição Geral
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-2 max-w-xl">
            Desempenho operacional simplificado, tendências de aprovação de documentos e monitoramento de conexões ativas.
          </p>
        </div>
      </div>

      {/* Emergency Mode Banner Alert Alert */}
      {emergencyMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-red-50 border-2 border-red-550/30 rounded-3xl flex items-start gap-4"
        >
          <div className="p-2.5 bg-red-600 text-white rounded-2xl">
            <AlertTriangle size={20} className="animate-bounce" />
          </div>
          <div>
            <h4 className="font-sans text-xs font-black text-red-950 uppercase tracking-wider">
              Protocolo Emergencial de Cibersegurança Ativado
            </h4>
            <p className="text-[11px] text-red-750/90 font-medium mt-1 leading-relaxed">
              O fluxo automático de dados foi pausado. A emissão de credenciais eletrónicas e as comunicações com os Ministérios parceiros requerem validação manual periódica.
            </p>
          </div>
        </motion.div>
      )}

      {/* Simplified, Modern Bento Grid - 5 Metric cards + 1 Corporate Summary card (Perfect 3x2 Balance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {metrics.map((m, index) => (
          <motion.div 
            key={m.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white border border-slate-100/90 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[320px]"
          >
            {/* Metric Info Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider truncate" style={{ color: m.color }}>
                    {m.sub}
                  </span>
                </div>
                <h3 className="font-sans text-[11px] md:text-xs font-black text-slate-450 uppercase tracking-widest leading-tight">
                  {m.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-900 leading-none mb-1">
                  {m.value}
                </div>
                <div className={`text-[9px] font-bold flex items-center justify-end gap-0.5 ${
                  m.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {m.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {m.change}
                </div>
              </div>
            </div>

            {/* Minimalist Chart Area */}
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id={m.bgGrad} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={m.color} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff', 
                      fontSize: '11px', 
                      fontFamily: 'monospace' 
                    }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    name={m.title} 
                    dataKey={m.key} 
                    stroke={m.color} 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill={`url(#${m.bgGrad})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}

        {/* Card 6: Corporate Integrations and SLAs (Provides geometrical symmetry) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white border border-slate-100/90 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[320px]"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-emerald-600">
                Integridade do Barramento
              </span>
            </div>
            <h4 className="text-lg md:text-xl font-black italic tracking-tighter uppercase mb-4 leading-none text-slate-950">
              Resumo Institucional
            </h4>
            <div className="space-y-3 font-sans text-xs text-slate-500">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium text-slate-500">Taxa Global de Aprovação Doc:</span>
                <span className="font-bold text-emerald-600">98.6%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium text-slate-500">Tempo Médio de Resposta:</span>
                <span className="font-mono text-slate-800 font-bold">1.2s (Militarizado)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium text-slate-500">Uptime do Backend CDA:</span>
                <span className="text-emerald-600 font-bold">100% Online</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-medium text-slate-500">Instituições Sincronizadas:</span>
                <span className="text-slate-800 font-bold">SME, AGT, ENDE, EPAL</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[8px] font-mono tracking-wider text-slate-400 uppercase">
            <span>Servidor Gateway:</span>
            <span className="font-bold text-slate-600">Luanda Gate-L04</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Status Bar */}
      <div className="mt-12 bg-slate-50 border border-slate-100 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="text-slate-500" size={20} />
          <div>
            <h5 className="font-black text-slate-800 text-xs uppercase tracking-wider">
              Conexão Unificada CDA
            </h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Protocolo de segurança robusto de ponta-a-ponta e distribuição certificada de credenciais governamentais.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-550 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Barramento Activo: L7-Gateway
          </span>
        </div>
      </div>
    </div>
  );
}
