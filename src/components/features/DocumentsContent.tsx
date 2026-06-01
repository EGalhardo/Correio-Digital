/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Folder, 
  Plus, 
  Search, 
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
  Building2
} from 'lucide-react';
import { Message } from '../../types';

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

interface DocumentsContentProps {
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

export function DocumentsContent({
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
}: DocumentsContentProps) {
  const [selectedInst, setSelectedInst] = useState<string>('Todas');

  const allDocsCombined = useMemo(() => {
    return [...inbox, ...sentMessages];
  }, [inbox, sentMessages]);

  const getCountForInst = (name: string) => {
    if (name === 'Todas') return allDocsCombined.length;
    const term = name.toLowerCase();
    return allDocsCombined.filter(item => {
      const orgName = item.org?.toLowerCase() || '';
      const subjectText = item.details?.subject?.toLowerCase() || '';
      const categoryText = item.protocol?.category?.toLowerCase() || '';
      return orgName.includes(term) || subjectText.includes(term) || categoryText.includes(term);
    }).length;
  };

  const finalFilteredDocs = useMemo(() => {
    if (selectedInst === 'Todas') return allDocsCombined;
    const term = selectedInst.toLowerCase();
    return allDocsCombined.filter(item => {
      const orgName = item.org?.toLowerCase() || '';
      const subjectText = item.details?.subject?.toLowerCase() || '';
      const categoryText = item.protocol?.category?.toLowerCase() || '';
      return orgName.includes(term) || subjectText.includes(term) || categoryText.includes(term);
    });
  }, [allDocsCombined, selectedInst]);

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
            <span>Voltar aos Documentos</span>
          </button>
          <div>
            <h3 className="text-base md:text-xl font-black text-primary leading-none">Novo Documento Oficial</h3>
            <p className="text-[9px] md:text-[10px] text-slate-700 font-black uppercase tracking-widest mt-1">Submissão Oficial Homologada</p>
          </div>
        </div>

        <div className="bg-white border border-line rounded-[24px] md:rounded-[32px] p-5 md:p-10 shadow-sm space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">
                {isInst ? 'Destinatário do Documento' : 'Destinatário Institucional'}
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
              <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">Assunto / Título do Documento</label>
              <input 
                type="text"
                placeholder="Qual o tipo ou assunto do documento?"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-3.5 md:py-4 text-xs md:text-sm font-bold text-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-sm font-black text-slate-600 uppercase tracking-widest pl-1">Conteúdo principal / Teor do Documento</label>
            <textarea 
              rows={8}
              placeholder="Descreva detalhadamente o teor e dados do documento oficial..."
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
              Submeter Documento Oficial
            </button>
            <button 
              onClick={() => {
                if(confirm("Deseja descartar este rascunho de documento?")) setIsComposing(false);
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
            <h4 className="text-primary font-black text-[10px] md:text-sm uppercase tracking-wider mb-1">Criptografia e Assinatura Militar do Estado</h4>
            <p className="text-[11px] md:text-sm text-slate-600 leading-relaxed">
              Este arquivo de documento será assinado digitalmente com o seu BI <strong>{bi}</strong>. O documento possui plena validade regulamentar, encriptação estatal e integridade com carimbo de tempo inviolável.
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
            <Folder size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-primary leading-tight">Documentos Digitais</h3>
            <p className="text-[10px] md:text-sm text-slate-600 font-black uppercase tracking-widest">{unreadTotal} novos arquivados</p>
          </div>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-primary text-white rounded-2xl px-6 py-3.5 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs md:text-sm font-black"
        >
          <Plus size={18} />
          Submeter Documento
        </button>
      </div>

      {/* 1. Contentor "Instituições Conectadas" */}
      <section className="bg-white border border-slate-200 rounded-[32px] p-5 md:p-6 shadow-sm overflow-hidden relative group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-slate-950 font-black text-xs md:text-sm italic tracking-tighter uppercase">Instituições Conectadas</h3>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-100">Canais Digitais de Interoperabilidade</div>
        </div>
        
        <div className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto custom-scrollbar-h pb-2">
          {["Todas", "SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Registo Civil", "INE", "Ministérios"].map((name) => {
            const isActive = selectedInst === name;
            const countForInst = getCountForInst(name);
            return (
              <button 
                key={name}
                onClick={() => setSelectedInst(name)}
                className={`px-5 py-3 rounded-2xl text-[11px] md:text-xs font-black uppercase transition-all cursor-pointer shrink-0 shadow-sm text-left flex items-center gap-2.5 border ${
                  isActive 
                    ? 'bg-primary border-primary text-white shadow-lg' 
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Building2 size={13} className={isActive ? 'text-white/80' : 'text-slate-400'} />
                <span>{name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-indigo-950 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {countForInst}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Message List */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6">
          <div>
            <h4 className="font-black text-slate-900 text-lg md:text-xl italic uppercase tracking-tight flex items-center gap-2">
              <FolderOpen size={20} className="text-indigo-600" />
              {isInst ? 'Repositório de Documentos: Expediente de Entrada' : 'Pasta Digital de Documentos Homologados'}
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              {isInst ? 'Gestão de submissões de cidadãos, requerimentos de certidão e documentos para validação administrativa' : 'Consulta e acompanhamento de certidões, autenticações de assinatura, alvarás digitais e termos oficiais'}
            </p>
          </div>
        </div>

        {finalFilteredDocs.length > 0 ? (
          <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[500px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-primary">
                <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="py-4 px-5 rounded-l-2xl">{isInst ? 'CIDADÃO / REQUERENTE' : 'ÓRGÃO EMISSOR'}</th>
                  <th className="py-4 px-5">TIPO DE DOCUMENTO / ASSUNTO</th>
                  <th className="py-4 px-5">CONTEÚDO / DETALHE</th>
                  <th className="py-4 px-5">PRAZO DE VALIDADE</th>
                  <th className="py-4 px-5 text-center">EMISSÃO (HORA / DATA)</th>
                  <th className="py-4 px-5 text-center">NÍVEL DE RESTRICÇÃO</th>
                  <th className="py-4 px-5 text-center rounded-r-2xl">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {finalFilteredDocs.map((item) => {
                  const isUrgente = item.status === 'Urgente' || item.priorityScale === 'Crítico' || item.priorityScale === 'Urgente';
                  return (
                    <tr key={item.id} className="text-xs text-[#334155] hover:bg-slate-50/60 transition-colors">
                      {/* Cidadão / Órgão Emissor Column */}
                      <td className="py-5 px-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              item.unread 
                                ? 'bg-[#fff5f5] text-[#e05252] border border-[#fdd8d8]' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {item.unread ? 'Não Lido' : 'Consultado'}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 font-mono">DOC: #{item.id}</span>
                            {item.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] inline-block animate-pulse shrink-0" />
                            )}
                          </div>
                          <div className="font-black italic text-slate-900 text-[11px] md:text-sm uppercase tracking-tight leading-none">
                            {isInst 
                              ? `CIDADÃO: ${item.org}` 
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
                            {isInst ? 'REQUERIMENTO DE CERTIDÃO' : (item.protocol?.category || 'PROVA DE VIDA DIGITAL')}
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
                            EXPIRA: {item.details?.deadline || item.protocol?.deadlineDate || 'UNLIMITED'}
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
                          {item.sensitivity || (isUrgente ? 'Restrito' : 'Público')}
                        </span>
                      </td>

                      {/* Ações Column */}
                      <td className="py-5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectMessage(item)}
                          className="text-[9.5px] font-black uppercase text-indigo-650 hover:text-indigo-850 transition-colors tracking-widest hover:underline cursor-pointer bg-transparent border-0 outline-none"
                        >
                          {isInst ? 'ANALISAR DOCUMENTO' : 'ABRIR DOCUMENTO'}
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
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-400 border border-slate-200">
              <Folder size={32} />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-600 uppercase">Sem Documentos Registados</h4>
              <p className="text-xs md:text-sm text-slate-600 font-bold">
                {selectedInst !== 'Todas' ? `Nenhum documento localizado para "${selectedInst}"` : 'Todas certidões, alvarás, notificações administrativas validadas constam como arquivadas.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
