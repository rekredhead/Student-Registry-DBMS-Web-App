const express = require('express');
const Router = require('./router');

// The API that handles the requests and responses
const app = express();

app.use(express.json());
app.use(Router);

// Run the server at localhost:3000 if no port exists
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening at Port ${port}`);
});