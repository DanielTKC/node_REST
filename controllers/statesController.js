import statesData from '../models/statesData.json' with {type: 'json'};

import State from '../models/State.js';

// GET requests

const getStates = async (req, res) => {
  let states = statesData;
  if (req.query.contig === 'true') {
    states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (req.query.contig === 'false') {
    states = states.filter(state => state.code === 'AK' || state.code === 'HI');
  }
  res.json(states);
}

const getState = async (req, res) => {
  // using the spread operator to make a shallow copy because i kept mutating the original array.
  const state = {...statesData.find(s => s.code === req.code)};
  const stateMongo = await State.findOne({stateCode: req.code}).exec();
  // only attach funfacts when a doc ACTUALLY exists.
  // NH has no mongo doc so should have 19 properties
  // KS has mongo with facts so it gets added and has 20 properties
  // RI has a mongo doc with [] funfacts
  // I assumed earlier i needed to add a mongo doc with [] to every state because of the RI [] lol whoops!
  if (stateMongo) state.funfacts = stateMongo.funfacts;
  res.json(state);
}

const getFunFact = async (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  const stateMongo = await State.findOne({stateCode: req.code}).exec();

  if (!stateMongo || !stateMongo.funfacts || stateMongo.funfacts.length === 0) {
    return res.json({message: `No Fun Facts found for ${state.state}`});
  }

  const randomFact = stateMongo.funfacts[Math.floor(Math.random() * stateMongo.funfacts.length)];
  res.json({funfact: randomFact});
}

const getCapital = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({state: state.state, capital: state.capital_city});
}

const getNickname = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({state: state.state, nickname: state.nickname});
}

const getPopulation = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({state: state.state, population: state.population.toLocaleString()});
}

const getAdmissionDate = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({state: state.state, admitted: state.admission_date});
}

// POST
const createFunFact = async (req, res) => {
  // create the funfacts array and validate it exists and is an array
  try {
    const {funfacts} = req.body;

    if (!funfacts) {
      return res.status(400).json({message: 'State fun facts value required'});
    }
    if (!Array.isArray(funfacts)) {
      return res.status(400).json({message: 'State fun facts value must be an array'});
    }
    const state = await State.findOneAndUpdate(
      {stateCode: req.code},
      // append each funfact to the funfacts array in the document
      {$push: {funfacts: {$each: funfacts}}},
      {returnDocument: 'after', upsert: true}
    );
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });  // Today I learned time can be lost waiting on a response that never comes.
  }
}

// Patch

const updateFunFact = async (req, res) => {
  try {
    const {index, funfact} = req.body;
    // validation for index and funfact
    if (!index) {
      return res.status(400).json({message: 'State fun fact index value required'});
    }
    if (!funfact) {
      return res.status(400).json({message: 'State fun fact value required'});
    }
    const state = statesData.find(s => s.code === req.code);
    const stateMongo = await State.findOne({stateCode: req.code}).exec();
    // no doc or no facts
    if (!stateMongo || !stateMongo.funfacts || stateMongo.funfacts.length === 0) {
      return res.json({message: `No Fun Facts found for ${state.state}`});
    }
// no fun facts found at the index
    if (index - 1 < 0 || index - 1 >= stateMongo.funfacts.length) {
      return res.status(400).json({message: `No Fun Fact found at that index for ${state.state}`});
    }
    // otherwise update
    stateMongo.funfacts[index - 1] = funfact;
    const result = await stateMongo.save();
    res.json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

}

const deleteFunFact = async (req, res) => {
  try {
    const {index} = req.body;
    // make sure index is in the body
    if (!index) {
      return res.status(400).json({message: 'State fun fact index value required'});
    }
    const state = statesData.find(s => s.code === req.code);
    const stateMongo = await State.findOne({stateCode: req.code}).exec();
    // if no facts found
    if (!stateMongo || !stateMongo.funfacts || stateMongo.funfacts.length === 0) {
      return res.status(404).json({message: `No Fun Facts found for ${state.state}`});
    }
    // if no fun facts found at that index
    if (index - 1 < 0 || index - 1 >= stateMongo.funfacts.length) {
      return res.status(400).json({message: `No Fun Fact found at that index for ${state.state}`});
    }
    stateMongo.funfacts.splice(index - 1, 1);
    const result = await stateMongo.save();
    res.json(result);





  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}


export default {
  getStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmissionDate,
  getFunFact,
  createFunFact,
  updateFunFact,
  deleteFunFact,

};