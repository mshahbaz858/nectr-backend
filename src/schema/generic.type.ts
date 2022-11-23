// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, inputType, objectType} from '@loopback/graphql';

@objectType({description: 'Generic success response'})
export class Success {

  @field({
    nullable: false,
    description: 'true if operation was succesful',
  })
  success: boolean;
}


@objectType({description: 'Generic success response'})
export class VerificationStatus {

  @field({
    nullable: false,
    description: 'True if successfully verified',
  })
  verified: boolean;

  @field({
    nullable: false,
    description: 'Current verification state',
  })
  status: string;

  @field({
    nullable: true,
    description: '',
  })
  message?: string;
}

@objectType({description: 'Pagination info'})
export class Pagination {

  @field({
    nullable: false,
    description: 'Total number of records',
  })
  total: number;

  @field({
    nullable: false,
    description: 'Page number',
  })
  page: number;

  @field({
    nullable: true,
    description: 'Number of records on this page',
  })
  count: number;
}

@inputType({description: "Service Offers"})
export class ServiceOfferingInput {
  @field(type => String, {nullable: false})
  name: string

  @field({nullable: false})
  price: number

  @field({nullable: false})
  serviceId: number

  @field(type => String, {nullable: false})
  businessId: string
}

@inputType({description: "Business Catagory"})
export class BusinessCatagory {
  @field(type => String, {nullable: false})
  businessId: string

  @field({nullable: false})
  catagoryId: number
}


@inputType({description: "Business SubCatagory"})
export class BusinessSubCatagory {
  @field(type => String, {nullable: false})
  businessId: string

  @field({nullable: false})
  subCatagoryId: number
}


