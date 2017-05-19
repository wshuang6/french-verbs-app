import React from 'react';
import Header from '../header';
import './index.css';

export default function LoginPage() {
    return (
        <div className='log-in'>
            <Header />
            <div className='global-container'>
                <h1>Verb Flashcards for Students of French</h1>
                <div className='prompt-bin'>
                    <div className='btn-container'>
                        <button>How's it work?</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ../../../public/images