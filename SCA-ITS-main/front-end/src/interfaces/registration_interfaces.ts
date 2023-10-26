export interface IRequiredRegistrationDocument {
    id: number,
    name: string,
    description: string
}

export interface IRegistrationFileStatus {
    requiredDocName: string,
    uploaded: boolean
}

export interface IRegistrationStatus {
    approvalRequested: boolean,
    requiredDocsStatuses: IRegistrationFileStatus[],
    isApproved?: boolean,

    studentsBeingRegistered?: number,

    registrationStatus?: number,
    rejectionMessage?: string
}

export interface IStudentRegistrationStatus {
    studentNumber: string,
    basicDetailsAdded: number,
    generalInfoAdded: number,
    religiousInfoAdded: number,
    scholasticInfoAdded: number,
    medicalInfoAdded: number,
    medicalConditionsAdded: number,
    otherParentsAdded: number,
    nonScaStudentsAdded: number,
    requiredDocsAdded: number,
    occupationalTherapyNeeded: number,
    occupationalReportAdded: number,
    diagnosticTestNeeded: number,
    diagnosticResultAdded: number,

    therapistName: string,
    therapistCell: string,
    therapistEmail: string,
    therapistUrl: string,

    diagnosticTestLink: string,


    basicRejectionMessage: string,
    generalRejectionMessage: string,
    religiousRejectionMessage: string,
    scholasticRejectionMessage: string,
    medicalRejectionMessage: string,
    conditionsRejectionMessage: string,
    otherParentsRejectionMessage: string,
    nonScaRejectionMessage: string,
    requiredDocsRejectionMessage: string,
    therapyRejectionMessage: string,
    diagnosticRejectionMessage: string,
}

export enum STUDENT_REGISTRATION_STAGE {
    ADD_BASIC_DETAILS = 1,
    ADD_GENERAL_INFO = 2,
    ADD_RELIGIOUS_INFO = 3,
    ADD_SCHOLASTIC_INFO = 4,
    ADD_MEDICAL_DETAILS = 5,
    ADD_MEDICAL_CONDITIONS = 6,
    ADD_OTHER_PARENTS = 7,
    ADD_NON_SCA_STUDENTS = 8,
    ADD_REQUIRED_DOCS = 9,
    OCCUPATIONAL_THERAPY_NEEDED = 10,
    DIAGNOSTIC_TEST_NEEDED = 11,
    APPROVAL_REQUESTED = 12,
    APPROVED = 13,
    REJECTED = 14
}

export interface IParentRegistrationStatus {
    parentId: number,

    detailsAdded: number,
    otherParentsAdded: number,
    studentsAdded: number,
    requiredDocsAdded: number,

    detailsRejectionMessage: string,
    otherParentsRejectionMessage: string,
    studentsRejectionMessage: string,
    requiredDocsRejectionMessage: string,

    registrationFeePaid: number,
    registrationFeeRejectionMessage: string,
}

export enum PARENT_REGISTRATION_STAGE {
    ADD_DETAILS = 1,
    ADD_STUDENTS = 2,
    ADD_OTHER_PARENTS = 3,
    ADD_REQUIRED_DOCS = 4,
    PAY_REGISTRATION_FEE = 5,
    APPROVED = 6,
    REJECTED = 7
}

export enum REG_REQ_TYPE {
    PARENT,
    STUDENT
}