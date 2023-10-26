export interface ICalendarEvent {

}

export interface IAppointmentSlot {
    id: number,
    day: number,
    startTime: string,
    endTime: string
}

export interface IAppointment {
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
    endTime: string,

    patientFirstname: string,
    patientLastname: string,
    patientEmail: string,
    patientProfilePic: string
}

export interface IAppointmentAll {
    AppointmentId: number,
    Title: string,
    Description: string,
    date: string,
    status: number,

    slotDay: string,
    startTime: string,
    endTime: string,

    doctorEmail: string,
    doctorName: string,
    doctorProfilePicPath: string,

    patientEmail: string,
    patientName: string,
    patientProfilePicPath: string
}


export enum APPOINTMENT_STATUS {
    REJECTED = 0,
    PENDING = 1,
    APPROVED = 2,
    CANCELLED = 3
}