import {inject} from '@loopback/core'
import {post, Request, requestBody, Response, RestBindings} from '@loopback/rest'
import multer from 'multer'
import stream from 'stream'
import {AwsService} from '../services'

const {Duplex} = stream

function bufferToStream(buffer: Buffer) {
  const duplexStream = new Duplex()
  duplexStream.push(buffer)
  duplexStream.push(null)
  return duplexStream
}

export class StorageController {

  s3: AwsService;

  constructor() {
    this.s3 = new AwsService();
  }

  @post('/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  async upload(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {

    return new Promise<object>((resolve, reject) => {

      const storage = multer.memoryStorage()
      const upload = multer({storage})

      upload.any()(request, response, async (err: any) => {
        if (err) reject(err)
        else {
          let res = new Array()
          for (const file of (request as any).files) {
            const now = new Date();
            const name_parts = file.originalname.split(".");
            const name = name_parts[0];
            const extension = name_parts.length > 1 ? name_parts[name_parts.length - 1] : 'undefined';
            let key = name + '_' + now.getTime() + '.' + extension;
            const mime = file.mimetype.split('/')[0];
            if (mime === 'video') {
              key = 'videos/' + key;;
            }
            const body = bufferToStream(file.buffer);
            try {
              let stored = await this.s3.uploadToS3(key, body);
              if (mime === 'video') {
                stored = stored.replace('videos/', '');
              }
              res.push(stored)
            } catch (err) {
              reject(err)
            }
          }
          resolve(res)
        }
      })
    })
  }
}
