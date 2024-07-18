import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { sequelize } from '@app/server/database';

type MonitorAttributes = Optional<IMonitorDocument, 'id'>;

const MonitorModel: ModelDefined<IMonitorDocument, MonitorAttributes> = sequelize.define(
  'monitors',
  {
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    alertThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    url: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastChanged: {
      type: DataTypes.DATE,
      allowNull: true
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    uptime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    redirects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    method: {
      type: DataTypes.STRING
    },
    headers: {
      type: DataTypes.TEXT
    },
    body: {
      type: DataTypes.TEXT
    },
    httpAuthMethod: {
      type: DataTypes.TEXT
    },
    basicAuthUser: {
      type: DataTypes.TEXT
    },
    basicAuthPass: {
      type: DataTypes.TEXT
    },
    bearerToken: {
      type: DataTypes.TEXT
    },
    contentType: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statusCode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    responseTime: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    connection: {
      type: DataTypes.TEXT
    },
    port: {
      type: DataTypes.INTEGER
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['userId']
      }
    ]
  }
) as ModelDefined<IMonitorDocument, MonitorAttributes>;

export { MonitorModel };
