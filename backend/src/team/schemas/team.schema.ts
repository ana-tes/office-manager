import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Team extends Document {
  
  @Prop({ unique: true })
  name: string;

  @Prop()
  previousTeam: string;
  
  @Prop()
  currentTeam: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
