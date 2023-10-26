import { Connection } from "./connection";
import { ITodo, ITodoRequest } from "./interfaces/interfaces";

export class TodoApi {
    static BaseEndpoint = "/api/todo";

    static async getAll() {
        let response = await Connection.getRequest(this.BaseEndpoint, {});
        return response;
    }

    static async getById(id: number) {
        let response = await Connection.getRequest(this.BaseEndpoint + `/${id}`, {});
        return response;
    }

    static async add(todo: ITodoRequest) {
        let response = await Connection.postRequest(this.BaseEndpoint, todo, {});
        return response;
    }

    static async update(todo: ITodoRequest) {
        let response = await Connection.postRequest(this.BaseEndpoint + `/${todo.id}`, todo, {});
        return response;
    }

    static async delete(id: number) {
        let response = await Connection.delRequest(this.BaseEndpoint + `/${id}`);
        return response;
    }

    static async markAsComplete(id: number) {
        let response = await Connection.postRequest(this.BaseEndpoint + `/${id}/complete`, {}, {});
        return response;
    }

    static async markAsIncomplete(id: number) {
        let response = await Connection.postRequest(this.BaseEndpoint + `/${id}/incomplete`, {}, {});
        return response;
    }

    static async getAllForUser(userId: number) {
        let response = await Connection.getRequest(this.BaseEndpoint + `/user/${userId}`, {});
        return response;
    }
}