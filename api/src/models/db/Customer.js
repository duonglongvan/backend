// group.model.js
// This file defines the model class for the cfg_group table
const Sequelize = require('sequelize');
const db = require('../../utils/db');

// Define a model class for the cfg_group table
const CUSTOMER = db.define(
  'CUSTOMER',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    encrypted: {
        type: Sequelize.STRING(255),
        allowNull: false,
        default: null,
    },
    secretKey: {
        type:Sequelize.STRING(50),
        allowNull: false,
        default: null,
    },
    created_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: Date.now(),
    },
    updated_at: {
        type: Sequelize.INTEGER,
        default: null,
    },
    deleted_at: {
        type: Sequelize.INTEGER,
        default: null,
    },
  },
  {
    tableName: 'customer',
    timestamps: false,
  }
);

module.exports = CUSTOMER;