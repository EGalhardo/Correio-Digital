import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Power, 
  Settings2, 
  Activity, 
  Shield, 
  Key, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Smartphone, 
  ArrowRight, 
  Share2, 
  Shuffle, 
  Landmark, 
  GitBranch, 
  FileText, 
  Check, 
  Plus, 
  HelpCircle,
  Clock,
  ExternalLink,
  Lock
} from 'lucide-react';

interface Organismo {
  id: string;
  name: string;
  desc: string;
  status: 'Ligado' | 'Manutenção' | 'Offline';
  protocol: string;
  token: string;
  type: string;
}

const INITIAL_ORGS: Organismo[] = [
  { id: 'agt', name: 'AGT', desc: 'Administração Geral Tributária', status: 'Ligado', protocol: 'SOAP/XML', token: 'AGT_KEY_v2_9901', type: 'Finanças/Tributos' },
  { id: 'ende', name: 'ENDE', desc: 'Empresa Nac. de Distribuição de Electricidade', status: 'Ligado', protocol: 'REST/JSON', token: 'ENDE_PROD_5511_B', type: 'Infraestrutura' },
  { id: 'epal', name: 'EPAL', desc: 'Empresa Pública de Águas de Luanda', status: 'Ligado', protocol: 'REST/JSON', token: 'EPAL_SEC_3310', type: 'Infraestrutura' },
  { id: 'bancos', name: 'BANCOS', desc: 'Banco de Poupança e Crédito & Bancos Privados', status: 'Ligado', protocol: 'REST/OAuth2', token: 'BANK_OAUTH_TOKEN_PROD', type: 'Finanças / Privado' },
  { id: 'ministerios', name: 'MINISTÉRIOS', desc: 'Ministérios da Justiça, Finanças & Saúde', status: 'Ligado', protocol: 'gRPC', token: 'GOV_MIN_SEC_8892', type: 'Governo' },
  { id: 'tribunais', name: 'TRIBUNAIS', desc: 'Tribunal Supremo & Tribunais de Comarca', status: 'Ligado', protocol: 'REST/JSON', token: 'TRIB_SUP_AUTH_KEY', type: 'Judiciário' },
  { id: 'hospitais', name: 'HOSPITAIS', desc: 'Hospital Geral de Luanda & Américo Boavida', status: 'Ligado', protocol: 'FHIR/JSON', token: 'HOSP_CLINICAL_9011', type: 'Saúde / Hospitalar' },
  { id: 'registo-civil', name: 'CIVIL', desc: 'Conservatória do Registo Civil de Luanda', status: 'Ligado', protocol: 'GraphQL', token: 'REG_CIVIL_MUTUAL_TLS', type: 'Registo Civil' }
];

interface ForwardingRule {
  id: string;
  source: string;
  target: string;
  docType: string;
  desc: string;
  active: boolean;
}

const INITIAL_FORWARDING: ForwardingRule[] = [
  { id: 'f1', source: 'AGT', target: 'MINISTÉRIOS', docType: 'Declaração de Isenção', desc: 'Envio automático de regularidade fiscal para assessoria jurídica do MINFIN.', active: true },
  { id: 'f2', source: 'CIVIL', target: 'TRIBUNAIS', docType: 'Certidão de Óbito', desc: 'Atualização eletrónica de óbitos no sistema de processos judiciais ativos.', active: true },
  { id: 'f3', source: 'HOSPITAIS', target: 'CIVIL', docType: 'Notificação de Nascimento', desc: 'Remessa de declarações de nascimento hospitalares para registo civil simplificado.', active: true },
  { id: 'f4', source: 'BANCOS', target: 'AGT', docType: 'Validação de Saldo/Retenções', desc: 'Processamento de alíquotas de imposto sobre rendimentos sob aprovação judicial.', active: false }
];

interface SharingConsent {
  id: string;
  citizenName: string;
  citizenBi: string;
  entity: string;
  scope: string;
  expires: string;
  status: 'Ativo' | 'Suspenso';
}

const INITIAL_SHARING_CONSENTS: SharingConsent[] = [
  { id: 's1', citizenName: 'Edlasio Galhardo', citizenBi: '009874562LA041', entity: 'Banco BAI', scope: 'NIF & Provimento de Renda', expires: '30/12/2026', status: 'Ativo' },
  { id: 's2', citizenName: 'Maria Antónia', citizenBi: '008812342LA011', entity: 'ENDE', scope: 'Atestado de Residência Multilateral', expires: '15/10/2026', status: 'Ativo' },
  { id: 's3', citizenName: 'José Kalunga', citizenBi: '007712342LA021', entity: 'EPAL', scope: 'Comprovativo de Inscrição Predial', expires: 'Permanente', status: 'Suspenso' }
];

