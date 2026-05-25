/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Loader2, Mic, Shield, ArrowRight } from 'lucide-react';
import { AppMode } from '../../types';
import { USER_PROFILE_PHOTO } from '../../constants/data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  iaLiveActive: boolean;
  stopIaVoice?: () => void;
  appMode: AppMode;
  onCreateRequest?: (type: string, priority: 'Alta' | 'Média' | 'Baixa') => void;
}

export function AIChatAssistant({ 
  isOpen, 
  onClose,
  iaLiveActive,
  stopIaVoice,
  appMode,
  onCreateRequest
}: AIChatAssistantProps) {
  const isGov = appMode !== 'user';
  const isAdmin = appMode === 'admin';
  const isInst = appMode === 'institution';

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: isAdmin
        ? 'Saudações. Como posso ser útil na gestão do SOC hoje?'
        : isInst
        ? 'Olá. Em que posso ser útil com suas operações institucionais hoje?' 
        : 'Olá! Sou o seu Assistente Digital de Angola. Posso ajudar você a ler a sua correspondência eletrónica governamental ou a gerir os seus contactos de emergência. Como posso ajudar?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isTranscribingRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iaLiveActiveRef = useRef(iaLiveActive);

  // Sync state with mutable reference to prevent stale closures during asynchronous callbacks
  useEffect(() => {
    iaLiveActiveRef.current = iaLiveActive;
    if (!iaLiveActive) {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        // Detach handlers to prevent async triggers during aborting
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    }
  }, [iaLiveActive]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (!iaLiveActiveRef.current) return;
    window.speechSynthesis.cancel();
    
    // Stop listening while speaking to avoid echo
    if (recognitionRef.current && isTranscribingRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-AO';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      // Resume listening after speaking if still active
      if (iaLiveActiveRef.current && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize and Control Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let recognition: any;
    try {
      recognition = new SpeechRecognition();
    } catch (err) {
      console.warn('SpeechRecognition initialization failed:', err);
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-AO';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInput(finalTranscript);
        
        // Debounce: Wait for a short pause of silence before sending
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          handleSendMessage(finalTranscript);
        }, 1200); // 1.2s of silence before sending
      }
    };

    recognition.onstart = () => {
      isTranscribingRef.current = true;
    };

    recognition.onend = () => {
      isTranscribingRef.current = false;
      // Auto-restart only if active and NOT currently speaking
      // Small timeout to avoid rapid restart loops
      setTimeout(() => {
        if (iaLiveActiveRef.current && !window.speechSynthesis.speaking && !isTranscribingRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      }, 300);
    };

    recognition.onerror = (event: any) => {
      // no-speech is a timeout when no one talks, we can ignore it as onend will restart it
      if (event.error === 'no-speech') {
        return;
      }

      console.error('Speech recognition error:', event.error);
      if (event.error === 'network') {
        setTimeout(() => { if (iaLiveActiveRef.current) try { recognition.start(); } catch(e) {} }, 1000);
      }
      if (event.error === 'not-allowed') {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Permissão de microfone negada. Por favor, ative o microfone nas configurações do seu navegador para usar a voz.' }]);
        if (stopIaVoice) {
          try {
            stopIaVoice();
          } catch (e) {}
        }
      }
      isTranscribingRef.current = false;
    };

    recognitionRef.current = recognition;

    if (iaLiveActive) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }

    return () => {
      isTranscribingRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      // Detach handlers immediately to prevent any async callbacks during aborting or destruction
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;

      try {
        recognition.abort();
      } catch (e) {}
      window.speechSynthesis.cancel();
    };
  }, [iaLiveActive]);

  const handleSendMessage = async (textOverride?: string) => {
    const currentInput = textOverride || input;
    if (!currentInput.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          isGovMode: isGov
        }),
      });

      const data = await response.json();
      if (response.ok && data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        if (iaLiveActive) {
          speak(data.message);
        }
      } else {
        const errorMsg = data.error || 'Falha na resposta da IA';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const userFriendlyError = error.message.includes('not configured') 
        ? 'A chave da API Groq não foi configurada. Por favor, adicione GROQ_API_KEY no painel de Segredos (Settings -> Secrets).'
        : 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: userFriendlyError }]);
      if (iaLiveActive) speak(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border flex flex-col z-[100] overflow-hidden ${
            isAdmin ? 'border-slate-800 shadow-slate-900/50' : isInst ? 'border-red-100 shadow-red-900/5' : 'border-line'
          }`}
        >
          {/* Header */}
          <div className={`p-4 flex items-center justify-between text-white shrink-0 transition-colors ${
            isAdmin ? 'bg-slate-950' : isInst ? 'bg-red-600' : 'bg-primary'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                {isGov ? <Shield size={22} className="text-white" /> : <Bot size={24} />}
                {iaLiveActive && (
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
                      isAdmin ? 'bg-white border-slate-900' : isInst ? 'bg-white border-red-600' : 'bg-green-400 border-primary'
                    }`}
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm">{isAdmin ? 'Admin SOC Secure' : isInst ? 'Operações Institucionais' : 'Assistente Digital'}</h3>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-black">
                  {isAdmin ? 'Nível Crítico' : isInst ? 'Nível Gestão' : 'Online agora'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50"
          >
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-sm ${
                    msg.role === 'user' 
                      ? 'border-white ring-1 ring-primary/10' 
                      : 'bg-white border-line text-primary shadow-sm'
                  }`}>
                    {msg.role === 'user' 
                      ? <img src={USER_PROFILE_PHOTO} alt="Me" className="w-full h-full object-cover" /> 
                      : (isGov ? <Shield size={14} className={isAdmin ? 'text-slate-900' : 'text-red-600'} /> : <Bot size={14} />)
                    }
                  </div>
                  <div className={`p-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? (isAdmin ? 'bg-slate-900 text-white rounded-tr-none' : isInst ? 'bg-red-600 text-white rounded-tr-none' : 'bg-primary text-white rounded-tr-none') 
                    : 'bg-white text-slate-700 rounded-tl-none border border-line/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-line text-primary flex items-center justify-center shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-line/50 shadow-sm animate-pulse">
                    <Loader2 size={16} className={`animate-spin ${isAdmin ? 'text-slate-900' : isInst ? 'text-red-600' : 'text-primary'}`} />
                  </div>
                </div>
              </div>
            )}

            {!isGov && messages.length === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-2 pt-4"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Sugestões de Acções</p>
                {[
                  { label: 'Solicitar NIF (AGT)', type: 'NIF', priority: 'Média' },
                  { label: 'Solicitar IPU (AGT)', type: 'IPU', priority: 'Alta' },
                  { label: 'Certidão de Endereço', type: 'Certidão', priority: 'Baixa' },
                ].map(action => (
                  <button 
                    key={action.type}
                    onClick={() => {
                      onCreateRequest?.(action.type, action.priority as any);
                      setMessages(prev => [...prev, 
                        { role: 'user', content: `Desejo solicitar ${action.type}` },
                        { role: 'assistant', content: `Entendido! Já enviei o seu pedido de ${action.type} para a fila de processamento da AGT. Você será notificado assim que o documento for emitido.` }
                      ]);
                    }}
                    className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-all text-left shadow-sm flex items-center justify-between group"
                  >
                    {action.label}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            )}
            
            {iaLiveActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className={`${isAdmin ? 'bg-slate-900/10 border-slate-900/20' : isInst ? 'bg-red-600/10 border-red-600/20' : 'bg-primary/10 border-primary/20'} px-4 py-2 rounded-full flex items-center gap-2 border shadow-sm`}>
                  <div className="flex gap-1 items-end h-3">
                    <motion.div 
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                      className={`w-1 rounded-full ${isAdmin ? 'bg-slate-900' : isInst ? 'bg-red-600' : 'bg-primary'}`}
                    />
                    <motion.div 
                      animate={{ height: ["40%", "80%", "40%"] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                      className={`w-1 rounded-full ${isAdmin ? 'bg-slate-900' : isInst ? 'bg-red-600' : 'bg-primary'}`}
                    />
                    <motion.div 
                      animate={{ height: ["30%", "100%", "30%"] }}
                      transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                      className={`w-1 rounded-full ${isAdmin ? 'bg-slate-900' : isInst ? 'bg-red-600' : 'bg-primary'}`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isAdmin ? 'text-slate-900' : isInst ? 'text-red-600' : 'text-primary'}`}>
                    {isGov ? 'A Captar...' : 'A ouvir...'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-line shrink-0">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escreva sua mensagem..."
                className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 outline-none transition-colors text-sm font-medium ${
                  isAdmin ? 'border-slate-800 focus:border-slate-950' : isInst ? 'border-red-100 focus:border-red-600' : 'border-line focus:border-primary'
                }`}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:grayscale ${
                  isAdmin ? 'bg-slate-900 hover:bg-slate-950' : isInst ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/95'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
