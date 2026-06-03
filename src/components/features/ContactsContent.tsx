/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
  onUpdateContactType?: (id: number, newType: 'Normal' | 'Emergência') => void;
}

export function ContactsContent({
  contacts,
  filteredContacts,
  searchContact,
  setSearchContact,
  setIsAddingContact,
  setContactToDelete,
  onUpdateContactType,
}: ContactsContentProps) {
  const [selectedClassification, setSelectedClassification] = useState<'Todos' | 'Emergência' | 'Normal'>('Todos');

  const finalContacts = filteredContacts.filter(contact => {
    if (selectedClassification === 'Todos') return true;
    const type = contact.type || 'Normal';
    return type === selectedClassification;
  });
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

      <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h4 className="font-black text-slate-900 text-lg md:text-xl italic uppercase tracking-tight flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Círculo de Confiança: Registos Autorizados
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
              Lista autenticada de familiares, dependentes e contactos oficiais sincronizados
            </p>
          </div>

          {/* Tabbar para filtro de classificação */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 self-start lg:self-center shrink-0">
            {(['Todos', 'Emergência', 'Normal'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedClassification(tab)}
                className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedClassification === tab
                    ? tab === 'Emergência'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {finalContacts.length > 0 ? (
          <div className="overflow-auto rounded-[24px] border border-slate-100 bg-slate-50/20 custom-scrollbar max-h-[500px]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 z-10 bg-primary">
                <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-wider">
                  <th className="py-4 px-5 rounded-l-2xl">Contacto / Relação</th>
                  <th className="py-4 px-5">Identidade BI</th>
                  <th className="py-4 px-5">Vínculo Família</th>
                  <th className="py-4 px-5">Estado de Vínculo</th>
                  <th className="py-4 px-5 text-center rounded-r-2xl">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {finalContacts.map((contact, index) => (
                    <motion.tr 
                      layout
                      key={contact.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: index * 0.03 }}
                      className="text-xs text-slate-800 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-black text-sm border border-slate-200 shadow-3xs uppercase">
                            {(() => {
                              const initials = (contact?.name || 'C').split(' ').map((n: string) => n?.[0] || '').join('').substring(0, 2);
                              return (initials === 'MD' || initials === 'md') ? (
                                <Users size={16} className="text-primary" />
                              ) : (
                                initials
                              );
                            })()}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm block uppercase italic tracking-tight">{contact.name}</span>
                            <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mt-0.5">{contact.relation}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-slate-700 tracking-wider">
                        {contact.bi}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-indigo-700 font-mono text-[9px] font-black mb-1.5">
                          <ShieldCheck size={10} className="text-indigo-500" />
                          Protocolo Ativo
                        </div>
                        <div className="flex gap-1">
                          {(['Normal', 'Emergência'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                if (onUpdateContactType) {
                                  onUpdateContactType(contact.id, t);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                                (contact.type || 'Normal') === t
                                  ? t === 'Emergência'
                                    ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100 shadow-3xs font-extrabold'
                                    : 'bg-primary/10 text-primary border-primary-300 ring-2 ring-primary/5 shadow-3xs font-extrabold'
                                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                              title={`Mudar prioridade para ${t}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider ${
                          contact.status === 'Confirmado' 
                            ? 'text-emerald-600' 
                            : 'text-orange-700'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setContactToDelete(contact)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-0 bg-transparent cursor-pointer"
                            title="Remover contacto"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border-0 bg-transparent cursor-pointer">
                            <Info size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 md:py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] md:rounded-[40px] space-y-3 md:space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-200">
              <Users size={32} className="md:w-10 md:h-10" />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-400">Sem contactos à vista</h4>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                {searchContact 
                  ? `Nenhum resultado para "${searchContact}"` 
                  : selectedClassification !== 'Todos'
                    ? `Nenhum contacto classificado como "${selectedClassification}" encontrado.`
                    : 'Comece a construir o seu círculo de confiança digital.'}
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
