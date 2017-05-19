import React from 'react';
import {connect} from 'react-redux';
import {setCategory} from './actions';
import {setVerb} from './actions';
import './index.css';

class QuizSelect extends React.Component {
    setCategory (category) {
        this.props.dispatch(setCategory(category))
    }
    setVerb (verb) {
        this.props.dispatch(setVerb(verb))
    }
    render() {
        if (!this.props.quizCategory) {
            return (
                <div className="quiz-select-menu main-component">
                    <h3>Quizzes by Category</h3>
                    <ul>
                        <li className="quiz-select" onClick={e => this.setCategory('Translation')}><span>Translation</span></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Present Tense')}><span>Present Tense</span></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Imperfect Tense')}><span>Imperfect Tense</span></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Future Tense')}><span>Future Tense</span></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Conditional Tense')}><span>Conditional Tense</span></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Subjunctive Tense')}><span>Subjunctive Tense</span></li>
                    </ul>
                </div>
            )
        }
        const header = `${this.props.quizCategory} Quizzes`;
        return ( 
            <div className="quiz-select-menu main-component">
                <ul>
                    <li><h3>{header}</h3></li>
                    <li className="quiz-select" onClick={e => this.setVerb('er')}><span>-er Verbs</span></li>
                    <li className="quiz-select" onClick={e => this.setVerb('ir')}><span>-ir Verbs</span></li>
                    <li className="quiz-select" onClick={e => this.setVerb('re')}><span>-re Verbs</span></li>
                    <li className="quiz-select" onClick={e => this.setVerb('irregular')}><span>Irregular Verbs</span></li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    quizCategory: state.quizSelect.quizCategory,
    verbCategory: state.quizSelect.verbCategory,
})

export default connect(mapStateToProps)(QuizSelect);
