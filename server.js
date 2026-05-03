import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import connectDB from "./config/dbConnect.js";
import statesRouter from './routes/states.js';


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3500;

// initiate mongo connection
void connectDB();

// Middleware

// morgan for logging
app.use(morgan('dev'));


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
app.use('/states', statesRouter);



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
// Wait for mongo to actually connect before starting server
mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});