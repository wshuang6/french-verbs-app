import { FETCH_VERBS_REQ, UPDATE_VERBS, REGISTER_ANSWER, CLEAR_CURRENT } from './actions';
import { SET_CATEGORY } from '../quiz-select/actions';
import {getIncorrectChoices, getPositions, makeQueue} from './helpers'

const initialState = {
  originalTen: false,
  quizVerbs: false, 
  score: 0,
  wrong: 0,
  currentQuestion: false,
  loading: false
};

const quiz = (state=initialState, action) => {
  if (action.type === FETCH_VERBS_REQ) {
    return Object.assign({}, state, {
      originalTen: false,
      score: 0,
      loading: action.loading 
    });
  }
  else if (action.type === UPDATE_VERBS) {
    // If the array of 10 verbs was just now received, set originalTen to
    // action.verbs, as it will otherwise be false. Also create your queue
    // You need to save a copy of the original ten verbs in order for the 
    // getIncorrectChoices function to work proerly 
    let verbsArr = state.originalTen ? state.originalTen : action.verbs; 
    // Create your queue and get the first item in the queue
    let verbsQueue = state.quizVerbs ? state.quizVerbs : makeQueue(action.verbs); 
    let currentVerb = verbsQueue.dequeue();
    // Get a random length 3 array of incorrect choices
    let incorrectArr = getIncorrectChoices(verbsArr, currentVerb.en);
    // Sort incorrect and correct choices in defined positions
    // that will translate into how they are rendered in the quiz
    let results = getPositions(currentVerb.en, incorrectArr);
    return Object.assign({}, state, {
      // Current available verbs for questions
      quizVerbs: verbsQueue,
      // reference of the original 10 verbs received from api
      originalTen: verbsArr,
      // All relevant data on the state of the current question. 
      currentQuestion: {
        currentVerb,
        incorrect: incorrectArr,
        positions: results.positions,
        correctIdx: results.correctIdx,
        choice: false,
			  isCorrect: false
      },
      loading: false
    });
  }
  else if (action.type === REGISTER_ANSWER) {
    let addedItem = false; 
    if (!action.isCorrect) {
      addedItem = state.quizVerbs.enqueue(action.currentVerb);
    }
    return Object.assign({}, state, {
      // If user answered incorrectly, enqueue the current verb so they are tested on it again
      // If the user answered correctly, increment score by one
      quizVerbs: addedItem ? addedItem : state.quizVerbs,
      score: action.isCorrect ? state.score += 1 : state.score,
      wrong: action.isCorrect ? state.wrong : state.wrong += 1,
      // update the fields in currentQuestion field to reflect that user
      // has submitted an answer. User will be informed if they are correct 
      // or not thanks to color highlighting.  
      currentQuestion: Object.assign({}, state.currentQuestion, {
        choice: action.choice,
			  isCorrect: action.isCorrect
       })
    });
  } 
  else if (action.type === CLEAR_CURRENT || SET_CATEGORY) {
    // Just revert back to the initial state to receive new verb data
    return Object.assign({}, state, initialState);
  }
  return state;
}

export default quiz;