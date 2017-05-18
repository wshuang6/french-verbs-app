import React from 'react';
import * as Cookies from 'js-cookie';

import { setUser, userCheck } from './actions';
import Quiz from '../quiz';
import LoginPage from '../login-page';
import Sidebar from '../sidebar';
import QuizSelect from '../quiz-select';
import Header from '../header';
import {connect} from 'react-redux';
import './index.css';

class App extends React.Component {
    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        Cookies.remove('accessToken');
                        this.props.dispatch(userCheck());
                        return;
                    }
                    throw new Error(res.statusText);
                }
                return res.json();
            }).then(currentUser =>
                this.props.dispatch(setUser(currentUser))
            );
        }
        else {
            // There is no access token
            return this.props.dispatch(userCheck());
        }
    }

    render() {
        let mainComponent;
        if (!this.props.userCheck) {
            mainComponent = (<p>Loading...</p>);
        }
        if (this.props.userCheck && !this.props.currentUser) {
            mainComponent = (<LoginPage />);
        }
        else if (!this.props.quizCategory || !this.props.verbCategory) {
            mainComponent = (<QuizSelect />);
        }
        else {
            mainComponent = (<Quiz />);
        }

        const sidebar = (this.props.currentUser) ? (<Sidebar />) : null;

        return (
            <div>
                <Header />
                <div className="under-header">
                    {sidebar}
                    <div className="main-component-container">
                        {mainComponent}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userCheck: state.app.userCheck,
    currentUser: state.app.currentUser,
    quizCategory: state.quizSelect.quizCategory,
    verbCategory: state.quizSelect.verbCategory,
})

export default connect(mapStateToProps)(App);
