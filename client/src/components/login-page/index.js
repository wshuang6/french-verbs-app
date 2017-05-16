import React from 'react';
import './index.css';
import googSignIn from './images/g-sign-in.png';

export default function LoginPage() {
    return (
        <a href={'/api/auth/google'}>
            <img className='google-sign-in' src={googSignIn} alt="Sign in with Google" />
        </a>
    );
}

// ../../../public/images