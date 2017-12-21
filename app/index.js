import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

/** Global styles */
import './stylesheets/setup.scss';
import './stylesheets/normalize.css';


import App from './containers/App/';

import configureStore from './store/configureStore';
// seed store with an Immutable.Iterable as per redux-immutable
const store = configureStore({});


const rootElement = document.getElementById('root');

render((
  <Provider store={store}>
    <App />
  </Provider>
), rootElement);
