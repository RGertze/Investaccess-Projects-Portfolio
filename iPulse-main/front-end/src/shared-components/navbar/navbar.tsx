
import "./navbar.css";

import React, { useState } from "react";
import { GlobalContext } from "../../contexts/globalContext";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, NavItem, NavDropdown, NavLink, Navbar, Button } from "react-bootstrap";
import { IGlobalContext, UserType } from "../../interfaces/general_interfaces";
import { Connection } from "../../connection";
import { Bell, ChatDots } from "react-bootstrap-icons";

interface IProps {
    userType: UserType,
    context: IGlobalContext
}

let NavigationBar: React.FC<IProps> = (props: IProps) => {

    const navigate = useNavigate();

    const [toggled, setToggled] = useState(false);

    //----   Logout function   ----
    const logout = () => {
        props.context.logout();

        // go to login page
        navigate("/login");
    }

    return (
        <GlobalContext.Consumer>
            {context => (
                <Navbar bg="light" expand="lg" onToggle={setToggled}>
                    <Container>
                        <Navbar.Toggle />
                        {
                            // Public navbar 
                            props.userType === UserType.PUBLIC &&
                            <>
                                <Navbar.Brand>IPulse</Navbar.Brand>
                                <Navbar.Collapse>
                                    <Nav>
                                        <NavLink to="/" as={Link}>Home</NavLink>
                                        <NavLink to="/doctors" as={Link}>Doctors</NavLink>
                                    </Nav>


                                </Navbar.Collapse>
                                <Navbar.Collapse className="justify-content-end">
                                    <Nav >
                                        <Button variant="light" onClick={() => navigate("/register")}>Sign Up</Button>
                                        <Button style={{ backgroundColor: context.theme.secondary }} onClick={() => navigate("/login")}>Login</Button>
                                    </Nav>
                                </Navbar.Collapse>
                            </>
                        }

                        {
                            // Logged in user navbar 
                            props.userType !== UserType.PUBLIC &&
                            <>
                                <Navbar.Brand>IPulse</Navbar.Brand>
                                <Navbar.Collapse>
                                    <Nav>
                                        {
                                            // Admin nav links
                                            props.userType === UserType.ADMIN &&
                                            <>
                                                <NavLink to="/admin" as={Link}>Home</NavLink>
                                                {/* <NavLink to="/admin/patients" as={Link}>Patients</NavLink>
                                                <NavLink to="/admin/doctors" as={Link}>Doctors</NavLink> */}
                                            </>
                                        }
                                        {
                                            // Doctor nav links
                                            props.userType === UserType.DOCTOR &&
                                            <>
                                                <NavLink to="/doctor" as={Link}>Home</NavLink>
                                                <NavLink to="/doctor/schedule" as={Link}>Schedule</NavLink>
                                                <NavLink to="/doctor/appointments" as={Link}>Appointments</NavLink>
                                                <NavDropdown id="basic-nav-dropdown" title="Patients">
                                                    <NavDropdown.Item to="/doctor/patients/all" as={Link}>All patients</NavDropdown.Item>
                                                    <NavDropdown.Item to="/doctor/patients/my" as={Link}>My patients</NavDropdown.Item>
                                                </NavDropdown>
                                            </>
                                        }
                                        {
                                            // Receptionist nav links
                                            props.userType === UserType.RECEPTIONIST &&
                                            <>
                                                <NavLink to="/receptionist" as={Link}>Home</NavLink>
                                                <NavLink to="/receptionist/schedule" as={Link}>Schedule</NavLink>
                                            </>
                                        }
                                        {
                                            // Patient nav links
                                            props.userType === UserType.PATIENT &&
                                            <>
                                                <NavLink to="/patient" as={Link}>Home</NavLink>
                                                <NavDropdown id="basic-nav-dropdown" title="Doctors">
                                                    <NavDropdown.Item to="/patient/doctors/all" as={Link}>All doctors</NavDropdown.Item>
                                                    <NavDropdown.Item to="/patient/doctors/my" as={Link}>My doctors</NavDropdown.Item>
                                                </NavDropdown>
                                                <NavLink to="/patient/appointments" as={Link}>Appointments</NavLink>
                                            </>
                                        }
                                    </Nav>
                                </Navbar.Collapse>

                                <div className={`navbar-icons vert-flex space-evenly ${toggled && "hor-center"}`}>
                                    {
                                        props.userType !== UserType.ADMIN &&
                                        <>
                                            <Nav >
                                                <Bell onClick={() => props.context.setShowNotifications(!props.context.showNotifications)} className={`hor-center icon-sm hover ${props.context.newNotification ? "unseen" : "seen"}`}></Bell>
                                            </Nav>
                                            {
                                                props.userType !== UserType.RECEPTIONIST &&
                                                <Nav >
                                                    <ChatDots onClick={() => props.context.setShowChat(!props.context.showChat)} className={`hor-center icon-sm hover ${props.context.newMessage ? "unseen" : "seen"}`} />
                                                </Nav>
                                            }
                                        </>
                                    }
                                </div>

                                <Navbar.Collapse className="justify-content-end" >


                                    <Nav style={{ marginRight: "10px" }}>
                                        {
                                            context.userType === UserType.ADMIN &&
                                            <NavLink to="/admin/account" as={Link}>Account</NavLink>
                                        }
                                        {
                                            context.userType === UserType.DOCTOR &&
                                            <NavLink to="/doctor/account" as={Link}>Account</NavLink>
                                        }
                                        {
                                            context.userType === UserType.PATIENT &&
                                            <NavLink to="/patient/account" as={Link}>Account</NavLink>
                                        }
                                        {
                                            context.userType === UserType.RECEPTIONIST &&
                                            <NavLink to="/receptionist/account" as={Link}>Account</NavLink>
                                        }
                                    </Nav>
                                    <Nav >
                                        <Button className="light-secondary" onClick={() => logout()}>Log out</Button>
                                    </Nav>
                                </Navbar.Collapse>
                            </>
                        }

                    </Container>
                </Navbar>
            )
            }
        </GlobalContext.Consumer >
    );
}

export default NavigationBar;