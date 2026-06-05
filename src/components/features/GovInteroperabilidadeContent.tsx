import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Mail, 
  Activity, 
  Clock, 
  CheckCircle, 
  Power, 
  X, 
  Edit, 
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Trash
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  fullName: string;
  category: 'Finanças' | 'Infraestrutura' | 'Serviços' | 'Segurança' | 'Saúde' | 'Justiça';
  province: string;
  municipio: string;
  status: 'Ativa' | 'Inativa';
  totalCorrespondence: number;
  totalAgents: number;
  lastActivity: string;
  responseRate: string;
}

const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "inst-agt",
    name: "AGT",
    fullName: "Administração Geral Tributária",
    category: "Finanças",
    province: "Luanda",
    municipio: "Ingombota",
    status: "Ativa",
    totalCorrespondence: 342400,
    totalAgents: 45,
    lastActivity: "Há 1 min",
    responseRate: "97.5%"
  },
  {
    id: "inst-sme",
    name: "SME",
    fullName: "Serviço de Migração e Estrangeiros",
    category: "Segurança",
    province: "Luanda",
    municipio: "Maianga",
    status: "Ativa",
    totalCorrespondence: 198250,
    totalAgents: 32,
    lastActivity: "Há 4 mins",
    responseRate: "94.2%"
  },
  {
    id: "inst-ende",
    name: "ENDE",
    fullName: "Empresa Nacional de Distribuição de Electricidade",
    category: "Infraestrutura",
    province: "Benguela",
    municipio: "Lobito",
    status: "Ativa",
    totalCorrespondence: 92100,
    totalAgents: 18,
    lastActivity: "Há 18 mins",
    responseRate: "89.0%"
  },
  {
    id: "inst-epal",
    name: "EPAL",
    fullName: "Empresa Pública de Águas de Luanda",
    category: "Infraestrutura",
    province: "Luanda",
    municipio: "Viana",
    status: "Ativa",
    totalCorrespondence: 84300,
    totalAgents: 12,
    lastActivity: "Há 22 mins",
    responseRate: "91.8%"
  },
  {
    id: "inst-minjus",
    name: "MINJUS",
    fullName: "Ministério da Justiça e dos Direitos Humanos",
    category: "Justiça",
    province: "Huíla",
    municipio: "Lubango",
    status: "Ativa",
    totalCorrespondence: 184200,
    totalAgents: 28,
    lastActivity: "Há 8 mins",
    responseRate: "98.2%"
  },
  {
    id: "inst-minsa",
    name: "MINSA",
    fullName: "Ministério da Saúde",
    category: "Saúde",
    province: "Huambo",
    municipio: "Huambo",
    status: "Ativa",
    totalCorrespondence: 112400,
    totalAgents: 22,
    lastActivity: "Há 25 mins",
    responseRate: "92.5%"
  },
  {
    id: "inst-pna",
    name: "PNA",
    fullName: "Polícia Nacional de Angola",
    category: "Segurança",
    province: "Cabinda",
    municipio: "Cabinda",
    status: "Inativa",
    totalCorrespondence: 76500,
    totalAgents: 15,
    lastActivity: "Há 2 dias",
    responseRate: "85.4%"
  }
];

const MUNICIPALITIES_BY_PROVINCE: { [key: string]: string[] } = {
  'Todas': ['Todos'],
  'Luanda': ['Todos', 'Viana', 'Belas', 'Cazenga', 'Cacuaco', 'Talatona', 'Ingombota', 'Maianga'],
  'Benguela': ['Todos', 'Benguela', 'Lobito', 'Catumbela', 'Baía Farta'],
  'Huíla': ['Todos', 'Lubango', 'Chibia', 'Humpata'],
  'Cabinda': ['Todos', 'Cabinda', 'Cacongo', 'Buco-Zau'],
  'Bengo': ['Todos', 'Dande', 'Ambriz'],
  'Huambo': ['Todos', 'Huambo', 'Bailundo']
};

