export interface IHeartbeat {
  id?: number;
  monitorId: number;
  status: number;
  code: number;
  message: string;
  timestamp: number;
  reqHeaders?: string;
  resHeaders?: string;
  reqBody?: string;
  resBody?: string;
  responseTime: number;
  connection?: string;
}

export interface IHeartBeatArgs {
  type: string;
  monitorId: string;
  duration: string;
}
