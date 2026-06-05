/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Scan, Mail, QrCode, Users, User, Shield, ShieldAlert, Lock, Fingerprint, Smartphone, Key, ShieldCheck, Camera, Wifi, WifiOff, Database, RefreshCw, Signal, AlertTriangle, X, Mic, ArrowLeft, Check, CheckCircle } from 'lucide-react';

// Components
import {
  Sidebar,
  MobileNavBar,
  Header,
  AIChatAssistant,
  NotificationDropdown,
  AddContactModal,
  DeleteContactModal,
  InviteConfirmModal,
  HomeContent,
  MailContent,
  DocumentsContent,
  WalletContent,
  ContactsContent,
  ProfileContent,
  MessageDetail,
  DocumentDetail,
  GovDashboard,
  GovEmissaoContent,
  GovDocsContent,
  GovInteroperabilidadeContent,
  GovContactsContent,
  GovPerfilContent,
  GovSegurancaContent,
  GovRelatorioContent,
  GovCorrespondenciasContent,
  PastaDigitalContent,
  SolicitarDocumentoContent,
  RegisterStepper,
  VoiceGuideAssistant,
  InstitutionDetail,
  InstQrCodeContent,
} from './components';

// Constants & Types
import { 
  INBOX, 
  INSTITUTIONAL_INBOX,
  SENT_MESSAGES, 
  DOCUMENTS, 
  INITIAL_CONTACTS, 
  HIGHLIGHT_SLIDES,
  NOTIFICATIONS,
} from './constants/data';
import { Message, Document, Contact, AppNotification, AppMode, UserRequest, DocRequest, Correspondence } from './types';
import { ensureProtocolOnMessage, ensureProtocolOnDocument, generateProtocol } from './utils/protocolGenerator';
import { OfflineManager, OfflineAction } from './utils/offlineManager';
import { supabaseService } from './services/supabaseService';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [tab, setTab] = useState('home');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessModalTitle, setAccessModalTitle] = useState('');
  const [accessModalMessage, setAccessModalMessage] = useState('');
  
  // Persisted States
  const [userRequests, setUserRequests] = useState<UserRequest[]>(() => {
    const saved = localStorage.getItem('gov_user_requests');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, user: 'Edlasio Galhardo', type: 'IPU', priority: 'Média', time: '12m atrás', status: 'pendente', bi: '009874562LA041' },
      { id: 2, user: 'Maria Antónia', type: 'NIF', priority: 'Alta', time: '5m atrás', status: 'urgente', bi: '008812342LA011' },
      { id: 3, user: 'José Kalunga', type: 'Certidão', priority: 'Baixa', time: '1h atrás', status: 'processando', bi: '007712342LA021' },
    ];
  });

  const [inbox, setInbox] = useState<Message[]>(() => {
    const saved = localStorage.getItem('correio_digital_inbox');
    let items: Message[] = [];
    if (!saved) {
      items = [...INBOX];
    } else {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m: any) => m.id));
        const newItems = INBOX.filter(m => !existingIds.has(m.id));
        items = [...parsed, ...newItems];
      } catch (e) {
        items = [...INBOX];
      }
    }
    return items.map(ensureProtocolOnMessage);
  });

  const [docInbox, setDocInbox] = useState<Message[]>(() => {
    const saved = localStorage.getItem('documentos_digital_inbox');
    let items: Message[] = [];
    if (!saved) {
      items = [...INBOX].map(m => ({ ...m, id: m.id + 10000 }));
    } else {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m: any) => m.id));
        const newItems = INBOX.map(m => ({ ...m, id: m.id + 10000 })).filter(m => !existingIds.has(m.id));
        items = [...parsed, ...newItems];
      } catch (e) {
        items = [...INBOX].map(m => ({ ...m, id: m.id + 10000 }));
      }
    }
    return items.map(ensureProtocolOnMessage);
  });

  const [instInbox, setInstInbox] = useState<Message[]>(() => {
    const saved = localStorage.getItem('correio_digital_inst_inbox');
    let items: Message[] = [];
    if (!saved) {
      items = [...INSTITUTIONAL_INBOX];
    } else {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m: any) => m.id));
        const newItems = INSTITUTIONAL_INBOX.filter(m => !existingIds.has(m.id));
        items = [...parsed, ...newItems];
      } catch (e) {
        items = [...INSTITUTIONAL_INBOX];
      }
    }
    return items.map(ensureProtocolOnMessage).filter(m => m.id !== 1003);
  });

  const [instDocInbox, setInstDocInbox] = useState<Message[]>(() => {
    const saved = localStorage.getItem('documentos_digital_inst_inbox');
    let items: Message[] = [];
    if (!saved) {
      items = [...INSTITUTIONAL_INBOX].map(m => ({ ...m, id: m.id + 10000 }));
    } else {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m: any) => m.id));
        const newItems = INSTITUTIONAL_INBOX.map(m => ({ ...m, id: m.id + 10000 })).filter(m => !existingIds.has(m.id));
        items = [...parsed, ...newItems];
      } catch (e) {
        items = [...INSTITUTIONAL_INBOX].map(m => ({ ...m, id: m.id + 10000 }));
      }
    }
    return items.map(ensureProtocolOnMessage).filter(m => m.id !== 10003 && m.id !== 1003);
  });
  
  const [sentMessages, setSentMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('correio_digital_sent');
    const items = saved ? JSON.parse(saved) : [...SENT_MESSAGES];
    return items.map(ensureProtocolOnMessage);
  });

  const [docSentMessages, setDocSentMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('documentos_digital_sent');
    const items = saved ? JSON.parse(saved) : [...SENT_MESSAGES].map(m => ({ ...m, id: m.id + 10000 }));
    return items.map(ensureProtocolOnMessage);
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('correio_digital_contacts');
    return saved ? JSON.parse(saved) : [...INITIAL_CONTACTS];
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('correio_digital_documents');
    const items = saved ? JSON.parse(saved) : [...DOCUMENTS];
    return items.map(ensureProtocolOnDocument);
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('correio_digital_notifications');
    return saved ? JSON.parse(saved) : [...NOTIFICATIONS];
  });

  const [auditLogs, setAuditLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('gov_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', action: 'Sistema Inicializado', user: 'SYSTEM', timestamp: '17/05/2026 08:00', type: 'info' },
      { id: '2', action: 'Login Administrador SME', user: 'Admin SME', timestamp: '17/05/2026 08:30', type: 'success' }
    ];
  });

  const [correspondences, setCorrespondences] = useState<Correspondence[]>(() => {
    const saved = localStorage.getItem('gov_correspondences');
    if (saved) return JSON.parse(saved);
    return [
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
  });

  useEffect(() => {
    localStorage.setItem('gov_correspondences', JSON.stringify(correspondences));
  }, [correspondences]);

  const [emergencyMode, setEmergencyMode] = useState(() => {
    return localStorage.getItem('gov_emergency_mode') === 'true';
  });

  const [docRequests, setDocRequests] = useState<DocRequest[]>(() => {
    const saved = localStorage.getItem('gov_doc_requests');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, userName: 'Edlasio Galhardo', userBi: '009874562LA041', docType: 'BI Digital', institution: 'AGT', date: '20/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 2, userName: 'Maria Antónia', userBi: '008812342LA011', docType: 'Certidão de Nascimento', institution: 'SME', date: '19/05/2026', status: 'Aprovado' },
      { id: 3, userName: 'José Kalunga', userBi: '007712342LA021', docType: 'NIF Progressivo', institution: 'AGT', date: '18/05/2026', status: 'Pendente', aiStatus: 'manual-review' },
      { id: 4, userName: 'Ana Baptista', userBi: '009991332LA018', docType: 'Certificado de Residência', institution: 'SME', date: '17/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 5, userName: 'Carlos Manuel', userBi: '001122334LA055', docType: 'Passaporte Eletrónico', institution: 'SME', date: '16/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 6, userName: 'Beatriz Costa', userBi: '002233445LA066', docType: 'Carta de Condução', institution: 'DNVT', date: '16/05/2026', status: 'Pendente', aiStatus: 'manual-review' },
      { id: 7, userName: 'António Lopes', userBi: '003344556LA077', docType: 'Livrete Automóvel', institution: 'DNVT', date: '15/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 8, userName: 'Sara Ferreira', userBi: '004455667LA088', docType: 'Alvará Comercial', institution: 'AGT', date: '15/05/2026', status: 'Aprovado' },
      { id: 9, userName: 'Paulo Jorge', userBi: '005566778LA099', docType: 'NIF Empresa', institution: 'AGT', date: '14/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 10, userName: 'Lúcia Mendes', userBi: '006677889LA100', docType: 'Registro Criminal', institution: 'MINJUS', date: '14/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 11, userName: 'Ricardo Vaz', userBi: '007788990LA111', docType: 'Cédula Pessoal', institution: 'MINJUS', date: '13/05/2026', status: 'Pendente', aiStatus: 'manual-review' },
      { id: 12, userName: 'Joana Darc', userBi: '008899001LA122', docType: 'Título de Propriedade', institution: 'MINJUS', date: '13/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 13, userName: 'Mário Silva', userBi: '009900112LA133', docType: 'BI Digital', institution: 'SME', date: '12/05/2026', status: 'Pendente', aiStatus: 'pre-approved' },
      { id: 14, userName: 'Cláudia Cruz', userBi: '001011223LA144', docType: 'Passaporte Eletrónico', institution: 'SME', date: '12/05/2026', status: 'Pendente', aiStatus: 'manual-review' },
    ];
  });

  const [bi, setBi] = useState(() => {
    return localStorage.getItem('correio_digital_bi') || '009874562LA041';
  });

  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('correio_digital_phone') || '+244 923 000 111';
  });

  const [nif, setNif] = useState(() => {
    return localStorage.getItem('correio_digital_nif') || '5401329188';
  });

  const [passport, setPassport] = useState(() => {
    return localStorage.getItem('correio_digital_passport') || 'AO-P129384';
  });

  const [verificationStatus, setVerificationStatus] = useState(() => {
    return localStorage.getItem('correio_digital_verification_status') || 'Totalmente verificado';
  });

  const [hasFacialAuth, setHasFacialAuth] = useState(() => {
    return localStorage.getItem('correio_digital_has_facial_auth') === 'false' ? false : true;
  });

  const [hasTwoFactor, setHasTwoFactor] = useState(() => {
    return localStorage.getItem('correio_digital_has_two_factor') === 'true';
  });

  const [govPin, setGovPin] = useState(() => {
    return localStorage.getItem('correio_digital_gov_pin') || '1234';
  });

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('correio_digital_profile_name') || 'Edlasio Galhardo';
  });

  const [userBirthDate, setUserBirthDate] = useState(() => {
    return localStorage.getItem('correio_digital_birth_date') || '12/03/1995';
  });

  const [userFiliation, setUserFiliation] = useState(() => {
    return localStorage.getItem('correio_digital_filiation') || 'António Galhardo & Maria Conceição';
  });

  const [userMaritalStatus, setUserMaritalStatus] = useState(() => {
    return localStorage.getItem('correio_digital_marital_status') || 'Solteiro';
  });

  useEffect(() => {
    localStorage.setItem('correio_digital_bi', bi);
  }, [bi]);

  useEffect(() => {
    localStorage.setItem('correio_digital_phone', phone);
  }, [phone]);

  useEffect(() => {
    localStorage.setItem('correio_digital_nif', nif);
  }, [nif]);

  useEffect(() => {
    localStorage.setItem('correio_digital_passport', passport);
  }, [passport]);

  useEffect(() => {
    localStorage.setItem('correio_digital_verification_status', verificationStatus);
  }, [verificationStatus]);

  useEffect(() => {
    localStorage.setItem('correio_digital_has_facial_auth', String(hasFacialAuth));
  }, [hasFacialAuth]);

  useEffect(() => {
    localStorage.setItem('correio_digital_has_two_factor', String(hasTwoFactor));
  }, [hasTwoFactor]);

  useEffect(() => {
    localStorage.setItem('correio_digital_gov_pin', govPin);
  }, [govPin]);

  useEffect(() => {
    localStorage.setItem('correio_digital_profile_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('correio_digital_birth_date', userBirthDate);
  }, [userBirthDate]);

  useEffect(() => {
    localStorage.setItem('correio_digital_filiation', userFiliation);
  }, [userFiliation]);

  useEffect(() => {
    localStorage.setItem('correio_digital_marital_status', userMaritalStatus);
  }, [userMaritalStatus]);

  // UI States
  const [loginSubMode, setLoginSubMode] = useState<'normal' | 'two-factor' | 'face-capture' | 'register'>('normal');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [highlightSteps, setHighlightSteps] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [faceProgress, setFaceProgress] = useState(0);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageSource, setMessageSource] = useState('correspondencias');
  
  // Mic Activation State (UI only)
  const [iaLiveActive, setIaLiveActive] = useState(false);
  const startIaVoice = () => setIaLiveActive(true);
  const stopIaVoice = () => setIaLiveActive(false);
  
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('user');
  const isGovMode = appMode === 'admin';
  const isInstMode = appMode === 'institution';
  
  useEffect(() => {
    setLoginError(null);
  }, [loginSubMode, appMode]);
  
  const [correspondenciaTab, setCorrespondenciaTab] = useState('lidas');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState<{ to: string; subject: string; body: string; attachments?: string[] }>({ to: '', subject: '', body: '', attachments: [] });

  const [documentosTab, setDocumentosTab] = useState('lidas');
  const [isDocComposing, setIsDocComposing] = useState(false);
  const [docComposeData, setDocComposeData] = useState({ to: '', subject: '', body: '' });

  const [contactForm, setContactForm] = useState({ name: '', bi: '', relation: '', type: 'Normal' as 'Normal' | 'Emergência' });
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showInviteConfirm, setShowInviteConfirm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchMail, setSearchMail] = useState('');
  const [searchDocMail, setSearchDocMail] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Offline and Local Caching states
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [simulatedOffline, setSimulatedOffline] = useState(() => localStorage.getItem('gov_simulated_offline') === 'true');
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => OfflineManager.getQueue());
  const [activeFallback, setActiveFallback] = useState<{ channel: 'SMS' | 'USSD' | 'PUSH'; message: string; protocol: string } | null>(null);
  const [showOfflineManagerWidget, setShowOfflineManagerWidget] = useState(false);

  // Face Scan simulated progress for login screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loginSubMode === 'face-capture' && isFaceScanning) {
      if (faceProgress < 100) {
        timer = setTimeout(() => {
          setFaceProgress(p => {
            const next = p + 10;
            return next >= 100 ? 100 : next;
          });
        }, 150);
      } else {
        setIsFaceScanning(false);
      }
    }
    return () => clearTimeout(timer);
  }, [loginSubMode, isFaceScanning, faceProgress]);

  // Automatic transition upon successful login facial recognition
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loginSubMode === 'face-capture' && faceProgress === 100) {
      if (emergencyMode && !isInstMode && !isGovMode && (bi.toLowerCase().includes('002931298') || bi.toLowerCase().includes('edlasio') || profileName.toLowerCase().includes('edlasio'))) {
        setLoginError("Autenticação Biométrica Recusada: Chaves Faciais Suspensas por Ordem do Protocolo SOC-AN-2026!");
        setFaceProgress(0);
        setIsFaceScanning(false);
        return;
      }
      timer = setTimeout(() => {
        setStage('app');
        addAuditLog('Acesso concedido via Biometria Facial no Portal', 'success');
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [faceProgress, loginSubMode, emergencyMode, bi, isInstMode, isGovMode, profileName]);

  useEffect(() => {
    if (loginSubMode !== 'face-capture') {
      setFaceProgress(0);
      setIsFaceScanning(false);
    }
  }, [loginSubMode]);

  // Auto-scroll to top on tab/stage change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab, stage]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('gov_user_requests', JSON.stringify(userRequests));
  }, [userRequests]);

  useEffect(() => {
    localStorage.setItem('correio_digital_inbox', JSON.stringify(inbox));
  }, [inbox]);

  useEffect(() => {
    localStorage.setItem('documentos_digital_inbox', JSON.stringify(docInbox));
  }, [docInbox]);

  useEffect(() => {
    localStorage.setItem('correio_digital_inst_inbox', JSON.stringify(instInbox));
  }, [instInbox]);

  useEffect(() => {
    localStorage.setItem('documentos_digital_inst_inbox', JSON.stringify(instDocInbox));
  }, [instDocInbox]);

  useEffect(() => {
    localStorage.setItem('correio_digital_sent', JSON.stringify(sentMessages));
  }, [sentMessages]);

  useEffect(() => {
    localStorage.setItem('documentos_digital_sent', JSON.stringify(docSentMessages));
  }, [docSentMessages]);

  useEffect(() => {
    localStorage.setItem('correio_digital_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('correio_digital_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('correio_digital_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Network Offline Observer with Simulated Controls and Auto-Sync
  useEffect(() => {
    const updateOnlineStatus = () => {
      const liveOn = navigator.onLine;
      const finalOn = liveOn && !simulatedOffline;
      setIsOnline(finalOn);
      
      if (finalOn) {
        // Trigger background auto sync when connection returns
        handleAutomaticSync();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [simulatedOffline]);

  // Automatic Local Caching of messages & documents as requested: "Cache local" & "Leitura offline"
  useEffect(() => {
    if (inbox.length > 0) {
      OfflineManager.cacheMessages(inbox);
    }
  }, [inbox]);

  useEffect(() => {
    if (documents.length > 0) {
      OfflineManager.cacheDocuments(documents);
    }
  }, [documents]);

  const handleAutomaticSync = () => {
    const queue = OfflineManager.getQueue();
    if (queue.length === 0) return;

    addAuditLog(`Sincronização em segundo plano iniciada (${queue.length} acções na fila)`, 'info');
    
    // In a real application, we would call API endpoints for each queued action.
    // For this prototype, all actions are successfully processed into the active states.
    setTimeout(() => {
      OfflineManager.setQueue([]);
      setOfflineQueue([]);
      
      // Auto backup
      OfflineManager.createAutomaticBackup();
      
      addAuditLog(`Sincronização concluída: ${queue.length} acções propagadas com o Registo de Identidade Digital`, 'success');
      
      // Notify citizen user
      const newNotif: AppNotification = {
        id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
        type: 'success',
        title: 'Sincronização Finalizada',
        message: `${queue.length} acções offline foram consolidadas com a base central. Backup de emergência v1.2 atualizado.`,
        time: 'Agora',
        targetTab: 'home'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 1500);
  };

  useEffect(() => {
    localStorage.setItem('correio_digital_bi', bi);
  }, [bi]);

  useEffect(() => {
    localStorage.setItem('correio_digital_phone', phone);
  }, [phone]);

  useEffect(() => {
    localStorage.setItem('gov_doc_requests', JSON.stringify(docRequests));
  }, [docRequests]);

  useEffect(() => {
    localStorage.setItem('gov_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('gov_emergency_mode', emergencyMode.toString());
  }, [emergencyMode]);

  useEffect(() => {
    localStorage.setItem('gov_app_mode', appMode);
  }, [appMode]);

  // Lifecycle Effects
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000); // Reduced a bit for better UX
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HIGHLIGHT_SLIDES.length);
    }, 5500);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    if (stage === 'splash') {
      const timer = setTimeout(() => setStage('login'), 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Derived Memos
  const currentInbox = isInstMode ? instInbox : inbox;
  const unreadTotal = useMemo(() => currentInbox.reduce((sum, msg) => sum + (msg.unread || 0), 0), [currentInbox]);

  const currentDocInbox = isInstMode ? instDocInbox : docInbox;
  const unreadDocTotal = useMemo(() => currentDocInbox.reduce((sum, msg) => sum + (msg.unread || 0), 0), [currentDocInbox]);

  const filteredMessages = useMemo(() => {
    let base: Message[] = [];
    if (correspondenciaTab === "enviadas") base = sentMessages;
    else if (correspondenciaTab === "lidas") base = currentInbox.filter((item) => !item.unread);
    else base = currentInbox.filter((item) => item.unread);

    if (!searchMail.trim()) return base;
    
    const term = searchMail.toLowerCase();
    return base.filter(m => 
      (m.org?.toLowerCase().includes(term) ?? false) || 
      (m.preview?.toLowerCase().includes(term) ?? false) ||
      (m.details?.subject?.toLowerCase().includes(term) ?? false)
    );
  }, [correspondenciaTab, currentInbox, sentMessages, searchMail]);

  const filteredDocMessages = useMemo(() => {
    let base: Message[] = [];
    if (documentosTab === "enviadas") base = docSentMessages;
    else if (documentosTab === "lidas") base = currentDocInbox.filter((item) => !item.unread);
    else base = currentDocInbox.filter((item) => item.unread);

    if (!searchDocMail.trim()) return base;
    
    const term = searchDocMail.toLowerCase();
    return base.filter(m => 
      (m.org?.toLowerCase().includes(term) ?? false) || 
      (m.preview?.toLowerCase().includes(term) ?? false) ||
      (m.details?.subject?.toLowerCase().includes(term) ?? false)
    );
  }, [documentosTab, currentDocInbox, docSentMessages, searchDocMail]);

  const filteredDocs = useMemo(() => {
    if (!searchDoc.trim()) return documents;
    const term = searchDoc.toLowerCase();
    return documents.filter(doc => 
      (doc.name?.toLowerCase().includes(term) ?? false) || 
      (doc.code?.toLowerCase().includes(term) ?? false) ||
      (doc.issuer?.toLowerCase().includes(term) ?? false)
    );
  }, [documents, searchDoc]);

  const filteredContacts = useMemo(() => {
    if (!searchContact.trim()) return contacts;
    const term = searchContact.toLowerCase();
    return contacts.filter(c => 
      (c.name?.toLowerCase().includes(term) ?? false) || 
      (c.bi?.toLowerCase().includes(term) ?? false) ||
      (c.relation?.toLowerCase().includes(term) ?? false)
    );
  }, [contacts, searchContact]);

  const addAuditLog = (action: string, type: 'info' | 'warning' | 'critical' | 'success' = 'info') => {
    const newLog = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000000)}`,
      action,
      user: 'Admin SME',
      timestamp: new Date().toLocaleString('pt-AO'),
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
    supabaseService.insertAuditLog(newLog).catch(() => {});
  };

  // Handlers
  const handleSelectMessage = (message: Message) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedMessage(message);
    setMessageSource(correspondenciaTab === 'enviadas' ? 'enviados' : 'correspondencias');
    
    if (correspondenciaTab !== 'enviadas' && message.unread) {
      if (isInstMode) {
        setInstInbox(prev => prev.map(m => 
          m.id === message.id ? { ...m, unread: 0 } : m
        ));
      } else {
        setInbox(prev => prev.map(m => 
          m.id === message.id ? { ...m, unread: 0 } : m
        ));
      }
    }
    
    setTab('mensagem');
  };

  const handleUpdateMessage = (updatedMsg: Message) => {
    setSelectedMessage(updatedMsg);
    setInbox(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    setInstInbox(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    setSentMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
  };

  const handleLogout = (clearAll = false) => {
    if (clearAll) {
      localStorage.clear();
      window.location.reload();
    } else {
      addAuditLog(`Sessão terminada pelo utilizador (${appMode})`, 'info');
      setStage('login');
      setTab('home');
    }
  };

  const handleSendMessage = () => {
    if (!composeData.to || !composeData.subject || !composeData.body) return;
    
    const messageId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
    const protocol = generateProtocol(composeData.to, 'message', messageId, composeData.subject);

    const newMessage: Message = {
      id: messageId,
      org: composeData.to,
      preview: composeData.subject,
      date: "hoje",
      status: "Informativo",
      details: {
        subject: composeData.subject,
        body: composeData.body,
        deadline: "Sem prazo",
        state: "Entregue & Autenticado",
        actions: ["Ver detalhes"],
        attachments: composeData.attachments || []
      },
      protocol: protocol
    };

    setSentMessages(prev => [newMessage, ...prev]);
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '', attachments: [] });

    if (!isOnline) {
      const q = OfflineManager.queueAction('SEND_MESSAGE', { messageId, to: composeData.to, subject: composeData.subject });
      setOfflineQueue(OfflineManager.getQueue());
      
      const fallback = OfflineManager.triggerFallback('SMS', `Enviar Correspondência: ${composeData.subject}`);
      setActiveFallback({ channel: 'SMS', message: fallback.message, protocol: fallback.protocol });
      
      addAuditLog(`Ação Offline: Mensagem guardada em fila local. Canal SMS ativo.`, 'warning');
    } else {
      addAuditLog(`Correspondência enviada com Protocolo ${protocol.protocolNumber}`, 'info');
      OfflineManager.createAutomaticBackup();
      // Sync to Supabase
      supabaseService.insertMessage(newMessage, bi).catch(() => {});
    }
  };

  const handleReply = (msg: Message) => {
    setComposeData({
      to: msg.org,
      subject: `RE: ${msg.details?.subject || msg.preview.substring(0, 30)}`,
      body: `\n\n--------------------------------\nEm resposta à mensagem de ${msg.date}:\n"${msg.preview}"`,
      attachments: []
    });
    setTab('correspondencias');
    setIsComposing(true);
  };

  const handleSendDocMessage = () => {
    if (!docComposeData.to || !docComposeData.subject || !docComposeData.body) return;
    
    const messageId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
    const protocol = generateProtocol(docComposeData.to, 'message', messageId, docComposeData.subject);

    const newMessage: Message = {
      id: messageId,
      org: docComposeData.to,
      preview: docComposeData.subject,
      date: "hoje",
      status: "Informativo",
      details: {
        subject: docComposeData.subject,
        body: docComposeData.body,
        deadline: "Sem prazo",
        state: "Entregue & Autenticado",
        actions: ["Ver detalhes"]
      },
      protocol: protocol
    };

    setDocSentMessages(prev => [newMessage, ...prev]);
    setIsDocComposing(false);
    setDocComposeData({ to: '', subject: '', body: '' });

    if (!isOnline) {
      const q = OfflineManager.queueAction('SEND_DOCUMENT', { messageId, to: docComposeData.to, subject: docComposeData.subject });
      setOfflineQueue(OfflineManager.getQueue());
      
      const fallback = OfflineManager.triggerFallback('SMS', `Enviar Documento: ${docComposeData.subject}`);
      setActiveFallback({ channel: 'SMS', message: fallback.message, protocol: fallback.protocol });
      
      addAuditLog(`Ação Offline: Documento guardado em fila local. Canal SMS ativo.`, 'warning');
    } else {
      addAuditLog(`Documento enviado com Protocolo ${protocol.protocolNumber}`, 'info');
      OfflineManager.createAutomaticBackup();
    }
  };

  const handleDocReply = (msg: Message) => {
    setDocComposeData({
      to: msg.org,
      subject: `RE: ${msg.details?.subject || msg.preview.substring(0, 30)}`,
      body: `\n\n--------------------------------\nEm resposta ao documento de ${msg.date}:\n"${msg.preview}"`
    });
    setTab('documentos');
    setIsDocComposing(true);
  };

  const handleDeleteContact = () => {
    if (contactToDelete) {
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      
      if (!isOnline) {
        OfflineManager.queueAction('DELETE_CONTACT', { id: contactToDelete.id, name: contactToDelete.name });
        setOfflineQueue(OfflineManager.getQueue());
        const fallback = OfflineManager.triggerFallback('PUSH', `Remover Contacto: ${contactToDelete.name}`);
        setActiveFallback({ channel: 'PUSH', message: fallback.message, protocol: fallback.protocol });
        addAuditLog(`Ação Offline: Remoção de contacto guardada. Fallback Push ativo.`, 'warning');
      } else {
        addAuditLog(`Contacto removido: ${contactToDelete.name}`, 'warning');
        OfflineManager.createAutomaticBackup();
        // Background sync to Supabase
        supabaseService.deleteContact(contactToDelete.id).catch(() => {});
      }
      
      setContactToDelete(null);
    }
  };

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.bi) return;
    const newContact = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      name: contactForm.name,
      bi: contactForm.bi,
      relation: contactForm.relation || "Contato",
      status: "Pendente",
      type: contactForm.type || "Normal",
    };

    setContacts(prev => [newContact, ...prev]);

    if (!isOnline) {
      OfflineManager.queueAction('ADD_CONTACT', { name: contactForm.name, bi: contactForm.bi });
      setOfflineQueue(OfflineManager.getQueue());
      const fallback = OfflineManager.triggerFallback('USSD', `Adicionar Contacto: ${contactForm.name}`);
      setActiveFallback({ channel: 'USSD', message: fallback.message, protocol: fallback.protocol });
      addAuditLog(`Ação Offline: Adição de contacto guardada em fila. Canal USSD ativo (*141*9#).`, 'warning');
    } else {
      addAuditLog(`Novo contacto adicionado: ${contactForm.name}`, 'success');
      OfflineManager.createAutomaticBackup();
      // Background sync to Supabase
      supabaseService.insertContact(newContact, bi).catch(() => {});
    }

    setIsAddingContact(false);
    setContactForm({ name: '', bi: '', relation: '', type: 'Normal' });
  };

  const handleUpdateContactType = (id: number, newType: 'Normal' | 'Emergência') => {
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, type: newType };
        // Sync update
        supabaseService.insertContact(updated, bi).catch(() => {});
        return updated;
      }
      return c;
    }));
    addAuditLog(`Prioridade do contacto atualizada para ${newType}`, 'info');
  };

  const handleEmitDocument = (doc: Document, notification: AppNotification) => {
    setDocuments(prev => [doc, ...prev]);
    setNotifications(prev => [notification, ...prev]);
    
    // Also send a formal message to the inbox to simulate real correspondence
    const newMessage: Message = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      org: doc.issuer.split(' - ')[0], // Get AGT from AGT - Administração...
      preview: `Novo documento emitido: ${doc.name}`,
      date: "Agora",
      status: "Oficial",
      unread: 1,
      details: {
        subject: `Emissão de ${doc.name}`,
        body: `Prezado(a) ${doc.holder},\n\nInformamos que um novo documento (${doc.name}) foi emitido pela nossa instituição e já se encontra disponível na sua Carteira Digital.\n\nCódigo de Autenticação: ${doc.code}\nData de Emissão: ${doc.issuedAt}\n\nEste é um procedimento automático do Correio Digital de Angola.`,
        attachments: [doc.name]
      }
    };

    // If the issued document is for the currently logged in user, update their local inbox
    if (doc.number === bi) {
      setInbox(prev => [newMessage, ...prev]);
    }
    
    // Close the request if it exists in the userRequests pool
    setUserRequests(prev => prev.map(req => 
      (req.bi === doc.number && doc.name.toLowerCase().includes(req.type.toLowerCase())) ? { ...req, status: 'concluido' } : req
    ));

    if (!isOnline) {
      OfflineManager.queueAction('EMIT_DOCUMENT', { docId: doc.code, name: doc.name, holder: doc.holder });
      setOfflineQueue(OfflineManager.getQueue());
      const fallback = OfflineManager.triggerFallback('PUSH', `Emissão de Acto: ${doc.name}`);
      setActiveFallback({ channel: 'PUSH', message: fallback.message, protocol: fallback.protocol });
      addAuditLog(`Ação Offline: Emissão de ${doc.name} enfileirada. Fallback Push ativo.`, 'warning');
    } else {
      addAuditLog(`Emissão de Acto: ${doc.name} para ${doc.holder} (BI: ${doc.number})`, 'success');
      OfflineManager.createAutomaticBackup();
    }
  };

  const handleCreateRequest = (type: string, priority: 'Alta' | 'Média' | 'Baixa' = 'Média') => {
    const newReq: UserRequest = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      user: 'Edlasio Galhardo', // Currently logged in user
      type,
      priority,
      time: 'Agora',
      status: 'pendente',
      bi: bi
    };
    setUserRequests(prev => [newReq, ...prev]);

    // Format new notification correctly satisfying AppNotification type
    const newNotif: AppNotification = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      title: 'Solicitação Enviada',
      message: `O seu pedido de ${type} foi enviado à AGT.`,
      time: 'Agora',
      type: 'info',
      targetTab: 'home'
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (!isOnline) {
      OfflineManager.queueAction('CREATE_REQUEST', { type, priority });
      setOfflineQueue(OfflineManager.getQueue());
      const fallback = OfflineManager.triggerFallback('USSD', `Solicitar ${type} via USSD (*141*9#)`);
      setActiveFallback({ channel: 'USSD', message: fallback.message, protocol: fallback.protocol });
      addAuditLog(`Ação Offline: Pedido de ${type} anexado ao buffer. Fallback USSD físico iniciado (*141*9#).`, 'warning');
    } else {
      addAuditLog(`Nova solicitação de ${type} enviada à AGT`, 'info');
      OfflineManager.createAutomaticBackup();
    }
  };

  const logSecurityEvent = (action: string, type: 'info' | 'warning' | 'critical' | 'success' = 'info') => {
    addAuditLog(action, type);
  };

  const handleUpdateDocRequest = (requestId: number, newStatus: 'Aprovado' | 'Rejeitado') => {
    const request = docRequests.find(r => r.id === requestId);
    if (!request) return;

    setDocRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    
    if (newStatus === 'Aprovado') {
      const newDoc: Document = {
        name: request.docType,
        validity: 'VITALÍCIO',
        code: `CDA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        holder: request.userName,
        number: request.userBi,
        issuer: `${request.institution} - Emissão Automática`,
        issuedAt: new Date().toLocaleDateString('pt-AO')
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      
      const systemMsg: Message = {
        id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
        org: request.institution,
        preview: `A sua solicitação de ${request.docType} foi aprovada.`,
        date: "Agora",
        status: "Oficial",
        unread: 1,
        details: {
          subject: `${request.docType} Aprovado`,
          body: `Prezado(a) ${request.userName},\n\nA sua solicitação para a emissão do documento ${request.docType} foi analisada e aprovada com sucesso.\n\nO documento já se encontra disponível na sua Carteira Digital para consulta e utilização oficial.`,
          actions: ['Ver na Carteira']
        }
      };
      
      if (request.userBi === bi) {
        setInbox(prev => [systemMsg, ...prev]);
        setNotifications(prev => [{
          id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
          title: 'Documento Aprovado',
          message: `O seu pedido de ${request.docType} foi aprovado e emitido.`,
          time: 'Agora',
          type: 'success',
          targetTab: 'correspondencias'
        }, ...prev]);
      }
      
      addAuditLog(`DOC_APPROVED: ${request.docType} para ${request.userName} emitido via sistema.`, 'success');
    } else {
      addAuditLog(`DOC_REJECTED: Solicitação de ${request.docType} para ${request.userName} rejeitada.`, 'warning');
    }
  };

  const handleCreateDocRequest = (docType: string, institution: string) => {
    const newReq: DocRequest = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      userName: 'Edlasio Galhardo',
      userBi: bi,
      docType,
      institution,
      date: new Date().toLocaleDateString('pt-AO'),
      status: 'Pendente'
    };
    setDocRequests(prev => [newReq, ...prev]);
    addAuditLog(`SOLICITATION_SENT: Pedido de ${docType} à ${institution} enviado pelo cidadão.`, 'info');
  };

  // Rendering Helpers
  const renderContent = () => {
    switch (tab) {
      case 'home':
        return (
          <HomeContent
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            isMobile={isMobile}
            setTab={setTab}
            unreadTotal={unreadTotal}
            inbox={currentInbox}
            sentMessages={sentMessages}
            handleSelectMessage={handleSelectMessage}
            onCreateRequest={handleCreateRequest}
            isInst={isInstMode}
            onDoubleClickInstitution={(name) => {
              if (isInstMode) return; // Na versão institucional, clicar 2x no Painel não deve realizar nenhuma acção
              setSelectedInstitution(name);
              setTab('instituicao');
            }}
          />
        );
      case 'instituicao':
        if (!selectedInstitution) {
          setTab('home');
          return null;
        }
        return (
          <InstitutionDetail
            institutionName={selectedInstitution}
            inbox={currentInbox}
            sentMessages={sentMessages}
            docInbox={currentDocInbox}
            onBack={() => {
              setSelectedInstitution(null);
              setTab('home');
            }}
            onSelectMessage={handleSelectMessage}
          />
        );
      case 'correspondencias':
        return (
          <MailContent
            isComposing={isComposing}
            setIsComposing={setIsComposing}
            composeData={composeData}
            setComposeData={setComposeData}
            handleSendMessage={handleSendMessage}
            unreadTotal={unreadTotal}
            correspondenciaTab={correspondenciaTab}
            setCorrespondenciaTab={setCorrespondenciaTab}
            inbox={currentInbox}
            sentMessages={sentMessages}
            searchMail={searchMail}
            setSearchMail={setSearchMail}
            filteredMessages={filteredMessages}
            handleSelectMessage={handleSelectMessage}
            bi={bi}
            isInst={isInstMode}
          />
        );
      case 'documentos':
        return (
          <DocumentsContent
            isComposing={isDocComposing}
            setIsComposing={setIsDocComposing}
            composeData={docComposeData}
            setComposeData={setDocComposeData}
            handleSendMessage={handleSendDocMessage}
            unreadTotal={unreadDocTotal}
            correspondenciaTab={documentosTab}
            setCorrespondenciaTab={setDocumentosTab}
            inbox={currentDocInbox}
            sentMessages={docSentMessages}
            searchMail={searchDocMail}
            setSearchMail={setSearchDocMail}
            filteredMessages={filteredDocMessages}
            handleSelectMessage={handleSelectMessage}
            bi={bi}
            isInst={isInstMode}
          />
        );
      case 'mensagem':
        if (!selectedMessage) return null;
        return (
          <MessageDetail
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
            setTab={setTab}
            handleReply={handleReply}
            onUpdateMessage={handleUpdateMessage}
          />
        );
      case 'carteira':
        if (isInstMode) {
          return (
            <GovDocsContent 
              documents={documents} 
              requests={docRequests} 
              onUpdateStatus={handleUpdateDocRequest}
            />
          );
        }
        return (
          <WalletContent
            filteredDocs={filteredDocs}
            searchDoc={searchDoc}
            setSearchDoc={setSearchDoc}
            setSelectedDoc={setSelectedDoc}
            setTab={setTab}
            logSecurityEvent={logSecurityEvent}
            docRequests={docRequests.filter(r => r.userBi === bi)}
            onCreateRequest={handleCreateDocRequest}
            emergencyMode={emergencyMode}
          />
        );
      case 'documento':
        if (!selectedDoc) return null;
        return (
          <DocumentDetail
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
            setTab={setTab}
            logSecurityEvent={logSecurityEvent}
          />
        );
      case 'solicitar-documento':
        return (
          <SolicitarDocumentoContent
            setTab={setTab}
            bi={bi}
            nif={nif}
            onEmitDocument={handleEmitDocument}
            isOnline={isOnline}
            addAuditLog={addAuditLog}
          />
        );
      case 'pasta-digital':
        return (
          <PastaDigitalContent
            documents={documents}
            docRequests={docRequests.filter(r => r.userBi === bi)}
            onCreateRequest={handleCreateDocRequest}
            setSelectedDoc={setSelectedDoc}
            setTab={setTab}
            logSecurityEvent={logSecurityEvent}
            emergencyMode={emergencyMode}
            correspondences={correspondences}
          />
        );
      case 'inst-qrcode':
        return (
          <InstQrCodeContent
            documents={documents}
            addAuditLog={addAuditLog}
          />
        );
      case 'contatos':
        return appMode === 'institution' ? (
          <GovContactsContent
            appMode={appMode}
            bi={bi}
            setBi={setBi}
            nif={nif}
            setNif={setNif}
            phone={phone}
            setPhone={setPhone}
            passport={passport}
            setPassport={setPassport}
            profileName={profileName}
            setProfileName={setProfileName}
            userBirthDate={userBirthDate}
            setUserBirthDate={setUserBirthDate}
            userFiliation={userFiliation}
            setUserFiliation={setUserFiliation}
            userMaritalStatus={userMaritalStatus}
            setUserMaritalStatus={setUserMaritalStatus}
            verificationStatus={verificationStatus}
            setVerificationStatus={setVerificationStatus}
            hasFacialAuth={hasFacialAuth}
            setHasFacialAuth={setHasFacialAuth}
            hasTwoFactor={hasTwoFactor}
            setHasTwoFactor={setHasTwoFactor}
            govPin={govPin}
            setGovPin={setGovPin}
            addAuditLog={addAuditLog}
            auditLogs={auditLogs}
          />
        ) : (
          <ContactsContent
            contacts={contacts}
            filteredContacts={filteredContacts}
            searchContact={searchContact}
            setSearchContact={setSearchContact}
            setIsAddingContact={setIsAddingContact}
            setContactToDelete={setContactToDelete}
            onUpdateContactType={handleUpdateContactType}
          />
        );
      case 'perfil':
        return (
          <ProfileContent
            isInst={isInstMode}
            showSensitiveData={showSensitiveData}
            setShowSensitiveData={setShowSensitiveData}
            bi={bi}
            phone={phone}
            nif={nif}
            passport={passport}
            verificationStatus={verificationStatus}
            hasFacialAuth={hasFacialAuth}
            hasTwoFactor={hasTwoFactor}
            govPin={govPin}
            profileName={profileName}
            userBirthDate={userBirthDate}
            userFiliation={userFiliation}
            userMaritalStatus={userMaritalStatus}
            setBi={setBi}
            setPhone={setPhone}
            setNif={setNif}
            setPassport={setPassport}
            setVerificationStatus={setVerificationStatus}
            setHasFacialAuth={setHasFacialAuth}
            setHasTwoFactor={setHasTwoFactor}
            setGovPin={setGovPin}
            contactsCount={contacts.length}
            setTab={setTab}
            handleLogout={handleLogout}
            inbox={inbox}
            docInbox={docInbox}
            sentMessages={sentMessages}
            contactsList={contacts}
            documentsList={documents}
            userRequests={userRequests}
            docRequests={docRequests}
            auditLogs={auditLogs}
            addAuditLog={addAuditLog}
          />
        );
      case 'gov-dashboard':
        return (
          <GovDashboard 
            onNavigate={setTab} 
            documents={documents} 
            emergencyMode={emergencyMode} 
            appMode={appMode} 
            userRequests={userRequests}
            isMobile={isMobile}
            logSecurityEvent={logSecurityEvent}
            bi={bi}
            setBi={setBi}
            profileName={profileName}
            setProfileName={setProfileName}
            userBirthDate={userBirthDate}
            setUserBirthDate={setUserBirthDate}
            userFiliation={userFiliation}
            setUserFiliation={setUserFiliation}
            userMaritalStatus={userMaritalStatus}
            setUserMaritalStatus={setUserMaritalStatus}
            addAuditLog={addAuditLog}
          />
        );
      case 'gov-emissao':
        return (
          <GovEmissaoContent 
            onEmit={handleEmitDocument} 
            recentDocuments={documents} 
            emergencyMode={emergencyMode} 
            userRequests={userRequests.filter(r => r.status !== 'concluido')}
          />
        );
      case 'gov-correspondencias':
        return (
          <GovCorrespondenciasContent 
            correspondences={correspondences}
            onAddCorrespondence={(newCor) => {
              setCorrespondences(prev => [newCor, ...prev]);
              addAuditLog(`Novo Expediente Enviado: ${newCor.id} de ${newCor.sender} para ${newCor.recipient}`, 'success');
              
              if (newCor.recipient.toLowerCase().includes('edlasio')) {
                const newMailMessage: Message = {
                  id: parseInt(newCor.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000),
                  org: newCor.sender,
                  preview: newCor.subject,
                  date: `${newCor.date} 12:00`,
                  unread: 1,
                  status: 'Urgente',
                  details: {
                    subject: newCor.subject,
                    body: newCor.body,
                    deadline: `${newCor.date}`,
                    state: 'Pendente',
                    actions: ['Visualizar', 'Baixar Recibo']
                  },
                  protocol: {
                    internalId: `INT-${newCor.id}`,
                    protocolNumber: `PROT-${newCor.id}-CDA`,
                    issuerInstitution: newCor.sender,
                    officialIssueDate: newCor.date,
                    officialTime: "12:00",
                    issuerResponsible: "Gabinete Central",
                    category: "Oficial",
                    documentType: "Expediente Eletrónico",
                    currentState: "Ativo",
                    priority: "Alta",
                    deadlineDate: newCor.date,
                    qrCodeUrl: "",
                    digitalSignature: "VALIDA",
                    documentHash: "sha255-automatic-correspondence-unification-integrity"
                  }
                };
                setInbox(prev => [newMailMessage, ...prev]);
              }
            }}
            onUpdateStatus={(id, newStatus) => {
              setCorrespondences(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
              addAuditLog(`Expediente ${id} marcado como ${newStatus}`, 'info');
            }}
          />
        );
      case 'gov-docs':
      case 'gov-documentos':
        return (
          <GovDocsContent 
            documents={documents} 
            requests={docRequests} 
            onUpdateStatus={handleUpdateDocRequest}
          />
        );
      case 'gov-contatos':
        return (
          <GovContactsContent
            appMode={appMode}
            bi={bi}
            setBi={setBi}
            nif={nif}
            setNif={setNif}
            phone={phone}
            setPhone={setPhone}
            passport={passport}
            setPassport={setPassport}
            profileName={profileName}
            setProfileName={setProfileName}
            userBirthDate={userBirthDate}
            setUserBirthDate={setUserBirthDate}
            userFiliation={userFiliation}
            setUserFiliation={setUserFiliation}
            userMaritalStatus={userMaritalStatus}
            setUserMaritalStatus={setUserMaritalStatus}
            verificationStatus={verificationStatus}
            setVerificationStatus={setVerificationStatus}
            hasFacialAuth={hasFacialAuth}
            setHasFacialAuth={setHasFacialAuth}
            hasTwoFactor={hasTwoFactor}
            setHasTwoFactor={setHasTwoFactor}
            govPin={govPin}
            setGovPin={setGovPin}
            addAuditLog={addAuditLog}
            auditLogs={auditLogs}
          />
        );
      case 'gov-trabalhadores':
        return (
          <GovContactsContent
            appMode="admin-workers"
            bi={bi}
            setBi={setBi}
            nif={nif}
            setNif={setNif}
            phone={phone}
            setPhone={setPhone}
            passport={passport}
            setPassport={setPassport}
            profileName={profileName}
            setProfileName={setProfileName}
            userBirthDate={userBirthDate}
            setUserBirthDate={setUserBirthDate}
            userFiliation={userFiliation}
            setUserFiliation={setUserFiliation}
            userMaritalStatus={userMaritalStatus}
            setUserMaritalStatus={setUserMaritalStatus}
            verificationStatus={verificationStatus}
            setVerificationStatus={setVerificationStatus}
            hasFacialAuth={hasFacialAuth}
            setHasFacialAuth={setHasFacialAuth}
            hasTwoFactor={hasTwoFactor}
            setHasTwoFactor={setHasTwoFactor}
            govPin={govPin}
            setGovPin={setGovPin}
            addAuditLog={addAuditLog}
            auditLogs={auditLogs}
          />
        );
      case 'gov-perfil':
        return (
          <GovPerfilContent 
            logs={auditLogs} 
            emergencyMode={emergencyMode} 
            bi={bi}
            phone={phone}
            nif={nif}
            passport={passport}
            profileName={profileName}
            userBirthDate={userBirthDate}
            userFiliation={userFiliation}
            userMaritalStatus={userMaritalStatus}
            hasFacialAuth={hasFacialAuth}
            hasTwoFactor={hasTwoFactor}
            govPin={govPin}
            onToggleEmergency={(active) => {
              setEmergencyMode(active);
              addAuditLog(active ? 'PROTOCOLO DE EMERGÊNCIA ACTIVADO' : 'Protocolo de Emergência Desativado', active ? 'critical' : 'warning');
              
              // If activated, send a system-wide high priority message to all users
              if (active) {
                const systemAlert: Message = {
                  id: Number(`${Date.now()}999`),
                  org: 'SOC - SEGURANÇA NACIONAL',
                  preview: 'ALERTA DE SEGURANÇA: Protocolo SOC-AN-2026 Ativado',
                  date: "Agora",
                  status: "CRÍTICO",
                  unread: 1,
                  details: {
                    subject: 'Protocolo de Emergência de Segurança Digital',
                    body: 'Exmo(a) Cidadão(ã),\n\nInformamos que foi ativado o protocolo de segurança SOC-AN-2026. Por motivos de segurança nacional, algumas emissões de documentos digitais estão temporariamente suspensas.\n\nEsta medida visa garantir a integridade dos seus dados e a segurança da rede CDA. Por favor, mantenha-se atento a novas comunicações oficiais.\n\nAtenciosamente,\nCentro de Operações de Segurança Nacional',
                    actions: ['Confirmar Leitura']
                  }
                };
                setInbox(prev => [systemAlert, ...prev]);
                setNotifications(prev => [{
                  id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
                  title: 'ALERTA NACIONAL',
                  message: 'Protocolo de Emergência Activado pelo SOC',
                  time: 'Agora',
                  type: 'warning',
                  targetTab: 'correspondencias'
                }, ...prev]);
              }
            }} 
          />
        );
      case 'gov-stats':
        return null; // Removido ou integrado no painel principal
      case 'gov-interoperabilidade':
        return <GovInteroperabilidadeContent onLog={addAuditLog} />;
      case 'gov-relatorio':
        return (
          <GovRelatorioContent 
            correspondences={correspondences}
            auditLogs={auditLogs}
          />
        );
      case 'gov-seguranca':
        return (
          <GovSegurancaContent 
            emergencyMode={emergencyMode}
            onToggleEmergencyMode={(enabled) => {
              setEmergencyMode(enabled);
              localStorage.setItem('gov_emergency_mode', enabled ? 'true' : 'false');
              
              if (enabled) {
                // Add Audit logs
                addAuditLog('PROTOCOLO SOC-AN-2026 ATIVADO: Bloqueio Identitário e Chaves Criptográficas Encriptadas', 'critical');
                
                // Add Notification to citizen
                setNotifications(prev => [{
                  id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
                  title: 'ALERTA SOC-AN-2026 UNIFICADO',
                  message: 'Protocolo de Emergência Ciber-Defensiva Ativado. Chaves Faciais e Biométricas de Edlasio Galhardo Temporariamente Suspensas / Bloqueadas para Salvaguarda de Soberania Digital!',
                  time: 'Agora',
                  type: 'warning',
                  targetTab: 'home'
                }, ...prev]);

                // Despacho de Mensagem na Inbox (Mail)
                const dateAO = new Date().toLocaleDateString('pt-AO');
                const timeAO = new Date().toLocaleTimeString('pt-AO');
                const emergencyRoom = "Gabinete de Gestão de Crises - Luanda, Angola";

                const killSwitchMessage: Message = {
                  id: 2026911,
                  org: "SOC",
                  preview: "ALERTA CRÍTICO: ATIVAÇÃO PROTOCOLO NACIONAL SOC-AN-2026",
                  date: `${dateAO} ${timeAO}`,
                  unread: 1,
                  status: 'Crítico',
                  details: {
                    subject: "ALERTA CRÍTICO: ATIVAÇÃO PROTOCOLO NACIONAL SOC-AN-2026",
                    body: `PROT: SOC-AN-2026\nDATA: ${dateAO}\nHORA: ${timeAO}\nLOCALIZAÇÃO: ${emergencyRoom}\n\nATENÇÃO CIDADÃO: Por directiva da tutela de Defesa e Soberania Digital, as chaves de acesso facial e credenciais criptográficas associadas à entidade legal 'Edlasio Galhardo' foram quarentenadas preventivamente. O seu acesso biométrico ao barramento estatal permanece temporariamente suspenso para salvaguarda de integridade.`,
                    deadline: "IMEDIATO",
                    state: "Quarentena Activa",
                    actions: ["Ver Protocolo", "Baixar Auto de Suspensão"]
                  },
                  protocol: {
                    internalId: "INT-SOC-AN-2026",
                    protocolNumber: "SOC-AN-2026",
                    issuerInstitution: "SOC - CENTRO DE SEGURANÇA NACIONAL",
                    officialIssueDate: dateAO,
                    officialTime: timeAO,
                    issuerResponsible: "Gabinete de Crise",
                    category: "Cibernética",
                    documentType: "Protocolo Nacional",
                    currentState: "Suspenso",
                    priority: "Crítica",
                    deadlineDate: dateAO,
                    qrCodeUrl: "",
                    digitalSignature: "VALIDA",
                    documentHash: "sha256-6bd19ac268c2-emergency-protocol-block-key-strict"
                  }
                };

                setInbox(prev => [killSwitchMessage, ...prev]);

                // Suspend the active citizen profile status indicator
                setVerificationStatus('Acesso Biométrico Suspenso / Chaves Bloqueadas para Salvaguarda de Soberania');
              } else {
                addAuditLog('PROTOCOLO SOC-AN-2026 DESATIVADO: Restabelecimento Geral de Credenciais Faciais', 'success');
                setVerificationStatus('Totalmente verificado');
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Loader2 size={48} />
        </motion.div>
      </div>
    );
  }

  if (stage === 'splash') {
    return (
      <section className="min-h-screen bg-white grid place-items-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center z-10 w-full max-w-md px-8"
        >
          <img 
            src="https://i.postimg.cc/cCkwskty/Logomarca-Correio-Digital.png" 
            alt="Correio Digital Logo" 
            className="w-64 md:w-80 h-auto mx-auto mb-12"
          />
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <motion.p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-4">
            A carregar portal oficial...
          </motion.p>
        </motion.div>
      </section>
    );
  }

  if (stage === 'login') {
    const handleLoginSubmit = () => {
      if (emergencyMode && !isInstMode && !isGovMode && (bi.toLowerCase().includes('002931298') || bi.toLowerCase().includes('edlasio') || profileName.toLowerCase().includes('edlasio'))) {
        setLoginError("Credenciais e chaves biométricas suspensas / bloqueadas temporariamente ao abrigo do protocolo SOC-AN-2026 para salvaguarda de soberania digital nacional.");
        addAuditLog("BLOQUEIO IDENTITÁRIO: Tentativa de login por Edlasio Galhardo suspensa (SOC-AN-2026)", "critical");
        return;
      }
      if (hasTwoFactor) {
        setLoginSubMode('two-factor');
      } else {
        setStage('app');
        addAuditLog('Login de Cidadão via Autenticação Segura', 'success');
      }
    };

    return (
      <section className="min-h-screen p-6 bg-slate-50 flex items-center justify-center font-sans">
        <div className="max-w-[1100px] w-full mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden md:flex bg-white rounded-[40px] ${loginSubMode === 'face-capture' ? 'p-8 min-h-[480px]' : 'p-12 min-h-[580px]'} border border-slate-100 flex-col items-center justify-center text-center shadow-sm h-full relative overflow-hidden transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/2 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
            
            {showVoiceGuide ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full relative z-10"
              >
                <VoiceGuideAssistant
                  onScrollDown={() => {
                    const el = document.getElementById('cda-login-form-container');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }
                  }}
                  onFocusSteps={() => {
                    setHighlightSteps(true);
                    setTimeout(() => setHighlightSteps(false), 5000);
                  }}
                  onCollapseStart={() => {
                    setLoginSubMode('register');
                  }}
                  onCloseAssistant={() => {
                    setShowVoiceGuide(false);
                  }}
                />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center relative z-10">
                <img 
                  src="https://i.postimg.cc/cCkwskty/Logomarca-Correio-Digital.png" 
                  alt="Correio Digital" 
                  className={loginSubMode === 'face-capture' ? "w-48 h-auto mb-4" : "w-72 h-auto mb-8"}
                />
                <h1 className={`${loginSubMode === 'face-capture' ? 'text-xl md:text-2xl mb-2' : 'text-2xl md:text-3xl mb-4'} font-black text-slate-900 leading-tight italic uppercase tracking-tight`}>
                  O seu novo endereço digital oficial
                </h1>
                <p className="text-slate-500 leading-relaxed max-w-sm text-sm font-semibold">
                  Receba, assine e despache correspondência governamental com validade jurídica do Estado da República de Angola.
                </p>
                <div className={`${loginSubMode === 'face-capture' ? 'mt-4' : 'mt-8'} flex flex-col items-center`}>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> Infraestrutura Oficial Segura SME & AGT
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            id="cda-login-form-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-[40px] ${loginSubMode === 'face-capture' ? 'p-5 md:p-6 min-h-[480px]' : 'p-8 md:p-12 min-h-[580px]'} shadow-xl border border-slate-100 flex flex-col justify-between h-full transition-all duration-300 relative ${
              highlightSteps 
                ? 'ring-4 ring-blue-500 ring-offset-4 shadow-[0_0_30px_rgba(37,99,235,0.35)] scale-[1.01]' 
                : ''
            }`}
          >
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-red-50 border border-red-200/60 text-red-700 px-4 py-3 rounded-2xl text-[10.5px] font-bold flex items-start gap-2 mb-4 leading-normal"
                >
                  <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-extrabold block">ACESSO NEGADO / PROTOCOLO CRÍTICO</span>
                    {loginError}
                  </div>
                </motion.div>
              )}

              {loginSubMode === 'normal' && (
                <motion.div
                  key="login-normal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 flex-1 flex flex-col justify-center"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">
                      {isInstMode ? "Login Instituicional" : isGovMode ? "Login Admin" : "Login"}
                    </h2>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="grid gap-1.5">
                      <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                        {(isInstMode || isGovMode) ? "Número de Agente" : "Número de BI de Cidadão"}
                      </span>
                      <input 
                        className="border border-slate-200 bg-slate-50/50 focus:bg-white rounded-2xl p-4 outline-none focus:border-primary transition-all font-mono font-bold tracking-wider text-slate-800"
                        value={bi}
                        onChange={(e) => setBi(e.target.value.toUpperCase())}
                        placeholder={isInstMode ? "AGT-9921-SR" : isGovMode ? "ADM-8812-OP" : "002931298LA045"}
                        maxLength={14}
                      />
                    </label>

                    <label className="grid gap-1.5">
                      <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Senha de Acesso</span>
                      <input 
                        type="password"
                        className="border border-slate-200 bg-slate-50/50 focus:bg-white rounded-2xl p-4 outline-none focus:border-primary transition-all font-bold tracking-wider text-slate-800"
                        placeholder="••••••••••••"
                      />
                    </label>

                    <div className="pt-4 flex flex-col gap-5">
                      <button 
                        onClick={handleLoginSubmit}
                        className="w-full bg-primary text-white rounded-[20px] py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/15 hover:opacity-95 transition-all cursor-pointer border-0"
                      >
                        Entrar no Portal
                      </button>

                      {/* Separador Horizontal Moderno "Ou" */}
                      <div className="relative flex items-center py-1">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-white px-3 select-none">Ou</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>

                      {/* Botão Principal Login Facial */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (emergencyMode && !isInstMode && !isGovMode && (bi.toLowerCase().includes('002931298') || bi.toLowerCase().includes('edlasio') || profileName.toLowerCase().includes('edlasio'))) {
                            setLoginError("Autenticação Biométrica Recusada: Credenciais e chaves biométricas bloqueadas temporariamente ao abrigo do protocolo SOC-AN-2026.");
                            addAuditLog("INTERRUPÇÃO COCOS: Tentativa de login facial por Edlasio Galhardo suspensa (SOC-AN-2026)", "critical");
                            return;
                          }
                          setFaceProgress(0);
                          setLoginSubMode('face-capture');
                          addAuditLog('Iniciado Login Biométrico Facial', 'info');
                        }}
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-100 hover:border-slate-200 rounded-[20px] py-3.5 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <Fingerprint size={16} className="text-primary animate-pulse" />
                        Login Facial
                      </button>

                      {/* Links de Ação Registar e Esqueci Senha apenas para Cidadão/Usuário */}
                      {!(isInstMode || isGovMode) && (
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-2 border-t border-slate-50 px-1">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginSubMode('register');
                            }}
                            className="text-slate-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer text-[10px] font-black uppercase tracking-widest font-sans"
                          >
                            Registar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAccessModalTitle('Recuperação de Credenciais');
                              setAccessModalMessage('Para recuperar a sua senha ou o seu código de segurança governamental (PIN), por favor dirija-se a um guiché físico de atendimento do SME, AGT ou contacte a linha oficial de suporte do Correio Digital de Angola.');
                              setShowAccessModal(true);
                            }}
                            className="text-slate-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer text-[10px] font-black uppercase tracking-widest font-sans"
                          >
                            Esqueci Senha
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {loginSubMode === 'two-factor' && (
                <motion.div
                  key="login-2fa"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 flex-1 flex flex-col justify-center text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xs border border-blue-100">
                    <Smartphone size={28} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Autenticação de canais</h3>
                    <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto mt-1 leading-relaxed">
                      Enviámos um SMS com o código aleatório temporário (OTP) para o telemóvel associado: <strong className="font-bold text-slate-800 font-mono">{phone.replace(/\d{3} \d{3}$/, '*** ***')}</strong>.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full font-mono font-black text-2xl tracking-[0.5em] text-center p-4 bg-slate-50 border border-slate-200 focus:border-blue-500 bg-white transition-all rounded-2xl"
                    />

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 text-[11px] text-blue-800 text-center font-bold">
                      Dica de Simulação: O código de teste recebido por canais é <strong>123456</strong>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setLoginSubMode('normal')}
                        className="py-4 bg-slate-50 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => {
                          if (enteredOtp === '123456' || enteredOtp.length === 6) {
                            setStage('app');
                            addAuditLog('Login concluído com factor duplo SMS', 'success');
                          } else {
                            alert("Código de verificação OTP incorrecto. Utilize o código de simulação 123456.");
                          }
                        }}
                        className="py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:opacity-95 shadow-lg shadow-primary/10 cursor-pointer border-0"
                      >
                        Validar OTP
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {loginSubMode === 'face-capture' && (
                <motion.div
                  key="login-face"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-center text-center p-2 relative"
                >
                  {/* Badge top */}
                  <div className="inline-flex items-center gap-1 bg-blue-50/70 border border-blue-100/50 px-3 py-1 rounded-full text-blue-600 font-extrabold text-[9px] uppercase tracking-[0.15em] mx-auto w-fit">
                    <Shield size={11} className="text-blue-500" />
                    LOGIN FACIAL
                  </div>

                  {/* Title & Subtitle with relative Back button on left */}
                  <div className="space-y-1 relative">
                    <div className="flex items-center justify-center gap-2 relative">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginSubMode('normal');
                          addAuditLog('Sair do login facial', 'info');
                        }}
                        className="absolute left-1 p-1.5 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-slate-800 border-0 cursor-pointer flex items-center justify-center focus:outline-none"
                        title="Voltar"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <h2 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tight leading-none">
                        Login Facial
                      </h2>
                    </div>
                    <p className="text-slate-500 text-[11px] font-semibold max-w-sm mx-auto leading-normal px-8">
                      Registe o seu padrão facial tridimensional codificado na infraestrutura do <strong className="font-extrabold text-blue-600">SME</strong>.
                    </p>
                  </div>

                  {/* Circle Scanning area */}
                  <div className="relative flex justify-center py-1">
                    <div className="relative w-38 h-38 rounded-full flex items-center justify-center bg-white shadow-lg">
                      {/* SVG Ring Progress */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3"
                          strokeDasharray={`${2 * Math.PI * 46}`}
                          strokeDashoffset={`${2 * Math.PI * 46 * (1 - faceProgress / 100)}`}
                          className="transition-all duration-150 ease-out"
                          strokeLinecap="round"
                        />
                        {/* Indicator Slider Dot */}
                        {faceProgress > 0 && faceProgress < 100 && (
                          <circle
                            cx={50 + 46 * Math.cos((faceProgress / 100) * 2 * Math.PI - Math.PI / 2)}
                            cy={50 + 46 * Math.sin((faceProgress / 100) * 2 * Math.PI - Math.PI / 2)}
                            r="2.5"
                            fill="#3b82f6"
                            className="shadow-sm"
                          />
                        )}
                      </svg>

                      {/* Main dark vector circle */}
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] relative flex items-center justify-center border-4 border-white shadow-inner z-5">
                        {/* Faint Tech Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:10px_10px] opacity-25" />

                        {/* Scanner Laser Bar */}
                        {isFaceScanning && (
                          <div 
                            className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] z-20 pointer-events-none" 
                            style={{
                              animation: 'scan-motion 2.5s infinite ease-in-out',
                              position: 'absolute'
                            }} 
                          />
                        )}

                        {/* Bracket Corners */}
                        <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white rounded-tl-xs opacity-80 pointer-events-none" />
                        <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white rounded-tr-xs opacity-80 pointer-events-none" />
                        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white rounded-bl-xs opacity-80 pointer-events-none" />
                        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white rounded-br-xs opacity-80 pointer-events-none" />

                        {/* Beautiful Face Wireframe SVG */}
                        <svg className="w-18 h-18 text-blue-400/30 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] pointer-events-none z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
                          {/* Outer Face Grid Oval */}
                          <path d="M50,15 C28,15 28,65 50,85 C72,65 72,15 50,15 Z" strokeDasharray="2 2" className="opacity-40" />
                          <path d="M50,15 L50,85" strokeDasharray="1 3" className="opacity-30" />
                          <path d="M22,50 L78,50" strokeDasharray="1 3" className="opacity-30" />
                          
                          {/* Face Geodesics */}
                          <path d="M34,30 Q50,40 66,30" />
                          <path d="M30,45 Q50,57 70,45" />
                          <path d="M32,60 Q50,72 68,60" />
                          <path d="M38,72 Q50,81 62,72" />
                          <path d="M38,18 Q44,45 38,72" />
                          <path d="M62,18 Q56,45 62,72" />
                          
                          {/* Eyes & nose indicators */}
                          <circle cx="42" cy="42" r="1" className="fill-blue-300" />
                          <circle cx="58" cy="42" r="1" className="fill-blue-300" />
                          <polygon points="50,45 47,55 53,55" strokeWidth="0.6" />
                          
                          {/* Glowing blue vertices */}
                          <circle cx="50" cy="15" r="1.5" className="fill-blue-400 animate-pulse" />
                          <circle cx="50" cy="30" r="1" className="fill-blue-400" />
                          <circle cx="50" cy="45" r="1" className="fill-blue-400" />
                          <circle cx="50" cy="60" r="1" className="fill-blue-400" />
                          <circle cx="50" cy="85" r="1.5" className="fill-blue-400 animate-pulse" />
                          <circle cx="34" cy="30" r="1" className="fill-blue-400" />
                          <circle cx="66" cy="30" r="1" className="fill-blue-400" />
                          <circle cx="30" cy="45" r="1" className="fill-blue-400" />
                          <circle cx="70" cy="45" r="1" className="fill-blue-400" />
                          <circle cx="38" cy="72" r="1" className="fill-blue-400" />
                          <circle cx="62" cy="72" r="1" className="fill-blue-400" />
                        </svg>

                        {/* Overlapping Camera button indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-950/70 border border-white/20 flex items-center justify-center text-white z-20 shadow-lg">
                          <Camera size={10} className={isFaceScanning ? "animate-pulse text-blue-400" : "text-slate-200"} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status Banner */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-center">
                      <CheckCircle size={13} className={faceProgress === 100 ? "text-emerald-500" : isFaceScanning ? "text-blue-500 animate-spin" : "text-emerald-500"} />
                      <span className="text-emerald-600 font-extrabold uppercase tracking-widest text-[8.5px] font-sans">
                        {faceProgress === 100 ? "Pronto para submissão" : isFaceScanning ? `A digitalizar: ${faceProgress}%` : "Pronto para captura"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[9.5px] font-semibold">
                      {faceProgress === 100 ? "Biometria processada com sucesso." : isFaceScanning ? "Mantenha o rosto imóvel no círculo." : "Posicione o rosto no centro da moldura."}
                    </p>
                  </div>

                  {/* Main Action Button to Start scan */}
                  <button
                    type="button"
                    disabled={isFaceScanning || faceProgress === 100}
                    onClick={() => {
                      if (emergencyMode && !isInstMode && !isGovMode && (bi.toLowerCase().includes('002931298') || bi.toLowerCase().includes('edlasio') || profileName.toLowerCase().includes('edlasio'))) {
                        setLoginError("Autenticação Biométrica Recusada: Credenciais e chaves biométricas bloqueadas temporariamente ao abrigo do protocolo SOC-AN-2026. Acesso Suspenso para Salvaguarda de Soberania.");
                        addAuditLog("INTERRUPÇÃO COCOS: Caputra facial recusada (SOC-AN-2026)", "critical");
                        return;
                      }
                      setFaceProgress(0);
                      setIsFaceScanning(true);
                      addAuditLog('Iniciou digitalização biométrica facial no portal', 'info');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none cursor-pointer border-0"
                  >
                    <Fingerprint size={14} />
                    INICIAR CAPTURA FACIAL
                  </button>

                  {/* Encryption Footer label */}
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[8.5px] font-bold">
                    <Lock size={11} className="text-slate-400" />
                    <span>Os seus dados biométricos estão protegidos e criptografados.</span>
                  </div>
                </motion.div>
              )}

              {loginSubMode === 'register' && (
                <motion.div
                  key="login-register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  <RegisterStepper 
                    onCancel={() => setLoginSubMode('normal')} 
                    onSuccess={() => setLoginSubMode('normal')}
                    addAuditLog={addAuditLog}
                  />
                </motion.div>
              )}


            </AnimatePresence>
          </motion.div>
        </div>

        {/* Modal de Detalhes Adicionais (Registar / Esqueci Senha) */}
        <AnimatePresence>
          {showAccessModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAccessModal(false)}
                className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[300]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 bottom-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md bg-white rounded-[32px] shadow-2xl z-[301] overflow-hidden border border-slate-100 text-left font-sans flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white relative">
                  <button
                    onClick={() => setShowAccessModal(false)}
                    className="absolute top-5 right-5 p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer border-0 text-white bg-transparent flex items-center justify-center placeholder:hidden"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-[14px] flex items-center justify-center text-white border border-white/20">
                      <Shield size={20} className="text-indigo-200" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300 font-bold">Correio Digital de Angola</div>
                      <h3 className="text-base font-black italic tracking-tight uppercase leading-none mt-1">
                        {accessModalTitle}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-4 overflow-y-auto custom-scrollbar">
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                    {accessModalMessage}
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 text-left">
                    <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Segurança Validada pelo Estado</p>
                      <p className="text-[9px] text-slate-450 font-medium leading-relaxed uppercase">
                        Todas as transações e acessos a este portal estão associados de forma única à sua identidade civil nacional.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAccessModal(false)}
                    className="px-6 py-3 bg-primary hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-0 shadow-lg shadow-primary/10"
                  >
                    Compreendido
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Voice Guide Assistant for Mobile Screens */}
        {showVoiceGuide && (
          <div className="fixed bottom-6 right-6 z-[150] max-w-sm w-[calc(100vw-32px)] md:hidden block">
            <VoiceGuideAssistant
              onScrollDown={() => {
                const el = document.getElementById('cda-login-form-container');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }
              }}
              onFocusSteps={() => {
                setHighlightSteps(true);
                setTimeout(() => setHighlightSteps(false), 5000);
              }}
              onCollapseStart={() => {
                setLoginSubMode('register');
              }}
              onCloseAssistant={() => {
                setShowVoiceGuide(false);
              }}
            />
          </div>
        )}
      </section>
    );
  }


  return (
    <main className={`min-h-screen bg-bg text-primary md:flex md:gap-5 md:p-5 font-sans selection:bg-primary selection:text-white transition-all ${emergencyMode && isGovMode ? 'pt-[32px] md:pt-[44px]' : ''}`}>
      {/* Navigation */}
      <AnimatePresence>
        {emergencyMode && isGovMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[2000] bg-red-600 text-white flex items-center justify-center gap-3 overflow-hidden shadow-2xl"
          >
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">MODO DE EMERGÊNCIA ACTIVO - OPERAÇÕES RESTRITAS</span>
            <ShieldAlert size={16} className="animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Sidebar 
        tab={tab} 
        setTab={setTab} 
        setSelectedMessage={setSelectedMessage} 
        setSelectedDoc={setSelectedDoc}
        handleLogout={handleLogout}
        appMode={appMode}
        setAppMode={setAppMode}
        setStage={(s) => {
          setStage(s);
          if (s === 'splash') {
            setLoginSubMode('normal');
          }
        }}
      />
      <MobileNavBar 
        tab={tab} 
        setTab={setTab} 
        setSelectedMessage={setSelectedMessage} 
        setSelectedDoc={setSelectedDoc}
        appMode={appMode}
      />

      <div className="flex-1 md:bg-white md:rounded-[32px] md:shadow-xl md:border border-line/60 md:overflow-hidden flex flex-col min-h-screen md:min-h-0 relative">
        <div className={emergencyMode && isGovMode ? 'md:mt-0' : ''}>
          <Header 
            setTab={setTab} 
            iaLiveActive={iaLiveActive} 
            startIaVoice={startIaVoice} 
            stopIaVoice={stopIaVoice} 
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            appMode={appMode}
            emergencyMode={emergencyMode}
            isOnline={isOnline}
            onClickConnectivity={() => {
              setOfflineQueue(OfflineManager.getQueue());
              setShowOfflineManagerWidget(!showOfflineManagerWidget);
            }}
            offlineQueueLength={offlineQueue.length}
            NotificationDropdown={() => (
              <NotificationDropdown 
                showNotifications={showNotifications} 
                setShowNotifications={setShowNotifications} 
                notifications={notifications} 
                setTab={setTab} 
                setSelectedDoc={setSelectedDoc} 
              />
            )}
          />
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className={`flex-1 px-4 pb-32 md:p-8 overflow-y-auto custom-scrollbar ${emergencyMode && isGovMode ? 'pt-[104px] md:pt-1' : (isGovMode ? 'pt-16 md:pt-1' : 'pt-16 md:pt-4')}`}
        >
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      <AIChatAssistant 
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          stopIaVoice();
        }}
        iaLiveActive={iaLiveActive} 
        stopIaVoice={stopIaVoice}
        appMode={appMode}
        onCreateRequest={handleCreateRequest}
      />

      <AddContactModal 
        isAddingContact={isAddingContact} 
        setIsAddingContact={setIsAddingContact} 
        contactForm={contactForm} 
        setContactForm={setContactForm} 
        setShowInviteConfirm={setShowInviteConfirm} 
      />

      <InviteConfirmModal 
        showInviteConfirm={showInviteConfirm} 
        setShowInviteConfirm={setShowInviteConfirm} 
        contactForm={contactForm} 
        handleAddContact={handleAddContact} 
      />

      <DeleteContactModal 
        contactToDelete={contactToDelete} 
        setContactToDelete={setContactToDelete} 
        handleDeleteContact={handleDeleteContact} 
      />

      {/* --- OFFLINE & FALLBACK INTERACTIVE MANAGER WIDGET --- */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none select-none">
        {/* Active Fallback Alert Overlay */}
        <AnimatePresence>
          {activeFallback && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/30 text-white rounded-2xl p-4 shadow-2xl max-w-sm pointer-events-auto"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/15 text-amber-500 rounded-xl">
                  {activeFallback.channel === 'SMS' ? <Mail size={18} /> : activeFallback.channel === 'USSD' ? <Signal size={18} /> : <Smartphone size={18} />}
                </div>
                <div className="flex-1 min-w-0 font-sans">
                  <span className="font-extrabold text-[10px] uppercase tracking-widest text-amber-500 block">Canal Alternativo Acionado ({activeFallback.channel})</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed font-semibold">{activeFallback.message}</p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400 font-mono">
                    <span>Protocolo: {activeFallback.protocol}</span>
                    <button
                      type="button"
                      onClick={() => setActiveFallback(null)}
                      className="text-amber-500 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Dispensar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Connectivity Central Modal */}
      <AnimatePresence>
        {showOfflineManagerWidget && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-left"
            >
              <div className="p-5 bg-slate-950 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary/20 text-primary rounded-xl">
                    <Database size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white font-sans">Gestor Híbrido de Conectividade</h4>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-sans">Cache Local, Redundância SMS & USSD</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOfflineManagerWidget(false)}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Simulated Switch toggle */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="font-sans block text-left">
                    <span className="font-bold text-xs text-slate-800 block">Simular Perda de Internet</span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">Simula emulador de offline para testar cache, fallbacks SMS/USSD e sincronização.</span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={simulatedOffline}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setSimulatedOffline(val);
                        localStorage.setItem('gov_simulated_offline', String(val));
                        addAuditLog(val ? 'Modo de Conectividade: Simulação Offline Ativada' : 'Modo de Conectividade: Voltando ao estado Online', val ? 'warning' : 'success');
                      }}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Queue details */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fila de Ações Locais ({offlineQueue.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        OfflineManager.setQueue([]);
                        setOfflineQueue([]);
                        addAuditLog('Fila de ações offline limpa manualmente', 'warning');
                      }}
                      className="text-[9px] font-bold text-rose-600 hover:underline uppercase tracking-wide cursor-pointer"
                    >
                      Limpar Fila
                    </button>
                  </div>

                  {offlineQueue.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-slate-400 font-sans">
                      <Database className="mx-auto text-slate-300 mb-2" size={24} />
                      <p className="text-xs font-semibold">Nenhuma ação pendente na fila.</p>
                      <p className="text-[10px] mt-0.5 leading-relaxed">Qualquer ação efetuada (mensagens, solicitações, contactos) enquanto offline será enfileirada aqui para posterior sincronização.</p>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-100 bg-slate-50 rounded-2xl p-2.5">
                      {offlineQueue.map((item) => (
                        <div key={item.id} className="p-2 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-left font-sans">
                          <div>
                            <span className="text-[10px] font-bold text-slate-800 block uppercase font-mono">{item.type}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(item.timestamp).toLocaleTimeString('pt-AO')} &bull; ID: {item.id.substring(0, 10)}</span>
                          </div>
                          <span className="text-[8px] bg-amber-100 border border-amber-200 text-amber-800 font-extrabold uppercase px-1.5 py-0.5 rounded-full font-mono">Pendente</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Channel Redundancy Info */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 font-sans text-left">
                  <span className="text-xs font-extrabold text-[#1e293b] flex items-center gap-1.5 uppercase tracking-wide">
                    <Signal size={14} className="text-primary animate-pulse" /> Canais Redundantes Governamentais
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-semibold">
                    Caso a internet móvel (Unitel/Movicel) falhe durante o preenchimento de documentos:
                  </p>
                  <ul className="text-[10px] text-slate-500 font-bold space-y-1.5 mt-2 list-disc pl-4 leading-normal">
                    <li><strong className="text-primary">Sms Fallback:</strong> Os dados são compactados em payload seguro e direcionados para o número curto governamental.</li>
                    <li><strong className="text-primary">Código USSD (*141*9#):</strong> Permite verificar certidões e assinar trâmites com chave física sem qualquer plano de internet ativo.</li>
                  </ul>
                </div>
              </div>

              {/* Action feet */}
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfflineManagerWidget(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  disabled={offlineQueue.length === 0}
                  onClick={() => {
                    handleAutomaticSync();
                    setShowOfflineManagerWidget(false);
                  }}
                  className={`flex-1 py-2.5 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer border-0 ${
                    offlineQueue.length > 0 
                      ? 'bg-primary text-white hover:opacity-95 shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw size={14} className="animate-spin" />
                  Sincronizar Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
