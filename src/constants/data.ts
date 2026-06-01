/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Message, Document, Contact, Slide, AppNotification } from '../types';

export const INBOX: Message[] = [
  {
    id: 1,
    org: "AGT",
    preview: "Imposto pendente no valor de 18.500 Kz com prazo definido.",
    date: "09:10",
    unread: 1,
    status: "Urgente",
    details: {
      subject: "Pagamento Pendente",
      body: "Foi identificado um imposto pendente no seu registro fiscal referente ao exercício anterior no valor de 18.500 Kz.\nEste valor inclui taxas de serviço governamentais e eventuais multas aplicadas pelo atraso na regularização voluntária.\nPedimos que efetue o pagamento o mais breve possível para evitar a aplicação de juros de mora adicionais sobre o montante.\nO pagamento pode ser realizado através de qualquer canal bancário utilizando a referência que será gerada no sistema.\nApós a liquidação, o seu certificado de conformidade fiscal será atualizado de forma automática no portal oficial.",
      deadline: "25 de Maio de 2026",
      state: "Pagamento pendente",
      actions: ["Ver detalhes", "Gerar referencia", "Efetuar pagamento"],
    },
  },
  {
    id: 2,
    org: "SME",
    preview: "Seu Bilhete de Identidade está pronto para levantamento presencial.",
    date: "Ontem",
    unread: 2,
    status: "Urgente",
    details: {
      subject: "Levantamento de BI",
      body: "O seu novo Bilhete de Identidade foi emitido com sucesso e já se encontra pronto para o levantamento presencial.\nO documento poderá ser recolhido no posto de atendimento onde efectuou o pedido original durante o horário de expediente.\nÉ obrigatório apresentar o talão de requerimento original e, se possível, o documento de identificação anterior para triagem.\nO nosso serviço de atendimento ao público funciona ininterruptamente das 08h00 às 15h00 nos dias úteis da semana.\nRecomendamos o agendamento prévio através deste portal para evitar tempos de espera prolongados nas filas de atendimento.",
      deadline: "30 de Maio de 2026",
      state: "Aguardando levantamento",
      actions: ["Ver local", "Agendar horario", "Baixar comprovativo"],
    },
  },
  {
    id: 7,
    org: "AGT",
    preview: "Notificacao de auditoria fiscal para o proximo trimestre.",
    date: "10:30",
    unread: 1,
    status: "Informativo",
    details: {
      subject: "Auditoria Fiscal",
      body: "Informamos que foi programada uma auditoria fiscal de rotina às suas contas referente ao último ciclo trimestral.\nEste procedimento faz parte do plano anual de conformidade tributária para garantir a integridade dos dados declarados.\nSolicitamos que tenha disponível toda a documentação de suporte a receitas e despesas para consulta durante a inspeção.\nA nossa equipa técnica entrará em contacto via telefone para confirmar a modalidade da auditoria (presencial ou digital).\nCaso tenha alguma dúvida sobre os procedimentos, poderá consultar o manual de boas práticas fiscais disponível em anexo.",
      deadline: "15 de Agosto de 2026",
      state: "Agendado",
      actions: ["Ver documentos", "Falar com suporte", "Confirmar"],
    },
  },
  {
    id: 8,
    org: "ENDE",
    preview: "Alerta de interrupção programada para manutenção na sua área.",
    date: "12:15",
    unread: 3,
    status: "Urgente",
    details: {
      subject: "Manutencao Programada",
      body: "A ENDE informa que haverá uma interrupção temporária no fornecimento de energia elétrica na sua zona de residência.\nEsta paragem é estritamente necessária para a realização de trabalhos de manutenção preventiva e melhoria da rede geral.\nOs trabalhos estão previstos para começar nas primeiras horas da manhã e a normalização ocorrerá ao final da tarde.\nAconselhamos a remoção de aparelhos eletrónicos sensíveis das tomadas para evitar picos de corrente no restabelecimento.\nAgradecemos a sua compreensão pelos transtornos causados, visando sempre uma maior qualidade no serviço prestado a todos.",
      deadline: "Amanha",
      state: "Alerta",
      actions: ["Ver horario", "Dicas de seguranca"],
    },
  },
  {
    id: 9,
    org: "EPAL",
    preview: "Confirmacao de alteracao no tarifario de consumo domestico.",
    date: "14:00",
    unread: 1,
    status: "Informativo",
    details: {
      subject: "Tarifario Atualizado",
      body: "Comunicamos que o tarifário de fornecimento de água será atualizado em conformidade com o novo decreto governamental.\nOs novos valores reflectem os custos operacionais de captação, tratamento e distribuição em larga escala para a região.\nConsulte a tabela detalhada disponível no link de ações para perceber como esta alteração afectará a sua faturação mensal.\nContinuamos empenhados em garantir o acesso a água potável de qualidade em toda a rede pública de abastecimento.\nA alteração entrará em vigor a partir do próximo ciclo de fatura, não sendo aplicado retroativamente aos consumos anteriores.",
      deadline: "Sem prazo",
      state: "Atualizado",
      actions: ["Conhecer novo tarifario", "Simular conta"],
    },
  },
  {
    id: 10,
    org: "Hospital",
    preview: "Agendamento de consulta de rotina confirmado com Dr. Andre.",
    date: "16:45",
    unread: 1,
    status: "Informativo",
    details: {
      subject: "Consulta Confirmada",
      body: "A sua consulta de rotina com o Dr. André foi confirmada com sucesso para a data e hora previamente selecionadas.\nPedimos que chegue às nossas instalações com pelo menos 15 minutos de antecedência para os procedimentos de triagem inicial.\nÉ necessário trazer o seu cartão de utente atualizado e quaisquer exames realizados recentemente que sejam relevantes.\nCaso necessite de alterar ou cancelar esta marcação, por favor faça-o com uma antecedência mínima de 24 horas úteis.\nO consultório localiza-se na ala norte do edifício principal, seguindo as sinaléticas indicativas para a especialidade marcada.",
      deadline: "20 de Maio de 2026",
      state: "Confirmado",
      actions: ["Ver local", "Reagendar", "Cancelar"],
    },
  },
  {
    id: 11,
    org: "SME",
    preview: "Alerta: Verificacao de dados cadastrais necessaria.",
    date: "18:20",
    unread: 1,
    status: "Urgente",
    details: {
      subject: "Verificacao de Dados",
      body: "Informamos que é necessária uma verificação e atualização dos seus dados cadastrais digitais junto do SME.\nPendências na validação biométrica foram detectadas no sistema e requerem a sua atenção imediata via portal.\nEsta medida visa aumentar a segurança da sua identidade digital e prevenir possíveis fraudes em seu nome.\nO processo é totalmente digital e pode ser concluído através do carregamento de uma fotografia atualizada.\nO não cumprimento deste pedido dentro do prazo estipulado poderá resultar na suspensão temporária de alguns serviços.",
      deadline: "30 de Junho de 2026",
      state: "Pendente",
      actions: ["Iniciar atualizacao", "Ver requisitos"],
    },
  },
  {
    id: 12,
    org: "Governo",
    preview: "Boletim Informativo: Novos direitos do cidadao digital.",
    date: "20:00",
    unread: 5,
    status: "Informativo",
    details: {
      subject: "Direitos Digitais",
      body: "Aceda agora ao novo guia abrangente sobre os Direitos e Deveres do Cidadão no ambiente digital nacional.\nEste boletim detalha as novas leis de proteção de dados pessoais e como você pode exercer o seu direito à privacidade.\nIncluímos também uma secção sobre segurança cibernética para ajudar a identificar e reportar incidentes de phishing.\nO Governo mantém o compromisso de tornar a internet um espaço seguro e inclusivo para todos os angolanos.\nPartilhe este informativo com a sua rede de contactos para promover a literacia digital em toda a comunidade.",
      deadline: "Sem prazo",
      state: "Novo",
      actions: ["Ler boletim", "Mais informacoes"],
    },
  },
  {
    id: 3,
    org: "ENDE",
    preview: "Nova fatura de energia emitida com desconto por pagamento antecipado.",
    date: "Ontem",
    status: "Informativo",
    details: {
      subject: "Fatura de Energia",
      body: "A sua fatura de energia referente ao consumo do mês passado já foi emitida e está disponível para liquidação.\nO valor apurado de 11.200 Kz contempla o seu consumo real medido, acrescido das taxas de iluminação pública.\nInformamos que ao efetuar o pagamento até 5 dias antes do prazo, poderá beneficiar de um desconto de pontualidade.\nEvite cortes no fornecimento regularizando a sua situação financeira através dos canais de pagamento habilitados.\nPoderá também aderir ao débito direto para maior comodidade e garantia de que as suas faturas estarão sempre em dia.",
      deadline: "10 de Junho de 2026",
      state: "Em aberto",
      actions: ["Ver consumo", "Gerar referencia", "Pagar agora"],
    },
  },
  {
    id: 4,
    org: "EPAL",
    preview: "Conta de agua com ajuste de leitura automatica confirmado.",
    date: "Seg",
    status: "Informativo",
    details: {
      subject: "Atualizacao de Consumo",
      body: "Informamos que foi efectuado um ajuste na sua leitura de consumo de água após a verificação técnica do contador.\nO valor final da sua conta foi retificado para 6.430 Kz, corrigindo as estimativas baseadas em consumos anteriores.\nEste ajuste garante que pagará apenas pelo volume de água efetivamente utilizado na sua residência ou empresa.\nCaso note alguma discrepância persistente na sua faturação, poderá solicitar uma nova vistoria técnica ao domicílio.\nEstamos a modernizar os nossos sistemas de leitura para reduzir estas ocorrências e aumentar a precisão da cobrança.",
      deadline: "12 de Junho de 2026",
      state: "Pronto para pagamento",
      actions: ["Consultar historico", "Solicitar revisao", "Efetuar pagamento"],
    },
  },
  {
    id: 5,
    org: "Tribunal",
    preview: "Notificacao judicial digital para confirmacao de comparecimento.",
    date: "Dom",
    status: "Urgente",
    details: {
      subject: "Notificacao Judicial",
      body: "Fica V. Exa. notificado para comparecer na audiência de conciliação agendada para o Tribunal Provincial de Luanda.\nA sua presença é fundamental para o esclarecimento célere dos pontos em discórdia no processo em curso número 2026/A12.\nPoderá fazer-se acompanhar por um representante legal ou advogado devidamente credenciado junto da Ordem dos Advogados.\nO não comparecimento sem justificação plausível poderá resultar na aplicação de sanções previstas no código de processo civil.\nQualquer pedido de adiamento deverá ser submetido digitalmente através deste portal com 48 horas de antecedência.",
      deadline: "02 de Junho de 2026",
      state: "Resposta obrigatoria",
      actions: ["Ler notificacao", "Confirmar presenca", "Solicitar adiamento"],
    },
  },
  {
    id: 6,
    org: "Hospital",
    preview: "Resultado de exame pronto e disponivel para consulta protegida.",
    date: "Sab",
    status: "Informativo",
    details: {
      subject: "Resultado Clinico",
      body: "O relatório detalhado dos seus exames laboratoriais realizados recentemente já foi processado pelo laboratório central.\nOs resultados estão agora disponíveis para consulta na sua área de paciente, protegida por criptografia de ponta a ponta.\nRelembramos que a interpretação destes dados deve ser feita obrigatoriamente por um profissional de saúde qualificado.\nAgende uma consulta de retorno para discutir estes resultados e definir os próximos passos do seu plano de saúde.\nO documento digital tem validade legal e pode ser partilhado diretamente com o seu médico assistente via e-mail.",
      deadline: "Sem prazo",
      state: "Disponivel para leitura",
      actions: ["Abrir resultado", "Partilhar com medico", "Marcar consulta"],
    },
  },
  {
    id: 13,
    org: "SME",
    preview: "Consulta o estado da sua solicitação de renovação.",
    date: "Sex",
    status: "Informativo",
    details: {
      subject: "Acompanhe a sua solicitação",
      body: "Acompanhe aqui o progresso em tempo real da sua solicitação de renovação do Passaporte Nacional.\nO seu pedido encontra-se atualmente na fase de verificação de antecedentes e validação de documentos originais.\nDevido ao elevado volume de solicitações, o tempo médio de processamento poderá sofrer um ligeiro aumento nas próximas semanas.\nAinda assim, estamos a trabalhar para que o seu documento seja emitido dentro do prazo normal de 15 dias úteis.\nSerá notificado via SMS e aplicação assim que o passaporte estiver pronto para ser recolhido no guiché selecionado.",
      deadline: "Sem prazo",
      state: "Em processamento",
      actions: ["Rastrear", "Falar com SME"],
    },
  },
  {
    id: 14,
    org: "AGT",
    preview: "Comprovativo de liquidacao de imposto municipal emitido.",
    date: "Qui",
    status: "Informativo",
    details: {
      subject: "Comprovativo Emitido",
      body: "Confirmamos a receção e validação do pagamento referente à liquidação do seu Imposto Predial Urbano (IPU).\nO comprovativo oficial de quitação já foi emitido pelo sistema e tem o selo digital de autenticidade da AGT.\nPoderá baixar o ficheiro PDF para os seus arquivos pessoais ou para apresentação junto de entidades bancárias.\nEste documento serve como prova irrevogável de que a sua situação patrimonial está devidamente regularizada.\nObrigado por contribuir para o desenvolvimento do país através do cumprimento das suas obrigações fiscais.",
      deadline: "Sem prazo",
      state: "Finalizado",
      actions: ["Baixar recibo", "Ver historico"],
    },
  },
  {
    id: 15,
    org: "Tribunal",
    preview: "Audiencia de custodia: data confirmada via portal digital.",
    date: "Qua",
    status: "Informativo",
    details: {
      subject: "Data Confirmada",
      body: "Informamos que a audiência judicial relativa ao seu processo foi confirmada e inserida na pauta oficial do tribunal.\nO evento terá lugar na sala de audiências número 4, localizada no rés-do-chão do edifício do Tribunal Provincial.\nSolicitamos a sua comparência com a antecedência necessária para identificação e registo na secretaria judicial.\nNão se esqueça de trazer consigo todos os meios de prova que pretenda apresentar para sustentar a sua posição.\nCaso ocorra algum imprevisto de última hora, deverá informar o seu mandatário ou a secretaria do tribunal imediatamente.",
      deadline: "10 de Julho de 2026",
      state: "Agendado",
      actions: ["Ver detalhes", "Submeter provas"],
    },
  },
  {
    id: 16,
    org: "Hospital",
    preview: "Historico vacinal atualizado no sistema nacional de saude.",
    date: "Ter",
    status: "Informativo",
    details: {
      subject: "Historico Vacinal",
      body: "O seu boletim de vacinas digital foi devidamente atualizado com o registo da última dose administrada no centro de saúde.\nEsta informação está agora sincronizada com o Sistema Nacional de Saúde e pode ser acedida a partir de qualquer unidade.\nO certificado digital de vacinação é válido para viagens internacionais e prova a sua imunização contra doenças endémicas.\nRecomendamos que verifique periodicamente as datas das próximas doses de reforço para manter a sua proteção ativa.\nA saúde pública é uma responsabilidade partilhada e o seu registo correto ajuda na monitorização das metas nacionais.",
      deadline: "Sem prazo",
      state: "Atualizado",
      actions: ["Ver certificado", "Agendar reforco"],
    },
  },
  {
    id: 17,
    org: "SME",
    unread: 1,
    status: "Informativo",
    preview: "Novo agendamento disponível para colheita de dados biométricos.",
    date: "10:15",
    details: {
      subject: "Agendamento SME",
      body: "Informamos que foram abertas novas vagas para o agendamento de colheita de dados biométricos.\nPoderá selecionar o posto mais próximo da sua residência através do link de ações abaixo.\nRecomendamos a marcação antecipada devido à elevada procura sazonal por novos documentos.\nO comprovativo de agendamento deverá ser apresentado no dia e hora marcados junto da recepção.\nObrigado pela sua colaboração no processo de modernização identitária nacional.",
      deadline: "30 de Junho de 2026",
      state: "Vagas disponíveis",
      actions: ["Ver vagas", "Agendar"],
    }
  },
  {
    id: 18,
    org: "AGT",
    unread: 1,
    status: "Urgente",
    preview: "Alerta de divergência detectada na sua última declaração fiscal.",
    date: "11:30",
    details: {
      subject: "Divergência Fiscal",
      body: "Foi detectada uma ligeira discrepância entre os valores declarados e os dados retidos por terceiros.\nSolicitamos a sua regularização através da submissão de documentos rectificativos via portal AGT.\nEste procedimento é fundamental para evitar a aplicação de coimas por inexatidão nas declarações.\nA nossa equipa técnica está disponível para prestar qualquer esclarecimento adicional necessário.\nO prazo para a resposta voluntária termina nos próximos dez dias úteis a contar desta data.",
      deadline: "28 de Maio de 2026",
      state: "Pendente de resposta",
      actions: ["Ver detalhes", "Submeter retificacao"],
    }
  },
  {
    id: 19,
    org: "ENDE",
    unread: 1,
    status: "Informativo",
    preview: "Campanha de eficiência energética: Conheça as novas dicas domésticas.",
    date: "13:00",
    details: {
      subject: "Eficiência Energética",
      body: "A ENDE lança hoje uma nova campanha focada na redução do consumo doméstico e proteção ambiental.\nConsulte o nosso guia prático com 10 dicas simples que podem reduzir a sua fatura mensal em até 15%.\nDesde a substituição de lâmpadas incandescentes por LED até ao uso racional de aparelhos térmicos.\nJuntos podemos construir um futuro mais sustentável para Angola, garantindo energia para todos.\nO guia completo está disponível para download imediato em formato digital.",
      deadline: "Sem prazo",
      state: "Informativo",
      actions: ["Baixar guia", "Simular poupança"],
    }
  },
  {
    id: 20,
    org: "Governo",
    unread: 1,
    status: "Informativo",
    preview: "Novo portal de serviços públicos unificado agora em fase beta.",
    date: "15:45",
    details: {
      subject: "Portal Beta",
      body: "Convidamo-lo a testar a versão beta do novo portal unificado de serviços públicos do Governo de Angola.\nA sua opinião é fundamental para a melhoria da experiência de navegação e acessibilidade dos serviços.\nExplore as novas funcionalidades de agendamento integrado e pagamento de taxas via multicaixa express.\nRelate qualquer dificuldade encontrada através do canal de feedback disponível no menu lateral.\nObrigado por ajudar a construir um governo mais digital e focado nas necessidades reais do cidadão.",
      deadline: "Sem prazo",
      state: "Em testes",
      actions: ["Aceder Beta", "Enviar feedback"],
    }
  },
  {
    id: 21,
    org: "Hospital",
    unread: 1,
    status: "Informativo",
    preview: "Receita médica digital renovada pelo seu médico assistente.",
    date: "17:20",
    details: {
      subject: "Receita Digital",
      body: "A sua receita para medicação de uso continuado foi renovada automaticamente pelo seu médico assistente.\nO código da receita já foi enviado para as farmácias parceiras e pode ser verificado pelo seu BI.\nNão é necessário deslocar-se ao hospital apenas para o levantamento de receituário físico.\nRelembramos a importância de manter a adesão ao tratamento conforme as indicações clínicas recebidas.\nCaso sinta qualquer sintoma adverso, contacte imediatamente a nossa linha de apoio ao paciente.",
      deadline: "15 de Junho de 2026",
      state: "Ativa",
      actions: ["Ver receita", "Localizar farmacia"],
    }
  },
  {
    id: 22,
    org: "SME",
    unread: 1,
    status: "Urgente",
    preview: "Alerta: Renovação de Visto de Residência necessária.",
    date: "08:00",
    details: {
      subject: "Visto de Residência",
      body: "Informamos que o seu visto de residência irá expirar nos próximos 30 dias.\nPara garantir a continuidade da sua situação regular no país, deverá iniciar o processo de renovação via portal SME.\nO não cumprimento deste prazo poderá implicar multas diárias por permanência irregular.\nPoderá submeter toda a documentação necessária de forma digital, incluindo o novo atestado de residência.\nA sua colaboração é fundamental para a gestão eficiente dos fluxos migratórios nacionais.",
      deadline: "18 de Junho de 2026",
      state: "Pendente",
      actions: ["Iniciar Renovacao", "Ver Requisitos"],
    }
  },
  {
    id: 23,
    org: "AGT",
    unread: 1,
    status: "Informativo",
    preview: "Novo guia de benefícios fiscais para jovens empreendedores.",
    date: "09:45",
    details: {
      subject: "Guia de Benefícios",
      body: "A AGT disponibiliza hoje o novo guia informativo sobre isenções e benefícios fiscais para jovens empreendedores.\nConheça as medidas de apoio ao primeiro emprego e os incentivos à criação de micro e pequenas empresas.\nEste documento detalha como solicitar a redução de taxas aduaneiras e o diferimento do pagamento de impostos.\nO nosso objetivo é fomentar o auto-emprego e a inovação tecnológica no tecido empresarial angolano.\nO guia está disponível para consulta online e download imediato na sua área reservada do portal.",
      deadline: "Sem prazo",
      state: "Novo",
      actions: ["Abrir Guia", "Mais Informacoes"],
    }
  },
  {
    id: 24,
    org: "ENDE",
    unread: 1,
    status: "Urgente",
    preview: "Fatura em atraso: Evite o corte de fornecimento de energia.",
    date: "11:20",
    details: {
      subject: "Aviso de Corte",
      body: "Verificamos que a fatura referente ao consumo de Março ainda não foi liquidada nos nossos sistemas.\nA dívida acumulada é de 24.150 Kz, incluindo taxas de mora pelo atraso verificado na regularização.\nInformamos que o corte de fornecimento está programado para ocorrer nas próximas 48 horas se não houver pagamento.\nPara evitar transtornos e custos de religação, efetue o pagamento através do Multicaixa Express agora.\nCaso já tenha efectuado o pagamento, por favor envie o comprovativo digital através desta plataforma.",
      deadline: "Hoje",
      state: "Aviso Crítico",
      actions: ["Pagar Agora", "Enviar Recibo"],
    }
  },
  {
    id: 25,
    org: "Porto de Luanda",
    unread: 1,
    status: "Informativo",
    preview: "Aviso de chegada de mercadoria retida para verificação aduaneira.",
    date: "14:10",
    details: {
      subject: "Chegada de Mercadoria",
      body: "A sua encomenda proveniente do estrangeiro deu entrada no terminal de carga do Porto de Luanda.\nA mercadoria encontra-se de momento em fase de triagem aduaneira para verificação de conformidade fiscal.\nSolicitamos que tenha prontos os documentos de importação e comprovativos de valor para apresentação rápida.\nSerá notificado assim que o processo de desalfandegamento estiver concluído e a carga pronta para levantamento.\nRelembramos que o armazenamento gratuito é limitado aos primeiros cinco dias úteis após a chegada.",
      deadline: "22 de Maio de 2026",
      state: "Em Verificacao",
      actions: ["Documentar Carga", "Ver Taxas"],
    }
  },
  {
    id: 26,
    org: "Ministerio",
    unread: 1,
    status: "Informativo",
    preview: "Subvenção oficial aprovada para o projeto social submetido.",
    date: "16:30",
    details: {
      subject: "Subvenção Aprovada",
      body: "É com satisfação que informamos que o seu pedido de subvenção para projetos sociais foi aprovado pelo conselho.\nO montante aprovado será transferido para a conta indicada num prazo máximo de 15 dias úteis.\nEste apoio visa reforçar as iniciativas de impacto comunitário na sua região de residência ou atuação.\nSerá monitorizado um relatório trimestral de execução para garantir o uso correto dos fundos públicos cedidos.\nAgradecemos o seu empenho em contribuir para a melhoria das condições sociais no nosso país.",
      deadline: "Sem prazo",
      state: "Aprovado",
      actions: ["Ver Protocolo", "Aceitar Termos"],
    }
  },
];

