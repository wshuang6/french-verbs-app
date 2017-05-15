import {SET_USER} from './actions';
const initialState = {
  currentUser: null
}

export default (state=initialState, action) => {
    if(action.type === SET_USER) {
        return {
            ...state,
            currentUser: action.currentUser
        }
    }
    return state;
}