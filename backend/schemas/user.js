const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

// Goal schema (you already had this)
const goalSchema = new Schema({
  name: String,
  target: Number,
  current: Number,
  targetDate: Date,
  monthSPI: Number
});

// Portfolio item schema (from second version)
const portfolioItemSchema = new Schema({
  symbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Updated User schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  learnings: [
    {
      type: String
    }
  ],
  goals: [
    goalSchema
  ],
  portfolio: [
    portfolioItemSchema
  ],
  watchlist: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  historicalPortfolioValues: [
    {
        date: Date,
        value: Number
    }
  ]
});

// Plugin passport-local-mongoose (handles password hashing etc.)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
