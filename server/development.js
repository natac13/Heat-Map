import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';

/** Routes */
import errorHandler from './routes/errorHandler.js';


/** Webpack imports ***/
import webpack from 'webpack';
import config from '../webpack.config.js';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
const compiler = webpack(config);
const webpackOptions = {
  publicPath: config.output.publicPath,
  lazy: true,
  logLevel: 'trace',
  // adds color to the terminal
  stats: {
    colors: true,
  },
};


const app = express();
const port = process.env.PORT || 3003;

// logging
const morgan = require('morgan');
app.use(morgan('dev'));
// webpack middleware and hot reloading
app.use(webpackMiddleware(compiler, webpackOptions));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  // path: '/',
  heartbeat: 10000,
}));


// body-parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// server static files same as output.publicPath from webpack.config.js
// app.use(express.static(path.join(__dirname, '../assets')));

// Routes
app.use(favicon(path.resolve(__dirname, '../favicon.ico')));

// base route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../app/index.html'));
});

app.use(errorHandler);

app.listen(port, 'localhost', () => {
  console.log(`http://localhost:${port}`);
  // console.log(`Listening on port ${port}...`);
});

export default app;
