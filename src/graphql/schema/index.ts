import { mergeTypeDefs } from '@graphql-tools/merge';

import { userSchema } from './user';
import { notificationSchema } from './notification';
import { monitorSchema } from './monitor';
import { heartbeatSchema } from './heartbeats';
import { sslMonitorSchema } from './ssl';

export const mergedGQLSchema = mergeTypeDefs([
    userSchema,
    notificationSchema,
    monitorSchema,
    heartbeatSchema,
    sslMonitorSchema
]);
