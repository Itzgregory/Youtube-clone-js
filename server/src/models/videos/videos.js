const mongoose = require("mongoose"); 
const dbManager = require("../../../config/db/dbConnect");

const VideoSchema = new mongoose.Schema({
    videoPath: {
        type: String,
        required: true
    },
    thumbnailPath: {
        type: String
    },
    previewPath: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: { 
        type: String 
    },
    extension: { 
        type: String, 
        enum: ["mp4", "mov"] 
    },
    user: { 
        type: Schema.Types.ObjectId, ref:'User' 
    }, 
    videoId: { 
        type: String 
    },
    views: {
        type: Number, 
        default: 0
    },
    videoLength: {
        type: String 
    },
    published: {
        type: Boolean, 
        default: false
    },
    datePublished:{
        type: String, 
        default: ''
    },
    likeId: {
        type: [], 
        default: []
    },
}, { timestamps: true,
    versionKey: false
 });


let VideoModel;
const getVideoModel = async () => {
  if (!VideoModel) {
    await dbManager.connect();
    const VideoDb = dbManager.getReadConnection() || dbManager.getWriteConnection();
    VideoModel = VideoDb.model('Videos', VideoSchema);
  }
  return VideoModel;
};

module.exports = getVideoModel;