let express=require("express"),
    AdminRouter=express.Router();
    AdminRouter.get("/profile",(request,response)=>{

    response.render("Admin/profile")                              

    })



    module.exports=AdminRouter;