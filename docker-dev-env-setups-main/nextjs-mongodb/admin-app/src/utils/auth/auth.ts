import { User } from "../db";
import jwt from "jsonwebtoken";

export const signIn = async (username: string, password: string): Promise<string> => {
    console.log

    let user = await User.findOne({ username: username, password: password });

    // console.log("#####  USER: ", user);

    if (!user) {
        return "";
    }


    let token = jwt.sign({ username: username }, "secret");
    return token;
}