/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  ShieldCheck, 
  FileText, 
  Info 
} from 'lucide-react';
import { Message } from '../../types';

interface MessageDetailProps {
  selectedMessage: Message;
  setSelectedMessage: (msg: Message | null) => void;
  setTab: (tab: string) => void;
  handleReply: (msg: Message) => void;
}

export function MessageDetail({
  selectedMessage,
  setSelectedMessage,
  setTab,
  handleReply,
}: MessageDetailProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => {
            setTab('correspondencias');
            setSelectedMessage(null);
          }}
          className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <button 
          onClick={() => handleReply(selectedMessage)}
          className="text-primary px-4 py-2 rounded-xl font-extrabold hover:bg-primary/5 transition-all active:scale-95 text-sm"
        >
          Responder
        </button>
      </div>

      <section className="border border-line rounded-2xl p-5 bg-white shadow-sm">
        <AnimatePresence mode="wait">
          {activeAction ? (
            <motion.div 
              key="action-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-line">
                <button 
                  onClick={() => setActiveAction(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} className="text-slate-500" />
                </button>
                <div>
                  <h4 className="font-bold text-primary">{activeAction}</h4>
                  <p className="text-sm text-slate-600 uppercase tracking-wider">{selectedMessage.org}</p>
                </div>
              </div>

              {['Ver detalhes', 'Ler notificacao', 'Ler boletim', 'Abrir resultado', 'Ler resultado', 'Mais informacoes'].includes(activeAction) ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-line shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <FileText size={20} />
                      <span className="font-bold">Conteúdo do Documento</span>
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-medium">
                      {selectedMessage.details?.body}
                    </p>
                  </div>
                  
                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                    <ShieldCheck size={24} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-bold text-primary mb-1">Documento Autenticado</p>
                      <p className="text-sm text-primary/70 leading-tight">
                        Este conteúdo foi extraído diretamente da base oficial do Estado Angolano e possui plena validade jurídica como prova digital.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-line">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Info size={20} className="text-primary" />
                      </div>
                      <div className="font-bold text-primary">Processando Solicitação</div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      A funcionalidade <strong>"{activeAction}"</strong> está a carregar os dados seguros da base governamental. 
                      Este processo garante que toda a informação apresentada é oficial e verificada em tempo real.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="p-4 border border-line rounded-xl flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700">Estado do Pedido</div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">Verificado</span>
                    </div>
                    <div className="p-4 border border-line rounded-xl flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700">Autenticação Digital</div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">Encriptado</span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setActiveAction(null)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {['Ver detalhes', 'Ler notificacao', 'Ler boletim', 'Abrir resultado', 'Ler resultado', 'Mais informacoes'].includes(activeAction) ? 'Fechar Leitura' : 'OK, Entendi'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="pb-3 border-b border-line mb-4">
                <h3 className="text-sm md:text-lg font-bold text-primary">{selectedMessage.org}</h3>
                <div className="text-slate-600 text-[10px] md:text-sm font-medium">
                  Canal oficial verificado
                </div>
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed font-medium text-[11px] md:text-base">{selectedMessage.preview}</p>
              
              {selectedMessage.details && (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-3xl border border-line p-5 md:p-8 shadow-sm flex flex-col items-start text-left">
                      <div className={`w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-5 md:mb-6 shadow-lg transition-transform hover:scale-105 ${
                        (selectedMessage.details.state?.toLowerCase().includes('pendente') ?? false) 
                        ? 'bg-orange-500 shadow-orange-100' 
                        : 'bg-green-500 shadow-green-100'
                      }`}>
                        {(selectedMessage.details.state?.toLowerCase().includes('pendente') ?? false) ? (
                          <Clock className="text-white w-7 h-7 md:w-12 md:h-12" />
                        ) : (
                          <Check className="text-white w-7 h-7 md:w-12 md:h-12" strokeWidth={3} />
                        )}
                      </div>
                      
                      <h3 className="text-base md:text-2xl font-extrabold text-primary mb-2">
                        {selectedMessage.details.subject}
                      </h3>
                      
                      <div className="w-full space-y-4 md:space-y-5 mb-8 text-left max-w-sm">
                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <Calendar size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Data Limite</small>
                            <div className="text-xs md:text-sm font-bold text-primary">{selectedMessage.details.deadline}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <Clock size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Estado do Documento</small>
                            <div className="text-xs md:text-sm font-bold text-orange-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                              {selectedMessage.details.state}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <MapPin size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Entidade Emissora</small>
                            <div className="text-xs md:text-sm font-bold text-primary leading-tight">{selectedMessage.org}</div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveAction('Ver detalhes')}
                        className="w-full py-3.5 md:py-4 rounded-2xl bg-primary text-white font-bold text-xs md:text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Ver detalhes
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-3xl border border-line/60 lg:w-[320px] shrink-0">
                      <div className="text-sm font-extrabold text-slate-600 uppercase tracking-[0.2em] mb-4 md:mb-6">QR CODE DE AUTENTICIDADE</div>
                      <div className="p-3 md:p-4 bg-white border border-line/40 rounded-2xl shadow-md group relative overflow-hidden">
                        <motion.img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AO-MSG-SECURE&color=0e2b64" 
                          alt="QR Code Seguro" 
                          className="w-40 h-40 md:w-48 md:h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <small className="text-slate-400 text-sm font-bold tracking-widest uppercase">Acções Complementares</small>
                      <div className="flex-1 h-px bg-line/30" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedMessage.details.actions.filter(act => act !== 'Ver detalhes').map((act, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActiveAction(act)}
                          className="flex-1 whitespace-nowrap min-w-[140px] bg-white border border-primary/10 text-primary rounded-xl py-3.5 px-4 text-xs font-bold hover:bg-primary/5 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
