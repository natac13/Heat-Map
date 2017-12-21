import { combineReducers } from 'redux';

import error from './error.js';
import data from './data.js';
import {
} from '../constants/';

function clearReducer(state, action) {
  switch (action.type) {
    default:
      return undefined;
  }
}
const rootReducer = combineReducers(Object.assign(
  {},
  {
    error,
    data,
  },
));

export default rootReducer;
