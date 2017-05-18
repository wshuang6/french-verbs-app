import { FETCH_VERBS_REQ, UPDATE_VERBS, REGISTER_ANSWER } from './actions';
import { SET_CATEGORY } from '../quiz-select/actions';
import { getIncorrectChoices, getPositions, makeQueue, getTenseQuizChoices } from './helpers'

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
    return Object.assign({}, initialState, {
      loading: action.loading 
    });
  }
  else if (action.type === UPDATE_VERBS) {
    // If the array of 10 verbs was just now received, set originalTen to
    // action.verbs, as it will otherwise be false. Also create your queue
    // You need to save a copy of the original ten verbs in order for the 
    // getIncorrectChoices function to work proerly for the translation quiz
    let verbsQueue;
    if (!state.quizVerbs) {
      verbsQueue = makeQueue(action.verbs);
    } else {
      verbsQueue = state.quizVerbs;
    }
    let verbsArr = state.originalTen ? state.originalTen : action.verbs; 
    let currentVerb = verbsQueue.dequeue();
    let results;
    if (action.quizType === 'translation') {
      let incorrectArr = getIncorrectChoices(verbsArr, currentVerb.en);
      results = getPositions(currentVerb.en, incorrectArr);
    }
    else {
      // It is a tense quiz
      results = getTenseQuizChoices(action.quizType, currentVerb);
    }
    return Object.assign({}, state, {
      quizVerbs: verbsQueue,
      originalTen: verbsArr,
      currentQuestion: {
        currentVerb,
        person: results.person,
        positions: results.positions,
        correctIdx: results.correctIdx,
        choice: false,
			  isCorrect: false
      },
      loading: false
    });
  }
  else if (action.type === REGISTER_ANSWER) {
    // If user answered incorrectly, enqueue the current verb so they 
    // are tested on it again during this session -> Needs to be pure
    // update the fields in currentQuestion field to reflect that user entered an answer
    if (!action.isCorrect) {
      state.quizVerbs.enqueue(action.currentVerb); 
    }
    return Object.assign({}, state, {
      quizVerbs: state.quizVerbs,
      score: action.isCorrect ? state.score += 1 : state.score,
      wrong: action.isCorrect ? state.wrong : state.wrong += 1,  
      currentQuestion: Object.assign({}, state.currentQuestion, {
        choice: action.choice,
			  isCorrect: action.isCorrect
       })
    });
  } 
  else if (action.type === SET_CATEGORY) {
    // Just revert back to the initial state to receive new verb data
    return Object.assign({}, state, initialState);
  }
  return state;
}

export default quiz;