import { FETCH_VERBS_REQ, UPDATE_VERBS, REGISTER_ANSWER, CLEAR_CURRENT } from './actions';
import { SET_CATEGORY } from '../quiz-select/actions';

function getIncorrectChoices(verbs, current, incorrect=[]) {
  // This function will get random incorrect answers by looping over the entire 
  // array of verbs, grabbing random english translations from other verb objects
  if (incorrect.length === 3) {
    return incorrect;
  }
  let randomIdx = Math.floor(Math.random() * verbs.length);
  let item = verbs[randomIdx];
  if (incorrect.indexOf(item.en) > -1 || item.en === current) {
    return getIncorrectChoices(verbs, current, incorrect);
  }
  incorrect.push(item.en);
  return getIncorrectChoices(verbs, current, incorrect);
}

function getPositions(correct, incorrectArr) {
  // This function randomly shuffles the incorrect answers and the correct answer 
  // with an array and returns the new array
  let positions = [];
  let correctIdx;
  let correctRandom = Math.floor(Math.random() * 4);
  let random = Math.floor(Math.random() * 4);
  let i = 0;
  let isPushed = false;
  while (positions.length < 4) {
    if (random === correctRandom && !isPushed) {
      positions.push(correct);
      correctIdx = positions.length - 1;
      isPushed = true;
    }
    else if (i < incorrectArr.length) {
      positions.push(incorrectArr[i]);
      i++;
    }
    random = Math.floor(Math.random() * 4);
  }
	return {positions, correctIdx};
}

const initialState = {
  originalTen: false,
  quizVerbs: false,
  score: 0,
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
    // action.verbs, as it will otherwise be false.
    // You need to save a copy of the original ten verbs in order for the 
    // getIncorrectChoices function to work proerly 
    let verbsArr = state.originalTen ? state.originalTen : action.verbs; 
    // Get a random length 3 array of incorrect choices
    let incorrectArr = getIncorrectChoices(verbsArr, action.verbs[0].en);
    // Sort incorrect and correct choices in defined positions
    // that will translate into how they are rendered in the quiz
    let results = getPositions(action.verbs[0].en, incorrectArr);
    return Object.assign({}, state, {
      // Current available verbs for questions
      quizVerbs: action.verbs,
      // reference of the original 10 verbs received from api
      originalTen: verbsArr,
      // All relevant data on the state of the current question. 
      // The current verb being tested is always the first verb in the 
      // quizVerbs array. 
      currentQuestion: {
        currentVerb: action.verbs[0],
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
    return Object.assign({}, state, {
      // If the user answered correctly, increment score by one
       score: action.isCorrect ? state.score += 1 : state.score,
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