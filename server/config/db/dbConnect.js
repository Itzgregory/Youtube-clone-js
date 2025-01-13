const mongoose = require('moongoose');
const dotenv = require("dotenv");

dotenv.config();

class MongoDBConnectionManager {
    constructor(){
        this.readConnection = null;
        this.writeConnection = null;
        this.healthCheckInterval = null;
    }

    async connect(){
        const  mongoOptions = {
            autoIndex: true,
            connectTimeoutMS: 10000,
            socketTimeoutMs: 30000,
            maxPoolSize: this.calculatePoolSize(),
        };

        if (!process.env.MONGO_URL_READ_ATLAS || !process.env.MONGO_URL_WRITE_ATLAS) {
            throw new Error("MONGO_URL_READ_ATLAS or MONGO_URL_WRITE_ATLAS is not defined in environment variables");
        }

        try{
            this.readConnection = await moongoose.createConnection(process.env.MONGO_URL_READ_ATLAS, mongoOptions);
            this.writeConnection = await mongoose.createConnection(process.env.MONGO_URL_WRITE_ATLAS, mongoOptions);
      logger.info('MongoDB Atlas connections established');
      this.startHealthCheck();
    } catch (error) {
      logger.error('Failed to establish MongoDB Atlas connections:', error);
      throw error;
    }
  }

  calculatePoolSize() {
    const baseSize = 10;
    const instanceCount = process.env.INSTANCE_COUNT ? parseInt(process.env.INSTANCE_COUNT) : 1;
    return Math.max(baseSize / instanceCount, 2);
  }

  getReadConnection() {
    return this.readConnection;
  }

  getWriteConnection() {
    return this.writeConnection;
  }

  startHealthCheck() {
    const healthCheckInterval = 5 * 60 * 1000; // 5 minutes

    this.healthCheckInterval = setInterval(async () => {
      await this.checkConnection(this.readConnection, 'Read');
      await this.checkConnection(this.writeConnection, 'Write');
    }, healthCheckInterval);
  }

  async checkConnection(connection, type) {
    try {
      if (connection.readyState !== 1) {
        logger.warn(`${type} MongoDB Atlas connection lost. Attempting to reconnect...`);
        await connection.openUri(connection.uri, connection.options);
        logger.info(`${type} MongoDB Atlas connection re-established`);
      }
    } catch (error) {
      logger.error(`Error during ${type} MongoDB Atlas health check:`, error);
      // Here Mr ejike spoke big about implementing a circuit breaker or alert system, will look into this
    }
  }

  async close() {
    clearInterval(this.healthCheckInterval);
    await this.readConnection.close();
    await this.writeConnection.close();
    logger.info('MongoDB Atlas connections closed');
  }
}

const dbManager = new MongoDBConnectionManager();

module.exports = dbManager;