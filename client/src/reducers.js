import { combineReducers } from 'redux';
import app from './components/app/reducers';
import quizSelect from './components/quiz-select/reducers'

export default combineReducers({
  app,
  quizSelect
});