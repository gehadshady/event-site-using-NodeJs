let express=require("express"),
    morgan=require("morgan"),
    path=require("path"),
    AuthRouter=require("./Routes/Authentications"),
    AdminRouter=require("./Routes/Admin"),
    spaekerRouter=require("./Routes/speakers"),
    eventRouter=require("./Routes/events"),

    body_parser=require("body-parser").urlencoded(),
    express_session=require("express-session"),
    connect_flash=require("connect-flash"),
    cookie_parser=require("cookie-parser"),
    mongoose=require("mongoose");



    require("./models/eventModel");
    let eventModel=mongoose.model("itiEvents");

//1-create server
let app=express();

//db connection
mongoose.connect("mongodb://localhost:27017/eventsDB");


//2-listen
app.listen(8080,()=>{
    console.log("I'm listining")
})

//3- middlewares
//a-frist mw
// app.use((Request,Response,next)=>{
//   //  Response.send("frist mw");
//     console.log(Request.url,Request.method);
//     next();
// })
//using morgan package instaed
app.use(morgan("dev"))

//send static files (ims,css,js)
app.use(express.static(path.join(__dirname,"node_modules")))

app.use(express.static(path.join(__dirname,"publics")))

//use data inside the body of http (post method)
app.use(body_parser);

//use express session
app.use(express_session({
    secret:"gehad",//increption key
    //session id saved as coockie by express session package , there are meny ones if we don't do this
    //expiers:datatimeobj , or >>
    //cookie:{maxAge:...}

}));
//use flash , must be after session
app.use(connect_flash());

//use cookie_parser
app.use(cookie_parser())



//use eje engine
app.set("view engine","ejs")
//بقول لل ثتس ان بدايته عند فولدر ال views
app.set("views",path.join(__dirname,"views"))

 
//b- second mw

app.use((Request,Response,next)=>{
    let min=(new Date()).getMinutes();
   // if(min>20)
    {
        //Response.send("Authorized")
        console.log("Authorized")
        next()
    }
    //else
    //Response.send("NOT Authorized")
    //next(new Error("NOT Authorized"))

})

//c- third mw
// app.use((Request,Response)=>{

//     Response.send("offer page ..")

// })

//error mw
//لازم اكتب ال4 برامعشان يفهم
app.use((err,Request,Response,next)=>{
    Response.send(`Error >> ${err.message}`)
})


/**********Routing*************/

app.use("/home",(Request,Response)=>{
   
    eventModel.find({Date:`${(new Date()).getFullYear()}/${(new Date()).getMonth()}/${(new Date()).getDate()}`})
    .populate({path:"mainSpeaker otherSpeakers"})
    .then((result)=>
    {
        Response.render("home",{todayEvents:result});
    }
    ).catch((err)=>
    {
        console.log(err.message)
    }) 
})//app.use


//rest of routs
app.use("/auth",AuthRouter);



//عشان محدش يقدر ينسخ اللينك ويفته من اي مكان
app.use((request,response,next)=>{
    
    if(request.session.userName&&request.session.userPass)
    {
        response.locals.name=request.session.userName;
        
        next();
    }
    else
    {
        request.flash("msg","session is dead");
        
        response.redirect("/home")
    }
});

app.use("/speakers",spaekerRouter);

app.use((request,response,next)=>{
    
    if(request.session.admin||request.session.speaker)
    {
        next();
    }
    else
    {
        request.flash("msg","Admin session is dead");
        
        response.redirect("/Auth/login")
    }
});

app.use("/Admin",AdminRouter);
app.use("/events",eventRouter);