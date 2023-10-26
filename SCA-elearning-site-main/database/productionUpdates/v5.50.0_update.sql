use SCA_DB_DEV;

alter table Direct_Message
add column Message_Read bit not null;

update Direct_Message
set Message_Read=1;


/*----   ADD MESSAGE   ----*/
drop procedure sp_addDirectMessage;
delimiter // 
create procedure sp_addDirectMessage( 
    in fromUserID int,
    in toUserID int,
    in message varchar(500)
)
begin
    if ( ((fromUserID in(select Staff_ID from Staff) OR fromUserID in(select Student_ID from Student) OR fromUserID in(select Admin_ID from Admin) OR fromUserID in(select Parent_ID from Parent)) AND (toUserID in(select Staff_ID from Staff) OR toUserID in(select Student_ID from Student) OR toUserID in(select Admin_ID from Admin) OR toUserID in(select Parent_ID from Parent))) AND message  != '') then

        insert into Direct_Message(From_User_ID, To_User_ID, Message_Content, Message_Date_Added, Message_Read)
        values(fromUserID, toUserID, message, current_timestamp(), 0);

        select 'ok' as RESULT;
    else
        select 'one or both users does not exist, or message is empty' as RESULT;
    end if;
end //
delimiter ;


/*----   GET USERS TO MESSAGE   ----*/
drop procedure sp_getUsersToMessage;
delimiter //
create procedure sp_getUsersToMessage(  
    in usID int,
    in userType int
)
begin
    if(userType=1) then
        select Admin_ID as userID,
               Admin_Name as userName,
               ((select count(*) from Direct_Message
                 where From_User_ID=Admin_ID AND To_User_ID=usID AND Message_Read=0) > 0) as newMessages
        from Admin
        where Admin_ID!=usID
        order by newMessages desc;
    else
        if(userType=2) then
            select Staff_ID as userID,
                   concat(Staff_Name,' ',Staff_Surname) as userName,
                   ((select count(*) from Direct_Message
                     where From_User_ID=Staff_ID AND To_User_ID=usID AND Message_Read=0) > 0) as newMessages
            from Staff
            where Staff_ID!=usID
            order by newMessages desc;
        else
            if(userType=3) then
                select Student_ID as userID,
                       concat(Student_First_Name,' ',Student_Surname_Name) as userName,
                       ((select count(*) from Direct_Message
                         where From_User_ID=Student_ID AND To_User_ID=usID AND Message_Read=0) > 0) as newMessages
                from Student
                where Student_ID!=usID
                order by newMessages desc;
            else
                if(userType=4) then
                    select Parent_ID as userID,
                           concat(Parent_Name,' ',Parent_Surname) as userName,
                           ((select count(*) from Direct_Message
                             where From_User_ID=Parent_ID AND To_User_ID=usID AND Message_Read=0) > 0) as newMessages
                    from Parent
                    where Parent_ID!=usID
                    order by newMessages desc;
                else
                    select 'incorrect type given' as RESULT;
                end if;
            end if;
        end if;
    end if;
end //
delimiter ;


/*----   CHECK FOR UNREAD MESSAGES   ----*/
delimiter //
create procedure sp_checkUnreadMessages(
    in userID int
)
begin

    select (count(*) > 0) as newMessages
    from Direct_Message
    where To_User_ID=userID AND Message_Read=0;

end //
delimiter ;


/*----   MARK MESSAGES AS READ   ----*/
delimiter //
create procedure sp_markMessagesAsRead(
    in fromUserID int,
    in toUserID int
)
begin

    update Direct_Message
    set Message_Read=1
    where From_User_ID=fromUserID AND To_User_ID=toUserID;

    select 'ok' as RESULT;

end //
delimiter ;

