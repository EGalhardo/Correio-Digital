/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Mail, 
  Inbox, 
  Send, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Fingerprint,
  Scan,
  IdCard,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  ChevronRight,
  Sliders,
  Eye,
  Activity,
  Settings,
  Layers,
  Smartphone,
  Ban,
  Key,
  Plus,
  UserPlus,
  Trash2,
  Edit,
  MapPin
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

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

interface GovContactsContentProps {
  appMode?: string;
  bi?: string;
  setBi?: (val: string) => void;
  nif?: string;
  setNif?: (val: string) => void;
  phone?: string;
  setPhone?: (val: string) => void;
  passport?: string;
  setPassport?: (val: string) => void;
  profileName?: string;
  setProfileName?: (val: string) => void;
  userBirthDate?: string;
  setUserBirthDate?: (val: string) => void;
  userFiliation?: string;
  setUserFiliation?: (val: string) => void;
  userMaritalStatus?: string;
  setUserMaritalStatus?: (val: string) => void;
  verificationStatus?: string;
  setVerificationStatus?: (val: string) => void;
  hasFacialAuth?: boolean;
  setHasFacialAuth?: (val: boolean) => void;
  hasTwoFactor?: boolean;
  setHasTwoFactor?: (val: boolean) => void;
  govPin?: string;
  setGovPin?: (val: string) => void;
  addAuditLog?: (action: string, type?: 'info' | 'warning' | 'critical' | 'success') => void;
  auditLogs?: AuditLog[];
}

