import { IHeartbeat, IHeartBeatArgs } from '@app/interfaces/heartbeat.interface';
import { AppContext } from '@app/interfaces/monitor.interface';
import { getHeartbeats } from '@app/services/monitor.service';
import { authenticateGraphQLRoute } from '@app/utils/utils';

export const HeartbeatResolver = {
  Query: {
    async getHeartbeats(_: undefined, args: IHeartBeatArgs, contextValue: AppContext) {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);
      const { type, monitorId, duration } = args;
      const heartbeats: IHeartbeat[] = await getHeartbeats(type, parseInt(monitorId), parseInt(duration));
      return {
        heartbeats
      };
    }
  },
  HeartBeat: {
    timestamp: (heartbeat: IHeartbeat) => JSON.stringify(heartbeat.timestamp)
  }
};
