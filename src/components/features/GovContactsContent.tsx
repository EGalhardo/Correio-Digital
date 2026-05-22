import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Mail, 
  Inbox, 
  Send, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2 
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

export function GovContactsContent() {
  return (
    <div className="pb-24">
      {/* Title Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <Users size={16} />
          </div>
          <span className="font-mono text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
            Admin &bull; Métricas Gerais
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
          Usuário Geral
        </h1>
        <p className="text-slate-500 font-medium text-xs mt-2 max-w-xl">
          Visualização analítica consolidada do fluxo nacional de correspondências e emissões de credenciais eletrónicas.
        </p>
      </div>

      {/* Modern Bento Grid - 4 Metric Graph Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Metric 1: Mensagens (Total) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area type="monotone" name="Mensagens" dataKey="mensagens" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMensagens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metric 2: Não Lidas */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area type="monotone" name="Não Lidas" dataKey="naoLidas" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNaoLidas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metric 3: Enviadas */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area type="monotone" name="Enviadas" dataKey="enviadas" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnviadas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metric 4: Solicitações de Doc. Digital */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area type="monotone" name="Solicitações" dataKey="solicitacoes" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolicitacoes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card 5: Cloned Resumo Usuários (Full width for visual balance and harmony) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
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
  );
}
