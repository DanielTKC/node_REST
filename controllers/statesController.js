import statesData from '../models/statesData.json' with { type: 'json' };


const getStates = async (req, res) => {
  let states = statesData;
  if (req.query.contig === 'true') {
    states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (req.query.contig === 'false') {
    states = states.filter(state => state.code === 'AK' || state.code === 'HI');
  }
  res.json(states);
}

const getState = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json(state);
}

const getCapital = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, capital: state.capital_city });
}

const getNickname = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  res.json({ state: state.state, nickname: state.nickname });
}
export default  { getStates, getState, getCapital, getNickname};