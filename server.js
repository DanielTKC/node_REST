require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(err => console.error(err));


// CORS
const whitelist = ['http://localhost:3000', 'https://www.yourdomain.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {   // remove origin for deploy
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.all('*path', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
  }
  else if (req.accepts('json')) {
    res.json({error: "404 Not Found"});
  }
  else {
    res.type('txt').send("404 Not Found")
  }
})

app.use(function (err,req, res, _next) {
  console.error(err.stack);
  res.status(500).send(err.message)
})

app.listen(PORT, () => (console.log(`Listening on port ${PORT}`)))