interface InteropLog {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  operation: string;
  status: 'success' | 'warning' | 'error';
  payload: string;
}

const INITIAL_LOGS: InteropLog[] = [
  { id: 'log-1', timestamp: '09:05:32', source: 'HOSPITAIS', target: 'CIVIL', operation: 'SEND_BIRTH_NOTIF', status: 'success', payload: 'Notificação de Parto #99812 encaminhada à Conservatória com sucesso.' },
  { id: 'log-2', timestamp: '08:44:11', source: 'BANCOS', target: 'AGT', operation: 'GET_TAX_PAYER_STATUS', status: 'success', payload: 'Consulta de idoneidade de NIF para crédito habitação Banco BAI aprovada.' },
  { id: 'log-3', timestamp: '08:21:05', source: 'EPAL', target: 'CIVIL', operation: 'VERIFY_ADDRESS_DEED', status: 'success', payload: 'Confirmação de logradouro residencial efetuada com cruzamento de dados civis.' },
  { id: 'log-4', timestamp: '07:55:50', source: 'TRIBUNAIS', target: 'CIVIL', operation: 'QUERY_CIVIL_RECORD', status: 'success', payload: 'Requisição de averbamento de óbito do processo judicial #2026-F9 concluído.' },
  { id: 'log-5', timestamp: '07:12:03', source: 'ENDE', target: 'AGT', operation: 'SYNC_ELECTRONIC_BILLING', status: 'warning', payload: 'Latência incomum (220ms) na resposta do barramento ao reportar fatura eletrónica.' },
  { id: 'log-6', timestamp: '06:30:15', source: 'MINISTÉRIOS', target: 'TRIBUNAIS', operation: 'DECREE_PUBLISH_CALLBACK', status: 'success', payload: 'Sincronização de portaria de provimento do Tribunal de Contas homologada.' }
];

interface MultiInstitutionFlow {
  id: string;
  name: string;
  description: string;
  steps: {
    institution: string;
    action: string;
    status: 'Concluído' | 'Pendente' | 'Aguardando';
  }[];
}

const INITIAL_FLOWS: MultiInstitutionFlow[] = [
  {
    id: 'flow-empresa',
    name: 'Abertura de Empresa Simplificada',
    description: 'Fluxo em cadeia para constituição jurídica de sociedade e regularização fiscal com ativação bancária.',
    steps: [
      { institution: 'CIVIL', action: 'Registo provisório de Firma Comercial', status: 'Concluído' },
      { institution: 'AGT', action: 'Geração imediata de NIF de Pessoa Coletiva', status: 'Concluído' },
      { institution: 'BANCOS', action: 'Abertura de conta societária e depósito de Capital Social', status: 'Pendente' },
      { institution: 'MINISTÉRIOS', action: 'Publicação gratuita no Diário da República Eletrónico', status: 'Aguardando' }
    ]
  },
  {
    id: 'flow-habitacao',
    name: 'Fornecimento de Serviços Urbanos de Habitação',
    description: 'Processo multi-institucional para interligar escritura, contador de eletricidade e abastecimento sob BI unificado.',
    steps: [
      { institution: 'CIVIL', action: 'Escritura predial unificada e propriedade civil', status: 'Concluído' },
      { institution: 'ENDE', action: 'Ligação e parametrização do contador de energia', status: 'Pendente' },
      { institution: 'EPAL', action: 'Instalação de ramal e contrato de água integrado', status: 'Aguardando' }
    ]
  },
  {
    id: 'flow-falecimento',
    name: 'Gestão Consolidada de Atos de Sucessão',
    description: 'Roteamento seguro para partilha de bens, inventário judicial, alteração fiscal e liquidação de herança.',
    steps: [
      { institution: 'HOSPITAIS', action: 'Auto de declaração de óbito clínico eletrónico', status: 'Concluído' },
      { institution: 'CIVIL', action: 'Lavratura de certidão de óbito oficial e comunicação', status: 'Concluído' },
      { institution: 'TRIBUNAIS', action: 'Abertura e homologação de inventário hereditário', status: 'Pendente' },
      { institution: 'BANCOS', action: 'Transmissão e desinvestimento de saldos para herdeiros', status: 'Aguardando' }
    ]
  }
];

