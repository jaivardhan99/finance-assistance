const express= require('express')
const mongoose= require('mongoose')
const User= require('../schemas/user')

mongoose.connect('mongodb+srv://himanadhkondabathini:1234@cluster0.y77ij.mongodb.net/');

const router= express.Router()

router.get('/getStocks/:username',async(req,res)=>{
    const {username}= req.params;
    console.log(username);
    try{
    const user= await User.findOne({username});
    res.status(200).json({stocks:user.stocks});
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Error"});
    }
})

router.post('/addStock',async(req,res)=>{
    const {username,stock}= req.body;
    console.log(req.body)
    try{
    const user= await User.findOne({username});
    user.stocks.push(stock);
    await user.save();
    console.log(user);
    res.status(200).json({message:"Successful"});
}catch(err){
        console.log(err);
        res.status(400).json({message:"Error"});
    }
})

router.post('/deleteStock',async(req,res)=>{
    const{username,stock}= req.body;
    try{
    const user= await User.findOne({username});
    user.stocks = user.stocks.filter(s => s!== stock);
    await user.save();
    res.status(200).json({message:"Successful"});
}catch(err){
    console.log(err);
    res.status(400).json({message:"Error"});
}
})

module.exports= router;