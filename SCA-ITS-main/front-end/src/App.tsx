import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { IGlobalContext } from './interfaces/general_interfaces';
import GlobalProvider, { GlobalContext } from './contexts/globalContext';
import PublicBase from './public-components/publicBase';
import { Connection } from './connection';
import Loading from './shared-components/loading-component/loading';
import ErrorComponent from './info-components/error-component/errorComponent';
import SuccessComponent from './info-components/success-component/successComponent';
import Layout from './shared-components/layout-component/layoutComponent';

// async component imports
const ParentBase = lazy(() => import("./parent-components/parentBase"));
const StaffBase = lazy(() => import("./staff-components/staffBase"));
const AdminBase = lazy(() => import("./admin-components/adminBase"));


interface IProps {
  context: IGlobalContext
}

const App = (props: IProps) => {

  // COMPONENT DID MOUNT
  useEffect(() => {
    Connection.buildFromLocalStorage();
    if (Connection.userId !== "") {
      props.context.setUserId(parseInt(Connection.userId));
      props.context.setUsername(Connection.username);
      props.context.setUserType(parseInt(Connection.userType));
      props.context.setUserRegistrationComplete(parseInt(Connection.isApproved) === 1);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">

        {/* <NavigationBar userType={props.context.userType} context={props.context} /> */}

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/*" element={<PublicBase />} />
            <Route path="/admin/*" element={<Layout context={props.context} mainContent={<AdminBase context={props.context} />} />} />
            <Route path="/parent/*" element={<Layout context={props.context} mainContent={<ParentBase context={props.context} />} />} />
            <Route path="/staff/*" element={<Layout context={props.context} mainContent={<StaffBase context={props.context} />} />} />

            {
              // external link routes
              <>
                <Route path="/info/error-message/:code" element={<ErrorComponent />} />
                <Route path="/info/success-message/:code" element={<SuccessComponent />} />
              </>
            }
          </Routes>
        </Suspense>
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
