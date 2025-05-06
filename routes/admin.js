//creating a custom router
express=require('express');
router=express.Router();

//import models
const Product = require('../models/product');


router.get('/', async function(req,res){
    if (!req.session.user){ //check if user logged in
        res.redirect('/authentication/login');
    }else{
        if (req.session.user.role!='admin'){ //check if user is admin
            res.redirect('/');
        }
        products=await Product.find({}); //retrieve all products from database
        ctx={
            title: 'FoodMart',
            products:products,
            user: req.session.user,
        }
    
        res.render('admin/adminHome',ctx);
    }
   
});

router.post('/create-product', async function(req,res){
    name=req.body.name;
    description=req.body.description;
    price=req.body.price;
    stock=req.body.stock;
    category=req.body.category;
    imageUrl=req.body.imageUrl;

    new_product= new Product({
        name:name,
        description:description,
        price:price,
        stock:stock,
        category:category,
        imageUrl:imageUrl
    });

    //save the product to the database
    await new_product.save();
    res.redirect('/admin');

    // console.log(`Product Created: ${name}, ${description}, ${price}, ${stock}, ${category}, ${imageUrl}`);
});

router.get('/delete-product/:id', async function(req,res){
    id=req.params.id;
    //delete the product from the database
    await Product.findByIdAndDelete({_id: id});
    res.redirect('/admin');
});

router.get('/update-product/:id', async function(req,res){
    id=req.params.id;
    product=await Product.findOne({_id: id});
    ctx={
        title: 'FoodMart',
        product:product,
    }
    res.render('admin/update',ctx);

});

router.post('/update-product/:id', async function(req,res){
    id=req.params.id;
    data={
        id:req.params.id,
        name:req.body.name,
        description:req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        imageUrl: req.body.imageUrl
    }

    await Product.findByIdAndUpdate(id,data);
    res.redirect('/admin');

});

module.exports=router;