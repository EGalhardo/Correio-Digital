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
  X
} from 'lucide-react';
import { Document, DigitalProtocol } from '../../types';

interface InstQrCodeContentProps {
  documents: Document[];
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

export function InstQrCodeContent({ documents, addAuditLog }: InstQrCodeContentProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Scanned results
  const [scannedDoc, setScannedDoc] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('cda_inst_scan_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'SCAN-8012',
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
    const docFromProps = documents.find(d => d.code === item.code);
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
    
    // Simulate real high tech scanning sequence and beep
    setTimeout(() => {
      setScanStep('LENDO MATRIZ DE QR CODE...');
      setTimeout(() => {
        setScanStep('VALIDANDO JUNTO AO CENTRAL DE INTEROPERABILIDADE...');
        setTimeout(() => {
          const chosenDoc: Document = {
            name: "BI Digital",
            holder: "Edlasio Galhardo",
            code: "AO-BI-9281",
            number: "009874562LA041",
            issuer: "SME",
            issuedAt: "10 de Abril de 2022",
            validity: "Valido ate 2032"
          };
          playBeep();
          setScannedDoc(chosenDoc);
          setIsValidated(true);
          setIsScanning(false);
          setScanStep('');
          setIsModalOpen(false); // Close scanning modal automatically
          addHistoryItem(chosenDoc, 'VÁLIDO');
          addAuditLog?.(`Auditoria: Escaneamento executado com sucesso para Edlasio Galhardo.`, 'success');
        }, 1200);
      }, 1000);
    }, 800);
  };

  const renderScannerCard = () => (
    <div className="bg-white rounded-[32px] border border-slate-105 shadow-3xs p-6 md:p-8" id="scanner-card-container">
      <div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100/70">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeTab === 'camera' ? 'bg-slate-350' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {activeTab === 'camera' ? 'Leitor Inativo' : 'Pesquisa de Código Oficial / Chave CADA'}
            </span>
          </div>
        </div>

        {activeTab === 'camera' ? (
          /* INACTIVE SCANNER PORTRAYAL: Centered beautiful layout */
          <div className="flex flex-col items-center justify-center py-8 text-center">
            
            {/* QR Code Illustration with Corner Brackets */}
            <div className="relative w-32 h-32 bg-blue-50/50 hover:bg-blue-50 rounded-all flex items-center justify-center border border-blue-105/30 mb-6 transition-all duration-300">
              {/* Glowing blue laser reticles */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-blue-600 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-blue-600 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-blue-600 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-blue-600 rounded-br-lg" />
              
              <QrCode size={56} className="text-blue-600 animate-pulse" />
            </div>

            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">Validação de Documento</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-tight max-w-sm mb-6 leading-relaxed">
              Verifique passaportes, certidões, NIF e outros documentos oficiais emitidos pelos órgãos governamentais.
            </p>

            <button
              onClick={openScanner}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 active:scale-98 text-white flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold font-sans text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer border-0"
              id="start-read-btn"
            >
              <Camera size={14} />
              Iniciar Leitura
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
    <div className="space-y-4" id="recent-scans-block">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider">Leituras Recentes</h3>
        <span className="text-[9px] font-bold text-blue-600 uppercase cursor-pointer hover:underline tracking-wider">Ver todas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scanHistory.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              const doc = getMockDocDetail(item);
              setScannedDoc(doc);
              setIsValidated(true);
            }}
            className="bg-white border border-slate-100 hover:border-blue-200 rounded-[20px] p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 truncate">
              {/* Document Badge container with type-safe styling */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.documentName.toLowerCase().includes('passaporte') 
                  ? 'bg-blue-50 text-blue-600' 
                  : item.documentName.toLowerCase().includes('certid') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : item.documentName.toLowerCase().includes('nif') 
                      ? 'bg-amber-50 text-amber-600' 
                      : 'bg-indigo-50 text-indigo-600'
              }`}>
                <FileText size={16} />
              </div>
              <div className="truncate text-left">
                <p className="font-extrabold text-slate-900 text-[11px] group-hover:text-blue-600 transition-colors uppercase truncate tracking-tight">{item.documentName}</p>
                <p className="text-[10px] text-slate-500 font-bold truncate leading-tight mt-0.5">{item.holder}</p>
                <p className="text-[8px] text-slate-400 font-mono tracking-wider mt-0.5">{item.scannedAt}</p>
              </div>
            </div>
            
            <span className="flex items-center gap-1 text-[8.5px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
              ✓ Válido
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in" id="inst-qrcode-view">
      {/* Header matching the government style and user request */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">ÁREA INSTITUCIONAL / VALIDADOR</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            SCANNER DE QR CODE OFICIAL
          </h1>
          <p className="text-xs text-slate-450 mt-1 uppercase font-bold tracking-tight">
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
          {/* Left Column: Reusable Scanner and Recent reads */}
          <div className="lg:col-span-7 space-y-6">
            {renderScannerCard()}
            {renderRecentScans()}
          </div>

          {/* Right Column: Scanned Document Information Shield */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key="doc-profile"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900 text-white rounded-[32px] overflow-hidden shadow-xl border border-slate-800 p-6 flex flex-col justify-between h-full min-h-[460px]"
              >
                {/* Header Verification Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md w-fit">
                          Assinatura Válida
                        </div>
                        <h2 className="text-[14px] font-black uppercase mt-1 tracking-tight leading-tight">Documento Verificado</h2>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[7.5px] text-slate-400 leading-tight uppercase">
                      <span>Validação #</span>
                      <span className="block font-bold text-white">{scannedDoc.code.split('-')[2] || 'CDA802'}</span>
                    </div>
                  </div>

                  {/* Official Credentials High-End Card Representing Document */}
                  <div className="bg-gradient-to-br from-slate-800 to-indigo-950/80 border border-indigo-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                    {/* Background seal */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                      <Building2 size={130} />
                    </div>

                    <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-3">
                      <div className="flex gap-2 items-center">
                        <div className="w-4 h-3 bg-red-600 flex flex-col relative rounded-xs overflow-hidden border border-white/20 flex-shrink-0">
                          <div className="h-1/2 bg-red-600" />
                          <div className="h-1/2 bg-black" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[3px] text-yellow-500">&bull;</div>
                        </div>
                        <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">MINISTÉRIO DA JUSTIÇA</span>
                      </div>
                      <span className="text-[7px] font-mono bg-white/15 px-1.5 py-0.5 rounded uppercase font-bold text-white">{scannedDoc.name}</span>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div>
                        <span className="text-[6.5px] text-indigo-200/60 uppercase block font-bold leading-none">Titular do Documento:</span>
                        <span className="font-extrabold text-white uppercase block text-xs tracking-tight">{scannedDoc.holder}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[6.5px] text-indigo-200/60 uppercase block font-bold leading-none">Número de Registo:</span>
                          <span className="font-bold text-indigo-100 font-mono text-[9.5px] block">{scannedDoc.number}</span>
                        </div>
                        <div>
                          <span className="text-[6.5px] text-indigo-200/60 uppercase block font-bold leading-none">Chave Unificada:</span>
                          <span className="font-bold text-indigo-300 font-mono text-[9.5px] block">{scannedDoc.code}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2 text-[7.5px]">
                        <div>
                          <span className="text-[6.5px] text-indigo-200/60 uppercase block font-bold leading-none">Autoridade Emissora:</span>
                          <span className="font-semibold text-white uppercase">{scannedDoc.issuer}</span>
                        </div>
                        <div>
                          <span className="text-[6.5px] text-indigo-200/60 uppercase block font-bold leading-none">Estado Legal:</span>
                          <span className="font-extrabold text-emerald-400 uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Ativo &amp; Válido
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Encryption & handshake metadata details */}
                  <div className="space-y-2 text-[10px]">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 space-y-1.5 font-mono">
                      <div className="flex justify-between text-[8px] pb-1 border-b border-white/10 text-slate-400">
                        <span>METADADOS DE INTEROPERABILIDADE</span>
                        <span>SHA-256 SECURE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assinatura Digital:</span>
                        <span className="text-indigo-400 font-bold">SHA256_VERIFIED</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Canal Seguro:</span>
                        <span className="text-emerald-400">CADA-TSL-1.3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timestamp da auditoria:</span>
                        <span className="text-indigo-250">
                          {new Date().toLocaleDateString('pt-PT')} {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="pt-1.5 text-[7px] text-slate-400 leading-normal border-t border-white/5 break-all max-h-12 overflow-y-auto">
                        HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print/Download and New action button */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`A IMPRIMIR: Comprovativo oficial de validação em Papel de Segurança CDA. Código ${scannedDoc.code}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer"
                    >
                      <Printer size={13} />
                      Imprimir Ficha
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`A DESCARREGAR: Certidão em formato PDF assinado ICP-Angola.`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer"
                    >
                      <Download size={13} />
                      Baixar PDF
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setScannedDoc(null);
                      setIsValidated(null);
                    }}
                    className="w-full py-3 bg-emerald-555 hover:bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer text-center"
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
        <div className="max-w-2xl mx-auto space-y-6">
          {renderScannerCard()}
          {renderRecentScans()}
        </div>
      )}

      {/* ACTIVE SCANNER MODAL OVERLAY: EXACT replication of the right mockup image */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0f19] text-white rounded-[28px] p-6 max-w-md w-full shadow-2xl relative border border-slate-800 flex flex-col items-center"
            >
              {/* Close X Button top-right */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-1"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200 mb-6 mt-2">Ler QR Code Oficial</h3>

              {/* Viewfinder scanner area */}
              <div className="relative w-72 h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center select-none shadow-inner mb-6">
                
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
                <div className="absolute inset-4 border border-dashed border-slate-800/60 rounded-lg opacity-40" />

                {/* Real-time status tracker */}
                <div className="flex flex-col items-center justify-center text-center p-4 z-10 space-y-3 bg-slate-900/60 backdrop-blur-xs rounded-xl border border-slate-800/50 max-w-[200px]">
                  <RefreshCw size={22} className="text-cyan-400 animate-spin" />
                  <span className="text-cyan-300 text-[8.5px] font-black tracking-widest uppercase leading-normal animate-pulse">
                    {scanStep}
                  </span>
                </div>

                {/* Ambient backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.85)_100%)] pointer-events-none" />
              </div>

              {/* Informative Status Badge bar exactly matching mockup */}
              <div className="flex items-center gap-3 w-full bg-slate-900 border border-slate-800/80 p-3.5 rounded-2xl mb-6">
                <div className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-350 shrink-0">
                  <Camera size={15} />
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium font-sans text-left leading-snug">
                  Posicione o código dentro da área de leitura para iniciar.
                </p>
              </div>

              {/* Bottom Fechar button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="border border-slate-850 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-8 py-2.5 rounded-full transition-all font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
