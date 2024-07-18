import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { HttpModel } from '@app/models/http.model';
import { httpMonitor } from '@app/monitors/http.monitor';
import { startSingleJob } from '@app/utils/jobs';
import { appTimeZone } from '@app/utils/utils';
import dayjs from 'dayjs';
import { Model, Op } from 'sequelize';

export const createHttpHeartBeat = async (data: IHeartbeat): Promise<IHeartbeat> => {
  try {
    const result: Model = await HttpModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getHttpHeartBeatsByDuration = async (monitorId: number, duration = 24): Promise<IHeartbeat[]> => {
  try {
    const dateTime: Date = (dayjs.utc()).toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats: IHeartbeat[] = await HttpModel.findAll({
      raw: true,
      where: {
        [Op.and]: [
          { monitorId },
          {
            timestamp: {
              [Op.gte]: dateTime
            }
          }
        ]
      },
      order: [
        ['timestamp', 'DESC']
      ]
    }) as unknown as IHeartbeat[];
    return heartbeats;
  } catch (error) {
    throw new Error(error);
  }
};

export const httpStatusMonitor = (monitor: IMonitorDocument, name: string): void => {
  const httpMonitorData: IMonitorDocument = {
    monitorId: monitor.id,
    httpAuthMethod: monitor.httpAuthMethod,
    basicAuthUser: monitor.basicAuthUser,
    basicAuthPass: monitor.basicAuthPass,
    url: monitor.url,
    method: monitor.method,
    headers: monitor.headers,
    body: monitor.body,
    timeout: monitor.timeout,
    redirects: monitor.redirects,
    bearerToken: monitor.bearerToken
  } as IMonitorDocument;
  startSingleJob(name, appTimeZone, monitor.frequency, async () => httpMonitor.start(httpMonitorData));
};
