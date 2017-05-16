import React from 'react';
import {connect} from 'react-redux';
import './index.css';
import googLogo from './images/GGL_logo_googleg_18.png';

export function Header (props) {
  let userName = (props.currentUser) ? (
    <div className='logout'>
      <div className='user'>
        <div className="goog-logo">
          <img src={googLogo} alt='google' />
        </div>
        <p>{props.currentUser.displayName}</p>
      </div>
      <div className="sign-out-div">
        <a href="/api/auth/logout">
          <button className="sign-out-button">
            Sign out
          </button>
        </a>
      </div>
    </div>
  ) : null;
  return (
    <div className='header'>
      <h2 className='logo'>FrenchX</h2>
      {userName}
    </div>
  );
}

const mapStateToProps = (state) => ({
    currentUser: state.app.currentUser
})

export default connect(mapStateToProps)(Header);
