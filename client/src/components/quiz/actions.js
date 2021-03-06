import * as Cookies from 'js-cookie';
export const FETCH_VERBS_REQ = 'FETCH_VERBS_REQ';
export const fetchVerbsReq = () => ({
  type: FETCH_VERBS_REQ,
  loading: true,
});

export const UPDATE_VERBS = 'UPDATE_VERBS';
export const updateVerbs = (verbs, quizType) => ({
  type: UPDATE_VERBS,
  loading: false,
  verbs,
  quizType
});

export const fetchVerbGroup = (group, quizType) => dispatch => {
  const accessToken = Cookies.get('accessToken');
  dispatch(fetchVerbsReq());
  fetch(`/api/verbs/${group}`, {headers: {'Authorization': `Bearer ${accessToken}`}})  
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('accessToken');
          return;
        }
        throw new Error(res.statusText);
      }
      return res.json();
		}).then(verbs => {
			dispatch(updateVerbs(verbs, quizType));
		});
}

export const REGISTER_ANSWER = 'REGISTER_ANSWER';
export const registerAnswer = (choice, isCorrect, currentVerb) => ({
  type: REGISTER_ANSWER,
  choice,
  isCorrect,
  currentVerb
});

