import { CALL_API } from '../middleware/api.js';
import {
  GET_DATA,
} from '../constants/';

export function getData(payload) {
  return {
    type: GET_DATA,
    [CALL_API]: { ...payload },
  };
}
