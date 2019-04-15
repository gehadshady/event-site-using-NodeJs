let express=require("express"),
    path=require("path"),
    mongoose=require("mongoose"),
    //for dawnload imgs from forms

    multer=require("multer"),

    //use multer
     multerMW=multer({
        dest:"./publics/imgs"//دا خاص بال مالتر مش بالبروجكت 
    }),
    fs=require("fs");


let spaekerRouter=express.Router();
    


//اخليه يروح يعمل ينفذ الكود دا (مش محتاج اعمل فيه اكسبورت لأني مجرد بضيف موديول ف المونجوز)
require("../models/speakerModel");
require("../models/eventModel");

//get speaker model
let speakerModel=mongoose.model("speakers"),
    eventModel=mongoose.model("itiEvents");






spaekerRouter.get("/add",(request,response)=>{
    //response.send("adding")
    response.render("speakers/addspeaker",{name:request.session.userName})
})

//multerMW lazm ad5lha m3 elmakan eli fey load l img 7ta lw ktbtha use m3 server , 3ks el body-parser
spaekerRouter.post("/add",multerMW.single("speakerImg"),(request,response)=>{

    // fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname)); 

    let speaker=new speakerModel({
        _id:request.body.id,
        name:request.body.name,
        age:request.body.age
        //image:request.file.originalname
    })

    speaker.save((err,result)=>{
        response.redirect("/speakers/speakerList")
    });
})


spaekerRouter.get("/speakerList",(request,response)=>{
  
    speakerModel.find({},(err,result)=>{

        if(!err)
        {
            console.log(request.session)
            response.render("speakers/speakerList",{speakers:result,name: request.session.userName})
        }
    })

})


spaekerRouter.post("/edit/:id",multerMW.single("speakerImg"),(request,response)=>{
   
    speakerModel.update({_id:request.params.id},
        {"$set":{
            name:request.body.name,
            age:request.body.age,
            //image:request.file.originalname
        }},(err,result)=>
        {
            if(!err)
                response.redirect("/speakers/speakerList")
        })
})

spaekerRouter.get("/edit/:id",(request,response)=>{
  
    speakerModel.findOne({_id:request.params.id},(err,result)=>{

        if(!err)
        {
            
            response.render("speakers/editspeaker",{speaker:result})
            //console.log(result)
        }
    })
})


spaekerRouter.get("/Delete/:id",(request,response)=>{

    speakerModel.remove({_id:request.params.id},(err,result)=>
    {
        if(!err)
        {
            eventModel.remove({mainSpeaker:request.params.id},(err1,result1)=>{

                if(!err1)
                {
                    console.log("speaker reomved and his events")
                    response.send(result)

                    // response.redirect("/speakers/speakerList")
                }
                    
                else
                {
                    console.log(err.message)
                }
           })
        }
        else
        {
            console.log(err.message)
        }
      
    })

})


spaekerRouter.get("/profile",(request,response)=>{

    speakerModel.findOne({_id:request.query.id},(err,result)=>{

        if(!err)
        {
            eventModel.find({mainSpeaker:request.query.id},(err1,result1)=>{

                if(!err1)
                {
                    eventModel.find({otherSpeakers: { $in: [request.query.id]}},(err2,result2)=>{

                        if(!err2)
                        {
                            response.render("speakers/profile",{speaker:result,events:result1,secEvents:result2})
                        }
                    })
                }
                else
                {
                    console.log(err1.message)
                }
            })} 
        else
        {
            console.log(err.message)
        }
    })    
})

spaekerRouter.get("/editProfile/:id",(request,response)=>{
    speakerModel.findOne({_id:request.params.id},(err,result)=>{

        if(!err)
        {
            
            response.render("speakers/editProfile",{speaker:result})
            //console.log(result)
        }
        else
        {
            console.log(err.message)
        }
    })
})

spaekerRouter.post("/editProfile/:id",multerMW.single("speakerImg"),(request,response)=>{
   
    speakerModel.update({_id:request.params.id},
        {"$set":{
            name:request.body.name,
            age:request.body.age,
            password:request.body.password
            //image:request.file.originalname
        }},(err,result)=>
        {
            if(!err)
                response.redirect("/speakers/profile/?id="+request.params.id)
            
            else
                console.log(err.message)
        })
})


spaekerRouter.get("/rejectOther/:id/:speaker",(request,response)=>{

    eventModel.update(
        {_id:request.params.id},
        { $pull: { otherSpeakers: { $in: [request.params.speaker] }}},(err,rersult)=>{

            if(!err)
            {
                console.log(rersult)
                response.redirect("/speakers/profile/?id="+request.params.speaker)
            }
            else
            {
                console.log(err.message)
            }
        })
})


 spaekerRouter.get("/Details/:id",(request,response)=>{

    speakerModel.find({_id:request.params.id},(err,result)=>{

        if(!err)
        {
            console.log(result)
            response.send(result)
        }
    })
 })

 spaekerRouter.get("/reject/:id/:speaker",(request,response)=>{

    eventModel.remove({_id:request.params.id},(err,result)=>
    {
        if(!err)
            response.redirect("/speakers/profile/?id="+request.params.speaker)
    })
})

spaekerRouter.get("/accept/:id/:speaker",(request,response)=>{

    eventModel.update({_id:request.params.id},
        {"$set":{
            status:"accepted"
            

        }},(err,result)=>{

            if(!err)
            response.redirect("/speakers/profile/?id="+request.params.speaker)
        })
})
module.exports=spaekerRouter;
