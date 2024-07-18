import logger from '@app/server/logger';
import { Cron, scheduledJobs } from 'croner';
import { toLower } from 'lodash';

interface IJob {
  name: string;
  type: number;
  interval: string;
}

type CallbackFunction = () => void;

const jobs: IJob[] = [
  {
    name: 'Every 10 seconds',
    type: 10,
    interval: '*/10 * * * * *'
  },
  {
    name: 'Every 30 seconds',
    type: 30,
    interval: '*/30 * * * * *'
  },
  {
    name: 'Every 1 minute',
    type: 60,
    interval: '* */1 * * *'
  },
  {
    name: 'Every 5 minutes',
    type: 300,
    interval: '*/5 * * * *',
  },
  {
    name: 'Every 15 minutes',
    type: 900,
    interval: '*/15 * * * *'
  },
  {
    name: 'Every 30 minutes',
    type: 1800,
    interval: '*/15 * * * *'
  },
  {
    name: 'Every 1 hour',
    type: 3600,
    interval: '0 * * * *'
  },
  {
    name: 'Every 24 hours',
    type: 86400,
    interval: '0 0 * * *'
  },
  {
    name: 'Every 5 days',
    type: 432000,
    interval: '0 0 */5 * *'
  },
  {
    name: 'Every 7 days',
    type: 604800,
    interval: '0 0 */7 * *'
  },
  {
    name: 'Every 15 days',
    type: 1.296e+6,
    interval: '0 0 */15 * *'
  },
  {
    name: 'Every 30 days',
    type: 2.592e+6,
    interval: '0 0 */30 * *'
  },
];

/**
 * Initialize single background job
 * @param name
 * @param timezone
 * @param type
 * @param jobFunc
 */
export const startSingleJob = (name: string, timezone: string, type: number, jobFunc: CallbackFunction): void => {
  const scheduled: Cron | undefined = scheduledJobs.find(job => toLower(job.name) === toLower(name));
  if (!scheduled) {
    const job: IJob = jobs.find((data) => data.type === type) as IJob;
    Cron(
      job.interval,
      {
        name,
        timezone
      },
      jobFunc
    );
  }
};

/**
 * Stop single background job
 * @param name
 * @param monitorId
 */
export const stopSingleBackgroundJob = (name: string, monitorId?: number): void => {
  const scheduled: Cron | undefined = scheduledJobs.find(job => toLower(job.name) === toLower(name));
  if (scheduled) {
    scheduled.stop();
    if (monitorId) {
      logger.info(`Stopped cron job for monitor with ID ${monitorId} and name ${name}`);
    } else {
      logger.info(`Stopped cron job for ${name}`);
    }
  }
};
