import { PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../interfaces/registration_interfaces";

export const getStudentStatusBadgeColour = (stage: STUDENT_REGISTRATION_STAGE) => {
    if (stage === STUDENT_REGISTRATION_STAGE.APPROVED)
        return "success";
    if (stage === STUDENT_REGISTRATION_STAGE.REJECTED)
        return "danger";
    return "warning";
}

export const getParentStatusBadgeColour = (stage: PARENT_REGISTRATION_STAGE) => {
    if (stage === PARENT_REGISTRATION_STAGE.APPROVED)
        return "success";
    if (stage === PARENT_REGISTRATION_STAGE.REJECTED)
        return "danger";
    return "warning";
}

export enum REGISTRATION_STAGE_STRING {
    APPROVED = "approved",
    DENIED = "denied",
    INCOMPLETE = "incomplete"
}

export const getStatusBadgeColourFromString = (stage: REGISTRATION_STAGE_STRING) => {
    if (stage === REGISTRATION_STAGE_STRING.APPROVED)
        return "success";
    if (stage === REGISTRATION_STAGE_STRING.DENIED)
        return "danger";
    return "warning";
}