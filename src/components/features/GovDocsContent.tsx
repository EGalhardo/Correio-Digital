import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Search, FileText, Calendar, Building2, Download, ExternalLink, X, Clock, ArrowUpAZ, ArrowDownAZ, BarChart3, ShieldCheck, User, Check, XCircle, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Document as DocumentType, DocRequest } from '../../types';

interface GovDocsContentProps {
  documents: DocumentType[];
  requests: DocRequest[];
  onUpdateStatus: (id: number, status: 'Aprovado' | 'Rejeitado') => void;
}

export function GovDocsContent({ documents, requests, onUpdateStatus }: GovDocsContentProps) {
  const [activeView, setActiveView] = useState<'requests' | 'archive'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ id: string, message: string } | null>(null);

  const stats = useMemo(() => {
    const pending = requests.filter(r => r.status === 'Pendente').length;
    const approved = requests.filter(r => r.status === 'Aprovado').length;
    return { pending, approved };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const term = searchTerm?.toLowerCase() || '';
    return requests.filter(r => 
      (r.userName?.toLowerCase().includes(term) ?? false) ||
      (r.userBi?.toLowerCase().includes(term) ?? false) ||
      (r.docType?.toLowerCase().includes(term) ?? false)
    );
  }, [requests, searchTerm]);

  const filteredArchive = useMemo(() => {
    const term = searchTerm?.toLowerCase() || '';
    return documents.filter(doc => 
      (doc.holder?.toLowerCase().includes(term) ?? false) ||
      (doc.code?.toLowerCase().includes(term) ?? false)
    );
  }, [documents, searchTerm]);

  const triggerFeedback = (message: string) => {
    const id = Math.random().toString(36);
    setActionFeedback({ id, message });
    setTimeout(() => {
      setActionFeedback(prev => prev?.id === id ? null : prev);
    }, 3000);
  };

  const handleAction = (id: number, status: 'Aprovado' | 'Rejeitado') => {
    onUpdateStatus(id, status);
    triggerFeedback(status === 'Aprovado' ? 'Documento emitido e enviado com sucesso!' : 'Solicitação rejeitada pelo sistema.');
  };

  return (
    <div className="pb-32 md:pt-2">
      {/* Feedback Toast */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="text-[11px] font-black uppercase tracking-widest">{actionFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-slate-100 mb-8">
        <div className="flex items-center gap-5">
          <div className="shrink-0 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <img 
               src="https://i.postimg.cc/1XDX0qsQ/agt.png" 
               alt="AGT Logo" 
               className="w-20 md:w-24 object-contain"
               referrerPolicy="no-referrer"
             />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-sans">Controle de Actos Digitais</h1>
            <div className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
               <div className="w-1 h-2 bg-red-600 rounded-full" />
               AGT &bull; Terminal de Validação CDA
            </div>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1.5 rounded-[22px] border border-slate-200">
           <button 
             onClick={() => setActiveView('requests')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
               activeView === 'requests' ? 'bg-white text-primary shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             Solicitações
             {stats.pending > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-[8px] animate-pulse">{stats.pending}</span>}
           </button>
           <button 
             onClick={() => setActiveView('archive')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
               activeView === 'archive' ? 'bg-white text-primary shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             Arquivo Morto
           </button>
        </div>
      </div>

      {/* KPI Section */}
      {activeView === 'requests' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendente de Análise</div>
             <div className="text-3xl font-black text-slate-950 italic tracking-tighter">{stats.pending} Pedidos</div>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aprovados Hoje</div>
             <div className="text-3xl font-black text-emerald-600 italic tracking-tighter">{stats.approved} Emissões</div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] shadow-sm flex items-center justify-between">
             <div>
               <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Status do Sistema</div>
               <div className="text-xl font-black text-primary italic tracking-tighter uppercase">Disponível</div>
             </div>
             <ShieldCheck className="text-primary opacity-20" size={40} />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-2.5 rounded-[32px] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder={activeView === 'requests' ? "Procurar por nome, bi ou tipo de documento..." : "Localizar documento no arquivo histórico..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none transition-all text-sm"
          />
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 italic border-l border-slate-100">
          <AlertCircle size={18} className="text-red-500" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Painel Restrito &bull; Nível 3</span>
        </div>
      </div>

      {/* View Content */}
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {activeView === 'requests' ? (
            <motion.div 
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-5"
            >
              {filteredRequests.length > 0 ? filteredRequests.map((req, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={req.id}
                  className="bg-white p-4 md:p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-xl hover:border-primary/10 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-105 shadow-xl ${
                      req.status === 'Pendente' ? 'bg-orange-50 text-orange-500 border-orange-100 shadow-orange-100/10' : 
                      req.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100 shadow-emerald-100/10' : 
                      'bg-slate-50 text-slate-400 border-slate-100 shadow-slate-100/10'
                    }`}>
                      <FileText size={24} className={req.status === 'Pendente' ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black text-slate-950 text-lg md:text-xl italic tracking-tighter uppercase leading-none">{req.docType}</h3>
                        <div className="flex items-center gap-1.5">
                          {req.aiStatus === 'pre-approved' && req.status === 'Pendente' && (
                            <div className="flex items-center gap-1 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
                               <Check size={10} strokeWidth={4} /> IA OK
                            </div>
                          )}
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${
                            req.status === 'Pendente' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                            req.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><User size={14} className="text-primary" /> {req.userName}</span>
                        <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><Calendar size={14} className="text-primary" /> {req.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white px-2 py-1 rounded-lg shadow-sm">BI: {req.userBi}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Pendente' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {req.status === 'Pendente' ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAction(req.id, 'Rejeitado')}
                        className="p-3.5 rounded-xl bg-white text-slate-400 border border-slate-200 font-black text-[9px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                        title="Rejeitar Solicitação"
                      >
                        <XCircle size={16} />
                      </button>
                      
                      {req.aiStatus === 'pre-approved' ? (
                        <button 
                          onClick={() => handleAction(req.id, 'Aprovado')}
                          className="px-6 py-4 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} /> Confirmar Decisão
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(req.id, 'Aprovado')}
                          className="px-6 py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> Validar Manual
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 italic tracking-[0.15em] bg-slate-50/50 px-6 py-3.5 rounded-2xl border border-slate-100 border-dashed">
                      Acto Processado <ShieldCheck size={16} className="text-emerald-500 ml-2" />
                    </div>
                  )}
                </motion.div>
              )) : (
                <div className="py-24 text-center bg-slate-50 rounded-[60px] border-4 border-dashed border-slate-100">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-8">
                      <Clock size={40} className="text-slate-200" />
                   </div>
                   <h4 className="text-2xl font-black text-slate-400 italic uppercase tracking-tighter">Nenhuma solicitação em fila</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Aguardando novos pedidos dos cidadãos angolanos</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="archive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredArchive.map((doc, idx) => (
                <motion.div 
                   key={doc.code}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center justify-between group hover:border-primary/20 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-all group-hover:bg-primary/5">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg uppercase italic leading-none mb-2">{doc.name}</h4>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
                         <span className="text-slate-800 italic">{doc.holder}</span>
                         <div className="w-1 h-1 bg-slate-200 rounded-full" />
                         <span>Emitido em {doc.issuedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-primary transition-all">
                      <Download size={20} />
                    </button>
                    <button className="p-3.5 bg-slate-950 rounded-xl text-white hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

