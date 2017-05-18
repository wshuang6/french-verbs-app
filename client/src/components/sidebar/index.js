import React from 'react';
import {connect} from 'react-redux';
import {setCategory, setVerb} from '../quiz-select/actions';
import {getQuizResult} from './actions'
import './index.css';

class Sidebar extends React.Component {
    render() {
      return (
        <div className="sidebar">
            <ul>
                <li onClick={e => {
                    this.props.dispatch(setCategory(null));
                    this.props.dispatch(setVerb(null))
                }}>Quizzes</li>
                <li onClick={e => this.props.dispatch(getQuizResult())}>My scores</li>
                <li>Help</li>
            </ul>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
    // currentUser: state.app.currentUser
})

export default connect(mapStateToProps)(Sidebar);
