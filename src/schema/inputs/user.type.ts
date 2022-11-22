// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, inputType} from '@loopback/graphql';
import {Services_Input} from './service.type';

@inputType()
export class CredentialsInput {
  @field()
  email: string;

  @field()
  password: string;
}

@inputType()
export class GeoCoordinateInput {
  @field()
  lat: number;

  @field()
  lng: number;
}


@inputType()
export class UserInput {
  @field({
    nullable: false,
  })
  firstName: string;

  @field({
    nullable: false,
  })
  lastName: string;

  @field({
    nullable: false,
  })
  password: string;
}

@inputType()
export class BusinessInput {
  @field({
    nullable: false
  })
  isBusinessLocation: boolean

  @field({
    nullable: false
  })
  isClientLocation: boolean

  @field({
    nullable: false
  })
  isMenService: boolean

  @field({
    nullable: false
  })
  isWomenService: boolean

  @field({
    nullable: false
  })
  address: string

  @field({
    nullable: false
  })
  state: string

  @field({
    nullable: false
  })
  city: string

  @field(type => GeoCoordinateInput, {nullable: false})
  location: GeoCoordinateInput;

  @field(type => [Services_Input], {nullable: false})
  services: Services_Input[]

  @field({nullable: false, })
  schedule: string;

  @field(type => [String], {
    nullable: true,
  })
  images?: string[];
}

@inputType()
export class CredentialInput {
  @field({
    nullable: false,
  })
  email: string;

  @field({
    nullable: false,
  })
  password: string;
}

