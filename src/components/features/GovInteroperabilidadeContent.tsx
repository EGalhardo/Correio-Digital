import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Power, Settings2, Activity, Shield, Key, X, CheckCircle2, AlertCircle, RefreshCw, Smartphone, ArrowRight } from 'lucide-react';

interface Organismo {
  id: string;
  name: string;
  desc: string;
  status: 'Ligado' | 'Manutenção' | 'Offline';
  protocol: string;
  token: string;
}

const INITIAL_ORGS: Organismo[] = [
  { id: '1', name: 'SME', desc: 'Serviço de Migração e Estrangeiros', status: 'Ligado', protocol: 'REST/JSON', token: 'SME_PROD_8892_AX' },
  { id: '2', name: 'AGT', desc: 'Administração Geral Tributária', status: 'Ligado', protocol: 'SOAP/XML', token: 'AGT_KEY_v2_9901' },
  { id: '3', name: 'INSS', desc: 'Instituto Nacional de Segurança Social', status: 'Ligado', protocol: 'GraphQL', token: 'INSS_SECRET_X77' },
  { id: '4', name: 'PNA', desc: 'Polícia Nacional de Angola', status: 'Ligado', protocol: 'gRPC', token: 'PNA_SEC_991' },
  { id: '5', name: 'BCI', desc: 'Banco de Comércio e Indústria', status: 'Offline', protocol: 'REST/OAuth2', token: 'BCI_OAUTH_TOKEN' }
];

interface GovInteroperabilidadeContentProps {
  onLog?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export function GovInteroperabilidadeContent({ onLog }: GovInteroperabilidadeContentProps) {
  const [orgs, setOrgs] = useState<Organismo[]>(() => {
    const saved = localStorage.getItem('gov_interop_orgs');
    return saved ? JSON.parse(saved) : INITIAL_ORGS;
  });

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string, status: 'success' | 'error', log: string } | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organismo | null>(null);

  useEffect(() => {
    localStorage.setItem('gov_interop_orgs', JSON.stringify(orgs));
  }, [orgs]);

  const toggleStatus = (id: string) => {
    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        const statuses: Organismo['status'][] = ['Ligado', 'Manutenção', 'Offline'];
        const currentIndex = statuses.indexOf(org.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        
        onLog?.(`Status de ${org.name} alterado para ${nextStatus}`, nextStatus === 'Ligado' ? 'success' : 'warning');
        
        return { ...org, status: nextStatus };
      }
      return org;
    }));
  };

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTestResult(null);
    
    // Simulate API Test
    setTimeout(() => {
      const org = orgs.find(o => o.id === id);
      setTestingId(null);
      setTestResult({
        id,
        status: org?.status === 'Ligado' ? 'success' : 'error',
        log: org?.status === 'Ligado' 
          ? `Status 200 OK - Protocolo ${org.protocol} estabelecido com sucesso via GovCloud.`
          : `Timeout Error - Organismo ${org?.name} encontra-se em estado ${org?.status}.`
      });
    }, 2000);
  };

  const handleSaveToken = (id: string, newToken: string) => {
    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        onLog?.(`Token de integração ${org.name} atualizado`, 'warning');
        return { ...org, token: newToken };
      }
      return org;
    }));
    setEditingOrg(null);
  };

  return (
    <div className="pb-32 md:pt-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-emerald-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 border-2 border-emerald-500">
          <Activity size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Interoperabilidade</h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
             <div className="w-1 h-3 bg-emerald-500 rounded-full" />
             Gestão de Protocolos & Organismos
          </p>
        </div>
      </div>

      {/* Grid of Orgs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {orgs.map((org) => (
          <motion.div 
            key={org.id}
            layoutId={org.id}
            className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-100 transition-all flex flex-col gap-8 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center font-black text-2xl text-slate-950 shadow-inner group-hover:scale-110 transition-all border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                  {org.name}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg md:text-xl italic tracking-tighter uppercase leading-none">{org.desc}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">PROTOCOLO: {org.protocol}</span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">CDA-GATEWAY V4</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => toggleStatus(org.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all border shadow-sm ${
                  org.status === 'Ligado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  org.status === 'Manutenção' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              >
                <Power size={12} className={org.status === 'Ligado' ? 'animate-pulse' : ''} />
                {org.status}
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
              <button 
                onClick={() => handleTestConnection(org.id)}
                disabled={testingId !== null}
                className="flex-1 bg-slate-50 text-slate-600 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-slate-100"
              >
                {testingId === org.id ? <RefreshCw size={16} className="animate-spin" /> : <Activity size={16} />}
                Testar Link
              </button>
              
              <button 
                onClick={() => setEditingOrg(org)}
                className="flex-1 bg-slate-950 text-white p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95"
              >
                <Settings2 size={16} /> Parâmetros
              </button>
            </div>

            {/* Test Result Indicator */}
            <AnimatePresence>
              {testResult && testResult.id === org.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  className={`p-5 rounded-[24px] border flex items-start gap-4 ${
                    testResult.status === 'success' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 shadow-sm shadow-emerald-900/5' : 'bg-red-50/50 border-red-100 text-red-800 shadow-sm shadow-red-900/5'
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${testResult.status === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-red-500 text-white shadow-lg shadow-red-200'}`}>
                    {testResult.status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1">{testResult.status === 'success' ? 'Link Estável' : 'Falha Crítica'}</div>
                      <span className="text-[11px] font-bold leading-relaxed italic">{testResult.log}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {editingOrg && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingOrg(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[48px] shadow-2xl z-[201] overflow-hidden"
            >
              <div className="bg-slate-950 p-10 text-white relative">
                <button 
                  onClick={() => setEditingOrg(null)}
                  className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-5 mb-3">
                   <div className="w-14 h-14 bg-white text-slate-950 rounded-[20px] flex items-center justify-center shadow-xl border-4 border-slate-900">
                      <Key size={32} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Gateway Authentication</div>
                      <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Integração {editingOrg.name}</h2>
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-6">
                   <label className="block">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                         Chave de Acesso Primária
                      </span>
                      <div className="relative mt-3">
                        <Key size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          defaultValue={editingOrg.token}
                          id="token-input"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-13 pr-5 py-5 font-mono text-sm text-slate-900 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold"
                        />
                      </div>
                   </label>

                   <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4 italic shadow-sm">
                      <Shield size={24} className="text-amber-600 shrink-0 mt-1" />
                      <p className="text-xs text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
                        Protocolo de Rotação Crítica: Ao actualizar esta chave, certifique-se de que o organismo destinatário possui o novo par de chaves públicas CDA.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => {
                      const input = document.getElementById('token-input') as HTMLInputElement;
                      handleSaveToken(editingOrg.id, input.value);
                    }}
                    className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1 active:scale-95"
                   >
                     Aplicar Novos Parâmetros
                   </button>
                   <button 
                    onClick={() => setEditingOrg(null)}
                    className="px-10 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all hover:text-slate-900"
                   >
                     Cancelar
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
