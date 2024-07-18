import { buildSchema } from 'graphql';

export const notificationSchema = buildSchema(`#graphql
  input Notification {
    userId: Int!
    groupName: String!
    emails: String!
  }

  type NotificationResult {
    id: ID!
    userId: Int!
    groupName: String!
    emails: String!
  }

  type NotificationResponse {
    notifications: [NotificationResult!]
  }

  type DeleteNotificationResponse {
    id: ID!
  }

  type Query {
    getUserNotificationGroups(userId: String!): NotificationResponse!
  }

  type Mutation {
    createNotificationGroup(group: Notification!): NotificationResponse!
    updateNotificationGroup(notificationId: ID!, group: Notification!): NotificationResponse!
    deleteNotificationGroup(notificationId: ID!): DeleteNotificationResponse!
  }
`);
