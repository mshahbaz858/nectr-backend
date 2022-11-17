import {field, objectType} from '@loopback/graphql';


@objectType({description: 'Verification Code'})
export class Verification {
  @field({nullable: true})
  token: string;
}
