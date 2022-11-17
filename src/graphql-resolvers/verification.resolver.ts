import {inject} from '@loopback/core';
import {arg, GraphQLBindings, mutation, query, resolver, ResolverData} from '@loopback/graphql';
import {VerificationController} from '../controllers';
import {Verification} from '../schema';

@resolver()
export class VerificationResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.VerificationController')
    private verificationController: VerificationController
  ) { }

  @query(returns => String)
  async ping(): Promise<string> {
    return 'pong'
  }

  @mutation(returns => Verification)
  async sendVerificationCode(
    @arg('email') email: string
  ): Promise<Verification> {
    return this.verificationController.sendVerificationCode(
      this.resolverData.context,
      email
    );
  }

}
