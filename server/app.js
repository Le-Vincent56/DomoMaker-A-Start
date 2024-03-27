// Node imports
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');

// Local imports
const router = require('./router.js');

// Establish port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Establish database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Establish app
const app = express();

// Set app settings
app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  key: 'sessionID', // Name of the cookie so it can be tracked
  secret: 'Domo Arigato', // Private string used as a seed for hashing/creating unique session keys
  resave: false, // Tells the session library to only send the session keyback to the database if it changes
  saveUninitialized: false // Prevents us from saving uninitialized session IDs to the database
}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// Link router
router(app);

// Start app
app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
