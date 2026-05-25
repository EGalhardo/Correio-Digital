import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Mail,
  FileText,
  Send,
  Clock,
  ArrowRight,
  RefreshCcw,
  X,
  Activity,
  Database,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  MapPin,
  User,
  Shield,
  Scan,
  Fingerprint,
  Lock,
  ShieldAlert,
  UserCheck,
  Plus,
  FolderArchive,
  Ban,
  Share2,
  Search,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label as RechartsLabel,
} from "recharts";

import { Document, AppMode, UserRequest } from "../../types";

interface Institution {
  name: string;
  status: "online" | "manutenção" | "offline";
  delay: string;
  baseDelay: number;
}

interface ProvinceData {
  name: string;
  count: number;
  id: string;
}

interface GovDashboardProps {
  onNavigate?: (tabId: string) => void;
  documents?: Document[];
  emergencyMode?: boolean;
  userRequests?: UserRequest[];
  isMobile?: boolean;
  logSecurityEvent?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
  bi?: string;
  setBi?: (val: string) => void;
  profileName?: string;
  setProfileName?: (val: string) => void;
  userBirthDate?: string;
  setUserBirthDate?: (val: string) => void;
  userFiliation?: string;
  setUserFiliation?: (val: string) => void;
  userMaritalStatus?: string;
  setUserMaritalStatus?: (val: string) => void;
  addAuditLog?: (action: string, type?: 'info' | 'warning' | 'critical' | 'success') => void;
}

export interface QueueItem {
  id: string;
  citizenName: string;
  biNumber: string;
  documentType: string;
  institution: string;
  date: string;
  status: 'Pendente' | 'Assinado' | 'Aprovado' | 'Rejeitado' | 'Encaminhado' | 'Arquivado' | 'Expirado';
  priority: 'normal' | 'urgente' | 'critica' | 'expirada';
  description: string;
}

const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: "OP-PEN-101",
    citizenName: "Domingos Kassanga",
    biNumber: "00987123LA098",
    documentType: "Certificado de Residência",
    institution: "Administração Geral Tributária",
    date: "23/05/2026",
    status: "Pendente",
    priority: "normal",
    description: "Solicitação pendente de validação de morada fiscal para isenção de IPU residência primária."
  },
  {
    id: "OP-PEN-102",
    citizenName: "Amélia Chinguto",
    biNumber: "00456789BO011",
    documentType: "Alvará Comercial Simplificado",
    institution: "Ministério do Comércio",
    date: "22/05/2026",
    status: "Pendente",
    priority: "normal",
    description: "Alvará para micro-empresa de distribuição de hortícolas no mercado integrado do Lobito."
  },
  {
    id: "OP-URG-201",
    citizenName: "Manuel Diogo",
    biNumber: "00224411HU045",
    documentType: "Emissão Especial de Passaporte",
    institution: "SME",
    date: "23/05/2026",
    status: "Pendente",
    priority: "urgente",
    description: "Urgência por motivo de evacuação médica internacional urgente. Validação imediata solicitada."
  },
  {
    id: "OP-URG-202",
    citizenName: "Filomena de Sousa",
    biNumber: "00778811LA022",
    documentType: "Declaração de Isenção IRT",
    institution: "MINFIN",
    date: "23/05/2026",
    status: "Pendente",
    priority: "urgente",
    description: "Revisão tributária prioritária para portadores de incapacidade severa em trâmite ministerial."
  },
  {
    id: "OP-CRI-301",
    citizenName: "Desconhecido (#SpoofTentative)",
    biNumber: "00000000LA000",
    documentType: "Alerta de Liveness Detetado",
    institution: "SME Core Neural",
    date: "23/05/2026",
    status: "Pendente",
    priority: "critica",
    description: "Aviso crítico! Múltiplas falhas consecutivas de validação biométrica facial com vetor facial estático suspeito."
  },
  {
    id: "OP-CRI-302",
    citizenName: "Sebastião Gouveia",
    biNumber: "00889922BE056",
    documentType: "Substituição de Certificado Digital Raiz",
    institution: "Registo Civil",
    date: "22/05/2026",
    status: "Pendente",
    priority: "critica",
    description: "Conflito de par de chaves públicas no assento de óbito lavrado por conservador não autorizado."
  },
  {
    id: "OP-EXP-401",
    citizenName: "Isabel Valente",
    biNumber: "00115599LN004",
    documentType: "Licença Temporária de Condução",
    institution: "Polícia Nacional",
    date: "14/03/2026",
    status: "Expirado",
    priority: "expirada",
    description: "Licença provisória emitida pré-renovação da carta física. Vencida em março sem prorrogação registrada."
  },
  {
    id: "OP-EXP-402",
    citizenName: "Mateus Pedro",
    biNumber: "00334466LA011",
    documentType: "Certidão de Não Devedor",
    institution: "AGT",
    date: "10/04/2026",
    status: "Expirado",
    priority: "expirada",
    description: "Certidão de conformidade aduaneira para desembaraço expirada após prazo regulamentar de 180 dias."
  }
];

export type GovRole = 'supervisor' | 'operador' | 'auditor' | 'administrador';

export interface PermMatrix {
  create: boolean;
  sign: boolean;
  approve: boolean;
  reject: boolean;
  forward: boolean;
  archive: boolean;
}

const ROLE_PERMISSIONS: Record<GovRole, { label: string; desc: string; perms: PermMatrix }> = {
  operador: {
    label: "Operador",
    desc: "Suporta criação inicial de processos e encaminhamento setorial governamental.",
    perms: { create: true, sign: false, approve: false, reject: false, forward: true, archive: false }
  },
  supervisor: {
    label: "Supervisor",
    desc: "Despacha decisões, aplica assinaturas criptográficas oficiais e julga aprovações.",
    perms: { create: false, sign: true, approve: true, reject: true, forward: true, archive: false }
  },
  auditor: {
    label: "Auditor",
    desc: "Acompanha a legalidade, emite perícias, audita ocorrências e arquiva expedientes.",
    perms: { create: false, sign: false, approve: false, reject: false, forward: false, archive: true }
  },
  administrador: {
    label: "Administrador",
    desc: "Gestor principal. Detém autorização integral regulamentar do Estado.",
    perms: { create: true, sign: true, approve: true, reject: true, forward: true, archive: true }
  }
};

