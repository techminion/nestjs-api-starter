require('dotenv').config();

export const constants = {
  app: {
    name: process.env.APPNAME,
    version: process.env.APPVERSION,
    port: process.env.APP_PORT,
  },
  mongodb: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    timeUnit: process.env.JWT_TIME_UNIT,
  },
};
