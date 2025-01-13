const mongoose = require("mongoose"); 
const dbManager = require("../../../config/db/dbConnect");

const CommentsSchema = new mongoose.Schema({
    content: {
        type: String
    },
    writer:{
        type: Schema.Types.ObjectId, 
        ref:'Users'
    },
    postId:{
        type: Schema.Types.ObjectId, 
        ref:'Video'
    },
}, { timestamps: true });

let commentModel;
const getCommentModel = async () => {
  if (!commentModel) {
    await dbManager.connect();
    const commentDb = dbManager.getReadConnection() || dbManager.getWriteConnection();
    commentModel = commentDb.model('Comments', CommentsSchema);
  }
  return commentModel;
};

module.exports = getCommentModel;