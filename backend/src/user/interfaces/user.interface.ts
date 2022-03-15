import { Document } from 'mongoose';

export interface User extends Document {
  readonly login: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo: string;
  readonly position: string;
  // add link to the team
  // add array contact details [string] [string]
}
