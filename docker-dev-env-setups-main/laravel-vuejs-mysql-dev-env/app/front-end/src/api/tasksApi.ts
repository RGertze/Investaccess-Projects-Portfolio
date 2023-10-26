import {Connection, IResult} from "./connection.ts";

export interface ITask {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    position?: number;
    completed_at?: string | null;
}

export class TasksApi {
    /**
     * Get all tasks for a user
     * @param id user's id
     * @returns {Promise<ITask[]>}
     */
    static async getAllForUser(id: number): Promise<ITask[]> {
        let result: IResult = await Connection.get(`/api/tasks/${id}`);
        if (result.status === 500) {
            alert("server error");
            return [];
        }
        let data = result.data;

        if (result.status !== 200) {
            alert(data.message);
            return [];
        }

        return data.data;
    }

    /**
     * Add a task for a user
     * @param userId user's id
     * @param title task's title
     * @returns {Promise<boolean>}
     */
    static async add(userId: number, title: string): Promise<boolean> {
        if (title === "") {
            alert("Title is empty");
            return false;
        }

        let result: IResult = await Connection.post(`/api/tasks/`, {
            userId: userId,
            title: title
        });
        if (result.status === 500) {
            alert("server error");
            return false;
        }
        let data = result.data;

        if (result.status !== 201) {
            alert(data.message);
            return false;
        }

        return true;
    }

    /**
     * Update a task
     * @param id task's id
     * @param title? task's title
     * @param description? task's description
     * @param position? task's position
     * @param completed? task's completed status
     * @returns {Promise<boolean>}
     */
    static async update(id: number, title?: string, description?: string, position?: number, completed?: boolean): Promise<boolean> {
        let result: IResult = await Connection.post(`/api/tasks/${id}`, {
            title: title ?? null,
            description: description ?? null,
            position: position ?? null,
            completed: completed ?? null
        });
        if (result.status === 500) {
            alert("server error");
            return false;
        }
        let data = result.data;

        if (result.status !== 200) {
            alert(data.message);
            return false;
        }

        return true;
    }

    /**
     * Delete a task
     * @param id task's id
     * @returns {Promise<boolean>}
     */
    static async delete(id: number): Promise<boolean> {
        let result: IResult = await Connection.delete(`/api/tasks/${id}`);
        if (result.status === 500) {
            alert("server error");
            return false;
        }
        let data = result.data;

        if (result.status !== 200) {
            alert(data.message);
            return false;
        }

        return true;
    }


}