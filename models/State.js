import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const statesSchema = new Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true
  },

  funfacts: [String]

});

export default mongoose.model('State', statesSchema);
