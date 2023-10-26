use SCA_ITS;

alter table
    `Parent` drop column Approval_Requested,
    drop column Rejection_Message,
    drop column DepositPopupViewed,
add
    column Registration_Stage INT NOT NULL after Reason_For_School_Selection;

update Parent set Registration_Stage=6 where User_Id = 2;

update Parent set Registration_Stage=1 where User_Id = 17;

update Parent set Registration_Stage=1 where User_Id = 19;

update Parent set Registration_Stage=1 where User_Id = 20;

update Parent set Registration_Stage=1 where User_Id = 21;

update Parent set Registration_Stage=1 where User_Id = 23;

update Parent set Registration_Stage=1 where User_Id = 25;

update Parent set Registration_Stage=1 where User_Id = 26;

update Parent set Registration_Stage=1 where User_Id = 27;

update Parent set Registration_Stage=6 where User_Id = 29;

update Parent set Registration_Stage=1 where User_Id = 30;

update Parent set Registration_Stage=1 where User_Id = 31;

update Parent set Registration_Stage=1 where User_Id = 32;

update Parent set Registration_Stage=1 where User_Id = 33;

update Parent set Registration_Stage=1 where User_Id = 34;

update Parent set Registration_Stage=1 where User_Id = 35;

update Parent set Registration_Stage=1 where User_Id = 36;

update Parent set Registration_Stage=1 where User_Id = 37;

update Parent set Registration_Stage=1 where User_Id = 38;

update Parent set Registration_Stage=1 where User_Id = 39;

update Parent set Registration_Stage=1 where User_Id = 40;

