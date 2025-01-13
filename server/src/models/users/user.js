const mongoose = require("mongoose"); 
const dbManager = require("../../../config/db/dbConnect");

const UserSchema = new mongoose.Schema({
    idGoogle: {
        type: String
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    photo: { 
        type: String, 
        default: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png" 
    },
    avatarId: { 
        type: String 
    },
    accountStatus: {
        type: String,
        enum: [ 'ACTIVE', 'SUSPENDED', 'DEACTIVATED'],
        default: 'ACTIVE'
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    otps: [otpSchema],
    sessions: [sessionSchema],
    accountLocked: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });


let UserModel;
const getUserModel = async () => {
  if (!UserModel) {
    await dbManager.connect();
    const UserDb = dbManager.getReadConnection() || dbManager.getWriteConnection();
    UserModel = UserDb.model('Users', UserSchema);
  }
  return UserModel;
};

module.exports = getUserModel;