export const INSTITUTIONAL_INBOX: Message[] = [
  {
    id: 1001,
    org: "Cidadão: Edlasio Galhardo",
    preview: "Pedido de esclarecimento sobre submissão de NIF.",
    date: "08:45",
    unread: 1,
    status: "Urgente",
    details: {
      subject: "Esclarecimento NIF",
      body: "Exmos. Senhores da AGT,\n\nGostaria de solicitar um esclarecimento sobre o estado da minha submissão de NIF realizada há duas semanas. Ainda não recebi a confirmação oficial no meu portal.\n\nPoderiam verificar se existe alguma pendência nos meus dados?\n\nAtentamente,\nEdlasio Galhardo",
      actions: ["Responder", "Ver Cadastro", "Encaminhar"],
    },
  },
  {
    id: 1002,
    org: "Cidadão: Maria Antónia",
    preview: "Envio de comprovativo de pagamento de taxa industrial.",
    date: "09:30",
    unread: 1,
    status: "Informativo",
    details: {
      subject: "Taxa Industrial",
      body: "Bom dia,\n\nAnexo envio o comprovativo de pagamento da taxa industrial do primeiro trimestre de 2026. Peço que procedam à baixa da nota de liquidação no sistema.\n\nMelhores cumprimentos,\nMaria Antónia",
      actions: ["Validar Recibo", "Arquivar", "Responder"],
    },
  },
  {
    id: 1004,
    org: "Cidadão: José Kalunga",
    preview: "Dedução fiscal não aplicada em fatura de saúde.",
    date: "11:00",
    unread: 1,
    status: "Informativo",
    details: {
      subject: "Dedução de Saúde",
      body: "Caros colegas,\n\nNotei que uma fatura de despesas médicas não foi considerada para dedução automática no meu IRT. Gostaria de saber como proceder para a correção manual.\n\nObrigado.",
      actions: ["Analisar Fatura", "Corrigir Saldo", "Responder"],
    },
  },
  {
    id: 1005,
    org: "Empresa: Comércio Geral S.A.",
    preview: "Pedido de parcelamento de dívida de IVA.",
    date: "12:10",
    unread: 1,
    status: "Urgente",
    details: {
      subject: "Parcelamento IVA",
      body: "Devido a dificuldades de tesouraria no último mês, solicitamos o parcelamento da dívida de IVA referente ao mês de Abril em 3 prestações mensais.\n\nComprometemo-nos a manter os pagamentos correntes em dia.\n\nAtentamente,\nA Direção Financeira",
      actions: ["Verificar Histórico", "Acordo de Pagamento", "Indeferir"],
    },
  },
];

