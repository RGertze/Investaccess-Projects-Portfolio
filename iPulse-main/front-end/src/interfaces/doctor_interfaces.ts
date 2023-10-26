import { IUser } from "./general_interfaces"

export interface IDoctorSpecialty {
    specialtyId: number,
    specialtyName: string
}

export interface IDoctor extends IUser {
    // start of profile info
    specialtyId: number,
    specialtyName: string,
    practiceName: string,
}

export interface IDoctorAll {
    userId: number,
    profilePicPath: string,
    email: string,
    firstName: string,
    lastName: string,
    specialtyId: number,
    specialtyName: string,
    rating: number,
    numberOfReviews: number,
    education: string,

    location: string,
    appointmentPrice: string
}

export interface IDoctorWithProfileAccess extends IDoctorAll {
    approvalCode: string
}

export interface IDoctorSearch {
    specialtyId: number,
    firstName: string,
    lastName: string,
    email: string,
    nationality: string,
    city: string
}

export interface IDoctorProfile {
    specialtyId?: number,
    specialtyName?: string,
    nationality?: string,
    practiceNumber?: string,
    practiceName?: string,
    practiceAddress?: string,
    practiceCity?: string,
    practiceCountry?: string,
    practiceWebAddress?: string,
    businessHours?: string,
    appointmentPrice?: number,
    secondaryCellphone?: string,
    secondaryEmail?: string
}

export interface IUpdateDoctorProfile {
    userId: number,
    specialtyId: number,
    nationality: string,
    practiceNumber: string
    practiceName: string,
    practiceAddress: string,
    practiceCity: string,
    practiceCountry: string,
    practiceWebAddress: string,
    businessHours: string,
    appointmentPrice: number,
    secondaryCellphone: string,
    secondaryEmail: string,
}

export interface IDoctorWorkHistory {
    doctorWorkHistoryId?: number,
    doctorId: number,
    companyName: string,
    startDate: string,
    endDate: string,
    role: string,
    duties: string
}

export interface IPatientDoctorType {
    typeId: number,
    typeName: string
}

export interface IRequestToBePersonalDoctor {
    patientId: number,
    doctorId: number,
    status: string,
    approvalCode: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicPath: string,
    profilePicUrl: string
}

export interface IDoctorEducation {
    id: number,
    instituteName: string,
    qualificationName: string
}

export interface IAddDoctorEducation {
    instituteName: string,
    qualificationName: string
}

export interface IReview {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    profilePicPath: string,

    reviewId: number,
    comment: string,
    rating: number,
    reviewDate: string
}

export interface IDoctorAppointment {
    // patient values
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