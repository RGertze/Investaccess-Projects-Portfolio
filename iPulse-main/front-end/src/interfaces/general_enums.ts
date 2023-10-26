export enum THEME_TYPE {
    LIGHT,
    DARK
}

export enum USER_TYPE {
    PUBLIC = 0,
    ADMIN = 1,
    DOCTOR = 2,
    PATIENT = 3,
    RECEPTIONIST = 4
}

export enum APPROVAL_STATUS {
    REJECTED = 0,
    PENDING = 1,
    APPROVED = 2,
    CANCELLED = 3
}

export enum NOTIFICATIONS_TYPE {
    MESSAGE = 1,
    APPOINTMENT = 2,
    PROFILE_ACCESS = 3
}

export enum DIRECT_MESSAGE_METHOD {
    CLIENT_DIRECT_MESSAGE_RECEIVED = "directMessage"
}

export enum NOTIFICATIONS_METHOD {
    CLIENT_NOTIFICATION_RECEIVED = "notification"
}