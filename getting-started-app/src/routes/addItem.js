const db = require('../persistence');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
    const items = Array.isArray(req.body)
        ? req.body.map(item => ({
            id: uuid(),
            name: item.name,
            completed: false
        }))
        : [{
            id: uuid(),
            name: req.body.name,
            completed: false
        }];

    for (const item of items) {
        await db.storeItem(item);
    }

    res.send(items);
};
