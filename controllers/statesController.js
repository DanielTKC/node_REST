import statesData from '../models/statesData.json' with { type: 'json' };

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
  const stateMongo = await State.findOne({stateCode: req.code }).exec();

  if (!stateMongo || !stateMongo.funfacts || stateMongo.funfacts.length === 0) {
    return res.json({ message: `No Fun Facts found for ${state.state}` });
  }

  const randomFact = stateMongo.funfacts[Math.floor(Math.random() * stateMongo.funfacts.length)];
  res.json({ funfact: randomFact });
}

const getCapital = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, capital: state.capital_city });
}

const getNickname = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, nickname: state.nickname });
}

const getPopulation = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, population: state.population });
}

const getAdmissionDate = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, population: state.admission_date });
}

// POST
const addFunFact = async (req, res) => {
  const { funfacts }  = req.body;
  if (!funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
}


export default  { getStates, getState, getCapital, getNickname, getPopulation, getAdmissionDate, getFunFact, addFunFact };