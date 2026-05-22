import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Scan, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Eye, 
  Trash2, 
  UserSquare, 
  FileLock2, 
  Fingerprint, 
  TrendingUp, 
  HelpCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

// Data trend for authentication attempts
const BIOMETRIC_ATTEMPTS_DATA = [
  { day: 'Seg', sucesso: 1240, falhas: 5 },
  { day: 'Ter', sucesso: 1450, falhas: 8 },
  { day: 'Qua', sucesso: 1680, falhas: 12 },
  { day: 'Qui', sucesso: 1590, falhas: 4 },
  { day: 'Sex', sucesso: 1890, falhas: 18 },
  { day: 'Sáb', sucesso: 1120, falhas: 2 },
  { day: 'Dom', sucesso: 980, falhas: 1 },
];

interface BiometricUser {
  id: string;
  name: string;
  docId: string;
  type: 'Cidadão' | 'Instituição';
  institutionName?: string;
  registeredAt: string;
  lastUsed: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  confidenceRate: number;
}

export function GovSegurancaContent() {
  const [biometricUsers, setBiometricUsers] = useState<BiometricUser[]>([
    { id: '1', name: 'Edlasio Galhardo', docId: '003291820LA045', type: 'Cidadão', registeredAt: '12/02/2026', lastUsed: 'Hoje, 20:15', status: 'Ativo', confidenceRate: 98.8 },
    { id: '2', name: 'Dr. Afonso Henriques', docId: '005481920NA011', type: 'Instituição', institutionName: 'Ministério das Finanças (MINFIN)', registeredAt: '03/03/2026', lastUsed: 'Hoje, 18:42', status: 'Ativo', confidenceRate: 99.4 },
    { id: '3', name: 'AGT Angola Admin', docId: '009182390LA112', type: 'Instituição', institutionName: 'Administração Geral Tributária', registeredAt: '15/01/2026', lastUsed: 'Ontem, 14:10', status: 'Ativo', confidenceRate: 97.6 },
    { id: '4', name: 'Emanuel Garcia', docId: '004128911LA092', type: 'Cidadão', registeredAt: '08/04/2026', lastUsed: '19/05/2026', status: 'Pendente', confidenceRate: 85.2 },
    { id: '5', name: 'Isabel de Sousa', docId: '002910398HU034', type: 'Cidadão', registeredAt: '22/03/2026', lastUsed: '15/05/2026', status: 'Bloqueado', confidenceRate: 0.0 },
    { id: '6', name: 'Cláudia Simões', docId: '006129837BA029', type: 'Cidadão', registeredAt: '19/04/2026', lastUsed: 'Hoje, 10:24', status: 'Ativo', confidenceRate: 96.5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | 'Cidadão' | 'Instituição'>('Todos');
  const [matchingThreshold, setMatchingThreshold] = useState(85);
  const [antiSpoofingEnforced, setAntiSpoofingEnforced] = useState(true);
  const [selectedUser, setSelectedUser] = useState<BiometricUser | null>(null);
  const [simulatedScanResult, setSimulatedScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const filteredUsers = biometricUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.docId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || user.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleStatusChange = (userId: string, newStatus: 'Ativo' | 'Pendente' | 'Bloqueado') => {
    setBiometricUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleRequestRecalibration = (userId: string) => {
    setBiometricUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Pendente' } : u));
    alert('Solicitação de recadastramento facial lançada para o utilizador.');
  };

  const startAnalysisSimulation = (user: BiometricUser) => {
    setIsScanning(true);
    setSimulatedScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const randomRate = +(85 + Math.random() * 15).toFixed(1);
      if (randomRate >= matchingThreshold) {
        setSimulatedScanResult(`Match Biométrico Confirmado! Confiança de ${randomRate}% para ${user.name}. Integridade garantida (Anti-Spoofing: Passou)`);
      } else {
        setSimulatedScanResult(`Falha no Match. Confiança de ${randomRate}% está abaixo do limite mínimo configurado (${matchingThreshold}%).`);
      }
    }, 1800);
  };

  return (
    <div className="pb-24">
      {/* Title Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck size={16} />
          </div>
          <span className="font-mono text-xs font-black uppercase text-indigo-650 tracking-[0.2em]">
            Admin &bull; Segurança Facial Integrada
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
          Segurança Facial
        </h1>
        <p className="text-slate-500 font-medium text-xs mt-2 max-w-2xl">
          Painel central de gestão biométrica facial. Controle integridade de acessos, revise validações de autenticação e defina limiares de acurácia de matching em tempo real para Cidadãos e Instituições.
        </p>
      </div>

      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Faces */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Modelos Faciais Registados</p>
              <h3 className="text-2xl font-black mt-2 text-slate-800">15,240</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                <CheckCircle2 size={11} /> +12.4% este mês
              </span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Scan size={20} />
            </div>
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Acurácia Média de Match</p>
              <h3 className="text-2xl font-black mt-2 text-indigo-650">98.67%</h3>
              <span className="text-[10px] font-mono text-slate-450 mt-1 block">
                Falsa Aceitação: 0.001%
              </span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Failed Attempts Blocked */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Fraudes de Spoofing Bloqueadas</p>
              <h3 className="text-2xl font-black mt-2 text-red-600">48</h3>
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5 mt-1 animate-pulse">
                <AlertTriangle size={11} /> 2 tentativas hoje
              </span>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <Eye size={20} />
            </div>
          </div>
        </div>

        {/* Threshold Status */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Limiar de Validade Face ID</p>
              <h3 className="text-2xl font-black mt-2 text-slate-800">{matchingThreshold}%</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                Liveness Enforcement: Ativo
              </span>
            </div>
            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
              <Sliders size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Content split into config and list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Left column: Quick settings & Simulation box */}
        <div className="space-y-6 lg:col-span-1">
          {/* Configurations Card */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-sm font-black tracking-widest text-slate-800 uppercase mb-4 flex items-center gap-2">
              <Sliders size={16} className="text-indigo-600" />
              Parâmetros Ativos
            </h3>

            <div className="space-y-5">
              {/* Confident match slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Sensibilidade do Match Facial</span>
                  <span className="text-indigo-600 font-black">{matchingThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="75" 
                  max="99" 
                  value={matchingThreshold} 
                  onChange={(e) => setMatchingThreshold(+e.target.value)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Valores elevados minimizam fraudes mas podem elevar falsas rejeições sob baixa iluminação.
                </p>
              </div>

              {/* Anti Spoofing Switch */}
              <div className="flex items-center justify-between py-2 border-t border-slate-50">
                <div>
                  <label htmlFor="anti-spoofing" className="text-xs font-bold text-slate-700 block select-none">Detecção de Vivicidade (Liveness)</label>
                  <span className="text-[10px] text-slate-400 font-medium">Requer micro-movimentos do piscar de olhos.</span>
                </div>
                <button
                  id="anti-spoofing"
                  onClick={() => setAntiSpoofingEnforced(!antiSpoofingEnforced)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                    antiSpoofingEnforced ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white transition-transform ${antiSpoofingEnforced ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Encryption */}
              <div className="border-t border-slate-50 pt-3">
                <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase block mb-1">Criptografia de Vetores</span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileLock2 size={14} className="text-slate-500" />
                  AES-GCM 256 + Hash SHA3
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Os dados faciais não são armazenados como fotos, mas sim de forma irreversível como vetores de pontos matemáticos encriptados.
                </p>
              </div>
            </div>
          </div>

          {/* Real-time simulation playground */}
          <div className="bg-slate-950 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scan size={180} />
            </div>

            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Fingerprint size={16} className="text-indigo-400" />
              Consola de Teste de Match
            </h3>
            
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Selecione qualquer utilizador na lista à direita e clique abaixo para rodar uma verificação simulada do gateway neural local.
            </p>

            {selectedUser ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{selectedUser.type}</div>
                <div className="text-sm font-bold">{selectedUser.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">BI: {selectedUser.docId}</div>
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-2xl p-4 py-6 text-center text-xs text-slate-500 mb-4 font-bold">
                Selecione um utilizador na lista para iniciar o teste.
              </div>
            )}

            <button 
              disabled={!selectedUser || isScanning}
              onClick={() => selectedUser && startAnalysisSimulation(selectedUser)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  Mapeando Vetores Faciais...
                </>
              ) : (
                <>
                  <Scan size={14} />
                  Executar Teste Biométrico
                </>
              )}
            </button>

            {simulatedScanResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 p-3.5 rounded-xl border text-[11px] font-mono leading-relaxed ${
                  simulatedScanResult.includes('Confirmado') 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}
              >
                {simulatedScanResult}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right column: Users table / list with filters */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
              <div>
                <h3 className="text-base font-black tracking-tighter text-slate-900 uppercase">Utilizadores Cadastrados</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Controlo individual de login biométrico para cidadãos e administradores institucionais.</p>
              </div>

              {/* View filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['Todos', 'Cidadão', 'Instituição'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      filterType === type 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {type}s
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Input Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Pesquise por nome, n.º do BI ou instituição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Table layout representing general user layout pattern */}
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 font-semibold">Cidadão / Administrador</th>
                    <th className="pb-3 font-semibold">Versão</th>
                    <th className="pb-3 font-semibold">Cadastrado em</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)}
                        className={`group cursor-pointer hover:bg-slate-50/50 transition-colors ${
                          selectedUser?.id === user.id ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              user.status === 'Bloqueado' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
                            }`}>
                              <UserSquare size={16} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate transition-colors">
                                {user.name}
                              </div>
                              <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5 uppercase truncate">
                                <span>BI: {user.docId}</span>
                                {user.institutionName && (
                                  <span className="text-[8px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-sans truncate">
                                    {user.institutionName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            user.type === 'Instituição' 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {user.type}
                          </span>
                        </td>
                        <td className="py-4 pr-3 text-[11px] text-slate-500 font-medium">
                          {user.registeredAt}
                          <span className="block text-[8px] text-slate-400 font-mono">Última: {user.lastUsed}</span>
                        </td>
                        <td className="py-4 pr-3">
                          <span className={`flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider ${
                            user.status === 'Ativo' ? 'text-emerald-600' :
                            user.status === 'Pendente' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Ativo' ? 'bg-emerald-500 animate-pulse' :
                              user.status === 'Pendente' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.status === 'Bloqueado' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(user.id, 'Ativo');
                                }}
                                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                              >
                                Reativar
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestRecalibration(user.id);
                                  }}
                                  className="p-1 bg-slate-50 hover:bg-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase px-2.5 transition-all"
                                  title="Solicitar Recadastramento de Face ID"
                                >
                                  Recalibrar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(user.id, 'Bloqueado');
                                  }}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                  title="Bloquear Acesso por Face ID"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                        Nenhum utilizador encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graphical Trends Section mimicking General User style */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-indigo-600">
                    Sincronização de Tráfego de Autenticação
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-slate-950">
                  Tentativas de Acesso por Biometria
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-sans">Média Semanal de Sucesso</span>
                <span className="text-xl font-bold tracking-tight text-emerald-600">99.1%</span>
              </div>
            </div>

            <div className="h-[220px] w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BIOMETRIC_ATTEMPTS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSucesso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <Area type="monotone" name="Sucesso" dataKey="sucesso" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSucesso)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
