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
  // add link to the team
}
