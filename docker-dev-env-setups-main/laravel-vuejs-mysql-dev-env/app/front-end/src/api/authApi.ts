import {Connection, IResult} from "./connection.ts";

export class AuthApi {
    /**
     * Logs in a user and returns the user id
     * @param email
     * @param password
     * @returns {Promise<number>}
     */
    static async login(email: string, password: string): Promise<number> {
        if (email === "") {
            alert("enter a username");
            return 0;
        }
        if (password === "") {
            alert("enter a password");
            return 0;
        }

        let result: IResult = await Connection.post("/api/auth/login", {
            email: email,
            password: password
        });
        if (result.status === 500) {
            alert("server error");
            return 0;
        }
        let data = result.data;

        if (result.status !== 200) {
            alert(data.message);
            return 0;
        }

        return data.data;
    }

    /**
     * Registers a user and returns the user id
     * @param email
     * @param password
     * @returns {Promise<number>}
     */
    static async register(email: string, password: string): Promise<number> {
        if (email === "") {
            alert("enter a username");
            return 0;
        }
        if (password === "") {
            alert("enter a password");
            return 0;
        }

        let result: IResult = await Connection.post("/api/auth/register", {
            email: email,
            password: password
        });
        if (result.status === 500) {
            alert("server error");
            return 0;
        }
        let data = result.data;

        if (result.status !== 201) {
            alert(data.message);
            return 0;
        }

        return data.data;
    }
}