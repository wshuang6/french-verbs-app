import React from 'react';
import * as Cookies from 'js-cookie';
import {connect} from 'react-redux';
import { fetchVerbGroup, registerAnswer, updateVerbs} from './actions';
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

	modifyStr(quizType) {
		quizType = quizType.toLowerCase().trim();
		const idx = quizType.indexOf(" ");
		if (idx > -1) { 
			quizType = quizType.substr(0, idx);
		}
		return quizType;
	}

	fetchVerbGroup(group, quizType) {
		// For authentication later, implement cookies
		//const accessToken = Cookies.get('accessToken');
		quizType = this.modifyStr(quizType);
		this.props.dispatch(fetchVerbGroup(group, quizType));
	}

	getQuizTitle() {
		const title = this.props.quizCategory;
		return title[0].toUpperCase()+title.substr(1)+' Quiz: '+this.props.verbCategory+' Verbs';
	}

	makeChoiceJsx(cq) {
		// Based on the randomly organized positions of the correct and incorrect responses
		// for the current question, build out the jsx for each of the possible choices
		return cq.positions.map((choice, index) => {
			if (cq.choice && cq.positions[cq.correctIdx] === choice) {
				// if cq.choice is true, the user has submitted an answer
				// Then this is the correct choice. It will be highlighted green
				return (
					<div key={`${choice}:${index}`} className='choice correct'>
						{choice}
					</div>
				);
			}
			else if (cq.choice === choice && !cq.isCorrect) {
				// Then the user has submitted a response and it was incorrect. It must be 
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
			return (<button onClick={e => this.handleEndQuiz(e)}>Back to quiz menu</button>);
		}
		else if (this.props.quizVerbs.length >= 0) {
			return (<button onClick={e => this.handleNextQuestion(e)}>Next</button>);
		}
	}

	getQuestionPrompt() {
		let quizType = this.modifyStr(this.props.quizCategory);
		if (quizType === 'translation') {
			return this.props.currentVerb.fr;
		} else {
			return `${this.props.person} (${this.props.currentVerb.fr})`;
		}
	}

	// Event handler methods 
	handleChoice(event, choice) {
		// invoked when the user chooses among the multiple choice possibilities
		// also sends the api, the data on the current question
		event.preventDefault();
		if (!this.props.currentQuestion.choice) {
			const cq = this.props.currentQuestion;
			const isCorrect = cq.positions[cq.correctIdx] === choice;
			// sends question and user data to /api
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
		// if there are no verbs left in the quizVerbs queue, the quiz is done
		if (this.props.currentQuestion.choice) {
			if (this.props.quizVerbs.length > 0) {
				let quizType = this.modifyStr(this.props.quizCategory);
				this.props.dispatch(updateVerbs(this.props.quizVerbs, quizType)); 
			}
		}
	}

	handleEndQuiz(event) {
		// Clear out state for the current quiz
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
						<h4>{this.getQuestionPrompt()}</h4>
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
		person: state.quiz.currentQuestion.person,
    quizVerbs: state.quiz.quizVerbs,
		score: state.quiz.score,
		wrong: state.quiz.wrong,
		currentQuestion: state.quiz.currentQuestion,
		currentVerb: state.quiz.currentQuestion.currentVerb,
})

export default connect(mapStateToProps)(Quiz);

