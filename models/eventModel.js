let mongoose=require("mongoose");
// autoIncrement = require('mongoose-auto-increment');
 
// var connection = mongoose.createConnection("mongodb://localhost/myDatabase");
 
// autoIncrement.initialize("mongodb://localhost:27017/eventsDB");
let eventModel=new mongoose.Schema({
    _id:Number,
    Title:String,
    mainSpeaker:{
        type:Number,
        //معناه ان البرايمري كي ب نمبر وهياخده من الكولكشن اللي عليه ريفرينس

        ref:"speakers"//collection name
    },
    otherSpeakers:[{
        type:Number,
        ref:"speakers"
    }],
    Date:{
        type:String,
        default:`${(new Date()).getFullYear()}/${(new Date()).getMonth()}/${(new Date()).getDate()}`,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
    //one to meny
})

// bookSchema.plugin(autoIncrement.plugin, {
//     model: 'itiEvents',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });

mongoose.model("itiEvents",eventModel);