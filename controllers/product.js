const Product = require('../models/product');

//define controller functions
module.exports.searchProduct=async function (req, res) {
    //get query params
    const keywords = req.query.keywords;
    // const products = await Product.find({ name: new RegExp(, 'i') });
        
    // select *
    // where name Like '%keywords%'

    //like in mongoose
    const products = await Product.find({ name: { $regex: keywords, $options: 'i' } });


    //return jsonresponse
    res.json({
        status: 'success',
        data: products
    });
}

