import React from 'react';
import {connect} from 'react-redux';
import './modal.css';
import {closeModal} from './actions';

export function Modal (props) {
  let modalInfo; 
  if (props.loading) {
    return (<p>Loading...</p>);
  }
  else if (props.displayModal === 'help') {
    modalInfo = (<p>This is a quiz that lets you practice translating or conjugating French verbs. Pick a quiz category and a verb group and keep going until you've gotten all ten of the verbs correct. Bonne chance!</p>)
  }
  else if (props.displayModal === 'scores') {
    let items = [];
    for (let i = props.pastScores.length - 1; i > props.pastScores.length - 6 && i >= 0; i--) {
      //Renders most recent five results into table
      let item = props.pastScores[i];
      let date = new Date(item.date).toLocaleString('en-US', {timeZoneName: 'short'});
      let percent = `${Math.round(item.score/(item.score+item.wrong)*100)}%`;
      let formattedItem = <tr key={i}><td>{date}</td><td>{item.quizType}</td><td>{item.verbGroup}</td><td>{item.score}</td><td>{item.wrong}</td><td>{percent}</td></tr>;
      if (i === props.pastScores.length - 1) {
        items.push(formattedItem);
      } 
      else {
        items.push(formattedItem);
      }
    }
    modalInfo = (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Quiz Type</th>
            <th>Verb Group</th>
            <th>Right Answers</th>
            <th>Incorrect Answers</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    )
  }
  return (
    <div className='overlay'>
      {modalInfo}
      <button onClick={e => props.dispatch(closeModal())}>Close me</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  displayModal: state.sidebar.displayModal,
  pastScores: state.sidebar.pastScores,
  loading: state.sidebar.loading
})
export default connect(mapStateToProps)(Modal);
