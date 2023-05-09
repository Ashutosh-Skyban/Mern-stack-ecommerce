class Apifeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',
            },
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }

    filter() {
        const queryCopy = { ...this.queryStr }

        // Removing some field for  Category
        const removeFields = ["keyword", "page", "limit"]
        removeFields.forEach(key => delete queryCopy[key])
        // filter for price and rating
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        // this.query = this.query.find(queryCopy)
        return this;
    }

    pagination(resultperPage) {
        const currentpage = Number(this.queryStr.page) || 1
        const skip = resultperPage * (currentpage - 1);
        this.query = this.query.limit(resultperPage).skip(skip)
        return this;
    }
};
export default Apifeatures;