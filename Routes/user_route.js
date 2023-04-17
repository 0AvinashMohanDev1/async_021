const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const {UserModel}=require("../models/user_model");
const { waitForDebugger } = require("inspector");
const User=express.Router();
const {authentication}=require("../middleware/authentication");
const {blacklist}=require("../blacklist");
const {auth}=require("../middleware/auth")


User.get("/",(req,res)=>{
    try {
        res.send("User page");
    } catch (error) {
        res.send(error.message);
    }
})

User.post("/signup",async(req,res)=>{
    try {
        let body=req.body;
        let isPresent=await UserModel.findOne({email:body.email});
        if(isPresent)return res.send("user already registerd");
        bcrypt.hash(body.password,5,async(err,hashed)=>{
            if(hashed){
                body.password=hashed;
                let user=new UserModel(body);
                await user.save();
                res.send("user registered");
            }
        })
    } catch (error) {
        res.send({"error":error.message});
    }
})

User.post("/login",async(req,res)=>{
    try {
        let body=req.body;
        let isPresent=await UserModel.findOne({email:body.email});
        if(!isPresent)return res.send("please signup first");
        bcrypt.compare(body.password,isPresent.password,(err,decoded)=>{
            if(decoded){
                // console.log(decoded.userId,isPresent);
                let normalToken=jwt.sign({userId:isPresent._id,role:isPresent.role},process.env.normalToken,{expiresIn:60});
                let refreshToken=jwt.sign({userId:isPresent._id,role:isPresent.role},process.env.refreshToken,{expiresIn:180});
                res.cookie("normalToken",normalToken,{maxAge:2000*60});
                res.cookie("refreshToken",refreshToken,{maxAge:4000*60});
                // console.log(req.cookies);
                res.send({cookie:"cookie set",msg:"logged in"});
            }
            if(err){
                res.send({"error":err.message})
            }
        })
    } catch (error) {
        res.send({"error":error.message});
    }
})


User.get("/all",authentication,auth(['User']),async(req,res)=>{
    try {
        console.log(req.cookies);
        let user=await UserModel.find();
        res.send(user);
    } catch (error) {
        res.send(error.message);
    }
})

User.get("/logout",async(req,res)=>{
    try {
        let normalToken=req.cookies.normalToken;
        let refreshToken=req.cookies.refreshToken;
        await blacklist.push(normalToken,refreshToken);
        res.send({"msg":"logged out"})
    } catch (error) {
        res.send({"error":error.message})
    }
})

module.exports={
    User
}

