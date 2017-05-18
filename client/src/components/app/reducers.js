import { SET_USER, USER_CHECK} from './actions';
import { TOGGLE_SIGN_OUT } from '../header/actions'

const initialState = {
  userCheck: false,  
  currentUser: null,
  displaySignOut: false
}

export default (state=initialState, action) => {
    if(action.type === SET_USER) {
        return {
            ...state,
            userCheck: true,
            currentUser: action.currentUser
        }
    }
    if (action.type === USER_CHECK) {
        return {
            ...state,
            userCheck: true
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