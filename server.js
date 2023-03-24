const { DOMAIN, PORT } = require('./config');
const express = require('express');
const cors = require('cors');
require('./database/createdb');

const app = express();

const webpageRouter = require('./webpageRouter'); // Router (API) for the webpage

app.use(express.json());
app.use(cors()); // Enable cors to allow site to run on GitHub pages
app.use(webpageRouter);

app.listen(PORT, () => console.log(`Open site at ${DOMAIN}`));