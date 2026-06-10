/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Scan, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Printer, 
  Download, 
  RefreshCw, 
  FileText, 
  Search, 
  History, 
  User, 
  ShieldCheck, 
  Lock, 
  Database, 
  Calendar, 
  Building2, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  X,
  Eye
} from 'lucide-react';
import { Document, DigitalProtocol, Message } from '../../types';

interface InstQrCodeContentProps {
  documents: Document[];
  messages?: Message[];
  onSelectMessage?: (msg: Message) => void;
  addAuditLog?: (action: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
}

interface ScanHistoryItem {
  id: string;
  documentName: string;
  holder: string;
  code: string;
  number: string;
  scannedAt: string;
  status: 'VÁLIDO' | 'INVÁLIDO';
}

export function InstQrCodeContent({ documents, messages, onSelectMessage, addAuditLog }: InstQrCodeContentProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [selectedSimCode, setSelectedSimCode] = useState<string>('AO-AGT-77292');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');

  const simulationOptions = [
    {
      code: 'AO-AGT-77292',
      name: 'Ofício de Notificação AGT-77292',
      holder: 'Manuel de Vasconcelos',
      number: 'N-AGT-39811/2026',
      issuer: 'Administração Geral Tributária',
      issuedAt: '28 de Maio de 2026',
      validity: 'Resposta em 15 dias'
    },
    {
      code: 'PRT-1',
      name: 'Ofício de Pagamento Pendente (IRT / Imposto)',
      holder: 'Edlasio Galhardo',
      number: 'PRT-1001-VAL',
      issuer: 'Administração Geral Tributária',
      issuedAt: '24 de Maio de 2026',
      validity: 'Prazo Limite: 25 de Maio'
    },
    {
      code: 'PRT-2',
      name: 'Guia de Levantamento do Bilhete de Identidade',
      holder: 'Maria Antónia',
      number: 'PRT-1002-VAL',
      issuer: 'SME - Serviço de Migração e Estrangeiros',
      issuedAt: 'Ontem',
      validity: 'Validade Vitalícia'
    },
    {
      code: 'PRT-7',
      name: 'Ofício de Auditoria Fiscal de Rotina',
      holder: 'José Kalunga',
      number: 'PRT-1004-VAL',
      issuer: 'Administração Geral Tributária',
      issuedAt: '10 de Março de 2026',
      validity: 'Agendado'
    }
  ];

  const getDynamicCorrespondenceMessage = (doc: Document): Message => {
    // Attempt to find physical message in passed messages prop first
    if (messages) {
      const found = messages.find(m => 
        m.id.toString() === doc.code.replace('PRT-', '') || 
        m.protocol?.protocolNumber === doc.number || 
        m.protocol?.internalId === doc.code
      );
      if (found) return found;
    }

    // Default high-fidelity fallback message representing the official document
    return {
      id: doc.code === 'AO-AGT-77292' ? 77292 : Math.floor(1000 + Math.random() * 90000),
      org: doc.issuer.includes("Justiça") ? "MinJusDH" : doc.issuer.includes("SME") ? "SME" : "AGT",
      preview: `Ofício / Correspondência Certificada - ${doc.name}`,
      date: doc.issuedAt || "Ontem",
      status: "Urgente",
      details: {
        subject: doc.name,
        body: doc.code === 'AO-AGT-77292' 
          ? `Exmo.(a) Senhor(a) Manuel de Vasconcelos,\n\nServimo-nos deste meio oficial para notificar V. Exa. sobre divergências registadas cruzando os seus rendimentos de trabalho individual com a declaração fiscal apresentada pela entidade empregadora do exercício de 2025.\n\nPedimos que compareça à Repartição Fiscal de Luanda - Central munido da sua identificação civil e comprovativos de deduções para esclarecer a conformidade.\n\nAtentamente,\nGabinete de Inspeção Fiscal - AGT`
          : `Prezado(a) ${doc.holder},\n\nEste documento refere-se ao registo e emissão oficial de ${doc.name} sob a referência unificada ${doc.number}.\n\nO documento de correspondência encontra-se devidamente homologado no Barramento Nacional de Registos da República de Angola.\n\nEmitido por: ${doc.issuer}.`,
        deadline: doc.validity || "Sem prazo definido",
        state: "Válido"
      },
      protocol: doc.protocol || {
        internalId: doc.code,
        protocolNumber: doc.number,
        issuerInstitution: doc.issuer || "Administração Geral Tributária",
        officialIssueDate: doc.issuedAt || "28 de Maio de 2026",
        officialTime: "10:00 WAT",
        issuerResponsible: "Gabinete de Inspeção Fiscal",
        category: "Correspondência Oficial",
        documentType: doc.name,
        currentState: "Homologado",
        priority: "Urgente",
        deadlineDate: doc.validity || "Válido",
        qrCodeUrl: "https://i.postimg.cc/8P0Zgf8G/qr-code.png",
        digitalSignature: `CADA_SECURE_SIGNATURE_${doc.code}_SHA256`,
        digitalSeal: "SELO_GOV_INTEROPERADO_2026",
        documentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        institutionalCertificate: `${doc.issuer} CA ROOT G1`
      }
    };
  };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  
  // Scanned results
  const [scannedDoc, setScannedDoc] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('cda_inst_scan_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cda_inst_scan_history:', e);
      }
    }
    return [
      {
        id: 'SCAN-4003',
        documentName: 'Passaporte Digital',
        holder: 'Edlasio Galhardo',
        code: 'AO-PAS-7649',
        number: 'P-AO398102',
        scannedAt: '05/06/2026 22:01',
        status: 'VÁLIDO'
      },
      {
        id: 'SCAN-7945',
        documentName: 'Certidão de Nascimento',
        holder: 'Manuel Silva',
        code: 'AO-CERT-1192',
        number: 'REG-9912.4410',
        scannedAt: '05/06/2026 19:50',
        status: 'VÁLIDO'
      },
      {
        id: 'SCAN-7881',
        documentName: 'Certidão de Não Devedor',
        holder: 'Manuel Silva',
        code: 'AO-DEB-0812',
        number: '77654312',
        scannedAt: '05/06/2026 19:41',
        status: 'VÁLIDO'
      },
      {
        id: 'SCAN-7798',
        documentName: 'BI Digital',
        holder: 'Edlasio Galhardo',
        code: 'AO-BI-9281',
        number: '009874562LA041',
        scannedAt: '05/06/2026 18:30',
        status: 'VÁLIDO'
      },
      {
        id: 'SCAN-7791',
        documentName: 'NIF (Número de Identificação Fiscal)',
        holder: 'Edlasio Galhardo',
        code: 'AO-NIF-4412',
        number: '5412889210',
        scannedAt: '05/06/2026 09:41',
        status: 'VÁLIDO'
      },
      {
        id: 'SCAN-7688',
        documentName: 'Passaporte Digital',
        holder: 'Manuel Silva',
        code: 'AO-PAS-2210',
        number: 'P-AO092811',
        scannedAt: '04/06/2026 21:15',
        status: 'VÁLIDO'
      }
    ];
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sound generator (Beep) for scanning confirmation
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Pitch (A5)
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 150);
    } catch (e) {
      console.warn("Audio Context beep fail (safari restriction or user action needed):", e);
    }
  };

  // Turn on actual webcam stream if possible
  useEffect(() => {
    if (activeTab === 'camera' && cameraActive && isModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, cameraActive, isModalOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn("Acesso real à câmara bloqueado ou indisponível (iFrame/permissões). Usando modo de simulação visual de alta fidelidade.", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Save history helper
  const addHistoryItem = (doc: Document, status: 'VÁLIDO' | 'INVÁLIDO') => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newItem: ScanHistoryItem = {
      id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
      documentName: doc.name,
      holder: doc.holder,
      code: doc.code,
      number: doc.number,
      scannedAt: formattedDate,
      status: status
    };
    const updatedHistory = [newItem, ...scanHistory.slice(0, 9)];
    setScanHistory(updatedHistory);
    localStorage.setItem('cda_inst_scan_history', JSON.stringify(updatedHistory));
  };

  // Perform full visual scanning sequence
  const startScanningSequence = (targetDoc: Document | null) => {
    if (isScanning) return;
    setIsScanning(true);
    setScannedDoc(null);
    setIsValidated(null);
    
    // Step-by-step visual feedback for authenticity feel
    const steps = [
      { text: 'DETECTANDO PONTOS DE ANCORAGEM DO QR CODE...', delay: 400 },
      { text: 'LENDO MATRIZ DE DADOS E DESCRIPTOGRAFANDO ASSINATURA...', delay: 900 },
      { text: 'VALIDANDO PROTOCOLO COM O CENTRAL DE INTEROPERABILIDADE (CDA)...', delay: 1400 },
      { text: 'DESCRIPTOGRAFANDO SELO DE SEGURANÇA E REGISTANDO AUDITORIA...', delay: 1800 }
    ];

    steps.forEach(({ text, delay }, idx) => {
      setTimeout(() => {
        setScanStep(text);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            setScanStep('');
            
            if (targetDoc) {
              playBeep();
              setScannedDoc(targetDoc);
              setIsValidated(true);
              addHistoryItem(targetDoc, 'VÁLIDO');
              addAuditLog?.(`Auditoria: Escaneamento e validação de QR Code executada com sucesso para o documento (${targetDoc.name}) de ${targetDoc.holder}.`, 'success');
            } else {
              setIsValidated(false);
              addAuditLog?.(`Falha na Auditoria: Documento inválido ou corrompido escaneado por agente institucional.`, 'warning');
            }
          }, 400);
        }
      }, delay);
    });
  };

  // Triggers simulate scan for a document
  const handleSimulateScan = (doc: Document) => {
    startScanningSequence(doc);
  };

  // Manual code check
  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    const matched = documents.find(d => 
      d.code.toLowerCase() === manualCode.trim().toLowerCase() ||
      d.number.toLowerCase() === manualCode.trim().toLowerCase()
    );

    if (matched) {
      startScanningSequence(matched);
    } else {
      // Execute sequence that results in failure to show error state
      startScanningSequence(null);
    }
  };

  const getMockDocDetail = (item: ScanHistoryItem): Document => {
    if (item.code === 'AO-AGT-77292') {
      return {
        name: "Ofício de Notificação AGT-77292",
        holder: "Manuel de Vasconcelos",
        code: "AO-AGT-77292",
        number: "N-AGT-39811/2026",
        issuer: "Administração Geral Tributária",
        issuedAt: "28 de Maio de 2026",
        validity: "Resposta em 15 dias"
      };
    }
    if (item.code === 'AO-PAS-7649') {
      return {
        name: "Passaporte Digital",
        holder: "Edlasio Galhardo",
        code: "AO-PAS-7649",
        number: "P-AO398102",
        issuer: "SME - Direção",
        issuedAt: "18 de Junho de 2024",
        validity: "Valido ate 2030"
      };
    }
    if (item.code === 'AO-CERT-1192') {
      return {
        name: "Certidão de Nascimento",
        holder: "Manuel Silva",
        code: "AO-CERT-1192",
        number: "REG-9912.4410",
        issuer: "Ministério da Justiça e dos Direitos Humanos",
        issuedAt: "12 de Outubro de 2021",
        validity: "Vitalícia"
      };
    }
    if (item.code === 'AO-DEB-0812') {
      return {
        name: "Certidão de Não Devedor",
        holder: "Manuel Silva",
        code: "AO-DEB-0812",
        number: "77654312",
        issuer: "AGT",
        issuedAt: "01 de Junho de 2026",
        validity: "Ativo"
      };
    }
    if (item.code === 'AO-BI-9281') {
      return {
        name: "BI Digital",
        holder: "Edlasio Galhardo",
        code: "AO-BI-9281",
        number: "009874562LA041",
        issuer: "SME",
        issuedAt: "10 de Abril de 2022",
        validity: "Valido ate 2032"
      };
    }
    if (item.code === 'AO-NIF-4412') {
      return {
        name: "NIF (Número de Identificação Fiscal)",
        holder: "Edlasio Galhardo",
        code: "AO-NIF-4412",
        number: "5412889210",
        issuer: "AGT",
        issuedAt: "15 de Maio de 2018",
        validity: "Vitalício"
      };
    }
    if (item.code === 'AO-PAS-2210') {
      return {
        name: "Passaporte Digital",
        holder: "Manuel Silva",
        code: "AO-PAS-2210",
        number: "P-AO092811",
        issuer: "SME - Direção",
        issuedAt: "04 de Fevereiro de 2025",
        validity: "Valido ate 2031"
      };
    }
    const docFromProps = simulationOptions.find(opt => opt.code === item.code) || documents.find(d => d.code === item.code);
    return docFromProps || {
      name: item.documentName,
      holder: item.holder,
      code: item.code,
      number: item.number,
      issuer: "SME / AGT",
      issuedAt: "01/01/2026",
      validity: "Válido"
    };
  };

  const openScanner = () => {
    setActiveTab('camera');
    setIsModalOpen(true);
    setScannedDoc(null);
    setIsValidated(null);
    setIsScanning(true);
    setScanStep('DETECTANDO PONTOS DE ANCORAGEM...');
    
    // Find the chosen document or custom correspondence
    const chosenDoc = simulationOptions.find(opt => opt.code === selectedSimCode) || documents.find(d => d.code === selectedSimCode) || {
      name: "Ofício de Notificação AGT-77292",
      holder: "Manuel de Vasconcelos",
      code: "AO-AGT-77292",
      number: "N-AGT-39811/2026",
      issuer: "Administração Geral Tributária",
      issuedAt: "28 de Maio de 2026",
      validity: "Resposta em 15 dias"
    };

    // Simulate real high tech scanning sequence and beep
    setTimeout(() => {
      setScanStep('LENDO MATRIZ DE QR CODE...');
      setTimeout(() => {
        setScanStep('VALIDANDO JUNTO AO CENTRAL DE INTEROPERABILIDADE...');
        setTimeout(() => {
          playBeep();
          setScannedDoc(chosenDoc);
          setIsValidated(true);
          setIsScanning(false);
          setScanStep('');
          addHistoryItem(chosenDoc, 'VÁLIDO');
          addAuditLog?.(`Auditoria: Escaneamento executado com sucesso para ${chosenDoc.holder}.`, 'success');
        }, 1200);
      }, 1000);
    }, 800);
  };

  const renderScannerCard = () => (
    <div className="bg-white rounded-[32px] border border-slate-300 shadow-none p-6 md:p-8" id="scanner-card-container">
      <div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100/70">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeTab === 'camera' ? 'bg-slate-350' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {activeTab === 'camera' ? 'Leitor Inativo' : 'Pesquisa de Código Oficial / Chave CADA'}
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="text-[10px] font-black text-blue-600 hover:text-blue-750 hover:underline flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer transition-all uppercase tracking-widest"
            id="card-recent-scans-btn"
          >
            <History size={12} className="shrink-0 text-blue-500 animate-pulse" />
            <span>Leituras Recentes ({scanHistory.length})</span>
          </button>
        </div>

        {activeTab === 'camera' ? (
          /* INACTIVE SCANNER PORTRAYAL: Centered beautiful layout */
          <div className="flex flex-col items-center justify-center py-8 text-center">
            
            {/* QR Code Illustration without borders as requested */}
            <div className="relative w-32 h-32 bg-blue-50/50 hover:bg-blue-50 rounded-all flex items-center justify-center border-0 mb-6 transition-all duration-300">
              <QrCode size={56} className="text-blue-600 animate-pulse" />
            </div>

            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">Leitura de Correspondência Oficial</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-tight max-w-sm mb-6 leading-relaxed">
              Escaneie o QR Code localizado nas correspondências oficiais (ex: cartas da AGT, notificações, faturas) apresentadas pelo cidadão para receber autenticação bilateral e conceder acesso seguro à correspondência digital.
            </p>

            {/* Simulation Option Selector */}
            <div className="w-full max-w-sm mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
              <label className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Simulador de QR Code da Correspondência do Utente:
              </label>
              <select
                value={selectedSimCode}
                onChange={(e) => setSelectedSimCode(e.target.value)}
                className="w-full bg-white border border-slate-205 rounded-lg py-2 px-3 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {simulationOptions.map(opt => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name} ({opt.holder})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openScanner}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 active:scale-98 text-white flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold font-sans text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer border-0"
              id="start-read-btn"
            >
              <Camera size={14} />
              Iniciar Leitura de QR Code
            </button>
          </div>
        ) : (
          /* Manual Form Input - High Fidelity Form */
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="doc_code_input" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Código Único do Documento ou nº</label>
                <div className="relative">
                  <input
                    id="doc_code_input"
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ex: AO-BI-9281 ou 009874562LA041"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 placeholder-slate-400 uppercase tracking-wide focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="text-[9.5px] font-medium text-slate-405 uppercase">Introdução direta de metadados de registo criptográfico nacional.</p>
              </div>

              <button
                type="submit"
                disabled={isScanning || !manualCode.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Processando Validação...
                  </>
                ) : (
                  <>
                    <FileText size={14} />
                    Decodificar e Pesquisar Documento
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecentScans = () => (
    <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-300 shadow-none space-y-4" id="recent-scans-block">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100/70">
        <div className="flex items-center gap-2">
          <History className="text-slate-400 shrink-0" size={16} />
          <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider">Leituras Recentes</h3>
        </div>
        <span className="text-[9px] font-bold text-blue-600 uppercase cursor-pointer hover:underline tracking-wider">Ver todas</span>
      </div>

      <div className="overflow-auto rounded-[24px] bg-slate-50/20 custom-scrollbar max-h-[450px] border border-slate-200">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[9px] font-black uppercase tracking-widest font-sans">
            <tr>
              <th className="py-3 px-4 rounded-l-2xl">Leitura / Data</th>
              <th className="py-3 px-4">Documento / Tipo</th>
              <th className="py-3 px-4">Titular / Cidadão</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center rounded-r-2xl">Acção</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {scanHistory.map((item) => {
              // Determine Institution abbreviation like AGT, SME, etc based on documentName
              let instAbbr = 'REGISTO CIVIL';
              const nameLower = item.documentName.toLowerCase();
              if (nameLower.includes('passaporte')) {
                instAbbr = 'SME';
              } else if (nameLower.includes('nif') || nameLower.includes('finanças') || nameLower.includes('devedor')) {
                instAbbr = 'AGT';
              } else if (nameLower.includes('bi ') || nameLower.includes('identidade')) {
                instAbbr = 'MINJUSDH';
              }

              return (
                <tr 
                  key={item.id} 
                  className="text-xs text-[#334155] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="space-y-1">
                      <span className={`font-mono text-[9px] font-black px-2.5 py-0.5 rounded-lg inline-block ${
                        item.id === 'SCAN-4003'
                          ? 'text-white bg-green-600 border border-green-600'
                          : 'text-slate-400 bg-slate-150 border border-slate-100'
                      }`}>
                        {item.id}
                      </span>
                      <span className="block text-[8.5px] font-mono font-black text-slate-400 mt-1">{item.scannedAt}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase font-mono tracking-wider shrink-0">
                        {instAbbr}
                      </span>
                      <div className="truncate">
                        <span className="font-sans font-extrabold text-[11px] text-slate-650 uppercase tracking-tight block truncate max-w-[150px]" title={item.documentName}>
                          {item.documentName}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono tracking-wider block mt-0.5">
                          {item.code}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-705">
                    <div className="flex items-center gap-1.5 font-sans">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0e2b64] shrink-0" />
                      <div className="truncate">
                        <span className="truncate max-w-[130px] block font-extrabold" title={item.holder}>{item.holder}</span>
                        <span className="text-[8.5px] text-slate-400 font-mono tracking-wider font-semibold block">{item.number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase select-none shrink-0">
                      ✓ Válido
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => {
                        const doc = getMockDocDetail(item);
                        setScannedDoc(doc);
                        setIsValidated(true);
                      }}
                      className="py-1 px-3 bg-white border border-slate-205 hover:border-blue-500 hover:bg-slate-50 rounded-xl text-[9.5px] font-black uppercase text-blue-700 transition-colors cursor-pointer"
                    >
                      <Eye size={12} className="inline-block mr-1 -mt-0.5" /> Ficha
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in" id="inst-qrcode-view">
      {/* Header matching the government style and user request */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-300 shadow-none">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">ÁREA INSTITUCIONAL / VALIDADOR</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            SCANNER DE QR CODE OFICIAL
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-tight mt-1.5 leading-relaxed">
            Validação instantânea de documentos do SME, AGT e Registo Civil de Angola.
          </p>
        </div>

        {/* Action controls designed exactly as shown in the mockup */}
        <div className="flex gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={openScanner}
            className="flex items-center gap-2 px-5 py-3 text-[10px] bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black uppercase tracking-wider rounded-xl transition-all border-0 shadow-sm cursor-pointer"
          >
            <Camera size={14} />
            Iniciar Leitura
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setScannedDoc(null);
              setIsValidated(null);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-[10px] bg-white text-slate-705 border border-slate-200 hover:bg-slate-50 font-black uppercase tracking-wider rounded-xl transition-all shadow-3xs cursor-pointer ${
              activeTab === 'manual' ? 'border-blue-600 ring-2 ring-blue-500/10' : ''
            }`}
          >
            <Search size={14} />
            Código Manual
          </button>
        </div>
      </div>

      {scannedDoc ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Reusable Scanner */}
          <div className="lg:col-span-7">
            {renderScannerCard()}
          </div>

          {/* Right Column: Scanned Document Information Shield */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key="doc-profile"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white text-slate-800 rounded-[32px] overflow-hidden shadow-none border border-slate-300 p-6 flex flex-col justify-between h-full min-h-[460px]"
              >
                {/* Header Verification Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <ShieldCheck size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-md w-fit">
                          Assinatura Válida
                        </div>
                        <h2 className="text-[14px] font-black text-slate-900 uppercase mt-1 tracking-tight leading-tight">Documento Verificado</h2>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[7.5px] text-slate-400 leading-tight uppercase">
                      <span>Validação #</span>
                      <span className="block font-black text-slate-800">{scannedDoc.code.split('-')[2] || 'CDA802'}</span>
                    </div>
                  </div>

                  {/* Official Credentials High-End Card Representing Document */}
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 rounded-2xl p-4 shadow-3xs relative overflow-hidden">
                    {/* Background seal */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] text-[#0e2b64]">
                      <Building2 size={130} />
                    </div>

                    <div className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3">
                      <div className="flex gap-2 items-center">
                        <div className="w-5 h-3.5 bg-slate-100 border border-slate-200 overflow-hidden flex flex-col relative rounded-xs shrink-0">
                          {scannedDoc.issuer?.includes("Justiça") || scannedDoc.issuer?.includes("SME") ? (
                            <div className="w-full h-full flex flex-col">
                              <div className="h-1/3 bg-red-600" />
                              <div className="h-1/3 bg-yellow-500" />
                              <div className="h-1/3 bg-black" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-[#0e2b64] flex items-center justify-center">
                              <span className="text-[5px] text-white font-black">AGT</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] font-black text-[#0e2b64] uppercase tracking-widest">
                          {scannedDoc.issuer?.toUpperCase() || "REPUBLICA DE ANGOLA"}
                        </span>
                      </div>
                      <span className="text-[7.5px] font-mono bg-blue-100 text-[#0e2b64] px-1.5 py-0.5 rounded uppercase font-black">{scannedDoc.name}</span>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div>
                        <span className="text-[7px] text-slate-500 uppercase block font-black leading-none">Titular do Documento:</span>
                        <span className="font-extrabold text-slate-900 uppercase block text-xs tracking-tight mt-0.5">{scannedDoc.holder}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black leading-none">Número de Registo:</span>
                          <span className="font-black text-slate-800 font-mono text-[9.5px] block mt-0.5">{scannedDoc.number}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black leading-none">Chave Unificada:</span>
                          <span className="font-black text-blue-750 font-mono text-[9.5px] block mt-0.5">{scannedDoc.code}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-[7.5px]">
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black leading-none">Autoridade Emissora:</span>
                          <span className="font-extrabold text-slate-800 uppercase mt-0.5 block">{scannedDoc.issuer}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black leading-none">Estado Legal:</span>
                          <span className="font-extrabold text-emerald-600 uppercase flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Ativo &amp; Válido
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT LETTER INTEGRATION WORKFLOW VIEW */}
                  {scannedDoc.code === 'AO-AGT-77292' && (
                    <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4 text-left font-serif text-slate-800 space-y-3 shadow-3xs relative overflow-hidden animate-fade-in">
                      <div className="border-b border-amber-200/60 pb-2 flex justify-between items-center text-[8.5px] font-sans font-black text-amber-850 tracking-wider">
                        <span>CONTEÚDO DA CARTA INTEGRADA (LEITURA QR CODE)</span>
                        <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">INFO CONFIDENCIAL</span>
                      </div>
                      
                      <div className="space-y-2.5 text-[10.5px] leading-relaxed">
                        <p className="font-bold font-sans text-[11px] text-[#0c2340] uppercase">
                          ASSUNTO: Convocatória para Esclarecimento de Divergências de IRT (Ano Fiscal 2025)
                        </p>
                        <p className="text-slate-700 italic font-sans font-semibold">
                          Exmo.(a) Senhor(a) {scannedDoc.holder},
                        </p>
                        <p className="text-slate-650">
                          Servimo-nos deste meio oficial para notificar V. Exa. sobre divergências registadas cruzando os seus rendimentos de trabalho individual com a declaração fiscal apresentada pela entidade empregadora do exercício de 2025.
                        </p>
                        <p className="text-slate-650">
                          Pedimos que compareça à <strong>Repartição Fiscal de Luanda - Central</strong> munido da sua identificação civil civil e comprovativos de deduções para esclarecer a conformidade.
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-dashed border-amber-200/60 flex justify-between items-center text-[8px] font-sans font-black text-slate-400 uppercase">
                        <span>Ref Oficial: {scannedDoc.number}</span>
                        <span>AGT • Repartição Geral</span>
                      </div>
                    </div>
                  )}

                  {/* Encryption & handshake metadata details */}
                  <div className="space-y-2 text-[10px]">
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-1.5 font-mono">
                      <div className="flex justify-between text-[8px] pb-1 border-b border-slate-200 text-slate-500">
                        <span>METADADOS DE INTEROPERABILIDADE</span>
                        <span>SHA-256 SECURE</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500">Assinatura Digital:</span>
                        <span className="text-indigo-600 font-extrabold">SHA256_VERIFIED</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500">Canal Seguro:</span>
                        <span className="text-emerald-600 font-extrabold">CADA-TSL-1.3</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500">Timestamp da auditoria:</span>
                        <span className="text-slate-700 font-semibold">
                          {new Date().toLocaleDateString('pt-PT')} {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="pt-1.5 text-[7.5px] text-slate-450 leading-normal border-t border-slate-200 break-all max-h-12 overflow-y-auto">
                        HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Print/Download and New action button */}
                 <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                   <button
                     type="button"
                     onClick={() => {
                       const matchedMsg = getDynamicCorrespondenceMessage(scannedDoc);
                       if (onSelectMessage) {
                         onSelectMessage(matchedMsg);
                       }
                     }}
                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer text-center shadow-sm flex items-center justify-center gap-2"
                   >
                     <FileText size={13} className="text-white animate-pulse" />
                     Aceder à Correspondência Digital
                   </button>

                   <div className="flex gap-2">
                     <button
                       type="button"
                       onClick={() => alert(`A IMPRIMIR: Comprovativo oficial de validação em Papel de Segurança CDA. Código ${scannedDoc.code}`)}
                       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-705 border border-slate-200 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                     >
                       <Printer size={13} className="text-slate-500" />
                       Imprimir Ficha
                     </button>
                     <button
                       type="button"
                       onClick={() => alert(`A DESCARREGAR: Certidão em formato PDF assinado ICP-Angola.`)}
                       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-705 border border-slate-200 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                     >
                       <Download size={13} className="text-slate-550" />
                       Baixar PDF
                     </button>
                   </div>
                   
                   <button
                     type="button"
                     onClick={() => {
                       setScannedDoc(null);
                       setIsValidated(null);
                     }}
                     className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer text-center shadow-xs"
                   >
                     Efectuar Nova Leitura (Limpar)
                   </button>
                 </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Standby/Centered View: High alignment, perfect centered structure as requested */
        <div className="w-full">
          {renderScannerCard()}
        </div>
      )}

      {/* ACTIVE SCANNER MODAL OVERLAY: EXACT replication of the right mockup image */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Darkened backdrop to obscure the underlying page completely */}
            <motion.div 
              key="scanner-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[700]"
            />
            {/* Centered Modal Card with high z-index and pristine animation */}
            <motion.div 
              key="scanner-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-md bg-white text-slate-800 rounded-[32px] p-6 shadow-3xl z-[701] border border-slate-100/80 flex flex-col items-center"
            >
              {/* Close X Button top-right */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-450 hover:text-slate-750 transition-colors cursor-pointer border-0 bg-transparent p-1 focus:outline-none"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

              <h3 className="text-xs font-black tracking-wider uppercase text-slate-405 mb-6 mt-2">
                {!isScanning && scannedDoc ? 'Resultado da Validação' : 'Ler QR Code Oficial'}
              </h3>

              {!isScanning && scannedDoc ? (
                /* Success View inside the modal */
                <div className="w-full flex flex-col items-center text-center space-y-6">
                  {/* Big Green Stamp animation */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-emerald-50 rounded-full border border-emerald-100"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)]"
                    >
                      <ShieldCheck size={40} strokeWidth={2} />
                    </motion.div>
                  </div>

                  {/* Identification tags */}
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      ✓ ASSINATURA DIGITAL VÁLIDA
                    </span>
                    <h2 className="text-md font-black text-slate-900 uppercase tracking-tight">
                      {scannedDoc.name}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                      {scannedDoc.holder}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-slate-430 mt-1">
                      Chave CADA: {scannedDoc.code}
                    </p>
                  </div>

                  {/* Informational success text */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl w-full text-left text-[11px] text-slate-500 leading-normal font-semibold">
                    Este documento foi devidamente autenticado e verificado de forma bilateral contra o Barramento Nacional de Registos da República de Angola.
                  </div>

                  {/* Actions inside Modal */}
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => {
                        setIsModalOpen(false);
                        const matchedMsg = getDynamicCorrespondenceMessage(scannedDoc);
                        if (onSelectMessage) {
                          onSelectMessage(matchedMsg);
                        }
                      }}
                      className="flex-1 border-0 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white px-5 py-3 rounded-xl transition-all font-sans text-[10px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      VER FICHA COMPLETA
                    </button>
                    <button 
                      onClick={openScanner}
                      className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 px-5 py-3 rounded-xl transition-all font-sans text-[10px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      NOVA LEITURA
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard scanning viewfinder */
                <>
                  {/* Viewfinder scanner area */}
                  <div className="relative w-72 h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center select-none shadow-inner mb-6">
                    
                    {/* Genuine Camera Live Stream Feed if Active */}
                    {cameraActive && (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="absolute inset-0 w-full h-full object-cover opacity-45 transform scale-x-[-1]"
                      />
                    )}

                    {/* Neon corners precisely positioned */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-[#32b5f8] rounded-tl-[10px]" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-[#32b5f8] rounded-tr-[10px]" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-[#32b5f8] rounded-bl-[10px]" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-[#32b5f8] rounded-br-[10px]" />

                    {/* Scanning laser line */}
                    <motion.div 
                      animate={{ y: [-110, 110, -110] }} 
                      transition={{ repeat: Infinity, ease: 'easeInOut', duration: 2.2 }} 
                      className="absolute left-6 right-6 h-[2px] bg-cyan-400 shadow-[0_0_12px_#38bdf8] rounded-full z-20 pointer-events-none" 
                    />

                    {/* Guidelines focus grid */}
                    <div className="absolute inset-4 border border-dashed border-slate-800/60 rounded-lg opacity-40 animate-pulse" />

                    {/* Real-time status tracker */}
                    <div className="flex flex-col items-center justify-center text-center p-4 z-10 space-y-3 bg-slate-900/90 backdrop-blur-xs rounded-xl border border-slate-800/50 max-w-[200px]">
                      <RefreshCw size={22} className="text-[#32b5f8] animate-spin" />
                      <span className="text-[#32b5f8] text-[8.5px] font-black tracking-widest uppercase leading-normal animate-pulse">
                        {scanStep}
                      </span>
                    </div>

                    {/* Ambient backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.85)_100%)] pointer-events-none" />
                  </div>

                  {/* Informative Status Badge bar exactly matching mockup */}
                  <div className="flex items-center gap-3 w-full bg-slate-50 border border-slate-150 p-3.5 rounded-2xl mb-6">
                    <div className="w-9 h-9 rounded-full border border-slate-205 flex items-center justify-center text-slate-400 shrink-0">
                      <Camera size={15} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-tight text-left leading-normal">
                      Posicione o código dentro da área de leitura para iniciar.
                    </p>
                  </div>

                  {/* Bottom Fechar button */}
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 px-8 py-2.5 rounded-full transition-all font-sans text-xs font-black uppercase tracking-wider cursor-pointer focus:outline-none"
                  >
                    Fechar
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HISTORY DIALOG / MODAL */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              key="history-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[700]"
            />
            <motion.div 
              key="history-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-4xl bg-white text-slate-800 rounded-[32px] p-6 md:p-8 shadow-3xl z-[701] border border-slate-100/80 flex flex-col"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="text-blue-600" size={20} />
                  <h3 className="text-md font-black text-slate-900 uppercase tracking-widest font-sans">Leituras Recentes</h3>
                </div>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="text-slate-405 hover:text-slate-705 transition-colors cursor-pointer border-0 bg-transparent p-1 focus:outline-none"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 overflow-auto max-h-[60vh] rounded-[24px] border border-slate-150 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead className="sticky top-0 z-10 bg-blue-950 text-white text-[9px] font-black uppercase tracking-widest font-sans">
                    <tr>
                      <th className="py-3 px-4 rounded-l-2xl">Leitura / Data</th>
                      <th className="py-3 px-4">Documento / Tipo</th>
                      <th className="py-3 px-4">Titular / Cidadão</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-center rounded-r-2xl">Acção</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {scanHistory.map((item) => {
                      let instAbbr = 'REGISTO CIVIL';
                      const nameLower = item.documentName.toLowerCase();
                      if (nameLower.includes('passaporte')) {
                        instAbbr = 'SME';
                      } else if (nameLower.includes('nif') || nameLower.includes('finanças') || nameLower.includes('devedor')) {
                        instAbbr = 'AGT';
                      } else if (nameLower.includes('bi ') || nameLower.includes('identidade')) {
                        instAbbr = 'MINJUSDH';
                      }

                      return (
                        <tr 
                          key={item.id} 
                          className="text-xs text-[#334155] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="space-y-1">
                              <span className={`font-mono text-[9px] font-black px-2.5 py-0.5 rounded-lg inline-block ${
                                item.id === 'SCAN-4003'
                                  ? 'text-white bg-green-600 border border-green-600'
                                  : 'text-slate-400 bg-slate-150 border border-slate-100'
                              }`}>
                                {item.id}
                              </span>
                              <span className="block text-[8.5px] font-mono font-black text-slate-400 mt-1">{item.scannedAt}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase font-mono tracking-wider shrink-0">
                                {instAbbr}
                              </span>
                              <div className="truncate">
                                <span className="font-sans font-extrabold text-[11px] text-slate-650 uppercase tracking-tight block truncate max-w-[150px]" title={item.documentName}>
                                  {item.documentName}
                                </span>
                                <span className="text-[8px] text-slate-400 font-mono tracking-wider block mt-0.5">
                                  {item.code}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-705">
                            <div className="flex items-center gap-1.5 font-sans">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0e2b64] shrink-0" />
                              <div className="truncate">
                                <span className="truncate max-w-[130px] block font-extrabold" title={item.holder}>{item.holder}</span>
                                <span className="text-[8.5px] text-slate-400 font-mono tracking-wider font-semibold block">{item.number}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase select-none shrink-0">
                              ✓ Válido
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              type="button"
                              onClick={() => {
                                const doc = getMockDocDetail(item);
                                setScannedDoc(doc);
                                setIsValidated(true);
                                setIsHistoryOpen(false);
                              }}
                              className="py-1 px-3 bg-white border border-slate-205 hover:border-blue-500 hover:bg-slate-50 rounded-xl text-[9.5px] font-black uppercase text-blue-700 transition-colors cursor-pointer"
                            >
                              <Eye size={12} className="inline-block mr-1 -mt-0.5" /> Ficha
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer px-6 py-2.5"
                >
                  Fechar Histórico
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