export function GovContactsContent({
  appMode = 'user',
  bi = '009874562LA041',
  setBi,
  nif = '241098451',
  setNif,
  phone = '+244 923 456 789',
  setPhone,
  passport = 'AO-P129384',
  setPassport,
  profileName = 'Edlasio Galhardo',
  setProfileName,
  userBirthDate = '12/03/1995',
  setUserBirthDate,
  userFiliation = 'António Galhardo & Maria Conceição',
  setUserFiliation,
  userMaritalStatus = 'Solteiro',
  setUserMaritalStatus,
  verificationStatus = 'Totalmente verificado',
  setVerificationStatus,
  hasFacialAuth = true,
  setHasFacialAuth,
  hasTwoFactor = false,
  setHasTwoFactor,
  govPin = '1234',
  setGovPin,
  addAuditLog,
  auditLogs = []
}: GovContactsContentProps) {
  
  // Workers State for Institution Mode
  interface Trabajador {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    agentId: string;
    status: 'Ativo' | 'Suspenso' | 'Férias' | 'Pendente';
    lastAccess: string;
    phone: string;
  }

  const [workers, setWorkers] = useState<Trabajador[]>(() => {
    const isPlatformAdmin = appMode === 'admin-workers';
    const key = isPlatformAdmin ? 'correio_digital_admin_workers' : 'correio_digital_workers';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    if (isPlatformAdmin) {
      return [
        {
          id: 'w-admin-1',
          name: 'Edlasio Galhardo',
          email: 'e.galhardo@mindis.gov.ao',
          role: 'Administrador Geral / Central',
          department: 'Infraestrutura Central (CDA)',
          agentId: 'CDA-0001',
          status: 'Ativo',
          lastAccess: 'Hoje, 10:22',
          phone: '+244 923 888 777'
        },
        {
          id: 'w-admin-2',
          name: 'Kambanza Neto',
          email: 'k.neto@cda.gov.ao',
          role: 'Suporte Técnico Especializado',
          department: 'Segurança Cibernética',
          agentId: 'CDA-0050',
          status: 'Ativo',
          lastAccess: 'Hoje, 08:30',
          phone: '+244 924 113 050'
        },
        {
          id: 'w-admin-3',
          name: 'Marta Viana',
          email: 'm.viana@cda.gov.ao',
          role: 'Auditora Geral',
          department: 'Auditoria & Compliance',
          agentId: 'CDA-0022',
          status: 'Ativo',
          lastAccess: 'Ontem, 15:44',
          phone: '+244 912 770 022'
        },
        {
          id: 'w-admin-4',
          name: 'Valeriano Lima',
          email: 'v.lima@cda.gov.ao',
          role: 'Moderador de Cadastros',
          department: 'Processamento de Identidade',
          agentId: 'CDA-0099',
          status: 'Ativo',
          lastAccess: '28/05/2026',
          phone: '+244 931 555 099'
        }
      ];
    }
    return [
      {
        id: 'w-1',
        name: 'Mário de Oliveira',
        email: 'm.oliveira@cda.gov.ao',
        role: 'Diretor de Sistemas de Informação',
        department: 'Tecnologias de Informação (CDA)',
        agentId: 'CDA-0044',
        status: 'Ativo',
        lastAccess: 'Hoje, 09:15',
        phone: '+244 923 112 044'
      },
      {
        id: 'w-2',
        name: 'Amélia Augusto',
        email: 'a.augusto@cda.gov.ao',
        role: 'Técnica de Validação Facial e BI',
        department: 'Homologação de Identidade',
        agentId: 'CDA-0981',
        status: 'Ativo',
        lastAccess: 'Ontem, 16:40',
        phone: '+244 912 804 981'
      },
      {
        id: 'w-3',
        name: 'Hamilton Santana',
        email: 'h.santana@cda.gov.ao',
        role: 'Gestor de Correspondência Digital',
        department: 'Distribuição Postal Digital',
        agentId: 'CDA-0152',
        status: 'Ativo',
        lastAccess: '25/05/2026',
        phone: '+244 931 773 152'
      },
      {
        id: 'w-4',
        name: 'Sílvia de Sousa',
        email: 's.sousa@cda.gov.ao',
        role: 'Auditora de Segurança e Criptografia',
        department: 'Segurança da Informação (CDA)',
        agentId: 'CDA-0431',
        status: 'Férias',
        lastAccess: '18/05/2026',
        phone: '+244 922 400 431'
      }
    ];
  });

  React.useEffect(() => {
    const key = appMode === 'admin-workers' ? 'correio_digital_admin_workers' : 'correio_digital_workers';
    localStorage.setItem(key, JSON.stringify(workers));
  }, [workers, appMode]);

  // Citizen State (adapted from Interoperabilidade page for Admin "Usuários" page)
  interface Citizen {
    id: string;
    name: string;
    category: string;
    province: string;
    municipio: string;
    address: string;
    contact: string;
    status: 'Aprovado' | 'Pendente' | 'Não Aprovado';
    biNumber?: string;
    facePhoto?: string;
    reason?: string;
    verificationScore?: number;
  }

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filterProvince, setFilterProvince] = useState<string>('Todas');
  const [filterMunicipio, setFilterMunicipio] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<'Aprovado' | 'Pendente' | 'Não Aprovado'>('Aprovado');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // IA review states
  const [selectedReviewCitizen, setSelectedReviewCitizen] = useState<Citizen | null>(null);
  const [aiEvaluationState, setAiEvaluationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [aiMatchScore, setAiMatchScore] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // New Step-by-Step validation states for the 3-step citizen verification
  const [reviewStepTab, setReviewStepTab] = useState<1 | 2 | 3>(1);
  const [validatedFields, setValidatedFields] = useState<Record<string, boolean>>({
    name: true,
    bi: true,
    doc: true,
    photo: true,
    province: true,
    municipio: true,
    email: true,
    phone: true,
    emergency: true,
    fingerprint: true,
    facial: true
  });
  const [rejectionStep, setRejectionStep] = useState<'passo1' | 'passo2' | 'passo3' | 'geral'>('geral');

  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    const saved = localStorage.getItem('gov_admin_citizens');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Garantir que todos estejam convertidos para os novos status válidos
        return parsed.map((c: any) => {
          let st = c.status;
          if (st === 'Ativo') st = 'Aprovado';
          if (st === 'Suspenso' || st === 'Inativo') st = 'Não Aprovado';
          if (st !== 'Aprovado' && st !== 'Pendente' && st !== 'Não Aprovado') st = 'Pendente';
          return {
            ...c,
            status: st,
            biNumber: c.biNumber || c.bi || (c.id === 'u1' ? '009874562LA041' : `00${Math.floor(100000 + Math.random() * 900000)}LA041`),
            facePhoto: c.facePhoto || (
              c.id === 'u1' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop&crop=face' :
              c.id === 'u2' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop&crop=face' :
              c.id === 'u3' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop&crop=face' :
              c.id === 'u4' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop&crop=face' :
              c.id === 'u5' ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&h=250&fit=crop&crop=face' :
              c.id === 'u6' ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&fit=crop&crop=face' :
              'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&fit=crop&crop=face'
            )
          };
        });
      } catch (e) {
        // Fallback
      }
    }
    return [
      { 
        id: 'u1', 
        name: 'Edlasio Galhardo', 
        category: 'Trabalhador', 
        province: 'Luanda', 
        municipio: 'Maianga', 
        address: 'Bairro Alvalade, Rua do Comércio', 
        contact: '+244 923 000 111', 
        status: 'Aprovado',
        biNumber: '009874562LA041',
        facePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop&crop=face',
        verificationScore: 98.4
      },
      { 
        id: 'u2', 
        name: 'Kiara de Sousa', 
        category: 'Estudante', 
        province: 'Luanda', 
        municipio: 'Kilamba Kiaxi', 
        address: 'Centralidade do Kilamba, Bloco C', 
        contact: '+244 912 884 551', 
        status: 'Aprovado',
        biNumber: '005432109LA098',
        facePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop&crop=face',
        verificationScore: 97.2
      },
      { 
        id: 'u3', 
        name: 'Manuel Bernardo', 
        category: 'Aposentado', 
        province: 'Benguela', 
        municipio: 'Lobito', 
        address: 'Bairro Comercial, Rua 2', 
        contact: '+244 931 772 101', 
        status: 'Pendente',
        biNumber: '008765432BE022',
        facePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop&crop=face'
      },
      { 
        id: 'u4', 
        name: 'Sara Ferreira', 
        category: 'Empresária', 
        province: 'Benguela', 
        municipio: 'Benguela', 
        address: 'Zona Hospitalar, Benguela Sede', 
        contact: '+244 915 220 384', 
        status: 'Aprovado',
        biNumber: '001234567BE055',
        facePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop&crop=face',
        verificationScore: 99.1
      },
      { 
        id: 'u5', 
        name: 'António Lopes', 
        category: 'Funcionário Público', 
        province: 'Huíla', 
        municipio: 'Lubango', 
        address: 'Avenida Agostinho Neto, Centro', 
        contact: '+244 923 112 044', 
        status: 'Pendente',
        biNumber: '002345678HU066',
        facePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&h=250&fit=crop&crop=face'
      },
      { 
        id: 'u6', 
        name: 'Maria Antónia', 
        category: 'Estudante', 
        province: 'Huambo', 
        municipio: 'Huambo', 
        address: 'Centro do Huambo', 
        contact: '+244 928 600 001', 
        status: 'Não Aprovado',
        biNumber: '004567890HA011',
        facePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&fit=crop&crop=face',
        reason: 'Divergência biométrica: a foto registada na selfie não condiz com as características antropométricas da foto presente no Bilhete de Identidade.'
      },
      { 
        id: 'u7', 
        name: 'José Kalunga', 
        category: 'Trabalhador', 
        province: 'Cabinda', 
        municipio: 'Cabinda', 
        address: 'Rua do Porto de Cabinda', 
        contact: '+244 923 100 007', 
        status: 'Não Aprovado',
        biNumber: '003456789CA077',
        facePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=250&h=250&fit=crop&crop=face',
        reason: 'Fotocópia embaçada: imagem do documento de identidade está ilegível para processamento óptico (OCR).'
      },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('gov_admin_citizens', JSON.stringify(citizens));
  }, [citizens]);

  const [addUserName, setAddUserName] = useState('');
  const [addUserCategory, setAddUserCategory] = useState('Trabalhador');
  const [addUserProvince, setAddUserProvince] = useState('Luanda');
  const [addUserMunicipio, setAddUserMunicipio] = useState('Luanda');
  const [addUserAddress, setAddUserAddress] = useState('');
  const [addUserContact, setAddUserContact] = useState('');

  const filteredCitizens = useMemo(() => {
    return citizens.filter((citizen) => {
      const matchCategory = selectedCategory === 'Todos' || citizen.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchProvince = filterProvince === 'Todas' || citizen.province === filterProvince;
      const matchMunicipio = filterMunicipio === 'Todos' || citizen.municipio === filterMunicipio;
      const matchStatus = citizen.status === filterStatus;
      return matchCategory && matchProvince && matchMunicipio && matchStatus;
    });
  }, [citizens, selectedCategory, filterProvince, filterMunicipio, filterStatus]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserName || !addUserAddress || !addUserContact) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Residência e Telefone/Contacto).');
      return;
    }

    const newUser: Citizen = {
      id: `u-${Date.now()}`,
      name: addUserName,
      category: addUserCategory,
      province: addUserProvince,
      municipio: addUserMunicipio,
      address: addUserAddress,
      contact: addUserContact,
      status: 'Pendente',
      biNumber: `00${Math.floor(100000 + Math.random() * 900000)}LA041`,
      facePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop&crop=face'
    };

    setCitizens(prev => [newUser, ...prev]);
    setIsAddUserModalOpen(false);

    setAddUserName('');
    setAddUserAddress('');
    setAddUserContact('');

    addAuditLog?.(`Cadastro: Usuário "${newUser.name}" registrado com sucesso em ${newUser.province}.`, 'success');
  };

  const MUNICIPALITIES_BY_PROVINCE: { [key: string]: string[] } = {
    'Todas': ['Todos'],
    'Luanda': ['Todos', 'Viana', 'Belas', 'Cazenga', 'Cacuaco', 'Luanda', 'Talatona', 'Kilamba Kiaxi', 'Maianga', 'Rangel', 'Ingombota'],
    'Benguela': ['Todos', 'Benguela', 'Lobito', 'Catumbela', 'Baía Farta'],
    'Huíla': ['Todos', 'Lubango', 'Chibia', 'Humpata', 'Caconda'],
    'Cabinda': ['Todos', 'Cabinda', 'Cacongo', 'Buco-Zau'],
    'Bengo': ['Todos', 'Dande', 'Ambriz', 'Nambuangongo'],
    'Huambo': ['Todos', 'Huambo', 'Caála', 'Bailundo']
  };

  // Addition Modal and Form States for workers
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [isEditingWorker, setIsEditingWorker] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('');
  const [newWorkerDept, setNewWorkerDept] = useState('');
  const [newWorkerAgentId, setNewWorkerAgentId] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('');
  const [newWorkerStatus, setNewWorkerStatus] = useState<'Ativo' | 'Suspenso' | 'Férias' | 'Pendente'>('Ativo');
  
  // Search state for workers
  const [workerSearch, setWorkerSearch] = useState('');
  const [workerStatusFilter, setWorkerStatusFilter] = useState<string>('all');
  
  // Selected Worker state
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const resetForm = () => {
    setNewWorkerName('');
    setNewWorkerEmail('');
    setNewWorkerRole('');
    setNewWorkerDept('');
    setNewWorkerAgentId('');
    setNewWorkerPhone('');
    setNewWorkerStatus('Ativo');
    setIsEditingWorker(false);
    setEditingWorkerId(null);
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerEmail || !newWorkerPhone || !newWorkerRole) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome completo, Email, Telefone e Função/Cargo).');
      return;
    }

    if (isEditingWorker && editingWorkerId) {
      setWorkers(prev => prev.map(w => w.id === editingWorkerId ? {
        ...w,
        name: newWorkerName,
        email: newWorkerEmail,
        role: newWorkerRole,
        phone: newWorkerPhone,
        department: w.department || 'Geral',
        agentId: w.agentId || `CDA-${Math.floor(1000 + Math.random() * 9000)}`,
        status: w.status || 'Ativo'
      } : w));
      addAuditLog?.(`[AGENTES] Registo do agente ${newWorkerName} atualizado com sucesso.`, 'success');
    } else {
      const newWorker: Trabajador = {
        id: `w-${Date.now()}`,
        name: newWorkerName,
        email: newWorkerEmail,
        role: newWorkerRole,
        phone: newWorkerPhone,
        department: 'Geral',
        agentId: `CDA-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Ativo',
        lastAccess: 'Nunca acedeu'
      };
      setWorkers(prev => [...prev, newWorker]);
      addAuditLog?.(`[AGENTES] Novo agente ${newWorkerName} cadastrado com sucesso.`, 'success');
    }

    setShowAddWorkerModal(false);
    resetForm();
  };

  const handleEditWorkerClick = (w: Trabajador) => {
    setIsEditingWorker(true);
    setEditingWorkerId(w.id);
    setNewWorkerName(w.name);
    setNewWorkerEmail(w.email);
    setNewWorkerRole(w.role);
    setNewWorkerDept(w.department || 'Geral');
    setNewWorkerAgentId(w.agentId || '');
    setNewWorkerPhone(w.phone);
    setNewWorkerStatus(w.status || 'Ativo');
    setShowAddWorkerModal(true);
  };

  const handleDeleteWorker = (id: string, name: string) => {
    if (confirm(`Tem a certeza que deseja remover o agente ${name} do sistema?`)) {
      setWorkers(prev => prev.filter(w => w.id !== id));
      if (selectedWorkerId === id) setSelectedWorkerId(null);
      addAuditLog?.(`[AGENTES] Agente ${name} foi removido do ecossistema institucional.`, 'warning');
    }
  };

  const handleToggleWorkerStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Ativo' ? 'Suspenso' : 'Ativo';
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: nextStatus } : w));
    addAuditLog?.(`[AGENTES] Estado do agente ${name} alterado para ${nextStatus}.`, 'info');
  };

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(workerSearch.toLowerCase()) || 
                            w.email.toLowerCase().includes(workerSearch.toLowerCase()) ||
                            w.role.toLowerCase().includes(workerSearch.toLowerCase());
      return matchesSearch;
    });
  }, [workers, workerSearch]);

  if (appMode === 'institution' || appMode === 'admin-workers') {
    const isPlatformAdmin = appMode === 'admin-workers';
    return (
      <div className="pb-24 text-left animate-fadeIn">
        {/* Banner header for Workers */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Users size={16} />
              </div>
              <span className="font-mono text-xs font-black uppercase text-indigo-650 tracking-[0.2em]">
                {isPlatformAdmin ? 'Administração Central • Recursos Humanos' : 'Portal Institucional • Recursos Humanos'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
              {isPlatformAdmin ? 'Gestão de Agentes da Plataforma' : 'Gestão de Agentes'}
            </h1>
            <p className="text-slate-500 font-medium text-xs mt-2 max-w-xl">
              {isPlatformAdmin 
                ? 'Controle de administradores, moderadores e técnicos autorizados da plataforma central. Administre permissões, acessos e registe novos operadores da plataforma.'
                : 'Controle de agentes públicos, funcionários e técnicos autorizados da instituição. Administre as credenciais operacionais e registe novos operadores do sistema.'}
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAddWorkerModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-950/10 cursor-pointer border-0 transition-all self-start md:self-auto"
          >
            <UserPlus size={16} />
            {isPlatformAdmin ? 'Adicionar Agente da Plataforma' : 'Adicionar Agente'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs">
            <span className="font-mono text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              {isPlatformAdmin ? 'Total de Agentes da Plataforma' : 'Total de Agentes'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 italic font-mono">{workers.length}</span>
              <span className="text-[10px] text-slate-400 font-bold">Inscritos</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs">
            <span className="font-mono text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              {isPlatformAdmin ? 'Plataforma Geral' : 'Canal Regulamentado'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-indigo-600 italic font-mono">
                {isPlatformAdmin ? 'CDA' : 'AGT'}
              </span>
              <span className="text-[10px] text-indigo-500 font-bold">
                {isPlatformAdmin ? 'Administração de Sistemas' : 'Acesso Governamental'}
              </span>
            </div>
          </div>
        </div>

        {/* Search, Filter and Main Board */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <div>
                <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                  {isPlatformAdmin ? 'Quadro de Agentes da Plataforma' : 'Quadro de Colaboradores Autorizados'}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">
                  {isPlatformAdmin 
                    ? 'Base de dados de técnicos e administradores com acesso operacional ao sistema'
                    : 'Base de dados de funcionários associados às credenciais do sistema'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={13} />
                <input
                  type="text"
                  placeholder={isPlatformAdmin ? "Pesquisar por Nome, Cargo, Email..." : "Pesquisar por Nome, Cargo, Email..."}
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full sm:w-[220px] bg-slate-55 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Beautiful tabular list for workers/agents presented in lines/rows */}
          {filteredWorkers.length > 0 ? (
            <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[600px] border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="py-4 px-5 rounded-l-2xl">Colaborador / Agente</th>
                    <th className="py-4 px-5">E-mail / Contacto</th>
                    <th className="py-4 px-5">Telefone</th>
                    <th className="py-4 px-5">Função / Cargo</th>
                    <th className="py-4 px-5 text-center">Estado</th>
                    <th className="py-4 px-5 text-center">Último Acesso</th>
                    <th className="py-4 px-5 text-center rounded-r-2xl">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className="text-xs text-[#334155] hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-b-0">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-755 text-xs uppercase shadow-3xs shrink-0 font-sans">
                            {w.name.split(' ').map(n => n[0]).slice(0, 2).join('') || (isPlatformAdmin ? 'TR' : 'AG')}
                          </div>
                          <div className="min-w-0 text-left">
                            <span className="font-display font-black text-slate-900 text-xs sm:text-sm uppercase tracking-tight block truncate leading-none">{w.name}</span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 block mt-1">ID: {w.agentId || w.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{w.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 font-mono font-bold text-slate-600">
                          <Smartphone size={12} className="text-slate-400 shrink-0" />
                          <span>{w.phone}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-left space-y-0.5">
                          <span className="font-bold text-slate-800 text-[11px] block truncate max-w-[200px]">{w.role}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-display">{w.department || 'Serviços Centrais'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider shrink-0 select-none ${
                          w.status === 'Ativo' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          {w.status || 'Ativo'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-center font-mono text-[10px] font-bold text-slate-500">
                        {w.lastAccess || 'Sem registo'}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditWorkerClick(w)}
                            title="Editar Dados"
                            className="py-1.5 px-3 bg-white border border-slate-205 hover:border-slate-405 text-slate-650 hover:text-slate-950 rounded-xl text-[9.5px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(w.id, w.name)}
                            title={isPlatformAdmin ? "Remover Agente da Plataforma" : "Remover Agente"}
                            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded-xl cursor-pointer transition-colors"
                          >
                            <Trash2 size={12} className="mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 bg-white border border-slate-200 rounded-[32px] text-center text-slate-400 shadow-3xs w-full">
              <Users size={28} className="mx-auto text-slate-300 mb-2" />
              <span className="text-[10.5px] font-black uppercase tracking-wider block">
                {isPlatformAdmin ? 'Nenhum agente da plataforma localizado...' : 'Nenhum agente localizado...'}
              </span>
              <p className="text-[9.5px] font-bold uppercase mt-1">Experimente alterar os critérios de filtro ou pesquisa.</p>
            </div>
          )}
        </div>

        {/* MODAL / SLIDE-OVER PARA ADICIONAR/EDITAR AGENTE */}
        <AnimatePresence>
          {showAddWorkerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddWorkerModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs font-sans"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 w-full max-w-lg shadow-2xl z-10 text-left space-y-6"
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 uppercase italic tracking-tight flex items-center gap-2.5">
                    <UserPlus className="text-indigo-650" size={22} />
                    {isPlatformAdmin 
                      ? (isEditingWorker ? 'Editar Ficha do Agente da Plataforma' : 'Registar Novo Agente da Plataforma')
                      : (isEditingWorker ? 'Editar Ficha do Agente' : 'Registar Novo Agente')}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider font-mono">
                    {isPlatformAdmin 
                      ? 'Introduza as credenciais operacionais autorizadas para a plataforma central'
                      : 'Introduza as credenciais operacionais autorizadas pela instituição'}
                  </p>
                </div>

                <form onSubmit={handleCreateWorker} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Nome Completo *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-800 outline-none"
                      placeholder="Ex: Dr. Francisco Manuel"
                      value={newWorkerName}
                      onChange={(e) => setNewWorkerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-800 outline-none"
                      placeholder={isPlatformAdmin ? "f.manuel@mindis.gov.ao" : "f.manuel@cda.gov.ao"}
                      value={newWorkerEmail}
                      onChange={(e) => setNewWorkerEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefone *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold font-mono text-slate-800 outline-none"
                      placeholder="+244 923 000 000"
                      value={newWorkerPhone}
                      onChange={(e) => setNewWorkerPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Função / Cargo *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-800 outline-none"
                      placeholder={isPlatformAdmin ? "Ex: Administrador de Redes" : "Ex: Inspetor Chefe"}
                      value={newWorkerRole}
                      onChange={(e) => setNewWorkerRole(e.target.value)}
                    />
                  </div>

                  {/* Submit / Cancel row */}
                  <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddWorkerModal(false)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-0 shadow-lg shadow-blue-900/15 font-bold"
                    >
                      {isEditingWorker ? 'Guardar' : 'Submeter'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 border-2 border-indigo-500">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Usuário</h1>
            <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
               <div className="w-1 h-3 bg-indigo-500 rounded-full" />
               Cadastro Geral e Gestão de Usuários do Sistema
            </div>
          </div>
        </div>

        {/* Global Stats indicators */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[20px] border border-slate-100 self-start md:self-auto">
          <div className="text-left px-3">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Usuários Aprovados</div>
            <div className="text-lg font-black text-slate-800">
              {citizens.filter(c => c.status === 'Aprovado').length}/{citizens.length} <span className="text-emerald-500 text-xs font-bold">OK</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-left px-3">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Tráfego de Conexão</div>
            <div className="text-lg font-black text-emerald-600">99.9% <span className="text-[9px] font-semibold text-slate-400 font-mono">DISP</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-8 animate-fadeIn">

        {/* 1. Contentor "Categorias de Usuários" */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden relative group text-left">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
               <h3 className="text-slate-950 font-black text-xs md:text-md italic tracking-tighter uppercase">Categorias de Usuários</h3>
            </div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-100">Controle Administrativo</div>
          </div>
          
          <div className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto custom-scrollbar pb-3">
            {["Todos", "Trabalhador", "Estudante", "Aposentado", "Empresário", "Funcionário Público", "Militar", "Técnico de Saúde", "Agente Policial", "Outros"].map((name) => {
              const isActive = selectedCategory.toLowerCase() === name.toLowerCase();
              const countForCat = name === 'Todos' ? citizens.length : citizens.filter(c => c.category.toLowerCase() === name.toLowerCase()).length;
              return (
                <button 
                  key={name}
                  onClick={() => {
                    setSelectedCategory(name);
                  }}
                  className={`px-5 py-3 rounded-2xl text-[11px] md:text-xs font-black uppercase transition-all cursor-pointer shrink-0 shadow-sm text-left flex items-center gap-2.5 border ${
                    isActive 
                      ? 'bg-[#0e2b64] border-[#0e2b64] text-white shadow-lg font-bold' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Users size={13} className={isActive ? 'text-white/80' : 'text-slate-400'} />
                  <span>{name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#0a204b] text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {countForCat}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2 & 3. Real-Time Dynamic Listing and Location Filters Row */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h4 className="font-black text-slate-900 text-lg md:text-xl italic uppercase tracking-tight flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                Quadro de Cadastros Nacionais: {selectedCategory}
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Visualização, controle regulamentar e filtragem territorial dos cidadãos
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Select Provincia */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <MapPin size={14} className="text-slate-400" />
                <select
                  value={filterProvince}
                  onChange={(e) => {
                    setFilterProvince(e.target.value);
                    setFilterMunicipio('Todos'); // Reset municipality when province shifts
                  }}
                  className="bg-transparent border-0 outline-none text-xs text-slate-700 font-bold pr-6 cursor-pointer"
                >
                  <option value="Todas">Província: Todas</option>
                  {Object.keys(MUNICIPALITIES_BY_PROVINCE).filter(p => p !== 'Todas').map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              {/* Select Municipio */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <MapPin size={14} className="text-slate-400" />
                <select
                  value={filterMunicipio}
                  onChange={(e) => setFilterMunicipio(e.target.value)}
                  className="bg-transparent border-0 outline-none text-xs text-slate-700 font-bold pr-6 cursor-pointer"
                >
                  <option value="Todos">Município: Todos</option>
                  {(MUNICIPALITIES_BY_PROVINCE[filterProvince] || ['Todos']).filter(m => m !== 'Todos').map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>

              {/* DROPDOWN DE ESTADO DE FLUXO (Substituindo o antigo Botão Adicionar) */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 font-sans">
                <Filter size={13} className="text-indigo-600 font-bold" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5">Triagem IA:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className={`bg-transparent border-0 outline-none text-xs font-black uppercase cursor-pointer pr-4 transition-colors ${
                    filterStatus === 'Aprovado' ? 'text-emerald-600' :
                    filterStatus === 'Pendente' ? 'text-orange-500' :
                    'text-red-500'
                  }`}
                >
                  <option value="Pendente" className="text-orange-500 font-semibold font-sans">Pendentes</option>
                  <option value="Aprovado" className="text-emerald-600 font-semibold font-sans">Aprovados</option>
                  <option value="Não Aprovado" className="text-red-650 font-semibold font-sans">Não Aprovados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Beautiful tabular list layout replacing the card grid */}
          {filteredCitizens.length === 0 ? (
            <div className="py-16 text-center animate-fadeIn">
              <div className="max-w-md mx-auto space-y-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
                  filterStatus === 'Aprovado' ? 'bg-emerald-50 text-emerald-400 border-emerald-100' :
                  filterStatus === 'Pendente' ? 'bg-orange-50 text-orange-400 border-orange-100' :
                  'bg-red-50 text-red-400 border-red-100'
                }`}>
                  <Users size={26} />
                </div>
                <h5 className="font-extrabold text-slate-950 text-sm uppercase">Nenhum Usuário Corresponde</h5>
                <p className="text-xs text-slate-400 leading-normal max-w-sm mx-auto">
                  De momento, não existem dados para exibir na categoria <strong className="text-slate-800">{selectedCategory}</strong> com o estado de validação <strong className={`font-black ${
                    filterStatus === 'Aprovado' ? 'text-emerald-600' :
                    filterStatus === 'Pendente' ? 'text-orange-500' :
                    'text-red-600'
                  }`}>{filterStatus.toUpperCase()}S</strong> nas províncias/municípios selecionados.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[600px] border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="py-4 px-5 rounded-l-2xl">Cidadão / Tipo</th>
                    <th className="py-4 px-5">Documento BI</th>
                    <th className="py-4 px-5">Contacto</th>
                    <th className="py-4 px-5">Localidade</th>
                    <th className="py-4 px-5 text-center">Score Match IA</th>
                    <th className="py-4 px-5 text-center">Estado</th>
                    <th className="py-4 px-5 text-center">Anexos / Ficheiros</th>
                    <th className="py-4 px-5 text-center rounded-r-2xl">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredCitizens.map((citizen) => (
                    <tr 
                      key={citizen.id}
                      onClick={() => {
                        setSelectedReviewCitizen(citizen);
                        if (citizen.status === 'Pendente') {
                          setAiEvaluationState('idle');
                          setAiMatchScore(null);
                          setRejectionReason('');
                          setIsRejecting(false);
                        } else {
                          setAiEvaluationState('completed');
                          setAiMatchScore(citizen.verificationScore || 95.0);
                          setRejectionReason(citizen.reason || '');
                          setIsRejecting(false);
                        }
                      }}
                      className="text-xs text-[#334155] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                            <img src={citizen.facePhoto} alt="Rosto" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-black text-slate-900 text-xs sm:text-sm uppercase leading-tight tracking-tight truncate max-w-[200px]">
                              {citizen.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-extrabold text-[8.5px] text-indigo-650 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {citizen.category}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-slate-400">ID: {citizen.id.toUpperCase()}</span>
                            </div>
                            {citizen.reason && citizen.status === 'Não Aprovado' && (
                              <p className="text-[9.5px] text-rose-600 line-clamp-1 italic mt-1 font-semibold" title={citizen.reason}>
                                Rejeitado: {citizen.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-slate-800">
                        <div className="flex items-center gap-1">
                          <IdCard size={11} className="text-slate-400 shrink-0" />
                          <span>{citizen.biNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-600 font-bold">
                        {citizen.contact}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-705">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <div>
                            <span className="text-slate-800 block leading-tight">{citizen.province}</span>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{citizen.municipio}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center font-mono font-black text-emerald-600">
                        {citizen.verificationScore && citizen.status !== 'Não Aprovado' ? (
                          <span>{citizen.verificationScore}%</span>
                        ) : (
                          <span className="text-slate-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {citizen.status === 'Aprovado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase tracking-wider select-none">
                            <ShieldCheck size={11} /> Aprovado
                          </span>
                        )}
                        {citizen.status === 'Pendente' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-655 border border-orange-100 text-[9px] font-black uppercase tracking-wider animate-pulse select-none">
                            <Scan size={11} /> Pendente
                          </span>
                        )}
                        {citizen.status === 'Não Aprovado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-650 border border-red-150 text-[9px] font-black uppercase tracking-wider select-none">
                            <ShieldAlert size={11} /> Rejeitado
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-205 rounded-lg p-1.5 py-0.5 text-[9.5px] font-bold text-slate-600 shadow-3xs" title="Fotocópia do B.I. integrada">
                            <FileText size={10} className="text-indigo-650" />
                            <span className="font-mono text-[8px]">BI.pdf</span>
                          </div>
                          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-lg p-1 py-0.5 text-[9.5px] font-bold text-indigo-655 shadow-3xs" title="Auto-captura biométrica certificada">
                            <Scan size={10} className="text-indigo-650" />
                            <span className="font-mono text-[8px]">Face.raw</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {citizen.status === 'Pendente' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReviewCitizen(citizen);
                                setAiEvaluationState('idle');
                                setAiMatchScore(null);
                                setRejectionReason('');
                                setIsRejecting(false);
                                setReviewStepTab(1);
                                setValidatedFields({
                                  name: true,
                                  bi: true,
                                  doc: true,
                                  photo: true,
                                  province: true,
                                  municipio: true,
                                  email: true,
                                  phone: true,
                                  emergency: true,
                                  fingerprint: true,
                                  facial: true
                                });
                                setRejectionStep('geral');
                              }}
                              className="bg-indigo-600 hover:bg-indigo-750 text-white font-black text-[9px] uppercase tracking-wide py-1.5 px-2.5 rounded-lg cursor-pointer border-0 transition-colors shadow-xs active:scale-95 flex items-center justify-center gap-1"
                            >
                              <Scan size={11} /> Analisar
                            </button>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReviewCitizen(citizen);
                                  setAiEvaluationState('completed');
                                  setAiMatchScore(citizen.verificationScore || 95.0);
                                  setRejectionReason(citizen.reason || '');
                                  setIsRejecting(false);
                                  setReviewStepTab(1);
                                  setValidatedFields({
                                    name: true,
                                    bi: true,
                                    doc: true,
                                    photo: true,
                                    province: true,
                                    municipio: true,
                                    email: true,
                                    phone: true,
                                    emergency: true,
                                    fingerprint: true,
                                    facial: true
                                  });
                                  setRejectionStep('geral');
                                }}
                                className="bg-white hover:bg-slate-50 text-slate-705 font-black text-[9px] uppercase tracking-wide py-1.5 px-2 rounded-lg cursor-pointer border border-slate-205 transition-colors flex items-center justify-center gap-0.5"
                              >
                                <Eye size={11} /> Revisar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Remover usuário "${citizen.name}" permanentemente do cadastro?`)) {
                                    setCitizens(prev => prev.filter(c => c.id !== citizen.id));
                                    addAuditLog?.(`Remoção: Usuário "${citizen.name}" removido permanentemente.`, 'critical');
                                  }
                                }}
                                className="bg-rose-50 hover:bg-rose-105 text-rose-650 border border-slate-200 p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Eliminar permanentemente"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DE ANÁLISE COMPARATIVA E VERIFICAÇÃO DE BIOMETRIA IA */}
      <AnimatePresence>
        {selectedReviewCitizen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReviewCitizen(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-[40px] shadow-3xl z-[201] overflow-hidden border border-slate-150 text-left font-sans flex flex-col max-h-[92vh]"
            >
              {/* Header do Modal */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white relative flex-shrink-0">
                <button 
                  onClick={() => setSelectedReviewCitizen(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer border-0 text-white bg-transparent"
                  type="button"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-[18px] flex items-center justify-center text-white border border-white/20">
                     <ShieldCheck size={24} className="text-indigo-300" />
                  </div>
                  <div>
                     <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Auditoria Governamental e Validação Civil</div>
                     <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none mt-1">
                       Portal de Homologação de Identidade
                     </h2>
                  </div>
                </div>
              </div>

              {/* Corpo de Análise em Grid de Duas Partes */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
                
                {/* Alerta de status ou instruções */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 text-left">
                  <Activity size={18} className="text-indigo-650 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Regras de Auditoria para Homologação de Cadastro</p>
                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed uppercase">
                      Verifique se a fotocópia do Bilhete de Identidade oficial, o nome inserido e a fotografia antropométrica facial capturada no momento da selfie correspondente pertencem ao mesmo indivíduo. Utilize a inteligência artificial para o batimento algorítmico pontual.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Painel Esquerdo: Fotocópia do BI Digitalizado (Renderizado de forma incrivelmente autêntica via CSS) */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Painel Esquerdo &bull; Fotocópia do BI</span>
                    
                    <div className="bg-gradient-to-br from-indigo-50/70 to-slate-105 border border-slate-200 rounded-3xl p-5 relative overflow-hidden h-[240px] flex flex-col justify-between shadow-2xs">
                      {/* Micro-marcas d'água */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-56 h-56 rounded-full border-4 border-indigo-900 flex items-center justify-center font-bold text-center text-xs">
                        REPÚBLICA DE ANGOLA
                      </div>
                      <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-yellow-300/10 to-indigo-500/10 rounded-full blur-xl pointer-events-none" />

                      {/* Top Header do Documento */}
                      <div className="flex items-start justify-between border-b pb-2 border-slate-200">
                        <div className="flex gap-2.5 items-center">
                          {/* Bandeira Mocked de Angola */}
                          <div className="w-6 h-4 bg-red-650 flex flex-col relative rounded-xs overflow-hidden border border-slate-200 flex-shrink-0">
                            <div className="h-1/2 bg-red-600" />
                            <div className="h-1/2 bg-black" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4px] text-yellow-500 font-extrabold">&bull;</div>
                          </div>
                          <div>
                            <span className="text-[7.5px] font-black text-indigo-950 uppercase tracking-wider block">República de Angola</span>
                            <span className="text-[6.5px] font-bold text-slate-400 uppercase block">Ministério da Justiça e Direitos Humanos</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[7.5px] font-black text-rose-600 bg-rose-50 border border-rose-100 p-0.5 px-1.5 rounded uppercase font-mono">B.I. Oficial</span>
                        </div>
                      </div>

                      {/* Dados Centrais do BI */}
                      <div className="grid grid-cols-3 gap-3 my-auto items-center">
                        {/* Foto do BI - com filtro impresso cinza */}
                        <div className="col-span-1 h-20 bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 relative shadow-3xs flex-shrink-0">
                          <img 
                            src={selectedReviewCitizen.facePhoto} 
                            alt="Rosto BI" 
                            className="w-full h-full object-cover filter grayscale contrast-125 brightness-95" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-indigo-950/10 mix-blend-color" />
                        </div>

                        {/* Dados textuais do civil */}
                        <div className="col-span-2 space-y-1 text-left text-[9px]">
                          <div>
                            <span className="text-[6.5px] text-slate-400 uppercase block font-bold leading-none">Nome Completo:</span>
                            <span className="font-extrabold text-slate-900 uppercase block text-[10px] tracking-tight">{selectedReviewCitizen.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[6.5px] text-slate-400 uppercase block font-bold leading-none">Nº B.I.:</span>
                              <span className="font-black text-slate-900 font-mono text-[9px] block">{selectedReviewCitizen.biNumber}</span>
                            </div>
                            <div>
                              <span className="text-[6.5px] text-slate-400 uppercase block font-bold leading-none font-sans">Nacionalidade:</span>
                              <span className="font-extrabold text-slate-800 uppercase block">Angolana</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[6.5px] text-slate-400 uppercase block font-bold leading-none">Província:</span>
                              <span className="font-extrabold text-slate-700 block text-[8px] uppercase">{selectedReviewCitizen.province}</span>
                            </div>
                            <div>
                              <span className="text-[6.5px] text-slate-400 uppercase block font-bold leading-none">Natural de:</span>
                              <span className="font-extrabold text-slate-700 block text-[8px] uppercase">{selectedReviewCitizen.municipio}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer do BI */}
                      <div className="border-t pt-1.5 border-slate-250 flex items-center justify-between text-[6.5px] font-mono text-slate-400 leading-none">
                        <span>EMISSÃO: 12/04/2024</span>
                        <span>VALIDADE: 12/04/2029</span>
                        <span className="font-bold text-slate-700">ASSINATURA DIGITAL SME</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 text-[10px] font-medium text-slate-500 uppercase tracking-tight flex items-center gap-2">
                      <IdCard size={14} className="text-slate-400" />
                      <span>Nome Declarado e BI Batem 100% com o Banco do Registo Civil Angolano.</span>
                    </div>
                  </div>

                  {/* Painel Direito: Captura de Face Ativa no Auto-Cadastro (HD e AnáliseIA) */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Painel Direito &bull; Captura Biométrica (Face)</span>
                    
                    <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-950/30 rounded-3xl p-5 h-[240px] relative overflow-hidden flex flex-col justify-between shadow-2xl text-white">
                      
                      {/* Efeitos de Reticulado / Scanning de Câmera */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_100%)]" />
                      
                      {/* Cantos holográficos da câmera de biometria */}
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-400 rounded-tl-sm" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-400 rounded-tr-sm" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-400 rounded-bl-sm" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br-sm" />

                      {/* Scanner Line animation */}
                      {aiEvaluationState === 'running' && (
                        <motion.div 
                          initial={{ y: 0 }}
                          animate={{ y: [0, 180, 0] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-md shadow-cyan-400/50 z-25 pointer-events-none"
                        />
                      )}

                      <div className="flex items-center justify-between z-15 relative">
                        <span className="text-[8px] font-mono font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/10 p-1 px-2.5 rounded-full border border-indigo-500/20">
                          Auto-Foto Biometria Ativa
                        </span>
                        <span className="text-[7.5px] font-mono text-slate-400 font-bold uppercase tracking-wider">FPS: 30 &bull; 1080P</span>
                      </div>

                      {/* Rosto do Cidadão no Centro com linhas de rastreamento se IA estiver ativa */}
                      <div className="relative w-24 h-24 mx-auto my-auto rounded-full border-2 border-indigo-400/60 overflow-hidden shadow-xl shadow-black/30 z-10">
                        <img 
                          src={selectedReviewCitizen.facePhoto} 
                          alt="Face HD" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        {aiEvaluationState === 'running' && (
                          <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                        )}
                        {/* Pontos de foco facial fictícios */}
                        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping pointer-events-none" />
                        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping pointer-events-none" />
                        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping pointer-events-none" />
                      </div>

                      <div className="text-center z-15 relative mt-1">
                        <span className="text-[9px] font-mono text-indigo-200 uppercase tracking-widest">
                          {aiEvaluationState === 'idle' ? 'Câmera Biométrica Pronta' :
                           aiEvaluationState === 'running' ? 'Executando Análise de Profundidade...' :
                           'Verificação Biométrica Concluída'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-indigo-950 text-white rounded-2xl p-3 text-[10px] font-medium uppercase tracking-tight flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint size={14} className="text-indigo-300" />
                        <span>Autenticação Facial Registada no CDA</span>
                      </div>
                      <span className="text-indigo-300 font-bold">ATIVA</span>
                    </div>
                  </div>

                </div>

                {/* Bloco de Batimento Inteligente por IA */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full pointer-events-none" />
                  
                  {aiEvaluationState === 'idle' && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-black text-indigo-950 uppercase tracking-tight">Efectuar Batimento de Biometria e Identidade Civil por IA</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-1">
                          Cruza as feições faciais do B.I. digitalizado com a selfie fornecida pelo auto-cadastro, analisando geometria facial, distância inter-pupilar e dados nominais via OCR.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAiEvaluationState('running');
                          // Simular tempo de carregamento de IA
                          setTimeout(() => {
                            setAiEvaluationState('completed');
                            // Gerar um match alto aleatório baseado no nome (geralmente alto para os pendentes normais)
                            const score = selectedReviewCitizen.id === 'u3' ? 98.2 : 97.5;
                            setAiMatchScore(score);
                            addAuditLog?.(`Inteligência Artificial: Prova de identidade de "${selectedReviewCitizen.name}" executada com ${score}% de fidedignidade facial.`, 'success');
                          }, 2500);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl cursor-pointer border-0 shadow-lg shadow-indigo-600/15 font-bold transition-all hover:scale-103"
                      >
                        <Scan size={14} className="inline mr-2 animate-spin-slow" /> Executar Batimento por IA
                      </button>
                    </div>
                  )}

                  {aiEvaluationState === 'running' && (
                    <div className="space-y-4 py-3">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="text-indigo-600 animate-spin" size={24} />
                        <span className="font-mono text-xs font-black text-indigo-900 uppercase tracking-widest">Processando Inteligência Artificial...</span>
                      </div>
                      
                      {/* Simulação de barra de progresso gov */}
                      <div className="w-full max-w-md mx-auto bg-slate-200 h-1.5 rounded-full overflow-hidden block">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.3 }}
                          className="bg-indigo-600 h-full rounded-full"
                        />
                      </div>
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-widest block font-mono">Executando mapeamento ocular, OCR e distância inter-nasal</span>
                    </div>
                  )}

                  {aiEvaluationState === 'completed' && aiMatchScore && (
                    <div className="space-y-3 animate-zoomIn">
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle2 size={24} />
                        <span className="text-sm font-black uppercase tracking-tight font-mono">Batimento de IA Concluído</span>
                      </div>
                      
                      {/* Placar de Correspondência */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-emerald-50 border border-emerald-100 p-3.5 px-8 rounded-2xl block text-center">
                          <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest block leading-none mb-1">SCORE DE CORRESPONDÊNCIA FACIAL</span>
                          <span className="text-3xl font-black text-emerald-700 font-mono italic leading-none">{aiMatchScore}%</span>
                        </div>
                      </div>

                      <div className="max-w-xl mx-auto space-y-1">
                        <p className="text-[10px] text-slate-800 font-black uppercase tracking-tight">Resultado da IA: Correspondência Altamente Confiável</p>
                        <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                          A imagem antropométrica facial é coincidente com a fotocópia do BI. Os dados extraídos via OCR conferem integralmente com os registos civis da base de dados CDA em Luanda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input de justificativa se estiver rejeitando */}
                {isRejecting && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 border border-red-150 bg-red-50/30 p-5 rounded-2xl text-left"
                  >
                    <label className="block text-[9px] font-black text-red-600 uppercase tracking-widest">Motivo de Rejeição do Cadastro *</label>
                    <textarea
                      required
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Ex: Divergência biométrica evidente ou nitidez deficiente no Bilhete de Identidade."
                      className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-red-400 transition-all font-semibold"
                      rows={3}
                    />
                  </motion.div>
                )}

              </div>

              {/* Ações de Decisão Administrativa (Footer do Modal) */}
              <div className="p-6 bg-slate-50 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">Agente Operacional Responsável:</span>
                  <span className="text-[10px] font-extrabold text-slate-800 uppercase block">Inspector de Identificação Civil do Estado</span>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReviewCitizen(null);
                    }}
                    className="px-5 py-3 bg-white border border-slate-205 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer font-bold w-full sm:w-auto text-center"
                  >
                    Cancelar / Sair
                  </button>

                  {/* Se for Pendente e avaliado (ou não avaliado, permitimos a aprovação também) */}
                  {selectedReviewCitizen.status === 'Pendente' && (
                    <>
                      {!isRejecting ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsRejecting(true);
                            setRejectionReason('Divergência de dados: Os dados dactiloscópicos ou imagem facial não estão de acordo com as regras.');
                          }}
                          className="px-5 py-3 bg-red-50 hover:bg-red-100 text-red-650 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer font-bold w-full sm:w-auto text-center border-0"
                        >
                          Sinalizar Pendência / Rejeitar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!rejectionReason.trim()) {
                              alert('Insira uma justificativa para a rejeição fiscal.');
                              return;
                            }
                            setCitizens(prev => prev.map(c => c.id === selectedReviewCitizen.id ? { 
                              ...c, 
                              status: 'Não Aprovado', 
                              reason: rejectionReason 
                            } : c));
                            addAuditLog?.(`Auditoria: Registo de "${selectedReviewCitizen.name}" REJEITADO do sistema CDA. Motivo: ${rejectionReason}`, 'critical');
                            setSelectedReviewCitizen(null);
                          }}
                          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer font-bold w-full sm:w-auto text-center border-0"
                        >
                          Confirmar Rejeição
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          // Se o agente aprova, muda para Aprovado e adiciona match score
                          const score = aiMatchScore || 98.4;
                          setCitizens(prev => prev.map(c => c.id === selectedReviewCitizen.id ? { 
                            ...c, 
                            status: 'Aprovado', 
                            verificationScore: score
                          } : c));
                          addAuditLog?.(`Auditoria: Cadastro do cidadão "${selectedReviewCitizen.name}" homologado e ativado biometricamente pelo agente Admin.`, 'success');
                          setSelectedReviewCitizen(null);
                        }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer font-bold block shadow-lg shadow-emerald-600/10 w-full sm:w-auto text-center border-0"
                      >
                        Aprovar Cadastro
                      </button>
                    </>
                  )}

                  {/* Se já estiver Aprovado ou Já Não Aprovado, podemos dar opção de Revogar ou Re-avaliar */}
                  {selectedReviewCitizen.status !== 'Pendente' && (
                    <button
                      type="button"
                      onClick={() => {
                        // Reverter para Pendente para reavaliação se necessário
                        setCitizens(prev => prev.map(c => c.id === selectedReviewCitizen.id ? { 
                          ...c, 
                          status: 'Pendente', 
                          reason: undefined,
                          verificationScore: undefined 
                        } : c));
                        addAuditLog?.(`Auditoria: Cadastro de "${selectedReviewCitizen.name}" reaberto para nova revisão e testes dactiloscópicos.`, 'info');
                        setSelectedReviewCitizen(null);
                      }}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer font-bold w-full sm:w-auto text-center border-0"
                    >
                      Reabrir para Revisão
                    </button>
                  )}

                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CENTRAL BRANDING STATUS FOOTER REMOVED */}

    </div>
  );
}
