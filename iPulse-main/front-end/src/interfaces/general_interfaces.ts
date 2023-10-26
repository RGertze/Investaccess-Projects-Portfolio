/**
 *  Menu:
 *
 *  1.  Global Context
 *  2.  User type
 *  3.  Request Response
 *  4.  Login response
 *  5.  Signed Put request   
 *  6.  Signed Get request
 * 
 */

import { HubConnection } from "@microsoft/signalr"
import { ITheme } from "../themes"
import { THEME_TYPE } from "./general_enums"

//  1.  Global Context
export interface IGlobalContext {
    isMobile: boolean,
    theme: ITheme,
    setTheme(themeType: THEME_TYPE): void,

    userId: number,
    setUserId(newUserId: number): void,

    username: string,
    setUsername(newUsername: string): void,

    userType: UserType,
    setUserType(userType: UserType): void,

    token: string,
    setToken(newToken: string): void,

    showChat: boolean,
    setShowChat(show: boolean): void

    newMessage: boolean,
    setNewMessage(val: boolean): void
    userBeingMessaged: IUser,
    setUserBeingMessaged(user: IUser): void,
    clearUserBeingMessaged(): void,

    showNotifications: boolean,
    setShowNotifications(show: boolean): void,

    notificationsWs: HubConnection,
    setNotificationsWs(ws: HubConnection): void,

    newNotification: boolean,
    setNewNotification(val: boolean): void
    newNotificationRecv: INotification | undefined,
    setNewNotificationRecv(notification: INotification | undefined): void,

    logout(): void

}

//  2.  User type
export enum UserType {
    PUBLIC,
    ADMIN,
    DOCTOR,
    PATIENT,
    RECEPTIONIST
}

//  3.  Request Response
export interface IResponse {
    errorMessage: string,
    data: any
}

//  4.  Login Response
export interface ILoginResponse {
    userId: number,
    roleId: number,
    token: string,
    refreshToken: string
}

//  5.  Signed Put request
export interface ISignedPutRequest {
    filePath: string,
    signedUrl: string
}

//  6.  Signed Get request
export interface ISignedGetRequest {
    signedUrl: string
}

//  7.  User account
export interface IUser {
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    profilePicPath: string,
    profilePicUrl?: string
}

//  8.  User account, All
export interface IUserAll extends IUser {
    userTypeId: number,
    userTypeName: string,
    isActive: number
}

//  9.  Token refresh response
export interface ITokenRefresh {
    token: string
    refreshToken: string
}

//  10.  Notification
export interface INotification {
    NotificationId: number,
    typeId: number,
    userId: number,
    dateSent: string,
    seen: number,
    content: string
}
