import React from 'react';
import Header from '../header';
import Sidebar from '../sidebar';
import QuizSelect from '../quiz-select';
import Quiz from '../quiz';

import './index.css';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const logoColor = {
  color: '#0066cc'
};

export class Dashboard extends React.Component {

  handleView() {
    if (!this.props.quizCategory || !this.props.verbCategory) {
      return (<QuizSelect />);
    }
    else {
      return (<Quiz />);
    }
  }

  render() {
    return (
      <div className='dashboard-container'>
        <Header logoStyle={logoColor}/>
        <div className="under-header">
          <Sidebar />
          <div className="main-component-container">
            {this.handleView()}
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  quizCategory: state.quizSelect.quizCategory,
  verbCategory: state.quizSelect.verbCategory,
})

export default connect(mapStateToProps)(Dashboard);