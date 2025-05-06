//creating a custom router
express=require('express');
router=express.Router();
bcrypt=require('bcrypt');

const User=require('../models/user');

router.get('/', async function(req,res){
    res.redirect('/authentication/login');
});


router.get('/login', async function(req,res){

    ctx={
        title: 'FoodMart',
    }
    res.render('authentication/login',ctx);
});


router.get('/register', async function(req,res){
    
    ctx={
        title: 'FoodMart',
    }
    res.render('authentication/register',ctx);
});


router.get('/logout', async function(req,res){
    //destroy the session
    if (req.session.user){ //check if user logged in
        req.session.destroy();  
    }
    res.redirect('/');
    
});


router.post('/login', async function(req,res){
    //check if the user logged in
    if (req.session.user){ 
        res.redirect('/');
    }else{
        email=req.body.email;
        myPassword=req.body.password;
        
        //check if the user exists

        user=await User.findOne({email:email});

        //compare hashed password with real password

        if(user && bcrypt.compareSync(myPassword, user.password)){
           
            //update token
            tokenBase=email+myPassword+Date.now();
            token= bcrypt.hashSync(tokenBase, 10);
            user.token=token;
            await user.save();

            //create a session
             const {
                password,
                ...userWithoutPassword
            }=user._doc;

            req.session.user=userWithoutPassword;
            req.session.cart={};
            res.redirect('/');
        }else{
            //user not found or password is incorrect
            res.redirect('/authentication/login');
        }
    }

});


router.post('/register', async function(req,res){

    if (req.session.user){  //check if user logged in
        res.redirect('/');
    }else{
        email=req.body.email;
        myPassword=req.body.password;
        fullName=req.body.fullName;
        address=req.body.address;
        phoneNumber=req.body.phoneNumber;

        //check if the user already exists  
        user=await User.findOne({email:email});

        if(user){
            //user already exists
            res.redirect('/authentication/login');
        }

        //create an auth token
        hash= await bcrypt.hashSync(myPassword, 10);

        tokenBase=email+myPassword+Date.now();
        token= bcrypt.hashSync(tokenBase, 10);

        user_data={
            email:email,
            password:hash,
            fullName:fullName,
            address:address,
            phoneNumber:phoneNumber,
            token: token
        }
        new_user= new User(user_data);
        //save the user to the database
        await new_user.save();

        //create a session
        const {
            password,
            ...userWithoutPassword
        }=user_data;

        req.session.user=userWithoutPassword;
        req.session.cart={};
    
        //redirect to the home page
        res.redirect('/');
    }
});



module.exports=router;