export function GovDashboard({
  onNavigate,
  documents = [],
  emergencyMode = false,
  appMode = "admin",
  userRequests = [],
  isMobile = false,
  logSecurityEvent,
  bi = '009874562LA041',
  setBi,
  profileName = 'Edlasio Galhardo',
  setProfileName,
  userBirthDate = '12/03/1995',
  setUserBirthDate,
  userFiliation = 'António Galhardo & Maria Conceição',
  setUserFiliation,
  userMaritalStatus = 'Solteiro',
  setUserMaritalStatus,
  addAuditLog,
}: GovDashboardProps & { appMode?: AppMode }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [matchingThreshold, setMatchingThreshold] = useState(85);
  const [antiSpoofingEnforced, setAntiSpoofingEnforced] = useState(true);

  // Operational State Hooks
  const [activeRole, setActiveRole] = useState<GovRole>('administrador');
  const [activeQueue, setActiveQueue] = useState<'pendentes' | 'urgentes' | 'criticas' | 'expiradas'>('pendentes');
  const [queueSearch, setQueueSearch] = useState('');
  const [queueItems, setQueueItems] = useState<QueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [selectedQueueItemId, setSelectedQueueItemId] = useState<string>("OP-PEN-101");
  const [rejectionReason, setRejectionReason] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New item form states
  const [newCitizenName, setNewCitizenName] = useState('');
  const [newBiNumber, setNewBiNumber] = useState('');
  const [newDocType, setNewDocType] = useState('Certificado de Residência');
  const [newQueue, setNewQueue] = useState<'pendentes' | 'urgentes' | 'criticas' | 'expiradas'>('pendentes');
  const [newDescription, setNewDescription] = useState('');

  // Anti-fraud citizen panel state
  const [searchBiQuery, setSearchBiQuery] = useState('');
  const [searchedCitizen, setSearchedCitizen] = useState<{
    name: string;
    bi: string;
    birthDate: string;
    filiation: string;
    maritalStatus: string;
  } | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Forms for updating
  const [tempProfileName, setTempProfileName] = useState('');
  const [tempBiField, setTempBiField] = useState('');
  const [tempBirthField, setTempBirthField] = useState('');
  const [tempMaritalField, setTempMaritalField] = useState('');
  const [tempFiliationField, setTempFiliationField] = useState('');

  // Seal receipt
  const [lastUpdatedProtocol, setLastUpdatedProtocol] = useState<{
    protocolCode: string;
    time: string;
  } | null>(null);

  const handleQueryCitizen = () => {
    setSearchAttempted(true);
    if (searchBiQuery.trim() === bi) {
      const citizen = {
        name: profileName,
        bi: bi,
        birthDate: userBirthDate,
        filiation: userFiliation,
        maritalStatus: userMaritalStatus
      };
      setSearchedCitizen(citizen);
      setTempProfileName(citizen.name);
      setTempBiField(citizen.bi);
      setTempBirthField(citizen.birthDate);
      setTempMaritalField(citizen.maritalStatus);
      setTempFiliationField(citizen.filiation);
    } else {
      setSearchedCitizen(null);
    }
  };

  const handleUpdateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedCitizen || !setProfileName || !setBi || !setUserBirthDate || !setUserFiliation || !setUserMaritalStatus || !addAuditLog) return;

    setProfileName(tempProfileName);
    setBi(tempBiField);
    setUserBirthDate(tempBirthField);
    setUserFiliation(tempFiliationField);
    setUserMaritalStatus(tempMaritalField);

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const protocolCode = `REG-UP-${randomCode}`;
    const timestampStr = new Date().toLocaleString('pt-AO');

    const logActionText = `[Selo: ${protocolCode}] Atualização de dados cadastrais autorizada e homologada pelo Operador #CDA-401 para o BI ${tempBiField} (Campos Alterados). Assinatura Eletrónica do Emissor válida.`;
    addAuditLog(logActionText, 'success');

    setLastUpdatedProtocol({
      protocolCode,
      time: timestampStr
    });

    setSearchedCitizen({
      name: tempProfileName,
      bi: tempBiField,
      birthDate: tempBirthField,
      filiation: tempFiliationField,
      maritalStatus: tempMaritalField
    });
  };

  const mapPins = useMemo(
    () => [
      { id: "cabinda", name: "Cabinda", top: "5%", left: "21%", count: 86732 },
      { id: "zaire", name: "Zaire", top: "18%", left: "30%", count: 42150 },
      { id: "uige", name: "Uíge", top: "22%", left: "45%", count: 78940 },
      { id: "bengo", name: "Bengo", top: "31%", left: "27%", count: 35420 },
      { id: "luanda", name: "Luanda", top: "33%", left: "21%", count: 412540 },
      { id: "cuanza-norte", name: "Cuanza Norte", top: "31%", left: "38%", count: 52130 },
      { id: "cuanza-sul", name: "Cuanza Sul", top: "45%", left: "33%", count: 89450 },
      { id: "malanje", name: "Malanje", top: "33%", left: "51%", count: 71200 },
      { id: "lunda-norte", name: "Lunda Norte", top: "24%", left: "68%", count: 65410 },
      { id: "lunda-sul", name: "Lunda Sul", top: "38%", left: "74%", count: 58920 },
      { id: "moxico", name: "Moxico", top: "55%", left: "75%", count: 83240 },
      { id: "bie", name: "Bié", top: "53%", left: "52%", count: 76430 },
      { id: "huambo", name: "Huambo", top: "54%", left: "41%", count: 114530 },
      { id: "benguela", name: "Benguela", top: "56%", left: "25%", count: 125430 },
      { id: "huila", name: "Huíla", top: "72%", left: "33%", count: 98234 },
      { id: "namibe", name: "Namibe", top: "74%", left: "18%", count: 62540 },
      { id: "cunene", name: "Cunene", top: "85%", left: "34%", count: 49750 },
      { id: "cuando-cubango", name: "Cuando Cubango", top: "76%", left: "59%", count: 51240 },
    ],
    [],
  );

  // BI Data
  const categoryData = useMemo(
    () => [
      { name: "SME", value: 12, color: "#3b82f6" },
      { name: "AGT", value: 15, color: "#dc2626" },
      { name: "ENDE", value: 8, color: "#f59e0b" },
      { name: "EPAL", value: 7, color: "#06b6d4" },
      { name: "Tribunal", value: 10, color: "#8b5cf6" },
      { name: "Hospital", value: 9, color: "#10b981" },
      { name: "Ministerios", value: 11, color: "#0f172a" },
      { name: "Polícia Nacional", value: 6, color: "#1d4ed8" },
      { name: "Notário", value: 5, color: "#ec4899" },
      { name: "Registo Civil", value: 6, color: "#14b8a6" },
      { name: "Seguro Social", value: 6, color: "#f97316" },
      { name: "Administradoras", value: 5, color: "#64748b" },
    ],
    [],
  );

  const provinceData = useMemo<ProvinceData[]>(
    () => [
      { id: "luanda", name: "Luanda", count: 412540 },
      { id: "benguela", name: "Benguela", count: 125430 },
      { id: "huambo", name: "Huambo", count: 114530 },
      { id: "huila", name: "Huíla", count: 98234 },
      { id: "cuanza-sul", name: "Cuanza Sul", count: 89450 },
      { id: "cabinda", name: "Cabinda", count: 86732 },
      { id: "moxico", name: "Moxico", count: 83240 },
      { id: "uige", name: "Uíge", count: 78940 },
      { id: "bie", name: "Bié", count: 76430 },
      { id: "malanje", name: "Malanje", count: 71200 },
      { id: "lunda-norte", name: "Lunda Norte", count: 65410 },
      { id: "namibe", name: "Namibe", count: 62540 },
      { id: "lunda-sul", name: "Lunda Sul", count: 58920 },
      { id: "cuanza-norte", name: "Cuanza Norte", count: 52130 },
      { id: "cuando-cubango", name: "Cuando Cubango", count: 51240 },
      { id: "cunene", name: "Cunene", count: 49750 },
      { id: "zaire", name: "Zaire", count: 42150 },
      { id: "bengo", name: "Bengo", count: 35420 },
    ],
    [],
  );

  // KPI Data
  const kpis = useMemo(
    () => [
      {
        label: "Correspondências Enviadas",
        value: "1.248.752",
        change: "+12,5% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
      {
        label: "Correspondências Entregues",
        value: "932.540",
        change: "+9,8% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
      {
        label: "Pendentes",
        value: "316.212",
        change: "-5,3% vs mês anterior",
        up: false,
        color: "text-red-500",
      },
      {
        label: "Taxa de Sucesso",
        value: "92,4%",
        change: "+7,6% vs mês anterior",
        up: true,
        color: "text-emerald-500",
      },
    ],
    [],
  );

  const activities = useMemo(
    () => [
      {
        id: 1,
        action: "Correspondência Fiscal enviada",
        time: "20/05/2025 10:42",
        org: "AGT",
        status: "success",
      },
      {
        id: 2,
        action: "Notificação de Educação entregue",
        time: "20/05/2025 10:35",
        org: "MED",
        status: "success",
      },
      {
        id: 3,
        action: "BI Digital emitido",
        time: "20/05/2025 10:28",
        org: "SME",
        status: "success",
      },
      {
        id: 4,
        action: "Validação por QR Code realizada",
        time: "20/05/2025 10:15",
        org: "Gov",
        status: "success",
      },
      {
        id: 5,
        action: "Correspondência de Justiça entregue",
        time: "20/05/2025 10:05",
        org: "MINJUS",
        status: "success",
      },
    ],
    [],
  );

  const [institutions] = useState<Institution[]>([
    { name: "SME", status: "online", delay: "12ms", baseDelay: 12 },
    { name: "AGT", status: "online", delay: "24ms", baseDelay: 24 },
    { name: "ENDE", status: "online", delay: "18ms", baseDelay: 18 },
    { name: "EPAL", status: "online", delay: "15ms", baseDelay: 15 },
  ]);

  const chartData = useMemo(
    () => [
      { time: "08:00", reqs: 400 },
      { time: "10:00", reqs: 600 },
      { time: "12:00", reqs: 800 },
      { time: "14:00", reqs: 700 },
      { time: "16:00", reqs: 900 },
      { time: "18:00", reqs: 1200 },
      { time: "20:00", reqs: 500 },
    ],
    [],
  );

  const handleRoleChange = (role: GovRole) => {
    setActiveRole(role);
    logSecurityEvent?.(`OPERACIONAL: Alterado perfil activo para ${ROLE_PERMISSIONS[role].label}`, 'info');
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizenName || !newBiNumber || !newDescription) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newItem: QueueItem = {
      id: `OP-${newQueue.toUpperCase().slice(0, 3)}-${100 + queueItems.length + 1}`,
      citizenName: newCitizenName,
      biNumber: newBiNumber,
      documentType: newDocType,
      institution: "Administração Central",
      date: new Date().toLocaleDateString('pt-PT'),
      status: 'Pendente',
      priority: newQueue === 'pendentes' ? 'normal' : newQueue === 'urgentes' ? 'urgente' : newQueue === 'criticas' ? 'critica' : 'expirada',
      description: newDescription
    };

    setQueueItems(prev => [newItem, ...prev]);
    setSelectedQueueItemId(newItem.id);
    setIsCreateModalOpen(false);
    
    // Reset fields
    setNewCitizenName('');
    setNewBiNumber('');
    setNewDescription('');

    logSecurityEvent?.(`OPERACIONAL: Criado novo expediente ${newItem.id} (${newItem.documentType}) para ${newItem.citizenName}`, 'success');
  };

  const updateItemStatus = (id: string, newStatus: QueueItem['status'], reason?: string, targetDept?: string) => {
    setQueueItems(prev => prev.map(item => {
      if (item.id === id) {
        let updatedInstitution = item.institution;
        if (targetDept) {
          updatedInstitution = targetDept;
        }
        return {
          ...item,
          status: newStatus,
          description: reason ? `${item.description} (Motivo: ${reason})` : item.description,
          institution: updatedInstitution
        };
      }
      return item;
    }));
  };

  const handleActionSign = (item: QueueItem) => {
    updateItemStatus(item.id, 'Assinado');
    logSecurityEvent?.(`OPERACIONAL: Assinado digitalmente o expediente ${item.id} (${item.documentType}) de ${item.citizenName}`, 'success');
  };

  const handleActionApprove = (item: QueueItem) => {
    updateItemStatus(item.id, 'Aprovado');
    logSecurityEvent?.(`OPERACIONAL: Aprovado o expediente ${item.id} (${item.documentType}) de ${item.citizenName}`, 'success');
  };

  const handleActionReject = (item: QueueItem) => {
    if (!rejectionReason) {
      alert("Por favor, indique um motivo para a rejeição.");
      return;
    }
    updateItemStatus(item.id, 'Rejeitado', rejectionReason);
    logSecurityEvent?.(`OPERACIONAL: Rejeitado o expediente ${item.id} (${item.documentType}) de ${item.citizenName}. Motivo: ${rejectionReason}`, 'warning');
    setRejectionReason('');
  };

  const handleActionForward = (item: QueueItem, target: string) => {
    updateItemStatus(item.id, 'Encaminhado', undefined, target);
    logSecurityEvent?.(`OPERACIONAL: Encaminhado o expediente ${item.id} (${item.documentType}) para ${target}`, 'info');
  };

  const handleActionArchive = (item: QueueItem) => {
    updateItemStatus(item.id, 'Arquivado');
    logSecurityEvent?.(`OPERACIONAL: Arquivado o expediente ${item.id} (${item.documentType}) no registo permanente`, 'info');
  };

  const filteredQueueItems = useMemo(() => {
    return queueItems.filter(item => {
      // Filter by current active queue tab
      const matchesQueue = 
        (activeQueue === 'pendentes' && item.priority === 'normal') ||
        (activeQueue === 'urgentes' && item.priority === 'urgente') ||
        (activeQueue === 'criticas' && item.priority === 'critica') ||
        (activeQueue === 'expiradas' && item.priority === 'expirada');
      
      const matchesSearch = 
        item.citizenName.toLowerCase().includes(queueSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(queueSearch.toLowerCase()) ||
        item.documentType.toLowerCase().includes(queueSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(queueSearch.toLowerCase());

      return matchesQueue && matchesSearch;
    });
  }, [queueItems, activeQueue, queueSearch]);

  const selectedQueueItem = useMemo(() => {
    return queueItems.find(item => item.id === selectedQueueItemId) || filteredQueueItems[0] || null;
  }, [queueItems, selectedQueueItemId, filteredQueueItems]);

  const queueCounts = useMemo(() => {
    return {
      pendentes: queueItems.filter(i => i.priority === 'normal').length,
      urgentes: queueItems.filter(i => i.priority === 'urgente').length,
      criticas: queueItems.filter(i => i.priority === 'critica').length,
      expiradas: queueItems.filter(i => i.priority === 'expirada').length,
    };
  }, [queueItems]);

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div
      id="gov-dashboard-wrapper"
      className="min-h-screen bg-slate-50 text-slate-600 p-4 md:p-8 font-sans"
    >
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        {/* Top Header Section */}
        <header
          id="gov-header"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-100"
        >
          <div>
            <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">
              Painel Nacional de Correspondência
            </h1>
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Correio Digital Angola &bull; Administração Central
            </p>
          </div>
          
          {/* Symmetrical central monitoring badge */}
          <div className="flex items-center gap-2 bg-slate-100/50 border border-slate-200/50 px-3.5 py-1.5 rounded-full shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">
              Monitoramento Ativo
            </span>
          </div>
        </header>

        {/* Resumo Geral - KPI panel */}
        <section
          id="resumo-geral-section"
          className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                Resumo Geral
              </h2>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Consolidado de Emissão e Fluxo de Correspondências no Território
              Nacional
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* KPI 1: Enviadas */}
            <div
              id="kpi-enviadas"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[0].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[0].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <TrendingUp size={12} /> {kpis[0].change}
              </div>
            </div>

            {/* KPI 2: Entregues */}
            <div
              id="kpi-entregues"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[1].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[1].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <TrendingUp size={12} /> {kpis[1].change}
              </div>
            </div>

            {/* KPI 3: Pendentes */}
            <div
              id="kpi-pendentes"
              className="space-y-2 lg:border-r border-slate-50 pr-4"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                {kpis[2].label}
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                {kpis[2].value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 w-fit px-2.5 py-1 rounded-lg border border-red-100/50 flex items-center gap-1.5">
                <TrendingDown size={12} /> {kpis[2].change}
              </div>
            </div>

            {/* KPI 4: Taxa de Sucesso (with animated gauge) */}
            <div
              id="kpi-taxas"
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                  {kpis[3].label}
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">
                  {kpis[3].value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <TrendingUp size={12} /> {kpis[3].change}
                </div>
              </div>

              <div className="w-12 h-12 relative shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="stroke-emerald-500 fill-none"
                    strokeWidth="4"
                    strokeDasharray="131.9"
                    strokeDashoffset="10.0"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facial Security Integration Section */}
        <section
          id="gov-facials-integration-section"
          className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                  Módulo de Segurança Facial & Biometria
                </h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  Sincronizado com o Core Neural de Identidade Nacional
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              <Fingerprint size={12} className="animate-pulse" />
              BIOMETRIA ATIVA
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Core Metrics Cards */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block mb-2">Métricas Ativas do Servidor</span>
              
              {/* Stat 1 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Modelos Registrados</span>
                  <span className="text-xl font-black text-slate-950 font-mono mt-1 block">15.240 faces</span>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Scan size={18} />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Acurácia de Matching</span>
                  <span className="text-xl font-black text-indigo-650 font-mono mt-1 block">98.67%</span>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShieldCheck size={18} />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fraudes de Spoofing Evitadas</span>
                  <span className="text-xl font-black text-red-600 font-mono mt-1 block">48 tentativas</span>
                </div>
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <ShieldAlert size={18} />
                </div>
              </div>
            </div>

            {/* Column 2: Live Feed list */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">Histórico de Validações Recentes</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {/* Attempt 1 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Edlasio Galhardo</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Cidadão</span>
                      <span>&bull;</span>
                      <span>Hoje, 20:15</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">98.8% match</span>
                  </div>
                </div>

                {/* Attempt 2 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Afonso Henriques</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Instituição (MINFIN)</span>
                      <span>&bull;</span>
                      <span>Hoje, 18:42</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">99.4% match</span>
                  </div>
                </div>

                {/* Attempt 3 */}
                <div className="p-3 bg-red-50/40 hover:bg-red-50/60 border border-red-100/70 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-red-950 truncate block">Desconhecido (#9381)</span>
                    <span className="text-[9px] font-mono text-red-500 flex items-center gap-1 mt-0.5">
                      <span>Tentativa inválida</span>
                      <span>&bull;</span>
                      <span>Hoje, 15:30</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-red-600 uppercase font-black tracking-wider block">BLOQUEADO</span>
                    <span className="text-[9px] font-mono text-red-500 font-bold">Liveness Falhou</span>
                  </div>
                </div>

                {/* Attempt 4 */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all flex items-center justify-between group">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">Cláudia Simões</span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Cidadão</span>
                      <span>&bull;</span>
                      <span>Hoje, 10:24</span>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider block">CONFIRMADO</span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">96.5% match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Slider details & Liveness switch representation */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block mb-2">Controlo Integrado do Painel</span>
              
              <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Lock size={120} />
                </div>
                
                {/* Liveness active state */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block font-mono">Anti-Spoofing</span>
                    <span className="text-xs font-bold mt-1 block">Liveness Ativo</span>
                  </div>
                  <button
                    onClick={() => setAntiSpoofingEnforced(!antiSpoofingEnforced)}
                    className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                      antiSpoofingEnforced ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${antiSpoofingEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* matching rate slider view */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-indigo-400 mb-1.5 font-mono">
                    <span>Mínimo de Confiança</span>
                    <span className="text-white font-black">{matchingThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="75" 
                    max="99" 
                    value={matchingThreshold} 
                    onChange={(e) => setMatchingThreshold(+e.target.value)}
                    className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="pt-1.5 flex items-center gap-1.5 text-[8.5px] font-mono text-slate-450 tracking-wider">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  SISTEMA TOTALMENTE ENCRIPTADO
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gestão Operacional & Filas de Trabalho (User requested operational dashboard) */}
        <section
          id="gov-operativo-section"
          className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6"
        >
          {/* Header Card inside section */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-650 rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                  Gestão Operacional & Fluxo de Expedientes
                </h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  Selecione o perfil de operação governamental para executar ações de validação
                </span>
              </div>
            </div>

            {/* Profile selectors */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full xl:w-auto">
              {(Object.keys(ROLE_PERMISSIONS) as GovRole[]).map((roleKey) => {
                const roleDef = ROLE_PERMISSIONS[roleKey];
                const isActive = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => handleRoleChange(roleKey)}
                    className={`flex-1 xl:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      isActive 
                        ? "bg-slate-900 text-white shadow-sm font-black" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-205"
                    }`}
                  >
                    {roleDef.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 md:gap-8">
            {/* Left Column: Role Details & Permissions Matrix */}
            <div className="space-y-5 bg-slate-50/70 border border-slate-150/70 rounded-[24px] p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">Perfil Ativo</span>
                  <h4 className="text-base font-black text-slate-950 uppercase tracking-tight italic flex items-center gap-2">
                    <UserCheck size={18} className="text-red-600" />
                    {ROLE_PERMISSIONS[activeRole].label}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-bold uppercase">
                    {ROLE_PERMISSIONS[activeRole].desc}
                  </p>
                </div>

                <div className="border-t border-slate-200/60 pt-4 space-y-3.5">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">Matriz de Permissões Regulatórias</span>
                  
                  <div className="space-y-2.5">
                    {[
                      { key: 'create', label: 'Criar Documento', desc: 'Emissão e autuação de novos expedientes' },
                      { key: 'sign', label: 'Assinar Digitalmente', desc: 'Aposição de chaves e carimbos PKI' },
                      { key: 'approve', label: 'Aprovar Pedido', desc: 'Despacho deferido com validade' },
                      { key: 'reject', label: 'Rejeitar Pedido', desc: 'Indeferimento com justificativa' },
                      { key: 'forward', label: 'Encaminhar Órgão', desc: 'Trâmite inter-operacional setorial' },
                      { key: 'archive', label: 'Arquivar Termo', desc: 'Depósito e guarda de processo' },
                    ].map((perm) => {
                      const hasPerm = ROLE_PERMISSIONS[activeRole].perms[perm.key as keyof PermMatrix];
                      return (
                        <div key={perm.key} className="flex items-start gap-2.5">
                          <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border text-[9px] font-black ${
                            hasPerm 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                              : "bg-red-50/50 border-red-100/50 text-red-500 opacity-60"
                          }`}>
                            {hasPerm ? "✓" : "✗"}
                          </span>
                          <div>
                            <span className={`block text-[11px] font-black uppercase tracking-tight leading-none ${hasPerm ? "text-slate-800" : "text-slate-400 font-medium"}`}>
                              {perm.label}
                            </span>
                            <span className="block text-[8px] text-slate-450 font-mono tracking-wider mt-0.5 uppercase">
                              {perm.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-4 text-[9px] text-slate-400 font-mono font-black tracking-wider uppercase flex items-center gap-1.5 justify-center">
                <Lock size={12} className="text-red-500 animate-pulse" /> SEGURANÇA OPERACIONAL RIGOROSA
              </div>
            </div>

            {/* Right Column: Work Queue and Operations Desk */}
            <div className="space-y-4">
              {/* Queue Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1.5 border-b border-slate-100">
                {[
                  { id: 'pendentes', label: 'Pendentes', priority: 'normal', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' },
                  { id: 'urgentes', label: 'Urgentes', priority: 'urgente', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700' },
                  { id: 'criticas', label: 'Críticas', priority: 'critica', color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700 animate-pulse' },
                  { id: 'expiradas', label: 'Expiradas', priority: 'expirada', color: 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700' },
                ].map((queue) => {
                  const isActive = activeQueue === queue.id;
                  const count = queueCounts[queue.id as keyof typeof queueCounts];
                  return (
                    <button
                      key={queue.id}
                      onClick={() => {
                        setActiveQueue(queue.id as any);
                        const firstFiltered = queueItems.find(i => {
                          const itemPriority = queue.id === 'pendentes' ? 'normal' : queue.id === 'urgentes' ? 'urgente' : queue.id === 'criticas' ? 'critica' : 'expirada';
                          return i.priority === itemPriority;
                        });
                        if (firstFiltered) {
                          setSelectedQueueItemId(firstFiltered.id);
                        }
                      }}
                      className={`px-4.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                        isActive 
                          ? queue.id === 'pendentes' ? 'bg-indigo-650 text-white border-indigo-650 shadow-sm' :
                            queue.id === 'urgentes' ? 'bg-orange-650 text-white border-orange-650 shadow-sm' :
                            queue.id === 'criticas' ? 'bg-red-650 text-white border-red-650 shadow-sm animate-pulse' :
                            'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : `${queue.color}`
                      }`}
                    >
                      {queue.label}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono leading-none font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-800'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* Create action button */}
                {ROLE_PERMISSIONS[activeRole].perms.create && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="ml-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Autuar Expediente
                  </button>
                )}
              </div>

              {/* Workspace Split Layout: Left is list, Right is actions */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
                
                {/* Left Side: Queue Items list */}
                <div className="space-y-3">
                  {/* Internal Queue Search */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="Pesquisar nesta fila..."
                      value={queueSearch}
                      onChange={(e) => setQueueSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* List Container */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 select-none custom-scrollbar">
                    {filteredQueueItems.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-slate-450 font-mono text-xs">✗</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-normal">
                          Sem expedientes nesta fila de trabalho
                        </p>
                      </div>
                    ) : (
                      filteredQueueItems.map((item) => {
                        const isItemSelected = selectedQueueItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedQueueItemId(item.id)}
                            className={`p-4 border rounded-2xl transition-all cursor-pointer flex flex-col gap-2 relative ${
                              isItemSelected 
                                ? "bg-slate-900 border-slate-900 text-white shadow-md transform translate-x-1" 
                                : "bg-white border-slate-150 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded leading-none ${
                                  isItemSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                  {item.id}
                                </span>
                                <h5 className={`font-extrabold text-xs md:text-sm mt-1.5 ${isItemSelected ? "text-white" : "text-slate-900"}`}>
                                  {item.documentType}
                                </h5>
                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isItemSelected ? "text-slate-300" : "text-slate-450"}`}>
                                  Interessado: {item.citizenName} &bull; BI: {item.biNumber}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider border shrink-0 ${
                                item.status === 'Pendente' ? 'bg-indigo-50 border-indigo-100 text-indigo-750' :
                                item.status === 'Assinado' ? 'bg-blue-50 border-blue-100 text-blue-750' :
                                item.status === 'Aprovado' ? 'bg-emerald-50 border-emerald-100 text-emerald-750' :
                                item.status === 'Rejeitado' ? 'bg-red-50 border-red-100 text-red-650' :
                                item.status === 'Encaminhado' ? 'bg-orange-50 border-orange-100 text-orange-650 animate-pulse' :
                                'bg-slate-100 border-slate-200 text-slate-600'
                              }`}>
                                {item.status}
                              </span>
                            </div>

                            <p className={`text-[10.5px] line-clamp-2 leading-relaxed ${isItemSelected ? "text-slate-300" : "text-slate-500 font-medium"}`}>
                              {item.description}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Side: Action Console Desk */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between min-h-[460px]">
                  {selectedQueueItem ? (
                    <div className="space-y-4">
                      {/* Desk Header */}
                      <div className="border-b border-slate-200/60 pb-3">
                        <span className="text-[8px] font-mono font-black tracking-widest text-slate-400 uppercase">Mesa de Análise Regulamentar</span>
                        <h4 className="text-sm font-black text-slate-950 uppercase italic mt-1 leading-snug">
                          {selectedQueueItem.documentType}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">ID: {selectedQueueItem.id}</span>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">&bull;</span>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">Entrada: {selectedQueueItem.date}</span>
                        </div>
                      </div>

                      {/* Desk Metadata */}
                      <div className="space-y-2.5">
                        <div className="p-3.5 bg-white border border-slate-150 rounded-xl">
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cidadão Interessado</span>
                          <span className="block text-xs font-black text-slate-800 uppercase leading-none">{selectedQueueItem.citizenName}</span>
                          <span className="block text-[9px] font-mono text-slate-500 font-bold mt-1.5 uppercase">BI de Origem: {selectedQueueItem.biNumber}</span>
                        </div>

                        <div className="p-3.5 bg-white border border-slate-150 rounded-xl leading-relaxed text-xs">
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descrição Circunstancial</span>
                          <span className="text-slate-700 font-medium font-sans block leading-normal">{selectedQueueItem.description}</span>
                          <span className="block text-[8.5px] text-slate-400 font-mono tracking-wider mt-2.5 uppercase font-bold">Lotação Atual: {selectedQueueItem.institution}</span>
                        </div>
                      </div>

                      {/* Decisive Action controls depending on Permissions */}
                      <div className="border-t border-slate-200/60 pt-4 space-y-3">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">Ações Disponíveis ({ROLE_PERMISSIONS[activeRole].label})</span>

                        <div className="flex flex-col gap-2">
                          {/* Sign action */}
                          <button
                            disabled={!ROLE_PERMISSIONS[activeRole].perms.sign || selectedQueueItem.status === 'Assinado' || selectedQueueItem.status === 'Aprovado' || selectedQueueItem.status === 'Arquivado'}
                            onClick={() => handleActionSign(selectedQueueItem)}
                            className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                              ROLE_PERMISSIONS[activeRole].perms.sign && selectedQueueItem.status !== 'Assinado' && selectedQueueItem.status !== 'Aprovado' && selectedQueueItem.status !== 'Arquivado'
                                ? "bg-indigo-600 hover:bg-indigo-750 text-white shadow-sm font-black border-0" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                            }`}
                          >
                            {!ROLE_PERMISSIONS[activeRole].perms.sign && <Lock size={11} />}
                            Assinar Expediente (PKI)
                          </button>

                          {/* Approve and Reject Row */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Approve */}
                            <button
                              disabled={!ROLE_PERMISSIONS[activeRole].perms.approve || selectedQueueItem.status === 'Aprovado' || selectedQueueItem.status === 'Arquivado'}
                              onClick={() => handleActionApprove(selectedQueueItem)}
                              className={`py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                ROLE_PERMISSIONS[activeRole].perms.approve && selectedQueueItem.status !== 'Aprovado' && selectedQueueItem.status !== 'Arquivado'
                                  ? "bg-emerald-600 hover:bg-emerald-750 text-white shadow-sm font-black border-0" 
                                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                              }`}
                            >
                              {!ROLE_PERMISSIONS[activeRole].perms.approve && <Lock size={11} />}
                              Deferir
                            </button>

                            {/* Reject */}
                            <button
                              disabled={!ROLE_PERMISSIONS[activeRole].perms.reject || selectedQueueItem.status === 'Rejeitado' || selectedQueueItem.status === 'Arquivado'}
                              onClick={() => handleActionReject(selectedQueueItem)}
                              className={`py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                ROLE_PERMISSIONS[activeRole].perms.reject && selectedQueueItem.status !== 'Rejeitado' && selectedQueueItem.status !== 'Arquivado'
                                  ? "bg-red-600 hover:bg-red-750 text-white shadow-sm font-black border-0" 
                                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-305"
                              }`}
                            >
                              {!ROLE_PERMISSIONS[activeRole].perms.reject && <Lock size={11} />}
                              Indeferir
                            </button>
                          </div>

                          {/* Rejection reason nested input if Reject action is empowered */}
                          {ROLE_PERMISSIONS[activeRole].perms.reject && selectedQueueItem.status !== 'Rejeitado' && selectedQueueItem.status !== 'Arquivado' && (
                            <input
                              type="text"
                              placeholder="Indique o motivo fundamentado do indeferimento..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="bg-white border border-slate-250 focus:border-red-400 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-800 outline-none placeholder:font-semibold placeholder:text-slate-400"
                            />
                          )}

                          {/* Forward to department custom select action */}
                          <div className="border-t border-slate-200/60 pt-2.5 grid grid-cols-1 gap-2">
                            <span className="text-[8px] font-mono font-black tracking-widest text-slate-400 uppercase font-bold">Tramitar para Órgão Coadjuvante</span>
                            <div className="flex gap-1.5">
                              <select 
                                disabled={!ROLE_PERMISSIONS[activeRole].perms.forward || selectedQueueItem.status === 'Arquivado'}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleActionForward(selectedQueueItem, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                className={`flex-1 min-w-0 px-3 py-2 border rounded-xl text-[10px] uppercase font-black tracking-widest outline-none transition-all appearance-none cursor-pointer text-slate-700 ${
                                  ROLE_PERMISSIONS[activeRole].perms.forward && selectedQueueItem.status !== 'Arquivado'
                                    ? "bg-white border-slate-250 hover:border-slate-350"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300"
                                }`}
                              >
                                <option value="">Proceder ao encaminhamento...</option>
                                <option value="SME">Serviço de Migração e Estrangeiros (SME)</option>
                                <option value="AGT">Administração Geral Tributária (AGT)</option>
                                <option value="MINJUS">Ministério da Justiça (MINJUS)</option>
                                <option value="MED">Ministério da Educação (MED)</option>
                              </select>
                              <span className="p-2 shrink-0 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 pointer-events-none flex items-center justify-center select-none">
                                <Send size={11} />
                              </span>
                            </div>
                          </div>

                          {/* Archive action */}
                          <button
                            disabled={!ROLE_PERMISSIONS[activeRole].perms.archive || selectedQueueItem.status === 'Arquivado'}
                            onClick={() => handleActionArchive(selectedQueueItem)}
                            className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-1 border-0 ${
                              ROLE_PERMISSIONS[activeRole].perms.archive && selectedQueueItem.status !== 'Arquivado'
                                ? "bg-slate-900 hover:bg-slate-850 text-white shadow-sm font-black" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                            }`}
                          >
                            {!ROLE_PERMISSIONS[activeRole].perms.archive && <Lock size={11} />}
                            <FolderArchive size={12} /> Guardar & Arquivar Termo
                          </button>

                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[290px] flex flex-col justify-center items-center text-center gap-3">
                      <span className="text-slate-300 text-xl font-bold font-mono">✗</span>
                      <p className="italic text-[10px] text-slate-400 mx-auto leading-relaxed max-w-[200px] font-sans font-bold uppercase tracking-wider">
                        Selecione um expediente na fila para abrir a mesa de análise.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Anti-Fraud Registry Updates - Exclusive for Operators */}
        {activeRole === 'operador' && (
          <section className="bg-gradient-to-tr from-white to-slate-50 border border-indigo-100 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <div>
                  <h2 className="text-base md:text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                    Serviço de Prevenção a Fraudes Cadastrais
                  </h2>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider font-mono">
                    Módulo de Alteração Cadastral Presencial (Operador de Registo Autorizado)
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-full text-indigo-750 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto">
                <ShieldAlert size={12} /> Exclusivo Operador
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
              {/* Left Column: Search Citizen */}
              <div className="space-y-4 bg-white border border-slate-200 p-5 rounded-2xl h-fit">
                <div className="space-y-1 text-left">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono">Pesquisa na Base Central</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-normal">Insira o Nº de Bilhete de Identidade (BI) do cidadão para carregar a ficha cadastral.</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. 009874562LA041"
                      value={searchBiQuery}
                      onChange={(e) => setSearchBiQuery(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 focus:border-indigo-550 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400 font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleQueryCitizen}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-0 shadow-sm"
                    >
                      Buscar Cidadão
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchBiQuery('009874562LA041');
                      }}
                      className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-0"
                    >
                      Carregar Edlasio
                    </button>
                  </div>
                </div>

                {searchedCitizen ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-150 rounded-xl space-y-1.5 animate-fadeIn text-left">
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[9px] font-black uppercase tracking-widest font-sans">
                      <CheckCircle2 size={13} className="text-emerald-500" /> Registro Localizado
                    </div>
                    <div className="text-[11px] text-slate-800 font-black uppercase leading-snug font-sans">
                      {searchedCitizen.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold font-mono tracking-wider uppercase">
                      BI: {searchedCitizen.bi} &bull; Estado: Ativo
                    </div>
                  </div>
                ) : searchAttempted ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl space-y-1 text-left">
                    <div className="text-rose-700 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-sans">
                      <Ban size={13} /> Sem Resultados
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-normal">Nenhum cidadão cadastrado online com o BI fornecido.</p>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                    <History size={18} className="mx-auto text-slate-300 mb-1.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider block">Aguardando pesquisa...</span>
                  </div>
                )}
              </div>

              {/* Right Column: Update Profile Values */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between text-left">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono">Ficha de Identidade Cadastrada</h4>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider font-sans">Campos auditáveis sujeitos a alteração estrita</p>
                    </div>
                    <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono font-bold uppercase self-start sm:self-auto">
                      Protocolo Ativo: CDA-R2026
                    </span>
                  </div>

                  <form onSubmit={handleUpdateRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome Completo</label>
                      <input
                        type="text"
                        disabled={!searchedCitizen}
                        value={tempProfileName}
                        onChange={(e) => setTempProfileName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl px-4 py-2.5 text-xs font-black text-slate-850 outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Número de BI</label>
                      <input
                        type="text"
                        disabled={!searchedCitizen}
                        value={tempBiField}
                        onChange={(e) => setTempBiField(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-850 outline-none focus:border-indigo-500 focus:bg-white tracking-widest"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Data de Nascimento</label>
                      <input
                        type="text"
                        disabled={!searchedCitizen}
                        value={tempBirthField}
                        onChange={(e) => setTempBirthField(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-850 outline-none focus:border-indigo-500 focus:bg-white tracking-wider"
                      />
                    </div>

                    <div className="space-y-1 text-left col-span-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Estado Civil</label>
                      <select
                        disabled={!searchedCitizen}
                        value={tempMaritalField}
                        onChange={(e) => setTempMaritalField(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl px-3 py-2.5 text-xs font-black text-slate-850 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                      >
                        <option value="Solteiro">Solteiro</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viúvo">Viúvo</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left sm:col-span-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Filiação (Progenitores)</label>
                      <input
                        type="text"
                        disabled={!searchedCitizen}
                        value={tempFiliationField}
                        onChange={(e) => setTempFiliationField(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl px-4 py-2.5 text-xs font-black text-slate-850 outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-3 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        disabled={!searchedCitizen}
                        onClick={() => {
                          setTempProfileName(searchedCitizen?.name || '');
                          setTempBiField(searchedCitizen?.bi || '');
                          setTempBirthField(searchedCitizen?.birthDate || '');
                          setTempMaritalField(searchedCitizen?.maritalStatus || '');
                          setTempFiliationField(searchedCitizen?.filiation || '');
                        }}
                        className="flex-1 bg-white border border-slate-250 text-slate-700 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        disabled={!searchedCitizen}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-755 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all cursor-pointer border-0 shadow-md"
                      >
                        Efetuar Atualização Cadastral
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Electronic Seal & Protocol Certificate details below update */}
            <AnimatePresence>
              {lastUpdatedProtocol && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-emerald-50 border border-emerald-250 rounded-[20px] p-5 text-left mt-4 animate-fadeIn"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h4 className="font-sans text-[11px] font-black text-emerald-950 uppercase tracking-wider mb-1">
                          Selo Eletrónico de Homologação de Dados Cadastrais
                        </h4>
                        <p className="text-[11px] text-emerald-850 font-bold leading-normal">
                          A ficha cadastral foi atualizada com sucesso e enviada ao Registo de Identidade Única do Cidadão. Atualização selada eletronicamente.
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 text-[9px] font-mono leading-none text-emerald-700 font-black uppercase">
                          <span>Selo: <strong className="font-black text-emerald-800">{lastUpdatedProtocol.protocolCode}</strong></span>
                          <span>&bull;</span>
                          <span>Assinatura Digital Emissor: AGENTE_OPERADOR_CDA_401</span>
                          <span>&bull;</span>
                          <span>Timestamp: {lastUpdatedProtocol.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLastUpdatedProtocol(null)}
                      className="ml-auto text-[8px] font-mono uppercase font-black text-rose-600 border border-rose-250 hover:bg-rose-100/50 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer transition-colors"
                    >
                      Fechar Recibo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Create Expediente Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreateModalOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[600]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 30 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-[40px] shadow-3xl z-[601] overflow-hidden flex flex-col border border-slate-100"
              >
                <div className="bg-slate-900 p-6 md:p-8 text-white relative">
                  <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest block font-bold">Operação Governamental Integrada</span>
                  <h3 className="text-base md:text-lg font-black uppercase italic tracking-tight mt-1 mb-0 pb-0 text-white">Instaurar Novo Expediente</h3>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="absolute right-6 top-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors border-0 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateItem} className="p-6 md:p-8 space-y-4 font-sans text-xs">
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Cidadão Contribuinte *</label>
                    <input
                      type="text"
                      required
                      value={newCitizenName}
                      onChange={(e) => setNewCitizenName(e.target.value)}
                      placeholder="Manuel de Vasconcelos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF / BI de Identidade *</label>
                    <input
                      type="text"
                      required
                      value={newBiNumber}
                      onChange={(e) => setNewBiNumber(e.target.value)}
                      placeholder="00114422LA098"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Documento</label>
                      <select
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[11px] font-bold outline-none focus:border-slate-800 appearance-none cursor-pointer text-slate-700 focus:bg-white"
                      >
                        <option value="Certificado de Residência">Certidão de Morada</option>
                        <option value="Bilhete de Identidade">Bilhete Eletrónico</option>
                        <option value="Certidão de Não Devedor">Certidão Fiscal AGT</option>
                        <option value="Passaporte Nacional">Passaporte SME</option>
                        <option value="Alvará Comercial Simplificado">Alvará Comercial</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Fila de Trâmite</label>
                      <select
                        value={newQueue}
                        onChange={(e) => setNewQueue(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[11px] font-bold outline-none focus:border-slate-800 appearance-none cursor-pointer text-slate-700 focus:bg-white"
                      >
                        <option value="pendentes">Pendentes (Normal)</option>
                        <option value="urgentes">Urgentes</option>
                        <option value="criticas">Críticas (Alta prioridade)</option>
                        <option value="expiradas">Expiradas</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Justificação Administrativa *</label>
                    <textarea
                      required
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Forneça detalhes que motivam a emissão do presente expediente..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 leading-relaxed outline-none focus:border-slate-800 resize-none focus:bg-white"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 bg-white border border-slate-250 text-slate-700 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Anular
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-slate-900 border-0 text-white hover:bg-slate-850 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md"
                    >
                      Instaurar & Emitir
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Category Donut Card */}
          <section
            id="categoria-card"
            className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[480px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">
                Correspondências por Categoria
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 min-h-0">
              <div className="w-full md:w-[45%] h-[200px] md:h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        color: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        fontSize: "10px",
                        fontFamily: 'monospace'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
                    Fluxo
                  </span>
                  <span className="text-xl font-black text-slate-900 italic tracking-tighter leading-none mt-1">
                    100%
                  </span>
                </div>
              </div>

              <div className="w-full md:w-[55%] space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar grid grid-cols-2 gap-x-4">
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-[11px] p-2 hover:bg-slate-50 rounded-xl transition-colors border border-slate-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-650 uppercase tracking-widest text-[9px] truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-black text-slate-950 font-mono text-[10px] shrink-0 ml-1">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Outline Map container */}
          <section
            id="provincia-card"
            className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[480px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-red-600 rounded-full" />
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">
                Distribuição por Província
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 items-center justify-center">
              {/* Visual Maps Representation: Angola Provinces Map */}
              <div className="w-full md:w-[50%] h-[240px] md:h-full flex flex-col items-center justify-center relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 overflow-hidden group/map select-none">
                
                {/* Sized aspect ratio wrapper ensuring perfect coordinate synchronization */}
                <div className="relative w-[190px] h-[220px]">
                  <img
                    src="https://i.postimg.cc/J008DY8G/Mapa-de-Angola-Provincias.gif"
                    alt="Mapa de Angola Províncias"
                    className="absolute w-full h-full object-contain transition-all duration-300 group-hover/map:brightness-[0.98]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Tactical Crosslines active on hover */}
                  {hoveredProvince && (
                    <>
                      {/* Horizontal Targeting Line */}
                      <div 
                        className="absolute left-0 right-0 h-[1px] border-b border-dashed border-red-500/40 pointer-events-none transition-all duration-300 z-10"
                        style={{ 
                          top: mapPins.find(p => p.id === hoveredProvince)?.top || "50%" 
                        }}
                      />
                      {/* Vertical Targeting Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-[1px] border-r border-dashed border-red-500/40 pointer-events-none transition-all duration-300 z-10"
                        style={{ 
                          left: mapPins.find(p => p.id === hoveredProvince)?.left || "50%" 
                        }}
                      />
                    </>
                  )}

                  {/* Pins Overlays */}
                  {mapPins.map((pin) => {
                    const isHovered = hoveredProvince === pin.id;
                    const isSelected = selectedProvince === pin.id;
                    return (
                      <div
                        key={pin.id}
                        className="absolute transition-all duration-300 cursor-pointer z-20"
                        style={{
                          top: pin.top,
                          left: pin.left,
                          transform: "translate(-50%, -50%)"
                        }}
                        onMouseEnter={() => setHoveredProvince(pin.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          setSelectedProvince(selectedProvince === pin.id ? null : pin.id);
                        }}
                      >
                        {/* Interactive Highlight Pulse Wave */}
                        <div 
                          className={`absolute w-8 h-8 -top-3 -left-3 rounded-full border transition-all duration-500 ${
                            isHovered 
                              ? "border-red-500 bg-red-500/15 scale-125" 
                              : isSelected
                              ? "border-red-600 bg-red-600/15 scale-110"
                              : "border-transparent"
                          }`}
                        />

                        {/* Secondary Pin Glow */}
                        <span className={`absolute inline-flex rounded-full opacity-75 animate-ping -top-1.5 -left-1.5 ${
                          isHovered 
                            ? "h-4 w-4 bg-red-600" 
                            : isSelected
                            ? "h-4 w-4 bg-red-700"
                            : "h-3 w-3 bg-red-400/20"
                        }`} />

                        {/* Core Dot Indicator */}
                        <div 
                          className={`w-2.5 h-2.5 rounded-full shadow-md transition-all duration-300 ${
                            isHovered 
                              ? "bg-red-650 scale-125 ring-4 ring-red-100" 
                              : isSelected
                              ? "bg-red-700 scale-115 ring-4 ring-red-200"
                              : "bg-red-500 hover:bg-red-650 hover:scale-110 ring-2 ring-white"
                          }`}
                        />

                        {/* Floating Tactile HUD Card Overlay */}
                        {isHovered && (
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-slate-900/95 border border-red-500/40 text-white rounded-xl p-2.5 shadow-xl whitespace-nowrap pointer-events-none z-30 font-mono text-[8px] flex flex-col gap-0.5 min-w-[130px] transition-all duration-200">
                            <span className="font-sans font-black uppercase text-red-500 text-[9px] tracking-wide mb-0.5 flex items-center justify-between">
                              {pin.name}
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                            </span>
                            <div className="flex justify-between gap-3 text-slate-350">
                              <span>Correspondências:</span>
                              <span className="font-black text-white text-[9px]">{pin.count.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-slate-400 text-[7px] border-t border-slate-800/65 pt-1 mt-0.5">
                              <span>Canal CDA:</span>
                              <span className="text-green-400 font-bold uppercase tracking-widest text-[7px]">Ativo</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-1.5 left-2.5 flex items-center gap-1.5 font-mono text-[7px] font-black text-slate-400 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  MAPA DE PROVÍNCIAS &bull; CDA RESUMO
                </div>
              </div>

              {/* Province listings matching layout exact specifications */}
              <div className="w-full md:w-[50%] flex flex-col justify-between h-full min-h-[220px]">
                <div className="space-y-1.5 overflow-y-auto max-h-[190px] pr-1 custom-scrollbar">
                  {provinceData.map((prov) => {
                    const isHovered = hoveredProvince === prov.id;
                    const isSelected = selectedProvince === prov.id;
                    return (
                      <div
                        key={prov.name}
                        onMouseEnter={() => setHoveredProvince(prov.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          setSelectedProvince(selectedProvince === prov.id ? null : prov.id);
                        }}
                        className={`flex justify-between items-center text-[10px] p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          isHovered
                            ? "bg-red-50/50 border-red-200 text-red-950 scale-[1.02] shadow-sm"
                            : isSelected
                            ? "bg-red-50/70 border-red-300 text-red-950 scale-[1.01] shadow-sm"
                            : "bg-slate-50/30 border-transparent hover:bg-slate-50 hover:border-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="font-bold uppercase tracking-widest group-hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
                          {prov.name}
                        </span>
                        <span
                          className={`font-mono font-black tracking-tighter ${
                            isHovered
                              ? "text-red-650"
                              : isSelected
                              ? "text-red-700"
                              : "text-slate-950"
                          }`}
                        >
                          {prov.count.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub regional interactive diagnostic card */}
                <div className="mt-3 p-3 bg-slate-50/90 border border-slate-100/80 rounded-2xl min-h-[56px] flex items-center justify-between text-[10px] text-slate-500 transition-all duration-300">
                  {selectedProvince ? (
                    <div className="w-full flex justify-between items-center transition-all animate-fadeIn">
                      <div>
                        <span className="font-mono text-[8px] font-black uppercase text-red-600 block leading-none mb-1 tracking-wider">
                          Província Ativa: {provinceData.find(p => p.id === selectedProvince)?.name}
                        </span>
                        <p className="text-[9px] text-slate-400 font-medium font-sans">
                          Canal seguro CDA estabelecido e operando com {provinceData.find(p => p.id === selectedProvince)?.count.toLocaleString()} registros ativos.
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProvince(null);
                        }}
                        className="p-1 px-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-800 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider shadow-sm transition-all shrink-0 hover:bg-slate-50"
                      >
                        Desativar
                      </button>
                    </div>
                  ) : (
                    <p className="italic text-[9px] text-slate-400 mx-auto text-center font-medium leading-relaxed max-w-[200px] font-sans">
                      Selecione uma província no mapa ou na lista acima para diagnósticos integrados regionais.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
