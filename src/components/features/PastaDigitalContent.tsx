/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Folder, 
  FileText, 
  Calendar, 
  Building2, 
  Tag, 
  ShieldCheck, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  ChevronRight, 
  History, 
  Briefcase, 
  FileSignature, 
  FileSpreadsheet, 
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export interface PermanentDoc {
  id: string;
  name: string;
  category: 'civil' | 'fiscal' | 'licencas' | 'certificados' | 'contratos' | 'correspondencias' | 'processos';
  categoryLabel: string;
  date: string;
  institution: string;
  code: string;
  issuer: string;
  status: 'Ativo' | 'Vencido' | 'Em Apreciação' | 'Arquivado';
  description: string;
  holder: string;
  meta: Record<string, string>;
  isUrgent?: boolean;
}

const INITIAL_PERMANENT_DOCS: PermanentDoc[] = [
  // 1. Documentos civis
  {
    id: 'CD-CIV-001',
    name: 'Cédula de Nascimento Digitalizada',
    category: 'civil',
    categoryLabel: 'Documentos Civis',
    date: '12/10/2021',
    institution: 'Conservatória do Registo Civil',
    code: 'REG-CIV-9281-LA',
    issuer: 'Conservatória do Registo Civil de Luanda',
    status: 'Ativo',
    description: 'Assento oficial de nascimento lavrado sob o número 245/2021 com efeito retroativo ao registo geral do cidadão.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Nome do Registado': 'Edlasio Galhardo',
      'Paternidade': 'Antonio Galhardo',
      'Maternidade': 'Maria Galhardo',
      'Localidade de Nascimento': 'Luanda, Angola',
      'Data de Registo': '12 de Outubro de 2021',
      'Conservador Responsável': 'Dra. Elsa Narciso'
    }
  },
  {
    id: 'CD-CIV-002',
    name: 'Assento de Casamento Oficial',
    category: 'civil',
    categoryLabel: 'Documentos Civis',
    date: '15/05/2024',
    institution: 'Conservatória do Registo Civil',
    code: 'CAS-CIV-3342-AO',
    issuer: 'Conservatória de Casamentos de Angola',
    status: 'Ativo',
    description: 'Documento original de homologação e certidão de matrimónio oficial no regime de comunhão de adquiridos.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Cônjuge': 'Beatriz Mateus Galhardo',
      'Regime de Bens': 'Bens Adquiridos',
      'Número do Assento': '104/2024',
      'Livro de Registo': 'Folha 45, Livro B-12',
      'Data de Celebração': '15 de Maio de 2024'
    }
  },
  // 2. Histórico fiscal
  {
    id: 'CD-FIS-001',
    name: 'Certidão de Conformidade e Não Devedor',
    category: 'fiscal',
    categoryLabel: 'Histório Fiscal',
    date: '10/05/2026',
    institution: 'AGT',
    code: 'AGT-ND-2026-981',
    issuer: 'Administração Geral Tributária',
    status: 'Ativo',
    description: 'Comprova que o cidadão contribuinte possui a sua situação fiscal regularizada com o Estado angolano perante impostos diretos e aduaneiros.',
    holder: 'Edlasio Galhardo',
    meta: {
      'NIF contribuinte': '3082549626',
      'Validade certificada': '10 de Novembro de 2026',
      'Estado Fiscal': 'Sem Obrigações Pendentes',
      'Tipo de Imposto': 'IRT & Predial Isento',
      'Repartição de Origem': 'Repartição Fiscal do 1º Bairro'
    }
  },
  {
    id: 'CD-FIS-002',
    name: 'Liquidação de Imposto Predial Urbano',
    category: 'fiscal',
    categoryLabel: 'Histório Fiscal',
    date: '02/03/2025',
    institution: 'AGT',
    code: 'AGT-IPU-5541-LU',
    issuer: 'Repartição de Finanças de Cacuaco',
    status: 'Arquivado',
    description: 'Relatório consolidado de auto-liquidação anual predial do imóvel registado na comarca tributária.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Inscrição Imobiliária': 'IPU-9921-A',
      'Valor liquidado': '45.000,00 AOA',
      'Exibição Documental': 'Quitado',
      'Exercício de Referência': 'Ano Fiscal 2024',
      'Data de Liquidação': '02 de Março de 2025'
    }
  },
  // 3. Licenças
  {
    id: 'CD-LIC-001',
    name: 'Carta de Condução Certificada',
    category: 'licencas',
    categoryLabel: 'Licenças',
    date: '18/06/2023',
    institution: 'PNA',
    code: 'PNA-DT-88221-LN',
    issuer: 'Direcção Nacional de Viação e Trânsito',
    status: 'Ativo',
    description: 'Título legal de habilitação à condução de veículos ligeiros tipo B em território nacional e SADC.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Número de Carta': 'AO-CE-99281-2',
      'Categoria de Veículos': 'B (Ligeiros até 3.500 Kg)',
      'Validade do Título': '18 de Junho de 2028',
      'Restrições médicas': 'Apto, uso obrigatório de lentes graduadas',
      'Emissor Policial': 'Superintendente João de Barros'
    }
  },
  {
    id: 'CD-LIC-002',
    name: 'Licença de Instalação Comercial e Actividade',
    category: 'licencas',
    categoryLabel: 'Licenças',
    date: '14/01/2026',
    institution: 'Ministérios',
    code: 'MINCUL-LIC-3329',
    issuer: 'Ministério da Indústria e Comércio',
    status: 'Ativo',
    description: 'Licença industrial e alvará comercial simplificado para operação de escritórios de desenvolvimento de tecnologias civis.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Alvará Comercial': 'ALV-MIN-2026/882',
      'Atividade Autorizada': 'Serviços de Programação, Consultoria de TI',
      'Área Geográfica': 'Província de Luanda',
      'Validade de Alvará': '14 de Janeiro de 2031'
    }
  },
  // 4. Certificados
  {
    id: 'CD-CER-001',
    name: 'Certificado de Registro Criminal Digitalizado',
    category: 'certificados',
    categoryLabel: 'Certificados',
    date: '20/05/2026',
    institution: 'Conservatória',
    code: 'MINJUS-RC-2026-1182',
    issuer: 'Direção Nacional de Identificação Civil e Criminal',
    status: 'Ativo',
    description: 'Certifica para fins de candidatura laboral e exercício público que, à data de emissão, não constam registos de condenações criminais pendentes.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Fins a que se destina': 'Laborais / Administrativos',
      'Histórico de Crimes': 'NADA CONSTA',
      'Validade no Estado': '20 de Agosto de 2026',
      'Base de dados consultada': 'Registo Geral Central de Angola'
    }
  },
  {
    id: 'CD-CER-002',
    name: 'Certificado de Licenciatura - Engenharia Informática',
    category: 'certificados',
    categoryLabel: 'Certificados',
    date: '22/12/2022',
    institution: 'Ministerios',
    code: 'UAN-ENG-2022-9921',
    issuer: 'Universidade Agostinho Neto - Faculdade de Engenharia',
    status: 'Ativo',
    description: 'Título académico de Licenciatura em Engenharia Informática com menção honrosa em Sistemas de Informação Distribuídos.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Grau Académico': 'Engenheiro de Informática',
      'Média Final de Curso': '17 Valores',
      'Número de Diploma': 'UAN-L-998-2022',
      'Reitor Responsável': 'Prof. Dr. Pedro Magalhães'
    }
  },
  // 5. Contratos
  {
    id: 'CD-CON-001',
    name: 'Contrato de Fornecimento de Energia ENDE',
    category: 'contratos',
    categoryLabel: 'Contratos',
    date: '09/03/2020',
    institution: 'ENDE',
    code: 'ENDE-CON-30982-LU',
    issuer: 'Empresa Nacional de Distribuição de Electricidade',
    status: 'Ativo',
    description: 'Acordo bilateral permanente para prestação de serviços essenciais de baixa tensão e tarifa social de energia.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Número do Contrato': 'ENDE-AO-30982772',
      'Local de Instalação': 'Quarteirão 45, Casa A-23, Talatona',
      'Tarifa Aplicada': 'Doméstica Monofásica',
      'Potência Contratada': '6.9 kVA',
      'Código de Cliente': 'CL-ENDE-4412-LU'
    }
  },
  {
    id: 'CD-CON-002',
    name: 'Contrato de Prestação de Serviços Digitais',
    category: 'contratos',
    categoryLabel: 'Contratos',
    date: '10/01/2025',
    institution: 'EPAL',
    code: 'EPAL-CON-44521-LU',
    issuer: 'Empresa Pública de Água de Luanda',
    status: 'Ativo',
    description: 'Contrato de adesão permanente para fornecimento público de água potável domiciliar canalizada e monitorização eletrónica.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Número do Contrato': 'EPAL-AO-44521B',
      'Código de Contador': 'CNT-1123-EPAL',
      'Tipo de Consumo': 'Residencial',
      'Data de Assinatura': '10 de Janeiro de 2025'
    }
  },
  // 6. Correspondências antigas
  {
    id: 'CD-COR-001',
    name: 'Aviso Prévio de Notificação Fiscal',
    category: 'correspondencias',
    categoryLabel: 'Correspondência Antiga',
    date: '18/11/2024',
    institution: 'AGT',
    code: 'CORR-AGT-2024-9121',
    issuer: 'Gabinete de Contencioso Fiscal da AGT',
    status: 'Arquivado',
    description: 'Notificação extrajudicial acerca da retificação voluntária de taxas camarárias do condomínio da província de Luanda.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Número de Ofício': 'OF-2241/DF-2024',
      'Assunto Principal': 'Regularização de Declarativa',
      'Tratamento': 'Concluído e Regularizado',
      'Interveniente': 'Auditor Geral Mateus Neto'
    }
  },
  {
    id: 'CD-COR-002',
    name: 'Ofício de Concessão de Bolsas de Estudo',
    category: 'correspondencias',
    categoryLabel: 'Correspondência Antiga',
    date: '04/09/2022',
    institution: 'Ministerios',
    code: 'CORR-MES-2022-311',
    issuer: 'Ministério do Ensino Superior, Ciência, Tecnologia e Inovação',
    status: 'Arquivado',
    description: 'Ofício emitido com deliberação de atribuição de subsídio parcial para desenvolvimento académico em ciência computacional.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Comissão de Análise': 'INAGBE - Bolsas Nacionais',
      'Deliberação': 'Aprovada com co-participação',
      'Código de Registo': 'B-MESCTI-0082-22'
    }
  },
  // 7. Processos ativos
  {
    id: 'CD-PRO-001',
    name: 'Processo de Concessão de Título de Terra',
    category: 'processos',
    categoryLabel: 'Processo Activo',
    date: '14/04/2026',
    institution: 'Conservatória',
    code: 'IPG-TERRA-2026-4412',
    issuer: 'Instituto Geográfico e Cadastral de Angola',
    status: 'Em Apreciação',
    description: 'Processo em andamento para concessão definitiva e escritura de lote habitacional no núcleo urbano de Luanda Sul.',
    holder: 'Edlasio Galhardo',
    isUrgent: true,
    meta: {
      'Número de Processo': 'IGCA-LU-4412/26',
      'Estado Atual': 'Aguardando Medição Cadastral',
      'Gestor Responsável': 'Eng. Felisberto Costa',
      'Área Total do Lote': '450 m²',
      'Prioridade Processual': 'Acelerada Administrativa'
    }
  },
  {
    id: 'CD-PRO-002',
    name: 'Processo de Homologação de NIF Corporativo',
    category: 'processos',
    categoryLabel: 'Processo Activo',
    date: '11/05/2026',
    institution: 'AGT',
    code: 'AGT-P-CORP-902',
    issuer: 'Balcão Único do Empreendedor da AGT',
    status: 'Em Apreciação',
    description: 'Homologação cambial e atribuição de impostos aplicados a nova startup de comércio eletrónico e logística.',
    holder: 'Edlasio Galhardo',
    meta: {
      'Número de Entrada': 'ENT-AGT-33420/26',
      'Estado Atual': 'Análise de Enquadramento de IRT',
      'Técnico Tributário': 'Dr. Afonso Henriques',
      'Prazos estimados': 'Conclusão em 8 dias úteis'
    }
  }
];

