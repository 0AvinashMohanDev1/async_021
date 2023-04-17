

function auth(permitted){
    return async(req,res,next)=>{
        try {
            let role=req.role;
            if(permitted.includes(role)){
                next();
            }else{
                res.send("unauthorised");
            }
        } catch (error) {
            res.rend({"error":error.message})
        }
    }
}

module.exports={
    auth
}