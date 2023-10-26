
import { GlobalContext } from "../contexts/globalContext";
import { Route, Routes } from "react-router-dom";
import PatientHome from "./patient-home/patientHome";
import AllDoctorsPage from "../shared-components/all-doctors-page/allDoctorsPage";
import DoctorViewPage from "./doctor-view-page/doctorViewPage";
import PatientAccountPage from "./patient-account-page/patientAccountPage";
import MyDoctorsPage from "./my-doctors-page/myDoctorsPage";
import AppointmentsPage from "./appointments-page/appointmentsPage";

let PatientBase = () => {
    return (
        <GlobalContext.Consumer>
            {context => (

                <Routes>
                    <Route path="" element={<PatientHome context={context} />} />

                    <Route path="doctors/my/" element={<MyDoctorsPage context={context} />} />
                    <Route path="doctors/all/" element={<AllDoctorsPage context={context} />} />
                    <Route path="doctor/:id" element={<DoctorViewPage context={context} />} />

                    <Route path="appointments" element={<AppointmentsPage context={context} />} />

                    <Route path="account" element={<PatientAccountPage context={context} />} />
                </Routes>
            )}
        </GlobalContext.Consumer>
    );
}


export default PatientBase;