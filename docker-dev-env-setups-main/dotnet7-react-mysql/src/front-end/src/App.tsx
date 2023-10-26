import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavigationBar } from './components/navbar/navbar'
import { LoginPage } from './pages/login/login'
import { SignUpPage } from './pages/signup/signup'
import GlobalProvider, { GlobalContext } from './contexts/GlobalContext'
import { IGlobalContext } from './api/interfaces/interfaces'
import { Connection } from './api/connection'
import HomePage from './pages/home/home'

interface IProps {
  context: IGlobalContext
}

function App(props: IProps) {

  useEffect(() => {
    Connection.buildFromLocalStorage();
    if (Connection.userId !== "") {
      props.context.setUserId(parseInt(Connection.userId));
      props.context.setEmail(Connection.username);
      props.context.setRoleId(parseInt(Connection.userType));
      props.context.setIsLoggedIn(true);

      console.log(Connection.userId);
      console.log(Connection.token);
      console.log(Connection.refreshToken);
    }
  }, []);

  return (

    <div className="App" data-bs-theme="dark">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          {
            props.context.isLoggedIn &&
            <Route path="/" element={<HomePage context={props.context} />} />
          }{
            !props.context.isLoggedIn &&
            <Route path="/" element={<div><h2>Please Login</h2></div>} />
          }
          <Route path="/login" element={<LoginPage context={props.context} />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
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
