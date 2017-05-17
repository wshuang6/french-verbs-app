export const SET_USER = 'SET_USER';
export const setUser = (currentUser) => ({
    type: SET_USER,
    currentUser,
});

export const USER_CHECK = 'USER_CHECK';
export const userCheck = () => ({
    type: USER_CHECK
});