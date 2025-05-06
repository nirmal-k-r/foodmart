//creating a custom router
express=require('express');
router=express.Router();
const Product = require('../models/product');
const axios = require('axios');

//import product controller
const productController = require('../controllers/product');


router.get('/', async function(req,res){
    if (req.session.user){ //check if user logged in
        products=await Product.find({});
        ctx={
            title: 'FoodMart',
            user: req.session.user,
            products: products
        }

        res.render('product/home',ctx);
    }else{
        res.redirect('/authentication/login');
    }
});

router.post('/searchResults', async function(req,res){
    if (req.session.user){ //check if user logged in
        //send http request to api http://localhost:3000/search?keywords=
        
        //get query params
        const keywords = req.body.keywords;
        
        products=await axios.get('http://localhost:3000/search?keywords='+keywords);

        //get data from response
        products=products.data.data;
            
        ctx={
            title: 'FoodMart',
            user: req.session.user,
            products: products
        }

        res.render('product/searchPage',ctx);
    }else{
        res.redirect('/authentication/login');
    }
});


router.get('/cart', async function(req,res){
    if (req.session.user){ //check if user logged in
        //calculate cart total
        cartTotal=0;
        for (itemId in req.session.cart){
            cartTotal+=(req.session.cart[itemId]['price']*req.session.cart[itemId]['qty']);
        }

        ctx={
            title: 'FoodMart',
            user: req.session.user,
            cart: req.session.cart,
            cartTotal: cartTotal,
        }

        res.render('product/cart',ctx);
    }else{
        res.redirect('/authentication/login');
    }
});

router.get('/cart/add/:id', async function(req,res){
    if (req.session.user){ //check if user logged in
        //add to cart logic
        id=req.params.id;
        product=await Product.findById({_id: id});
        
        //check if the product is already in the cart
        if (id in req.session.cart){
            req.session.cart[id]['qty']+=1;
        }else{
            req.session.cart[id]={
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                qty: 1
            }   
        }
        res.redirect('/cart');
    }else{
        res.redirect('/authentication/login');
    }
});

router.get('/cart/delete/:id', async function(req,res){
    if (req.session.user){
        id=req.params.id;

        if (id in req.session.cart){
            delete req.session.cart[id];
        }

        res.redirect('/cart');
    }else{
        res.redirect('/authentication/login');
    }
});

router.get('/about', async function(req,res){
    ctx={
        title: 'FoodMart'
    }
    res.render('product/about',ctx);
});


//connect search controller to route
router.get('/search', productController.searchProduct);

module.exports=router;