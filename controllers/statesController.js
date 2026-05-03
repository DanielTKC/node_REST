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

const getState = async (req, res) => {
  const state = statesData.find(s => s.code === req.params.state);
  res.json(state);
}


export default  { getStates, getState };