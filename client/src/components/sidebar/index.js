import React from 'react';
import {connect} from 'react-redux';
import {setCategory, setVerb} from '../quiz-select/actions';
import {getQuizScores, displayHelp} from './actions'
import Modal from './modal';
import './index.css';

class Sidebar extends React.Component {
    render() {
        const modal = (this.props.displayModal) ? <Modal /> : null;
      return (
        <div className="sidebar">
            {modal}
            <ul>
                <li onClick={e => {
                    this.props.dispatch(setCategory(null));
                    this.props.dispatch(setVerb(null))
                }}>Quizzes</li>
                <li onClick={e => this.props.dispatch(getQuizScores())}>My scores</li>
                <li onClick={e => this.props.dispatch(displayHelp())}>Help</li>
            </ul>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
    displayModal: state.sidebar.displayModal,
    pastScores: state.sidebar.pastScores,
})

export default connect(mapStateToProps)(Sidebar);