export const SENT_MESSAGES: Message[] = [
  { id: 101, org: "SME", preview: "Resposta enviada: Solicito reagendamento para sexta-feira.", date: "Hoje", status: "Informativo" },
  { id: 102, org: "AGT", preview: "Comprovativo fiscal enviado em anexo para validacao.", date: "Ontem", status: "Informativo" },
  { id: 103, org: "Hospital", preview: "Pedido de segunda via de relatorio submetido.", date: "Seg", status: "Informativo" },
  { id: 104, org: "ENDE", preview: "Reclamacao de cobranca indevida registrada sob protocolo #9901.", date: "Ter", status: "Informativo" },
  { id: 105, org: "EPAL", preview: "Comunicacao de vazamento na via publica (Rua 15).", date: "Qua", status: "Informativo" },
  { id: 106, org: "Administracao", preview: "Pedido de renovacao de certificado de residencia.", date: "Qui", status: "Informativo" },
  { id: 107, org: "Tribunal", preview: "Submissao de peticao inicial digital confirmada.", date: "Sex", status: "Informativo" },
  { id: 108, org: "Ministério", preview: "Inscricao em programa de apoio social enviada.", date: "Sáb", status: "Informativo" },
];

export const DOCUMENTS: Document[] = [
  {
    name: "BI Digital",
    validity: "Valido ate 2032",
    code: "AO-BI-9281",
    holder: "Edlasio Galhardo",
    number: "009874562LA041",
    issuer: "SME",
    issuedAt: "10 de Abril de 2022",
  },
  {
    name: "Passaporte",
    validity: "Valido ate 2030",
    code: "AO-PP-7712",
    holder: "Edlasio Galhardo",
    number: "P08821944",
    issuer: "SME",
    issuedAt: "18 de Junho de 2020",
  },
  {
    name: "Carta de conducao",
    validity: "Renovacao em 2028",
    code: "AO-CD-5534",
    holder: "Edlasio Galhardo",
    number: "CD-244-99310",
    issuer: "Ministerio dos Transportes",
    issuedAt: "03 de Novembro de 2023",
  },
  {
    name: "Certificado de residencia",
    validity: "Atualizado",
    code: "AO-CR-9022",
    holder: "Edlasio Galhardo",
    number: "RES-2026-1102",
    issuer: "Administracao Municipal",
    issuedAt: "22 de Janeiro de 2026",
  },
  {
    name: "NIF (Número de Identificação Fiscal)",
    validity: "Vitalício",
    code: "AO-NIF-4412",
    holder: "Edlasio Galhardo",
    number: "5412889210",
    issuer: "AGT",
    issuedAt: "15 de Maio de 2018",
  },
  {
    name: "Certidão de Conformidade Fiscal",
    validity: "Valido por 90 dias",
    code: "AO-CCF-8812",
    holder: "Edlasio Galhardo",
    number: "AGT-2026-CCF-001",
    issuer: "AGT",
    issuedAt: "02 de Maio de 2026",
  },
  {
    name: "Comprovativo de Pagamento IPU",
    validity: "Ano Fiscal 2025",
    code: "AO-IPU-1123",
    holder: "Edlasio Galhardo",
    number: "REC-IPU-9921",
    issuer: "AGT",
    issuedAt: "10 de Abril de 2026",
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: "Maria Domingos", bi: "008744221LA011", relation: "Mae", status: "Confirmado", type: "Emergência" },
  { id: 2, name: "Joao Manuel", bi: "007112009LA031", relation: "Irmao", status: "Confirmado", type: "Emergência" },
  { id: 3, name: "Ana Baptista", bi: "009991332LA018", relation: "Vizinha", status: "Pendente", type: "Normal" },
];

