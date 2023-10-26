import { Home, PeopleAltRounded, Assignment, Science, FoodBank, Menu, ExpandLess, ExpandMore, AssignmentInd, PendingActions, Article, AccountBalance, Savings, Paid, EscalatorWarning, ChildCare, Engineering, MenuBook, School, Grade, Assessment, Summarize, AccountCircle, Category, PropaneSharp, Calculate, Elderly, Stroller, Settings } from "@mui/icons-material";
import { AppBar, Breadcrumbs, Button, Collapse, CssBaseline, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/globalContext";
import { IGlobalContext, UserType } from "../../interfaces/general_interfaces";
import "./layoutComponent.css";
import sca_logo from "./sca.webp";

//----   STYLES   ----

const listItemButtonStyle = {
    minHeight: 48,
    justifyContent: 'center',
    px: 2.5,
} as const;

const listItemIconStyle = {
    minWidth: 0,
    justifyContent: 'center',
} as const;

const openDropDownColor = "#dddddd";
const closedDropDownColor = "#ffffff";

//----   INACTIVE URL NAMES   ----

const inactiveUrlNames = {
    finances: true,
    registration: true,
}

interface IProps {
    context: IGlobalContext,
    mainContent: ReactNode
}

let Layout = (props: IProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [breadCrumbToPathMap, setBreadCrumbToPathMap] = useState({});
    const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);

    const [drawerWidth, setDrawerWidth] = useState(250);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [showDrawer, setShowDrawer] = useState<boolean>(!props.context.isMobile);

    const [contentWidth, setContentWidth] = useState(0);

    const [openRegistration, setOpenRegistration] = useState(false);
    const [openFinances, setOpenFinances] = useState(false);
    const [openAdminCourses, setOpenAdminCourses] = useState(false);
    const [openProgressReports, setOpenProgressReports] = useState(false);

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (drawerOpen)
            setDrawerWidth(240);
        else
            setDrawerWidth(70);
    }, [drawerOpen]);

    useEffect(() => {
        getContentWidth();

        window.addEventListener("resize", getContentWidth);
        return () => {
            window.removeEventListener("resize", getContentWidth);
        }
    }, []);

    const getContentWidth = () => {
        const width = window.innerWidth;
        setContentWidth(width);
    }

    useEffect(() => {
        setupBreadCrumbs();
    }, [location]);

    const setupBreadCrumbs = () => {
        let pathItems = location.pathname.substring(1).split("/");
        let base = pathItems[0];

        let currentPath = `/${base}`;

        if (pathItems.length > 1) {

            let crumbs = pathItems.slice(1);
            let crumbToPathMap = {};

            crumbs.forEach(crumb => {
                currentPath += `/${crumb}`;
                crumbToPathMap[crumb] = currentPath;
            });

            setBreadCrumbs(crumbs);
            setBreadCrumbToPathMap(crumbToPathMap);

            console.log(crumbs);
            console.log(crumbToPathMap);
        }
    }

    const navigateWithCrumb = (crumb: string) => {
        let path = breadCrumbToPathMap[crumb];
        if (path !== undefined)
            navigate(path);
    }

    return (
        <GlobalContext.Consumer>
            {context => (

                <Box sx={{
                    display: "flex",
                    backgroundColor: "#eeeeee"
                }} >

                    <CssBaseline />

                    <AppBar
                        position="fixed"
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                aria-label="open drawer"
                                color="inherit"
                                sx={{ mr: 2 }}
                                onClick={() => {
                                    if (context.isMobile) {
                                        setShowDrawer(!showDrawer);
                                        setDrawerOpen(true);
                                        return;
                                    }
                                    setDrawerOpen(!drawerOpen);
                                }}
                            >
                                <Menu />
                            </IconButton>
                            {
                                !context.isMobile &&
                                <Typography variant="h5" component="div" sx={{ flexGrow: 1, display: "flex", justifyContent: "start" }}>
                                    Swakopmund Christian Academy
                                </Typography>
                            }
                            {
                                context.isMobile &&
                                <Typography variant="h5" component="div" sx={{ fontSize: "20px", flexGrow: 1, display: "flex", justifyContent: "start" }}>
                                    Swakop CA
                                </Typography>
                            }

                            {
                                context.userRegistrationComplete &&
                                <Typography component="div" sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={() => navigate("account")}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </Typography>
                            }

                            {
                                context.userId !== 0 &&
                                <Button onClick={() => {
                                    context.logout();
                                    navigate("/");
                                }} color="inherit">Logout</Button>
                            }
                        </Toolbar>
                    </AppBar>


                    {
                        showDrawer &&
                        <Drawer
                            variant="permanent"
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                            }}
                        >
                            <Toolbar />

                            {
                                drawerOpen &&
                                <Toolbar>
                                    <img className="rounded-circle hor-center" style={{ marginTop: "10px" }} src={sca_logo} width="150px" />
                                </Toolbar>
                            }

                            <Box sx={{ overflow: 'auto' }}>
                                <List>
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        {
                                            // HOME
                                            context.userType === UserType.ADMIN &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("home"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <Home />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Home"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }


                                        {
                                            // PARENT FINANCES
                                            (context.userType === UserType.PARENT && context.userRegistrationComplete) &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("finances"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <AccountBalance />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Finances"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // REGISTRATION
                                            context.userType === UserType.ADMIN &&
                                            <>
                                                <ListItemButton style={{ backgroundColor: openRegistration ? openDropDownColor : closedDropDownColor }} sx={listItemButtonStyle} onClick={() => { setOpenRegistration(!openRegistration); }}>
                                                    <ListItemIcon sx={listItemIconStyle}>
                                                        <AssignmentInd />
                                                    </ListItemIcon>
                                                    {
                                                        drawerOpen &&
                                                        <ListItemText primary={"Registration"} sx={{ ml: 3 }} />
                                                    }
                                                    {openRegistration ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={openRegistration} timeout="auto" unmountOnExit>
                                                    <List style={{ backgroundColor: openDropDownColor }}>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("registration/requests"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <PendingActions />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Requests" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("registration/documents"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Article />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Documents" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </>
                                        }
                                        {
                                            // FINANCES
                                            context.userType === UserType.ADMIN &&
                                            <>
                                                <ListItemButton style={{ backgroundColor: openFinances ? openDropDownColor : closedDropDownColor }} sx={listItemButtonStyle} onClick={() => { setOpenFinances(!openFinances); }}>
                                                    <ListItemIcon sx={listItemIconStyle}>
                                                        <AccountBalance />
                                                    </ListItemIcon>
                                                    {
                                                        drawerOpen &&
                                                        <ListItemText primary={"Finances"} sx={{ ml: 3 }} />
                                                    }
                                                    {openFinances ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={openFinances} timeout="auto" unmountOnExit>
                                                    <List style={{ backgroundColor: openDropDownColor }}>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("finances/proof-of-deposits"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Savings />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Proof of Deposits" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("finances/school-fees"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Paid />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="School Fees" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("finances/balances"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Calculate />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Balances" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </>
                                        }
                                        {
                                            // PARENTS
                                            context.userType === UserType.ADMIN &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("parents"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <EscalatorWarning />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Parents"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // STUDENTS
                                            (props.context.userRegistrationComplete) &&
                                            <ListItemButton sx={listItemButtonStyle} className={`${props.context.studentsButtonFlashing ? "flashing-nav rounded" : ""}`} onClick={() => { props.context.setStudentsButtonFlashing(false); navigate("students"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <ChildCare />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Students"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // COMPLETE APPLICATION
                                            (!props.context.userRegistrationComplete && props.context.userType === UserType.PARENT) &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("complete-registration"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <AssignmentInd />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Complete Application"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // STAFF
                                            context.userType === UserType.ADMIN &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("staff"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <Engineering />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Staff"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // COURSES STAFF
                                            (context.userType === UserType.STAFF) &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("courses"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <School />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Courses"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // COURSES ADMIN
                                            context.userType === UserType.ADMIN &&
                                            <>
                                                <ListItemButton style={{ backgroundColor: openAdminCourses ? openDropDownColor : closedDropDownColor }} sx={listItemButtonStyle} onClick={() => { setOpenAdminCourses(!openAdminCourses); }}>
                                                    <ListItemIcon sx={listItemIconStyle}>
                                                        <School />
                                                    </ListItemIcon>
                                                    {
                                                        drawerOpen &&
                                                        <ListItemText primary={"Courses"} sx={{ ml: 3 }} />
                                                    }
                                                    {openAdminCourses ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={openAdminCourses} timeout="auto" unmountOnExit>
                                                    <List style={{ backgroundColor: openDropDownColor }}>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("courses/categories"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Category />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Categories" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("courses"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <MenuBook />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="All Courses" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </>
                                        }
                                        {
                                            // PROGRESS REPORTS

                                            context.userType === UserType.ADMIN &&
                                            <>
                                                <ListItemButton style={{ backgroundColor: openProgressReports ? openDropDownColor : closedDropDownColor }} sx={listItemButtonStyle} onClick={() => { setOpenProgressReports(!openProgressReports); }}>
                                                    <ListItemIcon sx={listItemIconStyle}>
                                                        <Summarize />
                                                    </ListItemIcon>
                                                    {
                                                        drawerOpen &&
                                                        <ListItemText primary={"Progress Reports"} sx={{ ml: 3 }} />
                                                    }
                                                    {openProgressReports ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={openProgressReports} timeout="auto" unmountOnExit>
                                                    <List style={{ backgroundColor: openDropDownColor }}>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("progress-reports/primary"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Elderly />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Primary" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                        <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("progress-reports/pre-primary"); }}>
                                                            <ListItemIcon sx={listItemIconStyle}>
                                                                <Stroller />
                                                            </ListItemIcon>
                                                            {
                                                                drawerOpen &&
                                                                <ListItemText primary="Pre-primary" sx={{ ml: 3 }} />
                                                            }
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </>
                                        }
                                        {
                                            // REPORTS
                                            (context.userType === UserType.ADMIN || context.userType === UserType.STAFF) &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("reports"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <Assessment />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Reports"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                        {
                                            // SITE AMINISTRATION
                                            (context.userType === UserType.ADMIN) &&
                                            <ListItemButton sx={listItemButtonStyle} onClick={() => { navigate("site-administration"); }}>
                                                <ListItemIcon sx={listItemIconStyle}>
                                                    <Settings />
                                                </ListItemIcon>
                                                {
                                                    drawerOpen &&
                                                    <ListItemText primary={"Site Administration"} sx={{ ml: 3 }} />
                                                }
                                            </ListItemButton>
                                        }
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    }

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: context.isMobile ? 0 : 3,
                            maxWidth: showDrawer ? `${contentWidth - drawerWidth - 10}px` : `${contentWidth}px`,
                            backgroundColor: "#ffffff"
                        }}
                    >
                        {/* add empty toolbar to shift hidden content down */}
                        <Toolbar />

                        <Breadcrumbs style={{ marginBottom: "15px", borderBottom: "1px solid #eeeeee", paddingBottom: "5px" }}>
                            {
                                breadCrumbs.map((crumb, index) => {
                                    let isInactive = inactiveUrlNames[crumb];
                                    return (
                                        <Link key={index} underline={isInactive ? "none" : "hover"} color="inherit" href="#" onClick={() => !isInactive && navigateWithCrumb(crumb)}>
                                            {crumb}
                                        </Link>
                                    );
                                })
                            }
                        </Breadcrumbs>

                        {
                            props.mainContent
                        }
                    </Box>
                </Box>

            )}
        </GlobalContext.Consumer>
    );
}

export default Layout;

