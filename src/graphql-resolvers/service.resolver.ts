import {inject} from '@loopback/core';
import {arg, GraphQLBindings, ID, mutation, query, resolver, ResolverData} from '@loopback/graphql';
import {CatagoryController} from '../controllers';
import {ServiceList, ServiceListInput, Services, ServicesInput, Success} from '../schema';

@resolver()
export class ServiceResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.CatagoryController')
    private catagoryController: CatagoryController
  ) { }

  @mutation(returns => [ServiceList])
  async createServices(
    @arg("services", type => [ServiceListInput]) services: ServiceListInput[],
  ): Promise<ServiceList[]> {
    return this.catagoryController.createServices(
      this.resolverData.context,
      services
    );
  }

  @query(returns => [ServiceList])
  async getStandardServices(): Promise<ServiceList[]> {
    return this.catagoryController.getStandardServices(
      this.resolverData.context,
    );
  }

  @mutation(returns => Services)
  async addServiceCatagory(
    @arg("services", type => ServicesInput) services: ServicesInput,
    @arg("subCatagoryId", type => ID) subCatagoryId: number,
  ): Promise<Services> {
    return this.catagoryController.addServiceCatagory(
      this.resolverData.context,
      services,
      subCatagoryId
    );
  }

  @mutation(returns => Success)
  async removeServiceCatagory(
    @arg("serviceId", type => ID) serviceId: number,
  ): Promise<Success> {
    return this.catagoryController.removeServiceCatagory(
      this.resolverData.context,
      serviceId
    );
  }
}


