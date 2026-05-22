import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = createServer(app);
  
  app.use(express.json());

  // Initialize AI Studio Gemini Client
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  
  // Initialize Groq Client
  const groqApiKey = process.env.GROQ_API_KEY || process.env.Teste01 || '';
  const groq = new Groq({ apiKey: groqApiKey });

  if (!apiKey) {
    console.warn("CRITICAL: No Gemini API Key found!");
  }
  
  if (!groqApiKey) {
    console.warn("CRITICAL: No Groq API Key found (Checked GROQ_API_KEY and Teste01)!");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    apiVersion: 'v1beta'
  });

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      ai_key_configured: !!process.env.GEMINI_API_KEY,
      groq_key_configured: !!groqApiKey
    });
  });

  // Groq Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, isGovMode } = req.body;
      
      if (!groqApiKey) {
        return res.status(500).json({ error: "Groq API Key not configured." });
      }

      const CDA_PROJECT_INFO = `
O Correio Digital de Angola representa a espinha dorsal da modernização administrativa em Angola. 
O principal problema que resolvemos é a dificuldade de comunicação oficial num país com muitos endereços não mapeados, o que causa atrasos e forças as pessoas a deslocarem-se constantemente às instituições. 
A solução que oferecemos é transformar o Bilhete de Identidade no endereço digital oficial de cada cidadão, criando um canal direto e seguro no telemóvel. 
Os benefícios são claros: rapidez na receção de documentos, redução de custos logísticos para o Estado e uma inclusão digital real para todos, incluindo idosos ou cidadãos com baixa escolaridade através de auxílio por voz. 
A plataforma baseia-se em cinco pilares fundamentais. O painel principal atua como um centro de comando pessoal para alertas críticos. A área de correspondência funciona como um diálogo direto com as instituições, com conversas organizadas por órgãos como o Serviço de Migração e Estrangeiros ou a Administração Geral Tributária. O Assistente de Inteligência Artificial simplifica a linguagem jurídica e atua como conselheiro de voz. A Carteira Digital permite o armazenamento seguro e offline de documentos com validação por código QR. Por fim, a Segurança é garantida por autenticação biométrica e transparência total. 
O nosso objetivo final é a transição para um Estado proativo que serve o povo na palma da mão.
`;

      const systemPrompt = isGovMode 
        ? `Você é o Consultor de Segurança e Legislação do SOC do Governo de Angola. Sua função é auxiliar administradores na gestão de protocolos de emergência, interoperabilidade e redação de normas. ${CDA_PROJECT_INFO} Inicie sempre saudando e perguntando como pode ser útil. Responda de forma eficiente, clara e profissional. Não utilize asteriscos ou símbolos de formatação na sua fala. Utilize sempre o nome completo Correio Digital de Angola. Se a explicação for muito longa, apresente primeiro o essencial e interrompa para perguntar se o usuário deseja que você continue detalhando ou prefere focar em algo específico.`
        : `Você é o assistente oficial do Correio Digital de Angola. ${CDA_PROJECT_INFO} Inicie sempre saudando e perguntando como pode ser útil. Ajude o usuário com informações sobre seus documentos e correspondências de forma eficiente. Seja cordial, humano e acolhedor. Utilize sempre o nome completo Correio Digital de Angola. Não utilize asteriscos ou símbolos de formatação para garantir uma fala limpa e natural. Caso sua resposta seja longa, apresente primeiro os pontos essenciais e interrompa para perguntar se o usuário gostaria que continuasse detalhando ou se prefere focar em algo específico. Responda em Português de Angola.`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ],
        model: "llama-3.1-8b-instant",
      });

      res.json({ message: completion.choices[0].message.content });
    } catch (error) {
      console.error("Groq Chat Error:", error);
      res.status(500).json({ error: "Erro ao processar conversa com IA." });
    }
  });

  // WebSocket for Gemini Live
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    if (url.pathname === '/api/live') {
      const isGov = url.searchParams.get('gov') === 'true';
      wss.handleUpgrade(request, socket, head, (ws) => {
        (ws as any).isGov = isGov;
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", async (clientWs: WebSocket) => {
    const isGov = (clientWs as any).isGov;
    console.log(`Client connected to Gemini Live WebSocket (Gov Mode: ${isGov})`);

    clientWs.on("error", (err) => {
      console.error("Client WebSocket error:", err);
    });

    // Keep-alive to prevent connection timeouts
    const pingInterval = setInterval(() => {
      if (clientWs.readyState === 1) { // 1 = OPEN
        clientWs.ping();
      }
    }, 20000);

    try {
      console.log("Connecting to Gemini Live with model: gemini-2.0-flash-exp");
      
      const CDA_PROJECT_INFO = `
O Correio Digital de Angola moderniza a administração ao tornar o Bilhete de Identidade o endereço oficial dos cidadãos. 
Resolvemos o problema da entrega física de correspondência e a necessidade de deslocações constantes às instituições. 
A nossa solução utiliza a identidade digital para garantir que as notificações e documentos cheguem diretamente ao telemóvel com segurança total. 
Os benefícios incluem maior agilidade, economia para o cidadão e para o Estado, e uma interface acessível para todos os níveis de literacia digital. 
A estrutura conta com o Painel Principal, Correspondência oficial com as instituições, Assistente de Inteligência Artificial para simplificar a linguagem, Carteira Digital Offline e Segurança Biométrica. 
A nossa inteligência artificial ajuda a traduzir termos jurídicos complexos e atua de forma proativa com os prazos e avisos oficiais.
`;

      const normalSysInstr = `Você é o assistente virtual do Correio Digital de Angola. ${CDA_PROJECT_INFO} Inicie sempre saudando e perguntando como pode ser útil. Responda de forma eficiente. Seja cordial, humano e acolhedor. Não utilize asteriscos ou símbolos de formatação para garantir uma fala natural. Utilize sempre o nome completo Correio Digital de Angola. Se a explicação for longa, apresente o essencial e pergunte se pode continuar.`;
      const govSysInstr = `Você é o Consultor de Segurança e Redação Oficial do Governo de Angola. ${CDA_PROJECT_INFO} Sua função é auxiliar administradores na gestão de protocolos e redação de normas. Inicie saudando e perguntando como pode ser útil. Seja eficiente, formal, institucional e conhecedor das normas de protocolo. Não utilize asteriscos ou símbolos na sua fala. Utilize sempre o nome completo Correio Digital de Angola.`;

      const session = await ai.live.connect({
        model: "gemini-2.0-flash-exp",
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent) {
              const { modelTurn, interrupted } = message.serverContent;
              
              if (interrupted) {
                console.log("AI session interrupted by user activity");
                clientWs.send(JSON.stringify({ type: 'interrupted' }));
              }

              if (modelTurn?.parts) {
                for (const part of modelTurn.parts) {
                  if (part.inlineData?.data) {
                    clientWs.send(JSON.stringify({ type: 'audio', data: part.inlineData.data }));
                  }
                  if (part.text) {
                    clientWs.send(JSON.stringify({ type: 'model_transcript', data: part.text }));
                  }
                }
              }
            }
          },
          onerror: (error) => {
            console.error("CRITICAL: Gemini Live Session Error:", error);
            if (clientWs.readyState === 1) {
              // Extract message if it's an error object
              const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
              clientWs.send(JSON.stringify({ type: 'error', message: `Erro no serviço de IA: ${errorMsg}` }));
            }
          },
          onclose: (e) => {
            console.log(`Gemini Live Session closed. Code: ${e.code}, Reason: ${e.reason}`);
            clearInterval(pingInterval);
            if (clientWs.readyState === 1) {
              const reasonMsg = e.reason || 'Conexão com servidor de IA encerrada.';
              clientWs.send(JSON.stringify({ type: 'error', message: reasonMsg }));
              clientWs.close();
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: isGov ? govSysInstr : normalSysInstr,
        },
      });

      console.log("Gemini Live session established successfully");

      // Wake up the model with a greeting
      setTimeout(() => {
        try {
          if (clientWs.readyState === 1) {
            console.log("Sending initial greeting to Gemini...");
            const greeting = isGov 
              ? "Saudações. Em que posso ser útil na gestão do SOC hoje?"
              : "Olá! Sou o assistente do Correio Digital de Angola. Como posso ser útil com seus documentos ou correspondências hoje?";
            session.sendRealtimeInput({ 
              text: greeting 
            });
          }
        } catch (err) {
          console.error("Error sending initial wake-up message:", err);
        }
      }, 1500);

      clientWs.on("message", (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'ping') return;
          
          if (msg.type === 'audio' && msg.data) {
            session.sendRealtimeInput({
              audio: { data: msg.data, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (e) {
          console.error("Error processing client message:", e);
        }
      });

      clientWs.on("close", () => {
        console.log("Client disconnected, closing Gemini session");
        clearInterval(pingInterval);
        try {
          session.close();
        } catch (err) {
          console.error("Error closing Gemini session:", err);
        }
      });

    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
      const isAuthError = String(error).includes("unregistered callers") || !apiKey;
      const helpMsg = isAuthError 
        ? "Configuração de API pendente. Por favor, adicione a GEMINI_API_KEY no painel de Segredos (Settings -> Secrets)."
        : "Erro ao conectar com o serviço de IA.";
      
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'error', message: helpMsg }));
        clientWs.close();
      } else if (clientWs.readyState === WebSocket.CONNECTING) {
        clientWs.on('open', () => {
          clientWs.send(JSON.stringify({ type: 'error', message: helpMsg }));
          clientWs.close();
        });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
