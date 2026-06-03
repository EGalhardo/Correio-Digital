/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Mail, 
  Plus, 
  Clock, 
  Search, 
  Fingerprint,
  Bell,
  Scroll,
  ShieldAlert,
  Receipt,
  Megaphone,
  FolderOpen,
  Landmark,
  CheckSquare,
  Key,
  Award,
  User,
  Coins,
  Scale,
  FileText,
  Lock
} from 'lucide-react';
import { Message, SENSITIVITY_LEVELS, PRIORITY_CONFIGS } from '../../types';
import { getCategoryMetadata } from '../../utils/protocolGenerator';

const getOrgBadgeStyles = (org: string) => {
  const o = org.toUpperCase();
  if (o.includes('SOC') || o.includes('EMERGÊNCIA')) {
    return 'bg-red-50 text-red-700 border-red-200';
  } else if (o === 'AGT' || o.includes('FINANÇAS') || o.includes('MINFIN') || o.includes('CONTRIBUINTE')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (o === 'SME' || o.includes('MIGRAÇÃO') || o.includes('ESTRANGEIROS')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (o === 'MINJUS' || o.includes('JUSTIÇA') || o.includes('REGISTO') || o.includes('CONSERVATÓRIA')) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  } else if (o.includes('TRIBUNAL') || o.includes('SUPREMO') || o.includes('COMARCA')) {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
  } else if (o === 'ENDE' || o.includes('ELETRICIDADE') || o.includes('FORÇA')) {
    return 'bg-orange-50 text-orange-850 border-orange-200';
  } else if (o === 'EPAL' || o.includes('ÁGUA')) {
    return 'bg-sky-50 text-sky-850 border-sky-200';
  }
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

function renderCategoryIcon(iconName: string, size = 10) {
  switch (iconName) {
    case 'Bell': return <Bell size={size} />;
    case 'Scroll': return <Scroll size={size} />;
    case 'ShieldAlert': return <ShieldAlert size={size} />;
    case 'Receipt': return <Receipt size={size} />;
    case 'Megaphone': return <Megaphone size={size} />;
    case 'FolderOpen': return <FolderOpen size={size} />;
    case 'Landmark': return <Landmark size={size} />;
    case 'CheckSquare': return <CheckSquare size={size} />;
    case 'Key': return <Key size={size} />;
    case 'Award': return <Award size={size} />;
    case 'User': return <User size={size} />;
    case 'Coins': return <Coins size={size} />;
    case 'Scale': return <Scale size={size} />;
    default: return <FileText size={size} />;
  }
}

interface MailContentProps {
  isComposing: boolean;
  setIsComposing: (composing: boolean) => void;
  composeData: { to: string; subject: string; body: string };
  setComposeData: (data: { to: string; subject: string; body: string }) => void;
  handleSendMessage: () => void;
  unreadTotal: number;
  correspondenciaTab: string;
  setCorrespondenciaTab: (tab: string) => void;
  inbox: Message[];
  sentMessages: Message[];
  searchMail: string;
  setSearchMail: (search: string) => void;
  filteredMessages: Message[];
  handleSelectMessage: (msg: Message) => void;
  bi: string;
  isInst?: boolean;
}

export function MailContent({
  isComposing,
  setIsComposing,
  composeData,
  setComposeData,
  handleSendMessage,
  unreadTotal,
  correspondenciaTab,
  setCorrespondenciaTab,
  inbox,
  sentMessages,
  searchMail,
  setSearchMail,
  filteredMessages,
  handleSelectMessage,
  bi,
  isInst
}: MailContentProps) {
  if (isComposing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => setIsComposing(false)}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-white border-2 border-[#d1dbe5] rounded-full font-black text-xs md:text-sm text-[#384e6e] hover:bg-slate-50 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft size={16} className="text-[#384e6e]" />
            <span>Voltar ao Correio</span>
          </button>
          <div>
            <h3 className="text-base md:text-xl font-black text-primary leading-none">Nova Mensagem</h3>
            <p className="text-[9px] md:text-[10px] text-slate-700 font-black uppercase tracking-widest mt-1">Comunicação Oficial Directa</p>
          </div>
        </div>

        <div className="bg-white border border-line rounded-[24px] md:rounded-[32px] p-5 md:p-10 shadow-sm space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">
                {isInst ? 'Destinatário' : 'Destinatário Institucional'}
              </label>
              <div className="relative">
                {isInst ? (
                  <input 
                    type="text"
                    placeholder="Introduza o N-BI"
                    value={composeData.to}
                    onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                    className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-3.5 md:py-4 text-xs md:text-sm font-mono font-bold text-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
                ) : (
                  <>
                    <select 
                      value={composeData.to}
                      onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                      className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-3.5 md:py-4 text-xs md:text-sm font-bold text-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Selecione uma instituição...</option>
                      {["SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Registo Civil", "INE"].map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowLeft className="-rotate-90" size={14} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">Assunto</label>
              <input 
                type="text"
                placeholder="Qual o tema da sua mensagem?"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-3.5 md:py-4 text-xs md:text-sm font-bold text-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">Conteúdo da Mensagem</label>
            <textarea 
              rows={8}
              placeholder="Descreva detalhadamente o seu pedido ou informação..."
              value={composeData.body}
              onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-3.5 md:py-4 text-xs md:text-sm font-medium text-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 md:pt-4 flex flex-col md:flex-row gap-3 md:gap-4">
            <button 
              onClick={handleSendMessage}
              disabled={!composeData.to || !composeData.subject || !composeData.body}
              className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm md:text-base shadow-xl shadow-primary/25 hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 md:gap-3"
            >
              <Send size={18} />
              Enviar Mensagem Oficial
            </button>
            <button 
              onClick={() => {
                if(confirm("Deseja descartar este rascunho?")) setIsComposing(false);
              }}
              className="flex-1 px-8 py-3.5 md:py-4.5 rounded-2xl font-bold text-xs md:text-sm text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Descartar
            </button>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4 p-4 md:p-5 bg-primary/5 rounded-[24px] border border-primary/10 items-start">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-primary font-black text-[10px] md:text-sm uppercase tracking-wider mb-1">Criptografia de Ponta a Ponta</h4>
            <p className="text-[11px] md:text-sm text-slate-600 leading-relaxed">
              Esta mensagem será assinada digitalmente com o seu BI <strong>{bi}</strong>. A comunicação é encriptada e os destinatários são obrigados a responder nos termos da Lei do Cidadão Digital.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Mail size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-primary leading-tight">Correio Digital</h3>
            <p className="text-[10px] md:text-sm text-slate-600 font-black uppercase tracking-widest">{unreadTotal} mensagens por ler</p>
          </div>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-primary text-white rounded-2xl px-6 py-3.5 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs md:text-sm font-black"
        >
          <Plus size={18} />
          Nova Mensagem
        </button>
      </div>

      {/* Filters & Tabs Container */}
      <div className="bg-white border border-slate-300 rounded-[32px] p-2.5 shadow-sm flex flex-col lg:flex-row gap-3">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl lg:min-w-[420px]">
          {[
            { id: 'lidas', label: 'Lidas', count: inbox.filter(m => !m.unread).length, color: 'text-emerald-700 font-bold', dot: 'bg-emerald-750' },
            { id: 'naoLidas', label: 'Não Lidas', count: inbox.filter(m => m.unread).length, color: 'text-red-750 font-bold', dot: 'bg-red-750' },
            { id: 'enviadas', label: 'Enviadas', count: sentMessages.length, color: 'text-blue-750 font-bold', dot: 'bg-blue-750' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setCorrespondenciaTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-tight transition-all ${
                correspondenciaTab === t.id 
                  ? `bg-white ${t.color} shadow-md shadow-slate-300 ring-2 ring-slate-200` 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-black ${
                  correspondenciaTab === t.id ? `${t.dot} text-white` : 'bg-slate-300 text-slate-700'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-550" size={16} />
          <input 
            type="text"
            placeholder="Pesquisar correspondência oficial..."
            value={searchMail}
            onChange={(e) => setSearchMail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/30 transition-all outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Message List */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6">
          <div>
            <h4 className="font-black text-slate-900 text-lg md:text-xl italic uppercase tracking-tight flex items-center gap-2">
              <Mail size={20} className="text-indigo-600" />
              {isInst ? 'Correio Institucional: Expediente de Entrada' : 'Correio Oficial Digital: Caixa de Entrada'}
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              {isInst ? 'Gestão de submissões de cidadãos, requerimentos e auditorias pendentes de resposta' : 'Consulta e acompanhamento de certidões, avisos, pendências tributárias e faturas oficiais'}
            </p>
          </div>
        </div>

        {filteredMessages.length > 0 ? (
          <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[500px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-primary">
                <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="py-4 px-5 rounded-l-2xl">{isInst ? 'CIDADÃO / REQUERENTE' : 'ÓRGÃO EMISSOR'}</th>
                  <th className="py-4 px-5">ASSUNTO TEMA</th>
                  <th className="py-4 px-5">CONTEÚDO / DETALHE</th>
                  <th className="py-4 px-5">DATA DE EXPIRAÇÃO</th>
                  <th className="py-4 px-5 text-center">HORA / DATA</th>
                  <th className="py-4 px-5 text-center">PRIORIDADE</th>
                  <th className="py-4 px-5 text-center rounded-r-2xl">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredMessages.map((item) => {
                  const isUrgente = item.status === 'Urgente' || item.priorityScale === 'Crítico' || item.priorityScale === 'Urgente';
                  return (
                    <tr key={item.id} className="text-xs text-[#334155] hover:bg-slate-50/60 transition-colors">
                      {/* Cidadão / Órgão Emissor Column */}
                      <td className="py-5 px-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              item.unread 
                                ? 'bg-[#fff5f5] text-[#e05252] border border-[#fdd8d8]' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {item.unread ? 'Não Lida' : 'Lida'}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getOrgBadgeStyles(item.org)}`}>
                              {item.org.toUpperCase().startsWith('SOC - ') ? 'SOC' : item.org}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 font-mono">ID: #{item.id}</span>
                            {item.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] inline-block animate-pulse shrink-0" />
                            )}
                          </div>
                          <div className="font-black italic text-slate-900 text-[11px] md:text-sm uppercase tracking-tight leading-none">
                            {isInst 
                              ? item.org
                                  .replace(/^Cidadão:\s*Cidadão:\s*/i, '')
                                  .replace(/^CIDADÃO:\s*CIDADÃO:\s*/i, '')
                                  .replace(/^CIDADÃO:\s*Cidadão:\s*/i, '')
                                  .replace(/^Cidadão:\s*CIDADÃO:\s*/i, '')
                                  .replace(/^Cidadão:\s*/i, '')
                                  .replace(/^CIDADÃO:\s*/i, '')
                              : (item.org.startsWith('SOC - ') 
                                  ? item.org.replace('SOC - ', '') 
                                  : `ÓRGÃO: ${item.org}`
                                )
                            }
                          </div>
                        </div>
                      </td>

                      {/* Assunto Tema Column */}
                      <td className="py-5 px-5">
                        <div className="space-y-1 text-left">
                          <div className="font-extrabold text-[#1e293b] text-xs md:text-sm tracking-tight">
                            {item.details?.subject || item.preview.substring(0, 30)}
                          </div>
                          <div className="text-[9px] text-[#94a3b8] font-black uppercase tracking-widest leading-none">
                            {isInst ? 'REQUERIMENTO FISCAL' : (item.protocol?.category || 'NOTIFICAÇÃO DIGITAL')}
                          </div>
                        </div>
                      </td>

                      {/* Conteúdo / Detalhe Column */}
                      <td className="py-5 px-5">
                        <div className="text-[#64748b] text-[11px] font-medium max-w-[280px] break-words whitespace-normal leading-relaxed" title={item.preview}>
                          {item.preview}
                        </div>
                      </td>

                      {/* Data de Expiração Column */}
                      <td className="py-5 px-5">
                        <div className="flex items-center">
                          <span className="inline-flex items-center gap-1.5 text-[#e05252] text-[9px] font-semibold tracking-wider font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] animate-pulse shrink-0" />
                            EXPIRA: {item.details?.deadline || item.protocol?.deadlineDate || '30 DE JUNHO DE 2026'}
                          </span>
                        </div>
                      </td>

                      {/* Hora / Data Column */}
                      <td className="py-5 px-5 text-center">
                        <div className="text-slate-800 font-bold font-mono text-[11px] tracking-tight">
                          {item.protocol?.officialTime || '11:00'}
                          <div className="text-[9.5px] font-bold text-slate-400 font-sans mt-0.5">{item.date}</div>
                        </div>
                      </td>

                      {/* Prioridade Column */}
                      <td className="py-5 px-5 text-center">
                        <span className={`text-[9px] font-black uppercase tracking-widest leading-none inline-block ${
                          isUrgente
                            ? 'text-[#e05252]'
                            : 'text-indigo-600'
                        }`}>
                          {isUrgente ? 'Urgente' : 'Normal'}
                        </span>
                      </td>

                      {/* Ações Column */}
                      <td className="py-5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectMessage(item)}
                          className="text-[9.5px] font-black uppercase text-indigo-650 hover:text-indigo-850 transition-colors tracking-widest hover:underline cursor-pointer bg-transparent border-0 outline-none"
                        >
                          {isInst ? 'ANALISAR PLEITO' : 'ABRIR OFÍCIO'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] md:rounded-[32px] p-12 md:p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-200">
              <Mail size={32} />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-600 uppercase">Silêncio de Comunicações</h4>
              <p className="text-xs md:text-sm text-slate-600 font-bold">
                {searchMail ? `Nenhuma mensagem localizada para "${searchMail}"` : 'Todas as correspondências oficiais e petições encontram-se despachadas.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
