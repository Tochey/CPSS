import helloSchema from '@model/apigw/helloSchema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': helloSchema,
          },
        },
      },
    },
  ],
};
