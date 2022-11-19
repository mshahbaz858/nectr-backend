import {field, inputType} from '@loopback/graphql'

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
