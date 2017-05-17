import React from 'react';
import * as Cookies from 'js-cookie';
import {connect} from 'react-redux';
import { fetchVerbGroup, 
				 setChoicesPositions, 
				 registerAnswer, 
				 updateVerbs, 
				 clearCurrent } from './actions';
import './quiz.css';

import { setCategory, setVerb } from '../quiz-select/actions'

export class Quiz extends React.Component {

	// Lifecycle methods
	componentDidMount() {
		if (this.props.verbCategory && this.props.quizCategory) {
			this.fetchVerbGroup(this.props.verbCategory, this.props.quizCategory);
		}
	}

	componentWillUnmount() {
		console.log('unmounting');
	}

	fetchVerbGroup(group, quizType) {
		// For authentication later, implement cookies
		//const accessToken = Cookies.get('accessToken');
		this.props.dispatch(fetchVerbGroup(group, quizType));
	}

	getQuizTitle() {
		const title = this.props.quizCategory;
		return title[0].toUpperCase()+title.substr(1)+' Quiz: '+this.props.verbCategory+' Verbs';
	}

	makeChoiceJsx(cq) { // -> update for tense quizzes
		// Based on the randomly organized positions of the correct and incorrect
		// responsees for the current question, build out the jsx for each of the 
		// responses. The attributes vary based on whether or not a response has been
		// submitted (color functionality is implemented here).
		return cq.positions.map((choice, index) => {
			if (cq.choice && this.props.currentVerb.en === choice) {
				// Then this is the correct choice. It will be highlighted green
				return (
					<div key={`${choice}:${index}`} className='choice correct'>
						{choice}
					</div>
				);
			}
			else if (cq.choice === choice && !cq.isCorrect) {
				// The the user has submitted a response and it was incorrect. It must be 
				// highlighted red
				return (
					<div key={`${choice}:${index}`} className='choice wrong'>
							{choice}
					</div>
				);
			}
			else {
				return (
					// The default is no highlight, therefore the className is only 'choice'
					<div key={`${choice}:${index}`} className='choice' onClick={e => this.handleChoice(e, choice)} >
							{choice}
					</div>
				);
			}
		});
	}

	getchoices() {
		let jsxChoices = <p>Loading</p>;
		if (this.props.currentQuestion) {
			let cq = this.props.currentQuestion;
			jsxChoices = this.makeChoiceJsx(cq);
		}
		return (
			<div className='choices-bin'>
				{jsxChoices}
			</div>
		);
	}

	getUserInfo() {
		// Display the state of the quiz to the user
		if (this.props.quizVerbs.length === 0 && this.props.currentQuestion.choice) {
			// the quiz is over, so display the final message to the user
			// with their final score
			return (
				<div className='user-info'>
					<h4>You completed the {this.props.quizCategory} quiz!</h4>
					<p>You correctly answered {this.props.score} questions with {this.props.wrong} incorrect</p>
				</div>
			);
		}
		else if (this.props.quizVerbs.length >= 0) {
			// the quiz continues
			return (
				<div className='user-info-flex'>
					<p>Question: {`${this.props.score + this.props.wrong}`}</p>
					<p>Score: {this.props.score}</p>
				</div>
			);
		}
	}

	getBtn() {
		if (this.props.quizVerbs.length === 0 && this.props.currentQuestion.choice) {
			// the quiz is over if this condition is met
			// this needs to link you back to the quiz menu with react router
			return (<button onClick={e => this.handleEndQuiz(e)}>Back to quiz menu</button>);
		}
		else if (this.props.quizVerbs.length >= 0) {
			return (<button onClick={e => this.handleNextQuestion(e)}>Next</button>);
		}
	}

	// Event handler methods 
	handleChoice(event, choice) {
		// invoked when the user chooses among the multiple choice possibilities
		event.preventDefault();
		if (!this.props.currentQuestion.choice) {
			const cq = this.props.currentQuestion;
			const isCorrect = this.props.currentVerb.en === choice;
			// tell the api, the user answered incorrectly 
			// for the given tested verb
			this.recordAnswer(this.props.currentVerb, isCorrect)
			.then(result => console.log(result))
			.catch(err => console.error(err));
			// Register the user's answer with the store to update state
			this.props.dispatch(registerAnswer(choice, isCorrect, this.props.currentVerb));	
		}
	}

	recordAnswer(verb, isCorrect) {
		return fetch('/api/verbs', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "PUT",
			body: JSON.stringify({verb, isCorrect})
		})
		.then(res => res.json());
	}
	
	handleNextQuestion(event) {
		// If the current question has been answered, user can go to the next question
		// the following will evaluate to true, if answer has been submitted
		if (this.props.currentQuestion.choice) {
			event.preventDefault();
			// slice off the current question from the total array
			// re-update the total verbs array
			// this will pass us to the next question and update state accordingly
			if (this.props.quizVerbs.length > 0) {
				// if there is only one verb left in the quizVerbs array, the quiz is done
				this.props.dispatch(updateVerbs(this.props.quizVerbs, this.props.quizCategory)); 
			}
		}
	}

	handleEndQuiz(event) {
		// dispatch new action to clear out state for the current
		// quiz in preparation for receiving new quiz data
		event.preventDefault();
		//this.props.dispatch(clearCurrent());
		this.props.dispatch(setCategory(null));
		this.props.dispatch(setVerb(null));
	}

	render() {
		if (this.props.quizVerbs) {
			return (
				<div className='quiz-wrapper'>
					<div className='title-container'>
						<h3>{this.getQuizTitle()}</h3>
						<div>
							{this.getUserInfo()}
						</div>
						<h4>{this.props.currentVerb.fr}</h4>
					</div>
					{this.getchoices()}
					{this.getBtn()}
				</div>
			);
		}
		else {
			return (
				<div className='quiz-wrapper'>Loading</div>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	  quizCategory: state.quizSelect.quizCategory,
    verbCategory: state.quizSelect.verbCategory,
    quizVerbs: state.quiz.quizVerbs,
		score: state.quiz.score,
		wrong: state.quiz.wrong,
		currentQuestion: state.quiz.currentQuestion,
		currentVerb: state.quiz.currentQuestion.currentVerb,
})

export default connect(mapStateToProps)(Quiz);
