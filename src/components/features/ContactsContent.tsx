/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Search, ShieldCheck, Trash2, Info } from 'lucide-react';
import { Contact } from '../../types';

interface ContactsContentProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchContact: string;
  setSearchContact: (search: string) => void;
  setIsAddingContact: (isAdding: boolean) => void;
  setContactToDelete: (contact: Contact) => void;
}

export function ContactsContent({
  contacts,
  filteredContacts,
  searchContact,
  setSearchContact,
  setIsAddingContact,
  setContactToDelete,
}: ContactsContentProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black text-primary leading-tight">Círculo de Confiança</h3>
            <p className="text-[10px] md:text-sm text-slate-800 font-black uppercase tracking-widest">{contacts.length} Contactos Registados</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddingContact(true)}
            className="bg-primary text-white rounded-2xl px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-center gap-2.5 md:gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs md:text-sm font-black"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
            Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] p-2 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text"
            placeholder="Pesquisar no círculo de confiança..."
            value={searchContact}
            onChange={(e) => setSearchContact(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-1 border-l border-slate-200 text-slate-600">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Protocolo Familiar Activo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContacts.map((contact, index) => (
            <motion.div 
              layout
              key={contact.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                  contact.status === 'Confirmado' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-orange-50 text-orange-700 border-orange-100'
                }`}>
                  {contact.status}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-black text-xl border border-slate-200 shadow-inner group-hover:scale-110 transition-transform">
                  {(contact?.name || 'C').split(' ').map((n: string) => n?.[0] || '').join('').substring(0, 2)}
                </div>
                <div className="min-w-0 pr-12">
                  <strong className="text-slate-950 block text-lg font-black italic tracking-tighter uppercase leading-tight truncate">{contact.name}</strong>
                  <div className="flex items-center mt-1">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{contact.relation}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-slate-50 flex justify-between items-center bg-slate-50/30 -mx-6 -mb-6 px-6 py-4 mt-auto">
                <div className="space-y-0.5">
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-1">Identidade BI</div>
                  <div className="text-slate-950 font-mono font-bold text-xs md:text-sm tracking-wider">{contact.bi}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setContactToDelete(contact)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remover contacto"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2.5 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Info size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredContacts.length === 0 && (
          <div className="col-span-full py-12 md:py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] md:rounded-[40px] space-y-3 md:space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-200">
              <Users size={32} className="md:w-10 md:h-10" />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-400">Sem contactos à vista</h4>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                {searchContact ? `Nenhum resultado para "${searchContact}"` : 'Comece a construir o seu círculo de confiança digital.'}
              </p>
            </div>
            {searchContact && (
              <button 
                onClick={() => setSearchContact('')}
                className="text-primary font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline"
              >
                Limpar Pesquisa
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
