const mongoose=require("mongoose");


const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,default:"User"}
})

const UserModel=mongoose.model("evaluvationTest",userSchema);

module.exports={
    UserModel
}