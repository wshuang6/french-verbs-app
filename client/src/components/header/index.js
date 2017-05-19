import React from 'react';
import {connect} from 'react-redux';
import './index.css';
import googLogo from './images/GGL_logo_googleg_18.png';
import googSignIn from './images/g-sign-in.png';
import { toggleSignOut } from '../app/actions';

export function Header (props) {

  function doSignOut(event) {
    return props.dispatch(toggleSignOut());
  }

  function getSignOutDisplay() {
    if (props.displaySignOut) {
      return (
        <div className="sign-out-wrapper">
          <div className="sign-out-anchor">
            <a href="/api/auth/logout">Sign out?</a>
          </div>
        </div>
      );
    }
  }

  function getUserPrompt() {
    if (props.currentUser) {
      return (
        <div className='logout' onClick={e => doSignOut(e)}>
          <div className='user'>
            <div className="goog-logo">
              <img src={googLogo} alt='google' />
            </div>
            <p>{props.currentUser.displayName}</p>
          </div>
          {getSignOutDisplay()}
        </div>
      );
    }
    else {
      return (
        <div className='google-container'>
          <a href={'/api/auth/google'}>
            <img className='google-sign-in' src={googSignIn} alt="Sign in with Google" />
          </a>
        </div>
      );
    }
  }

  return (
    <div className='header' style={props.backStyle}>
      <h2 className='logo' style={props.logoStyle}>Oui Verb</h2>
      {getUserPrompt()}
    </div>
  );
}

const mapStateToProps = (state) => ({
    currentUser: state.app.currentUser,
    displaySignOut: state.app.displaySignOut
})

export default connect(mapStateToProps)(Header);
