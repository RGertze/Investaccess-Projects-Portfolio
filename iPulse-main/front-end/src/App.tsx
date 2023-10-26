import './App.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { IGlobalContext, UserType } from './interfaces/general_interfaces';
import GlobalProvider, { GlobalContext } from './contexts/globalContext';

// component imports
import PublicBase from "./public-components/publicBase";
import Loading from './shared-components/loading-component/loading';
import NavigationBar from './shared-components/navbar/navbar';
import { Connection } from './connection';
import ChatComponent from './shared-components/chat-component/chatComponent';
import NotificationsComponent from './shared-components/notifications-component/notificationsComponent';
import { USER_TYPE } from './interfaces/general_enums';
import AppointmentStatus from './info-components/appointment-status/appointmentStatus';
import { WaveVector } from './shared-components/wave-vector/waveVector';

// async component imports

const AdminBase = lazy(() => import("./admin-components/adminBase"));
const PatientBase = lazy(() => import("./patient-components/patientBase"));
const DoctorBase = lazy(() => import("./doctor-components/doctorBase"));
const ReceptionistBase = lazy(() => import("./receptionist-components/receptionistBase"));


interface IProps {
  context: IGlobalContext
}

const App = (props: IProps) => {

  // COMPONENT DID MOUNT
  useEffect(() => {

    // try to retrieve auth data from localstorage
    Connection.buildFromLocalStorage();
    if (Connection.userId !== "") {
      props.context.setUserId(parseInt(Connection.userId));
      props.context.setUserType(parseInt(Connection.userType));
    }

  }, []);

  return (
    <BrowserRouter>
      <div className="App" style={{ backgroundColor: props.context.theme.background }}>

        {
          props.context.userType !== UserType.ADMIN &&
          <NavigationBar userType={props.context.userType} context={props.context} />
        }

        {
          props.context.showChat &&
          <ChatComponent context={props.context} />
        }
        {
          props.context.showNotifications &&
          <NotificationsComponent context={props.context} />
        }

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/*" element={<PublicBase />} />
            <Route path="/admin/*" element={<AdminBase />} />
            <Route path="/doctor/*" element={<DoctorBase />} />
            <Route path="/patient/*" element={<PatientBase />} />
            <Route path="/receptionist/*" element={<ReceptionistBase context={props.context} />} />


            {
              // external link routes
              <Route path="/info/appointment/:appointmentId/:code" element={<AppointmentStatus />} />
            }
          </Routes>
        </Suspense>

        <WaveVector />
      </div>
    </BrowserRouter>
  );
}

const AppWithContext = (props: any) => {
  return (
    <GlobalProvider>
      <GlobalContext.Consumer>
        {
          context => (
            <App context={context} />
          )
        }
      </GlobalContext.Consumer>
    </GlobalProvider>
  );
}

export default AppWithContext;
