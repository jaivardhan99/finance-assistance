const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/finance');
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