require('dotenv').config();

export const constants = {
  app: {
    name: process.env.APPNAME,
    version: process.env.APPVERSION,
    port: process.env.APP_PORT,
    apiPrefix: process.env.API_PREFIX,
  },
  mongodb: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    timeUnit: process.env.JWT_TIME_UNIT,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
  email: {
    from: process.env.FROM_EMAIL,
    fromName: process.env.FROM_NAME,
  },
};
