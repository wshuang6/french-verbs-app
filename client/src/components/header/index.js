import React from 'react';
import {connect} from 'react-redux';
import './index.css';
import googLogo from './images/GGL_logo_googleg_18.png';
import googSignIn from './images/g-sign-in.png';
import { toggleSignOut } from './actions';

export function Header (props) {

  console.log(props);

  function doSignOut(event) {
    console.log('hi');
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

  let userPrompt = (props.currentUser) ? (
    <div className='logout' onClick={e => doSignOut(e)}>
      <div className='user'>
        <div className="goog-logo">
          <img src={googLogo} alt='google' />
        </div>
        <p>{props.currentUser.displayName}</p>
      </div>
      {getSignOutDisplay()}
    </div>
  ) : (
    <div className='google-container'>
      <a href={'/api/auth/google'}>
        <img className='google-sign-in' src={googSignIn} alt="Sign in with Google" />
      </a>
    </div>
  );

  return (
    <div className='header'>
      <h2 className='logo'>FrenchX</h2>
      {userPrompt}
    </div>
  );
}

const mapStateToProps = (state) => ({
    currentUser: state.app.currentUser,
    displaySignOut: state.app.displaySignOut
})

export default connect(mapStateToProps)(Header);
