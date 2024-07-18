import { INotificationDocument } from './notification.interface';

export interface ISSLMonitorDocument {
  id?: number;
  monitorId?: number;
  notificationId: number;
  userId: number;
  name: string;
  active: boolean;
  status: number;
  frequency: number;
  alertThreshold: number;
  url: string;
  info: string;
  notifications?: INotificationDocument;
}

export interface ISSLInfo {
  host: string;
  type: string;
  reason?: Error;
  validFor?: string[];
  subject: SSLSubjectProps;
  issuer: SSLSubjectProps;
  info: SSLInfoProps
}

export interface ISSLMonitorArgs {
  monitor?: ISSLMonitorDocument;
  monitorId?: string;
  userId?: string;
  name?: string;
  active?: boolean;
}

interface SSLSubjectProps {
  org: string;
  common_name: string;
  sans?: string;
  country?: string;
}

interface SSLInfoProps {
  validFrom?: string;
  validTo?: string;
  daysLeft: number | string;
  backgroundClass: string;
}
