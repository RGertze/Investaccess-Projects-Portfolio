/* source ./database/productionUpdates/v5-23-5_update.sql;  */

use SCA_DB_DEV;

/*-------------------------------------------------------*/
/*--          GET LAST MESSAGE SENT                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLastMessageSent(
    in userId1 int,
    in userId2 int
)
begin

    select From_User_ID, Message_Content, Message_Date_Added
    from Direct_Message
    where (From_User_ID=userId1 AND To_User_ID=userId2)
    OR (From_User_ID=userId2 AND To_User_ID=userId1)
    order by Message_Date_Added desc
    limit 1;

end //
delimiter ;
