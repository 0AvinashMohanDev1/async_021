const express=require("express");
const {authentication}=require("../middleware/authentication");
const {auth}=require("../middleware/auth");
const {BlogModel}=require("../models/blog_model")
const Blog=express.Router();

// authentication,auth(['User','moderator']),
Blog.post("/createblog",authentication,auth(['User','Moderator']),async(req,res)=>{
    try {
        data=req.body
        data.userId=req.userId;
        let blog=new BlogModel(data);
        await blog.save();
        res.send("blog created");
    } catch (error) {
        res.send({"error":error.message});
    }
})

Blog.get("/userBlog/:id",authentication,auth(['Moderator','User']),async(req,res)=>{
    try {
        let id=req.params.id;
        let blogs=await BlogModel.findById(id);
        res.send(blogs);
    } catch (error) {
        res.send(error.message);
    }
})

Blog.put("/userBlog/:id",authentication,auth(['Moderator','User']),async(req,res)=>{
    try {
        let id=req.params.id;
        let data=req.body;
        let blogs=await BlogModel.findByIdAndUpdate(id,data);
        res.send({msg:"blog updated"});
    } catch (error) {
        res.send(error.message);
    }
})

Blog.delete("/userBlog/:id",authentication,auth(['Moderator','User']),async(req,res)=>{
    try {
        let id=req.params.id;
        let blogs=await BlogModel.findByIdAndDelete(id);
        res.send("blogs deleted");
    } catch (error) {
        res.send(error.message);
    }
})

Blog.delete("/admin/:id",authentication,auth(['Moderator']),async(req,res)=>{
    try {
        let id=req.params.id;
        await BlogModel.findByIdAndDelete(id);
        res.send("blog deleted by admin");
    } catch (error) {
        res.send({"error":error.message})
    }
})

Blog.get("/getblog",authentication,auth(['Moderator','User']),async(req,res)=>{
    try {
        let blogs=await BlogModel.find();
        res.send(blogs);
    } catch (error) {
        res.send(error.message)
    }
})

module.exports={
    Blog
}