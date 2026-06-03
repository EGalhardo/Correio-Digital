/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, FormEvent } from 'react';
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
  X, 
  Eye, 
  ChevronRight, 
  Info, 
  Plus, 
  Sparkles,
  Lock,
  UploadCloud,
  Check,
  RefreshCw,
  QrCode,
  Globe,
  FileSignature
} from 'lucide-react';
import { Document, DocRequest, Correspondence } from '../../types';

export interface ActionableDoc {
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
  isOfficial: boolean; // true if govt-issued, false if uploaded/signed by user
  fileSizeKb: number;
}

const INITIAL_PERMANENT_DOCS: ActionableDoc[] = [
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
    isOfficial: true,
    fileSizeKb: 340,
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
    isOfficial: true,
    fileSizeKb: 450,
    meta: {
      'Cônjuge': 'Beatriz Mateus Galhardo',
      'Regime de Bens': 'Bens Adquiridos',
      'Número do Assento': '104/2024',
      'Livro de Registo': 'Folha 45, Livro B-12',
      'Data de Celebração': '15 de Maio de 2024'
    }
  },
  {
    id: 'CD-FIS-001',
    name: 'Certidão de Conformidade e Não Devedor',
    category: 'fiscal',
    categoryLabel: 'Historial Fiscal',
    date: '10/05/2026',
    institution: 'AGT',
    code: 'AGT-ND-2026-981',
    issuer: 'Administração Geral Tributária',
    status: 'Ativo',
    description: 'Comprova que o cidadão contribuinte possui a sua situação fiscal regularizada com o Estado angolano perante impostos diretos e aduaneiros.',
    holder: 'Edlasio Galhardo',
    isOfficial: true,
    fileSizeKb: 280,
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
    categoryLabel: 'Historial Fiscal',
    date: '02/03/2025',
    institution: 'AGT',
    code: 'AGT-IPU-5541-LU',
    issuer: 'Repartição de Finanças de Cacuaco',
    status: 'Arquivado',
    description: 'Relatório consolidado de auto-liquidação anual predial do imóvel registado na comarca tributária.',
    holder: 'Edlasio Galhardo',
    isOfficial: true,
    fileSizeKb: 512,
    meta: {
      'Inscrição Imobiliária': 'IPU-9921-A',
      'Valor liquidado': '45.000,00 AOA',
      'Exibição Documental': 'Quitado',
      'Exercício de Referência': 'Ano Fiscal 2024',
      'Data de Liquidação': '02 de Março de 2025'
    }
  },
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
    isOfficial: true,
    fileSizeKb: 130,
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
    isOfficial: true,
    fileSizeKb: 890,
    meta: {
      'Alvará Comercial': 'ALV-MIN-2026/882',
      'Atividade Autorizada': 'Serviços de Programação, Consultoria de TI',
      'Área Geográfica': 'Província de Luanda',
      'Validade de Alvará': '14 de Janeiro de 2031'
    }
  },
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
    isOfficial: true,
    fileSizeKb: 210,
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
    institution: 'Ministérios',
    code: 'UAN-ENG-2022-9921',
    issuer: 'Universidade Agostinho Neto - Faculdade de Engenharia',
    status: 'Ativo',
    description: 'Título académico de Licenciatura em Engenharia Informática com menção honrosa em Sistemas de Informação Distribuídos.',
    holder: 'Edlasio Galhardo',
    isOfficial: true,
    fileSizeKb: 1200,
    meta: {
      'Grau Académico': 'Engenheiro de Informática',
      'Média Final de Curso': '17 Valores',
      'Número de Diploma': 'UAN-L-998-2022',
      'Reitor Responsável': 'Prof. Dr. Pedro Magalhães'
    }
  },
  {
    id: 'CDA-88123',
    name: 'Ofício de Homologação: Passaporte de Serviço',
    category: 'correspondencias',
    categoryLabel: 'Correspondências',
    date: '01/06/2026',
    institution: 'SME',
    code: 'CDA-88123',
    issuer: 'SME - Posto Aduaneiro',
    status: 'Ativo',
    description: 'Ofício formalizando o parecer deferido para a emissão especial do passaporte de categoria de serviço pelo Serviço de Migração e Estrangeiros.',
    holder: 'Edlasio Galhardo',
    isOfficial: true,
    fileSizeKb: 145,
    meta: {
      'Código de Ofício': 'CDA-88123',
      'Assunto': 'Homologação de Emissão de Passaporte de Serviço',
      'Emissor': 'SME - Posto Aduaneiro',
      'Validade Jurídica': 'Irrevogável',
      'Procuradoria Tributária': 'SME-LEG-998A'
    }
  },
  {
    id: 'CDA-90118',
    name: 'Circular Fiscal: Isenção Sócio-Profissional',
    category: 'correspondencias',
    categoryLabel: 'Correspondências',
    date: '02/06/2026',
    institution: 'AGT',
    code: 'CDA-90118',
    issuer: 'Ministério das Finanças (MINFIN)',
    status: 'Ativo',
    description: 'Notificação geral de validação eletrónica de isenção tributária temporária sobre os rendimentos laborais em conformidade com a resolução fiscal n. 450 do MINFIN.',
    holder: 'Edlasio Galhardo',
    isOfficial: true,
    fileSizeKb: 190,
    meta: {
      'Código de Ofício': 'CDA-90118',
      'Assunto': 'Isenção Fiscal Sócio-Profissional',
      'Emissor': 'Ministério das Finanças (MINFIN)',
      'Apoio Legal': 'Resolução Fiscal n. 450',
      'Estado Fiscal': 'Confirmado e Ativo'
    }
  }
];

