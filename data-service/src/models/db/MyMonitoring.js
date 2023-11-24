// group.model.js
// This file defines the model class for the cfg_group table
const Sequelize = require('sequelize');
const db = require('../../utils/db');

// Define a model class for the cfg_group table
const MYMONITORING = db.define(
  'MYMONITORING',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    cus_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
        default: 1,
    },
    created_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: Date.now(),
    }
  },
  {
    tableName: 'my_monitoring',
    timestamps: false,
  }
);

module.exports = MYMONITORING;