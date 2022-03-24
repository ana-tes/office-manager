import { Document } from 'mongoose';

export interface ITeam extends Document {
  
  readonly name: string;
}
