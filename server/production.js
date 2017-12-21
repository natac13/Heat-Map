import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import fs from 'fs';
import morgan from 'morgan';
import favicon from 'serve-favicon';


import errorHandler from './routes/errorHandler.js';

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(compression());
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(favicon(path.resolve(__dirname, '../favicon.ico')));
// server static files
// will server the static index.html page in production as well.
app.use(express.static(path.join(__dirname, '../build')));

// Routes

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.use(errorHandler);

app.listen(port, process.env.SERVER_IP, () => {
  console.log(`Listening on port ${port}...`);
});
