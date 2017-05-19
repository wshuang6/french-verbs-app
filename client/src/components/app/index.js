import React from 'react';
import * as Cookies from 'js-cookie';

import { setUser, fetchUser } from './actions';
import Dashboard from '../dashboard';
import LoginPage from '../login-page';
// import Header from '../header';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

class App extends React.Component {
    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
           this.props.dispatch(fetchUser(accessToken));
        }
    }

    handleRouting() {
        if (this.props.loading) {
            return (<p>Loading...</p>);
        }
        else if (!this.props.loading && this.props.statusCode >= 400) {
            Cookies.remove('accessToken');
            return (<LoginPage />);
        }
        else if (!this.props.loading && this.props.currentUser) {
            return (<Redirect to={'/dashboard'} />);
        }
        else {
            return (<LoginPage />);
        }
    }

    render() {
        return (
            <Router>     
                <div>
                    <Route exact path="/" component={() => this.handleRouting()} />
                    <Route exact path="/dashboard" component={Dashboard} />
                </div>
            </Router> 
        );
    }
}

const mapStateToProps = (state) => ({
    userCheck: state.app.userCheck,
    currentUser: state.app.currentUser,
    loading: state.app.loading,
    statusCode: state.app.statusCode
});

export default connect(mapStateToProps)(App);
