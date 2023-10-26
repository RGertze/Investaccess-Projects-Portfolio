
import { GlobalContext } from "../contexts/globalContext";
import { Route, Routes } from "react-router-dom";
import UserAccountPage from "../shared-components/user-account-page/userAccountPage";
import DoctorHome from "../shared-components/doctor-home/doctorHomePage";
import { useEffect, useState } from "react";
import { errorToast } from "../shared-components/alert-components/toasts";
import { IGlobalContext, IResponse } from "../interfaces/general_interfaces";
import Loading from "../shared-components/loading-component/loading";
import { Connection, GET_ENDPOINT } from "../connection";
import { IReceptionist } from "../interfaces/receptionist_interfaces";
import DoctorSchedulePage from "../shared-components/doctor-schedule-page/doctorSchedulePage";

interface IProps {
    context: IGlobalContext
}

let ReceptionistBase = (props: IProps) => {

    const [receptionist, setReceptionist] = useState<IReceptionist>({
        userId: 0,
        email: "",
        firstName: "",
        lastName: "",
        profilePicPath: "",
        doctorId: 0
    });
    const [loading, setLoading] = useState(false);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getReceptionistInfo();
    }, []);

    //----   ON RECEPTIONIST CHANGE   ----
    useEffect(() => {
        if (receptionist.doctorId !== 0)
            setLoading(false);
    }, [receptionist]);

    //----   GET RECEPTIONIST   ----
    const getReceptionistInfo = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_RECEPTIONIST + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setReceptionist(result.data);
    }

    return (
        <>
            <Routes>
                {
                    loading &&
                    <Route path="" element={<Loading />} />
                }
                {
                    !loading &&
                    <>
                        <Route path="" element={<DoctorHome context={props.context} doctorId={receptionist.doctorId} />} />
                        <Route path="schedule" element={<DoctorSchedulePage context={props.context} doctorId={receptionist.doctorId} />} />
                    </>
                }

                <Route path="account" element={<UserAccountPage context={props.context} />} />
            </Routes>
        </>
    );
}


export default ReceptionistBase;