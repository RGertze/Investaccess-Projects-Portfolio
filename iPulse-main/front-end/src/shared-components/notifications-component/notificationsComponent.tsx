
import { useEffect, useState } from "react";
import { Offcanvas, Tab, Tabs } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, INotification, IResponse, IUser, UserType } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import NotificationComponent from "../notification-component/notificationComponent";
import "./notificationsComponent.css";

interface IProps {
    context: IGlobalContext
}

const NotificationsComponent = (props: IProps) => {

    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [unseenNotifications, setUnseenNotifications] = useState<INotification[]>([]);
    const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
    const [tabKey, initTabKey] = useState('new');

    //----   COMPONENT DID MOUNT    ----
    useEffect(() => {
        getUnseenNotifications();
    }, []);

    //----   ON TAB CHANGE    ----
    useEffect(() => {
        if (tabKey === "all")
            getAllNotifications();
    }, [tabKey]);

    //----   ON NEW NOTIFICATION    ----
    useEffect(() => {
        if (props.context.newNotificationRecv) {
            let newUnseen = [...unseenNotifications, props.context.newNotificationRecv];
            setUnseenNotifications(newUnseen);
            props.context.setNewNotification(false);
        }
    }, [props.context.newNotificationRecv]);

    //----   GET ALL NOTIFICATIONS    ----
    const getAllNotifications = async () => {
        setLoadingNotifications(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_NOTIFICATIONS + props.context.userId, "");
        setLoadingNotifications(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setAllNotifications(result.data);
    }

    //----   GET UNSEEN NOTIFICATIONS    ----
    const getUnseenNotifications = async () => {
        setLoadingNotifications(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_UNSEEN_NOTIFICATIONS + props.context.userId, "");
        setLoadingNotifications(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setUnseenNotifications(result.data);
        props.context.setNewNotification(false);
    }

    return (
        <Offcanvas show={props.context.showNotifications} onHide={() => {
            props.context.setShowNotifications(false);
        }} placement={"end"}>

            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Notifications</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <Tabs activeKey={tabKey} onSelect={(e) => initTabKey(e ? e : "new")}>
                    <Tab className="notifications-new-tab" eventKey="new" title="New">
                        {
                            loadingNotifications &&
                            <Loading />
                        }
                        {
                            !loadingNotifications &&
                            unseenNotifications.map((n, index) => {
                                return (
                                    <NotificationComponent key={index} notification={n} />
                                );
                            })
                        }
                        {
                            (unseenNotifications.length === 0 && !loadingNotifications) &&
                            <h6>Nothing to show</h6>
                        }
                    </Tab>
                    <Tab className="notifications-all-tab" eventKey="all" title="All">
                        {
                            loadingNotifications &&
                            <Loading />
                        }
                        {
                            !loadingNotifications &&
                            allNotifications.map((n, index) => {
                                return (
                                    <NotificationComponent key={index} notification={n} />
                                );
                            })
                        }
                        {
                            (allNotifications.length === 0 && !loadingNotifications) &&
                            <h6>Nothing to show</h6>
                        }
                    </Tab>
                </Tabs>
            </Offcanvas.Body>

        </Offcanvas>
    );
}

export default NotificationsComponent;