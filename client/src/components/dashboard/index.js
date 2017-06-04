import React from 'react';
import Header from '../header';
import Sidebar from '../sidebar';
import QuizSelect from '../quiz-select';
import Quiz from '../quiz';
import { Redirect } from 'react-router-dom';

import './index.css';
import {connect} from 'react-redux';

const logoColor = {
  color: '#0066cc'
};

const headerBackground = {
  backgroundColor: '#fff',
  padding: '50px 100px 20px'
};

export class Dashboard extends React.Component {

  handleView() {
    if (!this.props.quizCategory || !this.props.verbCategory) {
      return (<QuizSelect />);
    }
    return (<Quiz />);
  }

  render() {
    if (this.props.currentUser) {
      return (
        <div className='dashboard-container'>
          <Header logoStyle={logoColor} backStyle={headerBackground}/>
          <div className="under-header">
            <Sidebar />
            <div className="main-component-container">
              {this.handleView()}
            </div>
          </div>
        </div>
      );
    } 
    else {
      return (<Redirect to={'/'} />);
    }
  } 
}

const mapStateToProps = (state) => ({
  currentUser: state.app.currentUser,
  quizCategory: state.quizSelect.quizCategory,
  verbCategory: state.quizSelect.verbCategory
})

export default connect(mapStateToProps)(Dashboard);