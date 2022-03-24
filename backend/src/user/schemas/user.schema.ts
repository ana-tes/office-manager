import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Team } from '../../team/schemas/team.schema';

@Schema()
export class User extends Document {
  
  @Prop()
  login: string;

  @Prop()
  firstName: string;
  
  @Prop()
  lastName: string;
  
  @Prop()
  photo: string;
  
  @Prop()
  position: string;
  
  @Prop()
  contacts: [
    {
      name: { type: string; default: '' };
      value: { type: string; default: '' };
    },
  ];

  @Prop({ type: Types.ObjectId, ref: Team.name })
  team: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
