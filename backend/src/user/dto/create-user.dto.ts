import { Types } from 'mongoose';
import { Prop } from "@nestjs/mongoose";
import { IsMongoId, IsOptional } from "class-validator";
import { Team } from '../../team/schemas/team.schema';

export class CreateUserDTO {
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
  
  @IsMongoId()
  @IsOptional()
  @Prop({ type: Types.ObjectId, ref: Team.name })
  readonly team: Team;
}
