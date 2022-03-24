import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
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
  
  @Type(() => Team)
  @ValidateNested()
  readonly team: Team;
}
