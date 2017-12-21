import {
  GET_DATA,
} from 'Constants/';


const initialState = { baseTemp: undefined, chartData: undefined };


export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DATA:
      return Object.assign({}, state, {
        baseTemp: action.payload.baseTemp,
        chartData: action.payload.monthlyData,
      });
    default:
      return state;
  }
}
