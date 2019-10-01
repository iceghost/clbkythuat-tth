const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(require('./site/route')); // homepage

app.use('/facebook', require('./facebook/route')); // bot

module.exports = app;
