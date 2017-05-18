import * as Cookies from 'js-cookie';
export const getQuizResult = () => dispatch => {
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
      console.log(scores)
		});
}