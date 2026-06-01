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
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md max-h-[90vh] rounded-[32px] shadow-2xl border border-line flex flex-col overflow-hidden mx-auto"
          >
            <div className="bg-primary p-5 md:p-6 text-white text-center relative shrink-0">
              <div className="absolute top-4 right-5">
                <button onClick={() => setIsAddingContact(false)} className="text-white/60 hover:text-white transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/15">
                  <Plus size={18} className="rotate-45" />
                </button>
              </div>
              
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
                <UserPlus size={22} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-lg md:text-xl font-black mb-0.5">Novo Contacto</h3>
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest leading-none">Protocolo de Redes de Segurança</p>
            </div>

            <div className="p-5 md:p-6 pb-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-3.5">
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação Completa</label>
                  <input 
                    placeholder="Ex: Edlasio Galhardo" 
                    value={contactForm.name}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl text-xs border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de BI Oficial</label>
                  <input 
                    placeholder="000000000LA000" 
                    value={contactForm.bi}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, bi: e.target.value }))}
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl text-xs border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Grau de Parentesco / Relação</label>
                  <input 
                    placeholder="Ex: Mãe, Irmão, Advogado" 
                    value={contactForm.relation}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, relation: e.target.value }))}
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl text-xs border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Classificação do Contacto</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setContactForm((prev: any) => ({ ...prev, type: 'Normal' }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        (contactForm.type || 'Normal') === 'Normal'
                          ? 'bg-primary text-white shadow-sm ring-2 ring-primary/10'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700'
                      }`}
                    >
                      Normal
                    </button>
                    <button 
                      type="button"
                      onClick={() => setContactForm((prev: any) => ({ ...prev, type: 'Emergência' }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        contactForm.type === 'Emergência'
                          ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-550/10'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700'
                      }`}
                    >
                      Emergência
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-xl border border-line flex gap-2.5">
                <ShieldCheck size={16} className="text-secondary shrink-0 mt-0.5" />
                <p className="text-slate-500 text-[10px] font-semibold leading-relaxed italic">
                  "Ao adicionar este contacto, você autoriza o acesso limitado a informações de emergência em casos de força maior."
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="flex-1 border-2 border-[#e2e8f0] text-slate-500 hover:text-slate-700 bg-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (!contactForm.name || !contactForm.bi) return;
                    setShowInviteConfirm(true);
                    setIsAddingContact(false);
                  }}
                  disabled={!contactForm.name || !contactForm.bi}
                  className="flex-1 bg-primary text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  <Send size={14} />
                  Ok
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
