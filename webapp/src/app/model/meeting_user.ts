export class MeetingUser {
  constructor(
     public mid: number,
     public username: string,
     public externals: string[],
     public tookPart?: boolean,
     public dateOfRegistration?: Date,
     public dateOfConfirmation?: Date
     ) {  }
}
