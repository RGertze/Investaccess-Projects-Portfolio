import { IUser } from "./general_interfaces";

export interface IDirectMessage {
    id: number,
    fromId: number,
    toId: number,
    dateSent: string,
    seen: number,
    content: string
}

export interface IChatUser extends IUser {
    unseen: number,
    maxDate: string
}