interface GovInteroperabilidadeContentProps {
  onLog?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export function GovInteroperabilidadeContent({ onLog }: GovInteroperabilidadeContentProps) {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('Todas');
  const [filterMunicipio, setFilterMunicipio] = useState('Todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Modal active states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [selectedInstHistory, setSelectedInstHistory] = useState<Institution | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formCategory, setFormCategory] = useState<'Finanças' | 'Infraestrutura' | 'Serviços' | 'Segurança' | 'Saúde' | 'Justiça'>('Finanças');
  const [formProvince, setFormProvince] = useState('Luanda');
  const [formMunicipio, setFormMunicipio] = useState('Ingombota');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Municipalities options based on selection
  const currentMunicipalities = useMemo(() => {
    return MUNICIPALITIES_BY_PROVINCE[filterProvince] || ['Todos'];
  }, [filterProvince]);

  const formMunicipalities = useMemo(() => {
    return MUNICIPALITIES_BY_PROVINCE[formProvince]?.filter(m => m !== 'Todos') || ['Viana'];
  }, [formProvince]);

  // Handle open create modal
  const openCreateModal = () => {
    setFormName('');
    setFormFullName('');
    setFormCategory('Finanças');
    setFormProvince('Luanda');
    setFormMunicipio('Ingombota');
    setIsCreateModalOpen(true);
  };

  // Handle open edit modal
  const openEditModal = (inst: Institution) => {
    setEditingInstitution(inst);
    setFormName(inst.name);
    setFormFullName(inst.fullName);
    setFormCategory(inst.category);
    setFormProvince(inst.province);
    setFormMunicipio(inst.municipio);
  };

  // Save new institution
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formFullName) return;

    const newInst: Institution = {
      id: `inst-${formName.toLowerCase()}-${Math.floor(Math.random() * 900) + 100}`,
      name: formName.toUpperCase(),
      fullName: formFullName,
      category: formCategory,
      province: formProvince,
      municipio: formMunicipio,
      status: 'Ativa',
      totalCorrespondence: 0,
      totalAgents: 1,
      lastActivity: "Criado agora",
      responseRate: "100%"
    };

    setInstitutions([newInst, ...institutions]);
    setIsCreateModalOpen(false);
    if (onLog) onLog(`INSTITUIÇÃO CRIADA: ${newInst.name} (${newInst.fullName})`, 'success');
  };

