import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
const jwt = require('jsonwebtoken');

const TOKEN_SECRET_VALUE = 'vnJ7icKJ90ca-cpX891*72kxnOpqic&21.ckl*91khfw';
const TOKEN_SECRET_VALUE_VERIFICATION = 'vnJ7icKJ90ca-cpX891*72kxnOpqic&21.ckl*91khfw22';
const TOKEN_EXPIRES_IN_VALUE = 604800; // 7 days in seconds
const VERIFICATION_TOKEN_EXPIRES_IN_VALUE = 7200; // 2 hours in seconds


@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {

  async generateToken(user: UserProfile): Promise<string> {
    const token = jwt.sign(
      {
        exp: Date.now() / 1000 + TOKEN_EXPIRES_IN_VALUE,
        data: {
          id: user.id,
          username: user.username,
        },
      },
      TOKEN_SECRET_VALUE
    );
    return token;
  }

  async generateUserVerificationToken(user: {
    code: string;
    status: string;
    email: string;
  }): Promise<string> {
    const token = jwt.sign(
      {
        exp: Date.now() / 1000 + VERIFICATION_TOKEN_EXPIRES_IN_VALUE,
        data: {
          code: user.code,
          status: user.status,
          email: user.email,
        },
      },
      TOKEN_SECRET_VALUE_VERIFICATION
    );
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`
      )
    };
    return new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN_SECRET_VALUE, async function (err: any, decoded: any) {
        if (err != null) {
          return reject(new HttpErrors.Unauthorized(err.message))
        };

        if (decoded == null) {
          return reject(new HttpErrors.Unauthorized('Authorization header is not type of Bearer'))
        };

        if (decoded.exp <= Date.now() / 1000) {
          return reject(new HttpErrors.Unauthorized('Token expired'));
        }

        let userProfile: UserProfile = Object.assign(
          {[securityId]: '', id: '', name: ''},
          {[securityId]: decoded.data.id, id: decoded.data.id, name: decoded.data.name}
        );

        return resolve(userProfile);
      });
    })
  }

  async verifyUserVerificationToken(token: string): Promise<{
    code: string;
    status: string;
    email: string;
  }> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`
      )
    };
    return new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN_SECRET_VALUE_VERIFICATION, async function (err: any, decoded: any) {
        if (err != null) {
          return reject(new HttpErrors.Unauthorized(err.message))
        };

        if (decoded == null) {
          return reject(new HttpErrors.Unauthorized('Authorization header is not type of Bearer'))
        };

        if (decoded.exp <= Date.now() / 1000) {
          return reject(new HttpErrors.Unauthorized('Token expired'));
        }

        let userProfile: {
          code: string;
          status: string;
          email: string;
        } = Object.assign(
          {code: '', status: '', email: ''},
          {code: decoded.data.code, status: decoded.data.status, email: decoded.data.email}
        );

        return resolve(userProfile);
      });
    })
  }

}
