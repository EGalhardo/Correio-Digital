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
  Lock,
  MapPin,
  Building2,
  ChevronDown,
  SlidersHorizontal
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

interface Agency {
  id: string;
  name: string;
  institution: string;
  province: string;
  municipio: string;
  address: string;
  contact: string;
  status: 'Ativa' | 'Manutenção' | 'Offline';
  institutionalId?: string;
}

const MUNICIPALITIES_BY_PROVINCE: { [key: string]: string[] } = {
  'Todas': ['Todos'],
  'Luanda': ['Todos', 'Viana', 'Belas', 'Cazenga', 'Cacuaco', 'Luanda', 'Talatona', 'Kilamba Kiaxi', 'Maianga', 'Rangel', 'Ingombota'],
  'Benguela': ['Todos', 'Benguela', 'Lobito', 'Catumbela', 'Baía Farta'],
  'Huíla': ['Todos', 'Lubango', 'Chibia', 'Humpata', 'Caconda'],
  'Cabinda': ['Todos', 'Cabinda', 'Cacongo', 'Buco-Zau'],
  'Bengo': ['Todos', 'Dande', 'Ambriz', 'Nambuangongo'],
  'Huambo': ['Todos', 'Huambo', 'Caála', 'Bailundo']
};

const INITIAL_AGENCIES: Agency[] = [
  // AGT
  { id: 'a1', name: 'Repartição Fiscal de Luanda', institution: 'AGT', province: 'Luanda', municipio: 'Luanda', address: 'Rua Rainha Ginga, Baixa de Luanda', contact: '+244 923 100 001', status: 'Ativa' },
  { id: 'a2', name: 'Posto Aduaneiro do Porto de Luanda', institution: 'AGT', province: 'Luanda', municipio: 'Ingombota', address: 'Zona Portuária de Luanda', contact: '+244 923 100 002', status: 'Ativa' },
  { id: 'a3', name: 'Repartição de Benguela', institution: 'AGT', province: 'Benguela', municipio: 'Benguela', address: 'Rua Manuel de Abreu', contact: '+244 923 100 003', status: 'Ativa' },
  { id: 'a4', name: 'Posto Fiscal do Lobito', institution: 'AGT', province: 'Benguela', municipio: 'Lobito', address: 'Avenida da Independência', contact: '+244 923 100 004', status: 'Ativa' },
  { id: 'a5', name: 'Repartição Fiscal de Caxito', institution: 'AGT', province: 'Bengo', municipio: 'Dande', address: 'Avenida Principal de Caxito', contact: '+244 923 100 005', status: 'Ativa' },
  { id: 'a6', name: 'Repartição Fiscal do Huambo', institution: 'AGT', province: 'Huambo', municipio: 'Huambo', address: 'Largo dr. António Agostinho Neto', contact: '+244 923 100 006', status: 'Ativa' },
  { id: 'a7', name: 'Delegação Aduaneira de Cabinda', institution: 'AGT', province: 'Cabinda', municipio: 'Cabinda', address: 'Rua do Porto de Cabinda', contact: '+244 923 100 007', status: 'Ativa' },
  { id: 'a8', name: 'Posto Fiscal de Lubango', institution: 'AGT', province: 'Huíla', municipio: 'Lubango', address: 'Avenida Agostinho Neto, Lubango', contact: '+244 923 100 008', status: 'Ativa' },

  // SME
  { id: 'sme1', name: 'Direção Nacional do SME', institution: 'SME', province: 'Luanda', municipio: 'Maianga', address: 'Rua do Comércio, Luanda', contact: '+244 924 200 001', status: 'Ativa' },
  { id: 'sme2', name: 'Posto de Atendimento do SME Viana', institution: 'SME', province: 'Luanda', municipio: 'Viana', address: 'Estrada de Catete, Km 14', contact: '+244 924 200 002', status: 'Ativa' },
  { id: 'sme3', name: 'Delegação de SME do Lobito', institution: 'SME', province: 'Benguela', municipio: 'Lobito', address: 'Zona Comercial do Lobito', contact: '+244 924 200 003', status: 'Ativa' },
  { id: 'sme4', name: 'Posto de Fronteira do Aeroporto', institution: 'SME', province: 'Luanda', municipio: 'Luanda', address: 'Aeroporto 4 de Fevereiro', contact: '+244 924 200 004', status: 'Ativa' },
  { id: 'sme5', name: 'Delegação Provincial do Huambo', institution: 'SME', province: 'Huambo', municipio: 'Huambo', address: 'Centro Cívico do Huambo', contact: '+244 924 200 005', status: 'Ativa' },

  // ENDE
  { id: 'ende1', name: 'Posto de Atendimento Talatona', institution: 'ENDE', province: 'Luanda', municipio: 'Talatona', address: 'Avenida Via S8, Lar do Patriota', contact: '+244 925 300 001', status: 'Ativa' },
  { id: 'ende2', name: 'Agência de Distribuição de Viana', institution: 'ENDE', province: 'Luanda', municipio: 'Viana', address: 'Regedoria de Viana, Luanda', contact: '+244 925 300 002', status: 'Ativa' },
  { id: 'ende3', name: 'Posto Regional de Benguela', institution: 'ENDE', province: 'Benguela', municipio: 'Benguela', address: 'Avenida 11 de Novembro', contact: '+244 925 300 003', status: 'Ativa' },
  { id: 'ende4', name: 'Agência Comercial de Cabinda', institution: 'ENDE', province: 'Cabinda', municipio: 'Cabinda', address: 'Zassa, Cabinda', contact: '+244 925 300 004', status: 'Ativa' },

  // EPAL
  { id: 'epal1', name: 'Agência Comercial de Maianga', institution: 'EPAL', province: 'Luanda', municipio: 'Maianga', address: 'Rua Commandante Gika', contact: '+244 926 400 001', status: 'Ativa' },
  { id: 'epal2', name: 'Delegação Comercial de Cazenga', institution: 'EPAL', province: 'Luanda', municipio: 'Cazenga', address: 'Rua do Saneamento, Cazenga', contact: '+244 926 400 002', status: 'Ativa' },
  { id: 'epal3', name: 'Posto de Atendimento de Viana', institution: 'EPAL', province: 'Luanda', municipio: 'Viana', address: 'Próximo ao mercado de Viana', contact: '+244 926 400 003', status: 'Ativa' },

  // Tribunal
  { id: 'tr1', name: 'Tribunal Supremo de Angola', institution: 'Tribunal', province: 'Luanda', municipio: 'Luanda', address: 'Largo do Palácio, Luanda', contact: '+244 927 500 001', status: 'Ativa' },
  { id: 'tr2', name: 'Tribunal de Comarca de Belas', institution: 'Tribunal', province: 'Luanda', municipio: 'Belas', address: 'Centralidade do Kilamba', contact: '+244 927 500 002', status: 'Ativa' },
  { id: 'tr3', name: 'Tribunal de Comarca de Lobito', institution: 'Tribunal', province: 'Benguela', municipio: 'Lobito', address: 'Praça da Independência', contact: '+244 927 500 003', status: 'Ativa' },
  { id: 'tr4', name: 'Tribunal de Comarca de Lubango', institution: 'Tribunal', province: 'Huíla', municipio: 'Lubango', address: 'Centro do Lubango', contact: '+244 927 500 004', status: 'Ativa' },

  // Hospital
  { id: 'hp1', name: 'Hospital Geral de Luanda', institution: 'Hospital', province: 'Luanda', municipio: 'Kilamba Kiaxi', address: 'Bairro Neves Bendinha', contact: '+244 928 600 001', status: 'Ativa' },
  { id: 'hp2', name: 'Hospital Américo Boavida', institution: 'Hospital', province: 'Luanda', municipio: 'Rangel', address: 'Avenida Hoji ya Henda', contact: '+244 928 600 002', status: 'Ativa' },
  { id: 'hp3', name: 'Hospital Geral de Benguela', institution: 'Hospital', province: 'Benguela', municipio: 'Benguela', address: 'Zona Hospitalar de Benguela', contact: '+244 928 600 003', status: 'Ativa' },
  { id: 'hp4', name: 'Hospital Provincial de Cabinda', institution: 'Hospital', province: 'Cabinda', municipio: 'Cabinda', address: 'Avenida Principal Cabinda', contact: '+244 928 600 004', status: 'Ativa' },

  // Ministerios
  { id: 'm1', name: 'Ministério da Justiça e dos Direitos Humanos', institution: 'Ministerios', province: 'Luanda', municipio: 'Luanda', address: 'Rua 17 de Setembro, Luanda', contact: '+244 929 700 001', status: 'Ativa' },
  { id: 'm2', name: 'Ministério das Finanças - MINFIN', institution: 'Ministerios', province: 'Luanda', municipio: 'Luanda', address: 'Largo da Mutamba', contact: '+244 929 700 002', status: 'Ativa' },
  { id: 'm3', name: 'Ministério da Saúde - MINSA', institution: 'Ministerios', province: 'Luanda', municipio: 'Luanda', address: 'Marginal de Luanda', contact: '+244 929 700 003', status: 'Ativa' },

  // Polícia Nacional
  { id: 'pol1', name: 'Comando Geral da Polícia Nacional', institution: 'Polícia Nacional', province: 'Luanda', municipio: 'Ingombota', address: 'Avenida 4 de Fevereiro', contact: '+244 930 800 001', status: 'Ativa' },
  { id: 'pol2', name: '1ª Esquadra de Viana', institution: 'Polícia Nacional', province: 'Luanda', municipio: 'Viana', address: 'Viana Sede', contact: '+244 930 800 002', status: 'Ativa' },
  { id: 'pol3', name: 'Comando Provincial de Benguela', institution: 'Polícia Nacional', province: 'Benguela', municipio: 'Benguela', address: 'Zona Centro, Benguela', contact: '+244 930 800 003', status: 'Ativa' },

  // Notário
  { id: 'not1', name: 'Cartório Notarial de Luanda', institution: 'Notário', province: 'Luanda', municipio: 'Ingombota', address: 'Largo Luther King', contact: '+244 931 900 001', status: 'Ativa' },
  { id: 'not2', name: '2º Cartório Notarial de Viana', institution: 'Notário', province: 'Luanda', municipio: 'Viana', address: 'Viana Vila', contact: '+244 931 900 002', status: 'Ativa' },
  { id: 'not3', name: 'Cartório Provincial de Benguela', institution: 'Notário', province: 'Benguela', municipio: 'Benguela', address: 'Rua Cabral Moncada', contact: '+244 931 900 003', status: 'Ativa' },

  // Registo Civil
  { id: 'civ1', name: 'Conservatória do Registo Civil de Luanda', institution: 'Registo Civil', province: 'Luanda', municipio: 'Maianga', address: 'Rua Frederico Welwitsch', contact: '+244 932 000 001', status: 'Ativa' },
  { id: 'civ2', name: 'Posto de Registo Civil de Belas', institution: 'Registo Civil', province: 'Luanda', municipio: 'Belas', address: 'Centralidade do Kilamba', contact: '+244 932 000 002', status: 'Ativa' },
  { id: 'civ3', name: 'Delegação Civil de Benguela', institution: 'Registo Civil', province: 'Benguela', municipio: 'Benguela', address: 'Centro Cívico de Benguela', contact: '+244 932 000 003', status: 'Ativa' },

  // Seguro Social
  { id: 'inss1', name: 'Direção Geral do INSS', institution: 'Seguro Social', province: 'Luanda', municipio: 'Ingombota', address: 'Largo da Maianga, Luanda', contact: '+244 933 100 001', status: 'Ativa' },
  { id: 'inss2', name: 'Posto de Atendimento do INSS Viana', institution: 'Seguro Social', province: 'Luanda', municipio: 'Viana', address: 'Viana Centro', contact: '+244 933 100 002', status: 'Ativa' },
  { id: 'inss3', name: 'Delegação Regional de Cabinda', institution: 'Seguro Social', province: 'Cabinda', municipio: 'Cabinda', address: 'Largo do Comércio', contact: '+244 933 100 003', status: 'Ativa' },

  // Administradoras
  { id: 'adm1', name: 'Administração Municipal de Belas', institution: 'Administradoras', province: 'Luanda', municipio: 'Belas', address: 'Belas, Luanda', contact: '+244 934 200 001', status: 'Ativa' },
  { id: 'adm2', name: 'Administração Municipal de Viana', institution: 'Administradoras', province: 'Luanda', municipio: 'Viana', address: 'Viana Sede', contact: '+244 934 200 002', status: 'Ativa' },
  { id: 'adm3', name: 'Administração Municipal de Benguela', institution: 'Administradoras', province: 'Benguela', municipio: 'Benguela', address: 'Largo do Governo Provincial', contact: '+244 934 200 003', status: 'Ativa' },

  // INE
  { id: 'ine1', name: 'Sede Central do INE', institution: 'INE', province: 'Luanda', municipio: 'Luanda', address: 'Avenida 4 de Fevereiro, Edifício Real', contact: '+244 935 300 001', status: 'Ativa' },
  { id: 'ine2', name: 'Gabinete de Estatísticas de Benguela', institution: 'INE', province: 'Benguela', municipio: 'Benguela', address: 'Rua do Comércio de Benguela', contact: '+244 935 300 002', status: 'Ativa' },
  { id: 'ine3', name: 'Posto de Censo Populacional Viana', institution: 'INE', province: 'Luanda', municipio: 'Viana', address: 'Viana Vila, Luanda', contact: '+244 935 300 003', status: 'Ativa' }
];

