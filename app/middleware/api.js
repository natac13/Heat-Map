import axios from 'axios';

import {
  GET_DATA,
} from '../constants/';

export const CALL_API = Symbol('Call API');


function actionWith(action, extra) {
  const finalAction = Object.assign({}, action, extra);
  delete finalAction[CALL_API];
  return finalAction;
}


function fetch() {
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  return axios.get(url)
    .then((response) => response.data);
}


// Api Middleware itself
export default ({ dispatch, getState }) => (next) => (action) => {
  const callAPI = action[CALL_API];

  // pass to next middleware if normal action and not a CALL_API action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }
  const { type } = action;
/* ====================================
  =            Source Data            =
=====================================*/

  if (type === GET_DATA) {
    const fetchPromise = fetch();
    return fetchPromise.then((response) => {
      const payload = {
        baseTemp: response.baseTemperature,
        monthlyData: response.monthlyVariance.map((d) => (
          {
            year: +d.year,
            month: +d.month,
            temp: +(response.baseTemperature + d.variance).toFixed(3),
          }
        )),
      };
      return next(actionWith(action, { payload }));
    });
  }

/* =====  End of Security API  ======*/

  return next(action);
};
