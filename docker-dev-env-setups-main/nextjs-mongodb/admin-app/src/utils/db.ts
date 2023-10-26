
import Service from "@/db-models/Service";
import User from "@/db-models/User";
import mongoose from "mongoose";

mongoose.connect("mongodb://user:user@mongo-db:27017/nextjs_example").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
});

console.log("#####  SERVICE MONGOOSE MODELS: ", mongoose.models);

export { User, Service }

