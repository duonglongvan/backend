const RuleModel = require("../models/db/Rule");
class JSearchService {
    async get(id,user) {
        const data = await RuleModel.findOne({
            where: {
                id: id,
            },
        });
        return data;
    }
    /**
     * 
     * @returns 
     */
    async gets(req) {
        let { limit, offset, filter } = req.body ? req.body : req.query;
        const options = {};
        if (filter && Object.keys(filter).length > 0) {
            options.where = convertFilter(filter);
        }
        if (limit) {
            // Use limit and offset clauses to paginate the results
            options.limit = limit;
        } if (offset) {
            options.offset = offset;
        }
        const data = await RuleModel.findAll(options);
        return data;
    }
    /**
     * 
     * @param {*} name 
     * @param {*} user 
     * @returns 
     */
    async create(name, user) {
        const checkDuplicate = await RuleModel.findAll({
            where: {
                name: name,
            },
        });
        logger.info(checkDuplicate);
        if (checkDuplicate) {
            JError.setDuplicate("name");
        }
        return await RuleModel.create({ name: name, customer_id: user.id });
    }
    /**
     * 
     * @param {*} id 
     * @param {*} name 
     * @param {*} user 
     * @returns 
     */
    async update(id, name, user) {
        const model = await RuleModel.findByPk(id);
        if (model) {
            const data = { name: name };
            await model.update(data);
            return model;
        }
        return false;
    }

    async delete(id, user) {
        const model = await RuleModel.findByPk(id);
        if (model) {
            model.deleted_at = Date.now();
            await model.update(data);
            return model;
        }
        return false;
    }
}
module.exports = new JSearchService();