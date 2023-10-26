import { useState } from "react";
import { Button, Container, Nav, Navbar, NavLink } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";


interface IProps {
}

export const NavigationBar = (props: IProps) => {

    return (
        <GlobalContext.Consumer>
            {
                context => (
                    <Navbar bg="dark" className="p-3" variant="dark" expand="lg">
                        <Navbar.Brand href="#">
                            A Brand Name
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" >
                            <Nav className="mr-auto">
                                {
                                    context.isLoggedIn &&
                                    <NavLink to="/" as={Link} style={{ color: "white" }}>Home</NavLink>
                                }
                            </Nav>
                        </Navbar.Collapse>
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">

                            <Nav className="ml-auto ">
                                {
                                    !context.isLoggedIn &&
                                    <>
                                        <NavLink to="/login" as={Link} style={{ color: "white" }}>Login</NavLink>
                                        <NavLink to="/sign-up" as={Link} style={{ color: "white" }}>Sign Up</NavLink>
                                    </>
                                }
                                {
                                    context.isLoggedIn &&
                                    <Button variant="outline-light" onClick={() => context.logout()}>
                                        Logout
                                    </Button>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                )
            }
        </GlobalContext.Consumer>

    )
}