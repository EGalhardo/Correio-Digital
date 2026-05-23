/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Mail, QrCode, Users, User, LogOut, Trash2, Landmark, BarChart3, Shield, Activity, Settings, Scan, Folder } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Message, Document, AppMode } from '../../types';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

interface SidebarProps {
  tab: string;
  setTab: (id: string) => void;
  setSelectedMessage: (msg: Message | null) => void;
  setSelectedDoc: (doc: Document | null) => void;
  handleLogout: (clearAll?: boolean) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

const userItems: MenuItem[] = [
  { id: 'home', label: 'Painel', icon: Home },
  { id: 'correspondencias', label: 'Correio', icon: Mail },
  { id: 'carteira', label: 'Doc. digitais', icon: QrCode },
  { id: 'pasta-digital', label: 'Pasta digital', icon: Folder },
  { id: 'contatos', label: 'Contactos', icon: Users },
  { id: 'perfil', label: 'Conta', icon: User },
];

const institutionItems: MenuItem[] = [
  { id: 'home', label: 'Painel', icon: Home },
  { id: 'correspondencias', label: 'Correio', icon: Mail },
  { id: 'carteira', label: 'Doc. digitais', icon: QrCode },
  { id: 'perfil', label: 'Conta', icon: User },
];

const adminItems: MenuItem[] = [
  { id: 'gov-dashboard', label: 'Painel', icon: BarChart3 },
  { id: 'gov-interoperabilidade', label: 'Interoperabilidade', icon: Activity },
  { id: 'gov-contatos', label: 'Usuário Geral', icon: Users },
  { id: 'gov-perfil', label: 'Instituição Geral', icon: Landmark },
  { id: 'gov-seguranca', label: 'Segurança Facial', icon: Scan },
];

export function Sidebar({ 
  tab, 
  setTab, 
  setSelectedMessage, 
  setSelectedDoc, 
  handleLogout,
  appMode,
  setAppMode
}: SidebarProps) {
  
  const getItemsForMode = () => {
    switch (appMode) {
      case 'admin': return adminItems;
      case 'institution': return institutionItems;
      default: return userItems;
    }
  };

  const currentItems = getItemsForMode();

  const NavigationList = () => (
    <>
      <div className="text-[8px] font-black text-slate-500 tracking-[0.25em] uppercase px-1.5 mb-2 mt-4 md:mt-0">
        {appMode === 'admin' ? 'ADMINISTRAÇÃO CENTRAL' : 
         appMode === 'institution' ? 'INSTITUIÇÃO / PRIVADO' : 'ÁREA DO CIDADÃO'}
      </div>
      <nav className="space-y-0.5">
        {currentItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              if (id !== 'correspondencias' && id !== 'mensagem') setSelectedMessage(null);
              if (id !== 'carteira' && id !== 'documento') setSelectedDoc(null);
            }}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl font-bold transition-all ${
              tab === id 
                ? 'text-indigo-600' 
                : 'bg-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <Icon size={16} className={tab === id ? 'text-indigo-600' : 'text-slate-600'} />
            <span className="text-xs tracking-tight">{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 border-t border-line/40 pt-6 space-y-1 px-0.5">
        <div className="text-[8px] font-black text-slate-500 tracking-[0.25em] uppercase px-1.5 mb-2">Versão do Sistema</div>
        
        <div className="flex flex-col gap-1 items-start">
          {/* User Button */}
          <button
            onClick={() => {
              setAppMode('user');
              if (!userItems.some(i => i.id === tab)) setTab('home');
            }}
            className={`px-1.5 py-1 font-black text-[10px] uppercase tracking-wider transition-all ${
              appMode === 'user' 
                ? 'text-indigo-600' 
                : 'text-slate-600 hover:text-slate-800 font-black'
            }`}
          >
            Usuário
          </button>

          {/* Institution Button */}
          <button
            onClick={() => {
              setAppMode('institution');
              if (!institutionItems.some(i => i.id === tab)) setTab('home');
            }}
            className={`px-1.5 py-1 font-black text-[10px] uppercase tracking-wider transition-all ${
              appMode === 'institution' 
                ? 'text-indigo-600' 
                : 'text-slate-600 hover:text-slate-800 font-black'
            }`}
          >
            Instituição
          </button>

          {/* Admin Button */}
          <button
            onClick={() => {
              setAppMode('admin');
              if (!adminItems.some(i => i.id === tab)) setTab('gov-dashboard');
            }}
            className={`px-1.5 py-1 font-black text-[10px] uppercase tracking-wider transition-all ${
              appMode === 'admin' 
                ? 'text-indigo-600' 
                : 'text-slate-600 hover:text-slate-800 font-black'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </>
  );

  return (
    <aside className={`hidden md:flex p-6 md:w-[300px] md:rounded-[48px] shadow-2xl border transition-all duration-500 shrink-0 md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] flex-col ${
      appMode === 'admin' ? 'bg-white text-slate-900 border-indigo-50 shadow-indigo-900/5' : 
      'bg-white text-slate-900 border-slate-100 shadow-slate-200/50'
    }`}>
      <div className="mb-12 px-4">
        <img 
          src="https://i.postimg.cc/Rq5TKbdk/Correio-Digital-Angola.png" 
          alt="Correio Digital" 
          className={`h-24 w-auto object-contain transition-all`}
        />
      </div>

      <NavigationList />

      <div className={`mt-auto pt-6 border-t space-y-2 border-slate-100`}>
        <button
          onClick={() => handleLogout(false)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200`}
        >
          <LogOut size={20} className="text-slate-600" />
          <span className="text-xs uppercase tracking-widest">Sair do Canal</span>
        </button>
        <button
          onClick={() => {
            if(confirm("Deseja apagar todos os dados locais e restaurar os padrões?")) handleLogout(true);
          }}
          className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-black transition-all text-[9px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 text-red-500 hover:text-red-600`}
        >
          <Trash2 size={14} />
          <span>Restaurar Sistema</span>
        </button>
      </div>
    </aside>
  );
}
