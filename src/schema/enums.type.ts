import {registerEnumType} from '@loopback/graphql';

export enum VERIFICATION_STATUS {
  CODE_SENT = 'CODE_SENT',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  USED = 'USED'
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS',
  CONSUMER = 'CONSUMER'
}

registerEnumType(VERIFICATION_STATUS, {
  name: "VERIFICATION_STATUS"
});
