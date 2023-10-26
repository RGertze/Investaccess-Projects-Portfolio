import mongoose from "mongoose";


const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ServiceSchema = new Schema({
    id: ObjectId,
    name: String,
    description: String,
    price: Number,
});


const Service = mongoose.models["services"] || mongoose.model("services", ServiceSchema);

export default Service;