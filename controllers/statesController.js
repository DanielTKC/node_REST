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
  const state = statesData.find(s => s.code === req.code);
  const stateMongo = await State.findOne({stateCode: req.code}).exec();
  state.funfacts = (stateMongo && stateMongo.funfacts) ? stateMongo.funfacts : [];
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
  res.json({state: state.state, population: state.admission_date});
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
      return res.status(400).json({message: 'Index  required'});
    }
    if (!funfact) {
      return res.status(400).json({message: 'State fun facts value required'});
    }
    const state = statesData.find(s => s.code === req.code);
    const stateMongo = await State.findOne({stateCode: req.code}).exec();
    // no doc or no facts
    if (!stateMongo || !stateMongo.funfacts || stateMongo.funfacts.length === 0) {
      return res.json({message: `No Fun Facts found for ${state.state}`});
    }
// no fun facts found at the index
    if (index - 1 < 0 || index - 1 >= stateMongo.funfacts.length) {
      return res.status(400).json({message: `No Fun Fact at index ${state.state}`});
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


export default {
  getStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmissionDate,
  getFunFact,
  createFunFact,
  updateFunFact
};