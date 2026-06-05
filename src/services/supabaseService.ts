import { supabase } from '../lib/supabaseClient';
import { Message, Document, Contact, UserRequest, DocRequest } from '../types';

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