export const HIGHLIGHT_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Seu BI é o seu endereço digital",
    subtitle: "Aceda a correspondências e documentos oficiais de forma segura e centralizada em qualquer lugar.",
    image: "https://i.postimg.cc/s24k4tkd/1-Desktop.png",
    mobileImage: "https://i.postimg.cc/PxyLsDRC/1.png",
    btn: "Ver Correspondências",
    action: "correspondencias"
  },
  {
    id: 3,
    title: "Segurança de Nível Estatal",
    subtitle: "Dados protegidos por criptografia de ponta a ponta e biometria para garantir a total privacidade do cidadão.",
    image: "https://i.postimg.cc/DwVRkvFK/3-Desktop.png",
    mobileImage: "https://i.postimg.cc/8P0Zgf8G/3.png",
    btn: "Configurar Segurança",
    action: "perfil"
  },
  {
    id: 4,
    title: "Notificações em Tempo Real",
    subtitle: "Receba alertas instantâneos sobre multas, impostos e agendamentos governamentais.",
    image: "https://i.postimg.cc/k45pFDNC/4-Desktop.png",
    mobileImage: "https://i.postimg.cc/1XgNGtvV/4.png",
    btn: "Ver Alertas",
    action: "correspondencias"
  },
  {
    id: 5,
    title: "Contactos de Emergência",
    subtitle: "Mantenha a sua rede de confiança atualizada para situações críticas.",
    image: "https://i.postimg.cc/br7VhT7R/5-Desktop.png",
    mobileImage: "https://i.postimg.cc/pTSmLvPd/5.png",
    btn: "Gerir Contactos",
    action: "contatos"
  },
  {
    id: 6,
    title: "Assistência por IA Oficial",
    subtitle: "Tire dúvidas sobre processos burocráticos e receba orientações personalizadas.",
    image: "https://i.postimg.cc/PqLKHcdm/6-Desktop.png",
    mobileImage: "https://i.postimg.cc/Bv6DSM2R/6.png",
    btn: "Abrir Conversa",
    action: "home"
  },
  {
    id: 7,
    title: "Angola Digital em Movimento",
    subtitle: "A modernização dos serviços públicos ao serviço de todos os angolanos.",
    image: "https://i.postimg.cc/NMjsL1zv/7.png",
    mobileImage: "https://i.postimg.cc/9MgLXD41/7.png",
    btn: "Saber Mais",
    action: "home"
  }
];

