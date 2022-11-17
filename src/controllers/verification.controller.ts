// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {Verification, VERIFICATION_STATUS} from '../schema';
import {JwtService, MailService, UtilsService} from '../services';

// import {inject} from '@loopback/core';


export class VerificationController {

  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @service(UtilsService)
    private utilService: UtilsService,

    @service(MailService)
    private mailService: MailService,

    @service(JwtService)
    private jwtService: JwtService,

  ) { }

  async sendVerificationCode(resolver: any, email: string): Promise<Verification> {
    const existingUser = await this.userRepo.findOne({where: {email: email.toLowerCase()}});
    if (existingUser) throw new HttpErrors.Conflict("User Already Exist, try login");
    try {
      const code = await this.utilService.generateRandomNumber(6)
      this.mailService.sendVerificationCode(email, code)
      const encodeVerficationTokenInput = {
        code,
        status: VERIFICATION_STATUS.CODE_SENT,
        email
      }
      const token = await this.jwtService.generateUserVerificationToken(encodeVerficationTokenInput)
      return {token}
    } catch (error) {
      this.logger.error("sendVerificationCodeError", error);
      throw error
    }
  }

}
