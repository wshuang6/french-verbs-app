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

// For authorization later
// This request will need the following
// headers: {
// 	'Authorization': `Bearer ${accessToken}`
// }

export const fetchVerbGroup = (group, quizType) => dispatch => {
  dispatch(fetchVerbsReq());
  fetch(`/api/verbs/${group}`)  
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
		}).then(verbs => {
			// dispatch to store
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

