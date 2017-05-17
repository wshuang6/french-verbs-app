import { SET_USER, USER_CHECK} from './actions';
const initialState = {
  userCheck: false,  
  currentUser: null
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
    return state;
}