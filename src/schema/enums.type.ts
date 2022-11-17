import {registerEnumType} from '@loopback/graphql';

export enum VERIFICATION_STATUS {
  CODE_SENT = 'CODE_SENT',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  USED = 'USED'
}

registerEnumType(VERIFICATION_STATUS, {
  name: "VERIFICATION_STATUS"
});
