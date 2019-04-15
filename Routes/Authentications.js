let express=require("express"),
    AuthRouter=express.Router(),
    mongoose=require("mongoose");


//to hashing password
const bcrypt = require('bcrypt');
const saltRounds = 10;



require("../models/speakerModel");
let speakerModel=mongoose.model("speakers");


   // body_parser=require("body-parser").urlencoded(),
   //خنشيله من هنا ونحطه ع مستوي ال سيرفير عشان مكررش الكود
    path=require("path");

AuthRouter.get("/login/:id?",(request,response)=>{


    ////before install ejs engine
    //response.sendFile(path
         //.join(__dirname,"..","views","Auth","login.html"))
    ////after install ejs engine
    response.render("Auth/login",{msg:request.flash("msg"),name:""})

        //console.log(path
            //.join(__dirname,"..","views","Auth","login.html"))
            
})

AuthRouter.post("/login",(request,response)=>{

   
    if(request.body.userName=='gehad'&&request.body.userPass=='123')
    {
        //console.log(request.body)
        //response.send("profile")
       // response.redirect("/auth/profile")
       request.session.userName=request.body.userName;
       request.session.userPass=request.body.userPass;
       request.session.admin=true;

     
      // response.locals.name=request.session.userName;
     //معرفش اعمل كدا لما يكون عندي ريديركت عشان بيكون ريسبونس جديد اصلا ف لوكالس بتروح 
       

        if(request.cookies.count)
        {
            console.log(request.cookies.count)

            let count=Number(request.cookies.count)+1

            response.cookie("count",count)
            console.log(request.cookies.count)
        }
        else
        {
            response.cookie("count",2);
            console.log("frist login .....")
        }

       response.redirect("/Admin/profile")
    }
    
    else
    {
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(request.body.userPass, salt);
        speakerModel.findOne({name:request.body.userName},(err,result)=>{
            if(!err)
            {
                console.log(result)
                if(result!=null)
                {
                    if(bcrypt.compareSync(request.body.userPass,result.password))  
                    {
                        request.session.userName=request.body.userName;
                        request.session.userPass=request.body.userPass;
                        request.session.speaker=true;

                        response.redirect("/speakers/profile/?id="+result._id)
                    }
                    else
                    {
                        
                        request.flash("msg","invalid username or password");
                        response.redirect("/auth/login/")
                    }
                }
            }
        })

        //bcrypt.compareSync(myPlaintextPassword, hash)
        // console.log(bcrypt.compareSync("123", "$2b$10$hvATTBYYx2bEPQm.WClD2eJ5acaIuOmeakba7fuvtKnqNNYojlVu6"));
        // speakerModel.findOne({name:request.body.userName,password:request.body.userPass},(err,result)=>{
        //     if(!err)
        //     {   
        //         if(result!=null)
        //         {
        //             request.session.userName=request.body.userName;
        //             request.session.userPass=request.body.userPass;
        //             response.redirect("/speakers/profile/?id="+result._id)
        //         }

        //         else
        //         {
                    
        //             request.flash("msg","invalid username or password");
        //             response.redirect("/auth/login/")
        //         }
                
        //     }
        //     else
        //     {
        //         console.log(err.message)
                
        //     }
        // })
    }
    //console.log(request.body);
})

// AuthRouter.get("/register",(request,response)=>{
//     //response.send("register get")
//     response.render("Auth/register",{name:""})

// })

// AuthRouter.post("/register",(request,response)=>{
//     if(request.body.userPass==request.body.userConfermPass)
//     {

//         let speaker=new speakerModel({
//             _id:request.body.id,
//             name:request.body.userName,
//             password:request.body.userPass
            
//         })
    
//         speaker.save((err,result)=>{
//             response.render("speakers/profile",{name:request.body.userName})
//         });
//         //  response.send(`${request.body.userName} ${request.body.userAge} ${request.body.userPass}`)
//     }
//     else
//     {
//         response.redirect("/auth/register")

//     }
   
// })

AuthRouter.get("/logout",(request,response)=>{
    request.session.destroy(()=>{
        response.redirect("/home")
    })
    
})
// AuthRouter.get("/profile",(request,response)=>{

//     // response.sendFile(path
//     //     .join(__dirname,"..","views","profile.html"))


//     ////send data with render
//     //1- send obj with response.render()
//     //let name="gehad";//supose this came from db
//     //response.render("profile",{userName:name})

//     //2-use :
//     response.locals.names=["eman","ali"]
//     response.render("Admin/profile")                              
// })



AuthRouter.get("/register",(request,response)=>{
    //response.send("register get")
    response.render("Auth/register",{name:""})

})

AuthRouter.post("/register",(request,response)=>{
    // if(request.body.userPass==request.body.userConfermPass)
    // {
        request.session.userName=request.body.userName;
        request.session.userPass=request.body.userPass;
        request.session.speaker=true;

        var salt = bcrypt.genSaltSync(saltRounds);
        var hashPass = bcrypt.hashSync(request.body.userPass, salt);

        
        let speaker=new speakerModel({
            _id:request.body.id,
            name:request.body.userName,
            age:request.body.userAge,
            password:hashPass
        })
    
        speaker.save((err,result)=>{
            if(!err)
                response.redirect("/speakers/profile/?id="+request.body.id)
            else
                console.log(err.message);
        });
        //  response.send(`${request.body.userName} ${request.body.userAge} ${request.body.userPass}`)
    // }
    // else
    // {
    //     response.redirect("/auth/register")
    // } 
})


module.exports=AuthRouter;