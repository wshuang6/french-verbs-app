import React from 'react';
import {connect} from 'react-redux';
import {setCategory, setVerb} from '../quiz-select/actions';
import {getQuizScores, displayHelp} from './actions'
import Modal from './modal';
import './index.css';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaQuestion from 'react-icons/lib/fa/question';
import FaThList from 'react-icons/lib/fa/th-list';

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
                }}><span className='icon-wrapper'><FaPencil /></span>QUIZZES</li>
                <li onClick={e => this.props.dispatch(getQuizScores())}>
                    <span className='icon-wrapper'><FaThList /></span>MY SCORES
                </li>
                <li onClick={e => this.props.dispatch(displayHelp())}>
                    <span className='icon-wrapper'><FaQuestion /></span><span className='txt-wrapper'>HELP</span>
                </li>
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
