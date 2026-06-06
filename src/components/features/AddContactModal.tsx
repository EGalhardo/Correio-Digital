/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Plus, UserPlus, ShieldCheck, Send } from 'lucide-react';

interface AddContactModalProps {
  isAddingContact: boolean;
  setIsAddingContact: (isAdding: boolean) => void;
  contactForm: { name: string; bi: string; relation: string; type?: 'Normal' | 'Emergência' };
  setContactForm: (form: any) => void;
  setShowInviteConfirm: (show: boolean) => void;
}

export function AddContactModal({ 
  isAddingContact, 
  setIsAddingContact, 
  contactForm, 
  setContactForm, 
  setShowInviteConfirm 
}: AddContactModalProps) {
  return (
    <AnimatePresence>
      {isAddingContact && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingContact(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.93, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 15 }}
            className="relative bg-white w-full max-w-md max-h-[92vh] rounded-[40px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] border border-slate-100 flex flex-col overflow-hidden mx-auto p-6 md:p-8 space-y-5"
          >
            {/* Header Area */}
            <div className="flex items-center gap-4 text-left relative shrink-0">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-[20px] flex items-center justify-center shrink-0 border border-amber-100/40 shadow-sm">
                <UserPlus size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-[22px] font-black text-[#0c2340] italic uppercase tracking-tighter leading-none mb-1">
                  Novo Contacto
                </h3>
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest font-sans leading-none">
                  PROTOCOLO DE REDES DE SEGURANÇA
                </p>
              </div>
              {/* Corner close button */}
              <button 
                onClick={() => setIsAddingContact(false)} 
                className="absolute -top-1 -right-1 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"
                id="close-add-contact"
              >
                <Plus size={18} className="rotate-45" />
              </button>
            </div>

            {/* Classification Tabs mimicking the image design */}
            <div className="bg-[#f1f5f9]/60 p-1 rounded-[20px] flex w-full border border-slate-200/40 shrink-0">
              <button 
                type="button"
                onClick={() => setContactForm((prev: any) => ({ ...prev, type: 'Normal' }))}
                className={`flex-1 py-3.5 rounded-[15px] text-[10px] md:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  (contactForm.type || 'Normal') === 'Normal'
                    ? 'bg-[#0c2340] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
                id="tab-normal-contact"
              >
                Contacto Normal
              </button>
              <button 
                type="button"
                onClick={() => setContactForm((prev: any) => ({ ...prev, type: 'Emergência' }))}
                className={`flex-1 py-3.5 rounded-[15px] text-[10px] md:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  contactForm.type === 'Emergência'
                    ? 'bg-[#0c2340] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
                id="tab-emergency-contact"
              >
                De Emergência
              </button>
            </div>

            {/* Content Form Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 text-left">
              <div className="space-y-4">
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação Completa</label>
                  <input 
                    placeholder="Ex: Edlasio Galhardo" 
                    value={contactForm.name}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-[#0c2340]/20 rounded-[16px] px-4 py-3.5 text-xs text-slate-800 outline-none transition-all font-bold placeholder:text-slate-350"
                    id="contact-name-input"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de BI Oficial</label>
                  <input 
                    placeholder="000000000LA000" 
                    value={contactForm.bi}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, bi: e.target.value }))}
                    className="w-full bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-[#0c2340]/20 rounded-[16px] px-4 py-3.5 text-xs text-slate-800 outline-none transition-all font-mono font-bold tracking-wider placeholder:text-slate-350"
                    maxLength={14}
                    id="contact-bi-input"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Grau de Parentesco / Relação</label>
                  <input 
                    placeholder="Ex: Mãe, Irmão, Advogado" 
                    value={contactForm.relation}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, relation: e.target.value }))}
                    className="w-full bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-[#0c2340]/20 rounded-[16px] px-4 py-3.5 text-xs text-slate-800 outline-none transition-all font-bold placeholder:text-slate-350"
                    id="contact-relation-input"
                  />
                </div>
              </div>

              {/* Warning/Info Box in premium card style */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-3 mt-4 items-start select-none">
                <ShieldCheck size={18} className="text-[#0c2340] shrink-0 mt-0.5" />
                <p className="text-slate-500 text-[10px] font-semibold leading-relaxed italic">
                  "Ao adicionar este contacto, você autoriza o acesso limitado a informações de elegibilidade em canais de interoperabilidade em casos imperativos de emergência nacional."
                </p>
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="pt-2 shrink-0">
              <button 
                type="button"
                onClick={() => {
                  if (!contactForm.name || !contactForm.bi) return;
                  setShowInviteConfirm(true);
                  setIsAddingContact(false);
                }}
                disabled={!contactForm.name || !contactForm.bi}
                className="w-full bg-[#0c2340] hover:bg-[#152e4d] text-white py-4 rounded-[22px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0c2340]/15 flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-98"
                id="confirm-add-contact-btn"
              >
                <Send size={13} />
                Adicionar Contacto
              </button>
              
              <button 
                type="button"
                onClick={() => setIsAddingContact(false)}
                className="w-full text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-0 cursor-pointer text-[10px] font-black uppercase tracking-widest font-sans py-2 block text-center mt-2"
                id="cancel-add-contact-btn"
              >
                Voltar ao Menu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
