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

// For authorization later
// This request will need the following
// headers: {
// 	'Authorization': `Bearer ${accessToken}`
// }


export const fetchVerbGroup = (group, quizType) => dispatch => {
  const accessToken = Cookies.get('accessToken');
  dispatch(fetchVerbsReq());
  fetch(`/api/verbs/${group}`, {headers: {'Authorization': `Bearer ${accessToken}`}})  
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('accessToken');
          // this.props.dispatch(userCheck());
          return;
        }
        throw new Error(res.statusText);
      }
      return res.json();
		}).then(verbs => {
			// dispatch to store
			dispatch(updateVerbs(verbs, quizType));
		});
}

// export const getQuizResult = () => dispatch => {
//   const accessToken = Cookies.get('accessToken');
//   fetch(`/api/verbs/score`, {headers: {'Authorization': `Bearer ${accessToken}`}})  
//     .then(res => {
//       if (!res.ok) {
//         if (res.status === 401) {
//           Cookies.remove('accessToken');
//           // this.props.dispatch(userCheck());
//           return;
//         }
//         throw new Error(res.statusText);
//       }
//       return res.json();
// 		}).then(scores => {
// 			// dispatch(updateVerbs(verbs, quizType));
// 		});
// }



export const REGISTER_ANSWER = 'REGISTER_ANSWER';
export const registerAnswer = (choice, isCorrect, currentVerb) => ({
  type: REGISTER_ANSWER,
  choice,
  isCorrect,
  currentVerb
});

