import mongoose from 'mongoose';
import HitApi from './models/hitApi.model';

mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (process.env.ENV === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */

export const connectToMongo = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/bull_mongo", {
    useFindAndModify: false,
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    user: "mongoadmin",
    pass: "mongoadmin",
    auth: { authSource: 'admin' },
  });
  return mongoose.connection;
};

export const getMongoConnection = () => mongoose.connection;

const models = { HitApi };
export default models;
