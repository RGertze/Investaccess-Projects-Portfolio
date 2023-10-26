
export interface IResult {
    statusCode: number;
    data: any;
    message: string;
}

export enum ROLES {
    ADMIN = 1,
    USER = 2
}

export interface IRegisterRequest {
    email: string;
    password: string;
}

export interface IApiTokens {
    token: string;
    refreshToken: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    id: number;
    roleId: number;
    emailConfirmed: boolean;
    tokens: IApiTokens;
}

export interface ITodo {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    isComplete?: number;
    userId: number;
}

export interface ITodoRequest {
    id?: number;
    userId: number;
    name: string;
    description: string;
}

export interface IGlobalContext {
    email: string;
    setEmail: (email: string) => void;
    userId: number;
    setUserId: (userId: number) => void;
    roleId: number,
    setRoleId: (roleId: number) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    logout: () => void;
}