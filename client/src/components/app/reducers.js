import { SET_USER, USER_REQUEST,  TOGGLE_SIGN_OUT  } from './actions';

const initialState = { 
  currentUser: null,
  loading: false,
  statusCode: null,
  displaySignOut: false,
}

export default (state=initialState, action) => {
    if(action.type === USER_REQUEST) {
        return {
            ...state,
            loading: action.loading
        }
    }
    if (action.type === SET_USER) {
        return {
            ...state,
            currentUser: action.currentUser,
            statusCode: action.statusCode,
            loading: action.loading,
        }
    }
    if (action.type === TOGGLE_SIGN_OUT) {
        return {
            ...state,
            displaySignOut: !state.displaySignOut
        };
    }
    return state;
}