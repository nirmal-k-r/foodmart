//creating a custom router
express=require('express');
router=express.Router();
Order= require('../models/order');

//order route when someone clicks on order
router.get('/placeOrder', async function(req,res){
    if (req.session.user){ //check if user logged in
        cartTotal=0;
        for (itemId in req.session.cart){
            cartTotal+=(req.session.cart[itemId]['price']*req.session.cart[itemId]['qty']);
        }
        new_order={
            userId: req.session.user._id,
            cart: req.session.cart,
            totalAmount: cartTotal,
            orderDate: new Date(),
            status: 'Pending'
        }
        //save order to database
        order=new Order(new_order);
        await order.save();
        //clear cart
        req.session.cart={};
        //redirect to order confirmation page
        res.redirect('/orders');
    }else{
        res.redirect('/authentication/login');
    }
});

//orders page
//order route when someone clicks on order
router.get('/', async function(req,res){
    if (req.session.user){ 
        //get all orders for the user
        orders=await Order.find({userId: req.session.user._id});
        ctx={
            title: 'FoodMart',
            user: req.session.user,
            orders: orders
        }
        res.render('order/orders',ctx);
       
    }else{
        res.redirect('/authentication/login');
    }
});

module.exports=router;