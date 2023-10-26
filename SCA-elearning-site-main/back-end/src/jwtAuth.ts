import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { IResponse } from "./interfaces";

//##############################################
//      SETUP DOTENV
//##############################################

dotenv.config();    // load values from .env file

//##############################################
//##############################################



//##############################################
//      GEN JWT TOKEN
//##############################################

export function generateAccessToken(username: string): string {
    return jwt.sign({ username: username }, process.env.TOKEN_SECRET, { expiresIn: '21600s' });
}

//##############################################
//##############################################



//##############################################
//      AUTH JWT TOKEN
//##############################################

export function authenticateToken(req: Request, res: Response, next: NextFunction) {      //######        handle jwt authentication

    const authHeader = req.headers['authorization'];
    let token: string = authHeader && authHeader.split(' ')[1];     // check that authHeader isnt null and then split it into strings and get token at index 1

    if (!token) {
        let response: IResponse = {
            stat: "err",
            token: "",
            data: {},
            error: "token does not exist"
        }

        return res.json(response);
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err, payload) => {
        if (err) {
            console.log(err);

            let response: IResponse = {
                stat: "err",
                token: "",
                data: {},
                error: "failed to authenticate token, please sign in again"
            }

            return res.json(response);
        }
        console.log(payload);

        next();
    });
}

//##############################################
//##############################################