export const GOV_HIGHLIGHT_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Portal do Agente AGT",
    subtitle: "Gestão centralizada de serviços tributários e comunicações oficiais.",
    image: "https://i.postimg.cc/ydQKDYCd/1-Desktop.png",
    mobileImage: "https://i.postimg.cc/QxWDM34x/1.png",
    btn: "Ver Mensagens",
    action: "gov-emissao"
  },
  {
    id: 3,
    title: "Instituições Conectadas",
    subtitle: "Gestão de agências e conectividade avançada entre instituições governamentais.",
    image: "https://i.postimg.cc/4ddkRkHY/2.png",
    btn: "Monitorar Rede",
    action: "gov-interoperabilidade"
  },
  {
    id: 4,
    title: "Segurança Cibernética SOC",
    subtitle: "Proteção de dados e integridade da identidade digital do cidadão angolano.",
    image: "https://i.postimg.cc/434Ny0h4/3.png",
    btn: "Configurar SOC",
    action: "gov-dashboard"
  },
  {
    id: 5,
    title: "Emissão de Documentos",
    subtitle: "Processamento célere e seguro de atos administrativos e certidões digitais.",
    image: "https://i.postimg.cc/63kXrbTK/4.png",
    btn: "Ver Emissões",
    action: "gov-docs"
  },
  {
    id: 6,
    title: "Eficiência Governamental",
    subtitle: "Angola Digital: Modernização dos serviços públicos para maior transparência.",
    image: "https://i.postimg.cc/4NzJ5GzM/5.png",
    btn: "Explorar Serviços",
    action: "gov-dashboard"
  }
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: 1, title: 'BI Renovado', message: 'O seu Bilhete de Identidade foi renovado com sucesso.', time: '2h atrás', type: 'success', targetTab: 'correspondencias' },
  { id: 2, title: 'Alerta de Segurança', message: 'Novo acesso detectado a partir de um dispositivo Chrome em Luanda.', time: '5h atrás', type: 'warning', targetTab: 'perfil' },
  { id: 3, title: 'Documento Recebido', message: 'O SME enviou um novo documento para a sua correspondência eletrónica.', time: 'Ontem', type: 'info', targetTab: 'correspondencias' },
];

export const USER_PROFILE_PHOTO = "https://i.postimg.cc/sxWsYGX2/Foto-Edlasio.png";
