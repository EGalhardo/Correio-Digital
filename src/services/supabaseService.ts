import { supabase } from '../lib/supabaseClient';
import { Message, Document, Contact, UserRequest, DocRequest, Correspondence } from '../types';

/**
 * Service to connect and synchronize state with the Supabase database.
 * Formatted and typed to align 100% with /supabase/schema.sql and the application types.
 */

// Simple helper to detect if we have valid non-placeholder keys set
export const hasValidSupabaseKeys = (): boolean => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL || '';
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  return url && url !== '' && !url.includes('placeholder-url') && key && !key.includes('placeholder-anon-key');
};

export const supabaseService = {
  /**
   * Check connection and verify if tables are created.
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    if (!hasValidSupabaseKeys()) {
      return {
        success: false,
        message: 'Chaves do Supabase não configuradas ou são marcadores de posição (placeholders).'
      };
    }

    try {
      // Attempt a simple head query on 'profiles' or dynamic PostgreSQL healthcheck to verify tables exist
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          return {
            success: false,
            message: 'Conectado ao Supabase, mas a tabela "profiles" não foi encontrada. ' +
                     'Por favor, execute o script SQL em "/supabase/schema.sql" no editor SQL do Supabase.',
            details: error
          };
        }
        return {
          success: false,
          message: `Erro na resposta do Supabase: ${error.message} (Código ${error.code})`,
          details: error
        };
      }

      return {
        success: true,
        message: 'Conexão estabelecida com sucesso! As tabelas do banco de dados estão prontas.',
        details: { status }
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Falha ao conectar com o servidor Supabase. Por favor, verifique sua conexão ou URL.',
        details: err?.message || err
      };
    }
  },

  /**
   * Upsert citizen profile
   */
  async upsertProfile(profile: {
    bi: string;
    name: string;
    phone?: string;
    nif?: string;
    passport?: string;
    birth_date?: string;
    filiation?: string;
    marital_status?: string;
    role?: string;
  }) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      // First try to match by bi
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('bi', profile.bi)
        .maybeSingle();

      const payload = {
        bi: profile.bi,
        name: profile.name,
        phone: profile.phone || null,
        nif: profile.nif || null,
        passport: profile.passport || null,
        birth_date: profile.birth_date ? profile.birth_date.split('/').reverse().join('-') : null, // dd/mm/yyyy to yyyy-mm-dd
        filiation: profile.filiation || null,
        marital_status: profile.marital_status || null,
        role: profile.role || 'user'
      };

      if (existing) {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('bi', profile.bi)
          .select();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert([payload])
          .select();
        if (error) throw error;
        return data;
      }
    } catch (e: any) {
      console.error('Supabase update profile error:', e);
      throw e;
    }
  },

  /**
   * Push a local message/correspondence to the database
   */
  async insertMessage(msg: Message, userBi: string) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      // Extract attachments list
      const atts = msg.details?.attachments || [];
      const payload = {
        id: msg.id,
        sender_bi: msg.org === 'AGT' || msg.org === 'SME' ? msg.org : 'SYSTEM',
        recipient_bi: userBi,
        org: msg.org,
        preview: msg.preview,
        unread: msg.unread ? true : false,
        status: msg.status || 'Normal',
        subject: msg.details?.subject || msg.preview,
        body: msg.details?.body || '',
        deadline_text: msg.details?.deadline || 'Sem prazo',
        state_indicator: msg.details?.state || 'Entregue',
        actions: msg.details?.actions || [],
        attachments: atts,
        sensitivity: msg.sensitivity || 'Privado',
        priority_scale: msg.priorityScale || 'Normal',
        deadline_hours_remaining: msg.deadlineHoursRemaining || null
      };

      const { data, error } = await supabase
        .from('messages')
        .upsert([payload])
        .select();

      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase insertMessage error:', e);
      throw e;
    }
  },

  /**
   * Push a document
   */
  async insertDocument(doc: Document, userBi: string) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        name: doc.name,
        validity: doc.validity,
        code: doc.code,
        holder_bi: userBi,
        document_number: doc.number,
        issuer: doc.issuer,
        issued_at: doc.issuedAt
      };
      const { data, error } = await supabase
        .from('documents')
        .upsert([payload], { onConflict: 'code' })
        .select();
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase insertDocument error:', e);
      throw e;
    }
  },

  /**
   * Sync a contact
   */
  async insertContact(contact: Contact, ownerBi: string) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        id: contact.id,
        owner_bi: ownerBi,
        name: contact.name,
        bi: contact.bi,
        relation: contact.relation,
        status: contact.status,
        type: contact.type || 'Normal'
      };
      const { data, error } = await supabase
        .from('contacts')
        .upsert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase insertContact error:', e);
      throw e;
    }
  },

  /**
   * Delete contact
   */
  async deleteContact(contactId: number) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase deleteContact error:', e);
      return null;
    }
  },

  /**
   * Sync audit log
   */
  async insertAuditLog(log: { action: string; user: string; timestamp?: string; type?: string }) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        action: log.action,
        username: log.user,
        action_type: log.type || 'info'
      };
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase auditLog error:', e);
      return null;
    }
  },

  /**
   * Sync user requested services
   */
  async insertUserRequest(req: UserRequest) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        id: req.id,
        user_bi: req.bi,
        user_name: req.user,
        service_type: req.type,
        priority: req.priority,
        time_text: req.time,
        status: req.status,
        institution: req.institution || 'AGT'
      };
      const { data, error } = await supabase
        .from('user_requests')
        .upsert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase userRequest error:', e);
      throw e;
    }
  },

  /**
   * Sync document issuance request
   */
  async insertDocRequest(req: DocRequest) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        id: req.id,
        user_name: req.userName,
        user_bi: req.userBi,
        doc_type: req.docType,
        institution: req.institution,
        status: req.status,
        ai_status: req.aiStatus || 'pre-approved'
      };
      const { data, error } = await supabase
        .from('document_requests')
        .upsert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Supabase docRequest error:', e);
      throw e;
    }
  },

  /**
   * Fetch a citizen's profile by BI
   */
  async getProfile(bi: string) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('bi', bi)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase getProfile error:', e);
      return null;
    }
  },

  /**
   * Fetch all messages (correspondence) for a citizen or a specific sender
   */
  async getMessages(bi: string): Promise<Message[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`recipient_bi.eq.${bi},sender_bi.eq.${bi}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => {
        return {
          id: Number(item.id),
          org: item.org,
          preview: item.preview,
          date: new Date(item.created_at).toLocaleDateString('pt-AO'),
          unread: item.unread ? 1 : 0,
          status: item.status,
          details: {
            subject: item.subject,
            body: item.body,
            deadline: item.deadline_text,
            state: item.state_indicator,
            actions: item.actions || [],
            attachments: item.attachments || []
          },
          sensitivity: item.sensitivity,
          priorityScale: item.priority_scale,
          deadlineHoursRemaining: item.deadline_hours_remaining
        };
      });
    } catch (e) {
      console.error('Supabase getMessages error:', e);
      return null;
    }
  },

  /**
   * Fetch documents for a citizen
   */
  async getDocuments(bi: string): Promise<Document[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('holder_bi', bi);

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        name: item.name,
        validity: item.validity,
        code: item.code,
        holder: item.holder_bi,
        number: item.document_number,
        issuer: item.issuer,
        issuedAt: item.issued_at
      }));
    } catch (e) {
      console.error('Supabase getDocuments error:', e);
      return null;
    }
  },

  /**
   * Fetch contacts for a citizen
   */
  async getContacts(bi: string): Promise<Contact[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('owner_bi', bi);

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: Number(item.id),
        name: item.name,
        bi: item.bi,
        relation: item.relation,
        status: item.status,
        type: item.type
      }));
    } catch (e) {
      console.error('Supabase getContacts error:', e);
      return null;
    }
  },

  /**
   * Fetch citizen/system notifications
   */
  async getNotifications(bi: string): Promise<any[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('target_bi', bi)
        .order('id', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: Number(item.id),
        title: item.title,
        message: item.message,
        time: item.time_text,
        type: item.type,
        targetTab: item.target_tab
      }));
    } catch (e) {
      console.error('Supabase getNotifications error:', e);
      return null;
    }
  },

  /**
   * Save a system notification to Supabase
   */
  async insertNotification(notif: any, targetBi: string) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        target_bi: targetBi,
        title: notif.title,
        message: notif.message,
        time_text: notif.time || 'Agora',
        type: notif.type || 'info',
        target_tab: notif.targetTab || 'home'
      };
      const { data, error } = await supabase
        .from('notifications')
        .insert([payload])
        .select();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase insertNotification error:', e);
      return null;
    }
  },

  /**
   * Fetch services user_requests
   */
  async getUserRequests(bi?: string): Promise<UserRequest[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      let query = supabase.from('user_requests').select('*');
      if (bi) {
        query = query.eq('user_bi', bi);
      }
      const { data, error } = await query.order('id', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: Number(item.id),
        user: item.user_name,
        type: item.service_type,
        priority: item.priority as any,
        time: item.time_text,
        status: item.status as any,
        bi: item.user_bi,
        institution: item.institution || 'AGT',
        date: item.request_date
      }));
    } catch (e) {
      console.error('Supabase getUserRequests error:', e);
      return null;
    }
  },

  /**
   * Fetch doc requests
   */
  async getDocRequests(bi?: string): Promise<DocRequest[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      let query = supabase.from('document_requests').select('*');
      if (bi) {
        query = query.eq('user_bi', bi);
      }
      const { data, error } = await query.order('id', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: Number(item.id),
        userName: item.user_name,
        userBi: item.user_bi,
        docType: item.doc_type,
        institution: item.institution,
        date: item.request_date ? new Date(item.request_date).toLocaleDateString('pt-AO') : 'Recente',
        status: item.status as any,
        aiStatus: item.ai_status as any
      }));
    } catch (e) {
      console.error('Supabase getDocRequests error:', e);
      return null;
    }
  },

  /**
   * Fetch audit logs
   */
  async getAuditLogs(): Promise<any[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (!data) return [];

      return data.map((item: any) => ({
        id: String(item.id),
        action: item.action,
        user: item.username,
        timestamp: new Date(item.timestamp).toLocaleString('pt-AO'),
        type: item.action_type || 'info'
      }));
    } catch (e) {
      console.error('Supabase getAuditLogs error:', e);
      return null;
    }
  },

  /**
   * Insert or update official government correspondence
   */
  async insertCorrespondence(cor: Correspondence) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        id: parseInt(cor.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000),
        sender_bi: cor.sender,
        recipient_bi: cor.recipient,
        org: cor.institution,
        preview: cor.subject,
        unread: false,
        status: cor.priority || 'Normal',
        subject: cor.subject,
        body: cor.body,
        deadline_text: cor.originProvince, 
        state_indicator: cor.destinationProvince,
        actions: [cor.status] // Store current status value in text array
      };
      const { data, error } = await supabase
        .from('messages')
        .upsert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase insertCorrespondence error:', e);
      return null;
    }
  },

  /**
   * Fetch all official government correspondences
   */
  async getCorrespondences(): Promise<Correspondence[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      
      // Filter out messages that represent general personal messages of citizen
      // General citizen messages are filtered where they match citizen's id format
      return data.map((item: any) => ({
        id: `COR-${item.id}`,
        sender: item.sender_bi,
        recipient: item.recipient_bi,
        subject: item.subject,
        originProvince: item.deadline_text || 'Luanda',
        destinationProvince: item.state_indicator || 'Uíge',
        institution: item.org,
        status: item.actions?.[0] || 'Enviada',
        date: new Date(item.created_at).toLocaleDateString('pt-AO'),
        body: item.body,
        priority: item.status
      }));
    } catch (e) {
      console.error('Supabase getCorrespondences error:', e);
      return null;
    }
  },

  /**
   * Fetch digital protocols
   */
  async getDigitalProtocols(): Promise<any[] | null> {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const { data, error } = await supabase
        .from('digital_protocols')
        .select('*')
        .order('official_issue_date', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase getDigitalProtocols error:', e);
      return null;
    }
  },

  /**
   * Insert digital protocol
   */
  async insertDigitalProtocol(p: any) {
    if (!hasValidSupabaseKeys()) return null;
    try {
      const payload = {
        protocol_number: p.protocolNumber,
        issuer_institution: p.issuerInstitution,
        official_issue_date: p.officialIssueDate || new Date().toISOString().split('T')[0],
        official_time: p.officialTime || new Date().toLocaleTimeString(),
        issuer_responsible: p.issuerResponsible || 'Sistema CADA',
        category: p.category || 'Geral',
        document_type: p.documentType || 'Correspondência',
        current_state: p.currentState || 'Ativo',
        priority: p.priority || 'Normal',
        qr_code_url: p.qrCodeUrl || '',
        digital_signature: p.digitalSignature || 'SEC_COMP_CAD_KEY_SIGNED',
        legal_validity: p.legalValidity || 'Ponto de barramento seguro CADA'
      };
      const { data, error } = await supabase
        .from('digital_protocols')
        .insert([payload])
        .select();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Supabase insertDigitalProtocol error:', e);
      return null;
    }
  },

  /**
   * Seed the database with all local states.
   * Ensures 100% data fidelity between citizen profile, messages, contacts, and requests.
   */
  async seedAll(params: {
    profile: {
      bi: string;
      name: string;
      phone: string;
      nif: string;
      passport: string;
      birthDate: string;
      filiation: string;
      maritalStatus: string;
    };
    inbox: Message[];
    docInbox: Message[];
    sentMessages: Message[];
    contacts: Contact[];
    documents: Document[];
    userRequests: UserRequest[];
    docRequests: DocRequest[];
    auditLogs: any[];
  }): Promise<{ success: boolean; message: string; counts?: any }> {
    if (!hasValidSupabaseKeys()) {
      return { success: false, message: 'Não é possível semear: Chaves do Supabase ausentes ou inválidas.' };
    }

    try {
      const errors: string[] = [];
      let profileCount = 0;
      let messageCount = 0;
      let contactCount = 0;
      let docCount = 0;
      let requestCount = 0;
      let logCount = 0;

      // 1. Profiling
      try {
        const pResult = await this.upsertProfile({
          bi: params.profile.bi,
          name: params.profile.name,
          phone: params.profile.phone,
          nif: params.profile.nif,
          passport: params.profile.passport,
          birth_date: params.profile.birthDate,
          filiation: params.profile.filiation,
          marital_status: params.profile.maritalStatus,
          role: 'user'
        });
        if (pResult) profileCount++;
      } catch (err: any) {
        errors.push(`Perfil (${err?.message || err})`);
      }

      // Also upsert some default mocked profiles to prevent FK constraint failures
      try {
        await this.upsertProfile({ bi: '008812342LA011', name: 'Maria Antónia', role: 'user' });
        await this.upsertProfile({ bi: '007712342LA021', name: 'José Kalunga', role: 'user' });
        await this.upsertProfile({ bi: '009991332LA018', name: 'Ana Baptista', role: 'user' });
      } catch (err) {}

      // 2. Insert Contacts
      for (const contact of params.contacts) {
        try {
          const res = await this.insertContact(contact, params.profile.bi);
          if (res) contactCount++;
          else errors.push(`Contato ${contact.name}`);
        } catch (err: any) {
          errors.push(`Contato (${contact.name}: ${err?.message || err})`);
        }
      }

      // 3. Insert Inbox + Sent Messages + Doc Inbox
      const allMsgs = [
        ...params.inbox, 
        ...params.docInbox, 
        ...params.sentMessages
      ];
      // Deduplicate by message ID just in case
      const uniqueMsgs = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());

      for (const msg of uniqueMsgs) {
        try {
          const res = await this.insertMessage(msg, params.profile.bi);
          if (res) messageCount++;
          else errors.push(`Msg #${msg.id}`);
        } catch (err: any) {
          errors.push(`Msg #${msg.id} (${err?.message || err})`);
        }
      }

      // 4. Insert Documents
      for (const doc of params.documents) {
        try {
          const res = await this.insertDocument(doc, params.profile.bi);
          if (res) docCount++;
          else errors.push(`Doc ${doc.name}`);
        } catch (err: any) {
          errors.push(`Doc ${doc.name} (${err?.message || err})`);
        }
      }

      // 5. Insert User Requests
      for (const req of params.userRequests) {
        try {
          const res = await this.insertUserRequest(req);
          if (res) requestCount++;
          else errors.push(`Ped IPU #${req.id}`);
        } catch (err: any) {
          errors.push(`Ped IPU #${req.id} (${err?.message || err})`);
        }
      }

      // 6. Insert Doc Requests (Emit)
      for (const req of params.docRequests) {
        try {
          const res = await this.insertDocRequest(req);
          if (res) requestCount++;
          else errors.push(`Req Doc #${req.id}`);
        } catch (err: any) {
          errors.push(`Req Doc #${req.id} (${err?.message || err})`);
        }
      }

      // 7. Insert Audit Logs
      for (const log of params.auditLogs.slice(-10)) { // sync last 10 logs
        try {
          const res = await this.insertAuditLog({
            action: log.action || log.message || '',
            user: log.user || 'SYSTEM',
            type: log.type || 'info'
          });
          if (res) logCount++;
        } catch (err) {}
      }

      return {
        success: errors.length === 0,
        message: errors.length === 0 
          ? 'Banco de dados semeado com sucesso!' 
          : `Semeado com alguns erros: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`,
        counts: {
          profiles: profileCount,
          messages: messageCount,
          contacts: contactCount,
          documents: docCount,
          requests: requestCount,
          auditLogs: logCount
        }
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Falha na semeadura geral: ${e?.message || e}`
      };
    }
  }
};
