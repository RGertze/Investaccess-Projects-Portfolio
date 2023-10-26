
import { GlobalContext } from "../contexts/globalContext";
import { Route, Routes } from "react-router-dom";
import DoctorHome from "../shared-components/doctor-home/doctorHomePage";
import DoctorAccountPage from "./doctor-account-page/doctorAccountPage";
import AllPatientsPage from "./all-patients-page/allPatientsPage";
import PatientViewPage from "./patient-view-page/patientViewPage";
import MyPatientsPage from "./my-patients-page/myPatientsPage";
import DoctorSchedulePage from "../shared-components/doctor-schedule-page/doctorSchedulePage";
import DoctorAppointmentsPage from "./doctor-appointments-page/doctorAppointmentsPage";

let PublicBase = () => {
    return (
        <GlobalContext.Consumer>
            {context => (

                <Routes>
                    <Route path="" element={<DoctorHome context={context} doctorId={context.userId} />} />

                    <Route path="schedule" element={<DoctorSchedulePage context={context} doctorId={context.userId} />} />
                    <Route path="appointments" element={<DoctorAppointmentsPage context={context} />} />

                    <Route path="patients/all" element={<AllPatientsPage context={context} />} />
                    <Route path="patients/my" element={<MyPatientsPage context={context} />} />
                    <Route path="patients/view/:id" element={<PatientViewPage context={context} />} />

                    <Route path="account" element={<DoctorAccountPage context={context} />} />
                </Routes>
            )}
        </GlobalContext.Consumer>
    );
}


export default PublicBase;