const INITIAL_ORGS: Organismo[] = [
  { id: 'agt', name: 'AGT', desc: 'Administração Geral Tributária', status: 'Ligado', protocol: 'SOAP/XML', token: 'AGT_KEY_v2_9901', type: 'Finanças/Tributos' },
  { id: 'ende', name: 'ENDE', desc: 'Empresa Nac. de Distribuição de Electricidade', status: 'Ligado', protocol: 'REST/JSON', token: 'ENDE_PROD_5511_B', type: 'Infraestrutura' },
  { id: 'epal', name: 'EPAL', desc: 'Empresa Pública de Águas de Luanda', status: 'Ligado', protocol: 'REST/JSON', token: 'EPAL_SEC_3310', type: 'Infraestrutura' },
  { id: 'bancos', name: 'BANCOS', desc: 'Banco de Poupança e Crédito & Bancos Privados', status: 'Ligado', protocol: 'REST/OAuth2', token: 'BANK_OAUTH_TOKEN_PROD', type: 'Finanças / Privado' },
  { id: 'ministerios', name: 'MINISTÉRIOS', desc: 'Ministérios da Justiça, Finanças & Saúde', status: 'Ligado', protocol: 'gRPC', token: 'GOV_MIN_SEC_8892', type: 'Governo' },
  { id: 'tribunais', name: 'TRIBUNAIS', desc: 'Tribunal Supremo & Tribunais de Comarca', status: 'Ligado', protocol: 'REST/JSON', token: 'TRIB_SUP_AUTH_KEY', type: 'Judiciário' },
  { id: 'hospitais', name: 'HOSPITAIS', desc: 'Hospital Geral de Luanda & Américo Boavida', status: 'Ligado', protocol: 'FHIR/JSON', token: 'HOSP_CLINICAL_9011', type: 'Saúde / Hospitalar' },
  { id: 'registo-civil', name: 'CIVIL', desc: 'Conservatória do Registo Civil de Luanda', status: 'Ligado', protocol: 'GraphQL', token: 'REG_CIVIL_MUTUAL_TLS', type: 'Registo Civil' },
  { id: 'ine', name: 'INE', desc: 'Instituto Nacional de Estatística', status: 'Ligado', protocol: 'REST/JSON', token: 'INE_STAT_KEY_7744', type: 'Estatística / Censo' }
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
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.some((o: any) => o.name === 'INE')) {
        parsed.push({ id: 'ine', name: 'INE', desc: 'Instituto Nacional de Estatística', status: 'Ligado', protocol: 'REST/JSON', token: 'INE_STAT_KEY_7744', type: 'Estatística / Censo' });
        localStorage.setItem('gov_interop_orgs_v2', JSON.stringify(parsed));
      }
      return parsed;
    }
    return INITIAL_ORGS;
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

  // Geographic and Agency filters state
  const [selectedInst, setSelectedInst] = useState<string>('AGT');
  const [filterProvince, setFilterProvince] = useState<string>('Todas');
  const [filterMunicipio, setFilterMunicipio] = useState<string>('Todos');

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('gov_local_agencies_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.some((a: any) => a.institution === 'INE')) {
        const ineAgencies = [
          { id: 'ine1', name: 'Sede Central do INE', institution: 'INE', province: 'Luanda', municipio: 'Luanda', address: 'Avenida 4 de Fevereiro, Edifício Real', contact: '+244 935 300 001', status: 'Ativa' },
          { id: 'ine2', name: 'Gabinete de Estatísticas de Benguela', institution: 'INE', province: 'Benguela', municipio: 'Benguela', address: 'Rua do Comércio de Benguela', contact: '+244 935 300 002', status: 'Ativa' },
          { id: 'ine3', name: 'Posto de Censo Populacional Viana', institution: 'INE', province: 'Luanda', municipio: 'Viana', address: 'Viana Vila, Luanda', contact: '+244 935 300 003', status: 'Ativa' }
        ];
        const merged = [...parsed, ...ineAgencies];
        localStorage.setItem('gov_local_agencies_v2', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return INITIAL_AGENCIES;
  });

  // Modal open flag and creation inputs
  const [isAddInstModalOpen, setIsAddInstModalOpen] = useState(false);
  const [selectedAgencyDetail, setSelectedAgencyDetail] = useState<Agency | null>(null);
  const [addAgencyName, setAddAgencyName] = useState('');
  const [addAgencyInstitution, setAddAgencyInstitution] = useState('AGT');
  const [addAgencyProvince, setAddAgencyProvince] = useState('Luanda');
  const [addAgencyMunicipio, setAddAgencyMunicipio] = useState('Luanda');
  const [addAgencyAddress, setAddAgencyAddress] = useState('');
  const [addAgencyContact, setAddAgencyContact] = useState('');
  const [addAgencyInstitutionalId, setAddAgencyInstitutionalId] = useState('');

  // Persist agency list
  useEffect(() => {
    localStorage.setItem('gov_local_agencies_v2', JSON.stringify(agencies));
  }, [agencies]);

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
    let nextStatus: Organismo['status'] | undefined;
    let orgName = '';
    let orgDesc = '';

    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        const statuses: Organismo['status'][] = ['Ligado', 'Manutenção', 'Offline'];
        const currentIndex = statuses.indexOf(org.status);
        nextStatus = statuses[(currentIndex + 1) % statuses.length];
        orgName = org.name;
        orgDesc = org.desc;
        return { ...org, status: nextStatus };
      }
      return org;
    }));

    if (nextStatus) {
      onLog?.(`Instituição: ${orgName} alterada para ${nextStatus}`, nextStatus === 'Ligado' ? 'success' : 'warning');
      
      // Add log entry
      const newLog: InteropLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-AO'),
        source: 'CDA-GATEWAY',
        target: orgName,
        operation: 'STATUS_TOGGLE',
        status: nextStatus === 'Ligado' ? 'success' : nextStatus === 'Manutenção' ? 'warning' : 'error',
        payload: `Operador alterou o status administrativo da interface do organismo ${orgDesc} para ${nextStatus}.`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }
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
    let orgName = '';
    setOrgs(prev => prev.map(org => {
      if (org.id === id) {
        orgName = org.name;
        return { ...org, token: newToken };
      }
      return org;
    }));

    if (orgName) {
      onLog?.(`Token de integração ${orgName} atualizado com novas credenciais`, 'info');
      
      const newLog: InteropLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-AO'),
        source: 'CDA-GATEWAY',
        target: orgName,
        operation: 'ROTATE_SECRET_TOKEN',
        status: 'success',
        payload: `Chave criptográfica do organismo ${orgName} rotacionada com novas diretrizes de autenticidade.`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }
    setEditingOrg(null);
  };

  // Toggle forwarding rule state
  const toggleForwarding = (id: string) => {
    let nextState: boolean | undefined;
    let ruleSource = '';
    let ruleTarget = '';
    let ruleDocType = '';

    setForwardingRules(prev => prev.map(rule => {
      if (rule.id === id) {
        nextState = !rule.active;
        ruleSource = rule.source;
        ruleTarget = rule.target;
        ruleDocType = rule.docType;
        return { ...rule, active: nextState };
      }
      return rule;
    }));

    if (nextState !== undefined) {
      onLog?.(`Regra de Encaminhamento ${ruleSource}➔${ruleTarget} ${nextState ? 'activada' : 'desactivada'}`, 'info');

      const newLog: InteropLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-AO'),
        source: ruleSource,
        target: ruleTarget,
        operation: nextState ? 'ROUTING_RULE_ENABLE' : 'ROUTING_RULE_DISABLE',
        status: 'success',
        payload: `Roteamento de documentos do tipo '${ruleDocType}' foi ${nextState ? 'ativado' : 'retirado'}.`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }
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
    let nextStatus: 'Ativo' | 'Suspenso' | undefined;
    let citizenName = '';
    let citizenBi = '';
    let entity = '';
    let scope = '';

    setSharingRules(prev => prev.map(rule => {
      if (rule.id === id) {
        nextStatus = rule.status === 'Ativo' ? 'Suspenso' : 'Ativo';
        citizenName = rule.citizenName;
        citizenBi = rule.citizenBi;
        entity = rule.entity;
        scope = rule.scope;
        return { ...rule, status: nextStatus };
      }
      return rule;
    }));

    if (nextStatus) {
      onLog?.(`Consentimento de partilha unificada para ${citizenName} foi ${nextStatus === 'Ativo' ? 'reativado' : 'suspenso'}.`, 'warning');

      const newLog: InteropLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-AO'),
        source: 'CDA-CONSENT-DESK',
        target: entity,
        operation: nextStatus === 'Ativo' ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
        status: nextStatus === 'Ativo' ? 'success' : 'warning',
        payload: `Acesso a dados (${scope}) do cidadão BI ${citizenBi} para ${entity} alterado para ${nextStatus}.`
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }
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
      let currentPendingStep: { institution: string; action: string } | undefined;
      let flowName = '';

      setFlows(prevFlows => prevFlows.map(flow => {
        if (flow.id === flowId) {
          flowName = flow.name;
          currentPendingStep = flow.steps.find(s => s.status === 'Pendente');

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
          
          return { ...flow, steps: updatedSteps };
        }
        return flow;
      }));

      // Perform side-effects outside setFlows updater
      if (currentPendingStep) {
        const nextLog: InteropLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-AO'),
          source: 'SYSTEM_FLOW_ORCHESTRATOR',
          target: currentPendingStep.institution || 'MULTIPLOS',
          operation: 'FLOW_STEP_COMPLETED',
          status: 'success',
          payload: `Barramento interoperável concluiu etapa de integração "${currentPendingStep.action}" no fluxo ${flowName}.`
        };
        setLogs(prevLogs => [nextLog, ...prevLogs]);
      }

      setSimulatingFlowId(null);
      onLog?.(`Fase de fluxo multi-institucional automatizado atualizada com sucesso.`, 'success');
    }, 2000);
  };

  // Reset flows state to initial presets (utility for testing)
  const handleResetFlows = () => {
    setFlows(INITIAL_FLOWS);
    onLog?.(`Fluxos cooperativos repostos ao estado inicial de simulação.`, 'info');
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesInst = agency.institution.toLowerCase() === selectedInst.toLowerCase();
    const matchesProvince = filterProvince === 'Todas' || agency.province === filterProvince;
    const matchesMunicipio = filterMunicipio === 'Todos' || agency.municipio === filterMunicipio;
    return matchesInst && matchesProvince && matchesMunicipio;
  });

  const handleAddAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAgencyName || !addAgencyAddress || !addAgencyContact) {
      alert('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    const newAgency: Agency = {
      id: `ag-${Date.now()}`,
      name: addAgencyName,
      institution: addAgencyInstitution,
      province: addAgencyProvince,
      municipio: addAgencyMunicipio,
      address: addAgencyAddress,
      contact: addAgencyContact,
      status: 'Ativa',
      institutionalId: addAgencyInstitutionalId.trim() || `ID-${addAgencyInstitution}-${Date.now().toString().slice(-4)}`
    };

    setAgencies(prev => [newAgency, ...prev]);
    setIsAddInstModalOpen(false);

    // Reset input fields
    setAddAgencyName('');
    setAddAgencyAddress('');
    setAddAgencyContact('');
    setAddAgencyInstitutionalId('');

    // Trigger log & notification
    onLog?.(`Instituição: ${newAgency.name} adicionada com sucesso em ${newAgency.province}.`, 'success');

    // Add interop log entry
    const newLogEntry: InteropLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-AO'),
      source: 'CDA-GATEWAY',
      target: newAgency.institution,
      operation: 'INSTITUTION_REGISTERED',
      status: 'success',
      payload: `Nova agência de atendimento "${newAgency.name}" adicionada ao cadastro de cooperantes estatais em ${newAgency.province}, ${newAgency.municipio}.`
    };
    setLogs(prev => [newLogEntry, ...prev]);
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
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Instituição</h1>
            <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
               <div className="w-1 h-3 bg-emerald-500 rounded-full" />
               Canais de Conetividade e Cooperação Institucional
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

      <div className="space-y-8 animate-fade-in">

        {/* 1. Contentor "Instituições Conectadas" */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden relative group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
               <h3 className="text-slate-950 font-black text-xs md:text-md italic tracking-tighter uppercase">Instituições Conectadas</h3>
            </div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-100">Versão Administrativa</div>
          </div>
          
          <div className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto custom-scrollbar pb-3">
            {["SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Ministerios", "Polícia Nacional", "Notário", "Registo Civil", "Seguro Social", "Administradoras", "INE"].map((name) => {
              const isActive = selectedInst.toLowerCase() === name.toLowerCase();
              const countForInst = agencies.filter(a => a.institution.toLowerCase() === name.toLowerCase()).length;
              return (
                <button 
                  key={name}
                  onClick={() => {
                    setSelectedInst(name);
                  }}
                  className={`px-5 py-3 rounded-2xl text-[11px] md:text-xs font-black uppercase transition-all cursor-pointer shrink-0 shadow-sm text-left flex items-center gap-2.5 border ${
                    isActive 
                      ? 'bg-[#0e2b64] border-[#0e2b64] text-white shadow-lg' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Building2 size={13} className={isActive ? 'text-white/80' : 'text-slate-400'} />
                  <span>{name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#0a204b] text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {countForInst}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2 & 3. Real-Time Dynamic Listing and Location Filters Row */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h4 className="font-black text-slate-900 text-lg md:text-xl italic uppercase tracking-tight flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600" />
                Instituição Governamental: {selectedInst}
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Visualização e filtragem do contingente territorial de atendimento
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

              {/* 4. Action button to Add Institution */}
              <button
                onClick={() => {
                  setAddAgencyInstitution(selectedInst);
                  setIsAddInstModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5"
              >
                <Plus size={16} />
                Adicionar Instituição
              </button>
            </div>
          </div>

          {/* Dynamic Agency List Rendering */}
          {filteredAgencies.length === 0 ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Building2 size={24} />
                </div>
                <h5 className="font-extrabold text-slate-900 text-sm uppercase">Nenhuma instituição localizada</h5>
                <p className="text-xs text-slate-400">
                  Não existem filiais cadastradas para a instituição {selectedInst} em {filterProvince === 'Todas' ? 'todas as províncias' : filterProvince}{filterMunicipio !== 'Todos' && `, município ${filterMunicipio}`}.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto rounded-[24px] border border-slate-100 bg-slate-50/20 custom-scrollbar max-h-[500px]">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="sticky top-0 z-10 bg-[#0e2b64]">
                  <tr className="border-b border-primary/20 bg-[#0e2b64] text-[10px] font-black uppercase tracking-wider text-white">
                    <th className="py-4 px-5">Nome da Instituição</th>
                    <th className="py-4 px-5">ID Institucional</th>
                    <th className="py-4 px-5">Província</th>
                    <th className="py-4 px-5">Município</th>
                    <th className="py-4 px-5">Endereço</th>
                    <th className="py-4 px-5">Contacto</th>
                    <th className="py-4 px-5 font-black">Status</th>
                    <th className="py-4 px-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAgencies.map((agency) => (
                    <tr 
                      key={agency.id} 
                      onClick={() => setSelectedAgencyDetail(agency)}
                      className="text-xs text-slate-800 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 cursor-pointer group"
                    >
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[9px] text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:bg-indigo-100/50">
                              {agency.institution}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">ID: {agency.id.toUpperCase()}</span>
                          </div>
                          <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-sm uppercase italic tracking-tight transition-colors">{agency.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-900 font-bold uppercase font-mono tracking-wider">
                        <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 block text-center max-w-[150px] leading-tight text-[11px]">
                          {agency.institutionalId || `ID-${agency.institution}-${agency.id.substring(0, 5).toUpperCase()}`}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-700">{agency.province}</td>
                      <td className="py-4 px-5 font-medium text-slate-600">{agency.municipio}</td>
                      <td className="py-4 px-5 text-slate-500 font-medium max-w-[220px] truncate" title={agency.address}>
                        {agency.address}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-600">{agency.contact}</td>
                      <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={agency.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newStatus = e.target.value as any;
                            setAgencies(prev => prev.map(a => a.id === agency.id ? { ...a, status: newStatus } : a));
                            onLog?.(`Alteração de status: ${agency.name} alterada para ${newStatus}`, newStatus === 'Ativa' ? 'success' : 'warning');
                          }}
                          className={`text-[9px] font-black uppercase tracking-wider border rounded-lg px-2 py-1 outline-none cursor-pointer ${
                            agency.status === 'Ativa' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            agency.status === 'Manutenção' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-red-50 text-red-650 border-red-100'
                          }`}
                        >
                          <option value="Ativa">Ativa</option>
                          <option value="Manutenção">Em Manutenção</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remover agência "${agency.name}" permanentemente?`)) {
                              setAgencies(prev => prev.filter(a => a.id !== agency.id));
                              onLog?.(`Remoção: Agência ${agency.name} removida permanentemente do cadastro.`, 'critical');
                            }
                          }}
                          className="text-[9px] font-black uppercase text-red-500 hover:text-red-700 hover:underline cursor-pointer px-3 py-1.5 rounded-xl hover:bg-red-50/50 transition-all font-bold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Modal de Cadastro de Parceiro Institucional / Agência */}
      <AnimatePresence>
        {isAddInstModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddInstModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[40px] shadow-2xl z-[201] overflow-hidden border border-slate-100"
            >
              <div className="bg-gradient-to-r from-indigo-900 to-slate-950 p-8 text-white relative">
                <button 
                  onClick={() => setIsAddInstModalOpen(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all"
                  type="button"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-[16px] flex items-center justify-center text-white border border-white/20">
                      <Building2 size={24} />
                   </div>
                   <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">ADMINISTRAÇÃO DE REDE</div>
                      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none mt-1">Registar Nova Instituição</h2>
                   </div>
                </div>
              </div>

              <form onSubmit={handleAddAgency} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 input-label font-bold">Instituição Mãe / Organismo</label>
                  <select 
                    value={addAgencyInstitution}
                    onChange={(e) => setAddAgencyInstitution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  >
                    {["SME", "AGT", "ENDE", "EPAL", "Tribunal", "Hospital", "Ministerios", "Polícia Nacional", "Notário", "Registo Civil", "Seguro Social", "Administradoras", "INE"].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Nome de Atendimento / Repartição</label>
                  <input 
                    type="text" 
                    value={addAgencyName}
                    onChange={(e) => setAddAgencyName(e.target.value)}
                    placeholder="Ex: Repartição Regional do Lobito"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Província</label>
                    <select 
                      value={addAgencyProvince}
                      onChange={(e) => {
                        const newProv = e.target.value;
                        setAddAgencyProvince(newProv);
                        const muns = MUNICIPALITIES_BY_PROVINCE[newProv] || [];
                        setAddAgencyMunicipio(muns.filter(m => m !== 'Todos')[0] || 'Todos');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                    >
                      {Object.keys(MUNICIPALITIES_BY_PROVINCE).filter(p => p !== 'Todas').map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Município</label>
                    <select 
                      value={addAgencyMunicipio}
                      onChange={(e) => setAddAgencyMunicipio(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                    >
                      {(MUNICIPALITIES_BY_PROVINCE[addAgencyProvince] || ['Todos']).filter(m => m !== 'Todos').map(mun => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">ID Institucional</label>
                  <input 
                    type="text" 
                    value={addAgencyInstitutionalId}
                    onChange={(e) => setAddAgencyInstitutionalId(e.target.value)}
                    placeholder="Ex: AGT-LUA-001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Endereço Físico Completo</label>
                  <input 
                    type="text" 
                    value={addAgencyAddress}
                    onChange={(e) => setAddAgencyAddress(e.target.value)}
                    placeholder="Ex: Avenida Principal do Lobito, Esquina 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Contacto de Atendimento</label>
                  <input 
                    type="text" 
                    value={addAgencyContact}
                    onChange={(e) => setAddAgencyContact(e.target.value)}
                    placeholder="Ex: +244 923 000 000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-semibold"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                  >
                    Gravar Registo
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddInstModalOpen(false)}
                    className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {selectedAgencyDetail && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgencyDetail(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[32px] shadow-2xl z-[201] overflow-hidden border border-slate-100"
            >
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white relative">
                <button 
                  onClick={() => setSelectedAgencyDetail(null)}
                  className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-full transition-all"
                  type="button"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Detalhamento Oficial</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        selectedAgencyDetail.status === 'Ativa' ? 'bg-emerald-500/20 text-emerald-300' :
                        selectedAgencyDetail.status === 'Manutenção' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {selectedAgencyDetail.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-black italic tracking-tight uppercase leading-none mt-1">{selectedAgencyDetail.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID do Registro</span>
                    <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{selectedAgencyDetail.id}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Institucional</span>
                    <span className="font-mono text-xs font-black text-indigo-750 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedAgencyDetail.institutionalId || `ID-${selectedAgencyDetail.institution}-${selectedAgencyDetail.id.substring(0, 5).toUpperCase()}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição Geral</span>
                    <span className="font-black text-[10px] text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{selectedAgencyDetail.institution}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Província</span>
                    <span className="text-xs font-bold text-slate-700">{selectedAgencyDetail.province}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Município</span>
                    <span className="text-xs font-medium text-slate-650">{selectedAgencyDetail.municipio}</span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço Físico</span>
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium pl-1">
                      <MapPin size={12} className="text-indigo-550 shrink-0 mt-0.5" />
                      <span>{selectedAgencyDetail.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto Directo</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{selectedAgencyDetail.contact}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setSelectedAgencyDetail(null)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Fechar Detalhes
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
