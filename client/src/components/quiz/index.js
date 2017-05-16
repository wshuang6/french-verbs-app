import React from 'react';
import * as Cookies from 'js-cookie';
import {connect} from 'react-redux';
import { fetchVerbGroup, setChoicesPositions, registerAnswer, updateVerbs } from './actions';
import './quiz.css';

export class Quiz extends React.Component {

	componentDidMount() {
		if (!this.props.quizVerbs) {
			this.fetchVerbGroup('er');
		}
	}

	fetchVerbGroup(group) {
		// For authentication later, implement cookies
		//const accessToken = Cookies.get('accessToken');
		this.props.dispatch(fetchVerbGroup(group));
	}

	getQuizTitle() {
		const title = this.props.quizType;
		return title[0].toUpperCase()+title.substr(1)+' Quiz: '+this.props.verbGroup+' Verbs';
	}

	makeChoiceJsx(cq) {
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

	recordIncorrect(verb) {
		return fetch('/api/verbs', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "PUT",
			body: JSON.stringify(verb)
		})
		.then(res => res.json());
	}

	handleChoice(event, choice) {
		// send correct, incorrect info to backend
		// for spaced repitition algorithm
		event.preventDefault();
		if (!this.props.currentQuestion.choice) {
			const cq = this.props.currentQuestion;
			const isCorrect = this.props.currentVerb.en === choice;
			if (!isCorrect) {
				// tell the api, the user answered incorrectly 
				// for the given tested verb
				this.recordIncorrect(this.props.currentVerb)
				.then(result => console.log(result))
				.catch(err => console.error(err));
			}
			this.props.dispatch(registerAnswer(choice, isCorrect));	
		}
	}

	handleNextQuestion(event) {
		// If the question has been answered, user can go to the next question
		// the following will evaluate to true, if answer has been submitted
		if (this.props.currentQuestion.choice) {
		event.preventDefault();
		// slice off the current question from the total array
		// re-update the total verbs array
		// this will pass us to the next question and update state accordingly
		const newQuizVerbs = this.props.quizVerbs.slice(1)
		console.log(newQuizVerbs);
		this.props.dispatch(updateVerbs(newQuizVerbs)); 
		}
	}

	questionTracker() {
		return `${10 - this.props.quizVerbs.length + 1} /10`;
	}

	render() {
		if (this.props.quizVerbs) {
			return (
				<div className='quiz-wrapper'>
					<div className='title-container'>
						<h3>{this.getQuizTitle()}</h3>
						<div>
							<p>Question: {this.questionTracker()}</p>
							<p>Score: {this.props.score}</p>
						</div>
						<h4>{this.props.currentVerb.fr}</h4>
					</div>
					{this.getchoices()}
					<button onClick={e => this.handleNextQuestion(e)}>Next</button>
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
		verbGroup: state.quiz.verbGroup,
    quizVerbs: state.quiz.quizVerbs,
		quizType: state.quiz.quizType,
		score: state.quiz.score,
		currentQuestion: state.quiz.currentQuestion,
		currentVerb: state.quiz.currentQuestion.currentVerb,
})

export default connect(mapStateToProps)(Quiz);