interface PastaDigitalContentProps {
  logSecurityEvent?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
  setTab: (tab: string) => void;
}

export function PastaDigitalContent({ logSecurityEvent, setTab }: PastaDigitalContentProps) {
  const [docs, setDocs] = useState<PermanentDoc[]>(INITIAL_PERMANENT_DOCS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [instFilter, setInstFilter] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [selectedDoc, setSelectedDoc] = useState<PermanentDoc | null>(null);

  // List of unique institutions for filter
  const institutions = useMemo(() => {
    const list = new Set(docs.map(d => d.institution));
    return ['todas', ...Array.from(list)];
  }, [docs]);

  // Categories list
  const categories = [
    { id: 'todas', label: 'Tudo', count: docs.length },
    { id: 'civil', label: 'Docs Civis', count: docs.filter(d => d.category === 'civil').length },
    { id: 'fiscal', label: 'Historial Fiscal', count: docs.filter(d => d.category === 'fiscal').length },
    { id: 'licencas', label: 'Licenças', count: docs.filter(d => d.category === 'licencas').length },
    { id: 'certificados', label: 'Certificados', count: docs.filter(d => d.category === 'certificados').length },
    { id: 'contratos', label: 'Contratos', count: docs.filter(d => d.category === 'contratos').length },
    { id: 'correspondencias', label: 'Corr. Antigas', count: docs.filter(d => d.category === 'correspondencias').length },
    { id: 'processos', label: 'Proc. Ativos', count: docs.filter(d => d.category === 'processos').length }
  ];

  // Filtering documents
  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      // Search matches
      const matchesSearch = 
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.id.toLowerCase().includes(search.toLowerCase()) ||
        doc.institution.toLowerCase().includes(search.toLowerCase()) ||
        doc.code.toLowerCase().includes(search.toLowerCase()) ||
        doc.issuer.toLowerCase().includes(search.toLowerCase()) ||
        Object.values(doc.meta).some(val => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase()));

      // Category matches
      const matchesCategory = categoryFilter === 'todas' || doc.category === categoryFilter;

      // Institution matches
      const matchesInst = instFilter === 'todas' || doc.institution === instFilter;

      return matchesSearch && matchesCategory && matchesInst;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Simple date comparison (DD/MM/YYYY)
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
      }
    });
  }, [docs, search, categoryFilter, instFilter, sortBy]);

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'civil': return { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', iconBg: 'bg-indigo-600 text-white' };
      case 'fiscal': return { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', iconBg: 'bg-emerald-600 text-white' };
      case 'licencas': return { bg: 'bg-amber-50 border-amber-100 text-amber-700', iconBg: 'bg-amber-600 text-white' };
      case 'certificados': return { bg: 'bg-blue-50 border-blue-100 text-blue-700', iconBg: 'bg-blue-600 text-white' };
      case 'contratos': return { bg: 'bg-pink-50 border-pink-100 text-pink-700', iconBg: 'bg-pink-600 text-white' };
      case 'correspondencias': return { bg: 'bg-slate-50 border-slate-150 text-slate-700', iconBg: 'bg-slate-600 text-white' };
      case 'processos': return { bg: 'bg-rose-50 border-rose-100 text-rose-700', iconBg: 'bg-rose-600 text-white' };
      default: return { bg: 'bg-slate-50 border-slate-100 text-slate-700', iconBg: 'bg-slate-600 text-white' };
    }
  };

  const notifyDownload = (doc: PermanentDoc) => {
    alert(`A descarregar cópia eletrónica autenticada e assinada com o carimbo oficial CDA para o documento:\n${doc.name}\n\nCódigo de rastreamento: ${doc.id}`);
    logSecurityEvent?.(`DESCARGA_DOC: Cópia criptografada autenticada de ${doc.name} (${doc.code}) emitida.`, 'success');
  };

  const handleShareDoc = (doc: PermanentDoc) => {
    alert(`QR-Code dinâmico de partilha temporário de 15 minutos foi gerado para a instituição pretendida.\nCódigo SHA: ${doc.code}`);
    logSecurityEvent?.(`PARTILHA_DOC: QR-Code de partilha voluntária gerado para o documento ${doc.name}.`, 'info');
  };

  return (
    <section className="space-y-6 pb-12">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Folder size={24} />
          </div>
          <div>
            <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase">Cidadania Angola Integrada</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
              Pasta Digital Permanente
            </h3>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
              Dossiê Central de Correspondência Civil e Historial Próprio com Validade Jurídica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck size={14} className="text-emerald-500 animate-pulse" /> Custódia Segura SME
          </span>
        </div>
      </div>

      {/* Info Warning banner */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-50 border border-indigo-100/60 rounded-[24px] p-5 flex items-start gap-3.5 shadow-xs">
        <Info size={20} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h5 className="text-xs font-black uppercase text-indigo-950 tracking-wider">Acerca deste Dossiê</h5>
          <p className="text-[11px] text-indigo-800 leading-relaxed font-bold uppercase opacity-85">
            A Pasta Digital Permanente é atualizada diretamente pelas Agências Governamentais (Conservatória, AGT, SME e Ministérios). Qualquer cidadão pode consultar e partilhar cópias certificadas para atos públicos ou privados imediatamente.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-150 rounded-[30px] p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Busca Rápida (Quick Search) */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input 
              type="text"
              placeholder="Busca rápida em toda a pasta permanente (ID, nome, metadados)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-400 rounded-2xl pl-12 pr-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-slate-900 focus:bg-white transition-all outline-none placeholder:text-slate-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
            {/* Filtro por Instituição */}
            <div className="relative shrink-0 w-full sm:w-[200px]">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
              <select
                value={instFilter}
                onChange={(e) => setInstFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-400 rounded-2xl pl-10 pr-8 py-3 text-xs font-black uppercase tracking-widest text-slate-700 outline-none appearance-none cursor-pointer"
              >
                <option value="todas">Instituição: Todas</option>
                {institutions.filter(inst => inst !== 'todas').map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Ordenar:</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border ${sortBy === 'date' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Data
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border ${sortBy === 'name' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Nome
              </button>
            </div>
          </div>
        </div>

        {/* Categorias Filtros horizontais */}
        <div className="border-t border-slate-100 pt-3 flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar-h">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 shrink-0">Categoria:</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                logSecurityEvent?.(`PASTA_FILTRO: Categoria selecionada - ${cat.label}`, 'info');
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all cursor-pointer flex items-center gap-2 ${
                categoryFilter === cat.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {cat.label}
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${
                categoryFilter === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      {filteredDocs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-150 rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
            <Search size={28} />
          </div>
          <div>
            <h4 className="text-base font-black uppercase tracking-tight text-slate-800">Nenhum Documento Localizado</h4>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto mt-1 uppercase">
              Tente redefinir o seu termo de pesquisa ou a seleção de filtros e instituições acima.
            </p>
          </div>
          <button 
            onClick={() => {
              setSearch('');
              setCategoryFilter('todas');
              setInstFilter('todas');
            }}
            className="px-5 py-2.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800"
          >
            Limpar Filtros
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc, i) => {
              const theme = getCategoryTheme(doc.category);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4), ease: 'easeOut' }}
                  key={doc.id}
                  className="bg-white border border-slate-200/90 rounded-[28px] overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all border-l-4 group"
                  style={{ borderLeftColor: doc.category === 'civil' ? '#4f46e5' : doc.category === 'fiscal' ? '#059669' : doc.category === 'licencas' ? '#d97706' : doc.category === 'certificados' ? '#2563eb' : doc.category === 'contratos' ? '#db2777' : doc.category === 'correspondencias' ? '#475569' : '#e11d48' }}
                >
                  {/* Top Header Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider border shrink-0 ${theme.bg}`}>
                        {doc.categoryLabel}
                      </span>
                      {doc.isUrgent && (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md animate-pulse">
                          Alta Prioridade
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider border ${
                        doc.status === 'Ativo' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        doc.status === 'Em Apreciação' ? 'bg-orange-50 border-orange-100 text-orange-600 animate-pulse' :
                        doc.status === 'Arquivado' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                        'bg-red-50 border-red-100 text-red-600'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-slate-900 font-extrabold text-sm md:text-base leading-snug hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        {doc.issuer}
                      </p>
                    </div>

                    {/* Brief description */}
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-2">
                      {doc.description}
                    </p>

                    {/* Meta line */}
                    <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1"><Calendar size={12} /> Emitido em:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{doc.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1"><Building2 size={12} /> Entidade:</span>
                        <span className="text-slate-800 font-extrabold">{doc.institution}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1"><Tag size={12} /> Ref Cripto:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{doc.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => {
                        setSelectedDoc(doc);
                        logSecurityEvent?.(`LEITURA_DOC: Visualizou ${doc.name} na Pasta Permanente.`, 'info');
                      }}
                      className="text-[10px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye size={14} /> Detalhes
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleShareDoc(doc)}
                        title="Partilhar QR-Code Secção Segura"
                        className="p-1.5 bg-white border border-slate-200/80 hover:border-slate-350 rounded-lg text-slate-600 hover:text-indigo-650 shrink-0 select-none cursor-pointer"
                      >
                        <Share2 size={13} />
                      </button>
                      <button 
                        onClick={() => notifyDownload(doc)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Download size={12} /> Descarregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Slide-over Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[600]"
            />
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-[40px] shadow-3xl z-[601] overflow-hidden max-h-[85vh] flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="bg-slate-900 p-6 md:p-8 text-white relative flex justify-between items-start">
                <div className="space-y-2 max-w-[85%]">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                      {selectedDoc.id}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={11} /> Assinado
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight">{selectedDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Emitido por: {selectedDoc.issuer}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="bg-white/10 hover:bg-white/25 rounded-full p-2.5 text-white transition-colors cursor-pointer border-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição do Conteúdo</h5>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">
                    {selectedDoc.description}
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-slate-100 pt-5">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadados Criptográficos</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedDoc.meta).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 border border-slate-150/60 rounded-xl p-3">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">{key}</span>
                        <span className="text-[11px] text-slate-800 font-extrabold uppercase mt-1 block">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">Assinatura do Estado Validada</h6>
                      <p className="text-[10px] text-emerald-700 font-bold leading-normal uppercase mt-0.5">
                        Este documento foi assinado digitalmente com o certificado raiz nacional (CDA-REP-ANG) e possui autenticidade de validade administrativa permanente e inalterável de acordo com a lei 12/26.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 border border-slate-150 rounded-2xl p-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 tracking-wider mb-1.5">Código Único de Rastreio Hash (SHA-256)</span>
                      <span className="text-slate-800 font-mono font-black text-[10.5px] lowercase">{selectedDoc.code.repeat(3).slice(0, 36)}...</span>
                    </div>
                    <div className="logo shrink-0 text-center flex flex-col items-center gap-1 shrink-0 p-2 border bg-white border-slate-100 rounded-lg">
                      <div className="text-[8px] font-black">VALIDAR QR</div>
                      <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xs font-mono font-bold font-black text-xs">CDA</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => notifyDownload(selectedDoc)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-750 text-white py-3 md:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-650/15 border-0"
                >
                  <Download size={16} /> Descarregar Assinado
                </button>
                <button 
                  onClick={() => handleShareDoc(selectedDoc)}
                  className="bg-white border border-slate-205 text-slate-700 py-3 md:py-3.5 rounded-2xl px-5 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={16} /> Partilhar Acesso
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
