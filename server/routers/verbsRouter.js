const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { VerbGroup } = require('../models/verbGroup');

const router = express.Router();

// Function for 
function getRandomItem(getArr, total, verbs) {
  let randomNum = Math.floor(Math.random() * total);
  let item = getArr[randomNum];
  if (verbs.indexOf(item) > -1) {
    console.log('recursion');
    return getRandomItem(getArr, total, verbs);
  }
  else {
    return item;
  }
}

router.get('/:group', (req, res) => {
  const { group } = req.params;
  VerbGroup
    .find({group})
    .exec()
    .then(group => {
      // For now, only send back 10 random verbs from the queried group
      let verbs = [];
      const total = group[0].verbs.length;
      for (let i=0; i<10; i++) {
        let item = getRandomItem(group[0].verbs, total, verbs);
        verbs.push(item);
      }
      return res.status(200).json(verbs);
    });
});

module.exports = {verbsRouter: router};