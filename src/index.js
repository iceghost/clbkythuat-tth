import express from 'express';
import bodyParser from 'body-parser';

import facebookRoute from './facebook/route';
import siteRoute from './site/route'

const app = express();

app.use(express.static('./public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(siteRoute); // homepage
app.use('/facebook', facebookRoute); // bot

export default app;
