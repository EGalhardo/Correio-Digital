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
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
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
                      {["SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Registo Civil"].map(org => (
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
      <div className="bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm flex flex-col lg:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl lg:min-w-[420px]">
          {[
            { id: 'naoLidas', label: 'Não Lidas', count: inbox.filter(m => m.unread).length, color: 'text-red-600', dot: 'bg-red-600' },
            { id: 'lidas', label: 'Lidas', count: inbox.filter(m => !m.unread).length, color: 'text-emerald-600', dot: 'bg-emerald-600' },
            { id: 'enviadas', label: 'Enviadas', count: sentMessages.length, color: 'text-blue-600', dot: 'bg-blue-600' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setCorrespondenciaTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-tight transition-all ${
                correspondenciaTab === t.id 
                  ? `bg-white ${t.color} shadow-md shadow-slate-200 ring-1 ring-slate-100` 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                  correspondenciaTab === t.id ? `${t.dot} text-white` : 'bg-slate-300 text-slate-600'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Pesquisar correspondência oficial..."
            value={searchMail}
            onChange={(e) => setSearchMail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-3 md:space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((item, index) => {
              const activeColorClass = 
                correspondenciaTab === 'naoLidas' ? 'bg-red-500' :
                correspondenciaTab === 'lidas' ? 'bg-emerald-500' : 'bg-blue-500';
              
              const activeTextClass = 
                correspondenciaTab === 'naoLidas' ? 'text-red-600' :
                correspondenciaTab === 'lidas' ? 'text-emerald-600' : 'text-blue-600';

              const activeBgLight = 
                correspondenciaTab === 'naoLidas' ? 'bg-red-50' :
                correspondenciaTab === 'lidas' ? 'bg-emerald-50' : 'bg-blue-50';

              return (
                <motion.button 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelectMessage(item)}
                  className="w-full text-left bg-white border border-slate-100 rounded-2xl p-4 md:p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${activeColorClass} opacity-80`} />

                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl ${activeBgLight} flex items-center justify-center text-[10px] font-black ${activeTextClass} shadow-sm border border-black/5`}>
                          {item.org.substring(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 font-black text-sm md:text-lg italic tracking-tighter uppercase">{item.org}</strong>
                             {item.unread && <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />}
                          </div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mt-1">Órgão Governamental</p>
                        </div>
                      </div>
                      
                      <div className="pl-13">
                        <h4 className="text-xs md:text-base font-black text-slate-800 line-clamp-1 mb-1 tracking-tight">
                          {item.details?.subject || item.preview.substring(0, 60)}
                        </h4>
                        <p className="text-slate-700 text-[11px] md:text-sm font-medium line-clamp-2 md:line-clamp-1 leading-relaxed">
                          {item.preview}
                        </p>
                        {item.protocol && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/60 text-indigo-700 font-mono text-[9px] font-black px-2 py-0.5 rounded-md">
                              <Fingerprint size={10} className="text-indigo-500 animate-pulse" />
                              {item.protocol.protocolNumber}
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black border border-rose-200 bg-rose-50 text-rose-800 shadow-xs uppercase tracking-wider">
                              <Clock size={11} className="text-rose-500 animate-pulse" />
                              Expiração: {item.details?.deadline || item.protocol?.deadlineDate || 'Sem prazo definido'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 font-black text-[9px] md:text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Clock size={12} />
                        {item.date}
                      </div>
                      
                      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
                         {item.status === 'Urgente' && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-red-600 text-white uppercase tracking-widest shadow-lg shadow-red-100">
                              Prioritário
                            </span>
                          )}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-slate-100 ${activeTextClass} hover:bg-slate-200`}>
                          <ArrowLeft className="rotate-180" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] md:rounded-[32px] p-12 md:p-20 text-center space-y-4"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-200">
                <Mail size={32} className="md:w-10 md:h-10" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-black text-slate-600">Silêncio no Horizonte</h4>
                <p className="text-xs md:text-sm text-slate-600 font-bold">
                  {searchMail ? `Nenhuma mensagem encontrada para "${searchMail}"` : 'Você está em dia com todas as suas comunicações oficiais.'}
                </p>
              </div>
              {searchMail && (
                <button 
                  onClick={() => setSearchMail('')}
                  className="text-primary font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline"
                >
                  Limpar Pesquisa
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
