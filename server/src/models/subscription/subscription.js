const mongoose = require("mongoose"); 
const dbManager = require("../../../config/db/dbConnect");

const subscriberSchema = new mongoose.Schema({
    userTo:{
        type: Schema.Types.ObjectId, 
        ref:'Users'
    },
    videoTo:{
        type: Schema.Types.ObjectId, 
        ref:'Videos'
    },
}, { timestamps: true });




let subscriberModel;
const getsubscriberModel = async () => {
  if (!subscriberModel) {
    await dbManager.connect();
    const subscriberDb = dbManager.getReadConnection() || dbManager.getWriteConnection();
    subscriberModel = subscriberDb.model('subscribers', subscriberSchema);
  }
  return subscriberModel;
};

module.exports = getsubscriberModel;