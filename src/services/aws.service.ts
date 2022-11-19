import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
const AWS = require('aws-sdk');
const BUCKET = process.env.S3_BUCKET ?? 'doerz-fitty';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN ?? 'https://d2vkhjsuk6abaq.cloudfront.net/'

@injectable({scope: BindingScope.TRANSIENT})
export class AwsService {
  s3;
  constructor(/* Add @inject to inject parameters */) {
    this.s3 = new AWS.S3();

  }

  async uploadToS3(key: string, file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {Bucket: BUCKET, Key: key, Body: file};
      this.s3.upload(params, function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        if (CLOUDFRONT_DOMAIN) {
          resolve(CLOUDFRONT_DOMAIN + key);
        }
        if (data?.Location) resolve(data.Location);
        reject(new HttpErrors.ExpectationFailed("Upload service failed"))
      })
    })
  }

}
