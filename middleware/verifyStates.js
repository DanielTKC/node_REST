import statesData from '../models/statesData.json' with { type: 'json' };

const stateCodes = statesData.map(state => state.code);
const verifyStates = async (req, res, next) => {
  const code = req.params.state?.toUpperCase();
  if (!stateCodes.includes(code)) {
    return res.status(400).json({message: 'Invalid state Code'});
  }
  req.params.state = code;
  next();
};

export default verifyStates;
