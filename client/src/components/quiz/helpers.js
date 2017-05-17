import Queue from './queue';

export function makeQueue(verbsArr) {
  const verbsQueue = new Queue();
  for (let i=0; i<verbsArr.length; i++) {
    verbsQueue.enqueue(verbsArr[i]);
  }
  return verbsQueue;
}

export function getIncorrectChoices(verbs, current, incorrect=[]) {
  // This function will get random incorrect answers by looping over the entire 
  // array of verbs, grabbing random english translations from other verb objects
  if (incorrect.length === 3) {
    return incorrect;
  }
  let randomIdx = Math.floor(Math.random() * verbs.length);
  let item = verbs[randomIdx];
  if (incorrect.indexOf(item.en) > -1 || item.en === current) {
    return getIncorrectChoices(verbs, current, incorrect);
  }
  incorrect.push(item.en);
  return getIncorrectChoices(verbs, current, incorrect);
}

export function getPositions(correct, incorrectArr) {
  // This function randomly shuffles the incorrect answers and the correct answer 
  // with an array and returns the new array
  let positions = [];
  let correctIdx;
  let correctRandom = Math.floor(Math.random() * 4);
  let random = Math.floor(Math.random() * 4);
  let i = 0;
  let isPushed = false;
  while (positions.length < 4) {
    if (random === correctRandom && !isPushed) {
      positions.push(correct);
      correctIdx = positions.length - 1;
      isPushed = true;
    }
    else if (i < incorrectArr.length) {
      positions.push(incorrectArr[i]);
      i++;
    }
    random = Math.floor(Math.random() * 4);
  }
	return {positions, correctIdx};
}

// Tense quiz specific functions
function getTensePerson(tense, currentVerb) {
  let singular = ['Je', 'Tu', 'Il/Elle']; 
  let plural = ['Nous', 'Vous', 'Ils/Elles'];
  let randomIdx = Math.floor(Math.random() * 6);
  // Randomly grab the 'person' and the correct conjugation for that person
  // for the current verb. Then return this data as an object
  if (randomIdx <= 2) {
    return { 
            person: singular[randomIdx], 
            answer: currentVerb[tense].singular[randomIdx]
           };
  }
  else {
    return { 
            person: plural[randomIdx - 3], 
            answer: currentVerb[tense].plural[randomIdx]
           };
  }
}

export function getTenseQuizChoices(tense, currentVerb, choices=[], res) {
  if (!res) {
    // res is an object with the 'person' to quiz and the correct conjugation (answer)
    // for that person given the current verb
    res = getTensePerson(tense, currentVerb);
    res.correctIdx = Math.floor(Math.random() * 4);
  }
  else if (choices.length === 4) {
    // Base case: choices are sorted and all other quiz data is stored on res object
    return { choices, res };
  }
  else if (choices.length === res.correctIdx) {
    // Then you can push the correct answer stored on 'res'
    choices.push(res.answer);
    return getTenseQuizChoices(tense, currentVerb, choices, res);
  }
  else {
    // Then we can get a random incorrect choice to add to our choices array
    let randomIdx = Math.floor(Math.random() * 6);
    let item;
    if (randomIdx <= 2) {
      // then get from the singular choices
      item = currentVerb[tense].singular[randomIdx];
    }
    else {
      // then get from the plural choices of the current verb and tense
      item = currentVerb[tense].plural[randomIdx];
    }
    if (item !== res.answer && choices.indexOf(item) === -1) {
      // This random item cannot be the answer nor can it already be in the choices array
      choices.push(item);
    }
    return getTenseQuizChoices(tense, currentVerb, choices, res);
  }
}