/* source v5.47.2_update.sql; */

drop table Parent_Finances;
drop table Parent_Financial_Statement;
drop table Parent_Student;
drop table Terms_And_Conditions_Accepted; 

drop table Parent;
drop table Parent_Registration_Request;


create table Parent( /*----   !!   ----*/ 
    Parent_ID int primary key auto_increment,
    Parent_Password varchar(500) not null,
    Parent_ID_Number varchar(11) unique not null,
    Parent_Name varchar(100) not null,
    Parent_Surname varchar(100) not null,
    Parent_Email varchar(100) not null,
    Parent_Mobile varchar(15) not null,
    Parent_Address varchar(500),
    Parent_Home_Language varchar(100) not null,
    Parent_Religion varchar(200) not null
);
alter table Parent auto_increment=5001; 
create table Parent_Registration_Request(/*----   !!   ----*/
    Parent_ID_Number varchar(11) unique not null,
    Parent_Name varchar(100) not null,
    Parent_Surname varchar(100) not null,
    Parent_Email varchar(100) not null,
    Parent_Mobile varchar(15) not null,
    Parent_Address varchar(500),
    Parent_Home_Language varchar(100) not null,
    Parent_Religion varchar(200) not null,
    Parent_Children_Info varchar(700) not null,
    Parent_Password varchar(500) not null
);
create table Terms_And_Conditions_Accepted(
    Parent_ID int primary key,

    foreign key (Parent_ID) references Parent(Parent_ID)
);
create table Parent_Student(  
    Parent_ID int not null,
    Student_ID int not null,

    foreign key (Parent_ID) references Parent(Parent_ID),
    foreign key (Student_ID) references Student(Student_ID),

    primary key(Parent_ID, Student_ID)
);
create table Parent_Finances(  
    Parent_ID int primary key,
    Current_Balance decimal(19,2) not null,
    Next_Payment_Due Date,

    foreign key (Parent_ID) references Parent(Parent_ID)
);
create table Parent_Financial_Statement( 
    Statement_File_Path varchar(500) primary key,
    Parent_ID int not null,
    Statement_File_Name varchar(500) not null,
    Statement_File_Date_Added Date not null,
    Statement_Month varchar(20),

    foreign key (Parent_ID) references Parent(Parent_ID)
);

drop procedure sp_addParent;
delimiter //
create procedure sp_addParent( /*----   !!   ----*/   
    in idNum varchar(11),
    in pword varchar(500),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in mobileNum varchar(15),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200)
)
begin
    if(idNum  != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName != '' AND pSurname != '' AND pEmail != '' AND pHomeLang != '' AND pReligion != '' AND pword != '' AND mobileNum != '') then
        insert into Parent(
            Parent_ID_Number,
            Parent_Password,
            Parent_Name,
            Parent_Surname,
            Parent_Email,
            Parent_Mobile,
            Parent_Address,
            Parent_Home_Language,
            Parent_Religion
        )
        values(
            idNum,
            pword,
            pName,
            pSurname,
            pEmail,
            mobileNum,
            pAddr,
            pHomeLang,
            pReligion
        );

        set @parentID = last_insert_id();

        call sp_addParentFinances(@parentID);

        select 'ok' as RESULT;
    else
        select 'id number already in use, or one of the provided values was empty' as RESULT;
    end if;
end //
delimiter ;

drop procedure sp_addParentRegistrationRequest;
delimiter //
create procedure sp_addParentRegistrationRequest( /*----   !!   ----*/   
    in idNum varchar(11),
    in pword varchar(500),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in mobileNum varchar(15),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200),
    in pChildInfo varchar(700)
)
begin
    if(idNum != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName  != '' AND pSurname  != '' AND pEmail  != '' AND pHomeLang  != '' AND pReligion  != '' AND pword  != '' AND pChildInfo  != '' AND mobileNum != '') then
        insert into Parent_Registration_Request(
            Parent_ID_Number,
            Parent_Password,
            Parent_Name,
            Parent_Surname,
            Parent_Email,
            Parent_Mobile,
            Parent_Address,
            Parent_Home_Language,
            Parent_Religion,
            Parent_Children_Info
        )
        values(
            idNum,
            pword,
            pName,
            pSurname,
            pEmail,
            mobileNum,
            pAddr,
            pHomeLang,
            pReligion,
            pChildInfo
        );

        select 'ok' as RESULT;
    else
        select 'id number already in use, or one of the provided values was empty' as RESULT;
    end if;
end //
delimiter ;

drop procedure sp_updateParent;
delimiter //
create procedure sp_updateParent(  /*----   !!   ----*/ 
    in idNum varchar(11),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in mobileNum varchar(15),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200)
)
begin
    if(idNum in(select Parent_ID_Number from Parent) AND pName  != '' AND pSurname  != '' AND pEmail  != '' AND pHomeLang  != '' AND pReligion  != '' AND mobileNum != '') then
        update Parent
        set Parent_ID_Number=idNum,
            Parent_Name=pName,
            Parent_Surname=pSurname,
            Parent_Email=pEmail,
            Parent_Mobile=mobileNum,
            Parent_Address=pAddr,
            Parent_Home_Language=pHomeLang,
            Parent_Religion=pReligion
        where Parent_ID_Number=idNum;

        select 'ok' as RESULT;
    else
        select 'parent does not exist, or one of the provided values was empty' as RESULT;
    end if;
end //
delimiter ;

drop procedure sp_getAllParents;
delimiter //
create procedure sp_getAllParents(
)
begin
    select
        Parent_ID,
        Parent_ID_Number,
        Parent_Name,
        Parent_Surname,
        Parent_Email,
        Parent_Mobile,
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent;
end //
delimiter ;

drop procedure sp_getParentDetails; 
delimiter //
create procedure sp_getParentDetails(
    parentID int
)
begin
    select
        Parent_ID_Number,
        Parent_Name,
        Parent_Surname,
        Parent_Email,
        Parent_Mobile,
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent
    where Parent_ID=parentID;
end //
delimiter ;

drop procedure sp_getParentRegistrationRequests;
delimiter //
create procedure sp_getParentRegistrationRequests()
begin
    select
        Parent_ID_Number,
        Parent_Name,
        Parent_Surname,
        Parent_Email,
        Parent_Mobile,
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion,
        Parent_Password
    from Parent_Registration_Request
    where Parent_ID_Number not in(select Parent_ID_Number from Parent);
    /*
        parent registration requests will only be removed once 
        the admin is done adding students for the new parent using 
        the details provided. Therefore, only requests not already added
        are retrieved in this proc
    */
end //
delimiter ;






