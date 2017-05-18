import * as Cookies from 'js-cookie';

export const FETCH_SCORES_REQ = 'FETCH_SCORES_REQ';
export const fetchScoresReq = () => ({
  type: FETCH_SCORES_REQ,
  loading: true,
});

export const UPDATE_SCORES = 'UPDATE_SCORES';
export const updateScores = (pastScores) => ({
  type: UPDATE_SCORES,
  loading: false,
  displayModal: 'scores',
  pastScores
});

export const CLOSE_MODAL = 'CLOSE_MODAL';
export const closeModal = () => ({
  type: CLOSE_MODAL,
  displayModal: false
});

export const DISPLAY_HELP = 'DISPLAY_HELP';
export const displayHelp = () => ({
  type: DISPLAY_HELP,
  displayModal: 'help'
})

export const getQuizScores = () => dispatch => {
  this.props.dispatch(fetchScoresReq());
  const accessToken = Cookies.get('accessToken');
  fetch(`/api/verbs/score`, {headers: {'Authorization': `Bearer ${accessToken}`}})  
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('accessToken');
          return;
        }
        throw new Error(res.statusText);
      }
      return res.json();
		}).then(scores => {
      this.props.dispatch(updateScores(scores))
		});
}