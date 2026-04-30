const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(PORT, () => (console.log(`Listening on port ${PORT}`)))