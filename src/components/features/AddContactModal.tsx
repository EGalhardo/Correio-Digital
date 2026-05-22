/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Plus, UserPlus, ShieldCheck, Send } from 'lucide-react';

interface AddContactModalProps {
  isAddingContact: boolean;
  setIsAddingContact: (isAdding: boolean) => void;
  contactForm: { name: string; bi: string; relation: string };
  setContactForm: (form: (prev: { name: string; bi: string; relation: string }) => { name: string; bi: string; relation: string }) => void;
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
            className="relative bg-white w-full max-w-md max-h-[90vh] rounded-[40px] shadow-2xl border border-line flex flex-col overflow-hidden mx-auto"
          >
            <div className="bg-primary p-7 md:p-8 text-white text-center relative shrink-0">
              <div className="absolute top-5 right-6">
                <button onClick={() => setIsAddingContact(false)} className="text-white/60 hover:text-white transition-colors p-2">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border border-white/20">
                <UserPlus size={32} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-black mb-1">Novo Contacto</h3>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Protocolo de Redes de Segurança</p>
            </div>

            <div className="p-7 md:p-10 pt-4 md:pt-6 space-y-5 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação Completa</label>
                  <input 
                    placeholder="Ex: Edlasio Galhardo" 
                    value={contactForm.name}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de BI Oficial</label>
                  <input 
                    placeholder="000000000LA000" 
                    value={contactForm.bi}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, bi: e.target.value }))}
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grau de Parentesco / Relação</label>
                  <input 
                    placeholder="Ex: Mãe, Irmão, Advogado" 
                    value={contactForm.relation}
                    onChange={e => setContactForm((prev: any) => ({ ...prev, relation: e.target.value }))}
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl text-sm border-2 border-transparent outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-primary"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-line mt-2 flex gap-3">
                <ShieldCheck size={18} className="text-secondary shrink-0 mt-0.5" />
                <p className="text-slate-500 text-[11px] font-medium leading-relaxed italic">
                  "Ao adicionar este contacto, você autoriza o acesso limitado a informações de emergência em casos de força maior."
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => {
                    if (!contactForm.name || !contactForm.bi) return;
                    setShowInviteConfirm(true);
                    setIsAddingContact(false);
                  }}
                  disabled={!contactForm.name || !contactForm.bi}
                  className="w-full bg-primary text-white py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={20} />
                  Validar e Enviar Convite
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
