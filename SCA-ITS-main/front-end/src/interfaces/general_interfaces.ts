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

//  1.  Global Context
export interface IGlobalContext {
    isMobile: boolean,

    userId: number,
    setUserId(newUserId: number): void,

    userRegistrationComplete: boolean,
    setUserRegistrationComplete(newVal: boolean): void,

    username: string,
    setUsername(newUsername: string): void,

    userType: UserType,
    setUserType(userType: UserType): void,


    studentsButtonFlashing: boolean,
    setStudentsButtonFlashing(val: boolean): void,

    token: string,
    setToken(newToken: string): void,

    logout(): void,
}

//  2.  User type
export enum UserType {
    PUBLIC,
    ADMIN,
    PARENT,
    STAFF
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
    refreshToken: string,
    isApproved: number
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
    profilePicPath: string
}

//  8.  File
export interface IFile {
    fileName: string,
    filePath: string
}

//  9.  Token refresh response
export interface ITokenRefresh {
    token: string
    refreshToken: string
}

// 10.  Error message codes
export enum ERROR_MESSAGE_CODES {
    USER_NOT_FOUND = 1,
    WRONG_CONFIRMATION_CODE = 2,
    SERVER_ERROR = 3,
}

// 11.  Success message codes
export enum SUCCESS_MESSAGE_CODES {
    REGISTRATION_SUCCESSFUL = 1,
}