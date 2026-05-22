/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BadgeCheck, EyeOff, Eye, ShieldCheck, Lock, Fingerprint, History, Settings, Languages, Bell, Users, LogOut, Trash2 } from 'lucide-react';
import { USER_PROFILE_PHOTO } from '../../constants/data';

interface ProfileContentProps {
  showSensitiveData: boolean;
  setShowSensitiveData: (show: boolean) => void;
  bi: string;
  phone: string;
  contactsCount: number;
  setTab: (tab: string) => void;
  handleLogout: (clearAll?: boolean) => void;
}

export function ProfileContent({
  showSensitiveData,
  setShowSensitiveData,
  bi,
  phone,
  contactsCount,
  setTab,
  handleLogout,
}: ProfileContentProps) {
  return (
    <section className="space-y-6">
      {/* Identity Header */}
      <div className="bg-white md:border border-slate-100 rounded-[32px] md:rounded-[48px] p-6 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden group">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
        
        <div className="relative">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[56px] border-4 border-slate-50 p-1.5 md:p-2 bg-white shadow-2xl relative">
            <img 
              src={USER_PROFILE_PHOTO} 
              alt="Perfil" 
              className="w-full h-full rounded-[24px] md:rounded-[48px] object-cover shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-emerald-500 text-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-xl border-4 border-white">
              <BadgeCheck size={20} className="md:w-8 md:h-8" />
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase">Edlasio Galhardo</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto border border-emerald-100">
                Verificado
              </span>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">ID Única Digital &bull; República de Angola</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Número de BI</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? bi : bi.replace(/\(?[A-Z0-9]{6}\)?$/, '******')}
                </div>
              </div>
              <button 
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="p-2.5 text-slate-400 hover:text-primary transition-colors active:scale-90"
              >
                {showSensitiveData ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/field">
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Telefone Principal</div>
                <div className="text-slate-900 font-mono font-bold text-sm md:text-base truncate tracking-wider">
                  {showSensitiveData ? phone : phone.replace(/\d{3} \d{3}$/, '*** ***')}
                </div>
              </div>
              <div className="p-2.5 text-emerald-500 bg-white rounded-xl shadow-sm border border-emerald-50">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Security Center */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">Segurança</h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Protecção de Identidade</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Autenticação Biométrica', value: 'Activada', icon: <Fingerprint size={20} />, status: 'success' },
              { label: 'Assinatura Digital SME', value: 'Certificada', icon: <BadgeCheck size={20} />, status: 'success' },
              { label: 'Histórico de Acessos', value: 'Ver 12 acessos', icon: <History size={20} />, status: 'neutral' },
              { label: 'Cofre de Emergência', value: 'Definido', icon: <Lock size={20} />, status: 'success' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-orange-600 transition-colors">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'success' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Preferences */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">Preferências</h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Configuração do Sistema</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Idioma da Interface', value: 'Português', icon: <Languages size={20} /> },
              { label: 'Notificações de Estado', value: 'Ativas', icon: <Bell size={20} /> },
              { label: 'Segurança de Acesso', value: 'Máximo', icon: <ShieldCheck size={20} /> },
              { label: 'Círculo de Confiança', value: `${contactsCount} Membros`, icon: <Users size={20} />, action: () => setTab('contatos') },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-primary transition-colors">{item.icon}</div>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.value}</span>
                  <Settings className="text-slate-300 group-hover:rotate-90 transition-transform" size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-blue-900 rounded-[28px] md:rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 relative overflow-hidden shadow-xl mt-2 md:mt-0">
         <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid-profile" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid-profile)" /></svg>
         </div>
         
           <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
              <div className="w-11 h-11 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white border border-white/20 shrink-0">
                 <ShieldCheck size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                 <h4 className="text-base md:text-xl font-black mb-0.5 md:mb-1">Protecção de Dados Pessoais</h4>
                 <p className="text-white/70 text-[10px] md:text-sm font-medium max-w-sm">Desta forma, os seus dados estão salvaguardados nos termos da Lei nº 22/11 da República de Angola.</p>
              </div>
           </div>
         
         <button className="w-full md:w-auto bg-white text-primary px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">
            Exportar Relatórios
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-6">
        <button
          onClick={() => handleLogout(false)}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 md:py-5 bg-white border border-line rounded-2xl md:rounded-3xl font-black text-sm text-slate-600 active:bg-slate-50 transition-all shadow-sm"
        >
          <LogOut size={18} className="text-slate-400" />
          Sair da Conta
        </button>
        <button
          onClick={() => {
            if(confirm("Deseja apagar todos os dados locais e restaurar os padrões?")) handleLogout(true);
          }}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 md:py-5 bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl font-black text-sm text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm"
        >
          <Trash2 size={18} />
          Limpar Dados Locais
        </button>
      </div>
    </section>
  );
}
