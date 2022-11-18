import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
const crypto = require('crypto');

const SALT_LENGTH: number = 32;
const HASH_LENGTH: number = 64;
const HASH_ALG: string = 'sha512';
const HASH_ITERATIONS: number = 100000;

@injectable({scope: BindingScope.TRANSIENT})
export class HasherService implements PasswordHasher {
  constructor() { }

  generateSalt() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(
        SALT_LENGTH,
        function (err: any, buf: Buffer) {
          if (err) {
            reject();
          }
          const salt = buf.toString('base64');
          resolve(salt);
        });
    });
  };

  async hashPassword(password: string): Promise<string> {
    const salt = await this.generateSalt();
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        HASH_ITERATIONS,
        HASH_LENGTH,
        HASH_ALG,
        async function (
          err: any,
          derivedKey: any
        ) {
          if (err) {
            reject(err);
          }
          let hashedPassword: string = salt + derivedKey.toString('base64');
          resolve(hashedPassword);
        });
    });
  };

  async comparePassword(providedPassword: string, storedPassword: string): Promise<boolean> {

    const salt = storedPassword.substr(
      0,
      SALT_LENGTH + 12 // +12 because salt was generated in bytes but is stored as base64
    );

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        providedPassword,
        salt,
        HASH_ITERATIONS,
        HASH_LENGTH,
        HASH_ALG,
        async function (
          err: any,
          derivedKey: any
        ) {
          if (!derivedKey) reject(new HttpErrors.InternalServerError());

          if (storedPassword === salt + derivedKey.toString('base64')) {
            resolve(true);
          } else {
            resolve(false)
          }
        });
    })
  }
}


export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(provdedPass: T, storedPass: T): Promise<boolean>
}
