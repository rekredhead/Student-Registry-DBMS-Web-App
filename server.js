const express = require('express');
const Router = require('./router');
const cors = require('cors');

// The API that handles the requests and responses
const app = express();

app.use(express.json());
app.use(cors()); // Enable cors to allow site to run on GitHub pages
app.use(Router);

// Run the server at localhost:3000 if no port exists
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Open site at http://localhost:${port}`);
});