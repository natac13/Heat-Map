export * from './apiCreators.js';

import { createAction } from 'redux-actions';
import { SET_ERROR, CLEAR_ERROR } from '../constants/';

const setError = createAction(SET_ERROR);
const clearError = createAction(CLEAR_ERROR);

export {
  setError,
  clearError,
};

