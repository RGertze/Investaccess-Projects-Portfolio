
/* TABLES */

create table Parent(  /*----   !!   ----*/
    Parent_ID int primary key auto_increment,
    Parent_Password varchar(500) not null,
    Parent_ID_Number varchar(11) unique not null,
    Parent_Name varchar(100) not null,
    Parent_Surname varchar(100) not null,
    Parent_Email varchar(100) not null,
    Parent_Address varchar(500),
    Parent_Home_Language varchar(100) not null,
    Parent_Religion varchar(200) not null
);

create table Parent_Student(  /*----   !!   ----*/
    Parent_ID int not null,
    Student_ID int not null,

    foreign key (Parent_ID) references Parent(Parent_ID),
    foreign key (Student_ID) references Student(Student_ID),

    primary key(Parent_ID, Student_ID)
);


alter table Parent auto_increment=5001; /*----   !!   ----*/

create table File_For_Parents( /*----   !!   ----*/
    File_Path varchar(500) primary key,
    File_Type int not null,
    File_Name varchar(200) not null,
    File_Date_Added Date not null
);

create table Parent_Finances(  /*----   !!   ----*/
    Parent_ID int primary key,
    Current_Balance decimal(19,2) not null,
    Next_Payment_Due Date,

    foreign key (Parent_ID) references Parent(Parent_ID)
);

create table Parent_Financial_Statement( /*----   !!   ----*/
    Statement_File_Path varchar(500) primary key,
    Parent_ID int not null,
    Statement_File_Name varchar(500) not null,
    Statement_File_Date_Added Date not null,
    Statement_Month varchar(20),

    foreign key (Parent_ID) references Parent(Parent_ID)
);

create table Parent_Registration_Request(/*----   !!   ----*/
    Parent_ID_Number varchar(11) unique not null,
    Parent_Name varchar(100) not null,
    Parent_Surname varchar(100) not null,
    Parent_Email varchar(100) not null,
    Parent_Address varchar(500),
    Parent_Home_Language varchar(100) not null,
    Parent_Religion varchar(200) not null,
    Parent_Children_Info varchar(700) not null,
    Parent_Password varchar(500) not null
);

create table Terms_And_Conditions_File(/*----   !!   ----*/
    File_Path varchar(500) primary key,
    File_Name varchar(500) not null
);

create table Terms_And_Conditions_Accepted(/*----   !!   ----*/
    Parent_ID int primary key,

    foreign key (Parent_ID) references Parent(Parent_ID)
);


/* ADD PROCS */

delimiter //
create procedure sp_addParent( /*----   !!   ----*/  
    in idNum varchar(11),
    in pword varchar(500),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200)
)
begin
    if(idNum != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName != '' AND pSurname != '' AND pEmail != '' AND pHomeLang != '' AND pReligion != '' AND pword != '') then
        insert into Parent(
            Parent_ID_Number,
            Parent_Password,
            Parent_Name,
            Parent_Surname,
            Parent_Email,
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

delimiter //
create procedure sp_addFileForParents( /*----   !!   ----*/
    in filePath varchar(500),
    in fileName varchar(200),
    in fileType int
)
begin
    if(filePath not in(select File_Path from File_For_Parents) AND filePath!='' AND fileName!='' AND fileType>0) then
        insert into File_For_Parents(
            File_Path,
            File_Type,
            File_Name,
            File_Date_Added
        )
        values(
            filePath,
            fileType,
            fileName,
            curdate()
        );

        select 'ok' as RESULT;
    else
        select 'file already exists or one of the fields were empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addParentFinances( /*----   !!   ----*/
    in parentID int
)
begin
    insert into Parent_Finances(
        Parent_ID,
        Current_Balance,
        Next_Payment_Due
    )
    values(
        parentID,
        0,
        null
    );
end //
delimiter ;

