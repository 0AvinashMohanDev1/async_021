require("dotenv").config();
const {blacklist}=require("../blacklist")
const jwt=require("jsonwebtoken");

const authentication=async(req,res,next)=>{
    try {
        let normalToken=req.cookies.normalToken;
        if(blacklist.includes(normalToken))return res.send("please login again");
        jwt.verify(normalToken,process.env.normalToken,(err,decoded)=>{
            if(decoded){
                req.userId=decoded.userId;
                req.role=decoded.role;
                next();
            }else{
                let refreshToken=req.cookies.refreshToken;
                if(blacklist.includes(refreshToken))return res.send("please login again");
                jwt.verify(refreshToken,process.env.refreshToken,(err,decoded)=>{
                    if(decoded){
                        console.log({decoded,refresh:"refresh"})
                        normalToken=jwt.sign({userId:decoded.userId,role:decoded.role},process.env.normalToken,{expiresIn:60});
                        res.cookie('normalToken',normalToken);
                        req.userId=decoded.userId;
                        req.role=decoded.role;
                        next();
                    }
                    if(err){
                        res.send({"error":err.message});
                    }
                })
            }
        })        
    } catch (error) {
        res.send({"msg authn":error.message});
    }
}


module.exports={
    authentication
}