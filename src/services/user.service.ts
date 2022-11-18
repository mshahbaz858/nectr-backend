import {UserService} from '@loopback/authentication';
import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CredentialsInput} from '../schema/inputs';
import {HasherService} from './hasher.service';

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserService implements UserService<User, CredentialsInput>{
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,

    @service(HasherService)
    public hasher: HasherService
  ) { }

  async verifyCredentials(credentials: CredentialsInput): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email.toLowerCase()
      }
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
    if (!passwordMatched) throw new HttpErrors.Unauthorized('Invalid credentials');

    return foundUser;
  }

  convertToUserProfile(user: any): UserProfile {
    let email = '';
    if (user.email)
      email = user.email;

    return {
      [securityId]: user.id!.toString(),
      id: user.id,
      email: user.email,
    };
  }

}