  // Save changes to institution
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstitution) return;

    setInstitutions(institutions.map(inst => {
      if (inst.id === editingInstitution.id) {
        return {
          ...inst,
          name: formName.toUpperCase(),
          fullName: formFullName,
          category: formCategory,
          province: formProvince,
          municipio: formMunicipio
        };
      }
      return inst;
    }));

    setEditingInstitution(null);
    if (onLog) onLog(`INSTITUIÇÃO ATUALIZADA: ${formName.toUpperCase()}`, 'info');
  };

  // Toggle activation status
  const toggleStatus = (inst: Institution) => {
    const newStatus = inst.status === 'Ativa' ? 'Inativa' : 'Ativa';
    setInstitutions(institutions.map(i => {
      if (i.id === inst.id) {
        return { ...i, status: newStatus };
      }
      return i;
    }));

    if (onLog) onLog(`INSTITUIÇÃO ${newStatus === 'Ativa' ? 'ACTIVADA' : 'DESACTIVADA'}: ${inst.name}`, newStatus === 'Ativa' ? 'success' : 'warning');
  };

  // Main filtered institutions list
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      // Search
      const matchSearch = String(inst.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(inst.fullName).toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Province filter
      if (filterProvince !== 'Todas' && inst.province !== filterProvince) return false;

      // Municipio filter
      if (filterMunicipio !== 'Todos' && inst.municipio !== filterMunicipio) return false;

      // Category filter
      if (filterCategory !== 'Todas' && inst.category !== filterCategory) return false;

      // Status filter
      if (filterStatus !== 'Todos') {
        const targetStatus = filterStatus === 'Ativas' ? 'Ativa' : 'Inativa';
        if (inst.status !== targetStatus) return false;
      }

      return true;
    });
  }, [institutions, searchTerm, filterProvince, filterMunicipio, filterCategory, filterStatus]);

  // Paginated elements
  const paginatedInstitutions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInstitutions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInstitutions, currentPage]);

  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage) || 1;

  // Mocked activity logs for details
  const activityHistory = useMemo(() => [
    { desc: "Credenciais de API sincronizadas com sucesso pelo barramento", time: "Há 5 mins", user: "AGENTE_ADMIN_40" },
    { desc: "Assinatura eletrónica renovada e selada digitalmente", time: "Há 12 mins", user: "AUTORIDADE_SER_SME" },
    { desc: "Tráfego de 1.450 correspondências processadas na fila normal", time: "Há 1 hora", user: "SISTEMA_BOT" },
    { desc: "Auditoria de segurança de chaves realizada pelo Gabinete de Operações", time: "Há 1 dia", user: "GAB_SEG_AUT" }
  ], []);

  return (
    <div className="pb-32 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-slate-100 mb-8 font-sans">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-sans">
            Gestão Institucional
          </h1>
          <div className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
            <div className="w-1 h-2 bg-indigo-600 rounded-full" />
            Cadastro Administrativo Nacional &bull; Províncias e Ministérios Integrados
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-950 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={3} /> Registar Instituição
        </button>
      </div>

      {/* Advanced Filter Box */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-6 mb-8 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
          <SlidersHorizontal size={14} className="text-indigo-600" />
          <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
            Painel Geral de Filtros e Busca
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Dropdown replacing input */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Localizar Instituição (Sigla/Nome)</label>
            <div className="relative">
              <select
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-slate-850 cursor-pointer appearance-none"
              >
                <option value="">Todas as Instituições</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.name}>{inst.name} - {inst.fullName}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Province */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Província</label>
            <select
              value={filterProvince}
              onChange={(e) => {
                setFilterProvince(e.target.value);
                setFilterMunicipio('Todos');
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-slate-850 cursor-pointer"
            >
              {Object.keys(MUNICIPALITIES_BY_PROVINCE).map(prov => (
                <option key={prov} value={prov}>{prov === 'Todas' ? 'Todas' : prov}</option>
              ))}
            </select>
          </div>

          {/* Municipio */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Município</label>
            <select
              value={filterMunicipio}
              onChange={(e) => { setFilterMunicipio(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-slate-850 cursor-pointer"
              disabled={filterProvince === 'Todas'}
            >
              {currentMunicipalities.map(mun => (
                <option key={mun} value={mun}>{mun}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-slate-850 cursor-pointer"
            >
              <option value="Todas">Todas as Categorias</option>
              <option value="Finanças">Finanças / Tributos</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Justiça">Justiça</option>
              <option value="Saúde">Saúde</option>
              <option value="Segurança">Segurança</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
            <div className="flex gap-2">
              {['Todos', 'Ativas', 'Inativas'].map(st => (
                <button
                  key={st}
                  onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
                  className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    filterStatus === st 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful tabular list layout replacing the card grid */}
      <div className="space-y-6">
        {paginatedInstitutions.length > 0 ? (
          <div className="overflow-x-auto rounded-[24px] bg-slate-50/20 max-h-[600px] border border-slate-200">
            <table className="w-full text-left border-collapse text-[10px] md:text-xs">
              <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[8px] md:text-[9.5px] font-black uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-2xl">Instituição</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Localidade</th>
                  <th className="py-2.5 px-3 text-center">Correio</th>
                  <th className="py-2.5 px-3 text-center">Agentes</th>
                  <th className="py-2.5 px-3 text-center">Resposta</th>
                  <th className="py-2.5 px-3 text-center">Atividade</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                  <th className="py-2.5 px-3 text-center rounded-r-2xl w-[190px]">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedInstitutions.map((inst) => (
                  <tr key={inst.id} className="text-[#334155] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 text-white flex items-center justify-center font-mono font-black text-[9px] uppercase shadow-3xs shrink-0 select-none">
                          {inst.name.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-display font-black text-slate-850 block uppercase leading-none text-[10.5px]">{inst.name}</span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5 truncate max-w-[150px] font-medium">{inst.fullName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-extrabold font-display">
                        {inst.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-750">
                      <div className="flex items-center gap-0.5 text-[9.5px]">
                        <MapPin size={10} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{inst.province} &bull; {inst.municipio}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 text-[10.5px]">
                      {inst.totalCorrespondence.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 text-[10.5px]">
                      {inst.totalAgents}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-black text-emerald-600 text-[10.5px]">
                      {inst.responseRate}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-500">
                      <div className="flex items-center justify-center gap-0.5 text-[9.5px]">
                        <Clock size={10} className="text-slate-400 shrink-0" />
                        <span>{inst.lastActivity}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border tracking-wider shrink-0 select-none ${
                        inst.status === 'Ativa' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${inst.status === 'Ativa' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(inst)}
                          className="py-1 px-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-[8.5px] font-black uppercase tracking-wider"
                          title="Editar Instituição"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setSelectedInstHistory(inst)}
                          className="py-1 px-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded-md text-slate-600 hover:text-indigo-650 transition-colors cursor-pointer text-[8.5px] font-black uppercase tracking-wider"
                          title="Historial"
                        >
                          Hist
                        </button>
                        <button
                          onClick={() => toggleStatus(inst)}
                          className={`px-1.5 py-1 rounded-md border text-[8.5px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            inst.status === 'Ativa'
                              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/30'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/30'
                          }`}
                        >
                          {inst.status === 'Ativa' ? 'Off' : 'On'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 bg-white border border-slate-200 rounded-[32px] text-center text-slate-400 italic font-sans shadow-3xs text-xs">
            Nenhuma instituição governamental corresponde aos filtros aplicados.
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="bg-white border border-slate-205 rounded-[32px] p-6 flex items-center justify-between text-[11px] font-bold shadow-3xs">
            <span className="text-slate-400">Páginas {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
              >
                Seguinte
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creation and Modification Drawer Dialog */}
      <AnimatePresence>
        {(isCreateModalOpen || editingInstitution) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCreateModalOpen(false); setEditingInstitution(null); }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[600]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl z-[601] border border-slate-100"
            >
              <div className="bg-slate-950 text-white p-6 relative">
                <span className="text-[10px] font-mono tracking-widest uppercase text-red-500 font-bold block">
                  Operações do Directório Central
                </span>
                <h3 className="text-base font-black uppercase italic tracking-tight text-white mt-1 mb-0">
                  {editingInstitution ? 'Editar Cadastro da Instituição' : 'Integrar Nova Instituição'}
                </h3>
                <button 
                  onClick={() => { setIsCreateModalOpen(false); setEditingInstitution(null); }}
                  className="absolute right-6 top-6 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full p-2 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={editingInstitution ? handleEdit : handleCreate} className="p-6 md:p-8 space-y-4">
                {/* Name abbreviation */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sigla da Instituição (Ex: AGT, SME) *</label>
                  <input 
                    type="text" 
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="SME"
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white uppercase font-mono"
                  />
                </div>

                {/* Name Full */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nome Institucional Completo *</label>
                  <input 
                    type="text" 
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="Serviço de Migração e Estrangeiros"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                {/* Grid categories / Province / Municipio */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Categoria Económica / Governamental</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value="Finanças">Finanças</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Justiça">Justiça</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Província Sede</label>
                    <select
                      value={formProvince}
                      onChange={(e) => {
                        setFormProvince(e.target.value);
                        const list = MUNICIPALITIES_BY_PROVINCE[e.target.value] || [];
                        setFormMunicipio(list[1] || list[0] || '');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                    >
                      {Object.keys(MUNICIPALITIES_BY_PROVINCE).filter(p => p !== 'Todas').map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Município</label>
                    <select
                      value={formMunicipio}
                      onChange={(e) => setFormMunicipio(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-slate-800 cursor-pointer text-slate-800"
                    >
                      {formMunicipalities.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsCreateModalOpen(false); setEditingInstitution(null); }}
                    className="flex-1 bg-white border border-slate-250 text-slate-700 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Anular
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 border-0 text-white hover:bg-slate-800 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-md transition-all cursor-pointer"
                  >
                    {editingInstitution ? 'Guardar Sincronia' : 'Registar & Homologar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Interoperability Activity History Modal */}
      <AnimatePresence>
        {selectedInstHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInstHistory(null)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[600]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl z-[601] border border-slate-100"
            >
              <div className="bg-indigo-950 text-white p-6 relative">
                <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-bold block">
                  Telemetria Geral e Actividade Síncrona
                </span>
                <h3 className="text-base font-black uppercase italic tracking-tight text-white mt-1 mb-0">
                  Histórico: {selectedInstHistory.name}
                </h3>
                <button 
                  onClick={() => setSelectedInstHistory(null)}
                  className="absolute right-6 top-6 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full p-2 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-2xl text-[10px] font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block leading-none">TOTAL DE AGENTES CDA</span>
                    <span className="text-base text-slate-900 font-mono font-black">{selectedInstHistory.totalAgents}</span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block leading-none">TAXA DE SUCESSO SLA</span>
                    <span className="text-base text-emerald-600 font-mono font-black">{selectedInstHistory.responseRate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">Filas de logs auditados em Tempo Real</span>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {activityHistory.map((log, index) => (
                      <div key={index} className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden transition-colors">
                        <div className="flex justify-between items-start text-[10px] gap-2">
                          <p className="font-bold text-slate-700 leading-normal">{log.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 font-mono text-[8px] text-slate-400">
                          <span className="font-black text-indigo-600 uppercase">{log.user}</span>
                          <span>&bull;</span>
                          <span>{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInstHistory(null)}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl font-black text-[9.5px] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Fechar Historial
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
