import { Connection, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import { UserItem } from "./userItem";
import "./usersPage.css";

interface IProps {
    context: IGlobalContext
}

export const UsersPage = (props: IProps) => {

    //----   SYNC ALL ITS USERS   ----
    const syncAllITSUsers = async () => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADMIN_SYNC_ALL_ITS_USERS, {}, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        successToast("Syncing has begun and will continue in the background! Check moodle to see if the users were created.", true, 4000);
    }

    return (
        <div className="site-admin-users-container">
            <ul>
                <li>
                    <UserItem action={syncAllITSUsers} buttonLabel={"sync"} info={"Create Moodle accounts for staff and approved students who do not yet have one."} />
                </li>
            </ul>
        </div>
    );
}