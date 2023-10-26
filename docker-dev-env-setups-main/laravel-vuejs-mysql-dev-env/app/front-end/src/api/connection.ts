import axios, {AxiosResponse} from "axios";


export interface IResult {
    status: number;
    data: any;
}

const BASE_URL = "http://localhost:8081";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export class Connection {
    static async post(url: string, data: any): Promise<IResult> {
        return this.sendRequest(HTTPMethod.POST, url, data);
    }

    static async get(url: string): Promise<IResult> {
        return this.sendRequest(HTTPMethod.GET, url);
    }

    static async put(url: string, data: any): Promise<IResult> {
        return this.sendRequest(HTTPMethod.PUT, url, data);
    }

    static async delete(url: string): Promise<IResult> {
        return this.sendRequest(HTTPMethod.DELETE, url);
    }

    private static async sendRequest(method: HTTPMethod, endpointUrl: string, data?: any): Promise<IResult> {

        let axiosConfig = {
            headers: {},
            ValidityState: (status) => status < 500
        }

        let url = BASE_URL + endpointUrl;
        let response: AxiosResponse<any, any>;
        try {
            switch (method) {
                case HTTPMethod.GET:
                    response = await axios.get(url, axiosConfig);
                    break;
                case HTTPMethod.POST:
                    response = await axios.post(url, data, axiosConfig);
                    break;
                case HTTPMethod.PUT:
                    response = await axios.put(url, data, axiosConfig);
                    break;
                case HTTPMethod.DELETE:
                    response = await axios.delete(url, axiosConfig);
                    break;
            }
            return {status: response.status, data: response.data};
        } catch (error) {
            console.log(error);
            return {status: 500, data: {}};
        }
    }

}