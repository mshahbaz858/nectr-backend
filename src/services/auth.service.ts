import { /* inject, */ BindingScope, inject, injectable, service } from '@loopback/core';
import { LoggingBindings, WinstonLogger } from '@loopback/logging';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { UserRepository } from '../repositories';
import { JwtService } from './jwt.service';

@injectable({ scope: BindingScope.SINGLETON })
export class AuthService {

  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @service(JwtService)
    public jwtService: JwtService
  ) { }

  async authenticate(resolverData: any, roles: string[]): Promise<boolean> {
    try {
      let context = resolverData.context as any;
      let req = context['req']
      let headers = req['headers'];

      if (!headers.authorization) {
        throw new HttpErrors.Unauthorized('Authorization is missing');
      }
      const authHeaderValue = headers.authorization;

      if (!authHeaderValue.startsWith('Bearer')) {
        throw new HttpErrors.Unauthorized('Authorization header is not type of Bearer');
      }

      const parts = authHeaderValue.split(' ');
      if (parts.length !== 2) {
        throw new HttpErrors.Unauthorized(`Authorization header must follow the pattern 'Bearer xx.yy.zz`)
      }
      const token = parts[1];

      const userProfile: any = await this.jwtService.verifyToken(token);
      if (!userProfile) {
        throw new HttpErrors.Unauthorized(`Invalid credentials`)
      }
      const user = await this.userRepository.findById(userProfile[securityId]);
      if (!user) {
        throw new HttpErrors.Unauthorized(`Invalid credentials`)
      }
      if (roles.findIndex(roleId => roleId === user.roleId) < 0) {
        throw new HttpErrors.Forbidden("User doesn't has the required privileges")
      }

      context['user'] = user;
      return true;
    } catch (error) {
      this.logger.error("TokenAuthenticationError", error);
      throw error
    }

  }
}
