const Sequelize = require('sequelize');

/**
 * Convert filter to options query
 * @param {Object} filter
 * @returns {Object}
 */
const convertFilter = (filter) => {
  const whereConditions = {};

  const filterKeys = Object.keys(filter);

  filterKeys.forEach((key) => {
    const value = filter[key];
    // Kiểm tra kiểu dữ liệu và thêm điều kiện tương ứng
    if (value !== undefined && value !== null) {
      if (typeof value === 'string') {
        whereConditions[key] = { [Sequelize.Op.like]: `%${value}%` };
      } else if (Array.isArray(value) && value.length > 0) {
        whereConditions[key] = { [Sequelize.Op.in]: value };
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        whereConditions[key] = value;
      }
    }
  });

  return whereConditions;
};

module.exports = convertFilter;
