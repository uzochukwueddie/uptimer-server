import express, { Express } from 'express';

import MonitorServer from './server/server';
import { databaseConnection } from './server/database';

const initializeApp = (): void => {
  const app: Express = express();
  const monitorServer = new MonitorServer(app);
  databaseConnection().then(() => {
    monitorServer.start();
  });
};

initializeApp();
