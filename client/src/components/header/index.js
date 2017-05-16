import React from 'react';
import {connect} from 'react-redux';

export function Header () {
  return (<div><h3>FrenchX</h3></div>);
}

const mapStateToProps = (state) => ({
    currentUser: state.app.currentUser
})

export default connect(mapStateToProps)(Header);
