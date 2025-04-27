const express= require('express')
const mongoose= require('mongoose')
const User= require('../schemas/user')



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
// In your Express backend

// Get user's portfolio
router.get('/getPortfolio/:username', async (req, res) => {
    try {
      const { username } = req.params;
      
      // Fetch user's portfolio from database
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return portfolio data
      res.json({ portfolio: user.portfolio || [] });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Add stock to portfolio
  router.post('/addToPortfolio', async (req, res) => {
    try {
      const { username, stock, quantity, purchasePrice, purchaseDate } = req.body;
      
      // Validate inputs
      if (!username || !stock || !quantity || !purchasePrice) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user already has this stock in portfolio
      const existingStockIndex = user.portfolio ? 
        user.portfolio.findIndex(item => item.symbol === stock) : -1;
      
      if (existingStockIndex >= 0) {
        // Update existing position (average down/up)
        const existingPosition = user.portfolio[existingStockIndex];
        const totalShares = existingPosition.quantity + quantity;
        const totalCost = (existingPosition.quantity * existingPosition.purchasePrice) + 
                           (quantity * purchasePrice);
        
        // Calculate new average purchase price
        const newAvgPrice = totalCost / totalShares;
        
        user.portfolio[existingStockIndex] = {
          ...existingPosition,
          quantity: totalShares,
          purchasePrice: newAvgPrice,
          lastUpdated: new Date()
        };
      } else {
        // Add new position
        if (!user.portfolio) user.portfolio = [];
        
        user.portfolio.push({
          symbol: stock,
          quantity,
          purchasePrice,
          purchaseDate: purchaseDate || new Date(),
          lastUpdated: new Date()
        });
      }
      
      await user.save();
      
      res.status(201).json({ message: 'Stock added to portfolio', portfolio: user.portfolio });
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update user's portfolio position
  router.put('/updatePosition', async (req, res) => {
    try {
      const { username, stock, quantity, purchasePrice } = req.body;
      
      const user = await User.findOne({ username });
      
      if (!user || !user.portfolio) {
        return res.status(404).json({ message: 'User or portfolio not found' });
      }
      
      const stockIndex = user.portfolio.findIndex(item => item.symbol === stock);
      
      if (stockIndex === -1) {
        return res.status(404).json({ message: 'Stock not found in portfolio' });
      }
      
      // Update the position
      user.portfolio[stockIndex] = {
        ...user.portfolio[stockIndex],
        quantity,
        purchasePrice,
        lastUpdated: new Date()
      };
      
      await user.save();
      
      res.json({ message: 'Position updated', portfolio: user.portfolio });
    } catch (error) {
      console.error('Error updating position:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Remove stock from portfolio
  router.delete('/removeStock', async (req, res) => {
    try {
      const { username, stock } = req.body;
      
      const user = await User.findOne({ username });
      
      if (!user || !user.portfolio) {
        return res.status(404).json({ message: 'User or portfolio not found' });
      }
      
      // Filter out the stock to be removed
      user.portfolio = user.portfolio.filter(item => item.symbol !== stock);
      
      await user.save();
      
      res.json({ message: 'Stock removed from portfolio', portfolio: user.portfolio });
    } catch (error) {
      console.error('Error removing stock:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports= router;