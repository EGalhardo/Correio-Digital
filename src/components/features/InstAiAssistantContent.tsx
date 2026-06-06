/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Eye, 
  Activity, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Send, 
  Check, 
  ChevronRight, 
  Upload, 
  FileText, 
  BookOpen, 
  Plus, 
  Settings, 
  HelpCircle, 
  AlertCircle,
  Pencil,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Search,
  CheckCircle,
  X,
  FileCode,
  Sparkles,
  Globe,
  Sliders
} from 'lucide-react';

interface InstAiAssistantProps {
  addAuditLog?: (action: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  delivered?: boolean;
}

interface KnowledgeItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: 'Processado' | 'Indexando';
}

interface InteractionLog {
  id: string;
  citizenName: string;
  bi: string;
  topic: string;
  satisfaction: 'Alta' | 'Média' | 'Baixa';
  time: string;
  messagesCount: number;
}

interface ToolIntegration {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}

export function InstAiAssistantContent({ addAuditLog }: InstAiAssistantProps) {
  // Navigation Sub Tab State
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'instructions' | 'knowledge' | 'tools' | 'history' | 'test'>('config');

  // Configuration States
  const [assistantName, setAssistantName] = useState<string>('Assistente AGT');
  const [description, setDescription] = useState<string>(
    'Assistente virtual da Administração Geral Tributária que ajuda cidadãos e empresas com serviços fiscais, impostos, NIF, multas e declarações.'
  );
  const [model, setModel] = useState<string>('GPT-4o');
  const [temperature, setTemperature] = useState<string>('0.2');
  const [language, setLanguage] = useState<string>('Português (Portugal)');

  // Temporary edit states
  const [tempName, setTempName] = useState<string>('Assistente AGT');
  const [tempDescription, setTempDescription] = useState<string>(
    'Assistente virtual da Administração Geral Tributária que ajuda cidadãos e empresas com serviços fiscais, impostos, NIF, multas e declarações.'
  );
  const [tempModel, setTempModel] = useState<string>('GPT-4o');
  const [tempTemperature, setTempTemperature] = useState<string>('0.2');
  const [tempLanguage, setTempLanguage] = useState<string>('Português (Portugal)');

  // Instructions State
  const [instructions, setInstructions] = useState<string>(
    `Você é o assistente oficial da Administração Geral Tributária (AGT).\n\nResponda apenas sobre assuntos relacionados com:\n- NIF\n- Impostos\n- Multas fiscais\n- Declarações fiscais\n- Taxas\n- Certidões fiscais\n- Processos fiscais`
  );
  const [tempInstructions, setTempInstructions] = useState<string>(instructions);

  // Is Editing Name inline state
  const [isEditingNameInline, setIsEditingNameInline] = useState<boolean>(false);

  // Automatic Context States (Checkboxes)
  const [contextConfig, setContextConfig] = useState({
    readMail: true,
    readProcessStatus: true,
    readTaxpayerData: true,
    readSchedules: true,
    readHistory: true,
    readAttachments: true,
  });

  // Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Chat message state (for testing)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Quais documentos preciso para obter o NIF?',
      time: '21:29',
      delivered: true,
    },
    {
      id: 'm2',
      sender: 'bot',
      text: "Para obter o NIF, você precisa apresentar os seguintes documentos:\n\n• Bilhete de Identidade\n• Comprovativo de Residência\n• Declaração de Actividade (se aplicável)\n\nO pedido pode ser feito presencialmente num serviço da AGT ou online através do Portal das Finanças.",
      time: '21:29',
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Preview channel Chat message state (Inside modal)
  const [previewMessages, setPreviewMessages] = useState<ChatMessage[]>([
    {
      id: 'pm1',
      sender: 'bot',
      text: 'Olá! Sou o Assistente IA oficial integrado nos serviços públicos. Posso ajudá-lo hoje com o seu NIF, impostos, multas fiscais ou agendamentos?',
      time: '11:02',
    }
  ]);
  const [previewInput, setPreviewInput] = useState<string>('');
  const [isPreviewTyping, setIsPreviewTyping] = useState<boolean>(false);
  const previewChatBottomRef = useRef<HTMLDivElement | null>(null);

  // Knowledge Base Files state
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeItem[]>([
    { id: 'kb1', name: 'Manual_Procedimentos_Fiscais_AGT.pdf', size: '2.4 MB', uploadedAt: '12/05/2026', status: 'Processado' },
    { id: 'kb2', name: 'Regulamento_Custas_Tributarias.pdf', size: '1.1 MB', uploadedAt: '14/05/2026', status: 'Processado' },
    { id: 'kb3', name: 'Instrucao_Preenchimento_Modelo_1.docx', size: '420 KB', uploadedAt: '01/06/2026', status: 'Processado' },
    { id: 'kb4', name: 'Tabela_Codigos_Atividades_Economicas.pdf', size: '4.8 MB', uploadedAt: '04/06/2026', status: 'Indexando' }
  ]);

  // Authorized API Tools integration state
  const [tools, setTools] = useState<ToolIntegration[]>([
    { id: 't1', name: 'Validador de NIF', description: 'Valida a autenticidade e situação cadastral do contribuinte junto ao banco de dados estatal.', category: 'Serviços de Cadastro', active: true },
    { id: 't2', name: 'Emissor de DLI (Documento de Liquidação)', description: 'Permite que a IA gere referências de pagamento de multas ou guias voluntárias.', category: 'Finanças & Cobrança', active: true },
    { id: 't3', name: 'Verificador de Estado de Processos', description: 'Consulta andamentos de petições, recursos e defesas de multas tributárias.', category: 'Contencioso', active: true },
    { id: 't4', name: 'Verificação de Dívidas Ativas', description: 'Examina restrições ou pendências de débitos fiscais em execução judicial.', category: 'Finanças & Cobrança', active: false },
    { id: 't5', name: 'Gerenciador de Agendamentos', description: 'Interface para marcar atendimentos presenciais com auditores nas repartições regionais.', category: 'Apoio ao Cidadão', active: true },
    { id: 't6', name: 'Geração Certidões de Quitação', description: 'Emite o PDF autenticado digitalmente confirmando a ausência de dívidas ativas.', category: 'Serviços de Cadastro', active: false },
  ]);

  // Conversation logs history
  const [interactionLogs] = useState<InteractionLog[]>([
    { id: 'log-1', citizenName: 'Edlasio Galhardo', bi: '009874562LA041', topic: 'Consulta de NIF e Isenções', satisfaction: 'Alta', time: 'Há 12 minutos', messagesCount: 8 },
    { id: 'log-2', citizenName: 'Maria Antónia', bi: '008812342LA011', topic: 'Reclamação de Multa Comercial', satisfaction: 'Alta', time: 'Há 45 minutos', messagesCount: 14 },
    { id: 'log-3', citizenName: 'José Kalunga', bi: '007712342LA021', topic: 'Obtenção de Modelo 1 Simplificado', satisfaction: 'Média', time: 'Há 2 horas', messagesCount: 6 },
    { id: 'log-4', citizenName: 'António Nzaji', bi: '001224851BA034', topic: 'Atendimento Prévio Registral', satisfaction: 'Alta', time: 'Há 1 dia', messagesCount: 5 },
    { id: 'log-5', citizenName: 'Filomena da Rocha', bi: '001144821LA091', topic: 'Contestação de Imposto Predial', satisfaction: 'Baixa', time: 'Há 2 dias', messagesCount: 19 }
  ]);

  // Toast Alerts State
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Scroll logic for testing chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    previewChatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previewMessages, isPreviewTyping]);

  // Synchronize temp state
  useEffect(() => {
    setTempName(assistantName);
    setTempDescription(description);
    setTempModel(model);
    setTempTemperature(temperature);
    setTempLanguage(language);
  }, [assistantName, description, model, temperature, language]);

  // Action: Save configuration forms
  const handleSaveGeneralConfig = () => {
    setAssistantName(tempName);
    setDescription(tempDescription);
    setModel(tempModel);
    setTemperature(tempTemperature);
    setLanguage(tempLanguage);
    setIsEditingNameInline(false);

    triggerToast('Configuração Geral salva com sucesso!', 'success');
    addAuditLog?.(`Configurações de IA modificadas: Nome (${tempName}), Modelo (${tempModel}), Temp (${tempTemperature})`, 'success');
  };

  // Action: Save IA prompt instructions
  const handleSaveInstructions = () => {
    setInstructions(tempInstructions);
    triggerToast('Instruções operacionais aplicadas com sucesso!', 'success');
    addAuditLog?.('Instruções operacionais do Assistente de IA atualizadas por agente autorizado.', 'success');
  };

  // Action: Add simulated PDF to database
  const handleUploadDummyFile = () => {
    const filePool = [
      'Decreto_Presidencial_Regulamentacao_Virtual.pdf',
      'Portaria_Instrucoes_Fiscais_Aduaneiras.docx',
      'Instrucoes_Procedimentos_Contribuinte_Singular.pdf',
      'Codigo_Geral_Tributos_Angola_Revisado.pdf'
    ];
    const picked = filePool[Math.floor(Math.random() * filePool.length)];
    const existing = knowledgeFiles.find(f => f.name === picked);
    if (existing) {
      triggerToast('Este documento já está registrado na base de conhecimento.', 'warning');
      return;
    }

    const newDoc: KnowledgeItem = {
      id: `doc-${Date.now()}`,
      name: picked,
      size: `${(Math.random() * 2.5 + 1.2).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleDateString('pt-PT'),
      status: 'Indexando'
    };

    setKnowledgeFiles(prev => [newDoc, ...prev]);
    triggerToast(`Documento "${picked}" adicionado para processamento.`, 'success');
    addAuditLog?.(`Novo manual anexado ao conhecimento do Assistente: ${picked}`, 'success');

    // Simulate complete index status
    setTimeout(() => {
      setKnowledgeFiles(current => current.map(f => f.id === newDoc.id ? { ...f, status: 'Processado' } : f));
    }, 5500);
  };

  // Action: Delete document from database
  const handleDeleteFile = (id: string, name: string) => {
    setKnowledgeFiles(prev => prev.filter(f => f.id !== id));
    triggerToast(`Documento "${name}" excluído da base assistente.`, 'info');
    addAuditLog?.(`Documento removido da base IA: ${name}`, 'warning');
  };

  // Action: Toggle custom API tools
  const handleToggleTool = (id: string) => {
    setTools(current => current.map(t => {
      if (t.id === id) {
        const nextState = !t.active;
        triggerToast(`Ferramenta "${t.name}" ${nextState ? 'ativada' : 'desativada'}.`, nextState ? 'success' : 'info');
        addAuditLog?.(`Integração de ferramenta de IA alterada: ${t.name} (${nextState ? 'Ativa' : 'Inativa'})`, 'info');
        return { ...t, active: nextState };
      }
      return t;
    }));
  };

  // BOT SIMULATION LOGIC
  const runSimulatedResponse = (query: string, setMessagesList: React.Dispatch<React.SetStateAction<ChatMessage[]>>, setTypingState: (s: boolean) => void) => {
    const normalized = query.toLowerCase().trim();
    let reply = '';

    if (normalized.includes('olá') || normalized.includes('bom dia') || normalized.includes('boa tarde')) {
      reply = `Olá! Sou o ${assistantName}, assistente virtual oficial de atendimento da instituição. Posso ajudá-lo com consultas fiscais, declarações, NIF, multas e certidões. Como posso auxiliar hoje?`;
    } else if (normalized.includes('nif') || normalized.includes('obter') || normalized.includes('documentos')) {
      reply = `Para a obtenção ou regularização de NIF junto à ${assistantName === 'Assistente AGT' ? 'Administração Geral Tributária' : assistantName}:\n\n• Cidadãos Nacionais: É obrigatório apresentar o Bilhete de Identidade (BI) original e o Comprovativo de Residência.\n• Cidadãos Estrangeiros: Requer Cópia do Passaporte Válido e Carta de Residência Fiscal.\n\nPode processar diretamente online de forma gratuita pelo Portal das Finanças ou mediante marcação numa Repartição Fiscal credenciada.`;
    } else if (normalized.includes('multa') || normalized.includes('pagar') || normalized.includes('juro') || normalized.includes('dli')) {
      reply = `As multas fiscais ativas podem ser localizadas pelo seu NIF. O pagamento requer a emissão do DLI (Documento de Liquidação de Impostos) contendo a Referência Única de Pagamento. Pode liquidar nos canais Multicaixa (Banco de Origem) ou na rede de agências bancárias autorizadas. Deseja que eu emita uma guia para você?`;
    } else if (normalized.includes('imposto') || normalized.includes('iva') || normalized.includes('irt')) {
      reply = `Os impostos declarativos como IVA e IRT seguem calendários oficiais mensais estabelecidos pelo Ministério das Finanças da República de Angola. Pode examinar suas faturas e guias em processamento pelo painel Correio Oficial.`;
    } else {
      reply = `Percebi sua questão relacionada com "${query}". Como sou um assistente treinado para fins burocráticos e regulamentações públicas, posso confirmar as diretrizes com base nos manuais ativos da instituição. Prefere consultar as certidões emitidas ou falar com um atendente humano?`;
    }

    setTypingState(true);
    setTimeout(() => {
      setTypingState(false);
      setMessagesList(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  // Testing Console Send Chat
  const handleSendTestChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
    };

    setChatMessages(prev => [...prev, userMsg]);
    const inputToProcess = chatInput;
    setChatInput('');
    runSimulatedResponse(inputToProcess, setChatMessages, setIsTyping);
  };

  // Preview Modal Send Chat
  const handleSendPreviewMessage = () => {
    if (!previewInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `prev-${Date.now()}`,
      sender: 'user',
      text: previewInput,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
    };

    setPreviewMessages(prev => [...prev, userMsg]);
    const inputToProcess = previewInput;
    setPreviewInput('');
    runSimulatedResponse(inputToProcess, setPreviewMessages, setIsPreviewTyping);
  };

  const activeCheckboxesCount = Object.values(contextConfig).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#1e293b] font-sans antialiased" id="inst-ai-assistant-root">
      
      {/* Dynamic Action Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-[200] max-w-sm px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold leading-tight ${
              toast.type === 'success' 
                ? 'bg-[#0c2340] border-[#1e3a60] text-[#10b981]' 
                : toast.type === 'warning'
                ? 'bg-amber-500 border-amber-600 text-white'
                : 'bg-[#0f172a] border-slate-800 text-slate-200'
            }`}
          >
            <CheckCircle className="shrink-0 w-4 h-4 text-emerald-400" />
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-auto hover:text-white p-0.5 bg-transparent border-none cursor-pointer">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CABEÇALHO DA PÁGINA (PAGE HEADER) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-1">
        <div className="text-left">
          <h1 className="text-2xl md:text-[28px] font-black text-[#0c2340] tracking-tight m-0 leading-tight">
            Assistência IA
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-bold mt-1.5">
            Configure e gerencie o assistente virtual da sua instituição.
          </p>
        </div>

        {/* State and Preview Trigger */}
        <div className="flex items-center gap-3">
          {/* Badge de Estado: Active status blinker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-800 select-none tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ● ATIVO
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="bg-[#0c2340] hover:bg-indigo-950 text-white py-2 px-5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0c2340]/25 border-none"
            id="preview-assistant-btn"
          >
            <Eye size={14} className="stroke-[2.5]" />
            <span>Pré-visualizar Assistente</span>
          </button>
        </div>
      </div>

      {/* PRIMEIRA LINHA DE CARTÕES (TOP TWO WIDE CARDS LADO A LADO) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARTÃO 1: INFORMAÇÕES DO ASSISTENTE (Left) */}
        <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Circular logo: Institutional circular avatar */}
          <div className="w-20 h-20 md:w-[84px] md:h-[84px] bg-[#0c2340] text-white rounded-full flex flex-col items-center justify-center shrink-0 border border-indigo-950/25 shadow-sm select-none">
            <span className="font-serif font-black text-2xl tracking-tighter">AGT</span>
            <span className="text-[5.5px] font-black uppercase tracking-widest text-[#94a3b8] mt-1 text-center leading-none">
              Tributária
            </span>
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              {isEditingNameInline ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className="bg-slate-50 border border-slate-200 text-xs font-bold text-[#0c2340] px-2.5 py-1 rounded-lg outline-none max-w-[140px]"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveGeneralConfig(); }}
                    autoFocus
                  />
                  <button 
                    onClick={handleSaveGeneralConfig}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border-none bg-transparent cursor-pointer font-bold text-[10px]"
                  >
                    OK
                  </button>
                  <button 
                    onClick={() => { setTempName(assistantName); setIsEditingNameInline(false); }}
                    className="p-1 text-slate-400 hover:bg-slate-50 rounded border-none bg-transparent cursor-pointer font-bold text-[10px]"
                  >
                    ESC
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-[#0c2340] tracking-tight m-0 leading-none">{assistantName}</h2>
                  <button
                    onClick={() => setIsEditingNameInline(true)}
                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-[#0c2340] rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                    title="Editar Nome do Assistente"
                  >
                    <Pencil size={13} className="stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>
            
            <p className="text-xs text-slate-700 font-bold leading-relaxed max-w-md">
              {description}
            </p>

            {/* Badges Informativos organized horizontally like Image 2 */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="text-indigo-600 bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <Bot size={14} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider leading-none">Modelo</span>
                  <span className="font-extrabold text-[#0c2340] text-xs block mt-0.5">{model}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-purple-600 bg-purple-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <Globe size={14} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider leading-none">Idioma</span>
                  <span className="font-extrabold text-[#0c2340] text-xs block mt-0.5">Português</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-slate-500 bg-slate-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <Sliders size={14} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider leading-none">Temp</span>
                  <span className="font-extrabold text-[#0c2340] text-xs block mt-0.5">{temperature}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-emerald-600 bg-emerald-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider leading-none">Estado</span>
                  <span className="font-bold text-emerald-700 text-xs block mt-0.5">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARTÃO 2: ESTATÍSTICAS (Right) */}
        <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 pb-1">
            <span className="text-xs font-black text-[#0c2340] tracking-widest uppercase">
              ESTATÍSTICAS
            </span>

            {/* Simulated monthly Filter dropdown */}
            <div className="relative">
              <select className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer outline-none appearance-none pr-8 transition-colors">
                <option>Este mês</option>
                <option>Últimos 3 meses</option>
                <option>Ano corrente</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px] font-bold">
                ▼
              </span>
            </div>
          </div>

          {/* 4 Internal statistics cards with custom distinct themes and details matching design */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Conversations stats card (Lilac/Violet block) */}
            <div className="bg-[#FAF9FF] border border-[#0c2340]/15 rounded-xl p-3.5 text-left hover:shadow-2xs transition-shadow">
              <div className="w-8 h-8 bg-purple-100 text-[#534980] rounded-lg flex items-center justify-center mb-2 shadow-2xs">
                <MessageSquare size={16} className="stroke-[2.5]" />
              </div>
              <span className="block font-black text-xl text-[#0c2340] tracking-tight leading-none">1.248</span>
              <span className="text-[10px] font-extrabold text-[#534980] uppercase tracking-tight mt-1.5 block">Conversas</span>
            </div>

            {/* Users stats card (Blue/Sky block) */}
            <div className="bg-[#F8FAFF] border border-[#0c2340]/15 rounded-xl p-3.5 text-left hover:shadow-2xs transition-shadow">
              <div className="w-8 h-8 bg-sky-100 text-[#284a7a] rounded-lg flex items-center justify-center mb-2 shadow-2xs">
                <Users size={16} className="stroke-[2.5]" />
              </div>
              <span className="block font-black text-xl text-[#0c2340] tracking-tight leading-none">865</span>
              <span className="text-[10px] font-extrabold text-[#284a7a] uppercase tracking-tight mt-1.5 block">Utilizadores</span>
            </div>

            {/* Resolutions stats card (Green/Emerald block) */}
            <div className="bg-[#F5FDF8] border border-[#0c2340]/15 rounded-xl p-3.5 text-left hover:shadow-2xs transition-shadow">
              <div className="w-8 h-8 bg-emerald-100 text-[#1e6136] rounded-lg flex items-center justify-center mb-2 shadow-2xs">
                <CheckCircle2 size={16} className="stroke-[2.5]" />
              </div>
              <span className="block font-black text-xl text-[#0c2340] tracking-tight leading-none">92%</span>
              <span className="text-[10px] font-extrabold text-[#1e6136] uppercase tracking-tight mt-1.5 block">Resoluções</span>
            </div>

            {/* Average time stats card (Orange/Amber block) */}
            <div className="bg-[#FFFDF9] border border-[#0c2340]/15 rounded-xl p-3.5 text-left hover:shadow-2xs transition-shadow">
              <div className="w-8 h-8 bg-amber-100 text-[#7c542c] rounded-lg flex items-center justify-center mb-2 shadow-2xs">
                <Clock size={16} className="stroke-[2.5]" />
              </div>
              <span className="block font-black text-xl text-[#0c2340] tracking-tight leading-none">2m 34s</span>
              <span className="text-[10px] font-extrabold text-[#7c542c] uppercase tracking-tight mt-1.5 block">Tempo médio</span>
            </div>
          </div>
        </div>
      </div>

      {/* MENU DE NAVEGAÇÃO HORIZONTAL */}
      <div className="w-full flex items-center border-b border-slate-200 mt-2 gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'config', label: 'Configuração Geral', icon: Settings, color: '#4f46e5' },
          { id: 'instructions', label: 'Instruções da IA', icon: FileText, color: '#4f46e5' },
          { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen, color: '#4f46e5' },
          { id: 'tools', label: 'Ferramentas Autorizadas', icon: Activity, color: '#4f46e5' },
          { id: 'history', label: 'Histórico de Conversas', icon: MessageSquare, color: '#4f46e5' },
          { id: 'test', label: 'Testar Assistente', icon: Bot, color: '#4f46e5' },
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-150 shrink-0 border-b-2 cursor-pointer bg-transparent outline-none ${
                isActive 
                  ? 'border-[#4f46e5] text-[#4f46e5] font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-850'
              }`}
            >
              <IconComponent 
                size={14} 
                className="shrink-0"
                style={{ color: isActive ? tab.color : 'currentColor' }}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC VIEWS ACCORDING TO NAVIGATION MENU */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* SUB-VIEW 1: Configuração Geral */}
          {activeSubTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* COLUNA 1 - CONFIGURAÇÃO GERAL */}
              <div className="lg:col-span-1 flex flex-col justify-between bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs gap-5">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black text-[#0c2340] tracking-wider uppercase">
                      CONFIGURAÇÃO GERAL
                    </h3>
                  </div>

                  {/* Nome do Assistente Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Nome do Assistente
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl px-4 py-3 text-xs font-semibold text-[#0c2340] outline-none transition-all shadow-sm"
                      placeholder="Ex: Assistente AGT"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>

                  {/* Descrição Textarea */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Descrição do Assistente
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none transition-all leading-relaxed resize-none shadow-sm"
                      placeholder="Descreva a função operativa..."
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                    />
                  </div>

                  {/* Model, Temp, and Language */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                        Modelo de IA
                      </label>
                      <select
                        className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl px-3 py-3 text-xs font-bold text-[#0c2340] outline-none cursor-pointer shadow-sm"
                        value={tempModel}
                        onChange={(e) => setTempModel(e.target.value)}
                      >
                        <option value="GPT-4o">GPT-4o (Standard)</option>
                        <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                        <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                        Temperatura
                      </label>
                      <select
                        className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl px-3 py-3 text-xs font-bold text-[#0c2340] outline-none cursor-pointer shadow-sm"
                        value={tempTemperature}
                        onChange={(e) => setTempTemperature(e.target.value)}
                      >
                        <option value="0.0">0.0 (Preciso)</option>
                        <option value="0.2">0.2 (Tributário)</option>
                        <option value="0.5">0.5 (Equilibrado)</option>
                        <option value="0.8">0.8 (Criativo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Idioma de Resposta
                    </label>
                    <select
                      className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl px-4 py-3 text-xs font-bold text-[#0c2340] outline-none cursor-pointer shadow-sm"
                      value={tempLanguage}
                      onChange={(e) => setTempLanguage(e.target.value)}
                    >
                      <option value="Português (Portugal)">Português (Portugal)</option>
                      <option value="Português (Angola)">Português (Angola)</option>
                      <option value="Inglês (UK)">Inglês (UK)</option>
                      <option value="Francês">Francês</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveGeneralConfig}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-md shadow-indigo-650/15"
                  >
                    Guardar Alterações
                  </button>
                </div>
              </div>

              {/* COLUNA 2 - CONFIGURAÇÃO DA IA - Divided in two cards */}
              <div className="lg:col-span-1 flex flex-col justify-between gap-6">
                
                {/* CARD 1: INSTRUÇÕES DA IA */}
                <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs flex flex-col justify-between flex-1 gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-black text-[#0c2340] tracking-wider uppercase">
                        INSTRUÇÕES DA IA
                      </h3>
                    </div>

                    <textarea
                      rows={6}
                      className="w-full bg-white border border-[#0c2340]/15 focus:border-[#0c2340] rounded-xl p-3.5 text-xs font-mono font-bold text-slate-800 outline-none tracking-tight leading-relaxed resize-none flex-1 min-h-[140px] shadow-sm"
                      value={tempInstructions}
                      onChange={(e) => setTempInstructions(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-600 uppercase tracking-wider pl-1">
                      <span>{tempInstructions.length} / 2000 caracteres</span>
                      <span className="text-emerald-500 font-black">Homologado</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveInstructions}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
                    >
                      Guardar Instruções
                    </button>
                  </div>
                </div>

                {/* CARD 2: CONTEXTO AUTOMÁTICO */}
                <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <h3 className="text-sm font-black text-[#0c2340] tracking-wider uppercase">
                      CONTEXTO AUTOMÁTICO
                    </h3>
                    <HelpCircle size={15} className="text-[#6366f1] cursor-pointer" title="Permissões internas que sustentam o conhecimento contextuais do contribuinte" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    {[
                      { key: 'readMail', label: 'Ler Correspondência' },
                      { key: 'readProcessStatus', label: 'Ler Estado dos Processos' },
                      { key: 'readTaxpayerData', label: 'Ler Dados do Contribuinte' },
                      { key: 'readSchedules', label: 'Ler Agendamentos' },
                      { key: 'readHistory', label: 'Ler Histórico de Interações' },
                      { key: 'readAttachments', label: 'Ler Documentos Anexos' }
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setContextConfig({
                          ...contextConfig,
                          [item.key as any]: !contextConfig[item.key as keyof typeof contextConfig]
                        })}
                        className="flex items-start gap-2 text-left bg-transparent border-none cursor-pointer select-none py-1 group outline-none"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          contextConfig[item.key as keyof typeof contextConfig]
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-300 group-hover:border-slate-450'
                        }`}>
                          {contextConfig[item.key as keyof typeof contextConfig] && (
                            <Check size={11} className="stroke-[3.5]" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 select-none group-hover:text-slate-800 transition-colors uppercase tracking-tight leading-tight">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* COLUNA 3 - TESTAR ASSISTENTE - Chat simulator console */}
              <div className="lg:col-span-1 flex flex-col justify-between bg-white border border-[#0c2340]/15 rounded-[20px] p-5 shadow-xs relative">
                
                {/* Top Action area of Chat */}
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    TESTAR ASSISTENTE
                  </span>
                  
                  {/* Clean conversations buttons */}
                  <button
                    onClick={() => {
                      setChatMessages([
                        {
                          id: `init-${Date.now()}`,
                          sender: 'bot',
                          text: `Olá! Eu sou o ${assistantName}. Como posso lhe esclarecer sobre NIF, impostos ou multas tributárias hoje?`,
                          time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
                        }
                      ]);
                      triggerToast('Sessão de simulação limpa.', 'info');
                    }}
                    className="text-slate-400 hover:text-[#0c2340] hover:bg-slate-50 px-2 py-1 rounded transition-colors uppercase font-black text-[9px] tracking-widest bg-transparent border-none cursor-pointer inline-flex items-center gap-1.5"
                    type="button"
                    title="Limpar Conversas"
                  >
                    <Trash2 size={11} />
                    <span>Limpar</span>
                  </button>
                </div>

                {/* Chat dialog content area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 space-y-3.5">
                  {chatMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {!isUser && (
                          <div className="w-6 h-6 bg-[#0c2340] text-white rounded-lg flex items-center justify-center shrink-0 text-[7px] font-black uppercase border border-slate-200 shadow-3xs select-none">
                            AGT
                          </div>
                        )}
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#f3e8ff] text-[#0c2340] border border-purple-100 rounded-tr-none text-right font-medium'
                            : (msg.sender === 'bot' && (msg.text.includes("Para obter o NIF") || (msg.text.includes("Bilhete de Identidade") && msg.text.includes("Comprovativo de Residência"))))
                              ? 'bg-[#0c2340] text-white rounded-tl-none font-bold whitespace-pre-line text-left shadow-md'
                              : 'bg-slate-100 text-slate-800 rounded-tl-none font-medium whitespace-pre-line text-left'
                        }`}>
                          <p className="m-0 break-words">{msg.text}</p>
                          <div className={`mt-1 flex justify-end text-[7.5px] font-mono leading-none ${
                            isUser 
                              ? 'text-purple-400' 
                              : (msg.sender === 'bot' && (msg.text.includes("Para obter o NIF") || (msg.text.includes("Bilhete de Identidade") && msg.text.includes("Comprovativo de Residência"))))
                                ? 'text-slate-300' 
                                : 'text-slate-400'
                          } font-bold select-none`}>
                            <span>{msg.time}</span>
                            {isUser && msg.delivered && <span className="ml-1 text-purple-600 font-bold">✔✔</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing simulated indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-[#0c2340] text-white rounded-lg flex items-center justify-center shrink-0 text-[7px] font-black uppercase">
                        AGT
                      </div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-none px-3.5 py-2.5">
                        <div className="flex gap-1 items-center justify-center py-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Dedicated Form Input control */}
                <div className="border-t border-slate-50 pt-2 shrink-0 space-y-1.5">
                  <div className="relative">
                    <input
                      required
                      type="text"
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#0c2340] rounded-xl pl-3.5 pr-10 py-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 font-medium"
                      placeholder="Escreva a sua pergunta..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendTestChatMessage(); }}
                    />
                    
                    <button
                      type="button"
                      onClick={handleSendTestChatMessage}
                      disabled={!chatInput.trim()}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
                    >
                      <Send size={11} className="stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="text-center pt-0.5">
                    <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase select-none inline-flex items-center gap-1.5">
                      ⚡ Powered by IA Correio Digital
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SUB-VIEW 2: Editor Completo de Instruções (Expanded Layout focus) */}
          {activeSubTab === 'instructions' && (
            <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                <div>
                  <h3 className="text-base font-black text-[#0c2340] tracking-tight m-0">INSTRUÇÕES MESTRE DO AGENTE IA</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Defina o tom de voz, regras de validação legal e os limites de operação assistida.</p>
                </div>
                <span className="bg-purple-100 text-[#6366f1] px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider self-start sm:self-auto shadow-3xs">
                  Modo Expandido
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                
                {/* Guidelines information banner */}
                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl space-y-4">
                  <span className="block text-[10px] font-black text-slate-450 tracking-wider uppercase">RECOMENDAÇÕES LEGAIS</span>
                  
                  <div className="p-3.5 bg-white border border-[#0c2340]/15 rounded-lg space-y-2">
                    <span className="font-extrabold text-[11px] text-[#0c2340] uppercase">1. Imparcialidade e Limitação</span>
                    <p className="text-[11px] leading-relaxed text-slate-500 m-0">O atendente virtual não pode sugerir formas alternativas de evasão fiscal ou fornecer auditorias humanas de livre julgamento.</p>
                  </div>

                  <div className="p-3.5 bg-white border border-[#0c2340]/15 rounded-lg space-y-2">
                    <span className="font-extrabold text-[11px] text-[#0c2340] uppercase">2. Custódia de Sigilo</span>
                    <p className="text-[11px] leading-relaxed text-slate-500 m-0">A IA deve orientar o contribuinte a não enviar faturas bancárias ou senhas de acesso diretamente no chat, direcionando ao correio oficial quando necessário.</p>
                  </div>

                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-2">
                    <AlertCircle size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[10.5px] font-bold text-indigo-700 leading-normal m-0 uppercase pl-0.5">
                      As regras modificadas passam a vigorar imediatamente após salvar.
                    </p>
                  </div>
                </div>

                {/* Code editor feel prompt instructions */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-slate-450 font-mono text-[10px] uppercase select-none">
                      <FileCode size={13} className="text-[#a855f7]" />
                      <span>instrucoes_assistente_agt.json</span>
                    </div>
                    <textarea
                      rows={14}
                      className="w-full bg-transparent border-0 text-amber-200/95 font-mono text-xs focus:outline-none focus:ring-0 leading-relaxed py-3 resize-none font-bold"
                      value={tempInstructions}
                      onChange={(e) => setTempInstructions(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-semibold text-[11px] text-slate-500 uppercase tracking-wide">
                    <span>{tempInstructions.length} / 2000 caracteres no diretório de sistema</span>
                    
                    <button
                      type="button"
                      onClick={handleSaveInstructions}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer shadow-md inline-flex items-center gap-2 justify-center"
                    >
                      <CheckCircle size={14} />
                      <span>Salvar Novas Instruções</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUB-VIEW 3: Base de Conhecimento (Durable legistation indexer) */}
          {activeSubTab === 'knowledge' && (
            <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div>
                  <h3 className="text-base font-black text-[#0c2340] tracking-tight m-0">BIBLIOTECA DE LEGISLAÇÃO CONTEXTUAL</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Adicione decretos tributários, manuais operacionais de auditoria e tabelas oficiais para fins de indexação.</p>
                </div>

                <button
                  type="button"
                  onClick={handleUploadDummyFile}
                  className="px-5 py-3 bg-[#0c2340] hover:bg-[#152e4d] text-white rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer border-none"
                >
                  <Plus size={15} />
                  <span>Anexar Legislação</span>
                </button>
              </div>

              {/* Grid document entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {knowledgeFiles.map(file => (
                  <div key={file.id} className="bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl p-4 flex items-center justify-between transition-colors select-none">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-[#3b82f6] rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={20} className="stroke-[2.5]" />
                      </div>
                      <div className="truncate space-y-0.5">
                        <h4 className="font-extrabold text-[#0c2340] text-xs truncate max-w-[240px] m-0 uppercase tracking-tight">{file.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 m-0 uppercase tracking-tight">
                          {file.size} • Upload em {file.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {file.status === 'Processado' ? (
                        <span className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 rounded-md text-[8.5px] font-black px-2 py-0.5 uppercase tracking-wide">
                          Indexado
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[8.5px] font-black px-2 py-0.5 uppercase tracking-wide animate-pulse">
                          Processando
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteFile(file.id, file.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        title="Remover documento"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state conditional */}
              {knowledgeFiles.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <BookOpen size={40} className="mx-auto text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider m-0">Nenhum documento anexado ao assistente</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Carregue publicações do Diário da República para sustentar as respostas da inteligência artificial.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 4: Ferramentas Autorizadas (Integrations and active gateways) */}
          {activeSubTab === 'tools' && (
            <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-50 text-left">
                <h3 className="text-base font-black text-[#0c2340] tracking-tight m-0">FERRAMENTAS OPERACIONAIS E APIS DA IA</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Determine quais rotas e webservices integrados da sua instituição o assistente pode executar de forma autónoma.</p>
              </div>

              {/* API list block items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {tools.map(tool => (
                  <div key={tool.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-200 text-slate-700 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {tool.category}
                        </span>
                        {tool.active && (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-[#0c2340] text-xs m-0 uppercase tracking-tight">{tool.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed m-0">
                        {tool.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleTool(tool.id)}
                      className="shrink-0 p-1 bg-transparent border-none cursor-pointer self-end sm:self-auto outline-none"
                      title={tool.active ? 'Bloquear ferramenta' : 'Autorizar ferramenta'}
                    >
                      {tool.active ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 select-none">ATIVO</span>
                          <ToggleRight size={28} className="text-emerald-500" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">BLOQUEADO</span>
                          <ToggleLeft size={28} className="text-slate-350" />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: Histórico de Conversas (Past queries and ratings) */}
          {activeSubTab === 'history' && (
            <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div>
                  <h3 className="text-base font-black text-[#0c2340] tracking-tight m-0">DIÁRIO DE INTERACÇÕES DA IA</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Audite as conversações iniciadas por cidadãos através do portal e confira o nível de satisfação retornado.</p>
                </div>
                
                <div className="flex items-center bg-slate-150 border border-slate-200.5 rounded-lg px-3 py-1.5 gap-2 max-w-xs self-start sm:self-auto">
                  <Search size={14} className="text-slate-450" />
                  <input
                    type="text"
                    placeholder="Filtrar por nome ou BI..."
                    className="bg-transparent border-0 text-xs font-bold text-slate-700 outline-none w-full placeholder:text-slate-400 lowercase pr-1"
                  />
                </div>
              </div>

              {/* Table list log items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9.5px]">
                      <th className="py-3 px-4 pl-1">Cidadão / Contribuinte</th>
                      <th className="py-3 px-4">BI do Contribuinte</th>
                      <th className="py-3 px-4">Tópico Inicial</th>
                      <th className="py-3 px-4 text-center">Mensagens</th>
                      <th className="py-3 px-4 text-center">Satisfação</th>
                      <th className="py-3 px-4 text-right">Data / Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interactionLogs.map(log => (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 pl-1 font-extrabold text-[#0c2340] uppercase tracking-tight">
                          {log.citizenName}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          {log.bi}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600">
                          {log.topic}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {log.messagesCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            log.satisfaction === 'Alta' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : log.satisfaction === 'Média'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {log.satisfaction}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-450 uppercase text-[10px]">
                          {log.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 6: Testar Assistente (Full page expansive chat console) */}
          {activeSubTab === 'test' && (
            <div className="bg-white border border-[#0c2340]/15 rounded-[20px] p-6 shadow-xs max-w-4xl mx-auto space-y-5">
              <div className="pb-3 border-b border-slate-50 text-left flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#0c2340] tracking-tight m-0">SALA DE TESTE DO INTELIGÊNCIA ARTIFICIAL</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-0.5">Simule uma experiência real de conversação. O assistente usará as bases instaladas.</p>
                </div>

                <button
                  onClick={() => {
                    setChatMessages([
                      {
                        id: `init-${Date.now()}`,
                        sender: 'bot',
                        text: `Olá! Eu sou o ${assistantName}. Como posso lhe esclarecer sobre NIF, impostos ou multas tributárias hoje?`,
                        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
                      }
                    ]);
                    triggerToast('Sessão reiniciada.', 'info');
                  }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#0c2340] font-black text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Limpar Diálogo</span>
                </button>
              </div>

              {/* Central high resolution chat stack */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200/70 p-5 h-[380px] overflow-y-auto custom-scrollbar flex flex-col space-y-4">
                {chatMessages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-8 h-8 bg-[#0c2340] text-white rounded-full flex items-center justify-center shrink-0 font-black text-[10px] uppercase tracking-tighter shadow select-none">
                          AGT
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] rounded-[18px] px-4 py-3 text-xs leading-relaxed shadow-3xs text-left ${
                        isUser 
                          ? 'bg-[#f3e8ff] hover:bg-indigo-100 text-[#0c2340] border border-purple-100/60 rounded-tr-none font-semibold'
                          : 'bg-white text-slate-850 rounded-tl-none font-medium whitespace-pre-line border border-slate-150'
                      }`}>
                        <p className="m-0 select-text leading-relaxed">{msg.text}</p>
                        <div className={`mt-1.5 flex justify-end text-[7.5px] font-mono leading-none ${
                          isUser ? 'text-purple-400' : 'text-slate-400'
                        } font-black select-none`}>
                          <span>{msg.time}</span>
                          {isUser && msg.delivered && <span className="ml-1 text-purple-600">✔✔</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#0c2340] text-white rounded-full flex items-center justify-center shrink-0 font-black text-[10px] uppercase tracking-tighter">
                      AGT
                    </div>
                    <div className="bg-white rounded-[18px] rounded-tl-none px-4.5 py-3 border border-slate-150 shadow-3xs flex items-center">
                      <div className="flex gap-1 items-center justify-center py-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Entry panel bottom */}
              <div className="pt-2 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200.5 focus:border-[#0c2340] rounded-xl pl-4 pr-12 py-3 text-xs text-slate-850 font-semibold outline-none transition-all placeholder:text-slate-400"
                    placeholder="Escreva a sua pergunta sobre as operações tributárias..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendTestChatMessage(); }}
                  />

                  <button
                    onClick={handleSendTestChatMessage}
                    disabled={!chatInput.trim() || isTyping}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border-none shadow-sm"
                  >
                    <Send size={13} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* RODAPÉ INFORMATIVO (BOTTOM INFORMATION CHIPS) */}
      <div className="bg-[#f0f9ff] border border-sky-100 rounded-xl p-4 flex items-center gap-3 text-left">
        <Sparkles size={18} className="text-[#6366f1] shrink-0" />
        <p className="text-xs text-sky-800 font-extrabold m-0 uppercase tracking-tight">
          As alterações feitas serão aplicadas imediatamente ao assistente da sua instituição nos canais oficiais de Sandbox e Correio Digital.
        </p>
      </div>

      {/* THE COMPREHENSIVE FLOATING WEB CHAT PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-[#0c2340]/40 backdrop-blur-xs z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="bg-white rounded-[24px] border border-[#0c2340]/15 shadow-2xl w-full max-w-md h-[550px] flex flex-col justify-between overflow-hidden relative"
            >
              {/* Modal chat Header */}
              <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between select-none">
                <div className="flex items-center gap-3 text-left">
                  {/* Avatar circular */}
                  <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none uppercase tracking-tighter border border-white/20">
                    AGT
                  </div>
                  
                  <div>
                    <h4 className="font-extrabold text-[#f8fafc] text-xs m-0 tracking-tight">{assistantName}</h4>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none block mt-0.5">
                      ● Assistente Governamental
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                  title="Fechar pré-visualização"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Model chat body scrolling messages */}
              <div className="flex-1 bg-slate-50/65 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                {previewMessages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-6.5 h-6.5 bg-[#0c2340] text-white rounded-full flex items-center justify-center shrink-0 text-[8px] font-black uppercase shadow select-none">
                          AGT
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-3 text-xs leading-relaxed text-left shadow-3xs ${
                        isUser
                          ? 'bg-purple-100 text-[#0c2340] border border-purple-200/40 rounded-tr-none font-semibold'
                          : (msg.sender === 'bot' && (msg.text.includes("Para obter o NIF") || (msg.text.includes("Bilhete de Identidade") && msg.text.includes("Comprovativo de Residência"))))
                            ? 'bg-[#0c2340] text-white rounded-tl-none font-bold whitespace-pre-line shadow-md'
                            : 'bg-white text-slate-800 rounded-tl-none font-semibold whitespace-pre-line border border-slate-150'
                      }`}>
                        <p className="m-0 leading-relaxed">{msg.text}</p>
                        <span className={`block text-[7.5px] font-mono leading-none ${
                          isUser 
                            ? 'text-purple-400' 
                            : (msg.sender === 'bot' && (msg.text.includes("Para obter o NIF") || (msg.text.includes("Bilhete de Identidade") && msg.text.includes("Comprovativo de Residência"))))
                              ? 'text-slate-300' 
                              : 'text-slate-400'
                        } mt-1 text-right font-black select-none`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isPreviewTyping && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-6.5 h-6.5 bg-[#0c2340] text-white rounded-full flex items-center justify-center shrink-0 text-[8px] font-black uppercase">
                      AGT
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 border border-slate-150 shadow-3xs">
                      <div className="flex gap-1 items-center justify-center py-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={previewChatBottomRef} />
              </div>

              {/* Modal chat bottom input bar */}
              <div className="p-3.5 bg-white border-t border-slate-100 space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-[#f8fafc] border border-slate-205 focus:border-[#0c2340] rounded-xl pl-3.5 pr-10 py-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 font-bold"
                    placeholder="Escreva a sua pergunta tributária..."
                    value={previewInput}
                    onChange={(e) => setPreviewInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendPreviewMessage(); }}
                  />

                  <button
                    onClick={handleSendPreviewMessage}
                    disabled={!previewInput.trim() || isPreviewTyping}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0c2340] hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-all border-none cursor-pointer"
                  >
                    <Send size={11} className="stroke-[2.5]" />
                  </button>
                </div>
                <div className="text-center pt-1 select-none">
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">
                    Administração Geral Tributária — Correio Oficial
                  </span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
