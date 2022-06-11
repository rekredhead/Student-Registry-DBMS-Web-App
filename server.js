const express = require('express');
const Router = require('./router');

const app = express();

app.use(express.json());
app.use(Router);

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening at Port ${port}`);
});