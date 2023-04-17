const mongoose=require("mongoose");


const blogSchema=mongoose.Schema({
    topic:String,
    userId:String
})

const BlogModel=mongoose.model("evaluvationTestBlog",blogSchema);

module.exports={
    BlogModel
}