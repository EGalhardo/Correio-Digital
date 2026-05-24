/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, FileText, Send, Clock } from 'lucide-react';
import { HIGHLIGHT_SLIDES, GOV_HIGHLIGHT_SLIDES } from '../../constants/data';
import { Message } from '../../types';

interface HomeContentProps {
  activeSlide: number;
  setActiveSlide: (slide: number) => void;
  isMobile: boolean;
  setTab: (tab: string) => void;
  unreadTotal: number;
  inbox: Message[];
  sentMessages: Message[];
  handleSelectMessage: (msg: Message) => void;
  onCreateRequest?: (type: string, priority: 'Alta' | 'Média' | 'Baixa') => void;
  isInst?: boolean;
}

export function HomeContent({
  activeSlide,
  setActiveSlide,
  isMobile,
  setTab,
  unreadTotal,
  inbox,
  sentMessages,
  handleSelectMessage,
  onCreateRequest,
  isInst
}: HomeContentProps) {
  const slides = isInst ? GOV_HIGHLIGHT_SLIDES : HIGHLIGHT_SLIDES;
  const currentSlide = slides[activeSlide % slides.length];

  return (
    <div className="grid gap-3 md:gap-3.5">
      <section className="relative h-[320px] md:h-[504px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl border border-line/60">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isInst ? 'gov' : 'user'}-${activeSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <motion.img 
              src={isMobile && currentSlide.mobileImage 
                ? currentSlide.mobileImage 
                : currentSlide.image
              } 
              alt={currentSlide.title}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="w-full h-full object-cover object-center"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i % slides.length)}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeSlide % slides.length === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Summary / Security Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200 rounded-[28px] md:rounded-[32px] p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={80} />
          </div>
          <div className={`w-12 h-12 md:w-16 md:h-16 ${isInst ? 'bg-white border-slate-100' : 'bg-emerald-50 border-emerald-100'} rounded-2xl flex items-center justify-center shadow-sm shrink-0 border`}>
            {isInst ? (
              <img 
                src="https://i.postimg.cc/1XDX0qsQ/agt.png" 
                alt="AGT" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ShieldCheck size={24} className="md:w-8 md:h-8 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 truncate">ID Digital</div>
            <div className="text-base md:text-xl font-black text-slate-900 leading-tight italic tracking-tighter">
              {isInst ? 'Agente AGT Verificado' : 'Cidadão Verificado'}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isInst ? 'bg-red-600' : 'bg-emerald-500'} animate-pulse`} />
              <span className="text-[9px] md:text-xs font-bold text-slate-700">Protocolo Ativado 100%</span>
            </div>
          </div>
        </div>
        
        <div 
          role="button"
          onClick={() => setTab('correspondencias')}
          className="bg-white border border-slate-200 rounded-[28px] md:rounded-[32px] p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Mail size={80} />
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform border border-primary/10">
            <Mail size={24} className="md:w-8 md:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 truncate">Novas Mensagens</div>
            <div className="text-base md:text-xl font-black text-slate-900 leading-tight italic tracking-tighter">{unreadTotal} Não Lidas</div>
            <div className="text-[9px] md:text-xs text-primary font-bold mt-1">Ver Correspondências &rarr;</div>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 shadow-sm overflow-hidden relative group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-6 bg-primary rounded-full" />
             <h3 className="text-slate-950 font-black text-xs md:text-base italic tracking-tighter uppercase">Instituições Conectadas</h3>
          </div>
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Governação Electrónica</div>
        </div>
        <div className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto custom-scrollbar-h pb-2">
          {["SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Ministerios", "Polícia Nacional", "Notário", "Registo Civil", "Seguro Social", "Administradoras"].map((name) => (
            <button 
              key={name} 
              onClick={() => {
                if (name === "AGT") {
                   onCreateRequest?.("NIF", "Média");
                } else if (name === "SME") {
                   onCreateRequest?.("Visto/BI", "Alta");
                }
              }}
              className="px-4 py-2 rounded-xl text-[10px] md:text-xs font-black bg-slate-50 text-slate-700 border border-slate-200 whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer shrink-0 shadow-sm grow-0 text-left"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${inbox.some(m => m.unread) ? 'xl:grid-cols-3' : 'xl:grid-cols-2'} gap-4`}>
        {inbox.some(m => m.unread) && (
          <section className="bg-white border border-slate-100 rounded-[28px] md:rounded-[32px] p-5 md:p-6 shadow-sm flex flex-col group">
            <div className="flex items-center justify-between mb-5 shrink-0">
               <div className="flex items-center gap-2">
                  <Mail size={16} className="text-red-500" />
                  <h3 className="text-slate-950 font-black text-sm md:text-base italic tracking-tighter uppercase">Não Lidas</h3>
               </div>
               <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-full shadow-sm animate-pulse">LERT</span>
            </div>
            <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {inbox.filter(m => m.unread).map(m => (
                <div key={m.id} role="button" className="flex justify-between items-center text-[12px] md:text-sm border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer px-2 py-1.5 rounded-xl group/item" onClick={() => handleSelectMessage(m)}>
                  <div className="min-w-0 flex-1 truncate mr-3">
                    <span className="font-black text-slate-900 group-hover/item:text-primary transition-colors">{m.org}:</span>
                    <span className="ml-1 text-slate-600 font-medium">{m.preview}</span>
                  </div>
                  <span className="text-white font-black shrink-0 text-[10px] bg-red-600 px-2 py-0.5 rounded-lg shadow-lg shadow-red-100">{m.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white border border-slate-100 rounded-[28px] md:rounded-[32px] p-5 md:p-6 shadow-sm flex flex-col group">
          <div className="flex items-center justify-between mb-5 shrink-0">
             <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" />
                <h3 className="text-slate-950 font-black text-sm md:text-base italic tracking-tighter uppercase">Lidas</h3>
             </div>
             <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Histórico</span>
          </div>
          <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {inbox.filter(m => !m.unread).map(m => (
              <div key={m.id} role="button" className="flex justify-between items-center text-[12px] md:text-sm border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer px-2 py-1.5 rounded-xl group/item" onClick={() => handleSelectMessage(m)}>
                <div className="min-w-0 flex-1 truncate mr-3">
                  <span className="font-bold text-slate-700">{m.org}:</span>
                  <span className="ml-1 text-slate-500 font-medium">{m.preview}</span>
                </div>
                <span className="text-slate-600 font-black shrink-0 text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{m.date}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white border border-slate-100 rounded-[28px] md:rounded-[32px] p-5 md:p-6 shadow-sm flex flex-col group ${inbox.some(m => m.unread) ? 'md:col-span-2 xl:col-span-1' : ''}`}>
          <div className="flex items-center justify-between mb-5 shrink-0">
             <div className="flex items-center gap-2">
                <Send size={16} className="text-blue-500" />
                <h3 className="text-slate-950 font-black text-sm md:text-base italic tracking-tighter uppercase">Enviadas</h3>
             </div>
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {sentMessages.map(m => (
              <div key={m.id} role="button" className="flex justify-between items-center text-[12px] md:text-sm border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer px-2 py-1.5 rounded-xl group/item" onClick={() => handleSelectMessage(m)}>
                <div className="min-w-0 flex-1 truncate mr-3">
                  <span className="font-bold text-slate-700">{m.org}:</span>
                  <span className="ml-1 text-slate-500 font-medium">{m.preview}</span>
                </div>
                <span className="text-blue-600 font-black shrink-0 text-[10px] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{m.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
