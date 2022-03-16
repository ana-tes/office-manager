import { Document } from 'mongoose';

export interface Team extends Document {
  readonly name: string;
  readonly previousTeam: string;
  readonly currentTeam: string;
}
