export interface IPatientProfile {
    medicalAidSchemeName: string,
    idNumber: string,
    memberNumber: string,
    nationality: string,
    residentialAddress: string,
    postalAddress: string,
    age: number,
    gender: number,
    bloodType: number,
    secondaryCellphone: string
}

export interface IPatientNextOfKin {
    patientNextOfKinId: number,
    fullName: string,
    cellphone: string,
    email: string,
    residentialAddress: string,
    relationship: string
}

export interface IPatientProfileForDoctor {
    medicalAidSchemeName: string,
    idNumber: string,
    memberNumber: string,
    nationality: string,
    residentialAddress: string,
    postalAddress: string,
    age: number,
    gender: string,
    bloodType: string,
    secondaryCellphone: string
}

export interface IRequestStatus {
    status: number,
    approvalCode?: string
}

export interface IProfileAccessRequest {
    patientId: number,
    doctorId: number,
    approvalCode: string,
    email: string,
    firstName: string,
    lastName: string,
    profilePicPath: string
}

export interface IBloodType {
    bloodTypeId: number,
    bloodTypeName: string,
}

export interface IGender {
    genderId: number,
    genderName: string,
}

export interface IPatientAppointment {
    // doctor values
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicPath: string,

    // appointment values
    appointmentId: number,
    doctorId: number,
    patientId: number,
    title: string,
    description: string,
    date: string,
    status: number,
    confirmationCode: string,

    slotDay: string,
    startTime: string,
    endTime: string
}

export interface IPatientSearch {
    firstName: string,
    lastName: string,
    email: string,
}
