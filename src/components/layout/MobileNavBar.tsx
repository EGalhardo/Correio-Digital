/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Home, Mail, QrCode, Users, User, BarChart3, Shield, Activity, Scan, Folder } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Message, Document, AppMode } from '../../types';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavBarProps {
  tab: string;
  setTab: (id: string) => void;
  setSelectedMessage: (msg: Message | null) => void;
  setSelectedDoc: (doc: Document | null) => void;
  appMode: AppMode;
}

const userItems: MenuItem[] = [
  { id: 'home', label: 'Painel', icon: Home },
  { id: 'correspondencias', label: 'Correio', icon: Mail },
  { id: 'carteira', label: 'Docs', icon: QrCode },
  { id: 'pasta-digital', label: 'Pasta', icon: Folder },
  { id: 'contatos', label: 'Contactos', icon: Users },
  { id: 'perfil', label: 'Conta', icon: User },
];

const institutionItems: MenuItem[] = [
  { id: 'home', label: 'Painel', icon: Home },
  { id: 'correspondencias', label: 'Correio', icon: Mail },
  { id: 'carteira', label: 'Docs', icon: QrCode },
  { id: 'perfil', label: 'Conta', icon: User },
];

const adminItems: MenuItem[] = [
  { id: 'gov-dashboard', label: 'Painel', icon: BarChart3 },
  { id: 'gov-interoperabilidade', label: 'Interop', icon: Activity },
  { id: 'gov-perfil', label: 'SOC', icon: Shield },
  { id: 'gov-seguranca', label: 'Facial', icon: Scan },
];

export function MobileNavBar({ 
  tab, 
  setTab, 
  setSelectedMessage, 
  setSelectedDoc,
  appMode 
}: MobileNavBarProps) {
  
  const getItemsForMode = () => {
    switch (appMode) {
      case 'admin': return adminItems;
      case 'institution': return institutionItems;
      default: return userItems;
    }
  };

  const currentItems = getItemsForMode();
  const isAdmin = appMode === 'admin';

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-0.5 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors ${
      isAdmin ? 'bg-slate-900 border-slate-800' : 'bg-white border-line/60'
    }`}>
      {currentItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => {
            setTab(id);
            if (id !== 'correspondencias' && id !== 'mensagem') setSelectedMessage(null);
            if (id !== 'carteira' && id !== 'documento') setSelectedDoc(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all px-1 h-full relative flex-1 ${
            tab === id ? 'text-indigo-600' : (isAdmin ? 'text-slate-500' : 'text-slate-400')
          }`}
        >
          <div className={`transition-all duration-300 ${tab === id ? 'scale-110' : 'scale-100'}`}>
            <Icon size={19} strokeWidth={tab === id ? 2.5 : 2} />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-tight transition-all ${tab === id ? 'opacity-100' : 'opacity-60'}`}>
            {label}
          </span>
          {tab === id && (
            <motion.div 
              layoutId="activeTab"
              className={`absolute -top-px left-1/2 -translate-x-1/2 w-6 h-1 rounded-b-full bg-indigo-600`}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
