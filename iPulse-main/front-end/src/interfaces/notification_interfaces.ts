export interface INotificationAppointment {
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

    firstName: string,
    lastName: string,
}

export interface INotificationProfileAccess {
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    status: number
}