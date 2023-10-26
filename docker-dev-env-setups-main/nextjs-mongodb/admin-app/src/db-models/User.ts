import mongoose from "mongoose";


const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    id: ObjectId,
    username: String,
    password: String,
});

const User = mongoose.models["users"] || mongoose.model("users", UserSchema);

export default User;