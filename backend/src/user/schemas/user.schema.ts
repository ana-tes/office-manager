import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  login: String,
  firstName: String,
  lastName: String,
  photo: String,
  position: String,
  contacts: [{
    name: { type: String, default: '' },
    value: { type: String, default: '' },
  }],
  // add link to the team
});
