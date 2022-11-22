import {field, ID, inputType} from '@loopback/graphql'

@inputType({description: "List of subServices"})
export class SubServicesInput {
  @field({nullable: false})
  name: string

  @field({nullable: false})
  price: number
}

@inputType({description: "List of services"})
export class ServicesInput {
  @field({nullable: false})
  name: string

  @field({nullable: true})
  price?: number

  @field(type => [SubServicesInput], {nullable: true})
  subServices?: SubServicesInput[]
}

@inputType({description: "List of subCatagories"})
export class SubCatagoriesInput {
  @field({nullable: false})
  name: string

  @field(type => [ServicesInput], {nullable: false})
  services: ServicesInput[]
}

@inputType({description: "List of Catagories"})
export class ServiceListInput {
  @field({nullable: false})
  name: string

  @field(type => [SubCatagoriesInput], {nullable: false})
  subCatagories: SubCatagoriesInput[]
}


// Input for adding selected services.
@inputType({description: "List of business subServices"})
export class BusinessSubServicesInput {
  @field(type => ID, {nullable: false})
  id: number;

  @field({nullable: false})
  name: string

  @field({nullable: false})
  price: number
}

@inputType({description: "List of business services"})
export class BusinessServicesInput {
  @field(type => ID, {nullable: false})
  id: number;

  @field({nullable: false})
  name: string;

  @field({nullable: true})
  price?: number

  @field(type => [BusinessSubServicesInput], {nullable: true})
  subServices?: BusinessSubServicesInput[]
}

@inputType({description: "List of business subCatagories"})
export class BusinessSubCatagoriesInput {
  @field(type => ID, {nullable: false})
  id: number

  @field(type => [BusinessServicesInput], {nullable: false})
  services: BusinessServicesInput[]
}


@inputType({description: "List of business catagories"})
export class Services_Input {
  @field(type => ID, {nullable: false})
  catagoryId: number

  @field(type => ID, {nullable: false})
  subCatagoryId: number

  @field(type => ID, {nullable: false})
  serviceId: number;

  @field({nullable: false})
  name: string;

  @field({nullable: true})
  price?: number

  @field(type => [BusinessSubServicesInput], {nullable: true})
  subServices?: BusinessSubServicesInput[]
}

@inputType({description: "List of business catagories"})
export class BusinesServicesInput {
  @field(type => ID, {nullable: false})
  id: number

  @field(type => [BusinessSubCatagoriesInput], {nullable: false})
  subCatagories: BusinessSubCatagoriesInput[]
}







