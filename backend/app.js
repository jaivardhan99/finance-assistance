const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const User = require('./schemas/user');
const goalRoutes= require('./routes/goal');
const stockRoutes= require('./routes/stock');

mongoose.connect('mongodb://127.0.0.1:27017/finance');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // your frontend's URL
  credentials: true, // allow cookies (needed for sessions)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./passport')(passport); // if you split config; else define inline

// Register
app.post('/user/register', async (req, res) => {
    console.log(req.body)
    console.log("Hiiteed")
  const { username, password, email } = req.body;
  try {
    const user = new User({ username, email });
    await User.register(user, password); // from passport-local-mongoose
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.log(err)
    if(err==UserExistsError){
        res.status(400).json({ message:'UserExists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/user/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in', user: req.user });
});

// Protected route
app.get('/user/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json({ user: req.user });
});

app.use('/goals',goalRoutes)

app.use('/stocks',stockRoutes)

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
