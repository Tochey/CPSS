import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3 : {
            bucket : 'submission-bucket',
            event: "s3:ObjectCreated:*",
            existing : true
        }
    }
  ],
};
