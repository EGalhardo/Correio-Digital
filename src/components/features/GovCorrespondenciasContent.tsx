import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mail, 
  MapPin, 
  Building2, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  CheckCircle, 
  Inbox, 
  Send,
  Eye,
  X,
  FileText,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Correspondence } from '../../types';

export interface GovCorrespondenciasContentProps {
  correspondences?: Correspondence[];
  onAddCorrespondence?: (newCor: Correspondence) => void;
  onUpdateStatus?: (id: string, newStatus: string) => void;
}

const INITIAL_CORRESPONDENCES: Correspondence[] = [
  {
    id: "CDA-90118",
    sender: "Ministério das Finanças (MINFIN)",
    recipient: "Manuel de Vasconcelos",
    subject: "Notificação Geral de Isenção Fiscal Sócio-Profissional",
    originProvince: "Luanda",
    destinationProvince: "Benguela",
    institution: "AGT",
    status: "Não Lida",
    date: "02/06/2026",
    body: "Prezado Cidadão, sob a égide da resolução fiscal n. 450 do Ministério das Finanças, confirmamos que a isenção tributária temporária sobre os rendimentos laborais está validada eletronicamente no sistema integrado."
  },
  {
    id: "CDA-88123",
    sender: "SME - Posto Aduaneiro",
    recipient: "Edlasio Galhardo",
    subject: "Homologação de Emissão de Passaporte de Serviço",
    originProvince: "Cabinda",
    destinationProvince: "Luanda",
    institution: "SME",
    status: "Lida",
    date: "01/06/2026",
    body: "Exmo Senhor, informamos que o pedido de emissão de passaporte de categoria de serviço foi deferido pela Direção Geral do Serviço de Migração e Estrangeiros."
  },
  {
    id: "CDA-77123",
    sender: "Tribunal de Comarca de Viana",
    recipient: "Ana Maria dos Santos",
    subject: "Intimação Administrativa Eletrónica Unificada",
    originProvince: "Luanda",
    destinationProvince: "Luanda",
    institution: "Tribunal Supremo",
    status: "Enviada",
    date: "28/05/2026",
    body: "Notificamos o destinatário sobre o parecer homologado de audiência arbitral no âmbito dos registros prediais integrados de Viana."
  },
  {
    id: "CDA-65104",
    sender: "Conservatória de Registo Civil",
    recipient: "José Kalunga",
    subject: "Disponibilização de Certidão de Nascimento Digitalizada",
    originProvince: "Huambo",
    destinationProvince: "Huíla",
    institution: "Registo Civil",
    status: "Não Lida",
    date: "27/05/2026",
    body: "Prezado requerente, informamos que o seu registro civil foi unificado a nível nacional e a certidão digital de nascimento correspondente encontra-se lavrada no barramento."
  },
  {
    id: "CDA-44301",
    sender: "ENDE - Direção Comercial",
    recipient: "Filomena da Rocha",
    subject: "Instalação Coletiva de Contador Pré-Pago Integrado",
    originProvince: "Bengo",
    destinationProvince: "Luanda",
    institution: "ENDE",
    status: "Enviada",
    date: "25/05/2026",
    body: "A ENDE vem comunicar que a regularização técnica e o plano de transição de contador pré-pago foi implementada no seu domicílio com apoio governamental."
  }
];

