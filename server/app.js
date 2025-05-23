const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');

app.use(cors());

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function cr(data) {
  console.log(JSON.stringify(data, null, 2));
}

// Serve static files from the specified directory
app.use(express.static('.'));

// Route to handle requests
app.all('*', (req, res) => {
  cr(req.query); // Log query parameters
  cr(req.body);  // Log body data
  res.send('<pre>' + JSON.stringify({ query: req.query, body: req.body }, null, 2) + '</pre>');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



