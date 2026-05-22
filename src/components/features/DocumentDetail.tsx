/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, Download, ShieldCheck, QrCode, Info, ExternalLink, Printer } from 'lucide-react';
import { Document } from '../../types';
import { USER_PROFILE_PHOTO } from '../../constants/data';

interface DocumentDetailProps {
  selectedDoc: Document;
  setSelectedDoc: (doc: Document | null) => void;
  setTab: (tab: string) => void;
  logSecurityEvent?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export function DocumentDetail({
  selectedDoc,
  setSelectedDoc,
  setTab,
  logSecurityEvent,
}: DocumentDetailProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => {
            setSelectedDoc(null);
            setTab('carteira');
          }}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-base md:text-xl font-black text-primary leading-none">Visualizar Documento</h3>
          <p className="text-[10px] md:text-sm text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {selectedDoc.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
        {/* Document Preview Card */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[1.6/1] w-full bg-slate-900 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl p-6 md:p-10 text-white border-2 border-white/5">
             <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                <svg width="100%" height="100%"><pattern id="grid-doc" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid-doc)" /></svg>
             </div>
             
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-md mb-2" />
                      <h4 className="text-lg md:text-2xl font-black tracking-tight">{selectedDoc.name}</h4>
                      <p className="text-[10px] md:text-xs font-bold text-white/50 tracking-widest uppercase">República de Angola</p>
                   </div>
                   <img 
                      src={USER_PROFILE_PHOTO} 
                      alt="Foto BI" 
                      className="w-14 h-18 md:w-24 md:h-30 rounded-xl md:rounded-2xl border-2 border-white/20 object-cover shadow-lg"
                      referrerPolicy="no-referrer"
                   />
                </div>

                <div className="space-y-4 md:space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">NÚMERO DO DOCUMENTO</label>
                         <div className="text-sm md:text-xl font-mono font-bold tracking-[0.2em]">{selectedDoc.number || '009874562LA041'}</div>
                      </div>
                      <div className="text-right">
                         <label className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">CÓDIGO DIGITAL</label>
                         <div className="text-[#FFD700] font-mono font-bold text-sm md:text-lg">{selectedDoc.code}</div>
                      </div>
                   </div>
                   
                   <div className="flex justify-between items-end border-t border-white/10 pt-4 md:pt-6">
                      <div>
                         <label className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">TITULAR</label>
                         <div className="text-sm md:text-lg font-black uppercase tracking-tight">{selectedDoc.holder}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <div className="text-[8px] md:text-[10px] font-black bg-success/20 text-success px-2 py-0.5 rounded-full border border-success/30 uppercase tracking-widest">
                            Autêntico
                         </div>
                         <div className="text-[8px] font-bold text-white/40">{selectedDoc.validity}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
             {[
                { label: 'Baixar PDF', icon: <Download size={20} />, color: 'bg-primary text-white', action: () => logSecurityEvent?.(`Cidadão baixou cópia PDF: ${selectedDoc.name}`, 'info') },
                { label: 'Imprimir', icon: <Printer size={20} />, color: 'bg-slate-100 text-slate-600', action: () => logSecurityEvent?.(`Cidadão enviou para impressão: ${selectedDoc.name}`, 'info') },
                { label: 'Partilhar', icon: <ExternalLink size={20} />, color: 'bg-slate-100 text-slate-600', action: () => logSecurityEvent?.(`Tentativa de partilha de documento: ${selectedDoc.name}`, 'warning') },
                { label: 'Histórico', icon: <ClockIcon size={20} />, color: 'bg-slate-100 text-slate-600', action: () => {} },
             ].map((btn, i) => (
                <button 
                  key={i} 
                  onClick={btn.action}
                  className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl gap-2 md:gap-3 transition-all hover:scale-105 active:scale-95 ${btn.color} shadow-sm`}
                >
                   {btn.icon}
                   <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">{btn.label}</span>
                </button>
             ))}
          </div>
        </div>

        {/* Info & Metadata */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
           <div className="bg-white border border-line rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-lg md:text-xl font-black text-primary leading-tight">Certificação</h4>
                    <p className="text-[10px] md:text-sm text-slate-400 font-black uppercase tracking-widest">Validade Jurídica Total</p>
                 </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                 {[
                    { label: 'Emitido por', value: selectedDoc.issuer },
                    { label: 'Data de Emissão', value: selectedDoc.issuedAt },
                    { label: 'Estado do Documento', value: 'Vigente / Activo', color: 'text-success' },
                    { label: 'Validado Via QR', value: 'Sim, há 2 horas' }
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start group">
                       <div>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className={`text-sm md:text-base font-bold tracking-tight ${item.color || 'text-primary'}`}>{item.value}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-line/60 flex flex-col items-center gap-4">
                 <div className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-line">
                    <QrCode size={100} className="md:w-[140px] md:h-[140px] text-primary opacity-90" />
                 </div>
                 <p className="text-center text-[10px] md:text-xs text-slate-500 font-medium px-4">
                    Este QR Code permite a qualquer autoridade verificar a autenticidade deste documento em tempo real.
                 </p>
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-[28px] p-5 flex gap-4">
              <Info size={20} className="text-primary shrink-0" />
              <p className="text-[11px] md:text-xs text-primary font-bold leading-relaxed">
                 O uso de documentos digitais é facultativo, mas possui a mesma força probatória que os documentos físicos originais.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClockIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
