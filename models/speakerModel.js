let mongoose=require("mongoose");

let speakerModel = new mongoose.Schema({
    _id:Number,
    name:String,
    age:{
        type:Number,
        min:20,
        max:50
    },
    image:String,
    password:String,
    
})

//maping

                //collection //schema
mongoose.model("speakers",speakerModel);

