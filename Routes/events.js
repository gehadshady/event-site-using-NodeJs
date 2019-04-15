let express=require("express"),
    path=require("path"),
    mongoose=require("mongoose");

    eventRouter=express.Router();


require("../models/speakerModel");
require("../models/eventModel");

let eventModel=mongoose.model("itiEvents"),
    speakerModel=mongoose.model("speakers");


eventRouter.get("/add",(req,res)=>{

    speakerModel.find({},(err,result)=>{
        if(!err)
        
            res.render("events/addEvent",{speakers:result})
    })
})


eventRouter.get("/edit/:id",(req,response)=>{

    eventModel.findOne({_id:req.params.id}).populate({path:"mainSpeaker otherSpeakers"}).then((result)=>{
        console.log(result);
        speakerModel.find({},(err,result2)=>{

            if(!err)
            {
                response.render("events/editEvent",{event:result,speakers:result2});
            }
        })
    }).catch((err)=>{})
})

eventRouter.post("/edit/:id",(request,response)=>{
    eventModel.update({_id:request.params.id},
        {"$set":{
            Title:request.body.title,
            mainSpeaker:request.body.mainSpeaker,
            otherSpeakers:request.body.otherSpeakers

        }},(err,result)=>{

            if(!err)
                response.redirect("/events/list")

        })
})

eventRouter.post("/add",(req,res)=>{

    let event=eventModel({
        _id:req.body.id,
        Title:req.body.title,
        mainSpeaker:req.body.mainSpeaker,
        otherSpeakers:req.body.otherSpeakers
    })

    event.save(()=>{
        res.redirect("/events/list")
    })
})

eventRouter.get("/list",(request,response)=>{

    eventModel.find({}).populate({path:"mainSpeaker otherSpeakers"}).then((result)=>{
        //console.log(result.mainSpeaker)
        response.render("events/eventList",{events:result});
    }).catch((err)=>{})

})


eventRouter.get("/Delete/:id",(request,response)=>{

    eventModel.deleteOne({_id:request.params.id},(err,result)=>
    {
        if(!err)
            //response.redirect("/events/list")
            response.send(result)
            console.log("event removed")
    })

})




module.exports=eventRouter;