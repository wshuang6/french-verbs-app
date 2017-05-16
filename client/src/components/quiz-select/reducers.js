import {SET_CATEGORY} from './actions';
import {SET_VERB} from './actions';
const initialState = {
  quizCategory: null,
  verbCategory: null,
}

export default (state=initialState, action) => {
    if(action.type === SET_CATEGORY) {
        return {
            ...state,
            quizCategory: action.quizCategory
        }
    }
    if(action.type === SET_VERB) {
        return {
            ...state,
            verbCategory: action.verbCategory
        }
    }
    return state;
}