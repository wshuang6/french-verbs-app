import {UPDATE_SCORES, FETCH_SCORES_REQ, CLOSE_MODAL, DISPLAY_HELP} from './actions';

const initialState = {
  displayModal: false,
  pastScores: null,
  loading: false
}

export default (state=initialState, action) => {
    if(action.type === UPDATE_SCORES) {
        return {
            ...state,
            displayModal: action.displayModal,
            pastScores: action.pastScores,
            loading: action.loading
        }
    }
    if(action.type === FETCH_SCORES_REQ) {
        return {
            ...state,
            loading: action.loading
        }
    }
    if(action.type === CLOSE_MODAL) {
      return {
        ...state,
        displayModal: action.displayModal
      }
    }
    if(action.type === DISPLAY_HELP) {
      return {
        ...state,
        displayModal: action.displayModal
      }
    }
    return state;
}