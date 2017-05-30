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
    modalInfo = (
      <div className='modalInfo help'>
        <h2>What am I being tested on?</h2>
        <p>
          These quizzes test your ability to conjugate different types of verbs in 
          French according to different tenses. The different tenses include, for example,
          the past, present and future tenses. These quizzes are designed to specifically help
          students of French improve their knowledge of verbs. Therefore, they do not aim to test 
          knowledge of random nouns.

          Learning to conjugate verbs properly is an important step for early learners of a foreign 
          language. The best way to internalize the conjugation of verbs is with consistent practice.
          Oui Verbs makes it easy to practice the conjugation of French verbs. Simply log in, choose a quiz,
          and start practicing in seconds.   
        </p>
        <h2>Why do I need to log in?</h2>
        <p>
          When you log in with your google account, Oui Verbs creates a user profile for you that tracks your
          progress as you take different quizzes. When you get a verb conjugation or translation wrong, 
          Oui Verbs records your difficulty with the verb to make sure you see it more often. This way, you are sure
          to be tested on the verbs that you struggle with the most, rather than those you are more familiar with.    
        </p>
        <h2>How can I start a quiz?</h2>
        <p>
          To begin a quiz, start by selecting a quiz category. Quizzes are divided 
          according to different tenses (past, future, present, etc). Once you select a quiz category,
          you will prompted to choose a verb category to be tested on as well. In French, there are four
          categories of verbs, each one with its own unique conjugation patterns. These categories include, 
          -IR verbs, -ER verbs, -RE verbs, and Irregular verbs. Once you've chosen a Quiz Category and a Verb 
          Category, your quiz will begin.  
        </p>
        <h2>How do the quizzes work?</h2>
        <p>
          Each quiz tests you on 10 randomly chosen verbs. If you incorrectly answer a verb correctly, you will
          be tested on it again before the end of the quiz. The quiz ends once you have correctly conjugated or translated
          each of the 10 verbs at least once. At the end of the quiz, you are notified as to how many times you conjugated
          or translated a verb incorrectly. 
        </p>
      </div>
    );
  }
  else if (props.displayModal === 'scores') {
    let items = [];
    // for (let i = props.pastScores.length - 1; i > props.pastScores.length - 6 && i >= 0; i--) 
    props.pastScores.forEach((item, i) => {
      //Renders most recent five results into table
      // let item = props.pastScores[i];
      let date = new Date(item.date).toLocaleString('en-US', {timeZoneName: 'short'});
      let percent = `${Math.round(item.score/(item.score+item.wrong)*100)}%`;
      let formattedItem = <tr key={i}><td>{date}</td><td>{item.quizType}</td><td>{item.verbGroup}</td><td>{item.score}</td><td>{item.wrong}</td><td>{percent}</td></tr>;
      if (i === props.pastScores.length - 1) {
        items.push(formattedItem);
      } 
      else {
        items.push(formattedItem);
      }
    })
    modalInfo = (
      <div className='modalInfo'>
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
      </div>
    )
  }
  return (
    <div className='overlay'>
      <div className='modal-button-wrapper'>
      <button className='modal-button' onClick={e => props.dispatch(closeModal())}>X</button>
      </div>
      {modalInfo}
    </div>
  );
}

const mapStateToProps = (state) => ({
  displayModal: state.sidebar.displayModal,
  pastScores: state.sidebar.pastScores,
  loading: state.sidebar.loading
})
export default connect(mapStateToProps)(Modal);
