use SCA_DB_DEV;


alter table Staff auto_increment=1016;
alter table Student auto_increment=2060;

/*-------------------------------------------------------*/
/*--          UPDATE CURRENT STAFF IDS                   */
/*-------------------------------------------------------*/

drop procedure if exists sp_updateCurrentStaffIDS;
delimiter //
create procedure sp_updateCurrentStaffIDS(
)
begin
    insert into Staff(Staff_ID,Position_ID,Staff_Name,Staff_Surname,Staff_Age,Staff_Cell,Staff_Email,Staff_Password)
    select (Staff_ID+1000), Position_ID, Staff_Name, Staff_Surname, Staff_Age, Staff_Cell, Staff_Email, Staff_Password
    from Staff;

    update Course
    set Staff_ID=Staff_ID+1000
    where Staff_ID<=1016;

    delete from Staff where Staff_ID<=1016;
end //
delimiter ;

call sp_updateCurrentStaffIDS();


/*-------------------------------------------------------*/
/*--          UPDATE CURRENT STUDENT IDS                   */
/*-------------------------------------------------------*/

drop procedure if exists sp_updateCurrentStudentIDS;
delimiter //
create procedure sp_updateCurrentStudentIDS(
)
begin
    insert into Student(Student_ID,Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password)
    select (Student_ID+2000), Student_First_Name, Student_Surname_Name, Student_Age, Student_Grade, Student_Guardian_Cell, Student_Guardian_Email_F, Student_Guardian_Email_M, Student_Password
    from Student
    where Student_ID <= 2060;

    update Student_Report
    set Student_ID=Student_ID+2000
    where Student_ID<=2060;

    update Student_Course
    set Student_ID=Student_ID+2000
    where Student_ID<=2060;

    update Student_Assignment_File
    set Student_ID=Student_ID+2000
    where Student_ID<=2060;

    update Student_Assignment_Mark
    set Student_ID=Student_ID+2000
    where Student_ID<=2060;

    delete from Student where Student_ID<=2060;
end //
delimiter ;

call sp_updateCurrentStudentIDS();


create table Direct_Message(
    Message_ID int primary key auto_increment,
    From_User_ID int not null,
    To_User_ID int not null,
    Message_Content varchar(500) not null,
    Message_Date_Added timestamp not null
);


/*-------------------------------------------------------*/
/*--          ADD DIRECT MESSAGE                         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_addDirectMessage(
    in fromUserID int,
    in toUserID int,
    in message varchar(500)
)
begin
    if ( ((fromUserID in(select Staff_ID from Staff) OR fromUserID in(select Student_ID from Student) OR fromUserID in(select Admin_ID from Admin)) AND (toUserID in(select Staff_ID from Staff) OR toUserID in(select Student_ID from Student) OR toUserID in(select Admin_ID from Admin))) AND message != '') then

        insert into Direct_Message(From_User_ID, To_User_ID, Message_Content, Message_Date_Added)
        values(fromUserID, toUserID, message, current_timestamp());

        select 'ok' as RESULT;
    else
        select 'one or both users does not exist, or message is empty' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*--          GET ALL MESSAGES BETWEEN USERS             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllMessagesBetweenUsers(
    in userId1 int,
    in userId2 int
)
begin

    select From_User_ID, Message_Content, Message_Date_Added
    from Direct_Message
    where (From_User_ID=userId1 AND To_User_ID=userId2)
    OR (From_User_ID=userId2 AND To_User_ID=userId1)
    order by Message_Date_Added asc;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--          GET USERS TO MESSAGE                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getUsersToMessage(
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
                select 'incorrect type given' as RESULT;
            end if;
        end if;
    end if;
end //
delimiter ;
