// group.model.js
// This file defines the model class for the cfg_group table
const Sequelize = require('sequelize');
const db = require('../../utils/db');
const CUSTOMER = require('./Customer');

// Define a model class for the cfg_group table
const ParsingRule = db.define(
  'ParsingRule',
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
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    customer_id: {
        type: Sequelize.INTEGER,
        references: {
            model: CUSTOMER,
            key: 'id',
          },
    },
    created_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: Date.now(),
    },
    updated_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: null,
    },
    deleted_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: null,
    },
  },
  {
    tableName: 'parsing_rule',
    timestamps: false,
  }
);

module.exports = ParsingRule;