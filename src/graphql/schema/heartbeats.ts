import { buildSchema } from 'graphql';

export const heartbeatSchema = buildSchema(`#graphql
  type HeartBeat {
    id: ID
    monitorId: Int
    status: Int
    code: Int
    message: String
    timestamp: String
    reqHeaders: String
    resHeaders: String
    reqBody: String
    resBody: String
    responseTime: Int
    connection: String
  }

  type HeartBeatResult {
    heartbeats: [HeartBeat!]!
  }

  type Query {
    getHeartbeats(type: String!, monitorId: String!, duration: String!): HeartBeatResult
  }
`);