interface PastaDigitalContentProps {
  documents: Document[];
  docRequests: DocRequest[];
  onCreateRequest: (docType: string, institution: string) => void;
  setSelectedDoc: (doc: Document | null) => void;
  setTab: (tab: string) => void;
  logSecurityEvent?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
  emergencyMode?: boolean;
  correspondences?: Correspondence[];
}

export function PastaDigitalContent({ 
  documents, 
  docRequests, 
  onCreateRequest, 
  setSelectedDoc: setGlobalSelectedDoc, 
  setTab, 
  logSecurityEvent,
  emergencyMode = false,
  correspondences = []
}: PastaDigitalContentProps) {

  // Local document states
  const [permanentDocs, setPermanentDocs] = useState<ActionableDoc[]>(INITIAL_PERMANENT_DOCS);

  // UI state filters
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  
  // Track expanded cards for progressive disclosure inside Pasta Digital User view
  const [expandedDocIds, setExpandedDocIds] = useState<Record<string, boolean>>({});
  const toggleExpandDoc = (id: string) => {
    setExpandedDocIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Selected detail modal
  const [inspectedDoc, setInspectedDoc] = useState<ActionableDoc | null>(null);

  // QR Code temporary sharing state (15 minutes countdown)
  const [qrSharingCode, setQrSharingCode] = useState<string | null>(null);
  const [qrCountdown, setQrCountdown] = useState<number>(900); // 15 minutes * 60 seconds
  const [isVerifyingIntegrity, setIsVerifyingIntegrity] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<'none' | 'success' | 'checking'>('none');

  // Convert default custom state `documents` from App.tsx into equivalent ActionableDoc objects
  const systemOfficialDocs = useMemo<ActionableDoc[]>(() => {
    const defaultDocsMapped = documents.map(doc => {
      const nameLower = doc.name.toLowerCase();
      let category: ActionableDoc['category'] = 'certificados';
      let categoryLabel = 'Certificados';

      if (nameLower.includes('bi') || nameLower.includes('identidade') || nameLower.includes('civil')) {
        category = 'civil';
        categoryLabel = 'Documentos Civis';
      } else if (nameLower.includes('nif') || nameLower.includes('fiscal') || nameLower.includes('irt') || nameLower.includes('contribguinte')) {
        category = 'fiscal';
        categoryLabel = 'Historial Fiscal';
      } else if (nameLower.includes('carta') || nameLower.includes('conducao') || nameLower.includes('transporte') || nameLower.includes('livrete')) {
        category = 'licencas';
        categoryLabel = 'Licenças';
      } else if (nameLower.includes('residência') || nameLower.includes('certificado')) {
        category = 'certificados';
        categoryLabel = 'Certidões';
      }

      return {
        id: doc.code || `CD-DOC-${Math.floor(Math.random() * 10000)}`,
        name: doc.name,
        category,
        categoryLabel,
        date: doc.issuedAt || '12/03/2026',
        institution: doc.issuer || 'Estado de Angola',
        code: doc.code || 'CDA-GEN-001',
        issuer: doc.issuer || 'SME ou Conservatória',
        status: 'Ativo' as const,
        description: `Carta digital oficial emitida pelo Correio Digital de Angola e homologada via protocolo criptográfico do Estado.`,
        holder: doc.holder || 'Edlasio Galhardo',
        isOfficial: true,
        fileSizeKb: 310,
        meta: {
          'Titular': doc.holder,
          'Número de Chave': doc.code,
          'Validade Jurídica': doc.validity || 'Irrevogável',
          'Organismo de Origem': doc.issuer || 'Estado de Angola',
          'Código de Protocolo': doc.protocol?.protocolNumber || `PROT-${doc.code}-CDA`
        }
      };
    });

    const correspondencesMapped = (correspondences || [])
      .filter(c => c.recipient.toLowerCase().includes('edlasio') || c.recipient.toLowerCase() === 'edlasio galhardo')
      .map(c => {
        let category: ActionableDoc['category'] = 'correspondencias';
        let categoryLabel = 'Expedientes';

        if (c.institution === 'SME') {
          category = 'civil';
          categoryLabel = 'Registos SME';
        } else if (c.institution === 'AGT') {
          category = 'fiscal';
          categoryLabel = 'Registos AGT';
        }

        return {
          id: c.id,
          name: c.subject,
          category,
          categoryLabel,
          date: c.date,
          institution: c.sender,
          code: c.id,
          issuer: c.sender,
          status: 'Ativo' as const,
          description: c.body,
          holder: c.recipient,
          isOfficial: true,
          fileSizeKb: 180,
          meta: {
            'Titular': c.recipient,
            'Validade Jurídica': 'Homologado - Pleno Efeito Lei (CDA)',
            'Código de Ofício': c.id,
            'Emissor': c.sender,
            'Instituição Beneficiária': c.institution || 'N/A',
            'Província de Origem': c.originProvince,
            'Província de Destino': c.destinationProvince,
            'Estado do Expediente': c.status,
            'Assunto de Expediente': c.subject
          }
        };
      });

    const combined = [...defaultDocsMapped, ...correspondencesMapped];
    const seen = new Set<string>();
    return combined.filter(d => {
      const duplicate = seen.has(d.id);
      seen.add(d.id);
      return !duplicate;
    });
  }, [documents, correspondences]);

  // Merge everything into a cohesive, centralized directory of official records
  const unifiedDirectory = useMemo<ActionableDoc[]>(() => {
    // Show only government-issued digital documents and certified records
    let list: ActionableDoc[] = [...systemOfficialDocs, ...permanentDocs];

    // Filter by category
    if (catFilter !== 'todas') {
      list = list.filter(d => d.category === catFilter);
    }

    // Filter by search string
    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(lowerSearch) ||
        d.code.toLowerCase().includes(lowerSearch) ||
        d.institution.toLowerCase().includes(lowerSearch) ||
        d.description.toLowerCase().includes(lowerSearch) ||
        Object.values(d.meta).some(v => v.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Simple string comparison for dd/mm/yyyy dates
        const dateKeyA = a.date.split('/').reverse().join('-');
        const dateKeyB = b.date.split('/').reverse().join('-');
        return dateKeyB.localeCompare(dateKeyA);
      }
    });
  }, [systemOfficialDocs, permanentDocs, catFilter, search, sortBy]);



  // QR share expiry timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (qrSharingCode) {
      interval = setInterval(() => {
        setQrCountdown(prev => {
          if (prev <= 1) {
            setQrSharingCode(null);
            return 900;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrSharingCode]);

  const handleCreateQrCode = (code: string) => {
    if (emergencyMode) {
      alert("Acesso Bloqueado: Não é permitido gerar QR Code de partilha sob o Protocolo de Emergência Ciber-Defensiva SOC-AN-2026.");
      logSecurityEvent?.(`BLOQUEIO_SEGURANCA: Tentativa de gerar QR Code recusada para salvaguarda de soberania digital.`, 'critical');
      return;
    }
    setQrSharingCode(code);
    setQrCountdown(900); // Reset to 15 mins
    logSecurityEvent?.(`PARTILHA_QR_PASTA: QR-Code dinâmico de partilha temporário foi gerado com validade de 15 minutos.`, 'info');
  };

  const handleVerifyIntegrity = () => {
    setIsVerifyingIntegrity(true);
    setVerificationResult('checking');
    setTimeout(() => {
      if (emergencyMode) {
        alert("Erro de Validação: Chaves de autenticação do Estado estão cifradas e indisponíveis (SOC-AN-2026).");
        setVerificationResult('none');
        setIsVerifyingIntegrity(false);
        logSecurityEvent?.(`FALHA_CONECTIVIDADE: Chaves de matching sequestradas sob emergência de mitigação de intrusão.`, 'critical');
        return;
      }
      setVerificationResult('success');
      setIsVerifyingIntegrity(false);
      logSecurityEvent?.(`VERIFICACAO_SHA: Integridade do documento digital validada perante o log central do Estado.`, 'success');
    }, 1500);
  };



  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'civil': return 'border-l-indigo-600';
      case 'fiscal': return 'border-l-emerald-600';
      case 'licencas': return 'border-l-amber-600';
      case 'certificados': return 'border-l-blue-600';
      case 'contratos': return 'border-l-pink-600';
      case 'correspondencias': return 'border-l-slate-500';
      default: return 'border-l-rose-600';
    }
  };

  const notifyDownloadLocal = (doc: ActionableDoc) => {
    if (emergencyMode) {
      alert("Acesso Bloqueado: Download de PDF suspenso durante o Protocolo Ativo de Emergência SOC-AN-2026.");
      logSecurityEvent?.(`BLOQUEADO: Tentativa de descarga rejeitada preventivamente sob emergência para ${doc.name}.`, 'critical');
      return;
    }
    alert(`Descarregando cópia autenticada e verificada pelo CDA em formato PDF chancelado para o documento:\n${doc.name}\n\nEspaço consumido: ${doc.fileSizeKb} KB.`);
    logSecurityEvent?.(`DESCARGA_CERTIFICADA: Cópia autenticada de ${doc.name} transferida via PDF.`, 'success');
  };

  const formatTimeCounter = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP TITLE BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-red-600/10 shrink-0">
            <Folder size={26} />
          </div>
          <div>
            <span className="text-[9px] font-black tracking-[0.2em] text-red-600 uppercase">CORREIO DIGITAL DE ANGOLA</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
              Pasta Digital de Documentos
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Visualização Direta, Partilha e Solicitação de Certidões Autenticadas do Estado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 sm:self-start md:self-auto">
          <button 
            onClick={() => setTab('solicitar-documento')}
            className="px-4 py-2.5 bg-red-600 hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-red-600/10 cursor-pointer border-0"
          >
            <Plus size={14} /> Solicitar Documento
          </button>
          <span className="px-3.5 py-2.5 bg-slate-50 border border-slate-150 text-slate-700 text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center gap-1.5 shadow-xs">
            <ShieldCheck size={14} className="text-red-500 animate-pulse" /> Custódia Segura SME
          </span>
        </div>
      </div>

      {/* cyberemergency SOC-AN-2026 Alert Banner */}
      {emergencyMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border-2 border-red-500/25 p-5 rounded-[28px] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg shadow-red-500/5 animate-pulse"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0 mt-0.5">
              <Lock size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                  BLOQUEIO ATIVO SOC-AN-2026
                </span>
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase">&quot;Sovereignty Shield&quot; em Luanda</span>
              </div>
              <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight leading-none italic mt-1 font-sans">
                Acesso Biométrico e Portabilidade Identitária Suspensa
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed max-w-2xl mt-1">
                Por motivos de salvaguarda ciber-defensiva de soberania nacional, as chaves criptográficas de identificação de &quot;Edlasio Galhardo&quot; foram sequestradas preventivamente. Download, emissões, assinatura e partilhas externas estão suspensas até o restabelecimento do protocolo de segurança.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-red-200 text-red-800 text-[9px] font-black uppercase tracking-widest rounded-xl text-center md:self-center shrink-0">
            Nível 5: Crítico
          </span>
        </motion.div>
      )}

      {/* 2. MINIMAL STATE STATEMENT BANNER */}
      <div className="bg-slate-50 border border-slate-150 rounded-[28px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[8px] font-black uppercase tracking-widest rounded-full">Dossiê Ativo</span>
          <p className="text-xs text-slate-700 font-bold leading-relaxed max-w-2xl mt-1.5">
            A sua Pasta Digital Única reúne todos os registos oficiais chancelados pelas entidades emissoras (Conservatória, AGT e SME). Pode descarregar a cópia autenticada em PDF ou gerar acessos temporários partilhando via código QR.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-center">
            <p className="text-[8px] text-slate-400 font-black uppercase block">Registos</p>
            <p className="text-sm font-black text-slate-900">{unifiedDirectory.length} Activos</p>
          </div>
        </div>
      </div>

      {/* 3. SEARCH BAR & GLOBAL SELECT FILTERS */}
      <div className="bg-white border border-slate-150 rounded-[30px] p-4.5 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input 
            type="text"
            placeholder="Pesquise por nome do documento, instituição emissora ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-205 focus:border-red-500 rounded-2xl pl-12 pr-4 py-3 md:py-3.5 text-xs md:text-sm font-semibold text-slate-950 focus:bg-white transition-all outline-none placeholder:text-slate-450"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-305 text-slate-600 rounded-full p-1 border-0 cursor-pointer flex items-center justify-center"
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Categories Pills Filters */}
        <div className="flex items-center gap-1 flex-wrap overflow-x-auto select-none">
          {[
            { id: 'todas', label: 'Todos' },
            { id: 'civil', label: 'Civis' },
            { id: 'fiscal', label: 'Fiscal' },
            { id: 'licencas', label: 'Licenças' },
            { id: 'certificados', label: 'Certidões' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id)}
              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border cursor-pointer ${
                catFilter === cat.id 
                  ? 'bg-slate-955 text-white border-transparent bg-slate-950' 
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
          
          <div className="hidden md:block w-[1px] h-6 bg-slate-150 mx-1" />

          {/* Quick Sort Control */}
          <div className="flex border border-slate-150 rounded-xl p-0.5 bg-white items-center text-[10px] text-slate-400 font-extrabold pb-0.5">
            <button
              onClick={() => setSortBy('date')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] uppercase font-black tracking-wider transition-all cursor-pointer ${sortBy === 'date' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Data
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] uppercase font-black tracking-wider transition-all cursor-pointer ${sortBy === 'name' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Nome
            </button>
          </div>
        </div>
      </div>

      {/* 6. COHESIVE INTEGRATED GRID OF ALL ASSETS */}
      {unifiedDirectory.length === 0 ? (
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
              Não existem ficheiros correspondentes na sua Pasta Digital Única perante os filtros e pesquisas ativos.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setSearch('');
              setCatFilter('todas');
            }}
            className="px-5 py-2.5 bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 border-0 cursor-pointer"
          >
            Redefinir Filtros
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {unifiedDirectory.map((doc, idx) => {
              const borderLeft = getCategoryColor(doc.category);
              const isExpanded = expandedDocIds[doc.id];
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  key={doc.id}
                  onClick={() => toggleExpandDoc(doc.id)}
                  className={`bg-white border border-slate-150 rounded-[28px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all border-l-4 ${borderLeft} cursor-pointer group p-5 md:p-6 space-y-3.5 select-none`}
                >
                  <div className="space-y-3.5">
                    {/* Header line */}
                    <div className="flex justify-between items-center sm:gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {doc.categoryLabel}
                      </span>
                      {doc.isOfficial ? (
                        <span className="bg-red-50 border border-red-100 text-red-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Globe size={11} className="text-red-500" /> Ofício Gov
                        </span>
                      ) : (
                        <span className="bg-slate-50 border border-slate-100 text-slate-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <FileSignature size={11} className="text-slate-500" /> Particular
                        </span>
                      )}
                    </div>

                    {/* Meta names */}
                    <div>
                      <h4 className="text-slate-900 font-extrabold text-sm md:text-base group-hover:text-red-600 transition-colors uppercase italic tracking-tighter leading-snug">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
                          {doc.institution} • {doc.date}
                        </p>
                      </div>
                    </div>

                    {/* Simple Indicator Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandDoc(doc.id);
                      }}
                      className="text-[9.5px] font-black text-red-600 hover:text-red-800 uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors border-0 bg-transparent py-0 mt-2"
                    >
                      {isExpanded ? "← Ocultar detalhes" : "→ Ver detalhes adicionais"}
                    </button>

                    {/* Second Plane: Progressive Disclosure under Dynamic Expanding Animation */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="expanded"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                          onClick={(e) => e.stopPropagation()} // Prevent closing card when clicking inside detail section
                        >
                          <div className="pt-4 border-t border-slate-105 mt-3 space-y-4 text-left">
                            {/* Description */}
                            <p className="text-[11px] text-slate-655 font-medium leading-relaxed">
                              {doc.description}
                            </p>

                            {/* Metadata Table */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 tracking-wider block uppercase">Metadados Registados</span>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(doc.meta).slice(0, 4).map(([key, val]) => (
                                  <div key={key} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                                    <span className="block text-[9.5px] text-slate-800 font-black truncate mt-0.5" title={val}>{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Additional validation and refs */}
                            <div className="bg-red-50/30 border border-red-100/60 rounded-xl p-2.5 flex items-center justify-between text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                              <span className="font-mono text-red-600">Ref: {doc.code}</span>
                              <span className="text-red-700/80">{(doc.fileSizeKb / 1024).toFixed(2)} MB</span>
                            </div>

                            {/* Interactive Actions for the Document */}
                            <div className="flex items-center justify-between gap-1.5 pt-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectedDoc(doc);
                                  logSecurityEvent?.(`INSPECIONOU_ARQUIVO: Visualizou detalhes unificados de ${doc.name}`, 'info');
                                }}
                                className="text-[9px] font-black text-slate-700 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors border-0 bg-slate-100 hover:bg-slate-150 py-1.5 px-3 rounded-xl shadow-xs"
                              >
                                <Eye size={12} /> Inspecionar
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreateQrCode(doc.code);
                                  }}
                                  title="Partilhar acesso seguro"
                                  className="p-2 bg-slate-50 border border-slate-205 rounded-xl text-slate-500 hover:text-red-700 hover:bg-white transition-colors cursor-pointer shrink-0"
                                >
                                  <Share2 size={12} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notifyDownloadLocal(doc);
                                  }}
                                  title="Descarregar cópia original"
                                  className="p-2 bg-slate-50 border border-slate-205 rounded-xl text-slate-500 hover:text-red-700 hover:bg-white transition-colors cursor-pointer shrink-0"
                                >
                                  <Download size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* 7. DETAILED FILE AND CRYTOGRAPHY INSPECTION DRAWER MODAL */}
      <AnimatePresence>
        {inspectedDoc && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setInspectedDoc(null);
                setQrSharingCode(null);
                setVerificationResult('none');
              }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[600]"
            />
            {/* Modal Drawer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-[40px] shadow-3xl z-[601] overflow-hidden max-h-[85vh] flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="bg-slate-950 p-6 md:p-8 text-white relative">
                <div className="space-y-2 max-w-[85%] text-left">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[8px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                      {inspectedDoc.id}
                    </span>
                    <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest font-mono">
                      <ShieldCheck size={11} /> ASSINADO (ICP-AO)
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black uppercase italic tracking-tight">{inspectedDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Origem de Emissão: {inspectedDoc.issuer}
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    setInspectedDoc(null);
                    setQrSharingCode(null);
                    setVerificationResult('none');
                  }}
                  className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 rounded-full p-2.5 text-white transition-colors cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* 1. TARJA DE CONFORMIDADE JURÍDICA (MANDATORY REQUIREMENT) */}
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 flex items-start gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h6 className="text-[11px] font-black uppercase text-emerald-950 tracking-wider">
                      Este documento possui validade legal
                    </h6>
                    <p className="text-[9.5px] text-emerald-800 font-bold leading-relaxed uppercase mt-1">
                      Homologado sob a chancela oficial da República de Angola pela Lei de Assinatura Digital nº 12/26. Cópia fidedigna com o ledger nacional.
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-left">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo do Arquivo</h5>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {inspectedDoc.description}
                  </p>
                </div>

                {/* Deep Metadados de Assinatura */}
                <div className="space-y-3.5 border-t border-slate-100 pt-5 text-left">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visualização de Metadados de Assinatura</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(inspectedDoc.meta).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 border border-slate-150 rounded-xl p-3">
                        <span className="block text-[8px] font-black text-slate-450 uppercase tracking-wider">{key}</span>
                        <span className="text-[10px] text-slate-800 font-extrabold uppercase mt-1 block tracking-tight truncate" title={val}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure Dynamic Share QR code */}
                <div className="bg-slate-50 border border-slate-150 rounded-3xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-left">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                        <QrCode size={13} className="text-indigo-600" /> Partilha Temporária Segura
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-bold uppercase mt-1 leading-snug">
                        Gere um código QR encriptado expiráve para leitura livre por autoridades ou balcões físicos do Estado.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCreateQrCode(inspectedDoc.code)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors border-0"
                    >
                      Gerar QR Temporário
                    </button>
                  </div>

                  {qrSharingCode && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border border-indigo-150 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3.5"
                    >
                      <div className="flex items-center gap-1.5 bg-indigo-55 px-3 py-1 text-[9px] font-black text-indigo-700 rounded-lg uppercase tracking-widest">
                        <RefreshCw size={11} className="animate-spin text-indigo-500" />
                        Código expira em: {formatTimeCounter(qrCountdown)}
                      </div>
                      
                      {/* Placeholder vector logo QR */}
                      <div className="w-32 h-32 bg-slate-950 text-white font-mono rounded-xl p-3 flex flex-col justify-between select-none">
                        <div className="flex justify-between items-center text-[8px] font-black">
                          <span>[CDA TOKEN]</span>
                          <span>{inspectedDoc.code.slice(0, 6)}</span>
                        </div>
                        <div className="text-center font-black text-xl tracking-widest italic antialiased hover:scale-105 transition-transform">
                          ANGOLA
                        </div>
                        <div className="text-[8px] text-center opacity-40">15-MIN CRIPTO EXPIRÁVEL</div>
                      </div>

                      <p className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider font-mono">
                        Hash SHA: {inspectedDoc.code}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Verify Integrity SHA button section */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Consistência de Hash Digital</h5>
                      <span className="text-[9.5px] text-slate-650 font-black uppercase tracking-wider font-mono lowercase block mt-0.5">
                        SHA-256: {inspectedDoc.code}
                      </span>
                    </div>

                    <button
                      onClick={handleVerifyIntegrity}
                      disabled={isVerifyingIntegrity}
                      className={`px-4 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all cursor-pointer border flex items-center gap-1.5 ${
                        verificationResult === 'success' 
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                          : 'bg-white border-slate-205 text-slate-750 hover:bg-slate-50'
                      }`}
                    >
                      {isVerifyingIntegrity ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                      Verificar Integridade SHA-256
                    </button>
                  </div>

                  {verificationResult === 'checking' && (
                    <div className="text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest animate-pulse py-2">
                      Consultando Ledger Governamental (CDA-Chain)...
                    </div>
                  )}

                  {verificationResult === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-emerald-50/70 border border-emerald-150 rounded-xl text-[9.5px] text-emerald-800 font-extrabold uppercase text-left"
                    >
                      ✓ Checksum do ficheiro coincide 100% com o registado no Livro de Registos CDA-Ledger. Nenhuma alteração foi efetuada desde a chancela inicial!
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => notifyDownloadLocal(inspectedDoc)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-750 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 border-0"
                >
                  <Download size={14} /> Descarregar Assinado (PDF)
                </button>
                <button 
                  onClick={() => {
                    handleCreateQrCode(inspectedDoc.code);
                    alert("Acesso encriptado temporário de 15 minutos exposto para balcões!");
                  }}
                  className="bg-white border border-slate-205 text-slate-700 py-3.5 rounded-2xl px-5 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 size={14} /> Partilhar Acesso
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