interface GovInteroperabilidadeContentProps {
  onLog?: (action: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export function GovInteroperabilidadeContent({ onLog }: GovInteroperabilidadeContentProps) {
  const [currentTab, setCurrentTab] = useState<'barramento' | 'encaminhamento' | 'compartilhamento' | 'fluxos' | 'historico'>('barramento');
  
  // App states with LocalStorage persistence where matching
  const [orgs, setOrgs] = useState<Organismo[]>(() => {
    const saved = localStorage.getItem('gov_interop_orgs_v2');
    return saved ? JSON.parse(saved) : INITIAL_ORGS;
  });

  const [forwardingRules, setForwardingRules] = useState<ForwardingRule[]>(() => {
    const saved = localStorage.getItem('gov_interop_forwarding');
    return saved ? JSON.parse(saved) : INITIAL_FORWARDING;
  });

  const [sharingRules, setSharingRules] = useState<SharingConsent[]>(() => {
    const saved = localStorage.getItem('gov_interop_sharing');
    return saved ? JSON.parse(saved) : INITIAL_SHARING_CONSENTS;
  });

  const [logs, setLogs] = useState<InteropLog[]>(() => {
    const saved = localStorage.getItem('gov_interop_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [flows, setFlows] = useState<MultiInstitutionFlow[]>(() => {
    const saved = localStorage.getItem('gov_interop_flows');
    return saved ? JSON.parse(saved) : INITIAL_FLOWS;
  });

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string, status: 'success' | 'error', log: string } | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organismo | null>(null);

  // Flow simulation running state
  const [simulatingFlowId, setSimulatingFlowId] = useState<string | null>(null);

  // New Forwarding Rule Form State
  const [newRuleSource, setNewRuleSource] = useState('AGT');
  const [newRuleTarget, setNewRuleTarget] = useState('MINISTÉRIOS');
  const [newRuleDocType, setNewRuleDocType] = useState('Declaração');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  
  // New Sharing Rule Form State
  const [newShareCitizen, setNewShareCitizen] = useState('');
  const [newShareBi, setNewShareBi] = useState('');
  const [newShareEntity, setNewShareEntity] = useState('Banco BAI');
  const [newShareScope, setNewShareScope] = useState('NIF, BI e Certidões');

  // Syncing states to localStorage
  useEffect(() => {
    localStorage.setItem('gov_interop_orgs_v2', JSON.stringify(orgs));
  }, [orgs]);

  useEffect(() => {
    localStorage.setItem('gov_interop_forwarding', JSON.stringify(forwardingRules));
  }, [forwardingRules]);

  useEffect(() => {
    localStorage.setItem('gov_interop_sharing', JSON.stringify(sharingRules));
  }, [sharingRules]);

  useEffect(() => {
    localStorage.setItem('gov_interop_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('gov_interop_flows', JSON.stringify(flows));
  }, [flows]);

  // Actions
  const toggleStatus = (id: string) => {
    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        const statuses: Organismo['status'][] = ['Ligado', 'Manutenção', 'Offline'];
        const currentIndex = statuses.indexOf(org.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        
        onLog?.(`Interoperabilidade: ${org.name} alterado para ${nextStatus}`, nextStatus === 'Ligado' ? 'success' : 'warning');
        
        // Add log entry
        const newLog: InteropLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-AO'),
          source: 'CDA-GATEWAY',
          target: org.name,
          operation: 'STATUS_TOGGLE',
          status: nextStatus === 'Ligado' ? 'success' : nextStatus === 'Manutenção' ? 'warning' : 'error',
          payload: `Operador alterou o status administrativo da interface do organismo ${org.desc} para ${nextStatus}.`
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);

        return { ...org, status: nextStatus };
      }
      return org;
    }));
  };

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTestResult(null);
    
    setTimeout(() => {
      const org = orgs.find(o => o.id === id);
      const isOk = org?.status === 'Ligado';
      setTestingId(null);
      
      setTestResult({
        id,
        status: isOk ? 'success' : 'error',
        log: isOk 
          ? `Status 200 OK - Acordo de Interoperabilidade estabelecido de forma segura via protocolo ${org.protocol}.`
          : `Falha Crítica - Erro de ligação SOAP/REST timout. Organismo ${org?.name} está atualmente em estado ${org?.status}.`
      });

      // Add log
      const newLog: InteropLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-AO'),
        source: 'CDA-GATEWAY',
        target: org?.name || 'DESCONHECIDO',
        operation: 'LINK_TEST',
        status: isOk ? 'success' : 'error',
        payload: isOk 
          ? `Verificação de link bem-sucedida para ${org?.desc} utilizando protocolo ${org?.protocol}. Chave validada.` 
          : `Erro de handshake com ${org?.desc}. Diagnóstico: Conexão interrompida pelo barramento principal.`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);

      if (isOk) {
        onLog?.(`Ligação estável verificada com sucesso para ${org?.name}`, 'success');
      } else {
        onLog?.(`Falha na ligação com ${org?.name}: o canal está ${org?.status}`, 'critical');
      }
    }, 1500);
  };

  const handleSaveToken = (id: string, newToken: string) => {
    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        onLog?.(`Token de integração ${org.name} atualizado com novas credenciais`, 'info');
        
        const newLog: InteropLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-AO'),
          source: 'CDA-GATEWAY',
          target: org.name,
          operation: 'ROTATE_SECRET_TOKEN',
          status: 'success',
          payload: `Chave criptográfica do organismo ${org.name} rotacionada com novas diretrizes de autenticidade.`
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);

        return { ...org, token: newToken };
      }
      return org;
    }));
    setEditingOrg(null);
  };

  // Toggle forwarding rule state
  const toggleForwarding = (id: string) => {
    setForwardingRules(prev => prev.map(rule => {
      if (rule.id === id) {
        const nextState = !rule.active;
        onLog?.(`Regra de Encaminhamento ${rule.source}➔${rule.target} ${nextState ? 'activada' : 'desactivada'}`, 'info');

        const newLog: InteropLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-AO'),
          source: rule.source,
          target: rule.target,
          operation: nextState ? 'ROUTING_RULE_ENABLE' : 'ROUTING_RULE_DISABLE',
          status: 'success',
          payload: `Roteamento de documentos do tipo '${rule.docType}' foi ${nextState ? 'ativado' : 'retirado'}.`
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);

        return { ...rule, active: nextState };
      }
      return rule;
    }));
  };

  // Add new forwarding rule
  const handleAddForwardingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleDesc.trim()) return;

    const newRule: ForwardingRule = {
      id: `f-${Date.now()}`,
      source: newRuleSource,
      target: newRuleTarget,
      docType: newRuleDocType,
      desc: newRuleDesc,
      active: true
    };

    setForwardingRules(prev => [...prev, newRule]);
    setNewRuleDesc('');
    onLog?.(`Novo roteamento interno criado entre ${newRuleSource} e ${newRuleTarget}.`, 'success');

    // Add log
    const newLog: InteropLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-AO'),
      source: newRuleSource,
      target: newRuleTarget,
      operation: 'ROUTING_RULE_CREATE',
      status: 'success',
      payload: `Criada nova regra automática: documentos do tipo "${newRuleDocType}" encaminhados directamente.`
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // Toggle sharing consent state
  const toggleSharingConsent = (id: string) => {
    setSharingRules(prev => prev.map(rule => {
      if (rule.id === id) {
        const nextStatus = rule.status === 'Ativo' ? 'Suspenso' : 'Ativo';
        onLog?.(`Consentimento de partilha unificada para ${rule.citizenName} foi ${nextStatus === 'Ativo' ? 'reativado' : 'suspenso'}.`, 'warning');

        const newLog: InteropLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-AO'),
          source: 'CDA-CONSENT-DESK',
          target: rule.entity,
          operation: nextStatus === 'Ativo' ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
          status: nextStatus === 'Ativo' ? 'success' : 'warning',
          payload: `Acesso a dados (${rule.scope}) do cidadão BI ${rule.citizenBi} para ${rule.entity} alterado para ${nextStatus}.`
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);

        return { ...rule, status: nextStatus };
      }
      return rule;
    }));
  };

  // Add new sharing consent
  const handleAddSharingConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShareCitizen.trim() || !newShareBi.trim()) return;

    const newShare: SharingConsent = {
      id: `s-${Date.now()}`,
      citizenName: newShareCitizen,
      citizenBi: newShareBi,
      entity: newShareEntity,
      scope: newShareScope,
      expires: '31/12/2026',
      status: 'Ativo'
    };

    setSharingRules(prev => [...prev, newShare]);
    setNewShareCitizen('');
    setNewShareBi('');
    onLog?.(`Compartilhamento autorizado para ${newShareCitizen} registado com sucesso.`, 'success');

    const newLog: InteropLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-AO'),
      source: 'CDA-CONSENT-DESK',
      target: newShareEntity,
      operation: 'CONSENT_REGISTERED',
      status: 'success',
      payload: `Nova autorização expressa para ${newShareEntity} aceder a dados fiscais e civis de BI ${newShareBi}.`
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // Execute multi-institutional flow simulation
  const handleExecuteFlowSimulation = (flowId: string) => {
    setSimulatingFlowId(flowId);
    onLog?.(`Iniciando execução em cadeia de fluxo cooperativo: ${flowId.toUpperCase()}`, 'info');

    // Simulate stepping through institutions
    setTimeout(() => {
      setFlows(prevFlows => prevFlows.map(flow => {
        if (flow.id === flowId) {
          // Advance peding steps to Concluído
          const updatedSteps = flow.steps.map((step, idx) => {
            if (step.status === 'Pendente') {
              return { ...step, status: 'Concluído' as const };
            }
            if (step.status === 'Aguardando' && idx === flow.steps.findIndex(s => s.status === 'Pendente') + 1) {
              return { ...step, status: 'Pendente' as const };
            }
            return step;
          });

          // Log step completion
          const currentPendingStep = flow.steps.find(s => s.status === 'Pendente');
          const nextLog: InteropLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-AO'),
            source: 'SYSTEM_FLOW_ORCHESTRATOR',
            target: currentPendingStep?.institution || 'MULTIPLOS',
            operation: 'FLOW_STEP_COMPLETED',
            status: 'success',
            payload: `Barramento interoperável concluiu etapa de integração "${currentPendingStep?.action}" no fluxo ${flow.name}.`
          };
          setLogs(prevLogs => [nextLog, ...prevLogs]);
          
          return { ...flow, steps: updatedSteps };
        }
        return flow;
      }));

      setSimulatingFlowId(null);
      onLog?.(`Fase de fluxo multi-institucional automatizado atualizada com sucesso.`, 'success');
    }, 2000);
  };

  // Reset flows state to initial presets (utility for testing)
  const handleResetFlows = () => {
    setFlows(INITIAL_FLOWS);
    onLog?.(`Fluxos cooperativos repostos ao estado inicial de simulação.`, 'info');
  };

  return (
    <div className="pb-32 md:pt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 border-2 border-emerald-500">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Interoperabilidade</h1>
            <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
               <div className="w-1 h-3 bg-emerald-500 rounded-full" />
               Barramento Governamental & Cooperação Privada
            </div>
          </div>
        </div>

        {/* Global Stats indicators */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[20px] border border-slate-100 self-start md:self-auto">
          <div className="text-left px-3">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Acordos de Rede</div>
            <div className="text-lg font-black text-slate-800">{orgs.filter(o => o.status === 'Ligado').length}/{orgs.length} <span className="text-emerald-500 text-xs">OK</span></div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-left px-3">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Tráfego Ativo</div>
            <div className="text-lg font-black text-emerald-600">99.7% <span className="text-[9px] font-bold text-slate-400">DISP</span></div>
          </div>
        </div>
      </div>

      {/* Internal Ribbon Styling sub-navigation tabs (Strictly styled, no visuals broken) */}
      <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-slate-100 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
        {[
          { id: 'barramento', label: 'Barramento Activo', icon: Landmark, count: orgs.length },
          { id: 'encaminhamento', label: 'Encaminhamento Interno', icon: Shuffle, count: forwardingRules.length },
          { id: 'compartilhamento', label: 'Partilha Autorizada', icon: Users, count: sharingRules.length },
          { id: 'fluxos', label: 'Fluxos de Rede', icon: GitBranch, count: flows.length },
          { id: 'historico', label: 'Histórico Institucional', icon: Clock, count: logs.length }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setCurrentTab(t.id as any);
                setTestResult(null);
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.08em] transition-all border ${
                isActive 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/10' 
                  : 'bg-white border-slate-100 text-slate-600 hover:text-slate-900 hover:border-slate-200'
              }`}
            >
              <Icon size={14} />
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-50 text-slate-400'
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT */}
      <div className="space-y-10">

        {/* TAB 1: Core Gateway Interop status */}
        {currentTab === 'barramento' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-8 rounded-[40px] text-white border border-slate-800 shadow-2xl shadow-slate-950/20 relative overflow-hidden">
               <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12 select-none">
                 <Landmark size={280} />
               </div>
               
               <div className="max-w-xl relative shrink-0">
                  <span className="text-[9px] font-black bg-emerald-700/60 uppercase tracking-[0.3em] px-3 py-1 rounded border border-emerald-500/30">CANAL SEGURO CDA V4</span>
                  <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mt-4 leading-none">Canal Único de Conetividade</h2>
                  <p className="text-slate-300 font-medium text-xs mt-3 leading-relaxed">
                    Sincronização robusta em barramento seguro das bases cadastrais angolanas. O protocolo assegura a troca bilateral de informações sensíveis sem necessidade de integração ponto-a-ponto tradicional.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-5 mt-6 font-mono text-[10px] font-black text-emerald-300">
                    <div className="flex items-center gap-2">
                       <Shield size={14} className="text-emerald-400" />
                       AUDITORIA COMPLETA
                    </div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <div className="flex items-center gap-2">
                       <Key size={14} className="text-emerald-400" />
                       TLS MÚTUO ATIVO
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              {orgs.map((org) => (
                <motion.div 
                  key={org.id}
                  layoutId={org.id}
                  className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-100 transition-all flex flex-col gap-6 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center font-black text-xl text-slate-950 shadow-inner group-hover:scale-110 transition-all border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 uppercase">
                        {org.name}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 uppercase tracking-widest px-2 py-0.5 rounded">
                            {org.type}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-lg md:text-xl italic tracking-tighter uppercase mt-2 leading-none">{org.desc}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">PROTOCOLO: {org.protocol}</span>
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
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleTestConnection(org.id)}
                      disabled={testingId !== null}
                      className="flex-1 bg-slate-50 text-slate-600 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-slate-100"
                    >
                      {testingId === org.id ? <RefreshCw size={16} className="animate-spin" /> : <Activity size={16} />}
                      Testar Ligação
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
                            <div className="text-[10px] font-black uppercase tracking-widest mb-1">{testResult.status === 'success' ? 'Sincronização Ativa' : 'Falha no Barramento'}</div>
                            <span className="text-[11px] font-bold leading-relaxed italic">{testResult.log}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Encaminhamento Interno */}
        {currentTab === 'encaminhamento' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form Column - Left banner layout matching original styling */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-950 p-8 rounded-[40px] text-white border border-slate-900 shadow-xl space-y-6">
                <div>
                  <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.2em] px-2.5 py-1 rounded">ROTEAMENTO INTERNO</span>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mt-4 leading-none">Novas Regras de Direcionamento</h3>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">
                     Configure caminhos lógicos para encaminhar dados de certidões, isenções e NIFs em tempo de execução para os departamentos internos cabíveis.
                  </p>
                </div>

                <form onSubmit={handleAddForwardingRule} className="space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Origem do Fluxo (Organismo)</label>
                    <select 
                      value={newRuleSource}
                      onChange={(e) => setNewRuleSource(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    >
                      {orgs.map(o => <option key={o.id} value={o.name}>{o.desc} ({o.name})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Destino / Encaminhamento</label>
                    <select 
                      value={newRuleTarget}
                      onChange={(e) => setNewRuleTarget(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    >
                      {orgs.map(o => <option key={o.id} value={o.name}>{o.desc} ({o.name})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Trâmite de Documento</label>
                    <input 
                      type="text" 
                      value={newRuleDocType}
                      onChange={(e) => setNewRuleDocType(e.target.value)}
                      placeholder="Ex: Certidão Predial Digital"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Regulamentar do Encaminhamento</label>
                    <textarea 
                      value={newRuleDesc}
                      onChange={(e) => setNewRuleDesc(e.target.value)}
                      placeholder="Indique a utilidade ou ato de estado associado..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-medium"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 text-white p-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20"
                  >
                    <Plus size={14} /> Ativar Rota Automática
                  </button>
                </form>
              </div>
            </div>

            {/* List Column - Right side 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none text-slate-900">Regras de Encaminhamento Ativas</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Controlo de Redirecionamentos Internos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {forwardingRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className={`p-6 rounded-[28px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        rule.active ? 'bg-slate-50 border-slate-100 hover:border-indigo-100' : 'bg-slate-50/50 border-slate-100/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-xs text-slate-800">
                          {rule.source}
                        </div>
                        
                        <div className="flex items-center justify-center w-8 h-12 text-slate-400">
                          <ArrowRight size={16} className="animate-pulse" />
                        </div>

                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-xs text-slate-800">
                          {rule.target}
                        </div>

                        <div className="space-y-1 ml-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 uppercase tracking-wider">
                              {rule.docType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-bold leading-relaxed mt-1">{rule.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                        <button 
                          onClick={() => toggleForwarding(rule.id)}
                          className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                            rule.active 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {rule.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Compartilhamento Autorizado */}
        {currentTab === 'compartilhamento' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-950 p-8 rounded-[40px] text-white border border-slate-900 shadow-xl space-y-6">
                <div>
                  <span className="text-[8px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-[0.2em] px-2.5 py-1 rounded">MECANISMO DE CONSENTIMENTO</span>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mt-4 leading-none">Novas Permissões</h3>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">
                     Emita uma nova simulação de consentimento unificado pelo cidadão. Isso autoriza o consumo legítimo de dados nos termos do regulamento de identificação digital.
                  </p>
                </div>

                <form onSubmit={handleAddSharingConsent} className="space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Cidadão</label>
                    <input 
                      type="text" 
                      value={newShareCitizen}
                      onChange={(e) => setNewShareCitizen(e.target.value)}
                      placeholder="Ex: Edlasio Galhardo"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Número do Bilhete de Identidade (BI)</label>
                    <input 
                      type="text" 
                      value={newShareBi}
                      onChange={(e) => setNewShareBi(e.target.value)}
                      placeholder="Ex: 009874562LA041"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Entidade Autorizada</label>
                    <select 
                      value={newShareEntity}
                      onChange={(e) => setNewShareEntity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    >
                      <option value="Banco BAI">Banco BAI</option>
                      <option value="Banco BFA">Banco BFA</option>
                      <option value="ENDE">ENDE</option>
                      <option value="EPAL">EPAL</option>
                      <option value="Hospital Geral de Luanda">Hospital Geral de Luanda</option>
                      <option value="Ministério das Finanças">Ministério das Finanças</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Âmbito de Consulta Autorizada</label>
                    <input 
                      type="text" 
                      value={newShareScope}
                      onChange={(e) => setNewShareScope(e.target.value)}
                      placeholder="Ex: NIF, Certidão Digital, IPU"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600 font-bold"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/20"
                  >
                    <Plus size={14} /> Registar Consentimento Expresso
                  </button>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none text-slate-900">Autorizações & Partilha de Dados Unificados</h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Matriz de Compartilhamento Legítimo sob Consentimento RGPD/CDA</p>
                </div>

                <div className="space-y-4">
                  {sharingRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className={`p-6 rounded-[28px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        rule.status === 'Ativo' ? 'bg-slate-50 border-slate-100 hover:border-emerald-100' : 'bg-slate-50/40 border-slate-100/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                          rule.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50/50 text-red-500 border border-red-100'
                        }`}>
                          <Lock size={18} />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{rule.citizenName}</span>
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-black">BI: {rule.citizenBi}</span>
                          </div>
                          
                          <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            Autorizou <span className="text-slate-900">{rule.entity}</span> a ler dados de: <span className="text-indigo-600 italic">{rule.scope}</span>
                          </p>

                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                             <Clock size={12} />
                             Validade: {rule.expires}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button 
                          onClick={() => toggleSharingConsent(rule.id)}
                          className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                            rule.status === 'Ativo' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                              : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                          }`}
                        >
                          {rule.status === 'Ativo' ? 'Ativo / Revogar' : 'Suspenso / Ativar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Fluxos Multi-institucionais */}
        {currentTab === 'fluxos' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none text-slate-900">Fluxos Multi-institucionais Ativos</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Orquestração em Tempo Real de Atos Interinstitucionais</p>
              </div>
              <button 
                onClick={handleResetFlows}
                className="bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Repor Simulação
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {flows.map((flow) => {
                const isSimulating = simulatingFlowId === flow.id;
                const nextStepIndex = flow.steps.findIndex(s => s.status === 'Pendente');
                const isComplete = !flow.steps.some(s => s.status !== 'Concluído');

                return (
                  <div 
                    key={flow.id}
                    className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-100/50 transition-all h-full"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border-2 ${
                          isComplete 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse'
                        }`}>
                          {isComplete ? 'Totalmente Concluído' : 'Processamento Ativo'}
                        </span>
                        
                        <div className="text-slate-300">
                          <GitBranch size={20} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-black text-slate-900 text-lg italic tracking-tighter uppercase leading-snug">{flow.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{flow.description}</p>
                      </div>

                      {/* Visual Timeline Steps */}
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        {flow.steps.map((step, idx) => {
                          return (
                            <div key={idx} className="flex gap-4 relative">
                              {/* Connection line */}
                              {idx < flow.steps.length - 1 && (
                                <div className={`absolute top-6 left-3 w-0.5 h-10 ${
                                  step.status === 'Concluído' ? 'bg-emerald-400' : 'bg-slate-200'
                                }`} />
                              )}

                              <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-black text-[9px] border shadow-sm shrink-0 mt-0.5 ${
                                step.status === 'Concluído' ? 'bg-emerald-500 border-emerald-400 text-white' :
                                step.status === 'Pendente' ? 'bg-amber-400 border-amber-300 text-slate-900 animate-pulse' :
                                'bg-white border-slate-100 text-slate-400'
                              }`}>
                                {step.status === 'Concluído' ? <Check size={10} strokeWidth={3} /> : idx + 1}
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono font-black text-slate-800 uppercase tracking-widest">{step.institution}</span>
                                  <span className={`w-1 h-3 rounded-full ${
                                    step.status === 'Concluído' ? 'bg-emerald-600' :
                                    step.status === 'Pendente' ? 'bg-amber-500' : 'bg-slate-200'
                                  }`} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 italic block">{step.action}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-slate-50">
                      <button
                        onClick={() => handleExecuteFlowSimulation(flow.id)}
                        disabled={isSimulating || isComplete}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 active:scale-95 ${
                          isComplete 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200/50' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/10'
                        }`}
                      >
                        {isSimulating ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Sincronizando Barramento...
                          </>
                        ) : isComplete ? (
                          'Fluxo Consolidado'
                        ) : (
                          <>
                            <ExternalLink size={14} />
                            Despachar Próxima Etapa
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: Histórico Institucional */}
        {currentTab === 'historico' && (
          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none text-slate-900">Histórico de Transações do Barramento</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Log Auditável de Permuta e Acesso a Dados entre Instituições</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500">
                <Shield size={12} className="text-emerald-500 text-xs shrink-0" />
                <span>VERIFICAÇÃO DE ENVELOPE SEGURO CRIPTOGRÁFICO ATIVA</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 pb-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 pl-3">Hora</th>
                    <th className="pb-3">Agente Emissor</th>
                    <th className="pb-3">Agente Receptor</th>
                    <th className="pb-3">Diretiva / Evento</th>
                    <th className="pb-3">Status Rota</th>
                    <th className="pb-3 pr-3 text-right">Envelope JSON / Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="text-xs hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-3 font-mono font-bold text-[10px] text-slate-400">{log.timestamp}</td>
                      <td className="py-4">
                        <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded text-[10px] tracking-tight uppercase">
                          {log.source}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded text-[10px] tracking-tight uppercase">
                          {log.target}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-slate-900 block">{log.operation}</span>
                        <span className="text-[11px] text-slate-500 italic font-medium leading-relaxed block mt-0.5">{log.payload}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          log.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          log.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'success' ? 'bg-emerald-500' :
                            log.status === 'warning' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} />
                          {log.status === 'success' ? 'Sucesso' : log.status === 'warning' ? 'Latência' : 'Erro Link'}
                        </span>
                      </td>
                      <td className="py-4 pr-3 text-right font-mono text-[9px] text-slate-400">
                        {log.id.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
              <div className="bg-slate-950 p-10 text-white relative animate-fade">
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
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Criptografia do Barramento</div>
                      <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Integração {editingOrg.name}</h2>
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-6">
                   <label className="block">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                         Chave Secreta de Acesso Operacional (Token TLS-JWT)
                      </span>
                      <div className="relative mt-3">
                        <Key size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          defaultValue={editingOrg.token}
                          id="token-input"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-13 pr-5 py-5 font-mono text-xs text-slate-900 outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-bold"
                        />
                      </div>
                   </label>

                   <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4 italic shadow-sm">
                      <Shield size={24} className="text-amber-600 shrink-0 mt-1" />
                      <p className="text-[10px] text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
                        Protocolo de Segurança Crítica: Atualizar esta chave exige recalibração de certificado digital local do barramento de interoperabilidade.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => {
                      const input = document.getElementById('token-input') as HTMLInputElement;
                      handleSaveToken(editingOrg.id, input.value);
                    }}
                    className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-150 hover:-translate-y-1 active:scale-95"
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
