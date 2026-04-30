import statesData from '../models/statesData.json' with { type: 'json' };


const getAllStates = async (req, res) => {
  res.json(statesData);
}

export default  { getAllStates };