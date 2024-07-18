import { IMonitorDocument, IMonitorResponse } from '@app/interfaces/monitor.interface';
import { getMonitorById, updateMonitorStatus } from '@app/services/monitor.service';
import dayjs from 'dayjs';
import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import logger from '@app/server/logger';
import { createTcpHeartBeat } from '@app/services/tcp.service';
import { emailSender, locals } from '@app/utils/utils';
import { IEmailLocals } from '@app/interfaces/notification.interface';

import { tcpPing } from './monitors';

class TcpMonitor {
  errorCount: number;
  noSuccessAlert: boolean;
  emailsLocals: IEmailLocals;

  constructor() {
    this.errorCount = 0;
    this.noSuccessAlert = true;
    this.emailsLocals = locals();
  }

  async start(data: IMonitorDocument) {
    const { monitorId, url, port, timeout } = data;
    try {
      const monitorData: IMonitorDocument = await getMonitorById(monitorId!);
      this.emailsLocals.appName = monitorData.name;
      const response: IMonitorResponse = await tcpPing(url!, port!, timeout!);
      this.assertionCheck(response, monitorData);
    } catch (error) {
      const monitorData: IMonitorDocument = await getMonitorById(monitorId!);
      this.tcpError(monitorData, error);
    }
  }

  async assertionCheck(response: IMonitorResponse, monitorData: IMonitorDocument) {
    const timestamp = dayjs.utc().valueOf();
    let heartbeatData: IHeartbeat = {
      monitorId: monitorData.id!,
      status: 0,
      code: response.code,
      message: response.message,
      timestamp,
      responseTime: response.responseTime,
      connection: response.status
    };
    const respTime = JSON.parse(monitorData.responseTime!);
    if (monitorData.connection !== response.status || respTime < response.responseTime) {
      this.errorCount += 1;
      heartbeatData = {
        ...heartbeatData,
        status: 1,
        message: 'Failed tcp response assertion',
        code: 500
      };
      await Promise.all([
        updateMonitorStatus(monitorData, timestamp, 'failure'),
        createTcpHeartBeat(heartbeatData)
      ]);
      logger.info(`TCP heartbeat failed assertions: Monitor ID ${monitorData.id}`);
      if (monitorData.alertThreshold > 0 && this.errorCount > monitorData.alertThreshold) {
        this.errorCount = 0;
        this.noSuccessAlert = false;
        emailSender(
          monitorData.notifications!.emails,
          'errorStatus',
          this.emailsLocals
        );
      }
    } else {
      await Promise.all([
        updateMonitorStatus(monitorData, timestamp, 'success'),
        createTcpHeartBeat(heartbeatData)
      ]);
      logger.info(`TCP heartbeat success: Monitor ID ${monitorData.id}`);
      if (!this.noSuccessAlert) {
        this.errorCount = 0;
        this.noSuccessAlert = true;
        emailSender(
          monitorData.notifications!.emails,
          'successStatus',
          this.emailsLocals
        );
      }
    }
  }

  async tcpError(monitorData: IMonitorDocument, error: IMonitorResponse) {
    this.errorCount += 1;
    const timestamp = dayjs.utc().valueOf();
    const heartbeatData: IHeartbeat = {
      monitorId: monitorData.id!,
      status: 1,
      code: error.code,
      message: error && error.message ? error.message : 'TCP heartbeat failed',
      timestamp,
      responseTime: error.responseTime,
      connection: error.status
    };
    await Promise.all([
      updateMonitorStatus(monitorData, timestamp, 'failure'),
      createTcpHeartBeat(heartbeatData)
    ]);
    logger.info(`TCP heartbeat failed: Monitor ID ${monitorData.id}`);
    if (monitorData.alertThreshold > 0 && this.errorCount > monitorData.alertThreshold) {
      this.errorCount = 0;
      this.noSuccessAlert = false;
      emailSender(
        monitorData.notifications!.emails,
        'errorStatus',
        this.emailsLocals
      );
    }
  }
}

export const tcpMonitor: TcpMonitor = new TcpMonitor();
