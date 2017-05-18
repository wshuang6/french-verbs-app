import { combineReducers } from 'redux';
import app from './components/app/reducers';
import quiz from './components/quiz/reducers';
import quizSelect from './components/quiz-select/reducers';
import sidebar from './components/sidebar/reducers'

export default combineReducers({
  app,
  quiz,
  quizSelect,
  sidebar
});