export function GovCorrespondenciasContent({
  correspondences: propsCorrespondences,
  onAddCorrespondence,
  onUpdateStatus
}: GovCorrespondenciasContentProps) {
  const [localCorrespondences, setLocalCorrespondences] = useState<Correspondence[]>(INITIAL_CORRESPONDENCES);
  const correspondences = propsCorrespondences || localCorrespondences;
  
  const handleAddCorrespondence = (newCor: Correspondence) => {
    if (onAddCorrespondence) {
      onAddCorrespondence(newCor);
    } else {
      setLocalCorrespondences(prev => [newCor, ...prev]);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
    } else {
      setLocalCorrespondences(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
    if (selectedLetter && selectedLetter.id === id) {
      setSelectedLetter(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    sender: 'Ministério das Finanças (MINFIN)',
    recipient: 'Edlasio Galhardo',
    institution: 'AGT',
    originProvince: 'Luanda',
    destinationProvince: 'Benguela',
    body: 'Prezado Cidadão, sob a égide dos regulamentos integrados celeres, formalizamos o despacho do presente expediente eletrónico de correspondência governamental.'
  });

  const [activeTab, setActiveTab] = useState<'Todas' | 'Lida' | 'Não Lida' | 'Enviada'>('Todas');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced Search States
  const [searchSender, setSearchSender] = useState('');
  const [searchRecipient, setSearchRecipient] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [searchOrigin, setSearchOrigin] = useState('Todas');
  const [searchDestination, setSearchDestination] = useState('Todas');
  const [selectedLetter, setSelectedLetter] = useState<Correspondence | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const provinces = ["Todas", "Luanda", "Benguela", "Huíla", "Cabinda", "Bengo", "Huambo"];

  const filteredCorrespondences = useMemo(() => {
    return correspondences.filter(item => {
      // Tab filter
      if (activeTab !== 'Todas' && item.status !== activeTab) return false;

      // Advanced search filters
      if (searchSender && !item.sender.toLowerCase().includes(searchSender.toLowerCase())) return false;
      if (searchRecipient && !item.recipient.toLowerCase().includes(searchRecipient.toLowerCase())) return false;
      if (searchSubject && !item.subject.toLowerCase().includes(searchSubject.toLowerCase())) return false;
      if (searchOrigin !== 'Todas' && item.originProvince !== searchOrigin) return false;
      if (searchDestination !== 'Todas' && item.destinationProvince !== searchDestination) return false;

      return true;
    });
  }, [correspondences, activeTab, searchSender, searchRecipient, searchSubject, searchOrigin, searchDestination]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCorrespondences.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCorrespondences, currentPage]);

  const totalPages = Math.ceil(filteredCorrespondences.length / itemsPerPage) || 1;

  const countForStatus = (status: 'Lida' | 'Não Lida' | 'Enviada') => {
    return correspondences.filter(item => item.status === status).length;
  };

  return (
    <div className="pb-32 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-slate-100 mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none font-sans">
            Gestão de Correspondências
          </h1>
          <div className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
            <div className="w-1 h-2 bg-indigo-600 rounded-full" />
            Centro de Telemetria e Tráfego Governamental &bull; CDA Correios
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsDispatchModalOpen(true)}
            className="w-full sm:w-auto bg-indigo-950 hover:bg-indigo-900 border border-indigo-950 text-white rounded-2xl px-5 py-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all text-xs font-black uppercase tracking-wider shadow-md shadow-slate-300 cursor-pointer border-0 outline-none"
          >
            <Plus size={15} /> Novo Expediente
          </button>

          {/* Tab switcher mirroring Gov platform design system */}
          <div className="flex items-center bg-slate-100 p-1 rounded-[22px] border border-slate-200">
          {(['Todas', 'Não Lida', 'Lida', 'Enviada'] as const).map((tabName) => {
            const count = tabName === 'Todas' ? correspondences.length : countForStatus(tabName as any);
            return (
              <button
                key={tabName}
                onClick={() => {
                  setActiveTab(tabName);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tabName 
                    ? 'bg-white text-indigo-600 shadow-md border-0' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tabName === 'Todas' ? 'Todos' : tabName + 's'}
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black ${
                  activeTab === tabName ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

      {/* Advanced Search Area */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-6 mb-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
              Pesquisa Avançada Unificada
            </h3>
          </div>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5"
          >
            {showAdvanced ? 'Recolher Campos' : 'Expandir Filtros'}
            <ChevronDown size={12} className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remetente (Instituição)</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchSender} 
                onChange={(e) => setSearchSender(e.target.value)} 
                placeholder="Ex: AGT, SME..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
              />
              <Building2 size={13} className="text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destinatário (Cidadão)</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchRecipient} 
                onChange={(e) => setSearchRecipient(e.target.value)} 
                placeholder="Ex: Manuel de Vasconcelos..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
              />
              <Search size={13} className="text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assunto / Tópico</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchSubject} 
                onChange={(e) => setSearchSubject(e.target.value)} 
                placeholder="Ex: Isenção fiscal, Passaporte..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
              />
              <Mail size={13} className="text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {showAdvanced && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100"
          >
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Província de Origem</label>
              <select
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-slate-800 focus:bg-white cursor-pointer"
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov === 'Todas' ? 'Todas as Províncias' : prov}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Província de Destino</label>
              <select
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-slate-800 focus:bg-white cursor-pointer"
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov === 'Todas' ? 'Todas as Províncias' : prov}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Beautiful tabular list layout replacing the card grid */}
      <div className="space-y-6">
        {paginatedItems.length > 0 ? (
          <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[600px] border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-5 rounded-l-2xl">Código / Data</th>
                  <th className="py-4 px-5">Instituição / Remetente</th>
                  <th className="py-4 px-5">Destinatário</th>
                  <th className="py-4 px-5">Assunto &amp; Resumo</th>
                  <th className="py-4 px-5">Rota (Origem &rarr; Destino)</th>
                  <th className="py-4 px-5 text-center">Estado</th>
                  <th className="py-4 px-5 text-center rounded-r-2xl">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="text-xs text-[#334155] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-150 border border-slate-100 px-2.5 py-0.5 rounded-lg inline-block">
                          {item.id}
                        </span>
                        <span className="block text-[9.5px] font-mono font-black text-slate-400 mt-1">{item.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase font-mono tracking-wider shrink-0">
                          {item.institution}
                        </span>
                        <span className="font-sans font-extrabold text-[11px] text-slate-650 uppercase tracking-tight block truncate max-w-[180px]" title={item.sender}>
                          {item.sender}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-705">
                      <div className="flex items-center gap-1.5 font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0e2b64] shrink-0" />
                        <span className="truncate max-w-[180px]" title={item.recipient}>{item.recipient}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-[300px]">
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-slate-900 text-xs tracking-tight italic line-clamp-1">
                          &ldquo;{item.subject}&rdquo;
                        </h4>
                        <p className="text-slate-450 text-[10px] leading-relaxed line-clamp-1">
                          {item.body}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-slate-400 shrink-0" />
                        <span className="font-display font-medium text-[10px] text-slate-500 uppercase tracking-tight block shrink-0 select-none">{item.originProvince} &rarr; {item.destinationProvince}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider shrink-0 select-none ${
                        item.status === 'Lida' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700 animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button 
                        onClick={() => setSelectedLetter(item)}
                        className="py-1 px-3 bg-white border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 rounded-xl text-[9.5px] font-black uppercase text-indigo-700 transition-colors cursor-pointer"
                      >
                        <Eye size={12} className="inline-block mr-1 -mt-0.5" /> Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 bg-white border border-slate-200 rounded-[32px] text-center text-slate-400 italic font-sans shadow-3xs text-xs">
            Nenhuma correspondência governamental encontrada com os filtros fornecidos.
          </div>
        )}

        {/* List Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white border border-slate-205 rounded-[32px] p-6 flex items-center justify-between text-[11px] font-bold shadow-3xs">
            <span className="text-slate-400">Página {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl disabled:opacity-50 transition-colors"
              >
                Seguinte
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[600]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl z-[601] border border-slate-100"
            >
              <div className="bg-slate-900 text-white p-6 relative">
                <span className="text-[10px] font-mono tracking-widest uppercase text-red-500 font-bold block">Ficha de Tráfego Oficial</span>
                <h3 className="text-base font-black uppercase italic tracking-tight text-white mt-1 mb-0">{selectedLetter.id}</h3>
                <button 
                  onClick={() => setSelectedLetter(null)}
                  className="absolute right-6 top-6 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full p-2 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-5 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Remetente</span>
                    <p className="font-bold text-slate-900 mt-1">{selectedLetter.sender}</p>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md mt-1 inline-block uppercase">{selectedLetter.institution}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Destinatário</span>
                    <p className="font-bold text-slate-900 mt-1">{selectedLetter.recipient}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-[10px]">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">Origem</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-1">
                      <MapPin size={11} className="text-slate-400" /> {selectedLetter.originProvince}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">Destino</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-1">
                      <MapPin size={11} className="text-slate-400" /> {selectedLetter.destinationProvince}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">Assunto</span>
                  <p className="font-black text-slate-900 text-sm italic pr-4">{selectedLetter.subject}</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">Corpo do Ofício</span>
                  <p className="text-slate-650 leading-relaxed font-sans select-text">{selectedLetter.body}</p>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase pt-2 pb-4">
                  <span>Processado: CDA_BOT_SYS_v2</span>
                  <span>Data de Envio: {selectedLetter.date}</span>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateStatus(selectedLetter.id, selectedLetter.status === 'Lida' ? 'Não Lida' : 'Lida');
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all border outline-none ${
                      selectedLetter.status === 'Lida'
                        ? 'bg-slate-50 border-slate-200 text-slate-750 hover:bg-slate-105'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/10'
                    }`}
                  >
                    {selectedLetter.status === 'Lida' ? 'Marcar como Não Lida' : 'Marcar como Lida / Homologada'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLetter(null)}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border-0 outline-none cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dispatch Modal / Registrar Nova Correspondência */}
      <AnimatePresence>
        {isDispatchModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDispatchModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[600]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl z-[601] border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-indigo-900 text-white p-6 relative">
                <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300 font-bold block">Expedição Administrativa</span>
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white mt-1 mb-0">Despachar Novo Ofício / Correspondência</h3>
                <button 
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="absolute right-6 top-6 bg-white/10 hover:bg-white/20 text-white border-0 rounded-full p-2 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!formData.subject.trim() || !formData.body.trim()) {
                    alert('Por favor, preencha o assunto e o corpo do ofício.');
                    return;
                  }
                  const codeNumber = Math.floor(10000 + Math.random() * 90000);
                  const newLetter: Correspondence = {
                    id: `CDA-${codeNumber}`,
                    sender: formData.sender,
                    recipient: formData.recipient,
                    subject: formData.subject,
                    originProvince: formData.originProvince,
                    destinationProvince: formData.destinationProvince,
                    institution: formData.institution,
                    status: 'Não Lida',
                    date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    body: formData.body
                  };
                  handleAddCorrespondence(newLetter);
                  setIsDispatchModalOpen(false);
                  setFormData({
                    subject: '',
                    sender: 'Ministério das Finanças (MINFIN)',
                    recipient: 'Edlasio Galhardo',
                    institution: 'AGT',
                    originProvince: 'Luanda',
                    destinationProvince: 'Benguela',
                    body: 'Prezado Cidadão, sob a égide dos regulamentos integrados celeres, formalizamos o despacho do presente expediente eletrónico de correspondência governamental.'
                  });
                }}
                className="p-6 md:p-8 space-y-5 text-slate-750"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Órgão Emissor / Remetente</span>
                    <input 
                      type="text"
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-650 focus:bg-white text-slate-900"
                      value={formData.sender}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender: e.target.value }))}
                      required
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Sigla da Instituição</span>
                    <select
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-650 focus:bg-white text-slate-900"
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                    >
                      <option value="AGT">AGT</option>
                      <option value="SME">SME</option>
                      <option value="Tribunal Supremo">SUPREMO</option>
                      <option value="Registo Civil">MINJUS (Registo Civil)</option>
                      <option value="ENDE">ENDE</option>
                      <option value="EPAL">EPAL</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Cidadão Destinatário</span>
                    <input 
                      type="text"
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-655 focus:bg-white text-slate-900"
                      value={formData.recipient}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                      placeholder="Edlasio Galhardo"
                      required
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Assunto do Ofício</span>
                    <input 
                      type="text"
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-655 focus:bg-white text-slate-900"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Ex: Isenção Tributária de IRT"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Província de Origem</span>
                    <select
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-655 focus:bg-white text-slate-900"
                      value={formData.originProvince}
                      onChange={(e) => setFormData(prev => ({ ...prev, originProvince: e.target.value }))}
                    >
                      {provinces.filter(p => p !== 'Todas').map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Província de Destino</span>
                    <select
                      className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-655 focus:bg-white text-slate-900"
                      value={formData.destinationProvince}
                      onChange={(e) => setFormData(prev => ({ ...prev, destinationProvince: e.target.value }))}
                    >
                      {provinces.filter(p => p !== 'Todas').map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-1.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-sans">Corpo / Descrição do Ofício Oficial</span>
                  <textarea 
                    rows={4}
                    className="border border-slate-205 bg-slate-50/50 rounded-xl p-3 text-xs font-medium outline-none focus:border-indigo-655 focus:bg-white text-slate-900 leading-relaxed resize-none"
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    required
                  />
                </label>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all border-0 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={12} /> Despachar Ofício
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
