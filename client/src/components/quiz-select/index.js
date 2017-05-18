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
                    <ul>
                        <li><h3>Quizzes by Category</h3></li>
                        <li className="quiz-select" onClick={e => this.setCategory('Translation')}>Translation</li>
                        <li className="quiz-select" onClick={e => this.setCategory('Present Tense')}>Present Tense</li>
                        <li className="quiz-select" onClick={e => this.setCategory('Imperfect Tense')}>Imperfect Tense</li>
                        <li className="quiz-select" onClick={e => this.setCategory('Future Tense')}>Future Tense</li>
                        <li className="quiz-select" onClick={e => this.setCategory('Conditional Tense')}>Conditional Tense</li>
                        <li className="quiz-select" onClick={e => this.setCategory('Subjunctive Tense')}>Subjunctive Tense</li>
                    </ul>
                </div>
            )
        };
        const header = `${this.props.quizCategory} Quizzes`;
        return (
            <div className="quiz-select-menu main-component">
                <ul>
                    <li><h3>{header}</h3></li>
                    <li className="quiz-select" onClick={e => this.setVerb('er')}>-er Verbs</li>
                    <li className="quiz-select" onClick={e => this.setVerb('ir')}>-ir Verbs</li>
                    <li className="quiz-select" onClick={e => this.setVerb('re')}>-re Verbs</li>
                    <li className="quiz-select" onClick={e => this.setVerb('irregular')}>Irregular Verbs</li>
                    {/*<li className="quiz-select" onClick={e => this.setVerb('all')}>All Verbs</li>*/}
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
