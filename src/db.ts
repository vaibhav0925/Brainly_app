import mongoose, { model, Schema } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const mongooURL = process.env.Database_URL!;


await mongoose.connect(mongooURL);

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);


const ContentSchema = new Schema({
    tittle: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: "Tags"}],
    userId: {type: mongoose.Types.ObjectId, ref: "User", require: true}
})


export const ContentModel = model("Content", ContentSchema)