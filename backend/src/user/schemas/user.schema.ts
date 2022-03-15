import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  login: String,
  firstName: String,
  lastName: String,
  photo: String,
  position: String,
  // add link to the team
  // add array contact details [string] [string]
});
