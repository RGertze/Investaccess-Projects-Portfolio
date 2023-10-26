use SCA_DB_DEV;

drop procedure sp_addDirectMessage;
delimiter // 
create procedure sp_addDirectMessage(   /*----   !!   ----*/
    in fromUserID int,
    in toUserID int,
    in message varchar(500)
)
begin
    if ( ((fromUserID in(select Staff_ID from Staff) OR fromUserID in(select Student_ID from Student) OR fromUserID in(select Admin_ID from Admin) OR fromUserID in(select Parent_ID from Parent)) AND (toUserID in(select Staff_ID from Staff) OR toUserID in(select Student_ID from Student) OR toUserID in(select Admin_ID from Admin) OR toUserID in(select Parent_ID from Parent))) AND message  != '') then

        insert into Direct_Message(From_User_ID, To_User_ID, Message_Content, Message_Date_Added)
        values(fromUserID, toUserID, message, current_timestamp());

        select 'ok' as RESULT;
    else
        select 'one or both users does not exist, or message is empty' as RESULT;
    end if;
end //
delimiter ;

drop procedure sp_getUsersToMessage;
delimiter //
create procedure sp_getUsersToMessage(  /*----   !!   ----*/
    in usID int,
    in userType int
)
begin
    if(userType=1) then
        select Admin_ID as userID, Admin_Name as userName
        from Admin
        where Admin_ID!=usID;
    else
        if(userType=2) then
            select Staff_ID as userID, concat(Staff_Name,' ',Staff_Surname) as userName
            from Staff
            where Staff_ID!=usID;
        else
            if(userType=3) then
                select Student_ID as userID, concat(Student_First_Name,' ',Student_Surname_Name) as userName
                from Student
                where Student_ID!=usID;
            else
                if(userType=4) then
                    select Parent_ID as userID, concat(Parent_Name,' ',Parent_Surname) as userName
                    from Parent
                    where Parent_ID!=usID;
                else
                    select 'incorrect type given' as RESULT;
                end if;
            end if;
        end if;
    end if;
end //
delimiter ;