const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3500;


// CORS
const whitelist = ['http://localhost:3000', 'https://www.yourdomain.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.all('*path', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
})

app.listen(PORT, () => (console.log(`Listening on port ${PORT}`)))