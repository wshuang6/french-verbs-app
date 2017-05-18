import React from 'react';
import {connect} from 'react-redux';
import './modal.css';
import {closeModal} from './actions';

// import {toggleAddBookmark, createBookmarks, editBookmark, updateBookmarks} from './actions';

export function Modal (props) {
  let modalInfo; 
  if (props.displayModal === 'help') {
    modalInfo = (<p>Some help text goes here</p>)
  }
  else if (props.displayModal === 'scores') {
    let items = [];
    for (let i = props.pastScores.length - 1; i > props.pastScores.length - 6 && i >= 0; i--) {
      let item = props.pastScores[i];
      let formattedItem = <tr key={i}><td>{item.date}</td><td>{item.quizType}</td><td>{item.verbGroup}</td><td>{item.score}</td><td>{item.wrong}</td></tr>;
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
            <th>Score</th>
            <th>Incorrect Answers</th>
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
