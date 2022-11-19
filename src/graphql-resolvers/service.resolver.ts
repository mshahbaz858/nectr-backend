import {inject} from '@loopback/core';
import {arg, GraphQLBindings, mutation, query, resolver, ResolverData} from '@loopback/graphql';
import {CatagoryController} from '../controllers';
import {ServiceList, ServiceListInput} from '../schema';

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

}


