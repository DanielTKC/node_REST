const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.all('*path', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
})

app.listen(PORT, () => (console.log(`Listening on port ${PORT}`)))