const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');

// Use a single database URI for all models
const singleDB = mongoose.createConnection(process.env.SINGLE_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Pass the single connection to all models
// This structure has been maintained to allow for the possibility of multiple databases
const User = require('../models/User')(singleDB);
const Deck = require('../models/Deck')(singleDB);
const Card = require('../models/Card')(singleDB);
const Spread = require('../models/Spread')(singleDB);
const Reading = require('../models/Reading')(singleDB);
const Avatar = require('../models/Avatar')(singleDB);
const Theme = require('../models/Theme')(singleDB);
const NewUserDefaults = require('../models/NewUserDefaults')(singleDB);

module.exports = { singleDB, User, Deck, Card, Spread, Reading, Avatar, Theme, NewUserDefaults };
