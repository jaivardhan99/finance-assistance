const express= require('express')
const mongoose= require('mongoose')
const User= require('../schemas/user')

mongoose.connect('mongodb://127.0.0.1:27017/finance');

const router= express.Router()

router.get('/getGoals/:username',async(req,res)=>{
    const {username}= req.params;
    console.log(username);
    try{
    const user= await User.findOne({username});
    res.status(200).json({goals:user.goals});
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Error"});
    }
})

router.post('/setGoals',async(req,res)=>{
    const {username,goal}= req.body;
    console.log(req.body)
    try{
    const user= await User.findOne({username});
    user.goals.push(goal);
    await user.save();
    console.log(user);
    res.status(200).json({message:"Successful"});
}catch(err){
        console.log(err);
        res.status(400).json({message:"Error"});
    }
})

router.post('/deleteGoal',async(req,res)=>{
    const{username,goal}= req.body;
    try{
    const user= await User.findOne({username});
    user.goals = user.goals.filter(g => g.name !== goal);
    await user.save();
    res.status(200).json({message:"Successful"});
}catch(err){
    console.log(err);
    res.status(400).json({message:"Error"});
}
})

module.exports= router;