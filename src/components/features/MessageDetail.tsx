/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  ShieldCheck, 
  FileText, 
  Info,
  Fingerprint,
  QrCode,
  Tag,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  Hash,
  Inbox,
  Eye,
  CheckCircle,
  MessageSquare,
  Search,
  CheckSquare,
  XCircle,
  AlertOctagon,
  Archive,
  CornerUpRight,
  GitCommit,
  History,
  Bell,
  Scroll,
  Receipt,
  Megaphone,
  FolderOpen,
  Landmark,
  Key,
  Award,
  User,
  Coins,
  Scale,
  Lock,
  EyeOff,
  Share2,
  Paperclip,
  Send,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Message, SENSITIVITY_LEVELS, SensitivityConfig, PRIORITY_CONFIGS } from '../../types';
import { generateProtocol, generateTimelineEvents, getCategoryMetadata } from '../../utils/protocolGenerator';
import { GovernmentAIPanel } from './GovernmentAIPanel';

const STATE_STYLING: Record<string, { bg: string; text: string; border: string; bgDot: string; textIcon: string }> = {
  'Recebida': { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200', bgDot: 'bg-slate-150', textIcon: 'text-slate-600' },
  'Entregue': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-100', bgDot: 'bg-blue-100/60', textIcon: 'text-blue-600' },
  'Visualizada': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-100', bgDot: 'bg-teal-100/60', textIcon: 'text-teal-600' },
  'Confirmada': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-100', bgDot: 'bg-indigo-100/60', textIcon: 'text-indigo-600' },
  'Respondida': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-100', bgDot: 'bg-purple-100/60', textIcon: 'text-purple-600' },
  'Em análise': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100', bgDot: 'bg-amber-150', textIcon: 'text-amber-600' },
  'Aprovada': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-100', bgDot: 'bg-emerald-100/65', textIcon: 'text-emerald-600' },
  'Rejeitada': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-100', bgDot: 'bg-red-100/60', textIcon: 'text-red-650' },
  'Contestada': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-100', bgDot: 'bg-rose-100/60', textIcon: 'text-rose-650' },
  'Expirada': { bg: 'bg-zinc-50', text: 'text-zinc-800', border: 'border-zinc-200', bgDot: 'bg-zinc-150', textIcon: 'text-zinc-600' },
  'Arquivada': { bg: 'bg-neutral-50', text: 'text-neutral-800', border: 'border-neutral-200', bgDot: 'bg-neutral-155', textIcon: 'text-neutral-600' },
  'Encaminhada': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-100', bgDot: 'bg-sky-110', textIcon: 'text-sky-600' },
};

const CATEGORY_STYLING: Record<string, {
  bg: string;
  text: string;
  border: string;
  badge: string;
  circleBg: string;
  circleBorder: string;
}> = {
  'Notificação': {
    bg: 'bg-indigo-50 border-indigo-100 text-indigo-800',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100/70 text-indigo-850',
    circleBg: 'bg-indigo-600 text-white',
    circleBorder: 'border-indigo-600 ring-indigo-100',
  },
  'Ofício': {
    bg: 'bg-slate-50 border-slate-200 text-slate-800',
    text: 'text-slate-800',
    border: 'border-slate-300',
    badge: 'bg-slate-100/70 text-slate-850',
    circleBg: 'bg-slate-600 text-white',
    circleBorder: 'border-slate-500 ring-slate-100',
  },
  'Multa': {
    bg: 'bg-rose-50 border-rose-100 text-rose-800',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badge: 'bg-rose-100/75 text-rose-850 border-rose-200',
    circleBg: 'bg-rose-600 text-white',
    circleBorder: 'border-rose-500 ring-rose-100',
  },
  'Fatura': {
    bg: 'bg-amber-50 border-amber-100 text-amber-800',
    text: 'text-amber-805',
    border: 'border-amber-200',
    badge: 'bg-amber-100/70 text-amber-800',
    circleBg: 'bg-amber-650 text-white',
    circleBorder: 'border-amber-500 ring-amber-100',
  },
  'Convocatória': {
    bg: 'bg-purple-50 border-purple-100 text-purple-800',
    text: 'text-purple-800',
    border: 'border-purple-200',
    badge: 'bg-purple-100/70 text-purple-850',
    circleBg: 'bg-purple-600 text-white',
    circleBorder: 'border-purple-500 ring-purple-100',
  },
  'Processo Administrativo': {
    bg: 'bg-cyan-50 border-cyan-100 text-cyan-800',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100/70 text-cyan-850',
    circleBg: 'bg-cyan-600 text-white',
    circleBorder: 'border-cyan-500 ring-cyan-100',
  },
  'Documento Bancário': {
    bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100/70 text-emerald-850',
    circleBg: 'bg-emerald-600 text-white',
    circleBorder: 'border-emerald-500 ring-emerald-100',
  },
  'Declaração': {
    bg: 'bg-teal-50 border-teal-150 text-teal-800',
    text: 'text-teal-805',
    border: 'border-teal-200',
    badge: 'bg-teal-100/70 text-teal-850',
    circleBg: 'bg-teal-600 text-white',
    circleBorder: 'border-teal-500 ring-teal-100',
  },
  'Licença': {
    bg: 'bg-lime-50 border-lime-150 text-lime-900',
    text: 'text-lime-900',
    border: 'border-lime-200',
    badge: 'bg-lime-100/70 text-lime-900',
    circleBg: 'bg-lime-600 text-white',
    circleBorder: 'border-lime-500 ring-lime-100',
  },
  'Certificado': {
    bg: 'bg-orange-50 border-orange-100 text-orange-800',
    text: 'text-orange-805',
    border: 'border-orange-200',
    badge: 'bg-orange-100/70 text-orange-850',
    circleBg: 'bg-orange-605 text-white',
    circleBorder: 'border-orange-500 ring-orange-100',
  },
  'Petição do Cidadão': {
    bg: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-800',
    text: 'text-fuchsia-800',
    border: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100/65 text-fuchsia-850',
    circleBg: 'bg-fuchsia-600 text-white',
    circleBorder: 'border-fuchsia-500 ring-fuchsia-100',
  },
  'Documento Fiscal': {
    bg: 'bg-pink-50 border-pink-100 text-pink-800',
    text: 'text-pink-805',
    border: 'border-pink-200',
    badge: 'bg-pink-100/70 text-pink-850',
    circleBg: 'bg-pink-600 text-white',
    circleBorder: 'border-pink-500 ring-pink-100',
  },
  'Documento Judicial': {
    bg: 'bg-zinc-100 border-zinc-200 text-zinc-900',
    text: 'text-zinc-900',
    border: 'border-zinc-300',
    badge: 'bg-zinc-200 text-zinc-900',
    circleBg: 'bg-zinc-600 text-white',
    circleBorder: 'border-zinc-500 ring-zinc-100',
  }
};

function renderCategoryIcon(iconName: string, size = 16) {
  switch (iconName) {
    case 'Bell': return <Bell size={size} />;
    case 'Scroll': return <Scroll size={size} />;
    case 'ShieldAlert': return <ShieldAlert size={size} />;
    case 'Receipt': return <Receipt size={size} />;
    case 'Megaphone': return <Megaphone size={size} />;
    case 'FolderOpen': return <FolderOpen size={size} />;
    case 'Landmark': return <Landmark size={size} />;
    case 'CheckSquare': return <CheckSquare size={size} />;
    case 'Key': return <Key size={size} />;
    case 'Award': return <Award size={size} />;
    case 'User': return <User size={size} />;
    case 'Coins': return <Coins size={size} />;
    case 'Scale': return <Scale size={size} />;
    default: return <FileText size={size} />;
  }
}

function renderStateIcon(state: string, size = 14) {
  switch (state) {
    case 'Recebida': return <Inbox size={size} />;
    case 'Entregue': return <Check size={size} />;
    case 'Visualizada': return <Eye size={size} />;
    case 'Confirmada': return <CheckCircle size={size} />;
    case 'Respondida': return <MessageSquare size={size} />;
    case 'Em análise': return <Search size={size} />;
    case 'Aprovada': return <CheckSquare size={size} />;
    case 'Rejeitada': return <XCircle size={size} />;
    case 'Contestada': return <AlertOctagon size={size} />;
    case 'Expirada': return <Clock size={size} />;
    case 'Arquivada': return <Archive size={size} />;
    case 'Encaminhada': return <CornerUpRight size={size} />;
    default: return <GitCommit size={size} />;
  }
}

interface MessageDetailProps {
  selectedMessage: Message;
  setSelectedMessage: (msg: Message | null) => void;
  setTab: (tab: string) => void;
  handleReply: (msg: Message) => void;
  onUpdateMessage?: (msg: Message) => void;
}

export function MessageDetail({
  selectedMessage,
  setSelectedMessage,
  setTab,
  handleReply,
  onUpdateMessage,
}: MessageDetailProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showQRValidation, setShowQRValidation] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // States for the 8 official government actions requested
  const [activeOfficialAction, setActiveOfficialAction] = useState<string | null>(null);
  const [successProtocol, setSuccessProtocol] = useState<{
    protocolNumber: string;
    actionName: string;
    details: string;
    timestamp: string;
    digitalSeal: string;
    documentHash: string;
  } | null>(null);

  const [replyText, setReplyText] = useState('');
  const [confirmReadCheckbox, setConfirmReadCheckbox] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState('BI-DIGITAL');
  const [signaturePin, setSignaturePin] = useState('');
  const [signatureDraw, setSignatureDraw] = useState(false);
  const [revisionReason, setRevisionReason] = useState('Divergência de Valores');
  const [revisionJustification, setRevisionJustification] = useState('');
  const [contestJustification, setContestJustification] = useState('');
  const [contestCategory, setContestCategory] = useState('Atos Administrativos');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileBase64, setAttachedFileBase64] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('2026-05-25');
  const [scheduleMode, setScheduleMode] = useState('Videoconferência');
  const [scheduleLocation, setScheduleLocation] = useState('Posto Central AGT (Luanda)');
  const [forwardTarget, setForwardTarget] = useState('Ministério das Finanças');
  const [forwardJustification, setForwardJustification] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const handleOfficialActionSubmit = (actionName: string) => {
    setIsSubmittingAction(true);
    
    setTimeout(() => {
      const newProtocol = generateProtocol(
        selectedMessage.org,
        'message',
        selectedMessage.id,
        `${actionName}: ${selectedMessage.details?.subject || selectedMessage.preview}`
      );
      const now = new Date();
      const timestampStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const dmyStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const fullTimestamp = `${dmyStr} ${timestampStr}`;

      let detailsText = '';
      let auditLogAction = '';
      let newState = selectedMessage.details?.state || 'Recebida';

      if (actionName === 'Responder') {
        detailsText = `Resposta oficial enviada com o seguinte teor: "${replyText.substring(0, 80)}${replyText.length > 80 ? '...' : ''}"`;
        auditLogAction = `Resposta Oficial submetida via Plataforma (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Respondida';
        setReplyText('');
      } else if (actionName === 'Confirmar leitura') {
        detailsText = `Leitura confirmada oficialmente sob termo de responsabilidade civil e administrativa.`;
        auditLogAction = `Aviso de Receção e Leitura Confirmada (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Visualizada';
        setConfirmReadCheckbox(false);
      } else if (actionName === 'Assinar documento') {
        detailsText = `Documento assinado digitalmente com sucesso usando credenciais ${signatureMethod} (PIN autenticado).`;
        auditLogAction = `Assinatura Digital Qualificada aposta (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Aprovada';
        setSignaturePin('');
        setSignatureDraw(false);
      } else if (actionName === 'Solicitar revisão') {
        detailsText = `Solicitada revisão de conteúdo pelo motivo: ${revisionReason}. Justificação: "${revisionJustification.substring(0, 70)}..."`;
        auditLogAction = `Pedido de Revisão Administrativa: ${revisionReason} (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Em análise';
        setRevisionJustification('');
      } else if (actionName === 'Contestação') {
        detailsText = `Contestação formal interposta na categoria: ${contestCategory}. Fundamentação: "${contestJustification.substring(0, 70)}..."`;
        auditLogAction = `Contestação e Impugnação Administrativa registada (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Contestada';
        setContestJustification('');
      } else if (actionName === 'Anexar documento') {
        detailsText = `Documento "${attachedFileName || 'comprovativo_oficial.pdf'}" anexado e armazenado com custódia segura do Estado.`;
        auditLogAction = `Documento Anexo submetido: ${attachedFileName || 'comprovativo_oficial.pdf'} (Prot: ${newProtocol.protocolNumber})`;
        setAttachedFileName('');
        setAttachedFileBase64(null);
      } else if (actionName === 'Agendar atendimento') {
        detailsText = `Atendimento agendado para o dia ${scheduleDate} por via ${scheduleMode} em ${scheduleLocation}.`;
        auditLogAction = `Agendamento de Atendimento Oficial registado para ${scheduleDate} - ${scheduleLocation} (Prot: ${newProtocol.protocolNumber})`;
      } else if (actionName === 'Encaminhar pedido') {
        detailsText = `Processo/Correspondência encaminhada formalmente para: ${forwardTarget}. Nota de despacho: "${forwardJustification.substring(0, 60)}..."`;
        auditLogAction = `Encaminhamento de Pedido deferido para ${forwardTarget} (Prot: ${newProtocol.protocolNumber})`;
        newState = 'Encaminhada';
        setForwardJustification('');
      }

      const logEntry = `${timestampStr} - ${auditLogAction}`;
      const updatedLogs = [...(selectedMessage.auditLogs || []), logEntry];

      if (onUpdateMessage) {
        onUpdateMessage({
          ...selectedMessage,
          details: selectedMessage.details ? {
            ...selectedMessage.details,
            state: newState
          } : undefined,
          auditLogs: updatedLogs
        });
      }

      setSuccessProtocol({
        protocolNumber: newProtocol.protocolNumber,
        actionName,
        details: detailsText,
        timestamp: fullTimestamp,
        digitalSeal: newProtocol.digitalSeal,
        documentHash: newProtocol.documentHash
      });

      setIsSubmittingAction(false);
      setActiveOfficialAction(null);
    }, 1500);
  };

  const sensitivityLevel = selectedMessage.sensitivity || 'Público';
  const sensConfig = SENSITIVITY_LEVELS[sensitivityLevel];

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [shareBlockedNotice, setShareBlockedNotice] = useState<string | null>(null);

  const messagePriority = selectedMessage.priorityScale || 'Normal';
  const prioConfig = PRIORITY_CONFIGS[messagePriority];
  const [deadlineSecondsLeft, setDeadlineSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (selectedMessage.deadlineHoursRemaining !== undefined) {
      setDeadlineSecondsLeft(selectedMessage.deadlineHoursRemaining * 3600);
    } else {
      setDeadlineSecondsLeft(null);
    }
  }, [selectedMessage.id, selectedMessage.deadlineHoursRemaining]);

  useEffect(() => {
    if (deadlineSecondsLeft === null) return;
    if (deadlineSecondsLeft <= 0) return;

    const interval = setInterval(() => {
      setDeadlineSecondsLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineSecondsLeft]);

  const formatDeadlineRemaining = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    // Satisfy exact requested phrase "Prazo restante: 48 horas" when minutes & seconds are 0
    if (mins === 0 && secs === 0) {
      return `Prazo restante: ${hrs} horas`;
    }
    return `Prazo restante: ${hrs} horas, ${mins}m e ${secs}s`;
  };

  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const addAuditLogToMessage = (actionName: string) => {
    if (!onUpdateMessage) return;
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const logText = `${formattedTime} - ${actionName}`;
    const currentLogs = selectedMessage.auditLogs || [];
    if (currentLogs.includes(logText)) return;
    const updatedMsg = {
      ...selectedMessage,
      auditLogs: [...currentLogs, logText]
    };
    onUpdateMessage(updatedMsg);
  };

  useEffect(() => {
    setIsSessionExpired(false);
    setIsReauthenticating(false);
    setShareBlockedNotice(null);
    
    if (sensConfig && sensConfig.sessionTimeoutSeconds > 0) {
      setTimeLeft(sensConfig.sessionTimeoutSeconds);
    } else {
      setTimeLeft(null);
    }
  }, [selectedMessage.id, sensitivityLevel]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setIsSessionExpired(true);
      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const logText = `${formattedTime} - Sessão expirada (${sensConfig.level})`;
      if (onUpdateMessage) {
        const currentLogs = selectedMessage.auditLogs || [];
        if (!currentLogs.some(log => log.includes('Sessão expirada'))) {
          onUpdateMessage({
            ...selectedMessage,
            auditLogs: [...currentLogs, logText]
          });
        }
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, selectedMessage.id]);

  const handleReauthenticate = () => {
    setIsReauthenticating(true);
    setTimeout(() => {
      setIsReauthenticating(false);
      setIsSessionExpired(false);
      if (sensConfig && sensConfig.sessionTimeoutSeconds > 0) {
        setTimeLeft(sensConfig.sessionTimeoutSeconds);
      }
      addAuditLogToMessage(`Acesso renovado via BI Digital (${sensConfig.level})`);
    }, 2000);
  };

  useEffect(() => {
    const hasVisualized = selectedMessage.auditLogs?.some(log => log.includes('Documento visualizado'));
    if (!hasVisualized) {
      addAuditLogToMessage('Documento visualizado');
    }
  }, [selectedMessage.id]);

  const triggerVerification = () => {
    setShowQRValidation(true);
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
    }, 850);
  };

  const protocol = selectedMessage.protocol || generateProtocol(
    selectedMessage.org,
    'message',
    selectedMessage.id,
    selectedMessage.details?.subject || selectedMessage.preview
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => {
            setTab('correspondencias');
            setSelectedMessage(null);
          }}
          className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <button 
          onClick={() => {
            if (sensConfig.level === 'Ultra Restrito') {
              setShareBlockedNotice('Bloqueado: Política de Controle de Compartilhamento proíbe reencaminhar ou responder a documentos de nível Ultra Restrito.');
              setTimeout(() => setShareBlockedNotice(null), 5000);
              return;
            }
            addAuditLogToMessage('Resposta enviada');
            handleReply(selectedMessage);
          }}
          className={`px-4 py-2 rounded-xl font-extrabold text-sm transition-all active:scale-95 flex items-center gap-1.5 ${
            sensConfig.level === 'Ultra Restrito' 
              ? 'text-red-500 bg-red-50 hover:bg-red-100/30' 
              : 'text-primary hover:bg-primary/5'
          }`}
        >
          {sensConfig.level === 'Ultra Restrito' && <Lock size={14} />}
          {sensConfig.level === 'Ultra Restrito' ? 'Responder Bloqueado' : 'Responder'}
        </button>
      </div>

      {shareBlockedNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold"
        >
          <Lock size={16} className="text-red-500 shrink-0 animate-pulse" />
          <span>{shareBlockedNotice}</span>
        </motion.div>
      )}

      {/* SENSITIVITY HEADER INFOBAR */}
      <div className={`p-4 rounded-2xl border ${sensConfig.borderColor} ${sensConfig.badgeBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${sensConfig.dotColor} text-white flex items-center justify-center shrink-0 shadow-sm`}>
            <Lock size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sensibilidade Documental</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${sensConfig.textColor} bg-white shadow-xs border ${sensConfig.borderColor} flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sensConfig.dotColor} animate-ping`} />
                {sensConfig.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-xl">{sensConfig.accessRules}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {timeLeft !== null && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-dotted border-slate-200 shadow-xs font-mono">
              <Clock size={13} className={timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
              <span className="text-[10.5px] font-black text-slate-700">
                SESSÃO: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
          
          {sensConfig.screenshotProtection && (
            <div className="bg-white/80 border border-slate-150 rounded-xl px-2 py-1.5 flex items-center gap-1.5 text-[10px] text-slate-750 font-bold shrink-0">
              <EyeOff size={11} className="text-indigo-600 animate-pulse" />
              <span className="uppercase tracking-wider">Proteção Ecrã</span>
            </div>
          )}
        </div>
      </div>

      <section className={`border border-line rounded-2xl p-5 bg-white shadow-sm relative overflow-hidden select-none print:hidden ${sensConfig.screenshotProtection ? 'selection:bg-transparent' : ''}`}>
        <AnimatePresence mode="wait">
          {activeOfficialAction ? (
            <motion.div
              key="official-action-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
                <button
                  type="button"
                  onClick={() => {
                    setActiveOfficialAction(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="text-left">
                  <h4 className="font-extrabold text-[#111A2E] text-sm md:text-base flex items-center gap-1.5 uppercase tracking-wide">
                     Trâmite Oficial: {activeOfficialAction}
                  </h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black leading-none mt-0.5">
                     Formalização Digital com Validade Jurídica
                  </p>
                </div>
              </div>

              {/* Responder Form */}
              {activeOfficialAction === 'Responder' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
                    Configure a sua resposta formal. O envio deste formulário regista automaticamente um novo protocolo governamental associado ao seu processo.
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Corpo do Ofício de Resposta</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Introduza a sua mensagem de resposta formal aqui..."
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-indigo-500 shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Confirmar leitura Form */}
              {activeOfficialAction === 'Confirmar leitura' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
                     A confirmação de leitura oficial constitui um documento oficial de <strong className="text-slate-900">Aviso de Receção (AR)</strong> que comprova legalmente perante o órgão emissor que tomou conhecimento integral dos termos deste documento.
                  </div>

                  <label className="flex items-start gap-3 bg-indigo-50/40 border border-indigo-150 p-4 rounded-2xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmReadCheckbox}
                      onChange={(e) => setConfirmReadCheckbox(e.target.checked)}
                      className="mt-1 w-4.5 h-4.5 rounded text-primary focus:ring-0 active:scale-95 transition-all text-xs"
                    />
                    <div className="text-xs font-bold text-slate-700 leading-relaxed">
                       Declaro formalmente, para todos os efeitos de lei civil e administrativa, que efetuei a leitura integral e compreendi todos os prazos, obrigações e termos jurídicos descritos nesta correspondência oficial emitida por <strong className="text-primary">{selectedMessage.org}</strong>.
                    </div>
                  </label>
                </div>
              )}

              {/* Assinar documento Form */}
              {activeOfficialAction === 'Assinar documento' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-650 leading-relaxed font-semibold">
                     Aplique a sua assinatura digital qualificada ao documento em conformidade com as normas regulamentares de identidade digital de Angola.
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Canal Chave de Identidade</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSignatureMethod('BI-DIGITAL')}
                        className={`p-3 rounded-2xl border text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all ${
                          signatureMethod === 'BI-DIGITAL' 
                            ? 'bg-primary border-primary text-white shadow shadow-primary/25' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Fingerprint size={16} /> Key Móvel BI Digital
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignatureMethod('ICP-AO')}
                        className={`p-3 rounded-2xl border text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all ${
                          signatureMethod === 'ICP-AO' 
                            ? 'bg-primary border-primary text-white shadow shadow-primary/25' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Lock size={16} /> Certificado ICP-AO
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block text-center">Código PIN Governamental (4 dígitos)</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={signaturePin}
                      onChange={(e) => setSignaturePin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-sm font-black font-mono tracking-[0.5em] w-32 focus:outline-none focus:border-indigo-500 block mx-auto"
                    />
                  </div>

                  <div className="border border-slate-200 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50">
                    <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest mb-1">Rubricar Assinatura Criptográfica</div>
                    <div 
                      onClick={() => setSignatureDraw(true)}
                      className="w-full h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center cursor-crosshair text-[11px] text-slate-500 font-semibold"
                    >
                      {signatureDraw ? (
                        <span className="font-mono text-[10px] text-slate-800 font-extrabold flex items-center gap-1.5">
                          ✍︎ {selectedMessage.org.replace(/[^a-zA-Z ]/g, "").substring(0, 10)}... Rubrica Eletrónica Ativa
                        </span>
                      ) : (
                        <span>Clique para autenticar rubrica manuscrita digitalizada</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Solicitar revisão Form */}
              {activeOfficialAction === 'Solicitar revisão' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-650 leading-relaxed font-semibold">
                     Submeta um pedido de revisão administrativa caso identifique dados incorretos, valores em divergência ou erros fundamentais de processamento de facto.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Motivo Fundamental</label>
                    <select
                      value={revisionReason}
                      onChange={(e) => setRevisionReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="Divergência de Valores">Divergência de Valores / Montantes</option>
                      <option value="Dados de Identificação Incorretos">Dados de Identificação Incorretos</option>
                      <option value="Inconformidade Legal Fundamentada">Inconformidade Legal Fundamentada</option>
                      <option value="Duplicidade de Notificação Tributária">Duplicidade de Notificação Tributária</option>
                      <option value="Outro Motivo Administrativo">Outro Motivo Administrativo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Exposição dos Factos Fundamentados</label>
                    <textarea
                      value={revisionJustification}
                      onChange={(e) => setRevisionJustification(e.target.value)}
                      placeholder="Descreva minuciosamente a sua reclamação fundamentada..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs md:text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Contestação Form */}
              {activeOfficialAction === 'Contestação' && (
                <div className="space-y-4">
                  <div className="bg-red-50/50 border border-red-200 p-4 rounded-2xl text-xs text-red-855 leading-relaxed font-semibold flex gap-2.5 items-start">
                    <AlertTriangle size={18} className="text-red-500 shrink-0" />
                    <span>
                      A interposição de contestação oficial perante atos administrativos suspende os prazos de execução sob as leis de contencioso fiscal em vigor. Os seus dados e termos de fundamentação serão enviados diretamente à Procuradoria Geral.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Enquadramento Especial Jurídico</label>
                    <select
                      value={contestCategory}
                      onChange={(e) => setContestCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-705 focus:outline-none"
                    >
                      <option value="Atos Administrativos Legais">Atos Administrativos Legais / Desoneração</option>
                      <option value="Sanções e Multas Pecuniárias">Sanções e Multas Pecuniárias / Coimas</option>
                      <option value="Cobrança Fiscal Coativa AGT">Cobrança Fiscal Coativa AGT</option>
                      <option value="Decisões de Titularidade Pública">Decisões de Titularidade Pública / Caducidades</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Substanciação da Defesa</label>
                    <textarea
                      value={contestJustification}
                      onChange={(e) => setContestJustification(e.target.value)}
                      placeholder="Indique as irregularidades ou vícios de forma que anulam o ato administrativo..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs md:text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Anexar documento Form */}
              {activeOfficialAction === 'Anexar documento' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-650 leading-relaxed font-semibold">
                    Anexe documentos comprovativos adicionais de sustentação da sua correspondência oficial em formato digital certificado.
                  </div>

                  <div className="border border-slate-200 border-dashed rounded-2xl p-6 bg-slate-50/50 text-center flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/[0.05] transition-all cursor-pointer relative">
                    <input
                      type="file"
                      id="gov-file-uploader-nested"
                      accept=".pdf,.jpeg,.jpg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAttachedFileName(file.name);
                        }
                      }}
                    />
                    <Paperclip size={22} className="text-slate-400 mb-2 animate-bounce" />
                    <span className="text-[11px] font-black text-slate-700 block uppercase">Selecionar Ficheiro Oficial</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">PDF, JPG ou PNG em custódia até 15MB</span>
                    
                    {attachedFileName && (
                      <div className="mt-4 bg-emerald-50 text-emerald-800 text-xs font-black uppercase inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-3xs">
                        <Check size={12} /> {attachedFileName} (Carregado com Sucesso)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agendar atendimento Form */}
              {activeOfficialAction === 'Agendar atendimento' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-650 leading-relaxed font-semibold md:col-span-2">
                     Agende uma sessão presencial ou virtual assistida com o técnico representativo designado pelo órgão correspondente.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Data Escolhida</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Modo de Sessão</label>
                    <select
                      value={scheduleMode}
                      onChange={(e) => setScheduleMode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700"
                    >
                      <option value="Videoconferência">Videoconferência Segura SEPE</option>
                      <option value="Presencial Assistido">Presencial Físico Assistido</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Posto Avançado / Balcão</label>
                    <select
                      value={scheduleLocation}
                      onChange={(e) => setScheduleLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700"
                    >
                      <option value="Posto Central AGT (Luanda)">Posto Central AGT (Luanda)</option>
                      <option value="Balcão Único do Cidadão - Talatona">Balcão Único do Cidadão - Talatona</option>
                      <option value="Gabinete de Atendimento Provincial de Benguela">Gabinete de Atendimento Provincial de Benguela</option>
                      <option value="Atendimento Digital Exclusivo">Atendimento Virtual Presencial (Câmaras SEPE)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Encaminhar pedido Form */}
              {activeOfficialAction === 'Encaminhar pedido' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
                    Despache e delegue a responsabilidade de análise desta correspondência oficial para outra entidade ou representante legal.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Destinação Governamental</label>
                    <select
                      value={forwardTarget}
                      onChange={(e) => setForwardTarget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700"
                    >
                      <option value="Ministério das Finanças">Ministério das Finanças (MINFIN)</option>
                      <option value="Procuradoria Geral da República">Procuradoria Geral da República (PGR)</option>
                      <option value="Gabinete do Governador de Luanda">Gabinete do Governador de Luanda</option>
                      <option value="Direção Geral da AGT">Direção Geral de Auditoria AGT</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Despacho de Encaminhamento</label>
                    <textarea
                      value={forwardJustification}
                      onChange={(e) => setForwardJustification(e.target.value)}
                      placeholder="Redija as notas de justificação e responsabilidade..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs md:text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Form buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setActiveOfficialAction(null)}
                  className="flex-1 py-3 bg-slate-100 font-extrabold text-xs text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-200 active:scale-95 transition-all uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isSubmittingAction || (activeOfficialAction === 'Responder' && !replyText) || (activeOfficialAction === 'Confirmar leitura' && !confirmReadCheckbox) || (activeOfficialAction === 'Assinar documento' && !signaturePin)}
                  onClick={() => handleOfficialActionSubmit(activeOfficialAction)}
                  className="flex-1 py-3 bg-primary font-black text-xs text-white rounded-xl shadow-lg hover:bg-primary/95 active:scale-95 transition-all text-center flex items-center justify-center gap-2 uppercase disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmittingAction ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      A PROCESSAR...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Submeter Trâmite
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : successProtocol ? (
            <motion.div
              key="official-action-success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="flex flex-col items-center text-center p-6 bg-emerald-50 border border-emerald-200 rounded-3xl relative overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-250 animate-bounce">
                  <Check size={26} strokeWidth={3} />
                </div>
                <h3 className="text-emerald-900 font-black text-sm uppercase tracking-wider leading-none">Trâmite Registado</h3>
                <p className="text-emerald-850 text-[9px] font-black mt-1 uppercase tracking-widest leading-none">Auto-Protocolo Governamental Ativo</p>
                <p className="text-slate-500 text-[10.5px] mt-2 max-w-sm leading-relaxed">
                  A sua ação de <strong>"{successProtocol.actionName}"</strong> foi registada e selada legalmente de forma imutável nos servidores centrais do Estado angolano.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-rose-100">
                  <div>
                    <span className="text-[9.5px] font-black tracking-widest text-slate-450 uppercase font-mono">REGISTO DE PROTOCOLO</span>
                    <div className="text-primary font-black text-sm font-mono tracking-tight mt-0.5">{successProtocol.protocolNumber}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-850 text-[8px] font-black px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider font-mono">
                    VERIFICADO
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase mb-0.5">Ação Efetuada</span>
                    <span className="font-extrabold text-slate-800 uppercase text-[10.5px]">{successProtocol.actionName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase mb-0.5">Data Registro Oficial</span>
                    <span className="font-extrabold text-slate-800 font-mono text-[10.5px]">{successProtocol.timestamp}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 block uppercase mb-0.5">Detalhes da Transação</span>
                    <p className="text-[11px] text-slate-600 font-bold mt-0.5 leading-relaxed bg-white border border-slate-150 p-2.5 rounded-lg font-mono">
                      {successProtocol.details}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 block uppercase mb-0.5">Assinatura Digital de Validação (Selo)</span>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg font-mono text-[8.5px] break-all border border-slate-850 truncate leading-none mt-0.5 flex items-center gap-1.5">
                      <Fingerprint size={10} className="text-emerald-400 shrink-0" />
                      {successProtocol.digitalSeal}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 block uppercase mb-0.5">Hash SHA-256 de Autoria</span>
                    <span className="font-mono text-[8.5px] text-slate-500 bg-white/70 p-1 rounded border border-slate-150 block break-all leading-none mt-0.5 truncate select-all">{successProtocol.documentHash}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSuccessProtocol(null)}
                className="w-full py-3.5 bg-primary hover:opacity-90 text-white font-black text-xs uppercase rounded-xl transition-all shadow-lg active:scale-95"
              >
                Concluir e Voltar
              </button>
            </motion.div>
          ) : activeAction ? (
            <motion.div 
              key="action-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-line">
                <button 
                  onClick={() => setActiveAction(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} className="text-slate-500" />
                </button>
                <div>
                  <h4 className="font-bold text-primary">{activeAction}</h4>
                  <p className="text-sm text-slate-600 uppercase tracking-wider">{selectedMessage.org}</p>
                </div>
              </div>

              {['Ver detalhes', 'Ler notificacao', 'Ler boletim', 'Abrir resultado', 'Ler resultado', 'Mais informacoes'].includes(activeAction) ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-line shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <FileText size={20} />
                      <span className="font-bold">Conteúdo do Documento</span>
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-medium mb-6">
                      {selectedMessage.details?.body}
                    </p>
                  </div>

                  {/* 13 MANDATORY DIGITAL PROTOCOL FIELDS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-rose-100">
                      <div>
                        <h4 className="font-black text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                          REGISTRO DE PROTOCOLO GOVERNAMENTAL
                        </h4>
                        <div className="text-primary font-black text-lg font-mono tracking-tight mt-1">
                          {protocol.protocolNumber}
                        </div>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                        <Fingerprint size={12} className="animate-pulse" />
                        PROTOCOLO VALIDADE DIGITAL
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 text-left">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">ID Interno</span>
                        <span className="text-xs font-mono font-bold text-slate-700">{protocol.internalId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Número de Protocolo</span>
                        <span className="text-xs font-mono font-black text-indigo-700">{protocol.protocolNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Instituição Emissora</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.issuerInstitution}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Data Oficial de Emissão</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.officialIssueDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Hora Oficial</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{protocol.officialTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Responsável Emissor</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.issuerResponsible}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Categoria</span>
                        <span className="text-xs font-bold text-primary">{protocol.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Tipo de Documento</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.documentType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Estado Atual</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.currentState}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Prioridade</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block ${
                          protocol.priority === 'Alta' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>{protocol.priority}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Data Limite</span>
                        <span className="text-xs font-bold text-slate-800">{protocol.deadlineDate}</span>
                      </div>
                    </div>

                    {/* INFO ADICIONAL DE CONTROLO DE PRAZO & CONSEQUÊNCIA */}
                    <div className="mt-6 p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex flex-col gap-3 text-xs text-slate-700 text-left">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-650 flex items-center gap-1">
                          <AlertTriangle size={13} className="text-amber-600" /> Prioridade & Prazos Oficiais ({prioConfig.priority})
                        </span>
                        {deadlineSecondsLeft !== null && (
                          <span className="font-mono text-[10px] font-black text-rose-650 animate-pulse bg-white border border-rose-100 px-2 py-0.5 rounded-md shadow-3xs uppercase">
                            {formatDeadlineRemaining(deadlineSecondsLeft)}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Consequência Administrativa</span>
                          <p className="text-[11px] leading-relaxed font-semibold italic text-slate-650 mt-0.5">"{prioConfig.consequence}"</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Notificações por Atraso</span>
                          <div className="space-y-0.5 mt-0.5">
                            {prioConfig.escalationLevels.map((lvl, idx) => (
                              <div key={idx} className="text-[10px] font-medium text-slate-600">• {lvl}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SEÇÃO DOCUMENTO VERIFICADO */}
                    <div className="pt-5 border-t border-slate-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-[0.05em] text-slate-900 leading-none">Documento Verificado</h4>
                          <p className="text-[10px] text-emerald-800 font-medium mt-0.5">Assinatura Digital Institucional Completa</p>
                        </div>
                        <span className="ml-auto bg-emerald-500 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded uppercase leading-none tracking-wider font-bold">
                          AUTÊNTICO & INTEGRAL
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium bg-emerald-50/40 p-4 border border-emerald-100/80 rounded-2xl">
                        <div>
                          <span className="text-slate-400 text-[9px] font-black uppercase block tracking-wider mb-0.5">Selo Digital Institucional</span>
                          <span className="font-mono text-slate-800 break-all">{protocol.digitalSeal}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] font-black uppercase block tracking-wider mb-0.5">Certificado Digital Emissor</span>
                          <span className="text-slate-850 font-bold">{protocol.institutionalCertificate}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-slate-400 text-[9px] font-black uppercase block tracking-wider mb-0.5">Hash de Integridade do Documento</span>
                          <span className="font-mono text-[10px] text-slate-700 bg-white/80 p-1.5 border border-emerald-100/50 rounded block break-all">{protocol.documentHash}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl">
                        <div className="flex-1 min-w-0 space-y-1.5 text-left">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assinatura Criptográfica Emissora</span>
                          <div className="bg-slate-900 text-slate-350 p-2.5 rounded-xl text-[10px] font-mono break-all border border-slate-850 flex items-center gap-2">
                            <Fingerprint size={14} className="text-emerald-400 shrink-0" />
                            <span className="text-slate-400">{protocol.digitalSignature}</span>
                          </div>
                        </div>
                        <div 
                          onClick={triggerVerification}
                          className="flex flex-col items-center shrink-0 border border-slate-200 bg-emerald-50/20 p-2 text-center rounded-xl shadow-sm cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-300 active:scale-95 transition-all group"
                        >
                          <img 
                            src={protocol.qrCodeUrl} 
                            alt="QR Protocolo"
                            className="w-16 h-16 object-contain transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[7.5px] font-mono text-emerald-700 uppercase mt-1.5 tracking-wider font-black flex items-center gap-1 leading-none">
                            <QrCode size={8} /> VALIDAR QR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AUTOMATIC TIMELINE OF CORRESPONDENCE EVENTS */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-750">
                          <History size={16} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">Cronologia & Estado da Correspondência</h4>
                          <p className="text-[10px] text-slate-400 font-bold leading-normal">Linha de vida governamental qualificada pelo protocolo</p>
                        </div>
                      </div>
                      <span className="bg-indigo-55 border border-indigo-110 px-2.5 py-0.5 rounded-full text-indigo-700 font-mono text-[9px] font-black">
                        {(selectedMessage.stateHistory || generateTimelineEvents(selectedMessage, protocol)).length} Estados
                      </span>
                    </div>

                    <div className="pl-1 pt-2 relative">
                      {/* Vertical line connecting all points */}
                      <div className="absolute left-[17px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200" />

                      <div className="space-y-6">
                        {(selectedMessage.stateHistory || generateTimelineEvents(selectedMessage, protocol)).map((evt, idx) => {
                          const config = STATE_STYLING[evt.state] || {
                            bg: 'bg-slate-50',
                            text: 'text-slate-800',
                            border: 'border-slate-200',
                            bgDot: 'bg-slate-150',
                            textIcon: 'text-slate-500'
                          };

                          return (
                            <div key={idx} className="relative pl-10 flex flex-col items-start text-left group">
                              {/* Left icon bubble */}
                              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white ${config.bgDot} flex items-center justify-center ${config.textIcon} shadow-sm z-10 transition-transform duration-300 group-hover:scale-110`}>
                                {renderStateIcon(evt.state, 13)}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* State chip */}
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border leading-none tracking-tight uppercase ${config.bg} ${config.text} ${config.border}`}>
                                  {evt.state}
                                </span>

                                {/* Timestamp */}
                                <span className="text-[9px] font-mono font-bold text-slate-400">
                                  {evt.date} às {evt.time}
                                </span>
                              </div>

                              {/* Responsible */}
                              <div className="mt-1 flex items-center gap-1.5 text-slate-600">
                                <UserCheck size={11} className="text-slate-450 shrink-0" />
                                <span className="text-[10px] font-bold text-slate-700 leading-none">
                                  {evt.responsible}
                                </span>
                              </div>

                              {/* Description */}
                              <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed max-w-xl">
                                {evt.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* COMPLETENESS AUDIT TRAIL LOGS */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 text-left">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                        <History size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">Registo Geral de Auditoria Governamental</h4>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">Histórico cronológico detalhado por ações operacionais</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-left bg-white p-4 border border-slate-150 rounded-2xl font-mono text-xs text-slate-700 shadow-sm max-h-48 overflow-y-auto">
                      {(selectedMessage.auditLogs || []).map((log, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2 py-1 border-b border-dashed border-slate-100 last:border-0 leading-relaxed">
                          <span className="text-emerald-650 font-black">▶</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                    <ShieldCheck size={24} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-bold text-primary mb-1">Documento Autenticado</p>
                      <p className="text-sm text-primary/70 leading-tight">
                        Este conteúdo foi extraído diretamente da base oficial do Estado Angolano e possui plena validade jurídica como prova digital.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-line">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Info size={20} className="text-primary" />
                      </div>
                      <div className="font-bold text-primary">Processando Solicitação</div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      A funcionalidade <strong>"{activeAction}"</strong> está a carregar os dados seguros da base governamental. 
                      Este processo garante que toda a informação apresentada é oficial e verificada em tempo real.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="p-4 border border-line rounded-xl flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700">Estado do Pedido</div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">Verificado</span>
                    </div>
                    <div className="p-4 border border-line rounded-xl flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700">Autenticação Digital</div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">Encriptado</span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setActiveAction(null)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {['Ver detalhes', 'Ler notificacao', 'Ler boletim', 'Abrir resultado', 'Ler resultado', 'Mais informacoes'].includes(activeAction) ? 'Fechar Leitura' : 'OK, Entendi'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="pb-3 border-b border-line mb-4">
                <h3 className="text-sm md:text-lg font-bold text-primary">{selectedMessage.org}</h3>
                <div className="text-slate-600 text-[10px] md:text-sm font-medium">
                  Canal oficial verificado
                </div>
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed font-medium text-[11px] md:text-base">{selectedMessage.preview}</p>
              
              {selectedMessage.details && (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-3xl border border-line p-5 md:p-8 shadow-sm flex flex-col items-start text-left">
                      <div className={`w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-5 md:mb-6 shadow-lg transition-transform hover:scale-105 ${
                        (selectedMessage.details.state?.toLowerCase().includes('pendente') ?? false) 
                        ? 'bg-orange-500 shadow-orange-100' 
                        : 'bg-green-500 shadow-green-100'
                      }`}>
                        {(selectedMessage.details.state?.toLowerCase().includes('pendente') ?? false) ? (
                          <Clock className="text-white w-7 h-7 md:w-12 md:h-12" />
                        ) : (
                          <Check className="text-white w-7 h-7 md:w-12 md:h-12" strokeWidth={3} />
                        )}
                      </div>
                      
                      <h3 className="text-base md:text-2xl font-extrabold text-primary mb-2">
                        {selectedMessage.details.subject}
                      </h3>
                      
                      <div className="w-full space-y-4 md:space-y-5 mb-8 text-left max-w-sm">
                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <Fingerprint size={16} className="text-indigo-600 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-indigo-600 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Nº Protocolo Nacional</small>
                            <div className="text-xs md:text-sm font-mono font-black text-indigo-700 truncate">{protocol.protocolNumber}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <Calendar size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Data Limite</small>
                            <div className="text-xs md:text-sm font-bold text-primary">{selectedMessage.details.deadline}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <Clock size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Estado do Documento</small>
                            <div className="text-xs md:text-sm font-bold text-orange-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                              {selectedMessage.details.state}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-700">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <MapPin size={16} className="text-slate-500 md:w-[18px] md:h-[18px]" />
                          </div>
                          <div>
                            <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Entidade Emissora</small>
                            <div className="text-xs md:text-sm font-bold text-primary leading-tight">{selectedMessage.org}</div>
                          </div>
                        </div>

                        {/* Tipo de Correspondência Oficial (Nova Seção) */}
                        {(() => {
                          const meta = getCategoryMetadata(protocol.category);
                          const style = CATEGORY_STYLING[meta.name] || CATEGORY_STYLING['Ofício'];
                          return (
                            <div className="flex items-start gap-3 md:gap-4 text-slate-700">
                              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 border ${style.border} ${style.badge}`}>
                                {renderCategoryIcon(meta.icon, 16)}
                              </div>
                              <div>
                                <small className="text-slate-500 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] block leading-none mb-1">Tipo de Correspondência</small>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                  <span className={`text-xs md:text-sm font-bold leading-none ${style.text}`}>{meta.name}</span>
                                  <span className="bg-red-50 border border-red-100 px-1.5 py-0.5 rounded text-[8px] font-bold text-red-650 tracking-wider font-mono uppercase">Prioridade: {meta.priority}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* PAINEL OFICIAL DE PRAZO E PRIORIDADE */}
                        <div className="w-full mt-6 pt-5 border-t border-slate-150 text-left space-y-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md ${prioConfig.dotColor} text-white flex items-center justify-center shadow`}>
                              <AlertTriangle size={13} />
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-900 leading-none">Prioridade e Prazo Governamental</h4>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">Controlo de prazos e trâmites de urgência regulamentar</p>
                            </div>
                            <span className={`ml-auto px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest leading-none ${prioConfig.textColor} ${prioConfig.badgeBg} ${prioConfig.borderColor}`}>
                              {prioConfig.priority}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5 text-xs text-slate-700 shadow-sm relative overflow-hidden">
                            {/* COUNTDOWN TIMER */}
                            {deadlineSecondsLeft !== null && (
                              <div className="flex items-center justify-between bg-white border border-dotted border-slate-300 p-2.5 rounded-xl">
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-mono">Registo Regressivo Ordinário</span>
                                <div className="flex items-center gap-1.5 font-mono text-[11px] font-black text-rose-650 animate-pulse">
                                  <Clock size={13} className="text-red-500 animate-pulse" />
                                  <span>{formatDeadlineRemaining(deadlineSecondsLeft)}</span>
                                </div>
                              </div>
                            )}

                            {/* PRAZO LIMITE */}
                            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-dashed border-slate-200">
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Prazo Limite</span>
                                <span className="font-bold text-slate-800">{selectedMessage.details.deadline || "Não Aplicável"}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Status Temporal</span>
                                <span className={`font-bold inline-flex items-center gap-1 text-[10px] uppercase ${messagePriority === 'Crítico' || messagePriority === 'Urgente' ? 'text-red-650 animate-pulse' : 'text-slate-600'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${messagePriority === 'Crítico' || messagePriority === 'Urgente' ? 'bg-red-500' : 'bg-slate-400'}`} />
                                  {messagePriority === 'Crítico' || messagePriority === 'Urgente' ? 'Ação Crítica Pedida' : 'Tramitação Normal'}
                                </span>
                              </div>
                            </div>

                            {/* CONSEQUÊNCIA POR ATRASO */}
                            <div>
                              <span className="text-[9px] font-black text-red-700/80 uppercase tracking-widest flex items-center gap-1">
                                ✦ Consequência Legal por Atraso:
                              </span>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-semibold italic">
                                "{prioConfig.consequence}"
                              </p>
                            </div>

                            {/* NOTIFICAÇÕES ESCALÁVEIS */}
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Escalonamento de Notificações Governamentais</span>
                              <div className="mt-1 space-y-1">
                                {prioConfig.escalationLevels.map((lvl, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-550 leading-relaxed font-semibold">
                                    <span className="text-slate-400 mt-0.5">•</span>
                                    <span>{lvl}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* ALERTAS AUTOMÁTICOS */}
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Alertas de Custódia Ativos</span>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {prioConfig.autoAlerts.map((alt, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 text-slate-650 px-2 py-0.5 rounded text-[9.5px] font-semibold tracking-tight shadow-3xs">
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fluxo operacional próprio da correspondência */}
                      {(() => {
                        const meta = getCategoryMetadata(protocol.category);
                        const style = CATEGORY_STYLING[meta.name] || CATEGORY_STYLING['Ofício'];
                        return (
                          <div className="w-full mt-6 pt-5 border-t border-slate-150 text-left">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">
                                Fluxo Operacional Registo ({meta.name})
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                4 Fases Regulamentares
                              </span>
                            </div>
                            
                            {/* Process line stepper */}
                            <div className="grid grid-cols-4 gap-1 items-start">
                              {meta.flow.map((step, sIdx) => {
                                const isPast = sIdx < 2; // simulated completed stages
                                const isCurrent = sIdx === 2;
                                return (
                                  <div key={sIdx} className="flex flex-col items-center text-center relative">
                                    {/* Lines connecting points */}
                                    {sIdx > 0 && (
                                      <div className={`absolute left-0 right-1/2 top-2.5 -translate-y-1/2 h-0.5 ${
                                        isPast ? style.circleBg : 'bg-slate-150'
                                      }`} />
                                    )}
                                    {sIdx < meta.flow.length - 1 && (
                                      <div className={`absolute left-1/2 right-0 top-2.5 -translate-y-1/2 h-0.5 ${
                                        isPast || isCurrent ? style.circleBg : 'bg-slate-150'
                                      }`} />
                                    )}
                                    
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center relative z-10 text-[9px] font-black leading-none transition-all ${
                                      isPast ? `${style.circleBg} shadow-sm` :
                                      isCurrent ? `${style.badge} border-2 ${style.circleBorder}` :
                                      'bg-slate-50 text-slate-400 border border-slate-200'
                                    }`}>
                                      {sIdx + 1}
                                    </div>
                                    <span className={`text-[9.5px] leading-tight font-black mt-2 max-w-[76px] break-words uppercase ${
                                      isCurrent ? style.text : isPast ? 'text-slate-650' : 'text-slate-400'
                                    }`}>
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* ESTABILIDADE JURÍDICA E COMPROVATIVOS DE VALIDADE */}
                      <div className="w-full mt-6 pt-5 border-t border-slate-150 text-left space-y-4">
                        {/* Legal Validity Banner */}
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 shadow-sm">
                          <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wide block">
                              DOCUMENTO LEGALMENTE VÁLIDO
                            </span>
                            <span className="text-[10px] text-emerald-700/90 font-bold block leading-relaxed">
                              Este documento possui validade legal. Em conformidade com a regulamentação ICP-Angola, este ato administrativo detém força probatória plena.
                            </span>
                          </div>
                        </div>

                        {/* 4 Differentiated States and Proofs */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono block">
                            Rastreabilidade e Comprovativos Oficiais
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* State 1: Entregue */}
                            <div className="bg-slate-50 border border-slate-205/60 rounded-xl p-3 flex flex-col justify-between space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider font-mono">1. Estado Transmissão</span>
                                <span className="bg-blue-100/80 text-blue-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none border border-blue-200">
                                  Entregue
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10.5px] font-bold text-slate-800 block">Comprovativo de Entrega</span>
                                <span className="text-[9.5px] text-slate-500 font-semibold block leading-tight">
                                  Gateway: Central Mailer [{protocol.internalId}]
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold block">
                                  Carimbo: {selectedMessage.date || '08:15 UTC'} - Verificado
                                </span>
                              </div>
                            </div>

                            {/* State 2: Visualizado */}
                            <div className="bg-slate-50 border border-slate-205/60 rounded-xl p-3 flex flex-col justify-between space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider font-mono">2. Estado Leitura</span>
                                <span className="bg-teal-100/80 text-teal-805 text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none border border-teal-200">
                                  Visualizado
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10.5px] font-bold text-slate-800 block">Comprovativo de Leitura</span>
                                <span className="text-[9.5px] text-slate-500 font-semibold block leading-tight">
                                  Dispositivo: Terminal BI-Digital Cripto
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold block">
                                  Carimbo: Leitura registada em tempo real
                                </span>
                              </div>
                            </div>

                            {/* State 3: Confirmado */}
                            <div className="bg-slate-50 border border-slate-205/60 rounded-xl p-3 flex flex-col justify-between space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider font-mono">3. Confirmação Oficial</span>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none border ${
                                  selectedMessage.details?.state?.toLowerCase().includes('pendente') 
                                    ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse' 
                                    : 'bg-indigo-100/80 text-indigo-800 border-indigo-200'
                                }`}>
                                  Confirmado
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10.5px] font-bold text-slate-800 block">Confirmação Oficial</span>
                                <span className="text-[9.5px] text-slate-500 font-semibold block leading-tight truncate">
                                  Protocolo: {protocol.protocolNumber}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold block">
                                  Carimbo Secundário: Selado com sucesso
                                </span>
                              </div>
                            </div>

                            {/* State 4: Assinado */}
                            <div className="bg-slate-50 border border-slate-205/60 rounded-xl p-3 flex flex-col justify-between space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider font-mono">4. Integridade da Assinatura</span>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none border ${
                                  (selectedMessage.details?.state?.toLowerCase().includes('pendente') || selectedMessage.details?.state === 'Pagamento pendente')
                                    ? 'bg-slate-100 text-slate-505 border-slate-200' 
                                    : 'bg-emerald-100/80 text-emerald-800 border-emerald-200'
                                }`}>
                                  {(selectedMessage.details?.state?.toLowerCase().includes('pendente') || selectedMessage.details?.state === 'Pagamento pendente') ? 'Pendente' : 'Assinado'}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10.5px] font-bold text-slate-800 block">Assinatura Eletrônica</span>
                                <span className="text-[9.5px] text-slate-550 font-semibold block leading-none font-mono truncate">
                                  ID: {protocol.digitalSignature.substring(0, 15)}...
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold block">
                                  Carimbo Temporal: Sincronizado ICP
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SEÇÃO DETALHES DE AUTENTICAÇÃO */}
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 text-[10px] font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">Selo Digital Institucional</span>
                            <span className="font-mono text-slate-705 break-all text-[9.5px]">{protocol.digitalSeal}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">Certificado Emissor Homologado</span>
                            <span className="text-slate-705 font-bold text-[9.5px]">{protocol.institutionalCertificate}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">Hash SHA-256 de Custódia</span>
                            <span className="font-mono text-[9px] text-slate-700 break-all block truncate">{protocol.documentHash}</span>
                          </div>
                        </div>
                      </div>

                      {/* HISTÓRICO DE AUDITORIA COMPLETO COESÃO */}
                      <div className="w-full mt-6 pt-5 border-t border-slate-150 text-left space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shadow">
                            <History size={13} className="text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-900 leading-none">Histórico de Auditoria Digital</h4>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">Registos automatizados e imutáveis de ações regulamentares</p>
                          </div>
                          <span className="ml-auto bg-slate-900 text-emerald-400 font-mono text-[8px] font-black px-1.5 py-0.5 rounded border border-slate-800 uppercase leading-none tracking-wider">
                            AUDITADO
                          </span>
                        </div>
                        <div className="bg-slate-900 text-slate-300 p-3.5 border border-slate-850 rounded-2xl font-mono text-[10.5px] leading-relaxed space-y-1.5 max-h-40 overflow-y-auto shadow-inner">
                          {(selectedMessage.auditLogs || []).map((log, lIdx) => (
                            <div key={lIdx} className="flex items-start gap-2 py-0.5 border-b border-slate-800 last:border-0">
                              <span className="text-emerald-400 shrink-0 font-black">▶</span>
                              <span className="break-all">{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveAction('Ver detalhes')}
                        className="w-full py-3.5 md:py-4 rounded-2xl bg-primary text-white font-bold text-xs md:text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Ver detalhes
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-3xl border border-line/60 lg:w-[320px] shrink-0">
                      <div className="text-xs font-extrabold text-slate-600 uppercase tracking-[0.2em] mb-4 md:mb-6">QR CODE DE PROTOCOLO</div>
                      <div 
                        onClick={triggerVerification}
                        className="p-3 md:p-4 bg-white border border-line/40 rounded-2xl shadow-md group relative overflow-hidden text-center w-full cursor-pointer hover:border-emerald-350 hover:bg-emerald-50/10 transition-all active:scale-95 flex flex-col items-center justify-center"
                      >
                        <motion.img 
                          src={protocol.qrCodeUrl} 
                          alt="QR Code Seguro" 
                          className="w-40 h-40 md:w-48 md:h-48 object-contain transition-transform duration-500 group-hover:scale-105 mx-auto"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-[9px] font-mono text-indigo-700 font-extrabold uppercase mt-3 tracking-widest break-all">
                          {protocol.protocolNumber}
                        </div>
                        <span className="text-[8px] font-mono text-emerald-700 uppercase mt-2 tracking-wider font-extrabold flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">
                          <QrCode size={9} /> CLIQUE PARA VALIDAR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Government AI Assistance Expansion Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAIPanel(!showAIPanel);
                      addAuditLogToMessage(`Activou IA Governamental para mensagem: ${selectedMessage.details?.subject || selectedMessage.preview}`);
                    }}
                    className={`w-full mt-6 p-4 md:p-5 rounded-[24px] border transition-all flex items-center justify-between shadow-lg active:scale-98 ${
                      showAIPanel 
                        ? 'bg-primary text-white border-primary shadow-primary/25' 
                        : 'bg-gradient-to-r from-indigo-50/70 to-[#eff6ff] border-blue-200/60 hover:border-blue-300 text-primary shadow-blue-900/5'
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${showAIPanel ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
                           <Sparkles size={18} className={showAIPanel ? 'animate-spin' : 'animate-pulse'} />
                        </div>
                        <div className="text-left font-sans">
                           <span className="font-extrabold text-xs md:text-sm uppercase tracking-wider block">Resumo Inteligente (IA)</span>
                           <span className={`text-[9px] md:text-xs font-bold block ${showAIPanel ? 'text-white/75' : 'text-slate-500'}`}>
                              {showAIPanel ? 'Ocultar Análise de IA' : 'Resumir, Explicar termos, Auto-Classificar e Detetar Urgência'}
                           </span>
                        </div>
                     </div>
                     <ArrowRight size={18} className={`transition-transform duration-300 ${showAIPanel ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAIPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-6"
                      >
                        <GovernmentAIPanel 
                          documentTitle={selectedMessage.details?.subject || selectedMessage.preview}
                          rawText={`ASSUNTO CONTEÚDO OFICIAL: ${selectedMessage.details?.subject || selectedMessage.preview}
Orgão Emissor: ${selectedMessage.org}
Estado Oficial Declarado: ${selectedMessage.status}
Detalhamento de Corpo de Mensagem:
${selectedMessage.details?.body || ''}`}
                          contextType="message"
                          onLogMsg={(action, type) => addAuditLogToMessage(action)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 border-t border-slate-100 mt-6 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <small className="text-secondary text-sm font-black tracking-widest uppercase text-indigo-700">Trâmites e Ações Oficiais (Efeito Legal)</small>
                      <div className="flex-1 h-px bg-slate-150" />
                    </div>
                    <div id="gov-official-actions-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {[
                        { name: 'Responder', icon: MessageSquare, color: 'text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 border-indigo-200' },
                        { name: 'Confirmar leitura', icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 border-emerald-200' },
                        { name: 'Assinar documento', icon: ShieldCheck, color: 'text-teal-700 bg-teal-50/60 hover:bg-teal-100 border-teal-200' },
                        { name: 'Solicitar revisão', icon: RefreshCw, color: 'text-amber-700 bg-amber-50/60 hover:bg-amber-100 border-amber-200' },
                        { name: 'Contestação', icon: Scale, color: 'text-rose-700 bg-rose-50/60 hover:bg-rose-100 border-rose-200' },
                        { name: 'Anexar documento', icon: Paperclip, color: 'text-slate-700 bg-slate-50/60 hover:bg-slate-100 border-slate-200' },
                        { name: 'Agendar atendimento', icon: Calendar, color: 'text-cyan-700 bg-cyan-50/60 hover:bg-cyan-100 border-cyan-200' },
                        { name: 'Encaminhar pedido', icon: CornerUpRight, color: 'text-violet-700 bg-violet-50/60 hover:bg-violet-100 border-violet-200' }
                      ].map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={idx}
                            id={`gov-action-btn-${idx}`}
                            onClick={() => {
                              // Security verification for Ultra Restrito level
                              if (sensConfig.level === 'Ultra Restrito' && (item.name === 'Responder' || item.name === 'Encaminhar pedido')) {
                                setShareBlockedNotice('Bloqueado: Política de Controle de Compartilhamento proíbe reencaminhar ou responder a documentos de nível Ultra Restrito.');
                                setTimeout(() => setShareBlockedNotice(null), 5000);
                                return;
                              }
                              setActiveOfficialAction(item.name);
                            }}
                            className={`flex flex-col items-center justify-center p-4 border rounded-2xl text-[11px] font-black uppercase text-center transition-all hover:scale-[1.02] hover:shadow-xs active:scale-95 gap-2 cursor-pointer ${item.color}`}
                          >
                            <IconComponent size={18} strokeWidth={2.5} />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <small className="text-slate-400 text-sm font-bold tracking-widest uppercase">Acções Complementares</small>
                      <div className="flex-1 h-px bg-line/30" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedMessage.details.actions.filter(act => act !== 'Ver detalhes').map((act, i) => (
                        <button 
                          key={i} 
                          onClick={() => {
                            setActiveAction(act);
                            const lowerAct = act.toLowerCase();
                            if (lowerAct.includes('baixar') || lowerAct.includes('download') || lowerAct.includes('comprovativo')) {
                              addAuditLogToMessage('Download efetuado');
                            } else if (lowerAct.includes('responder') || lowerAct.includes('resposta')) {
                              addAuditLogToMessage('Resposta enviada');
                            } else if (lowerAct.includes('encaminhar') || lowerAct.includes('partilhar')) {
                              addAuditLogToMessage('Correspondência encaminhada');
                            } else if (lowerAct.includes('confirmar') || lowerAct.includes('aprovar') || lowerAct.includes('pagar') || lowerAct.includes('pagamento')) {
                              addAuditLogToMessage('Documento aprovado');
                            } else if (lowerAct.includes('arquivar')) {
                              addAuditLogToMessage('Arquivamento efetuado');
                            }
                          }}
                          className="flex-1 whitespace-nowrap min-w-[140px] bg-white border border-primary/10 text-primary rounded-xl py-3.5 px-4 text-xs font-bold hover:bg-primary/5 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WATERMARK SECURE OVERLAY */}
        {sensConfig.screenshotProtection && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none grid grid-cols-2 sm:grid-cols-3 gap-8 p-4 overflow-hidden z-25" style={{ transform: 'rotate(-12deg) scale(1.15)' }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="font-mono text-[9px] font-black uppercase text-slate-900 whitespace-nowrap text-center tracking-widest leading-none">
                009874562LA041<br/>
                GOV_CORREIO_COPIAPROIBIDA<br/>
                {sensConfig.level} LEVEL
              </div>
            ))}
          </div>
        )}

        {/* SCREENSHOT BLUR Defocus Guard */}
        {!isWindowFocused && sensConfig.screenshotProtection && (
          <div className="absolute inset-0 bg-slate-200/90 backdrop-blur-lg z-40 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-3 shadow-md">
              <EyeOff size={22} className="text-red-500" />
            </div>
            <h3 className="text-slate-900 font-mono font-black text-sm uppercase tracking-wider">Visualização Suspensa</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-xs leading-relaxed">Proteção ativa contra captura de ecrã para documentos {sensConfig.level}. Volte a focar a janela para continuar.</p>
          </div>
        )}

        {/* EXPIRATION SESSION LOCK OVERLAY */}
        {isSessionExpired && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4 animate-bounce">
              <Lock size={32} />
            </div>
            <h3 className="text-white font-mono font-black text-base uppercase tracking-wider">Sessão Documental Expirada</h3>
            <p className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed">
              Este documento possui sensibilidade <span className="text-red-400 font-extrabold">{sensConfig.level}</span>. Por segurança regulamentar, a sessão ativa fechou após {sensConfig.sessionTimeout}.
            </p>
            
            <button 
              onClick={handleReauthenticate}
              disabled={isReauthenticating}
              className="mt-6 font-mono font-black text-xs uppercase bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 px-6 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              {isReauthenticating ? (
                <>
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  A REAUTENTICAR COM BI...
                </>
              ) : (
                <>
                  <UserCheck size={14} />
                  REAUTENTICAR COM BI DIGITAL
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* MODAL DE VALIDAÇÃO DE QR CODE */}
      <AnimatePresence>
        {showQRValidation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowQRValidation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl border border-slate-150 shadow-2xl w-full max-w-lg overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <QrCode size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider">Verificador de Autenticidade</h3>
                    <p className="text-[9px] text-slate-400 font-mono tracking-tight">{protocol.protocolNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQRValidation(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-all text-white/80 text-xs font-bold font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {isValidating ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Consultando Infraestrutura de Chaves Públicas</h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Validando carimbo de tempo & certificado da entidade emissora...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Status badge and description */}
                    <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <div>
                        <span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase leading-none inline-block">
                          ASSINATURA CÔNJUGE VALIDADE
                        </span>
                        <h4 className="font-black text-slate-900 text-xs mt-1 leading-snug">Autenticidade e Integridade Confirmadas</h4>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">
                          Este documento foi assinado digitalmente por um certificado de assinatura qualificada associado ao cargo oficial da República de Angola e não sofreu modificações desde a sua emissão.
                        </p>
                      </div>
                    </div>

                    {/* Verification Details List */}
                    <div className="space-y-3.5 divide-y divide-slate-100">
                      <div className="pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Emissor Autorizado</span>
                        <span className="text-slate-850 text-xs font-black text-right">
                          {protocol.issuerInstitution}
                        </span>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Responsável Técnico</span>
                        <span className="text-slate-700 text-xs font-bold text-right">
                          {protocol.issuerResponsible}
                        </span>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Data de Assinatura</span>
                        <span className="text-slate-850 font-mono text-xs font-bold text-right">
                          {protocol.signatureDate}
                        </span>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Selo Digital Institucional</span>
                        <span className="text-slate-850 font-mono text-xs font-bold text-right">
                          {protocol.digitalSeal}
                        </span>
                      </div>

                      <div className="pt-3">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1">Hash Criptográfico (SHA-256)</span>
                        <span className="text-slate-700 font-mono text-[10px] break-all block leading-relaxed bg-slate-50 p-2 border border-slate-100 rounded-lg">
                          {protocol.documentHash}
                        </span>
                      </div>

                      <div className="pt-3">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1">Certificado Qualificado</span>
                        <span className="text-slate-700 font-mono text-[10px] break-all block leading-relaxed bg-slate-50 p-2 border border-slate-100 rounded-lg">
                          {protocol.institutionalCertificate}
                        </span>
                      </div>

                      <div className="pt-3">
                        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1.5">Validade Jurídica Regulamentar</span>
                        <p className="text-slate-655 text-[11px] font-medium leading-relaxed bg-indigo-50/40 p-2.5 border border-indigo-100/50 rounded-lg text-left">
                          {protocol.legalValidity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-5 flex justify-end">
                <button
                  onClick={() => setShowQRValidation(false)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md"
                >
                  Fechar Validação
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
