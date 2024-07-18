import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { RedisModel } from '@app/models/redis.model';
import { redisMonitor } from '@app/monitors/redis.monitor';
import { startSingleJob } from '@app/utils/jobs';
import { appTimeZone } from '@app/utils/utils';
import dayjs from 'dayjs';
import { Model, Op } from 'sequelize';

export const createRedisHeartBeat = async (data: IHeartbeat): Promise<IHeartbeat> => {
  try {
    const result: Model = await RedisModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getRedisHeartBeatsByDuration = async (monitorId: number, duration = 24): Promise<IHeartbeat[]> => {
  try {
    const dateTime: Date = (dayjs.utc()).toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats: IHeartbeat[] = await RedisModel.findAll({
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

export const redisStatusMonitor = (monitor: IMonitorDocument, name: string): void => {
  const redisMonitorData: IMonitorDocument = {
    monitorId: monitor.id,
    url: monitor.url
  } as IMonitorDocument;
  startSingleJob(name, appTimeZone, monitor.frequency, async () => redisMonitor.start(redisMonitorData));
};