CREATE TABLE
    Parent_Registration_Status(
        Parent_Id INT NOT NULL,
        Details_Added BIT NOT NULL,
        Other_Parents_Added BIT NOT NULL,
        Students_Added BIT NOT NULL,
        Required_Docs_Added BIT NOT NULL,
        /**/
        Details_Rejection_Message TEXT,
        Other_Parents_Rejection_Message TEXT,
        Students_Rejection_Message TEXT,
        Required_Docs_Rejection_Message TEXT,
        /**/
        Registration_Fee_Paid BIT NOT NULL,
        Registration_Fee_Rejection_Message TEXT,
        /**/
        FOREIGN KEY (Parent_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE,
        PRIMARY KEY (Parent_Id)
    );

insert into
    Parent_Registration_Status(
        Parent_Id,
        Details_Added,
        Other_Parents_Added,
        Students_Added,
        Required_Docs_Added,
        Registration_Fee_Paid
    )
values (2, 0, 0, 0, 0, 0), (17, 0, 0, 0, 0, 0), (19, 0, 0, 0, 0, 0), (20, 0, 0, 0, 0, 0), (21, 0, 0, 0, 0, 0), (23, 0, 0, 0, 0, 0), (25, 0, 0, 0, 0, 0), (26, 0, 0, 0, 0, 0), (27, 0, 0, 0, 0, 0), (29, 0, 0, 0, 0, 0), (30, 0, 0, 0, 0, 0), (31, 0, 0, 0, 0, 0), (32, 0, 0, 0, 0, 0), (33, 0, 0, 0, 0, 0), (34, 0, 0, 0, 0, 0), (35, 0, 0, 0, 0, 0), (36, 0, 0, 0, 0, 0), (37, 0, 0, 0, 0, 0), (38, 0, 0, 0, 0, 0), (39, 0, 0, 0, 0, 0), (40, 0, 0, 0, 0, 0);

CREATE TABLE
    Parent_Registration_Payment_File(
        File_Path VARCHAR(600) PRIMARY KEY,
        File_Name VARCHAR(500) NOT NULL,
        Parent_Id INT NOT NULL,
        /**/
        FOREIGN KEY (Parent_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE
    );

alter table
    `Student` drop column Registration_Status,
    drop column Interview_Date,
    drop column Interview_Comments,
add
    column Registration_Stage INT NOT NULL after Chronic_Medication,
add
    column Approval_Requested BIT NOT NULL after Rejection_Message;

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "23128213878";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "2316243676";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "2316233575";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "2310434079";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "23109283072";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "23109283877";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "23141112774";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "23178183373";

update Student
set
    Registration_Stage = 1,
    Approval_Requested = 1
where
    Student_Number = "231211282972";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511250";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23161123";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23161122";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23161121";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23151128";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511271";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23151127";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511252";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231711244";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23151125";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511242";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23151124";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511213";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511211";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231511210";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23151120";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23141129";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231911266";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where Student_Number = "john";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "237711240";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "236711253";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "233811257";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "2322101124";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231911270";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231911269";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231911267";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231411216";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231811265";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231811262";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231811261";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231811247";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231711264";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231711263";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231711246";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231711245";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111235";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211231";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211229";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211228";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211225";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211222";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211220";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111254";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111248";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111238";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211243";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111234";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111233";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231111232";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231011230";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "230911237";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23061014271";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "2305124280";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "230311241";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311227";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231411256";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231411218";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "220038627";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231411214";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231411212";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311258";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311255";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311251";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "23141126";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311226";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311224";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311223";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311221";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311219";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311217";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231311215";

update Student
set
    Registration_Stage = 13,
    Approval_Requested = 1
where
    Student_Number = "231211249";

CREATE TABLE
    Student_Registration_Status(
        Student_Number VARCHAR(150) NOT NULL,
        Basic_Details_Added bit not null,
        General_Info_Added bit not null,
        Religious_Info_Added bit not null,
        Scholastic_Info_Added bit not null,
        Medical_Info_Added bit not null,
        Medical_Conditions_Added bit not null,
        Other_Parents_Added bit not null,
        Non_Sca_Students_Added bit not null,
        Required_Docs_Added bit not null,
        Occupational_Therapy_Needed bit not null,
        Occupational_Report_Added bit not null,
        /**/
        Therapist_Name VARCHAR(100),
        Therapist_Cell VARCHAR(20),
        Therapist_Email VARCHAR(100),
        Therapist_Url VARCHAR(100),
        Diagnostic_Test_Needed bit not null,
        Diagnostic_Result_Added bit not null,
        Diagnostic_Test_Link VARCHAR(200),
        /**/
        Basic_Rejection_Message TEXT,
        General_Rejection_Message TEXT,
        Religious_Rejection_Message TEXT,
        Scholastic_Rejection_Message TEXT,
        Medical_Rejection_Message TEXT,
        Conditions_Rejection_Message TEXT,
        Other_Parents_Rejection_Message TEXT,
        Non_Sca_Rejection_Message TEXT,
        Required_Docs_Rejection_Message TEXT,
        Therapy_Rejection_Message TEXT,
        Diagnostic_Rejection_Message TEXT,
        /**/
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        PRIMARY KEY (Student_Number)
    );

insert into
    Student_Registration_Status(
        Student_Number,
        Basic_Details_Added,
        General_Info_Added,
        Religious_Info_Added,
        Scholastic_Info_Added,
        Medical_Info_Added,
        Medical_Conditions_Added,
        Other_Parents_Added,
        Non_Sca_Students_Added,
        Required_Docs_Added,
        Occupational_Therapy_Needed,
        Occupational_Report_Added,
        Diagnostic_Test_Needed,
        Diagnostic_Result_Added
    )
values (
        "23128213878",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "2316243676",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "2316233575",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "2310434079",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23109283072",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23109283877",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23141112774",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23178183373",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211282972",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511250",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23161123",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23161122",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23161121",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23151128",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511271",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23151127",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511252",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231711244",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23151125",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511242",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23151124",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511213",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511211",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231511210",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23151120",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23141129",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231911266",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "john",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "237711240",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "236711253",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "233811257",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "2322101124",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231911270",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231911269",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231911267",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231411216",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231811265",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231811262",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231811261",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231811247",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231711264",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231711263",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231711246",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231711245",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111235",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211231",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211229",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211228",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211225",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211222",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211220",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111254",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111248",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111238",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211243",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111234",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111233",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231111232",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231011230",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "230911237",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23061014271",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "2305124280",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "230311241",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311227",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231411256",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231411218",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "220038627",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231411214",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231411212",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311258",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311255",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311251",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "23141126",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311226",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311224",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311223",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311221",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311219",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311217",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231311215",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ), (
        "231211249",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    );

CREATE TABLE
    Student_Occupational_Therapy_File(
        File_Path VARCHAR(600) PRIMARY KEY,
        File_Name VARCHAR(500) NOT NULL,
        Student_Number VARCHAR(150) NOT NULL,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE
    );