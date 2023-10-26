import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IAppointmentAll } from "../../interfaces/appointment_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import TableComponent, { TABLE_DATA_TYPE } from "../../shared-components/table-component/tableComponent";
import "./appointmentsPage.css"


interface IProps {
    context: IGlobalContext
}

const AppointmentsPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState<IAppointmentAll[]>([]);

    //----   COMPONENT DID MOUND   ----
    useEffect(() => {
        getAllAppointments();
    }, []);


    //----   GET ALL APPOINTMENTS   ----
    const getAllAppointments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_APPOINTMENTS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setAppointments(result.data);
    }

    return (
        <>
            <div className="full-size">
                <TableComponent
                    title="Appointments"
                    context={props.context}

                    ids={[...appointments]}
                    headerValues={["", "Doctor", "", "Patient", "Date", "Time", "Status"]}
                    data={
                        appointments.map((appointment, index) => {
                            return {
                                colValues: [
                                    { type: TABLE_DATA_TYPE.AVATAR, value: appointment.doctorProfilePicPath },
                                    { type: TABLE_DATA_TYPE.STRING, value: appointment.doctorName },

                                    { type: TABLE_DATA_TYPE.AVATAR, value: appointment.patientProfilePicPath },
                                    { type: TABLE_DATA_TYPE.STRING, value: appointment.patientName },

                                    { type: TABLE_DATA_TYPE.STRING, value: appointment.date },
                                    { type: TABLE_DATA_TYPE.STRING, value: `${appointment.startTime} -- ${appointment.endTime}` },
                                    { type: TABLE_DATA_TYPE.STATUS, value: appointment.status },
                                ]
                            }
                        })
                    }
                />

                {
                    loading &&
                    <Loading color="blue" />
                }

            </div>


        </>
    );
}

export default AppointmentsPage;