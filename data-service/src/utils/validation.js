const { Operator, Rule, Action } = require('../models');

const validateRule = (rule) => {
  if (rule.origin) {
    if (rule.origin !== 0 && rule.origin !== 1) {
      throw new Error('Origin only value 0 or 1');
    }
  }
};

const validateFilter = (filter, conditions) => {
  const validUnits = ['HOUR', 'LENGTH', 'MINUTE', 'SECOND'];
  if (filter.unit) {
    if (!validUnits.includes(filter.unit)) {
      throw new Error(`Unit only accepts values ${validUnits.join(', ')}`);
    }
  }
  if (!filter.formula) {
    throw new Error('Formula cannot be empty');
  }
  // if (!filter.size) {
  //   throw new Error('Size cannot be empty');
  // }
  if (!conditions || conditions.length === 0) {
    throw new Error('Conditions cannot be empty');
  }
};

const validateFilterV2 = async (filter, conditions) => {
  validateFilter(filter, conditions);
  const { bBName, ruleId } = filter;
  if (bBName) {
    return true;
  }
  if (ruleId) {
    const existingRule = await Rule.findOne({ where: { id: ruleId } });
    if (!existingRule) {
      throw new Error('Rule not exist');
    }
  } else {
    throw new Error('RuleId cannot be empty');
  }
};

const validateCondition = async (condition) => {
  if (condition.operatorId) {
    const existingCondition = await Operator.findOne({ where: { id: condition.operatorId } });

    if (existingCondition) {
      return true;
    }
    throw new Error('Operator not exist');
  }
  throw new Error('Operator cannot be empty');
};

const validateRuleAction = async (ruleAction) => {
  if (ruleAction.actionId) {
    const existingAction = await Action.findOne({ where: { id: ruleAction.actionId } });

    if (existingAction) {
      return true;
    }
    throw new Error('Action not exist');
  }
  throw new Error('ActionId cannot be empty');
};

module.exports = { validateRule, validateFilter, validateFilterV2, validateCondition, validateRuleAction };
