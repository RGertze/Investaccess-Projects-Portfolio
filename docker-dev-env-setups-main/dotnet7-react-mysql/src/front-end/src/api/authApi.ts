import { Connection } from "./connection";
import { ILoginRequest, IRegisterRequest } from "./interfaces/interfaces";

export class AuthApi {
    static BaseEndpoint = "/api/auth";

    static async login(loginRequest: ILoginRequest) {
        let response = await Connection.postRequest(this.BaseEndpoint + "/login", loginRequest, {});
        return response;
    }

    static async register(registerRequest: IRegisterRequest) {
        let response = await Connection.postRequest(this.BaseEndpoint + "/register", registerRequest, {});
        return response;
    }
}