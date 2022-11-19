// @inputType({description: "List of subServices"})
// export class SubServicesInput {
//   @field({nullable: false})
//   name: string

import {field, ID, objectType} from '@loopback/graphql';
import {property} from '@loopback/repository';

//   @field({nullable: false})
//   price: number
// }

// @inputType({description: "List of services"})
// export class ServicesInput {
//   @field({nullable: false})
//   name: string

//   @field({nullable: true})
//   price?: number

//   @field(type => [SubServicesInput], {nullable: true})
//   subServices?: SubServicesInput[]
// }

// @inputType({description: "List of subCatagories"})
// export class SubCatagoriesInput {
//   @field({nullable: false})
//   name: string

//   @field(type => [ServicesInput], {nullable: false})
//   services: ServicesInput[]

// }

// @inputType({description: "List of Catagories"})
// export class ServiceListInput {
//   @field({nullable: false})
//   name: string

//   @field(type => [SubCatagoriesInput], {nullable: false})
//   subCatagories: SubCatagoriesInput[]

// }


@objectType({description: 'Subservices object'})
export class SubServices {
  @field(type => ID)
  id: number;

  @field({nullable: false})
  @property()
  name: string;

  @field({nullable: false})
  @property()
  price: number;
}

@objectType({description: 'Services object'})
export class Services {
  @field(type => ID)
  id: number;

  @field({nullable: false})
  @property()
  name: string;

  @field({nullable: true})
  @property()
  price?: number;

  @field(type => [SubServices], {nullable: true})
  subServices?: SubServices[];
}


@objectType({description: 'SubCatagories object'})
export class SubCatagories {
  @field(type => ID)
  id: number;

  @field({nullable: false})
  @property()
  name: string;

  @field(type => [Services], {nullable: false})
  services: Services[];
}

@objectType({description: 'ServiceList object'})
export class ServiceList {
  @field(type => ID)
  id: number;

  @field({nullable: false})
  @property()
  name: string;

  @field(type => [SubCatagories], {nullable: false})
  subCatagories: SubCatagories[];
}


