import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

class MongooseService {
  private count = 0;
  private mongooseOoptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log("Trying MongoDB connection...");
    mongoose
      .connect("mongodb://localhost:27017/api-db", this.mongooseOoptions)
      .then(() => {
        log("MongoDB is connected!");
      })
      .catch((err) => {
        const retrySeconds = 5;
        log(`MongoDB connection failed. It will retry again in ${retrySeconds} seconds. Error: `, err);
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}

export default new MongooseService();