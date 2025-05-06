const mongoose= require('mongoose');

//create our connection string
const connectionString="mongodb+srv://admin:12345@shop.e9p31.mongodb.net/foodmart?retryWrites=true&w=majority&appName=shop"

//connect database
mongoose.connect(connectionString,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>{ //if connection successful
        console.log("Connected to MongoDb")
    })
    .catch((err)=>{ //if error
        console.log("Error connecting to MongoDB",err)
    });


//export the connection
module.exports=mongoose;
