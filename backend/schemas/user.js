const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://himanadhkondabathini:1234@cluster0.y77ij.mongodb.net/');
const passportLocalMongoose = require('passport-local-mongoose');

const {Schema}= mongoose;

const goalSchema=new Schema({
    name:String,
    target:Number,
    current:Number,
    targetDate:Date,
    monthSPI:Number
})

const UserSchema= new Schema({
    email:{
        type:String
    },
    learnings:[
        {
            type:String
        }
    ],
    goals:[
        goalSchema
    ],
    stocks:[
        String
    ]
})

UserSchema.plugin(passportLocalMongoose); // Adds username, hash+salted password, etc.

module.exports = mongoose.model('User', UserSchema);