import { IEmailLocals } from '@app/interfaces/notification.interface';
import { ISSLInfo, ISSLMonitorDocument } from '@app/interfaces/ssl.interface';
import { getSSLMonitorById, updateSSLMonitorInfo } from '@app/services/ssl.service';
import { emailSender, locals } from '@app/utils/utils';
import logger from '@app/server/logger';

import { getCertificateInfo } from './monitors';

class SSLMonitor {
  errorCount: number;

  constructor() {
    this.errorCount = 0;
  }

  async start(data: ISSLMonitorDocument): Promise<void> {
    const { monitorId, url } = data;
    const emailLocals: IEmailLocals = locals();
    try {
      const monitorData: ISSLMonitorDocument = await getSSLMonitorById(monitorId!);
      emailLocals.appName = monitorData.name;
      const response: ISSLInfo = await getCertificateInfo(url!);
      await updateSSLMonitorInfo(parseInt(`${monitorId}`), JSON.stringify(response));
      logger.info(`SSL certificate for "${url}" is valid`);
    } catch (error) {
      logger.error(`SSL certificate for "${url}" has issues`);
      const monitorData: ISSLMonitorDocument = await getSSLMonitorById(monitorId!);
      this.errorCount += 1;
      await updateSSLMonitorInfo(parseInt(`${monitorId}`), JSON.stringify(error));
      if (monitorData.alertThreshold > 0 && this.errorCount > monitorData.alertThreshold) {
        this.errorCount = 0;
        emailSender(
          monitorData.notifications!.emails,
          'errorStatus',
          emailLocals
        );
      }
    }
  }
};

export const sslMonitor: SSLMonitor = new SSLMonitor();
