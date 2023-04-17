const express=require("express");
const {connection}=require("./config/db");
const cookie=require("cookie-parser");
const {User}=require("./Routes/user_route")
const {Blog}=require("./Routes/blog_route")
const app=express();
app.use(express.json());
app.use(cookie());
app.use("",User);
app.use("",Blog);


app.listen(4100,async()=>{
    try {
        await connection;
        console.log("connected to 4100");
    } catch (error) {
        console.log(error.message);
    }
})