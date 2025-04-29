const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const User = require('./schemas/user');
const goalRoutes = require('./routes/goal');
const stockRoutes = require('./routes/stock');
const user = require('./schemas/user');

mongoose.connect('mongodb+srv://himanadhkondabathini:1234@cluster0.y77ij.mongodb.net/finance?retryWrites=true&w=majority');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./passport')(passport);

// Register
app.post('/user/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = new User({ username, email });
    await User.register(user, password);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/user/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json({ message: 'Logged in', user: { id: user._id, username: user.username } });
    });
  })(req, res, next);
});

// Logout
app.post('/user/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Logged out' });
  });
});

app.post('/user/amount/add',async(req,res)=>{
  const {username,money}= req.body;
  const user= await User.findOne({username});
  user.totalAmount+=money;
  if(user.totalAmount<=0)
    user.totalAmount=0;
  await user.save();
  res.status(200).json({message:"Successful"})
})

app.post('/user/amount/remove',async(req,res)=>{
  const {username,money}= req.body;
  const user= await User.findOne({username});
  user.totalAmount-=money;
  if(user.totalAmount<=0)
    user.totalAmount=0;
  await user.save();
  res.status(200).json({message:"Successful"})
})
// Protected route
app.get('/user/profile', async(req, res) => {
  const {username}= req.query;
  const user= await User.findOne({username})
  res.json({ user});
});

app.use('/goals', goalRoutes);
app.use('/stocks', stockRoutes);

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
