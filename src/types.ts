/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MessageDetail {
  subject: string;
  body: string;
  deadline?: string;
  state?: string;
  actions?: string[];
  attachments?: string[];
}

export interface Message {
  id: number;
  org: string;
  preview: string;
  date: string;
  unread?: number;
  status: string;
  details?: MessageDetail;
}

export interface Document {
  name: string;
  validity: string;
  code: string;
  holder: string;
  number: string;
  issuer: string;
  issuedAt: string;
}

export interface Contact {
  id: number;
  name: string;
  bi: string;
  relation: string;
  status: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  btn: string;
  action: string;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  targetTab: string;
}

export interface UserRequest {
  id: number;
  user: string;
  type: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  time: string;
  status: 'pendente' | 'urgente' | 'processando' | 'concluido' | 'rejeitado';
  bi: string;
  institution?: string;
  date?: string;
}

export interface DocRequest {
  id: number;
  userName: string;
  userBi: string;
  docType: string;
  institution: string;
  date: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  aiStatus?: 'pre-approved' | 'manual-review';
}

export type AppMode = 'user' | 'institution' | 'admin';
