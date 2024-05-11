const mongoose= require("mongoose");

const user= new mongoose.Schema({
    _id:String,
    password: {
        type: String,
        require:true, 
        
    }


});
module.exports= mongoose.model("user", user);
