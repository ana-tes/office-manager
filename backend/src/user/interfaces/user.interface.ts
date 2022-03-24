import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly login: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo: string;
  readonly position: string;
  readonly contacts: [
    {
      name: { type: string; default: '' };
      value: { type: string; default: '' };
    },
  ];
}