delimiter //
create procedure sp_addParentFinancialStatement( /*----   !!   ----*/
    in filePath varchar(500),
    in parentID int,
    in fileName varchar(500),
    in statementMonth varchar(20)
)
begin
    if(filePath != '' AND filePath not in(select Statement_File_Path from Parent_Financial_Statement) AND fileName != '' AND parentID in(select Parent_ID from Parent)) then
        insert into Parent_Financial_Statement(
            Statement_File_Path,
            Parent_ID,
            Statement_File_Name,
            Statement_File_Date_Added,
            Statement_Month
        )
        values(
            filePath,
            parentID,
            fileName,
            curdate(),
            statementMonth
        );

        select 'ok' as RESULT;
    else
        select 'parent not found, file already exists, or one of the fields was empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addParentStudent( /*----   !!   ----*/
    in parentID int,
    in studentID int
)
begin
    if(parentID in(select Parent_ID from Parent) AND studentID in(select Student_ID from Student)) then
        insert into Parent_Student(
            Parent_ID,
            Student_ID
        )
        values(
            parentID,
            studentID
        );

        select 'ok' as RESULT;
    else
        select 'parent not found or student not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addParentRegistrationRequest( /*----   !!   ----*/  
    in idNum varchar(11),
    in pword varchar(500),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200),
    in pChildInfo varchar(700)
)
begin
    if(idNum != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName != '' AND pSurname != '' AND pEmail != '' AND pHomeLang != '' AND pReligion != '' AND pword != '' AND pChildInfo != '') then
        insert into Parent_Registration_Request(
            Parent_ID_Number,
            Parent_Password,
            Parent_Name,
            Parent_Surname,
            Parent_Email,
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

delimiter //
create procedure sp_addTermsAndConditionsFile( /*----   !!   ----*/
    in filePath varchar(500),
    in fileName varchar(500)
)
begin
    if(filePath not in(select File_Path from Terms_And_Conditions_File) AND fileName != '') then
        insert into Terms_And_Conditions_File(
            File_Path,
            File_Name
        )
        values(
            filePath,
            fileName
        );

        /* 
            parents will have to accept terms and conditions each time
            a new terms and conditions file is added
        */

        delete from Terms_And_Conditions_Accepted;

        select 'ok' as RESULT;
    else
        select 'file already exists or file name was empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addTermsAndConditionsAccepted( /*----   !!   ----*/
    in parentID int
)
begin
    if(parentID in(select Parent_ID from Parent)) then
        insert into Terms_And_Conditions_Accepted(
            Parent_ID
        )
        values(
            parentID
        );

        select 'ok' as RESULT;
    else
        select 'parent does not exist' as RESULT;
    end if;
end //
delimiter ;

/* UPDATE PROCS */

delimiter //
create procedure sp_updateParent( /*----   !!   ----*/  
    in idNum varchar(11),
    in pName varchar(100),
    in pSurname varchar(100),
    in pEmail varchar(100),
    in pAddr varchar(500),
    in pHomeLang varchar(100),
    in pReligion varchar(200)
)
begin
    if(idNum in(select Parent_ID_Number from Parent) AND pName != '' AND pSurname != '' AND pEmail != '' AND pHomeLang != '' AND pReligion != '') then
        update Parent
        set Parent_ID_Number=idNum,
            Parent_Name=pName,
            Parent_Surname=pSurname,
            Parent_Email=pEmail,
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

delimiter //
create procedure sp_updateParentFinancesBalance( /*----   !!   ----*/  
    in parentID int,
    in balance decimal(19,2)
)
begin
    if(parentID in(select Parent_ID from Parent_Finances) AND balance >= 0) then
        update Parent_Finances
        set Current_Balance=balance
        where Parent_ID=parentID;

        select 'ok' as RESULT;
    else
        select 'parent does not exist, or balance provided was invalid' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateParentFinancesNextPaymentDate( /*----   !!   ----*/  
    in parentID int,
    in nextDate Date
)
begin
    if(parentID in(select Parent_ID from Parent_Finances)) then
        update Parent_Finances
        set Next_Payment_Due=nextDate
        where Parent_ID=parentID;

        select 'ok' as RESULT;
    else
        select 'parent does not exist' as RESULT;
    end if;
end //
delimiter ;

/* DELETE PROCS */

