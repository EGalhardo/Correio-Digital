/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Scan, Mail, QrCode, Users, User, Shield, ShieldAlert, Lock, Fingerprint, Smartphone, Key, ShieldCheck, Camera } from 'lucide-react';

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
  PastaDigitalContent,
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
import { Message, Document, Contact, AppNotification, AppMode, UserRequest, DocRequest } from './types';
import { ensureProtocolOnMessage, ensureProtocolOnDocument, generateProtocol } from './utils/protocolGenerator';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [tab, setTab] = useState('home');
  
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
    return items.map(ensureProtocolOnMessage);
  });
  
  const [sentMessages, setSentMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('correio_digital_sent');
    const items = saved ? JSON.parse(saved) : [...SENT_MESSAGES];
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
    return localStorage.getItem('correio_digital_verification_status') || 'Parcialmente verificado';
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

  // UI States
  const [loginSubMode, setLoginSubMode] = useState<'normal' | 'two-factor' | 'face-capture' | 'pin-entry'>('normal');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [faceProgress, setFaceProgress] = useState(0);
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
  
  const [correspondenciaTab, setCorrespondenciaTab] = useState('naoLidas');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [contactForm, setContactForm] = useState({ name: '', bi: '', relation: '' });
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showInviteConfirm, setShowInviteConfirm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchMail, setSearchMail] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Face Scan simulated progress for login screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loginSubMode === 'face-capture') {
      if (faceProgress < 100) {
        timer = setTimeout(() => {
          setFaceProgress(p => {
            const next = p + 20;
            return next >= 100 ? 100 : next;
          });
        }, 300);
      } else {
        setLoginSubMode('pin-entry');
      }
    } else {
      setFaceProgress(0);
    }
    return () => clearTimeout(timer);
  }, [loginSubMode, faceProgress]);

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
    localStorage.setItem('correio_digital_inst_inbox', JSON.stringify(instInbox));
  }, [instInbox]);

  useEffect(() => {
    localStorage.setItem('correio_digital_sent', JSON.stringify(sentMessages));
  }, [sentMessages]);

  useEffect(() => {
    localStorage.setItem('correio_digital_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('correio_digital_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('correio_digital_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
        actions: ["Ver detalhes"]
      },
      protocol: protocol
    };

    setSentMessages(prev => [newMessage, ...prev]);
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '' });
    addAuditLog(`Correspondência enviada com Protocolo ${protocol.protocolNumber}`, 'info');
  };

  const handleReply = (msg: Message) => {
    setComposeData({
      to: msg.org,
      subject: `RE: ${msg.details?.subject || msg.preview.substring(0, 30)}`,
      body: `\n\n--------------------------------\nEm resposta à mensagem de ${msg.date}:\n"${msg.preview}"`
    });
    setTab('correspondencias');
    setIsComposing(true);
  };

  const handleDeleteContact = () => {
    if (contactToDelete) {
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      addAuditLog(`Contacto removido: ${contactToDelete.name}`, 'warning');
      setContactToDelete(null);
    }
  };

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.bi) return;
    setContacts(prev => [
      {
        id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
        name: contactForm.name,
        bi: contactForm.bi,
        relation: contactForm.relation || "Contato",
        status: "Pendente",
      },
      ...prev
    ]);
    addAuditLog(`Novo contacto adicionado: ${contactForm.name}`, 'success');
    setIsAddingContact(false);
    setContactForm({ name: '', bi: '', relation: '' });
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

    addAuditLog(`Emissão de Acto: ${doc.name} para ${doc.holder} (BI: ${doc.number})`, 'success');
  };

  const handleCreateRequest = (type: string, priority: 'Alta' | 'Média' | 'Baixa' = 'Média') => {
    const newReq: UserRequest = {
      id: Date.now(),
      user: 'Edlasio Galhardo', // Currently logged in user
      type,
      priority,
      time: 'Agora',
      status: 'pendente',
      bi: bi
    };
    setUserRequests(prev => [newReq, ...prev]);
    addAuditLog(`Nova solicitação de ${type} enviada à AGT`, 'info');
    
    setNotifications(prev => [{
      id: Date.now(),
      title: 'Solicitação Enviada',
      message: `O seu pedido de ${type} foi enviado à AGT.`,
      time: 'Agora',
      type: 'info',
      targetTab: 'home'
    }, ...prev]);
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
        id: Date.now(),
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
          id: Date.now(),
          title: 'Documento Aprovado',
          message: `O seu pedido de ${request.docType} foi aprovado e emitido.`,
          time: 'Agora',
          type: 'success',
          targetTab: 'carteira'
        }, ...prev]);
      }
      
      addAuditLog(`DOC_APPROVED: ${request.docType} para ${request.userName} emitido via sistema.`, 'success');
    } else {
      addAuditLog(`DOC_REJECTED: Solicitação de ${request.docType} para ${request.userName} rejeitada.`, 'warning');
    }
  };

  const handleCreateDocRequest = (docType: string, institution: string) => {
    const newReq: DocRequest = {
      id: Date.now(),
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
      case 'pasta-digital':
        return (
          <PastaDigitalContent
            logSecurityEvent={logSecurityEvent}
            setTab={setTab}
          />
        );
      case 'contatos':
        return appMode === 'institution' ? (
          <GovContactsContent />
        ) : (
          <ContactsContent
            contacts={contacts}
            filteredContacts={filteredContacts}
            searchContact={searchContact}
            setSearchContact={setSearchContact}
            setIsAddingContact={setIsAddingContact}
            setContactToDelete={setContactToDelete}
          />
        );
      case 'perfil':
        return (
          <ProfileContent
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
      case 'gov-docs':
        return (
          <GovDocsContent 
            documents={documents} 
            requests={docRequests} 
            onUpdateStatus={handleUpdateDocRequest}
          />
        );
      case 'gov-contatos':
        return <GovContactsContent />;
      case 'gov-perfil':
        return (
          <GovPerfilContent 
            logs={auditLogs} 
            emergencyMode={emergencyMode} 
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
                  id: Date.now(),
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
      case 'gov-seguranca':
        return <GovSegurancaContent />;

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
      if (hasTwoFactor) {
        setLoginSubMode('two-factor');
      } else if (hasFacialAuth) {
        setLoginSubMode('face-capture');
        setFaceProgress(0);
      } else if (govPin && govPin.length === 4) {
        setLoginSubMode('pin-entry');
        setEnteredPin('');
      } else {
        setStage('app');
        addAuditLog('Login de Cidadão via Autenticação Segura', 'success');
      }
    };

    const handleLoginFacial = () => {
      setLoginSubMode('face-capture');
      setFaceProgress(0);
    };

    return (
      <section className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div className="max-w-[1100px] w-full mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex bg-white rounded-[40px] p-12 border border-slate-100 flex-col items-center justify-center text-center shadow-sm h-[580px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/2 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
            <img 
              src="https://i.postimg.cc/cCkwskty/Logomarca-Correio-Digital.png" 
              alt="Correio Digital" 
              className="w-72 h-auto mb-10 relative z-10"
            />
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight italic uppercase tracking-tight">
              O seu novo endereço digital oficial
            </h1>
            <p className="text-slate-500 leading-relaxed max-w-sm text-sm font-semibold">
              Receba, assine e despache correspondência governamental com validade jurídica do Estado da República de Angola.
            </p>
            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Infraestrutura Oficial Segura SME & AGT
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 min-h-[585px] flex flex-col justify-between"
          >
            <AnimatePresence mode="wait">
              {loginSubMode === 'normal' && (
                <motion.div
                  key="login-normal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 flex-1 flex flex-col justify-center"
                >
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">República de Angola</span>
                    <h2 className="text-2xl font-black text-slate-905 italic uppercase tracking-tight">Acesso Seguro</h2>
                    <p className="text-slate-500 text-xs font-semibold">Introduza o número de BI nacional para consultar as suas credenciais.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="grid gap-1.5">
                      <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Número de BI de Cidadão</span>
                      <input 
                        className="border border-slate-200 bg-slate-50/50 focus:bg-white rounded-2xl p-4 outline-none focus:border-primary transition-all font-mono font-bold tracking-wider text-slate-800"
                        value={bi}
                        onChange={(e) => setBi(e.target.value.toUpperCase())}
                        placeholder="002931298LA045"
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

                    <div className="pt-4 grid gap-3">
                      <button 
                        onClick={handleLoginSubmit}
                        className="w-full bg-primary text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/15 hover:opacity-95 transition-all cursor-pointer border-0"
                      >
                        Entrar no Portal
                      </button>

                      <div className="relative py-2 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-150"></div>
                        </div>
                        <span className="relative z-10 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ou</span>
                      </div>

                      <button 
                        onClick={handleLoginFacial}
                        className="w-full bg-white border border-slate-200 text-primary rounded-2xl py-4 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Scan size={16} /> Login Facial Biométrico
                      </button>
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
                            if (hasFacialAuth) {
                              setLoginSubMode('face-capture');
                              setFaceProgress(0);
                            } else if (govPin && govPin.length === 4) {
                              setLoginSubMode('pin-entry');
                              setEnteredPin('');
                            } else {
                              setStage('app');
                              addAuditLog('Login concluído com factor duplo SMS', 'success');
                            }
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
                  className="space-y-6 flex-1 flex flex-col justify-center text-center"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Detetor Biométrico Facial</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">
                      A validar os seus vetores criptográficos nacionais com o SME.
                    </p>
                  </div>

                  <div className="relative mx-auto w-52 h-52 rounded-full border-4 border-slate-100 overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center p-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
                    
                    {/* Laser Scanner motion bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] z-20" style={{
                      animation: 'scan-motion 2.5s infinite ease-in-out',
                      position: 'absolute'
                    }} />

                    <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-pulse pointer-events-none z-15" />

                    <div className="flex flex-col items-center justify-center text-indigo-200 gap-1.5 z-10 max-w-xs px-4">
                      <Camera size={28} className="text-emerald-400 animate-bounce" />
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Reconhecimento Facial</span>
                      <span className="text-[11px] font-mono font-bold text-white bg-emerald-950/80 px-2 py-0.5 rounded-full mt-1">
                        A mapear face: {faceProgress}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest animate-pulse">
                    Por favor, permaneça imóvel focado no círculo...
                  </div>

                  <button 
                    onClick={() => setLoginSubMode('normal')}
                    className="py-3.5 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 max-w-xs mx-auto w-full cursor-pointer border-0"
                  >
                    Usar Senha
                  </button>
                </motion.div>
              )}

              {loginSubMode === 'pin-entry' && (
                <motion.div
                  key="login-pin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 flex-1 flex flex-col justify-center text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-xs border border-amber-100">
                    <Key size={26} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">PIN Governamental</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">
                      Insira o seu PIN de 4 dígitos para concluir a autorização do portal.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="password"
                      maxLength={4}
                      value={enteredPin}
                      placeholder="••••"
                      onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center font-mono font-black text-3xl tracking-[0.6em] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 transition-all focus:bg-white"
                    />

                    <div className="bg-amber-50 border border-amber-105 rounded-xl p-3 text-[10.5px] text-amber-800 font-bold leading-normal">
                      Insira o PIN governamental que configurou no perfil (Padrão: <strong>{govPin || '1234'}</strong>)
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setLoginSubMode('normal')}
                        className="py-4 bg-slate-50 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => {
                          if (enteredPin === govPin || (!govPin && enteredPin === '1234')) {
                            setStage('app');
                            addAuditLog('Login assinado digitalmente com PIN', 'success');
                          } else {
                            alert("Código PIN incorreto civil de Angola. Tente novamente.");
                          }
                        }}
                        className="py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:opacity-95 shadow-lg shadow-primary/10 cursor-pointer border-0"
                      >
                        Desbloquear Portal
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
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
    </main>
  );
}
