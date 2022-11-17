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

  @mutation(returns => Verification)
  async verify(
    @arg("token", type => String) token: string,
    @arg("code", type => String) code: string
  ): Promise<Verification> {
    return this.verificationController.verify(
      this.resolverData.context,
      token,
      code
    )
  }

  @mutation(returns => Verification)
  async sendResetVerificationCode(
    @arg("email") email: string
  ): Promise<Verification> {
    return this.verificationController.sendResetVerificationCode(
      this.resolverData.context,
      email
    );
  }

}
