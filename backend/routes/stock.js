const express= require('express')
const mongoose= require('mongoose')
const User= require('../schemas/user')
const axios = require('axios');

const router= express.Router()

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
}

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get stock prices
router.get('/prices', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ message: 'Symbols parameter is required' });
    }

    // In a real app, you would fetch from a stock API
    // This is a mock implementation
    const mockPrices = {
      'AAPL': 150.0,
      'GOOGL': 2800.0,
      'MSFT': 300.0,
      'AMZN': 3500.0,
      'NFLX': 600.0
    };

    const prices = {};
    symbols.split(',').forEach(symbol => {
      prices[symbol] = mockPrices[symbol] || 0;
    });

    res.json({ prices });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    res.status(500).json({ message: 'Error fetching stock prices' });
  }
});

// Get historical portfolio value
router.get('/historicalPortfolioValue/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { symbols, range } = req.query;

    if (!username || !symbols) {
      return res.status(400).json({ message: 'Username and symbols are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock historical data
    const historicalData = [];
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 3);
    }

    // Generate mock data points
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      historicalData.push({
        date: d.toISOString().split('T')[0],
        value: Math.random() * 10000 + 50000 // Random value between 50k and 60k
      });
    }

    res.json({ historicalData });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ message: 'Error fetching historical data' });
  }
});

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