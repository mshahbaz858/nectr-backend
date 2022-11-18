import {field, ID, objectType} from '@loopback/graphql';
import {property} from '@loopback/repository';

@objectType({description: 'GeoCoordinate object'})
export class GeoCoordinate {
  @field()
  lat: number;

  @field()
  lng: number;
}

@objectType({description: 'User object'})
export class User {
  @field(type => ID)
  id: string;

  @field({nullable: false})
  @property()
  email: string;

  @field({nullable: false})
  @property()
  firstName: string;

  @field({nullable: false})
  @property()
  lastName: string;

  @field({nullable: false})
  @property()
  createdAt: Date;

  @field({nullable: false})
  @property()
  updatedAt: Date;
}

@objectType({description: 'Business object'})
export class Business {
  @field(type => ID)
  id: string;

  @field({nullable: false})
  @property()
  isBusinessLocation: boolean;

  @field({nullable: false})
  @property()
  isClientLocation: boolean;

  @field({nullable: false})
  @property()
  isMenService: boolean;

  @field({nullable: false})
  @property()
  isWomenService: boolean;

  @field({nullable: false})
  @property()
  address: string;

  @field({nullable: false})
  @property()
  state: string;

  @field({nullable: false})
  @property()
  city: string;

  @field(type => GeoCoordinate, {nullable: false})
  location: GeoCoordinate;

  @field({nullable: false})
  @property()
  schedule: string;

  @field(type => [String], {nullable: true})
  @property()
  images?: string[];

  @field(type => ID, {nullable: false})
  userId: string;
}

@objectType({description: 'Authenticated user, business details and access jwt token'})
export class AuthenticatedUser {
  @field(type => User)
  user: User;

  @field(type => Business)
  business: Business;

  @field()
  token: string;
}

