import { buildSchema } from 'graphql';

export const sslMonitorSchema = buildSchema(`#graphql
  input SSLMonitor {
    id: Int
    name: String!
    userId: Int!
    active: Boolean
    status: Int
    frequency: Int!
    url: String!
    info: String
    alertThreshold: Int!
    notificationId: Int!
  }

  type NotificationResult {
    id: ID!
    userId: Int!
    groupName: String!
    emails: String!
  }

  type SSLMonitorResult {
    id: Int
    name: String!
    userId: Int!
    active: Boolean
    status: Int
    frequency: Int!
    url: String!
    info: String
    reason: String
    alertThreshold: Int!
    notificationId: Int!
    notifications: NotificationResult
  }

  input ToggleSSLMonitor {
    monitorId: Int!
    userId: Int!
    name: String!
    active: Boolean!
  }

  type SSLMonitorResponse {
    userId: Int
    sslMonitors: [SSLMonitorResult!]
  }

  type DeleteSSLMonitorResponse {
    id: Int!
  }

  type Query {
    getSingleSSLMonitor(monitorId: String!): SSLMonitorResponse
    getUserSSLMonitors(userId: String!): SSLMonitorResponse
  }

  type Mutation {
    createSSLMonitor(monitor: SSLMonitor!): SSLMonitorResponse
    toggleSSLMonitor(monitor: ToggleSSLMonitor!): SSLMonitorResponse
    updateSSLMonitor(monitorId: Int!, userId: Int!, monitor: SSLMonitor!): SSLMonitorResponse
    deleteSSLMonitor(monitorId: Int!, userId: Int!): DeleteSSLMonitorResponse
  }
`);
