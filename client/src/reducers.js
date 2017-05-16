import { combineReducers } from 'redux';
import app from './components/app/reducers';
import quiz from './components/quiz/reducers';

export default combineReducers({
  app,
  quiz
});