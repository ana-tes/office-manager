import * as mongoose from 'mongoose';

export const TeamSchema = new mongoose.Schema({
  name: String,
  previousTeam: String,
  currentTeam: String,
});
