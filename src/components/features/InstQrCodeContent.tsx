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
  Plus
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
  
  // Scanned results
  const [scannedDoc, setScannedDoc] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('cda_inst_scan_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'SCAN-8012',
        documentName: 'BI Digital',
        holder: 'Edlasio Galhardo',
        code: 'AO-BI-9281',
        number: '009874562LA041',
        scannedAt: '05/06/2026 10:14',
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
    if (activeTab === 'camera' && cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, cameraActive]);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in" id="inst-qrcode-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Área Institucional / Validador</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <QrCode size={24} className="text-indigo-600" />
            Scanner de QR Code Oficial
          </h1>
          <p className="text-xs text-slate-450 mt-1 uppercase font-bold tracking-tight">
            Validação instantânea e handshacking com os serviços de migração (SME), AGT e registo civil de Angola.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 self-start md:self-center border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              setScannedDoc(null);
              setIsValidated(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-0 ${
              activeTab === 'camera' 
                ? 'bg-indigo-950 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200 cursor-pointer font-bold'
            }`}
          >
            <Camera size={14} />
            Câmara Live
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setScannedDoc(null);
              setIsValidated(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-0 ${
              activeTab === 'manual' 
                ? 'bg-indigo-950 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200 cursor-pointer font-bold'
            }`}
          >
            <Search size={14} />
            Código Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Camera Feed or Manual Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xs p-5 md:p-6 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100/70">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {activeTab === 'camera' ? (cameraActive ? 'Vídeo Feed Prontidão' : 'Vídeo Inativo') : 'Pesquisa de Código Físico'}
                  </span>
                </div>
                {activeTab === 'camera' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border-0 cursor-pointer"
                      title={soundEnabled ? 'Silenciar Beep' : 'Ativar Som Beep'}
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraActive(!cameraActive)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[8.5px] font-black rounded-lg uppercase tracking-wider transition-all border-0 cursor-pointer"
                    >
                      {cameraActive ? 'Desligar Câm.' : 'Ativar Câm.'}
                    </button>
                  </div>
                )}
              </div>

              {activeTab === 'camera' ? (
                /* Camera UI */
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-[320px] shadow-inner border border-slate-850 flex items-center justify-center select-none">
                  {/* Real video if available, styled simulation backdrop if not */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 transform scale-x-[-1]"
                  />

                  {/* High Quality Scan HUD overlay */}
                  <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start pointer-events-none text-white/55 font-mono text-[7px] tracking-widest z-10">
                    <span>CDA-MATRIX v2.4</span>
                    <span>FPS: 60 // BRIGHT: AUTO</span>
                  </div>

                  {/* Target scanner bounding box */}
                  <div className="relative w-44 h-44 border-2 border-indigo-400/50 rounded-2xl flex items-center justify-center z-10 shadow-[0_0_80px_rgba(79,70,229,0.15)] bg-slate-900/40">
                    {/* Corner Reticles */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-500 rounded-tl-[8px] -translate-x-1.5 -translate-y-1.5" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-500 rounded-tr-[8px] translate-x-1.5 -translate-y-1.5" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-500 rounded-bl-[8px] -translate-x-1.5 translate-y-1.5" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-500 rounded-br-[8px] translate-x-1.5 translate-y-1.5" />
                    
                    {/* Simulated laser scan line */}
                    {cameraActive && !isScanning && (
                      <motion.div 
                        initial={{ top: '10%' }}
                        animate={{ top: '90%' }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-[2.5px] bg-indigo-400 shadow-[0_0_8px_#818cf8] z-20 pointer-events-none"
                      />
                    )}

                    {isScanning ? (
                      <div className="flex flex-col items-center justify-center space-y-3 p-4">
                        <RefreshCw size={24} className="text-indigo-400 animate-spin" />
                        <span className="text-white text-[7.5px] font-black tracking-widest uppercase text-center animate-pulse leading-normal">
                          {scanStep}
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center space-y-2 text-center p-3 pointer-events-none select-none">
                        <Scan size={24} className="text-slate-400 opacity-60 animate-pulse" />
                        <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 leading-normal">Apontar QR Code ou usar atalhos rápidos</span>
                      </div>
                    )}
                  </div>

                  {/* Success flashing overlay */}
                  <AnimatePresence>
                    {isValidated === true && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-emerald-950/80 z-20 flex flex-col items-center justify-center text-white space-y-2"
                      >
                        <CheckCircle2 size={40} className="text-emerald-400 animate-bounce" />
                        <span className="font-black text-xs uppercase tracking-widest">Leitura Homologada</span>
                        <p className="text-[9px] text-emerald-300 font-medium uppercase font-mono">{scannedDoc?.code}</p>
                      </motion.div>
                    )}
                    {isValidated === false && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-rose-950/85 z-20 flex flex-col items-center justify-center text-white space-y-2"
                      >
                        <XCircle size={40} className="text-rose-500 animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-widest">Código Não Identificado</span>
                        <p className="text-[9px] text-rose-300 font-medium font-mono">DOCUMENTO INVÁLIDO OU CODIFICAÇÃO INDISPONÍVEL</p>
                        <button
                          type="button"
                          onClick={() => setIsValidated(null)}
                          className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-[8px] font-black rounded-lg uppercase tracking-wider transition-all border-0 cursor-pointer text-white"
                        >
                          Tentar Novamente
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Grid Lines background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.1)_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none" />
                </div>
              ) : (
                /* Manual Form Input */
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
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 placeholder-slate-400 uppercase tracking-wide focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <p className="text-[9.5px] font-medium text-slate-400 uppercase">Introdução direta de metadados de registo criptográfico nacional.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isScanning || !manualCode.trim()}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer"
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

            {/* Quick Simulation Shortcuts */}
            <div className="mt-6 pt-5 border-t border-slate-100/70">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Atalhos de Simulação de Scan (Banco Governamental)</span>
              
              <div className="grid grid-cols-2 gap-2">
                {documents.slice(0, 4).map((doc) => (
                  <button
                    key={doc.code}
                    type="button"
                    onClick={() => handleSimulateScan(doc)}
                    disabled={isScanning}
                    className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 border border-slate-200 rounded-xl transition-all text-left text-[10px] cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <QrCode size={13} className="text-indigo-600" />
                    </div>
                    <div className="truncate">
                      <p className="font-extrabold text-slate-800 truncate uppercase tracking-tight">{doc.name}</p>
                      <p className="text-[8px] text-slate-400 font-mono tracking-tight leading-none truncate">{doc.code}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scanned Document Information Shield */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            {scannedDoc ? (
              <motion.div 
                key="doc-profile"
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
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
                      <span className="block font-bold text-white">{Math.floor(100000 + Math.random() * 900000)}</span>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ativo &amp; Válido
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
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 cursor-pointer text-center"
                  >
                    Efectuar Nova Leitura (Limpar)
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-2xs p-6 md:p-8 flex flex-col justify-center items-center text-center h-full min-h-[460px] space-y-6"
              >
                <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center text-indigo-650 animate-pulse">
                  <Scan size={30} />
                </div>
                
                <div className="max-w-xs space-y-2">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight">Aguardando Leitura de Código</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed uppercase">
                    Aponte a câmara governamental para o QR Code de autoconsulta impresso ou exibido na carteira móvel do cidadão para iniciar o handshake e decodificar os metadados de autenticação federada.
                  </p>
                </div>

                <div className="w-full bg-slate-50 border border-slate-150 p-4 rounded-2xl text-[9px] font-sans text-left space-y-1.5 uppercase tracking-wide">
                  <span className="font-black text-slate-500 block tracking-wider">Protocolo Técnico CADA</span>
                  <div className="flex items-center gap-2 text-slate-450 font-semibold">
                    <Lock size={12} className="text-slate-405" />
                    <span>Encriptação RSA-4096 / TLS 1.3 Seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-450 font-semibold">
                    <Database size={12} className="text-slate-405" />
                    <span>Conexão em Tempo Real com MINJUSDH</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History Log of Scans */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xs p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100/70">
          <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <History size={16} className="text-slate-505" />
            Histórico das Leituras Recentes (Sessão Atual)
          </h2>
          <span className="text-[8.5px] font-mono bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold text-indigo-600">
            {scanHistory.length} Leituras Activas
          </span>
        </div>

        {scanHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px] uppercase">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 tracking-wider">
                  <th className="pb-3 pl-2">ID_LEITURA</th>
                  <th className="pb-3">DOCUMENTO</th>
                  <th className="pb-3">CIDADÃO BENEFICIÁRIO</th>
                  <th className="pb-3">CHAVE CADA</th>
                  <th className="pb-3 font-mono">REGISTO / NÚMERO</th>
                  <th className="pb-3">TIMESTAMP</th>
                  <th className="pb-3 text-right pr-2">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/70 font-semibold text-slate-700">
                {scanHistory.map((history) => (
                  <tr key={history.id} className="hover:bg-slate-55/40 transition-colors">
                    <td className="py-2.5 pl-2 font-mono text-[9px] font-bold text-indigo-600">{history.id}</td>
                    <td className="py-2.5 font-extrabold text-slate-800">{history.documentName}</td>
                    <td className="py-2.5 text-slate-900 inline-flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold">
                        {history.holder.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="font-extrabold">{history.holder}</span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-500 font-bold">{history.code}</td>
                    <td className="py-2.5 font-mono text-slate-500">{history.number}</td>
                    <td className="py-2.5 text-slate-450">{history.scannedAt}</td>
                    <td className="py-2.5 text-right pr-2">
                      <span className="bg-emerald-50 text-emerald-650 border border-emerald-100 text-[7.5px] font-black px-2 py-0.5 rounded-md uppercase">
                        {history.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 uppercase font-black text-[10px]">
            Nenhuma consulta realizada na sessão activa.
          </div>
        )}
      </div>

    </div>
  );
}
