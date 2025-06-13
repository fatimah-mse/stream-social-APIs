const pagination = (model, filter = {}, populate = '') => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = 10

            const total = await model.countDocuments(filter)
            const pages = Math.ceil(total / limit)

            const data = await model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate(populate)

            res.paginatedResults = {
                data,
                total,
                pages,
                current: page
            }

            next()
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

module.exports = {pagination}