delimiter //
create procedure sp_deleteParent(/*----   !!   ----*/    
    in idNum varchar(11)
)
begin
    if(idNum in(select Parent_ID_Number from Parent)) then

        delete from Parent_Registration_Request
        where Parent_ID_Number=idNum;

        delete from Parent_Finances
        where Parent_ID=(select Parent_ID from Parent where Parent_ID_Number=idNum);

        delete from Parent_Financial_Statement
        where Parent_ID=(select Parent_ID from Parent where Parent_ID_Number=idNum);

        delete from Parent
        where Parent_ID_Number=idNum;

        select 'ok' as RESULT;
    else
        select 'parent does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteFileForParents(/*----   !!   ----*/    
    in filePath varchar(500)
)
begin
    if(filePath in(select File_Path from File_For_Parents)) then

        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from File_For_Parents
        where File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteParentRegistrationRequest(/*----   !!   ----*/    
    in idNum varchar(11)
)
begin
    if(idNum in(select Parent_ID_Number from Parent_Registration_Request)) then

        delete from Parent_Registration_Request
        where Parent_ID_Number=idNum;

        select 'ok' as RESULT;
    else
        select 'parent registration record does not exist' as RESULT;
    end if;
end //
delimiter ;

/* OTHER PROCS */

/*-------------------------------------------------------*/
/*--            GET ALL STUDENTS SHORT      !!!!!!!      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllStudentsShort()
begin
    select Student_ID, Student_First_Name, Student_Surname_Name
    from Student
    order by Student_ID asc;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET ALL PARENTS      !!!!!!!!!!!!!             */
/*-------------------------------------------------------*/

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
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET PARENT DETAILS   !!!!!!!!!!!!!             */
/*-------------------------------------------------------*/

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
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent
    where Parent_ID=parentID;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ALL TIMETABLES     !!!!!!!!!!!!!           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllTimetables(
)
begin
    select
        File_Path,
        File_Type, 
        File_Name,
        File_Date_Added
    from File_For_Parents
    where File_Type=1;   /* 1 --> timetable*/
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ALL CALENDARS      !!!!!!!!!!!!!           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllCalendars(
)
begin
    select
        File_Path,
        File_Type, 
        File_Name,
        File_Date_Added
    from File_For_Parents
    where File_Type=2;   /* 2 --> calendar*/
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ALL SUPPORT DOCUMENTS      !!!!!!!!!!!!!   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllSupportDocuments(
)
begin
    select
        File_Path,
        File_Type, 
        File_Name,
        File_Date_Added
    from File_For_Parents
    where File_Type=3;   /* 3 --> support/donation files*/
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET PARENT FINANCES      !!!!!!!!!!!!!         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getParentFinances(
    in parentID int
)
begin
    select
        Current_Balance,
        Next_Payment_Due 
    from Parent_Finances
    where Parent_ID=parentID; 
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET PARENT FINANCIAL STATEMENTS   !!!!!!!      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getParentFinancialStatements(
    in parentID int
)
begin
    select
        Statement_File_Path,
        Statement_File_Name,
        Statement_File_Date_Added,
        Statement_Month 
    from Parent_Financial_Statement
    where Parent_ID=parentID; 
end //
delimiter ;



/*-------------------------------------------------------*/
/*--            GET PARENT STUDENTS         !!!!!!!      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getParentStudents(
    in parentID int
)
begin
    select
        Student.Student_ID,
        Student.Student_First_Name,
        Student.Student_Surname_Name
    from Parent_Student
    inner join Student
    on Student.Student_ID=Parent_Student.Student_ID
    where Parent_Student.Parent_ID=parentID; 
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET PARENT REGISTRATION REQUESTS    !!!!!!!!!!!*/
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getParentRegistrationRequests()
begin
    select
        Parent_ID_Number,
        Parent_Name,
        Parent_Surname,
        Parent_Email,
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



/*-------------------------------------------------------*/
/*--      GET PARENT REGISTRATION STUDENT INFO     !!!!!!*/
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getParentRegistrationStudentInfo(
    in idNum varchar(11)
)
begin
    select
        Parent_Children_Info
    from Parent_Registration_Request
    where Parent_ID_Number=idNum;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET TERMS AND CONDITIONS FILES           !!!!!!*/
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getTermsAndConditionsFiles()
begin
    select
        File_Path,
        File_Name 
    from Terms_And_Conditions_File;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      CHECK IF TERMS AND CONDITIONS ACCEPTED   !!!!!!*/
/*-------------------------------------------------------*/

delimiter //
create procedure sp_checkTermsAndConditionsAccepted(
    in parentID int
)
begin
    if(parentID in(select Parent_ID from Terms_And_Conditions_Accepted)) then
        select 'ok' as RESULT;
    else
        select 'not accepted' as RESULT;
    end if;
end //
delimiter ;



