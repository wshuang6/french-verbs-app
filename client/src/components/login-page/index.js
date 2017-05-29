import React from 'react';
import Header from '../header';
import './index.css';
import {displayHelp} from '../sidebar/actions';
import {connect} from 'react-redux';
import Modal from '../sidebar/modal';
import tower from './images/tower.jpg';

const headerStyle = {
  padding: '50px 80px 20px'
};

export function LoginPage(props) {
  const modal = (props.displayModal) ? <Modal /> : null;
    return (
        <div className='log-in'>
            <img src={tower} alt="Eiffel Tower" className="bg" />
            <Header backStyle={headerStyle} />
            {modal}
            <div className='global-container'>
                <h1>Verb Flashcards for Students of French</h1>
                <div className='prompt-bin'>
                    <div className='btn-container'>
                        <button onClick={e => props.dispatch(displayHelp())}>How's it work?</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
  displayModal: state.sidebar.displayModal  
})

export default connect (mapStateToProps)(LoginPage);