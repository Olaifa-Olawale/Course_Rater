const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public', { index: 'html/index.html' }));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//tesrt