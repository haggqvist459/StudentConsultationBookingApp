import { combineReducers } from 'redux';
import authReducer from './authReducer';
import hamburgerReducer from './hamburgerReducer';
import calendarReducer from './calendarReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  hamburger: hamburgerReducer,
  calendar: calendarReducer,
});

export default rootReducer;