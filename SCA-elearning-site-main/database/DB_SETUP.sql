/*-- run sql command: source /~/Web-projects/SCA-elearning-site/database/DB_SETUP.sql;*/
drop database SCA_DB_DEV;

create database SCA_DB_DEV;

use SCA_DB_DEV;

/*-------------------------------------------------------*/
/*-------     TABLE DEFINITIONS                          */
/*-------------------------------------------------------*/

create table Admin(
    Admin_ID int primary key,
    Admin_Name varchar(100),
    Admin_Password varchar(100) not null,
    Admin_Resource_Password varchar(100) not null
);

create table Job_Position(
    Position_ID int primary key auto_increment,
    Position_Name varchar(50) not null,
    Position_Desc varchar(100) not null,
    Position_Level int not null
);

create table Staff(
    Staff_ID int primary key auto_increment,
    Position_ID int not null,
    Staff_Name varchar(50) not null,
    Staff_Surname varchar(50) not null,
    Staff_Age int not null,
    Staff_Cell varchar(15) not null,
    Staff_Email varchar(50) not null,
    Staff_Password varchar(500) not null,

    foreign key (Position_ID) references Job_Position(Position_ID)
);

alter table Staff auto_increment=1001;

create table Course(
    Course_ID int primary key auto_increment,
    Staff_ID int,
    Course_Name varchar(50) not null,
    Course_Desc varchar(100) not null,
    Course_Grade int not null,

    foreign key (Staff_ID) references Staff(Staff_ID)
);

create table Course_Staff(
    Course_ID int not null,
    Staff_ID int not null,

    foreign key (Staff_ID) references Staff(Staff_ID),
    foreign key (Course_ID) references Course(Course_ID)
);

create table Course_Topic(
    Course_Topic_ID int primary key auto_increment,
    Parent_Topic_ID int,
    Course_ID int not null,
    Course_Topic_Name varchar(100),

    foreign key (Parent_Topic_ID) references Course_Topic(Course_Topic_ID),
    foreign key (Course_ID) references Course(Course_ID)
);

create table Course_Material(
    Course_Material_ID int primary key auto_increment,
    Course_ID int not null,
    Course_Topic_ID int not null,
    Course_Material_Path varchar(500) not null,
    Course_Material_Name varchar(100) not null,
    Course_Material_Approved bit not null,
    Course_Material_Delete_Requested bit not null,

    foreign key (Course_ID) references Course(Course_ID),
    foreign key (Course_Topic_ID) references Corse_Topic(Course_Topic_ID)
);

create table Course_Assignment(
    Course_Assignment_Path varchar(500) primary key,
    Course_ID int,
    Course_Assignment_Name varchar(100) not null,
    Course_Assignment_Due_Date date,
    Course_Assignment_Marks_Available decimal(19,2),

    foreign key (Course_ID) references Course(Course_ID)
);

create table Course_Assessment(
    Course_Assessment_ID int primary key auto_increment,
    Course_ID int,
    Course_Assessment_Name varchar(100),
    Course_Assessment_Marks_Available decimal(19,2),
    Course_Assessment_Contribution decimal(19,2),

    foreign key (Course_ID) references Course(Course_ID)
);

create table Course_Announcement(
    Course_Announcement_ID int primary key auto_increment,
    Course_ID int not null,
    Course_Announcement_Message varchar(400) not null,
    Course_Announcement_Date timestamp not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Student(
    Student_ID int primary key auto_increment,
    Student_First_Name varchar(20) not null,
    Student_Surname_Name varchar(25) not null,
    Student_Age int not null,
    Student_Grade int not null,
    Student_Guardian_Cell varchar(15) not null,
    Student_Guardian_Email_M varchar(500) not null,
    Student_Guardian_Email_F varchar(500) not null,
    Student_Password varchar(500) not null
);

alter table Student auto_increment=2001;

create table Student_Report(
    Student_Report_Path varchar(500) primary key,
    Student_ID int not null,
    Student_Report_Name varchar(100) not null,
    Student_Report_Term tinyint not null,
    Student_Report_Year smallint not null,

    foreign key (Student_ID) references Student(Student_ID)
);

create table Student_Course(
    Student_ID int not null,
    Course_ID int not null,
    Student_Course_Enrollment_Date timestamp not null,
    Student_Course_Mark decimal(19,2) not null,

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Course_ID) references Course(Course_ID),

    primary key (Student_ID,Course_ID)
);

create table Student_Assignment_File(
    Student_Assignment_File_ID int primary key auto_increment,
    Student_ID int,
    Course_Assignment_Path varchar(500),
    Student_Assignment_File_Path varchar(500) not null,
    Student_Assignment_File_Name varchar(100) not null,
    Student_Assignment_File_Mark decimal(19,2),

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Course_Assignment_Path) references Course_Assignment(Course_Assignment_Path)
);

create table Student_Assignment_Mark(
    Student_ID int not null,
    Course_Assignment_Path varchar(500) not null,
    Assignment_Mark decimal(19,2),

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Course_Assignment_Path) references Course_Assignment(Course_Assignment_Path),

    primary key(Student_ID,Course_Assignment_Path)
);

create table Student_Assessment_Mark(
    Student_ID int not null,
    Course_Assessment_ID int not null,
    Assessment_Mark decimal(19,2),

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Course_Assessment_ID) references Course_Assessment(Course_Assessment_ID),

    primary key (Student_ID,Course_Assessment_ID)
);

create table Files_To_Delete(
    File_Path varchar(500) primary key
);

create table News_Events(
    News_Events_ID int primary key auto_increment,
    News_Events_Title varchar(500) not null,
    News_Events_Content varchar(10000) not null,
    News_Events_Date_Added date not null,
    News_Events_Img_Path varchar(500)
);

create table Suggestions(
    Suggestion_ID int primary key auto_increment,
    Suggestion_Message varchar(6000) not null,
    Suggestion_Date timestamp not null
);

create table Direct_Message(
    Message_ID int primary key auto_increment,
    From_User_ID int not null,
    To_User_ID int not null,
    Message_Content varchar(500) not null,
    Message_Date_Added timestamp not null,
    Message_Read bit not null
);

create table Home_File(
    Home_File_Path varchar(500) primary key,
    Home_File_Name varchar(100) not null,
    Home_File_Section varchar(100) not null
);

create table Resource_Topic(
    Resource_Topic_ID int primary key auto_increment,
    Resource_Topic_Parent int,
    Course_ID int,
    Visible_To_Students bit not null,
    Resource_Topic_Name varchar(200) not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Resource_File(
    Resource_File_Path varchar(500) primary key,
    Resource_Topic_ID int not null,
    Resource_File_Name varchar(100) not null,
    Resource_File_Date_Added timestamp not null,

    foreign key (Resource_Topic_ID) references Resource_Topic(Resource_Topic_ID)
);

create table Quiz(
    Quiz_ID int primary key auto_increment,
    Course_ID int not null,
    Quiz_Name varchar(200) not null,
    Quiz_Attempts_Allowed int not null,
    Quiz_Opening_Time datetime not null,
    Quiz_Closing_Time datetime not null,
    Quiz_Duration int not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Quiz_Question(
    Quiz_Question_ID int primary key auto_increment,
    Quiz_ID int not null,
    Quiz_Question_Type int not null,
    Quiz_Question_Number int not null,
    Quiz_Question_Value varchar(1000) not null,
    Quiz_Question_Marks_Available int not null,
    Quiz_Question_Has_Multiple_Answers bit,

    foreign key (Quiz_ID) references Quiz(Quiz_ID)
);

create table Quiz_Answer(
    Quiz_Answer_ID int primary key auto_increment,
    Quiz_Question_ID int not null,
    Quiz_Answer_Value varchar(500) not null,
    Quiz_Answer_Is_Correct bit not null,

    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID)
);

create table Student_Quiz(  
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Student_Quiz_Start_Time datetime,
    Student_Quiz_End_Time datetime,
    Student_Quiz_Mark_Obtained decimal(19,2),
    Student_Quiz_Graded bit not null,

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Quiz_ID) references Quiz(Quiz_ID),

    primary key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_Unstructured_Answer(  
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Quiz_Answer_ID int not null,

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID),
    foreign key (Quiz_Answer_ID) references Quiz_Answer(Quiz_Answer_ID),

    primary key (Student_ID, Quiz_ID, Quiz_Question_ID, Quiz_Answer_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_Structured_Answer(   
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Student_Quiz_Structured_Answer_Value varchar(6000) not null,
    Student_Quiz_Structured_Answer_Mark decimal(19,2),

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID),

    primary key (Student_ID, Quiz_ID, Quiz_Question_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_File(   
    Student_Quiz_File_Path varchar(500) primary key,
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Student_Quiz_File_Name varchar(500) not null,

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID)
);

create table Parent(  
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

create table Parent_Student(  
    Parent_ID int not null,
    Student_ID int not null,

    foreign key (Parent_ID) references Parent(Parent_ID),
    foreign key (Student_ID) references Student(Student_ID),

    primary key(Parent_ID, Student_ID)
);

alter table Parent auto_increment=5001; 

create table File_For_Parents( 
    File_Path varchar(500) primary key,
    File_Type int not null,
    File_Name varchar(200) not null,
    File_Date_Added Date not null
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

create table Parent_Registration_Request(
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

create table Terms_And_Conditions_File(
    File_Path varchar(500) primary key,
    File_Name varchar(500) not null
);

create table Terms_And_Conditions_Accepted(
    Parent_ID int primary key,

    foreign key (Parent_ID) references Parent(Parent_ID)
);

create table Link( 
    Link_Path varchar(500) not null,
    Link_Name varchar(200) not null,
    Link_Type int not null,
    Link_Topic_ID int,
    Link_Assignment_Path varchar(500),
    Link_Approved bit not null,
    Link_Marked_For_Deletion bit not null,

    primary key(Link_Path, Link_Type, Link_Topic_ID)
);




/*-------------------------------------------------------*/
/*-------------------------------------------------------*/


/*-------------------------------------------------------*/
/*--          INSERT TEST ADMIN VALUES                   */
/*-------------------------------------------------------*/
insert into Admin(Admin_ID,Admin_Name,Admin_Password) values(123,'admin','$2b$10$3FiJ4VfFQzO6key/8G3XhOZHzQYXe4M0AjAMLXorZeT2lywippd92');

/*-------------------------------------------------------*/
/*--          INSERT TEST POSITION VALUES                */
/*-------------------------------------------------------*/
insert into Job_Position(Position_Name,Position_Desc,Position_Level) values('MATH_TEACHER','Teaches math',1);
insert into Job_Position(Position_Name,Position_Desc,Position_Level) values('ENGLISH_TEACHER','Teaches english',1);

/*-------------------------------------------------------*/
/*--          INSERT TEST STAFF VALUES*/
/*-------------------------------------------------------*/
insert into Staff(Position_ID,Staff_Name,Staff_Surname,Staff_Age,Staff_Cell,Staff_Email,Staff_Password) values(1,'Frankie','Fredericks',30,'+264 81 1234567','email@sca.com','$2b$10$NIIRd1bX0d9Phd3P6GDTv.v08BLk91wMkmHuF8MzG/8m0TM14p1oa');
insert into Staff(Position_ID,Staff_Name,Staff_Surname,Staff_Age,Staff_Cell,Staff_Email,Staff_Password) values(2,'Martha','Steward',40,'+264 81 1234568','email1@sca.com','$2b$10$RVBm99ywpopPloqp5MoB/.YkhFAsHCMdqqtlH07TB1TifXjq0hJ4.');

/*-------------------------------------------------------*/
/*--          INSERT INITIAL COURSE VALUES*/
/*-------------------------------------------------------*/
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE0','Bible studies for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LANG-DEV0','Language Development for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY-DEV0','Physical Development for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'SOC-DEV0','Social Development for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PREP-MATH0','Preparatory Mathematics for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT0','Computer Literacy for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART0','Visual and Performing Arts for grade 0',0);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC0','Music Literacy for grade 0',0);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE1','Bible studies for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG1','English 1st Language for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH1','Mathematics for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENV1','Environmental Studies for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART1','Visual and Performing Arts for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC1','Music Literacy for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY_ED1','Physical Education for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR1','Religious & Moral Education for grade 1',1);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT1','Computer Literature for grade 1',1);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE2','Bible studies for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG2','English 1st Language for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH2','Mathematics for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENV2','Environmental Studies for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART2','Visual and Performing Arts for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC2','Music Literacy for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY_ED2','Physical Education for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR2','Religious & Moral Education for grade 2',2);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT2','Computer Literature for grade 2',2);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE3','Bible studies for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG3','English 1st Language for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH3','Mathematics for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENV3','Environmental Studies for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART3','Visual and Performing Arts for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC3','Music Literacy for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY_ED3','Physical Education for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR3','Religious & Moral Education for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT3','Computer Literature for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CURSIVE3','Cursive Writing for grade 3',3);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CHOR_ART3','Choral Arts for grade 3',3);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE4','Bible studies for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG4','English 1st Language for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH4','Mathematics for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'NAT-SCI4','Natural Science & Health Ed for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'SOCIAL4','Social Studies for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIFE-SK4','Life Skills for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART4','Visual and Performing Arts for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC4','Music Literacy for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR4','Religious & Moral Education for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT4','Computer Literature for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY-ED4','Physical Education for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIB4','Library studies for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'READING4','Reading studies for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CURSIVE4','Cursive Writing for grade 4',4);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CHOR_ART4','Choral Arts for grade 4',4);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE5','Bible studies for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG5','English 1st Language for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH5','Mathematics for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'NAT-SCI5','Natural Science & Health Ed for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'SOCIAL5','Social Studies for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'HOME-EC5','Home Ecology for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'DESN-TEC5','Design & Technology for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIFE-SK5','Life Skills for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART5','Visual and Performing Arts for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC5','Music Literacy for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR5','Religious & Moral Education for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT5','Computer Literature for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY-ED5','Physical Education for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIB5','Library studies for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'READING5','Reading studies for grade 5',5);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CHOR_ART5','Choral Arts for grade 5',5);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE6','Bible studies for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG6','English 1st Language for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH6','Mathematics for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'NAT-SCI6','Natural Science & Health Ed for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'SOCIAL6','Social Studies for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'HOME-EC6','Home Ecology for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'DESN-TEC6','Design & Technology for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIFE-SK6','Life Skills for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART6','Visual and Performing Arts for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC6','Music Literacy for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR6','Religious & Moral Education for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT6','Computer Literature for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY-ED6','Physical Education for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIB6','Library studies for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'READING6','Reading studies for grade 6',6);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CHOR_ART6','Choral Arts for grade 6',6);

insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'BIBLE7','Bible studies for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ENG7','English 1st Language for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MATH7','Mathematics for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'NAT-SCI7','Natural Science & Health Ed for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'SOCIAL7','Social Studies for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'HOME-EC7','Home Ecology for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'DESN-TEC7','Design & Technology for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIFE-SK7','Life Skills for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'ART7','Visual and Performing Arts for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'MUSIC7','Music Literacy for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'RLG-MOR7','Religious & Moral Education for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'COMP-LIT7','Computer Literature for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'PHY-ED7','Physical Education for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LIB7','Library studies for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'READING7','Reading studies for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'LEAD7','Leadership studies for grade 7',7);
insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(1001,'CHOR_ART7','Choral Arts for grade 7',7);

/*-------------------------------------------------------*/
/*--          INSERT TEST STUDENT VALUES*/
/*-------------------------------------------------------*/
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Jovanni','Booysen',0,1,'+000 00 0000000','booysen.nancy@gmail.com','harold.booysen@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Benitha','Garises',0,1,'+000 00 0000000','garisesbm@gmail.com','bkhoeseb09@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Giovanni','Komma',0,1,'+000 00 0000000','lumyreyarebes7@gmail.com','armin.komma@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Cataleya','Meyer',0,1,'+000 00 0000000','svetlanakock@yahoo.ca',' s.meyer800@hotmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Elizabeth','McClune',0,1,'+000 00 0000000','mcclune.el@gmail.com','ccmcclune@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('David','Nakale',0,1,'+000 00 0000000','bmakgone@yahoo.com','nakaledavid6@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Precious','Shehama',0,1,'+000 00 0000000','shehamaleticha16@gmai.com','lionsanny@yahoo.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Liam','Taylor',0,1,'+000 00 0000000','nicoleutaylor@gmail.com','shauntay0007@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Iris','Tsowases',0,1,'+000 00 0000000','btsowases1@gmail.com','theofiliojoseph@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Henock','Amakali',0,2,'+000 00 0000000','saimakasheeta@yahoo.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Queen','Dausas',0,2,'+000 00 0000000','arrblessed@gmail.com','fabiola.dausas@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Gladness','Gawises',0,2,'+000 00 0000000','','ronnygurirab@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Gilroy','Goliath',0,2,'+000 00 0000000','vdhgoliath@gmail.com','g_goliat@yahoo.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Riel','Guruseb',0,2,'+000 00 0000000','skrywerellen@yahoo.com','gurusebr@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Edson','Hamwele',0,2,'+000 00 0000000','treshafeni@gmail.com','erikkihamwele@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Fernando','Komma',0,2,'+000 00 0000000','lumyreyarebes7@gmail.com','armin.komma@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Gaila','Karunga-Martin',0,2,'+000 00 0000000','leeanamartin2@gmail.com','gersonkarunga3@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Blessed','Mavhundu',0,2,'+000 00 0000000','mavhundup@gmail.com','mavhundup@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Fernandu','Moses',0,2,'+000 00 0000000','naapopyepaulina@gmail.com','kostashu@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Ericah','Muyengwa',0,2,'+000 00 0000000','mwatangelaimi@gmail.com','mondesafurnshop@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Joost','Haidula',0,3,'+000 00 0000000','mnamhadi@nbc.na','lhaidula@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Monique','Hummel',0,3,'+000 00 0000000','mercelinehummel@gmail.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Warren','Kooper',0,3,'+000 00 0000000','blombeukes@gmail.com','warrenvbeukes@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Clarence','McClune',0,3,'+000 00 0000000','mcclune.el@gmail.com','ccmcclune@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Ezra','Morao',0,3,'+000 00 0000000','skyloveblackrose28@gmail.com','adamhartree@hotmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Awakhiwe','Muyangwa',0,3,'+000 00 0000000','sonenincube574@gmail.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Felicity','Nakale',0,3,'+000 00 0000000','bmakgone@yahoo.com','nakaledavid6@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Genius','Karingombe',0,4,'+000 00 0000000','christiaanthiffany@gmail.com','mervinchristiaan@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Lesley','Kunugas',0,4,'+000 00 0000000','ayeshes@gmail.com','Laz@iway.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Nelago','Moses',0,4,'+000 00 0000000','naapopyepaulina@gmail.com','kostashu@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Delvin','Mutandwa',0,4,'+000 00 0000000','zmchisi@gmail.com','danamut@live.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Otillie','Noabes',0,4,'+000 00 0000000','ndeshihalukandahafa@gmail.com','ndeshihalukandahafa@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Shaida','Plaatjies',0,4,'+000 00 0000000','hplaatjies65@gmail.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Bethina','Shipena',0,4,'+000 00 0000000','Abraham.shipena@riotinto.com','Abraham.shipena@riotinto.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Tangi','Shipena',0,4,'+000 00 0000000','Abraham.shipena@riotinto.com','Abraham.shipena@riotinto.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Christiline','Strauss',0,4,'+000 00 0000000','abesbody@iway.na','abesbody@iway.na','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Yeshua','Titus',0,4,'+000 00 0000000','erenstine13579@gmail.com','alfred.titus@mof.gov.na','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Tjihererua','Upora',0,4,'+000 00 0000000','UaetuaSeplonica.gmail.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Manziano','Uwiteb',0,4,'+000 00 0000000','Donziano@gmail.com','richex24@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Zuraya','Van Wyk',0,4,'+000 00 0000000','zunams@gmail.com','reedevann@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Hope','Gaeses',0,5,'+000 00 0000000','evagaeses@yahoo.com','wenzelgaeseb@yahoo.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Ernest','Hamwele',0,5,'+000 00 0000000','treshafeni@gmail.com','erikkihamwele@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Laimi','Igonda',0,5,'+000 00 0000000','igonda@outlook.com','igonda@outlook.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Robinihno','Job',0,5,'+000 00 0000000','rosinanomathembajob@gmail.com','rosinanomathembajob@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Avihe','Kasete',0,5,'+000 00 0000000','ukasete@gmail.com','F)ndivanga@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Elina','Antindi',0,6,'+000 00 0000000','fernstasmahongo@gmail.com','fernstasmahongo@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Fritz','Areseb',0,6,'+000 00 0000000','petraareses1@gmail.com\npetra.areses@riotinto.com','fritzareseb64@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Daven','Chiwese',0,6,'+000 00 0000000','nyepudzaitembo.77@gmail.com','tembon03@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Darren','Daniseb',0,6,'+000 00 0000000','hplaatjies65@gmail.com','soul.daniseb@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Faith','Gaeses',0,6,'+000 00 0000000','evagaeses@yahoo.com','wenzelgaeseb@yahoo.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Samuel','Haukena',0,6,'+000 00 0000000','immanuelhaukena@gmail.com','immanuelhaukena@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Veisira','Kamatoto',0,6,'+000 00 0000000','juliakamatoto@rossing.com.na\njmkamatoto@gmail.com','gustavkamatoto@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Andrew','Lazarus',0,6,'+000 00 0000000','cecitjie@gmail.com','','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Panduleni','Shipiki',0,6,'+000 00 0000000','egaeses15@gmail.com','assistant@fadevelopers.com.na\nshpmat002@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Upengisa','Uhihana',0,6,'+000 00 0000000','ukasete@gmail.com','ndivanga@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Alwina','Nakanene',0,7,'+000 00 0000000','nakanenejj@gmail.com','nakanenejj@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');
insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_F,Student_Guardian_Email_M,Student_Password) values('Reezann','Van Wyk',0,7,'+000 00 0000000','zunams@gmail.com','reedevann@gmail.com','$2b$10$vP4tpK2YVXlNV1VkEoASa.0jH/rEIAcgFcM1hZqmrzONpScn/3IkW');


/*-------------------------------------------------------*/
/*--          INSERT TEST COURSE_ANNOUNCEMENT VALUES      */
/*------------------------------------------------------- */
insert into Course_Announcement(Course_ID,Course_Announcement_Message,Course_Announcement_Date) values(1,'Test1 on the 28th August. Covers chapter 1 - 5',current_timestamp());
insert into Course_Announcement(Course_ID,Course_Announcement_Message,Course_Announcement_Date) values(1,'Test1 moved to 30th August',current_timestamp());
insert into Course_Announcement(Course_ID,Course_Announcement_Message,Course_Announcement_Date) values(1,'Test1 moved back to 28th August',current_timestamp());

/*-------------------------------------------------------*/
/*--          INSERT INITIAL COURSE VALUES*/
/*-------------------------------------------------------*/
insert into News_Events(News_Events_Title, News_Events_Content, News_Events_Date_Added, News_Events_Img_Path) values('Title 1','nfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdac',curdate(),'c6fc37e5-ffcd-4537-b439-1f99ccf18814-screensaver4.png');
insert into News_Events(News_Events_Title, News_Events_Content, News_Events_Date_Added, News_Events_Img_Path) values('Title 2','123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890nfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdacnfskjadfslkjnsadclksnadkjsdncskalncksdncksdjncksdjncksjdnclkascknjsdac',curdate(),'d8361afa-a69d-4bff-a06f-cd1db86f1259-screensaver3.jpg');

delimiter //
create procedure sp_addCurrentStaffToCourseStaffTable(
)
begin
    insert into Course_Staff(Course_ID,Staff_ID)
    select Course_ID, Staff_ID
    from Course;
end //
delimiter ;

call sp_addCurrentStaffToCourseStaffTable();


/*-------------------------------------------------------*/
/*-------   INSERT PROC DEFINITIONS                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_addJobPosition(
    in posName varchar(50),
    in posDesc varchar(100),
    in posLevel int
)
begin
    if ((posName not in(select Position_Name from Job_Position)) AND (posLevel <= 7 AND posLevel >= 0)) then
        insert into Job_Position(Position_Name,Position_Desc,Position_Level) values(posName,posDesc,posLevel);
        select 'ok' as RESULT;
    else
        select 'Failed to add position, its name already exists or the level was wrong.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStaff(
    in posID int,
    in staffName varchar(50),
    in staffSurname varchar(50),
    in staffAge int,
    in staffCell varchar(15),
    in staffEmail varchar(50),
    in staffPassword varchar(500)
)
begin
    if ((posID in(select Position_ID from Job_Position)) AND staffName  != '' AND staffAge >= 18 AND staffEmail  != '' AND staffPassword  != '') then
        insert into Staff(Position_ID,Staff_Name,Staff_Surname,Staff_Age,Staff_Cell,Staff_Email,Staff_Password) values(posID,staffName,staffSurname,staffAge,staffCell,staffEmail,staffPassword);
        select 'ok' as RESULT;
    else
        select 'Failed to add staff member, ensure that position exists and other values are not empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourse(
    in staffID int,
    in courseName varchar(50),
    in courseDesc varchar(100),
    in courseGrade int
)
begin
    if ((staffID in(select Staff_ID from Staff)) AND courseName  != '' AND courseDesc  != '' AND (courseGrade >= 0 AND courseGrade < 8)) then

        insert into Course(Staff_ID,Course_Name,Course_Desc,Course_Grade) values(staffID,courseName,courseDesc,courseGrade);

        set @courseID = last_insert_id();

        insert into Course_Staff(Course_ID, Staff_ID)
        values(@courseID, staffID);

        select 'ok' as RESULT;
    else
        select 'Failed to add course, ensure that staff id exists and other values are not empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseStaff(
    in staffID int,
    in courseID int
)
begin
    if ((staffID in(select Staff_ID from Staff)) AND courseID in(select Course_ID from Course) AND staffID not in(select Staff_ID from Course_Staff where Course_ID=courseID)) then

        insert into Course_Staff(Course_ID, Staff_ID)
        values(courseID, staffID);

        select 'ok' as RESULT;
    else
        select 'staff or course does not exist or record already exists' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseTopic(
    in courseID int,
    in topicName varchar(100)
)
begin
    if(courseID in(select Course_ID from Course)) then
        insert into Course_Topic(Course_ID,Parent_Topic_ID,Course_Topic_Name) values(courseID, null, topicName);
        select 'ok' as RESULT;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addSubtopic(
    in parentTopicID int,
    in topicName varchar(100)
)
begin
    if(parentTopicID in(select Course_Topic_ID from Course_Topic)) then
        insert into Course_Topic(Course_ID,Parent_Topic_ID,Course_Topic_Name)
        select Course_ID, parentTopicID, topicName
        from Course_Topic
        where Course_Topic_ID=parentTopicID;

        select 'ok' as RESULT;
    else
        select 'parent topic not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseMaterial(
    in courseID int,
    in courseTopicID int,
    in materialPath varchar(500),
    in materialName varchar(100)
)
begin
    if ((courseID in(select Course_ID from Course)) AND (courseTopicID in(select Course_Topic_ID from Course_Topic)) AND materialPath  != '' AND materialName  != '') then
        insert into Course_Material(Course_ID, Course_Topic_ID, Course_Material_Path, Course_Material_Name, Course_Material_Approved, Course_Material_Delete_Requested)
        values(courseID, courseTopicID, materialPath, materialName, 0, 0);

        select 'ok' as RESULT;
    else
        select 'Failed to add course material, ensure that course exists and other values are not empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseAssignment(
    in courseID int,
    in assignmentPath varchar(500),
    in assignmentName varchar(100),
    in dueDate date,
    in marksAvailable decimal(19,2)
)
begin
    if (assignmentPath  != '' AND (courseID in(select Course_ID from Course)) AND assignmentName  != '' AND marksAvailable>=0) then
        insert into Course_Assignment(Course_ID, Course_Assignment_Path, Course_Assignment_Name, Course_Assignment_Due_Date, Course_Assignment_Marks_Available) values(courseID, assignmentPath, assignmentName, dueDate, marksAvailable);
        select 'ok' as RESULT;
    else
        select 'Failed to add course assignment, ensure that course exists and other values are not empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseAssessment(
    in courseID int,
    in assessmentName varchar(100),
    in marksAvailable decimal(19,2),
    in contributionToTotal decimal(19,2)
)
begin
    if(courseID in(select Course_ID from Course) AND assessmentName !='' AND marksAvailable>0 AND contributionToTotal>0 AND contributionToTotal<101) then

        insert into Course_Assessment(Course_ID, Course_Assessment_Name, Course_Assessment_Marks_Available, Course_Assessment_Contribution)
        values(courseID, assessmentName, marksAvailable, contributionToTotal);

        set @lastID=last_insert_id();

        insert into Student_Assessment_Mark(Student_ID, Course_Assessment_ID, Assessment_Mark)
        select Student_ID, @lastID, 0
        from Student
        where Student_ID in(
            select Student_ID
            from Student_Course
            where Course_ID=courseID
        );

        select 'ok' as RESULT;

    else
        select 'course does not exist, one of the fields was empty, or the marks or contribution was out of range' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addCourseAnnouncement(
    in courseID int,
    in message varchar(500)
)
begin
    if (courseID in(select Course_ID from Course) AND message  != '') then
        insert into Course_Announcement(Course_ID,Course_Announcement_Message,Course_Announcement_Date) values(courseID,message,current_timestamp());
        select 'ok' as RESULT;
    else
        select 'Failed to add course announcement, course not found or message was empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudent(
    in studentFirstname varchar(20),
    in studentSurname varchar(25),
    in studentAge int,
    in studentGrade int,
    in studentGuardianCell varchar(15),
    in studentGuardianEmailM varchar(500),
    in studentGuardianEmailF varchar(500),
    in studentPassword varchar(500)
)
begin
    if (studentFirstname  != '' AND studentSurname  != '' AND studentAge > 0 AND studentAge < 120 AND studentGrade >= 0 AND studentGrade < 8 AND studentGuardianCell  != '' AND studentPassword  != '') then
        insert into Student(Student_First_Name,Student_Surname_Name,Student_Age,Student_Grade,Student_Guardian_Cell,Student_Guardian_Email_M,Student_Guardian_Email_F,Student_Password) values(studentFirstname,studentSurname,studentAge,studentGrade,studentGuardianCell,Student_Guardian_Email_M,Student_Guardian_Email_F,studentPassword);
        select 'ok' as RESULT;
    else
        select 'Failed to add student, ensure that all values are not empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentReport(
    in reportPath varchar(500),
    in studentID int,
    in reportName varchar(100),
    in term tinyint,
    in reportYear smallint
)
begin
    if (studentID in(select Student_ID from Student) AND reportPath  != '' AND term > 0 AND term < 5) then
        insert into Student_Report(Student_Report_Path, Student_ID, Student_Report_Name, Student_Report_Term, Student_Report_Year)
        values(reportPath, studentID, reportName, term, reportYear);

        select 'ok' as RESULT;
    else
        select 'student not found, path empty, or term out of range.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentCourse(
    in studentID int,
    in courseID int
)
begin
    if ((studentID in(select Student_ID from Student)) AND (courseID in(select Course_ID from Course)) AND (courseID not in(select Course_ID from Student_Course where Student_ID=studentID))) then

        insert into Student_Course(Student_ID,Course_ID,Student_Course_Enrollment_Date,Student_Course_Mark) values(studentID,courseID,current_timestamp(),0.00);

        insert into Student_Assignment_Mark(Student_ID,Course_Assignment_Path,Assignment_Mark)
        select studentID, Course_Assignment.Course_Assignment_Path, 0
        from Course_Assignment
        inner join Course
        on Course_Assignment.Course_ID=Course.Course_ID
        where Course.Course_Grade=(
            select Student_Grade from Student
            where Student_ID=studentID
        );

        insert into Student_Assessment_Mark(Student_ID, Course_Assessment_ID, Assessment_Mark)
        select studentID, Course_Assessment.Course_Assessment_ID, 0
        from Course_Assessment
        inner join Course
        on Course_Assessment.Course_ID=Course.Course_ID
        where Course.Course_Grade=(
            select Student_Grade from Student
            where Student_ID=studentID
        );

        select 'ok' as RESULT;
    else
        select 'Failed to add student course, student or course does not exist.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addAllStudentCourses(  /*----  ADD ALL STUDENT COURSES  ----*/
    in studentID int
)
begin
    if (studentID in(select Student_ID from Student)) then
        insert into Student_Course(Student_ID,Course_ID,Student_Course_Enrollment_Date,Student_Course_Mark)
        select studentID, Course_ID, current_timestamp(), 0.00
        from Course
        where Course_Grade = (select Student_Grade from Student where Student_ID=studentID)
        AND Course_ID not in(select Course_ID from Student_Course where Student_ID=studentID);

        select 'ok' as RESULT;
    else
        select 'Failed to add student courses, student does not exist.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentAssignmentFile(
    in studentID int,
    in caPath varchar(500),
    in saPath varchar(500),
    in saName varchar(100),
    in mark decimal(19,2)
)
begin
    if ((caPath in(select Course_Assignment_Path from Course_Assignment)) AND (studentID in(select Student_ID from Student)) AND saPath  != '' AND saName  != '' AND mark>=0) then
        insert into Student_Assignment_File(Student_ID,Course_Assignment_Path,Student_Assignment_File_Path,Student_Assignment_File_Name,Student_Assignment_File_Mark) values(studentID,caPath,saPath,saName,mark);
        select 'ok' as RESULT;
    else
        select 'Failed to add student assignment, student or course assignment does not exist or some of the other values were empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentAssignmentMark(
    in sID int,
    in caPath varchar(500)
)
begin
    if ((sID in(select Student_ID from Student)) AND (caPath in(select Course_Assignment_Path from Course_Assignment)) AND (sID not in(select Student_ID from Student_Assignment_Mark where Course_Assignment_Path=caPath))) then
        insert into Student_Assignment_Mark(Student_ID,Course_Assignment_Path,Assignment_Mark) values(sID,caPath,0.00);
        select 'ok' as RESULT;
    else
        select 'Failed to add student assignment, student or course assignment does not exist or some of the other values were empty.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentAssessmentMark(
    in sID int,
    in caID int
)
begin
    if(sID in(select Student_ID from Student) AND caID in(select Course_Assessment_ID from Course_Assessment)) then

        insert into Student_Assessment_Mark(Student_ID, Course_Assessment_ID, Assessment_Mark)
        values(sID, caID, 0);

        select 'ok' as RESULT;

    else
        select 'student or course does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addNewsEvent(
    in title varchar(500),
    in content varchar(10000),
    in imgPath varchar(500)
)
begin
    if (title  != '' AND content  != '' AND imgPath  != '') then
        insert into News_Events(News_Events_Title, News_Events_Content, News_Events_Date_Added, News_Events_Img_Path)
        values(title,content,curdate(),imgPath);
        select 'ok' as RESULT;
    else
        select 'Failed to add news/event, some arguments were empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addSuggestion(
    in message varchar(6000)
)
begin
    if (message  != '') then
        insert into Suggestions(Suggestion_Message, Suggestion_Date)
        values(message,current_timestamp());
        select 'ok' as RESULT;
    else
        select 'Failed to add suggestion, message is empty' as RESULT;
    end if;
end //
delimiter ;

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

delimiter //
create procedure sp_addHomeFile(
    in filePath varchar(500),
    in fileName varchar(100),
    in fileSection varchar(100)
)
begin
    if(filePath not in(select Home_File_Path from Home_File) AND filePath !='' AND fileName !='' AND fileSection !='') then
        insert into Home_File(Home_File_Path, Home_File_Name, Home_File_Section)
        values(filePath, fileName, fileSection);

        select 'ok' as RESULT;
    else
        select 'file already exists or one of the fields were empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addRootResourceTopic(
    in topicName varchar(200),
    in visibleToStudents bit
)
begin
    if(topicName not in(select Resource_Topic_Name from Resource_Topic where Resource_Topic_Parent=null) AND topicName !='') then

        insert into Resource_Topic(Resource_Topic_Parent, Course_ID, Visible_To_Students, Resource_Topic_Name)
        values(null, null, visibleToStudents, topicName);

        select 'ok' as RESULT;
    else
        select 'topic already exists' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addSubResourceTopic(
    in parentTopicID int,
    in topicName varchar(200),
    in courseID int
)
begin
    if(courseID in(select Course_ID from Course) AND parentTopicID in(select Resource_Topic_ID from Resource_Topic) AND topicName !='') then

        insert into Resource_Topic(Resource_Topic_Parent, Course_ID, Visible_To_Students, Resource_Topic_Name)
        values(parentTopicID, courseID, 1, topicName);

        select 'ok' as RESULT;
    else
        select 'parent topic not found, course not found, or topic name is empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addResourceFile(
    in topicID int,
    in filePath varchar(500),
    in fileName varchar(100)
)
begin
    if(topicID in(select Resource_Topic_ID from Resource_Topic) AND fileName !='' AND filePath !='') then

        insert into Resource_File(Resource_File_Path, Resource_Topic_ID, Resource_File_Name, Resource_File_Date_Added)
        values(filePath, topicID, fileName, current_timestamp());

        select 'ok' as RESULT;
    else
        select 'topic does not exist, or one of the fields was empty' as RESULT;
    end if;
end //
delimiter ;


delimiter //
create procedure sp_addQuiz(
    in courseID int,
    in qName varchar(200),
    in qAttemptsAllowed int,
    in qOpenTime datetime,
    in qCloseTime datetime,
    in qDuration int
)
begin
    if(courseID in(select Course_ID from Course) AND qName !='' AND qAttemptsAllowed>0 AND qOpenTime is not null AND qCloseTime is not null AND qDuration>0 ) then

        insert into Quiz(Course_ID, Quiz_Name, Quiz_Attempts_Allowed, Quiz_Opening_Time, Quiz_Closing_Time, Quiz_Duration)
        values(courseID, qName, qAttemptsAllowed, qOpenTime, qCloseTime, qDuration);

        select 'ok' as RESULT;

    else

        select 'course not found or one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addQuizQuestion(
    in quizID int,
    in qType int,
    in qValue varchar(1000),
    in qMarksAvail int
)
begin
    if(quizID in(select Quiz_ID from Quiz) AND qType>0 AND qValue !='' AND qMarksAvail>0 ) then

        set @qNum=(select (COUNT(Quiz_Question_ID)+1) from Quiz_Question where Quiz_ID=quizID);

        insert into Quiz_Question(Quiz_ID, Quiz_Question_Type, Quiz_Question_Number, Quiz_Question_Value, Quiz_Question_Marks_Available, Quiz_Question_Has_Multiple_Answers)
        values(quizID, qType, @qNum, qValue, qMarksAvail, 0);

        select 'ok' as RESULT;

    else

        select 'quiz not found, one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addQuizAnswer(    
    in quizQuestionID int,
    in aValue varchar(500),
    in aIsCorrect bit
)
begin
    if(quizQuestionID in(select Quiz_Question_ID from Quiz_Question) AND aValue !='' AND aIsCorrect is not null ) then

        insert into Quiz_Answer(Quiz_Question_ID, Quiz_Answer_Value, Quiz_Answer_Is_Correct)
        values(quizQuestionID, aValue, aIsCorrect);

        if( (select COUNT(Quiz_Answer_ID) from Quiz_Answer where Quiz_Answer_Is_Correct=1 AND Quiz_Question_ID=quizQuestionID) > 1) then
            update Quiz_Question
            set Quiz_Question_Has_Multiple_Answers=1
            where Quiz_Question_ID=quizQuestionID;
        end if;

        select 'ok' as RESULT;

    else

        select 'quiz question not found or one of the values were empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuiz(  
    in studentID int,
    in quizID int
)
begin
    if(studentID in(select Student_ID from Student) AND quizID in(select Quiz_ID from Quiz)) then
        if(now()<=(select Quiz_Closing_Time from Quiz where Quiz_ID=quizID)) then

            if(now()>=(select Quiz_Opening_Time from Quiz where Quiz_ID=quizID)) then
                set @attemptNum=(
                    select (COUNT(Student_ID)+1)
                    from Student_Quiz
                    where Student_ID=studentID AND Quiz_ID=quizID
                );

                insert into Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number, Student_Quiz_Start_Time, Student_Quiz_End_Time, Student_Quiz_Mark_Obtained, Student_Quiz_Graded)
                values(
                    studentID,
                    quizID,
                    @attemptNum,
                    NOW(),
                    null,
                    0,
                    0
                );

                select 'ok' as RESULT;
            else
                select 'quiz has not yet opened' as RESULT;
            end if;

        else
            select 'quiz closed, no further attempts allowed' as RESULT;
        end if;
    else
        select 'student or quiz does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizUnstructuredAnswer(  
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in ansID int
)
begin
    if(studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND ansID in(select Quiz_Answer_ID from Quiz_Answer)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then

            insert into Student_Quiz_Unstructured_Answer(
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Quiz_Answer_ID
            )
            values(
                studentID,
                quizID,
                attemptNum,
                questID,
                ansID
            );

            select 'ok' as RESULT;
        else
            select 'ATTEMPT_ENDED' as RESULT;
        end if;
    else
        select 'student quiz, question, or answer does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizStructuredAnswer(  
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in ans varchar(6000)
)
begin
    if(studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND ans  != '') then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then
            delete from Student_Quiz_Structured_Answer
            where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

            insert into Student_Quiz_Structured_Answer(
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Student_Quiz_Structured_Answer_Value,
                Student_Quiz_Structured_Answer_Mark
            )
            values(
                studentID,
                quizID,
                attemptNum,
                questID,
                ans,
                0
            );

            select 'ok' as RESULT;
        else
            select 'ATTEMPT_ENDED' as RESULT;
        end if;

    else
        select 'student quiz, or question does not exist or ans is empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizFile(  
    in filePath varchar(500),
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in fileName varchar(500)
)
begin
    if(filePath !='' AND fileName !='' AND studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then
            insert into Student_Quiz_File(
                Student_Quiz_File_Path,
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Student_Quiz_File_Name
            )
            values(
                filePath,
                studentID,
                quizID,
                attemptNum,
                questID,
                fileName
            );

            select 'ok' as RESULT;
        else
            insert into Files_To_Delete(File_Path)
            values(filePath);

            select 'ATTEMPT_ENDED' as RESULT;
        end if;

    else
        select 'student quiz, or question does not exist or path or name is empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addParent(    
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
    if(idNum  != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName  != '' AND pSurname  != '' AND pEmail  != '' AND pHomeLang  != '' AND pReligion  != '' AND pword  != '' AND mobileNum != '') then
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

delimiter //
create procedure sp_addFileForParents( 
    in filePath varchar(500),
    in fileName varchar(200),
    in fileType int
)
begin
    if(filePath not in(select File_Path from File_For_Parents) AND filePath !='' AND fileName !='' AND fileType>0) then
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
create procedure sp_addParentFinances( 
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
create procedure sp_addParentFinancialStatement( 
    in filePath varchar(500),
    in parentID int,
    in fileName varchar(500),
    in statementMonth varchar(20)
)
begin
    if(filePath  != '' AND filePath not in(select Statement_File_Path from Parent_Financial_Statement) AND fileName  != '' AND parentID in(select Parent_ID from Parent)) then
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
create procedure sp_addParentStudent( 
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
create procedure sp_addParentRegistrationRequest(    
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
    if(idNum  != '' AND idNum not in(select Parent_ID_Number from Parent) AND pName  != '' AND pSurname  != '' AND pEmail  != '' AND pHomeLang  != '' AND pReligion  != '' AND pword  != '' AND pChildInfo  != '' AND mobileNum != '') then
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
            mobileNum
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
create procedure sp_addTermsAndConditionsFile( 
    in filePath varchar(500),
    in fileName varchar(500)
)
begin
    if(filePath not in(select File_Path from Terms_And_Conditions_File) AND fileName  != '') then
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
create procedure sp_addTermsAndConditionsAccepted( 
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

delimiter //
create procedure sp_addLink(  
    in linkPath varchar(500),
    in linkName varchar(200),
    in linkType int,
    in linkTopicID int,
    in linkAssignmentPath varchar(500)
)
begin
    if(linkPath not in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID) AND linkPath !='' AND linkName !='') then
        insert into Link(
            Link_Path,
            Link_Name,
            Link_Type,
            Link_Topic_ID,
            Link_Assignment_Path,
            Link_Approved,
            Link_Marked_For_Deletion
        )
        values(
            linkPath,
            linkName,
            linkType,
            linkTopicID,
            linkAssignmentPath,
            0,
            0
        );

        select 'ok' as RESULT;
    else
        select 'topic id out of range, link already exists, or one of the values was empty' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   UPDATE PROC DEFINITIONS                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_updateJobPosition(
    in posID int,
    in posName varchar(50),
    in posDesc varchar(100),
    in posLevel int
)
begin
    if ((posID in(select Position_ID from Job_Position)) AND (posLevel <= 7 AND posLevel >= 0) AND posDesc  = null AND posName  = null) then
        update Job_Position
        set Position_Name=posName, Position_Desc=posDesc, Position_Level=posLevel
        where Position_ID=posID;

        select 'ok' as RESULT;
    else
        select 'Failed to update Job Position' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStaff(
    in staffID int,
    in posID int,
    in staffName varchar(50),
    in staffSurname varchar(50),
    in staffAge int,
    in staffCell varchar(15),
    in staffEmail varchar(50)
)
begin
    if ((staffID in(select Staff_ID from Staff)) AND (posID in(select Position_ID from Job_Position)) AND staffName  != '' AND staffAge  = 0 AND staffEmail  != '') then
        update Staff
        set Position_ID=posID, Staff_Name=staffName, Staff_Surname=staffSurname, Staff_Age=staffAge, Staff_Cell=staffCell, Staff_Email=staffEmail
        where Staff_ID=staffID;

        select 'ok' as RESULT;
    else
        select 'Failed to update staff' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateCourse(
    in courseID int,
    in staffID int,
    in courseName varchar(50),
    in courseDesc varchar(100)
)
begin
    if ((courseID in(select Course_ID from Course)) AND (staffID in(select Staff_ID from Staff)) AND courseName  != '' AND courseDesc  != '') then
        update Course
        set Staff_ID=staffID, Course_Name=courseName, Course_Desc=courseDesc
        where Course_ID=courseID;

        select 'ok' as RESULT;
    else
        select 'Failed to update course' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateCourseTopic(
    in topicID int,
    in topicName varchar(100)
)
begin
    if(topicID in(select Course_Topic_ID from Course_Topic) AND topicName !='') then
        update Course_Topic
        set Course_Topic_Name=topicName
        where Course_Topic_ID=topicID;

        select 'ok' as RESULT;
    else
        select 'topic not found or topic name empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateCourseMaterial(
    in materialPath varchar(500)
)
begin
    select 'not in use' as RESULT;
end //
delimiter ;

delimiter //
create procedure sp_updateCourseAssignment(
    in dueDate date,
    in marksAvailable decimal(19,2),
    in assignmentPath varchar(500)
)
begin
    if ((assignmentPath in(select Course_Assignment_Path from Course_Assignment)) AND marksAvailable >= 0) then
        update Course_Assignment
        set Course_Assignment_Due_Date=dueDate, Course_Assignment_Marks_Available=marksAvailable
        where Course_Assignment_Path=assignmentPath;

        select 'ok' as RESULT;
    else
        select 'Failed to update course assignment. Course not found or path not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudent(
    in studentID int,
    in studentFirstname varchar(20),
    in studentSurname varchar(25),
    in studentAge int,
    in studentGrade int,
    in studentGuardianCell varchar(15),
    in studentGuardianEmailM varchar(500),
    in studentGuardianEmailF varchar(500)
)
begin
    if ((studentID in(select Student_ID from Student)) AND studentFirstname  != '' AND studentSurname  != '' AND studentAge > 0 AND studentGrade >= 0 AND studentGrade < 8 AND studentGuardianCell  != '' ) then
        update Student
        set Student_First_Name=studentFirstname, Student_Surname_Name=studentSurname, Student_Age=studentAge, Student_Grade=studentGrade, Student_Guardian_Cell=studentGuardianCell, Student_Guardian_Email_M=studentGuardianEmailM, Student_Guardian_Email_F=studentGuardianEmailF
        where Student_ID=studentID;

        select 'ok' as RESULT;
    else
        select 'Failed to update student' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudentCourse(
    in studentID int,
    in courseID int,
    in courseMark decimal(19,2)
)
begin
    if ((studentID in(select Student_ID from Student)) AND (courseID in(select Course_ID from Course)) AND courseMark >= 0 AND courseMark <= 100) then
        update Student_Course
        set Student_Course_Mark=courseMark
        where Student_ID=studentID AND Course_ID=courseID;

        select 'ok' as RESULT;
    else
        select 'Failed to update student course, student or course does not exist or mark was < 0 or > 100.' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudentAssignment(
    in saPath varchar(500),
    in mark decimal(19,2)
)
begin
    if ((saPath in(select Student_Assignment_File_Path from Student_Assignment_File)) AND mark>=0 AND mark<=100) then

        update Student_Assignment_File
        set Student_Assignment_File_Mark=mark
        where Student_Assignment_File_Path=saPath;

        select 'ok' as RESULT;
    else
        select 'Failed to update student assignment, saPath not found or mark out of range' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudentAssignmentMark(
    in studentID int,
    in caPath varchar(500),
    in mark decimal(19,2)
)
begin
    if ((studentID in(select Student_ID from Student)) AND (caPath in(select Course_Assignment_Path from Course_Assignment)) AND mark>=0 AND mark<=100 AND (studentID in(select Student_ID from Student_Assignment_Mark where Course_Assignment_Path=caPath))) then
        update Student_Assignment_Mark
        set Assignment_Mark=mark
        where Student_ID=studentID AND Course_Assignment_Path=caPath;

        select 'ok' as RESULT;
    else
        select 'student not found or path not found or mark out of range or no record in table being updated' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudentAssessmentMark(
    in studentID int,
    in caID int,
    in mark decimal(19,2)
)
begin
    if ((studentID in(select Student_ID from Student)) AND (caID in(select Course_Assessment_ID from Course_Assessment)) AND mark>=0 AND mark<=100 AND (studentID in(select Student_ID from Student_Assessment_Mark where Course_Assessment_ID=caID))) then

        update Student_Assessment_Mark
        set Assessment_Mark=mark
        where Student_ID=studentID AND Course_Assessment_ID=caID;

        select 'ok' as RESULT;
    else
        select 'student not found, assessment not found, mark out of range, or no record in table being updated' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateStudentQuizStructuredAnswerMark(  
    in studentID int,
    in quizID int,
    in questID int,
    in attemptNum int,
    in mark decimal(19,2)
)
begin
    if(studentID in(select Student_ID from Student_Quiz_Structured_Answer where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND mark>=0 AND mark<=(select Quiz_Question_Marks_Available from Quiz_Question where Quiz_Question_ID=questID) AND questID in(select Quiz_Question_ID from Quiz_Question)) then

        update Student_Quiz_Structured_Answer
        set Student_Quiz_Structured_Answer_Mark = mark
        where Student_ID = studentID AND Quiz_ID = quizID AND Student_Quiz_Attempt_Number = attemptNum AND Quiz_Question_ID=questID;

        select 'ok' as RESULT;
    else
        select 'student answer does not exist, mark out of range, or question does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateQuiz(
    in quizID int,
    in qName varchar(200),
    in qAttemptsAllowed int,
    in qOpenTime datetime,
    in qCloseTime datetime,
    in qDuration int
)
begin
    if(quizID in(select Quiz_ID from Quiz) AND qName !='' AND qAttemptsAllowed>0 AND qOpenTime is not null AND qCloseTime is not null AND qDuration>0 ) then

        update Quiz
        set Quiz_Name=qName, Quiz_Attempts_Allowed=qAttemptsAllowed, Quiz_Opening_Time=qOpenTime, Quiz_Closing_Time=qCloseTime, Quiz_Duration=qDuration
        where Quiz_ID=quizID;

        select 'ok' as RESULT;

    else

        select 'quiz not found or one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_updateParent(   
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

delimiter //
create procedure sp_updateParentFinancesBalance(   
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
create procedure sp_updateParentFinancesNextPaymentDate(   
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


/*-------------------------------------------------------*/
/*-------   DELETE PROC DEFINITIONS                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_deleteJobPosition(
    in posID int
)
begin
    if ((posID in(select Position_ID from Job_Position))) then
        delete from Job_Position
        where Position_ID=posID;

        select 'ok' as RESULT;
    else
        select 'Failed to delete Job Position, pos not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStaff(
    in staffID int
)
begin
    if ((staffID in(select Staff_ID from Staff))) then
        update Course
        set Staff_ID=null
        where Staff_ID=staffID;

        delete from Course_Staff
        where Staff_ID=staffID;

        delete from Staff
        where Staff_ID=staffID;

        select 'ok' as RESULT;
    else
        select 'staff not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourse(
    in courseID int
)
begin
    if ((courseID in(select Course_ID from Course))) then
        insert into Files_To_Delete(File_Path)
        select Student_Assignment_File.Student_Assignment_File_Path
        from Student_Assignment_File
        inner join Course_Assignment
        on Course_Assignment.Course_Assignment_Path=Student_Assignment_File.Course_Assignment_Path
        where Course_Assignment.Course_ID=courseID;

        insert into Files_To_Delete(File_Path)
        select Course_Assignment_Path
        from Course_Assignment
        where Course_ID=courseID;

        delete Course_Assignment, Student_Assignment_File, Student_Assignment_Mark
        from (Student_Assignment_File
            inner join Course_Assignment
            on Course_Assignment.Course_Assignment_Path=Student_Assignment_File.Course_Assignment_Path)
        inner join Student_Assignment_Mark
        on Student_Assignment_Mark.Course_Assignment_Path=Course_Assignment.Course_Assignment_Path
        where Course_Assignment.Course_ID=courseID;

        insert into Files_To_Delete(File_Path)
        select Course_Material_Path
        from Course_Material
        where Course_ID=courseID;

        delete from Course_Material
        where Course_ID=courseID;

        delete from Course_Topic
        where Course_ID=courseID;

        delete from Course_Announcement
        where Course_ID=courseID;

        delete from Course_Staff
        where Course_ID=courseID;

        delete from Course
        where Course_ID=courseID;

        select 'ok' as RESULT;
    else
        select 'Failed to delete course, not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourseTopic(
    in topicID int
)
begin
    if (topicID in(select Course_Topic_ID from Course_Topic)) then

        insert into Files_To_Delete(File_Path)
        select Course_Material_Path
        from Course_Material
        where Course_Topic_ID=topicID
        OR Course_Topic_ID in(
            select Course_Topic_ID
            from Course_Topic
            where Parent_Topic_ID=topicID
        );

        delete from Course_Topic
        where Parent_Topic_ID=topicID;

        delete from Course_Topic
        where Course_Topic_ID=topicID;

        select 'ok' as RESULT;
    else
        select 'topic not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourseMaterial(
    in cmPath varchar(500)
)
begin
    if ((cmPath in(select Course_Material_Path from Course_Material))) then
        insert into Files_To_Delete(File_Path)
        values(cmPath);

        delete from Course_Material
        where Course_Material_Path=cmPath;

        select 'ok' as RESULT;
    else
        select 'material not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourseAssignment(
    in caPath varchar(500)
)
begin
    if (caPath in(select Course_Assignment_Path from Course_Assignment)) then
        insert into Files_To_Delete(File_Path)
        select Student_Assignment_File_Path
        from Student_Assignment_File
        where Course_Assignment_Path=caPath
        union
        select caPath;

        delete from Student_Assignment_Mark
        where Course_Assignment_Path=caPath;

        delete from Student_Assignment_File
        where Course_Assignment_Path=caPath;

        delete from Course_Assignment
        where Course_Assignment_Path=caPath;

        select 'ok' as RESULT;
    else
        select 'Failed to delete course assignment, not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourseAssessment(
    in caID int
)
begin
    if (caID in(select Course_Assessment_ID from Course_Assessment)) then

        delete from Student_Assessment_Mark
        where Course_Assessment_ID=caID;

        delete from Course_Assessment
        where Course_Assessment_ID=caID;

        select 'ok' as RESULT;
    else
        select 'assessment does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteCourseAnnouncement(
    in caID int
)
begin
    if ((caID in(select Course_Announcement_ID from Course_Announcement))) then
        delete from Course_Announcement
        where Course_Announcement_ID=caID;

        select 'ok' as RESULT;
    else
        select 'Failed to delete course announcement, not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStudent(
    in studentID int
)
begin
    if ((studentID in(select Student_ID from Student))) then
        insert into Files_To_Delete(File_Path)
        select Student_Assignment_File_Path
        from Student_Assignment_File
        where Student_ID=studentID;

        delete from Student_Assignment_File
        where Student_ID=studentID;

        delete from Student_Assignment_Mark
        where Student_ID=studentID;

        delete from Student_Course
        where Student_ID=studentID;

        delete from Student
        where Student_ID=studentID;

        select 'ok' as RESULT;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStudentCourse(
    in studentID int,
    in courseID int
)
begin
    if ((studentID in(select Student_ID from Student)) AND (courseID in(select Course_ID from Course))) then
        insert into Files_To_Delete(File_Path)
        select Student_Assignment_File.Student_Assignment_File_Path
        from Student_Assignment_File
        inner join Course_Assignment
        on Student_Assignment_File.Course_Assignment_Path=Course_Assignment.Course_Assignment_Path
        where Course_Assignment.Course_ID=courseID AND Student_Assignment_File.Student_ID=studentID;

        delete Student_Assignment_File
        from Student_Assignment_File
        inner join Course_Assignment
        on Student_Assignment_File.Course_Assignment_Path=Course_Assignment.Course_Assignment_Path
        where Course_Assignment.Course_ID=courseID AND Student_Assignment_File.Student_ID=studentID;

        delete from Student_Course
        where Student_ID=studentID AND Course_ID=courseID;

        select 'ok' as RESULT;
    else
        select 'Failed to delete student course, not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStudentAssignment(
    in saPath varchar(500)
)
begin
    if ((saPath in(select Student_Assignment_File_Path from Student_Assignment_File))) then
        insert into Files_To_Delete(File_Path)
        values(saPath);

        delete from Student_Assignment_File
        where Student_Assignment_File_Path=saPath;

        select 'ok' as RESULT;
    else
        select 'Failed to delete student assignment, not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteHomeFile(
    in filePath varchar(500)
)
begin
    if(filePath in(select Home_File_Path from Home_File)) then
        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Home_File
        where Home_File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteResourceFile(  
    in filePath varchar(500)
)
begin
    if(filePath in(select Resource_File_Path from Resource_File)) then
        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Resource_File
        where Resource_File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteResourceTopic(  
    in topicID int
)
begin
    if(topicID in(select Resource_Topic_ID from Resource_Topic)) then

        create temporary table Res_Topic_Temp(
            Resource_Topic_ID int primary key
        );

        insert into Res_Topic_Temp(Resource_Topic_ID)
        with recursive cte(Resource_Topic_ID) as(
            select topicID
            union all
            select Resource_Topic.Resource_Topic_ID from Resource_Topic
            inner join cte on cte.Resource_Topic_ID = Resource_Topic.Resource_Topic_Parent
        )
        select * from cte;

        insert into Files_To_Delete(File_Path)
        select Resource_File_Path
        from Resource_File
        where Resource_Topic_ID in(select Resource_Topic_ID from Res_Topic_Temp);

        delete from Resource_File
        where Resource_Topic_ID in(select Resource_Topic_ID from Res_Topic_Temp);

        delete from Link
        where Link_Type=2 AND Link_Topic_ID in(select Resource_Topic_ID from Res_Topic_Temp);

        delete from Resource_Topic
        where Resource_Topic_ID in(select Resource_Topic_ID from Res_Topic_Temp);

        drop table Res_Topic_Temp;

        select 'ok' as RESULT;
    else
        select 'topic does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteSingleFileToDelete(
    in filePath varchar(500)
)
begin
    if(filePath in(select File_Path from Files_To_Delete)) then
        delete from Files_To_Delete
        where File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'File not found' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteFilesToDelete()
begin
    delete from Files_To_Delete;
end //
delimiter ;


delimiter //
create procedure sp_deleteQuiz(  
    quizID int
)
begin
    if(quizID in(select Quiz_ID from Quiz))then

        delete from Student_Quiz_File
        where Quiz_ID=quizID;

        delete from Student_Quiz_Structured_Answer
        where Quiz_ID=quizID;

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_ID=quizID;

        delete from Student_Quiz
        where Quiz_ID=quizID;

        delete from Quiz_Answer
        where Quiz_Question_ID in(
            select Quiz_Question_ID
            from Quiz_Question
            where Quiz_ID=quizID
        );

        delete from Quiz_Question
        where Quiz_ID=quizID;

        delete from Quiz
        where Quiz_ID=quizID;

        select 'ok' as RESULT;

    else
        select 'quiz does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteQuizQuestion(  
    questionID int
)
begin
    if(questionID in(select Quiz_Question_ID from Quiz_Question))then

        delete from Student_Quiz_File
        where Quiz_Question_ID=questionID;

        delete from Student_Quiz_Structured_Answer
        where Quiz_Question_ID=questionID;

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_Question_ID=questionID;

        delete from Quiz_Answer
        where Quiz_Question_ID=questionID;

        delete from Quiz_Question
        where Quiz_Question_ID=questionID;

        select 'ok' as RESULT;

    else
        select 'quiz question does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteQuizAnswer(  
    answerID int
)
begin
    if(answerID in(select Quiz_Answer_ID from Quiz_Answer))then

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_Answer_ID=answerID;

        delete from Quiz_Answer
        where Quiz_Answer_ID=answerID;

        select 'ok' as RESULT;

    else
        select 'quiz answer does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteAllQuestionAnswers(    
    studentID int,
    quizID int,
    attemptNum int,
    questID int
)
begin
    if(questID in(select Quiz_Question_ID from Quiz_Question))then

        delete from Student_Quiz_Unstructured_Answer
        where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

        select 'ok' as RESULT;

    else
        select 'quiz question does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStudentQuizFile(    
    in filePath varchar(500)
)
begin
    if(filePath in(select Student_Quiz_File_Path from Student_Quiz_File)) then
        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Student_Quiz_File
        where Student_Quiz_File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteParent(    
    in idNum varchar(11)
)
begin
    if(idNum in(select Parent_ID_Number from Parent)) then

        delete from Terms_And_Conditions_Accepted
        where Parent_ID=(select Parent_ID from Parent where Parent_ID_Number=idNum);

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
create procedure sp_deleteFileForParents(    
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
create procedure sp_deleteParentFinancialStatement(    
    in filePath varchar(500)
)
begin
    if(filePath in(select Statement_File_Path from Parent_Financial_Statement)) then

        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Parent_Financial_Statement
        where Statement_File_Path=filePath;
    else
        signal SQLSTATE '45000' set MESSAGE_TEXT='File does not exist';
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteParentRegistrationRequest(    
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

delimiter //
create procedure sp_deleteTermsAndConditionsFile(    
    in filePath varchar(500)
)
begin
    if(filePath in(select File_Path from Terms_And_Conditions_File)) then

        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Terms_And_Conditions_File
        where File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteLink(    
    in linkPath varchar(500),
    in linkType int,
    in linkTopicID int
)
begin
    if(linkPath in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID)) then

        delete from Link
        where Link_Path=linkPath AND Link_Type=linkType AND Link_Topic_ID=linkTopicID;

        select 'ok' as RESULT;
    else
        select 'link does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteAssignmentLink(    
    in linkPath varchar(500),
    in assignmentPath varchar(500)
)
begin
    if(linkPath in(select Link_Path from Link where Link_Assignment_Path=assignmentPath)) then

        delete from Link
        where Link_Path=linkPath AND Link_Assignment_Path=assignmentPath;

        select 'ok' as RESULT;
    else
        select 'link does not exist' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   LOGIN PROC DEFINITION                        */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_validateLogin(
    in type int,
    in uId varchar(100)
)
begin
    if (type = 0) then
        if (uId in (select Student_ID from Student)) then
            select Student_Password as Password from Student
            where Student_ID=uId;
        else
            select "Login validation failed" as RESULT;
        end if;
    else
        if (type = 1) then
            if (uId in (select Staff_ID from Staff)) then
                select Staff_Password as Password from Staff
                where Staff_ID=uId;
            else
                select "Login validation failed" as RESULT;
            end if;
        else
            if (type = 2) then
                if (uId in (select Admin_ID from Admin)) then
                    select Admin_Password as Password from Admin
                    where Admin_ID=uId;
                else
                    select "Login validation failed" as RESULT;
                end if;
            else
                if (type = 3) then
                    if (uId in (select Parent_ID from Parent)) then
                        select Parent_Password as Password from Parent
                        where Parent_ID=uId;
                    else
                        select "Login validation failed" as RESULT;
                    end if;
                else
                    select "Login validation failed" as RESULT;
                end if;
            end if;
        end if;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET ENROLLED COURSES PROC DEFINITION         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getEnrolledCourses(
    in studentID varchar(100)
)
begin
    if (studentID in(select Student_ID from Student)) then
        select Course.Course_ID, Course.Course_Name, Course.Course_Desc, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
        from (Course left join Staff on Course.Staff_ID=Staff.Staff_ID)
        inner join Student_Course on Course.Course_ID=Student_Course.Course_ID
        where Student_Course.Student_ID=studentID;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSES BY GRADE                         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesByGrade(
    in grade int
)
begin
    if (grade >= 0 AND grade <= 7) then
        select Course.Course_ID, Course.Course_Name, Course.Course_Desc, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
        from Course
        left join Staff on Course.Staff_ID=Staff.Staff_ID
        where Course.Course_Grade=grade
        order by Course.Course_Name asc;
    else
        select 'grade was out of range, must be > 0 and < 8' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE OVERVIEW                          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseOverview(
    in courseID int
)
begin
    if (courseID in(select Course_ID from Course)) then
        select (select count(Course_Assignment_Path) from Course_Assignment where Course_ID=courseID) as Course_Assignments,
        Course_Topic_Name
        from Course_Topic
        where Course_ID=courseID
        order by Course_Topic_ID desc
        limit 1;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSES BY STUDENT                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesTakenByStudent(
    in studentID int
)
begin
    if (studentID in(select Student_ID from Student)) then
        select Course.Course_ID, Course.Course_Name, Course.Course_Desc
        from Course
        inner join Student_Course on Student_Course.Course_ID=Course.Course_ID
        where Student_Course.Student_ID=studentID
        order by Course.Course_Name asc;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE TOPICS                            */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseTopics(
    in courseID int
)
begin
    if (courseID in(select Course_ID from Course)) then
        select Course_Topic_ID, Course_Topic_Name
        from Course_Topic
        where Course_ID=courseID AND Parent_Topic_ID is NULL;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET SUBTOPICS                                */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getSubtopics(
    in parentTopicID int
)
begin
    if (parentTopicID in(select Course_Topic_ID from Course_Topic)) then
        select Course_Topic_ID, Course_Topic_Name
        from Course_Topic
        where Parent_Topic_ID=parentTopicID;
    else
        select 'parenrt topic not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   APPROVE COURSE MATERIAL                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_approveCourseMaterial(
    in materialPath varchar(500)
)
begin
    if (materialPath in(select Course_Material_Path from Course_Material)) then
        update Course_Material
        set Course_Material_Approved=1
        where Course_Material_Path=materialPath;

        select 'ok' as RESULT;
    else
        select 'material not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET APPROVED COURSE MATERIAL BY TOPIC        */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getMaterialByTopic(
    in courseID int,
    in topicID int
)
begin
    if ((courseID in(select Course_ID from Course)) AND (topicID in(select Course_Topic_ID from Course_Topic))) then
        select Course_Material_Path, Course_Material_Name
        from Course_Material
        where Course_ID=courseID AND Course_Topic_ID=topicID AND Course_Material_Approved=1 AND Course_Material_Delete_Requested=0;
    else
        select 'course not found or topic not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET UNAPPROVED COURSE MATERIAL BY TOPIC      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getMaterialByTopicUnapproved(
    in courseID int,
    in topicID int
)
begin
    if ((courseID in(select Course_ID from Course)) AND (topicID in(select Course_Topic_ID from Course_Topic))) then
        select Course_Material_Path, Course_Material_Name
        from Course_Material
        where Course_ID=courseID AND Course_Topic_ID=topicID AND Course_Material_Approved=0 AND Course_Material_Delete_Requested=0;
    else
        select 'course not found or topic not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET ALL UNAPPROVED COURSE MATERIALS      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllMaterialUnapproved(
)
begin
    select 
        Course.Course_Name,
        (select Course_Topic_Name from Course_Topic where Course_Topic_ID=Course_Material.Course_Topic_ID) as Course_Topic_Name,
        Course_Material.Course_Material_Path,
        Course_Material.Course_Material_Name
    from Course_Material
    inner join Course
    on Course.Course_ID=Course_Material.Course_ID
    where Course_Material_Approved=0 AND Course_Material_Delete_Requested=0
    order by Course.Course_Name asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE MATERIAL PATH BY TOPIC            */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getMaterialPath(
    in courseID int,
    in topicID int,
    in materialName varchar(100)
)
begin
    if ((courseID in(select Course_ID from Course)) AND (topicID in(select Course_Topic_ID from Course_Topic)) AND (materialName in(select Course_Material_Name from Course_Material where Course_ID=courseID AND Course_Material_Week=materialWeek))) then
        select Course_Material_Path
        from Course_Material
        where Course_ID=courseID AND Course_Topic_ID=topicID AND Course_Material_Name=materialName;
    else
        select 'course not found or material name not found or topic not found' as RESULT;
    end if;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   MARK MATERIAL FOR DELETION                                   */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_markMaterialForDeletion(
    in materialPath varchar(500)
)
begin
    if(materialPath in(select Course_Material_Path from Course_Material)) then
        update Course_Material
        set Course_Material_Delete_Requested=1
        where Course_Material_Path=materialPath;

        select 'ok' as RESULT;
    else
        select 'material does not exist' as RESULT;
    end if;
end //
delimiter ;


/*--------------------------------------------------------------------------------------*/
/*-------   UNMARK MATERIAL FOR DELETION                                   */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_unmarkMaterialForDeletion(
    in materialPath varchar(500)
)
begin
    if(materialPath in(select Course_Material_Path from Course_Material)) then
        update Course_Material
        set Course_Material_Delete_Requested=0
        where Course_Material_Path=materialPath;

        select 'ok' as RESULT;
    else
        select 'material does not exist' as RESULT;
    end if;
end //
delimiter ;

/*-----------------------------------------------------------------*/
/*-------   GET COURSE MATERIAL BY TOPIC MARKED FOR DELETION      */
/*-----------------------------------------------------------------*/

delimiter //
create procedure sp_getMaterialByTopicToBeDeleted(
    in courseID int,
    in topicID int
)
begin
    if ((courseID in(select Course_ID from Course)) AND (topicID in(select Course_Topic_ID from Course_Topic))) then
        select Course_Material_Path, Course_Material_Name
        from Course_Material
        where Course_ID=courseID AND Course_Topic_ID=topicID AND Course_Material_Delete_Requested=1;
    else
        select 'course not found or topic not found' as RESULT;
    end if;
end //
delimiter ;

/*-----------------------------------------------------------------*/
/*-------   GET ALL MATERIALS MARKED FOR DELETION      */
/*-----------------------------------------------------------------*/

delimiter //
create procedure sp_getAllMaterialsToBeDeleted(
)
begin
    select Course.Course_Name, Course_Material.Course_Material_Path, Course_Material.Course_Material_Name
    from Course_Material
    inner join Course
    on Course.Course_ID=Course_Material.Course_ID
    where Course_Material_Delete_Requested=1
    order by Course.Course_Name asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE ASSIGNMENTS                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseAssignments(
    in courseID int
)
begin
    if ((courseID in(select Course_ID from Course))) then
        select Course_Assignment_Path, Course_Assignment_Name, Course_Assignment_Due_Date, Course_Assignment_Marks_Available
        from Course_Assignment
        where Course_ID=courseID;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE ASSIGNMENT PATH                   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAssignmentPath(
    in courseID int,
    in assignmentName varchar(100)
)
begin
    if ((courseID in(select Course_ID from Course)) AND (assignmentName in(select Course_Assignment_Name from Course_Assignment where Course_ID=courseID))) then
        select Course_Assignment_Path
        from Course_Assignment
        where Course_ID=courseID AND Course_Assignment_Name=assignmentName;
    else
        select 'course not found or assignment name not found)' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET COURSE ASSESSMENTS                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseAssessments(
    in courseID int
)
begin
    if ((courseID in(select Course_ID from Course))) then
        select Course_Assessment_ID, Course_Assessment_Name, Course_Assessment_Marks_Available, Course_Assessment_Contribution
        from Course_Assessment
        where Course_ID=courseID;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET ALL STUDENTS                             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllStudents()
begin
    select Student_ID, Student_First_Name, Student_Surname_Name, Student_Age, Student_Grade, Student_Guardian_Email_M, Student_Guardian_Email_F, Student_Guardian_Cell
    from Student
    order by Student_Surname_Name asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*--            GET ALL STUDENTS SHORT                   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllStudentsShort()
begin
    select Student_ID, Student_First_Name, Student_Surname_Name
    from Student
    order by Student_ID asc;
end //
delimiter ;


/*------------------------------------------------------------*/
/*-------   GET ALL STUDENTS NOT REGISTERED TO THEIR COURSES  */
/*------------------------------------------------------------*/

delimiter //
create procedure sp_getAllStudentsNotRegistered()
begin
    select Student.Student_ID, Student.Student_First_Name, Student.Student_Surname_Name, Student.Student_Grade
    from Student
    where (select count(*) from Student_Course where Student_Course.Student_ID=Student.Student_ID)  = (select count(*) from Course where Course.Course_Grade=Student.Student_Grade)
    order by Student.Student_Surname_Name asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   SEARCH ALL STUDENTS                          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_searchAllStudents(
    in name varchar(50),
    in surname varchar(50)
)
begin
    select Student_ID, Student_First_Name, Student_Surname_Name, Student_Age, Student_Grade, Student_Guardian_Cell
    from Student
    where Student_First_Name LIKE name AND Student_Surname_Name LIKE surname
    order by Student_Surname_Name asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET STUDENTS IN COURSE                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentsInCourse(
    in courseID int
)
begin
    if ((courseID in(select Course_ID from Course))) then
        select Student.Student_ID, Student.Student_First_Name, Student.Student_Surname_Name, Student.Student_Age, Student.Student_Grade, Student.Student_Guardian_Cell
        from Student
        inner join Student_Course
        on Student.Student_ID=Student_Course.Student_ID
        where Student_Course.Course_ID=courseID
        order by Student.Student_Surname_Name asc;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET STUDENTS BY GRADE                        */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentsByGrade(
    in grade int
)
begin
    if (grade >= 0 AND grade < 8) then
        select Student_ID, Student_First_Name, Student_Surname_Name, Student_Age, Student_Grade, Student_Guardian_Cell
        from Student
        where Student_Grade=grade
        order by Student_Surname_Name asc;
    else
        select 'grade out of range' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET STUDENTS WITH >= 80% BY COURSE           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentsWithMerritsByCourse(
    in courseID int
)
begin
    if (courseID in(select Course_ID from Course)) then
        select Student.Student_ID, Student.Student_First_Name, Student.Student_Surname_Name, Student.Student_Age, Student.Student_Grade, Student.Student_Guardian_Cell
        from Student
        inner join Student_Course
        on Student.Student_ID=Student_Course.Student_ID
        where Student_Course.Course_ID=courseID AND Student_Course.Student_Course_Mark >= 80
        order by Student_Surname_Name asc;
    else
        select 'grade out of range' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   SEARCH STUDENTS IN COURSE                    */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_searchStudentsInCourse(
    in courseID int,
    in name varchar(50),
    in surname varchar(50)
)
begin
    if ((courseID in(select Course_ID from Course))) then
        select Student.Student_ID, Student.Student_First_Name, Student.Student_Surname_Name
        from Student
        inner join Student_Course
        on Student.Student_ID=Student_Course.Student_ID
        where Student_Course.Course_ID=courseID AND Student.Student_First_Name LIKE name AND Student.Student_Surname_Name LIKE surname
        order by Student.Student_Surname_Name asc;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   GET STUDENT REPORTS                                                         */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_getStudentReports(
    in studentID int
)
begin
    if(studentID in(select Student_ID from Student)) then
        select Student_Report_Path, Student_Report_Name, Student_Report_Term, Student_Report_Year
        from Student_Report
        where Student_ID=studentID
        order by Student_Report_Year desc;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET STUDENT ASSIGNMENT PATHS                 */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentAssignmentPaths(
    in studentID int,
    in caPath varchar(500)
)
begin
    if ((studentID in(select Student_ID from Student)) AND (caPath in(select Course_Assignment_Path from Course_Assignment))) then
        select Student_Assignment_File_Path,Student_Assignment_File_Name
        from Student_Assignment_File
        where Course_Assignment_Path=caPath AND Student_ID=studentID;
    else
        select 'student not found or assignment path not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET MARKS FOR ALL COURSES                    */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseMarks(
    in studentID int
)
begin
    if ((studentID in(select Student_ID from Student))) then
        select Course.Course_ID, Course.Course_Name, Student_Course.Student_Course_Mark
        from Student_Course
        inner join Course
        on Student_Course.Course_ID=Course.Course_ID
        where Student_Course.Student_ID=studentID;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE ASSIGNMENT MARKS                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAssignmentMarksByCourse(
    in studentID int,
    in courseID int
)
begin
    if ((studentID in(select Student_ID from Student)) AND (courseID in(select Course_ID from Course))) then
        select Course_Assignment.Course_Assignment_Name, Course_Assignment.Course_Assignment_Marks_Available, Student_Assignment_Mark.Assignment_Mark
        from Course_Assignment
        inner join Student_Assignment_Mark
        on Course_Assignment.Course_Assignment_Path=Student_Assignment_Mark.Course_Assignment_Path
        where Course_Assignment.Course_ID=courseID AND Student_Assignment_Mark.Student_ID=studentID
        order by Course_Assignment.Course_Assignment_Due_Date asc;
    else
        select 'student not found or course not found' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET COURSE ASSESSMENT MARKS                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAssessmentMarksByCourse(
    in studentID int,
    in courseID int
)
begin
    if ((studentID in(select Student_ID from Student)) AND (courseID in(select Course_ID from Course))) then
        select Course_Assessment.Course_Assessment_ID, Course_Assessment.Course_Assessment_Name, Course_Assessment.Course_Assessment_Marks_Available, Course_Assessment.Course_Assessment_Contribution, Student_Assessment_Mark.Assessment_Mark
        from Course_Assessment
        inner join Student_Assessment_Mark
        on Course_Assessment.Course_Assessment_ID=Student_Assessment_Mark.Course_Assessment_ID
        where Course_Assessment.Course_ID=courseID AND Student_Assessment_Mark.Student_ID=studentID
        order by Course_Assessment.Course_Assessment_Contribution desc;
    else
        select 'student not found or course not found' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET SPECIFIC ASSIGNMENT MARK                 */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAssignmentMark(
    in studentID int,
    in caPath varchar(500)
)
begin
    if ((studentID in(select Student_ID from Student_Assignment_Mark where Course_Assignment_Path=caPath))) then
        select Assignment_Mark
        from Student_Assignment_Mark
        where Student_ID=studentID AND Course_Assignment_Path=caPath;
    else
        select 'no record found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSE ANNOUNCEMENTS                     */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseAnnouncements(
    in courseID int
)
begin
    if ((courseID in(select Course_ID from Course))) then
        select Course_Announcement.Course_Announcement_ID, Course_Announcement.Course_Announcement_Message,Course_Announcement.Course_Announcement_Date, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
        from (Course_Announcement
            inner join Course on Course_Announcement.Course_ID=Course.Course_ID)
        inner join Staff on Course.Staff_ID=Staff.Staff_ID
        where Course_Announcement.Course_ID=courseID
        order by Course_Announcement_Date desc;
    else
        select 'course not found' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET STAFF MEMBERS                            */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStaffMembers()
begin
    select Staff.Staff_ID, Job_Position.Position_Name, Staff.Staff_Name, Staff.Staff_Surname, Staff.Staff_Age, Staff.Staff_Cell, Staff.Staff_Email
    from Staff
    inner join Job_Position
    on Staff.Position_ID=Job_Position.Position_ID
    order by Staff.Staff_Surname asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   SEARCH STAFF MEMBERS                         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_searchStaffMembers(
    in name varchar(50),
    in surname varchar(50)
)
begin
    select Staff.Staff_ID,Job_Position.Position_Name,Staff.Staff_Name,Staff.Staff_Surname,Staff.Staff_Cell
    from Staff
    inner join Job_Position
    on Staff.Position_ID=Job_Position.Position_ID
    where Staff.Staff_Name LIKE name AND Staff.Staff_Surname LIKE surname
    order by Staff.Staff_Surname asc;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSES TAUGHT BY STAFF                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesTaughtByStaff(
    in staffID int
)
begin
    if(staffID in(select Staff_ID from Staff)) then
        select Course_ID, Course_Name, Course_Grade
        from Course
        where Staff_ID=staffID
        OR Course_ID in(
            select Course_ID from Course_Staff where Staff_ID=staffID
        );
    else
        select 'staff member does not exist' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET COURSES TAUGHT BY STAFF DETAILED         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesTaughtByStaffDetailed(
    in staffID int
)
begin
    if(staffID in(select Staff_ID from Staff)) then
        select Course.Course_ID, Course.Course_Name, Course.Course_Desc, Course_Grade, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
        from Course
        inner join Staff
        on Course.Staff_ID=Staff.Staff_ID
        where Course.Staff_ID=staffID
        OR Course.Course_ID in(
            select Course_Staff.Course_ID from Course_Staff
            where Course_Staff.Staff_ID=staffID
        )
        order by Course.Course_Grade asc;
    else
        select 'staff member does not exist' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   REMOVE COURSE TAUGHT BY STAFF                */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_removeCourseTaught(
    in courseID int,
    in staffID int
)
begin
    if(courseID in(select Course_ID from Course) AND staffID in(select Staff_ID from Staff)) then
        delete from Course_Staff
        where Course_ID=courseID AND Staff_ID=staffID;

        update Course
        set Staff_ID=null
        where Course_ID=courseID AND Staff_ID=staffID;

        select 'ok' as RESULT;
    else
        select 'Course does not exist or staff does not exist' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET OTHER COURSE STAFF                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getOtherCourseStaff(
    in courseID int
)
begin
    if(courseID in(select Course_ID from Course)) then
        select Staff.Staff_ID, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
        from Staff
        inner join Course_Staff
        on Staff.Staff_ID=Course_Staff.Staff_ID
        where Course_Staff.Course_ID=courseID
        AND Staff.Staff_ID not in(select Staff_ID from Course where Course_ID=courseID)
        order by Staff.Staff_Name asc;
    else
        select 'course does not exist' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET SHORT VERSION OF JOB POSITIONS           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getJobPositionsShort()
begin
    select Position_ID, Position_Name
    from Job_Position;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET SHORT VERSION OF STAFF                   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStaffShort()
begin
    select Staff_ID, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name
    from Staff;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET SHORT VERSION OF COURSES                 */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesShort()
begin
    select Course_ID, Course_Name
    from Course;
end //
delimiter ;

/*-------------------------------------------------------*/
/*-------   GET SHORT VERSION OF COURSES BY GRADE        */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCoursesByGradeShort(
    in grade int
)
begin
    select Course_ID, Course_Name
    from Course
    where Course_Grade=grade;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   INSERT RECORDS INTO STUDENT_ASSIGNMENT_MARK FOR EACH STUDENT IN A COURSE    */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_generateStudentAssignmentMarkRecords(
    in cID int,
    in caPath varchar(500)
)
begin
    insert into Student_Assignment_Mark(Student_ID,Course_Assignment_Path,Assignment_Mark)
    select Student.Student_ID, caPath, 0.00
    from Student
    inner join Student_Course
    on Student.Student_ID=Student_Course.Student_ID
    where Student_Course.Course_ID=cID;
end //
delimiter ;

/*------------------------------------------------------------------*/
/*-------   GET STUDENT DETAILS                                     */
/*------------------------------------------------------------------*/

delimiter //
create procedure sp_getStudentDetails(
    in studentID int
)
begin
    if(studentID in(select Student_ID from Student)) then
        select Student_ID, concat(Student_First_Name,' ',Student_Surname_Name) as Student_Name,
        Student_Age, Student_Grade, Student_Guardian_Cell, Student_Guardian_Email_M, Student_Guardian_Email_F
        from Student
        where Student_ID=studentID;
    else
        select 'student not found' as RESULT;
    end if;
end //
delimiter ;

/*------------------------------------------------------------------*/
/*-------   GET STAFF DETAILS                                       */
/*------------------------------------------------------------------*/

delimiter //
create procedure sp_getStaffDetails(
    in staffID int
)
begin
    if(staffID in(select Staff_ID from Staff)) then
        select Staff.Staff_ID, Job_Position.Position_Name, concat(Staff.Staff_Name,' ',Staff.Staff_Surname) as Staff_Name,
        Staff.Staff_Age, Staff.Staff_Cell, Staff.Staff_Email
        from Staff
        inner join Job_Position
        on Staff.Position_ID=Job_Position.Position_ID
        where Staff.Staff_ID=staffID;
    else
        select 'staff not found' as RESULT;
    end if;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   GET FILES TO DELETE                                                         */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_getFilesToDelete()
begin
    select * from Files_To_Delete;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   GET NEWS/EVENTS                                                             */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_getNewsEvents()
begin
    select News_Events_Title, News_Events_Content, News_Events_Date_Added, News_Events_Img_Path
    from News_Events;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   CHECK IF IMG PATH IS IN NEWS/EVENTS TABLE                                   */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_checkNewsImgPath(
    in imgPath varchar(500)
)
begin
    if(imgPath in(select News_Events_Img_Path from News_Events)) then
        select 'ok' as RESULT;
    else
        select 'img path does not exist' as RESULT;
    end if;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------  DELETE NEWS/EVENTS                                  */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_deleteNewsEvents(
    in newsImgPath varchar(500)
)
begin
    if(newsImgPath in(select News_Events_Img_Path from News_Events)) then

        insert into Files_To_Delete(File_Path)
        values(newsImgPath);

        delete from News_Events
        where News_Events_Img_Path=newsImgPath;

        select 'ok' as RESULT;
    else
        select 'news/event does not exist' as RESULT;
    end if;
end //
delimiter ;

/*--------------------------------------------------------------------------------------*/
/*-------   GET ALL PARENT EMAILS                                                       */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_getParentEmails()
begin
    select Student_Guardian_Email_F as email
    from Student
    where Student_Guardian_Email_F  = ''
    union
    select Student_Guardian_Email_M as email
    from Student
    where Student_Guardian_Email_M  = '';
end //
delimiter ;


/*--------------------------------------------------------------------------------------*/
/*-------   CHANGE PASSWORD                                                       */
/*--------------------------------------------------------------------------------------*/

delimiter //
create procedure sp_changePassword(
    in uType int,
    in userId int,
    in newPassword varchar(500)
)
begin
    if(uType=1) then                    /* CHANGE STAFF PWORD */
        if(userId in(select Staff_ID from Staff)) then
            update Staff
            set Staff_Password=newPassword
            where Staff_ID=userId;

            select 'ok' as RESULT;
        else
            select 'user does not exist' as RESULT;
        end if;
    else
        if(uType=2) then                    /* CHANGE STUDENT PWORD */
            if(userId in(select Student_ID from Student)) then
                update Student
                set Student_Password=newPassword
                where Student_ID=userId;

                select 'ok' as RESULT;
            else
                select 'user does not exist' as RESULT;
            end if;
        else
            if(uType=3) then                    /* CHANGE ADMIN PWORD */
                if(userId in(select Admin_ID from Admin)) then
                    update Admin
                    set Admin_Password=newPassword
                    where Admin_ID=userId;

                    select 'ok' as RESULT;
                else
                    select 'user does not exist' as RESULT;
                end if;
            else
                if(uType=4) then                    /* CHANGE ADMIN PWORD */
                    if(userId in(select Parent_ID from Parent)) then
                        update Parent
                        set Parent_Password=newPassword
                        where Parent_ID=userId;

                        select 'ok' as RESULT;
                    else
                        select 'user does not exist' as RESULT;
                    end if;
                end if;
            end if;
        end if;
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


/*-------------------------------------------------------*/
/*--          CHECK FOR UNREAD MESSAGES                  */
/*-------------------------------------------------------*/

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


/*-------------------------------------------------------*/
/*--          MARK MESSAGES AS READ                      */
/*-------------------------------------------------------*/

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


/*-------------------------------------------------------*/
/*--          GET HOME FILES BY SECTION                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getHomeFilesBySection(
    in section varchar(100)
)
begin
    select Home_File_Path, Home_File_Name
    from Home_File
    where Home_File_Section=section;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--          CHECK HOME FILE PATH                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_checkHomeFilePath(
    in filePath varchar(500)
)
begin
    if(filePath in(select Home_File_Path from Home_File)) then
        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET ROOT RESOURCE_TOPICS FOR STAFF             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getRootResourceTopicsForStaff(
)
begin
    select Resource_Topic_ID, Resource_Topic_Name
    from Resource_Topic
    where Resource_Topic_Parent is null;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET ROOT RESOURCE_TOPICS FOR STUDENTS          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getRootResourceTopicsForStudents(
)
begin
    select Resource_Topic_ID, Resource_Topic_Name
    from Resource_Topic
    where Visible_To_Students=1
    AND Resource_Topic_Parent is null;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET SUB RESOURCE_TOPICS FOR STAFF              */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getSubResourceTopicsForStaff(
    in parentTopicID int,
    in staffID int
)
begin

    select Resource_Topic_ID, Resource_Topic_Name, Course_ID
    from Resource_Topic
    where Course_ID in(
        select Course.Course_ID
        from Course
        inner join Course_Staff
        on Course.Course_ID = Course_Staff.Course_ID
        where Course_Staff.Staff_ID = staffID
        union
        select Course_ID
        from Course
        where Staff_ID=staffID
    ) AND Resource_Topic_Parent = parentTopicID;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET SUB RESOURCE_TOPICS FOR STUDENTS           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getSubResourceTopicsForStudents(
    in parentTopicID int
)
begin

    select Resource_Topic_ID, Resource_Topic_Name, Course_ID
    from Resource_Topic
    where Resource_Topic_Parent = parentTopicID;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET RESOURCE FILES BY TOPIC                    */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getResourceFilesByTopic(
    in topicID int
)
begin

    if(topicID in(select Resource_Topic_ID from Resource_Topic)) then

        select Resource_File_Path, Resource_File_Name, Resource_File_Date_Added
        from Resource_File
        where Resource_Topic_ID=topicID;

    else

        select 'topic does not exist' as RESULT;

    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET QUIZZES BY COURSE                          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizzesByCourse(
    in courseID int
)
begin

    if(courseID in(select Course_ID from Course)) then

        select Quiz_ID, Quiz_Name, Quiz_Attempts_Allowed, Quiz_Opening_Time, Quiz_Closing_Time, Quiz_Duration, (select COALESCE(SUM(Quiz_Question_Marks_Available), 0) from Quiz_Question where Quiz_Question.Quiz_ID=Quiz.Quiz_ID) as Quiz_Marks_Available
        from Quiz
        where Course_ID=courseID;

    else

        select 'course does not exist' as RESULT;

    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET QUIZ QUESTIONS                             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizQuestions(
    in quizID int
)
begin

    if(quizID in(select Quiz_ID from Quiz)) then

        select Quiz_Question_ID, Quiz_Question_Type, Quiz_Question_Number, Quiz_Question_Value, Quiz_Question_Marks_Available, Quiz_Question_Has_Multiple_Answers
        from Quiz_Question
        where Quiz_ID=quizID;

    else

        select 'quiz does not exist' as RESULT;

    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET QUIZ ANSWERS                               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizAnswers(
    in quizQuestionID int
)
begin

    if(quizQuestionID in(select Quiz_Question_ID from Quiz_Question)) then

        select Quiz_Answer_ID, Quiz_Answer_Value, Quiz_Answer_Is_Correct
        from Quiz_Answer
        where Quiz_Question_ID=quizQuestionID;

    else

        select 'quiz question does not exist' as RESULT;

    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET STUDENT QUIZ ATTEMPTS                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizAttempts(
    in studentID int,
    in quizID int
)
begin
    if(studentID in(select Student_ID from Student) AND quizID in(select Quiz_ID from Quiz)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @qDuration = (select Quiz_Duration from Quiz where Quiz_ID=quizID);
        set @qEndTime = (select Quiz_Closing_Time from Quiz where Quiz_ID=quizID);

        select Student_Quiz_Attempt_Number,
        Student_Quiz_Start_Time,
        Student_Quiz_End_Time,
        Student_Quiz_Mark_Obtained,
        Student_Quiz_Graded,
        ( (DATE_ADD(Student_Quiz_Start_Time, interval @qDuration minute) >= now()) AND now() <= @qEndTime AND Student_Quiz_End_Time is null ) as In_Progress
        from Student_Quiz
        where Student_ID=studentID AND Quiz_ID=quizID;

    else

        select 'student or quiz does not exist' as RESULT;

    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET STUDENT QUIZ FILES                         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizFiles(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Student_Quiz_File_Path, Student_Quiz_File_Name
    from Student_Quiz_File
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET STUDENT UNSTRUCTURED ANSWERS               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizUnstructuredAnswers(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Quiz_Answer_ID
    from Student_Quiz_Unstructured_Answer
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET STUDENT STRUCTURED ANSWER                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizStructuredAnswer(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Student_Quiz_Structured_Answer_Value, Student_Quiz_Structured_Answer_Mark
    from Student_Quiz_Structured_Answer
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      END STUDENT QUIZ                               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_endStudentQuiz(
    in studentID int,
    in quizID int
)
begin

    set @timeNow=now();
    set @endTime=(select Quiz_Closing_Time from Quiz where Quiz_ID=quizID);
    set @duration=(select Quiz_Duration from Quiz where Quiz_ID=quizID);


    if( @timeNow >= @endTime ) then
        update Student_Quiz
        set Student_Quiz_End_Time=@timeNow
        where Quiz_ID=quizID AND Student_Quiz_End_Time is null;
    end if;


    update Student_Quiz
    set Student_Quiz_End_Time=@timeNow
    where DATE_ADD(Student_Quiz_Start_Time, interval @duration minute) <= @timeNow AND Quiz_ID=quizID AND Student_Quiz_End_Time is null;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--      END STUDENT QUIZ ATTEMPT                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_endStudentQuizAttempt(
    in studentID int,
    in quizID int,
    in attemptNum int
)
begin
    if(attemptNum in(select Student_Quiz_Attempt_Number from Student_Quiz where Student_ID=studentID AND Quiz_ID=quizID)) then
        update Student_Quiz
        set Student_Quiz_End_Time = now()
        where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum AND Student_Quiz_End_Time is null;

        select 'ok' as RESULT;
    else
        select 'quiz attempt does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      CALCULATE STUDENT QUIZ GRADE                   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_calculateStudentQuizAttemptGrade(
    in studentID int,
    in quizID int,
    in attemptNum int
)
begin

    /* VAR DECLARATIONS */

    declare questionID int;
    declare marksAvailable int;
    declare numOfMultiChoiceCorrectAnswers int;
    declare numOfStudentMultiChoiceCorrectAnswers int;
    declare numOfStudentMultiChoiceAnswers int;
    declare tempCalcVal decimal(19,2);
    declare tempTotal decimal(19,2);
    declare totalMarksObtained decimal(19,2);
    declare END_OF_CURSOR int default false;

    /* CURSOR DECLARATIONS */

    declare Multi_Choice_Questions cursor for
    select Quiz_Question_ID, Quiz_Question_Marks_Available
    from Quiz_Question
    where Quiz_ID=quizID AND Quiz_Question_Type=1;

    declare Single_Word_Questions cursor for
    select Quiz_Question_ID, Quiz_Question_Marks_Available
    from Quiz_Question
    where Quiz_ID=quizID AND Quiz_Question_Type=2;

    /* HANDLER DECLARATIONS */

    declare CONTINUE handler for NOT FOUND set END_OF_CURSOR=true;

    if(attemptNum in(select Student_Quiz_Attempt_Number from Student_Quiz where Student_ID=studentID AND Quiz_ID=quizID)) then

        /* OPEN CURSORS */

        open Multi_Choice_Questions;
        open Single_Word_Questions;

        set totalMarksObtained = 0;

        /* CALCULATE MUTLICHOICE MARKS */

        set tempTotal=0;
        multiChoiceCalcLoop: loop
            fetch Multi_Choice_Questions into questionID, marksAvailable;
            if (END_OF_CURSOR) then
                leave multiChoiceCalcLoop;
            end if;

            set numOfMultiChoiceCorrectAnswers = (
                select COUNT(Quiz_Answer_ID)
                from Quiz_Answer
                where Quiz_Question_ID=questionID AND Quiz_Answer_Is_Correct=1
            ); 

            set numOfStudentMultiChoiceCorrectAnswers = (
                select COUNT(Student_ID) 
                from Student_Quiz_Unstructured_Answer
                where Quiz_Question_ID=questionID 
                AND Quiz_Answer_ID in(select Quiz_Answer_ID from Quiz_Answer where Quiz_Question_ID=questionID AND Quiz_Answer_Is_Correct=1)
                AND Student_Quiz_Attempt_Number=attemptNum AND Student_ID=studentID
            );

            set numOfStudentMultiChoiceAnswers = (
                select COUNT(Student_ID) 
                from Student_Quiz_Unstructured_Answer
                where Quiz_Question_ID=questionID 
                AND Student_Quiz_Attempt_Number=attemptNum AND Student_ID=studentID
            );

            if(numOfMultiChoiceCorrectAnswers = 0) then
                set tempCalcVal = marksAvailable;
            else

                /* CHECK IF STUDENT SELECTED MORE THAN THE CORRECT NUMBER OF ANSWERS */

                if(numOfStudentMultiChoiceAnswers > numOfMultiChoiceCorrectAnswers) then
                    set tempCalcVal = 0;
                else
                    set tempCalcVal = (numOfStudentMultiChoiceCorrectAnswers / numOfMultiChoiceCorrectAnswers) * marksAvailable;
                end if;
            end if;

            set tempTotal = tempTotal + tempCalcVal;
        end loop;

        set totalMarksObtained = totalMarksObtained + tempTotal;
        
        /* CALCULATE SINGLE WORD MARKS */

        set tempTotal = 0;
        set END_OF_CURSOR=false;
        singleWordCalcLoop: loop
            fetch Single_Word_Questions into questionID, marksAvailable;
            if (END_OF_CURSOR) then
                leave singleWordCalcLoop;
            end if;

            if((select COUNT(Quiz_Answer_ID) from Quiz_Answer where Quiz_Question_ID=questionID) = 0) then
                set tempCalcVal = marksAvailable;
            else
                if((select Student_Quiz_Structured_Answer_Value from Student_Quiz_Structured_Answer where Quiz_Question_ID=questionID AND Student_Quiz_Attempt_Number=attemptNum AND Student_ID=studentID limit 1) in(select Quiz_Answer_Value from Quiz_Answer where Quiz_Question_ID=questionID)) then
                    set tempCalcVal = marksAvailable;
                else
                    set tempCalcVal = 0;
                end if;
            end if;

            set tempTotal = tempTotal + tempCalcVal;
        end loop;

        set totalMarksObtained = totalMarksObtained + tempTotal;

        /* CALCULATE STRUCTURED MARKS */

        set tempTotal = (
            select COALESCE(SUM(Student_Quiz_Structured_Answer_Mark),0)
            from Student_Quiz_Structured_Answer
            where Student_Quiz_Attempt_Number=attemptNum AND Student_ID=studentID
            AND Quiz_Question_ID in(
                select Quiz_Question_ID
                from Quiz_Question
                where Quiz_ID=quizID AND Quiz_Question_Type=3
            )
        );

        set totalMarksObtained = totalMarksObtained + tempTotal;

        /* CLOSE CURSORS */

        close Multi_Choice_Questions;
        close Single_Word_Questions;

        /* UPDATE MARK */

        update Student_Quiz
        set Student_Quiz_Mark_Obtained = totalMarksObtained
        where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum;

        select 'ok' as RESULT;
    else
        select 'student quiz attempt does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ALL PARENTS                 !!!!!!!!!!!!   */
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
        Parent_Mobile,
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET PARENT DETAILS        !!!!!!!!!!!!!!!!!!   */
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
        Parent_Mobile,
        Parent_Address,
        Parent_Home_Language,
        Parent_Religion
    from Parent
    where Parent_ID=parentID;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ALL TIMETABLES                             */
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
/*--      GET ALL CALENDARS                              */
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
/*--      GET ALL SUPPORT DOCUMENTS                      */
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
/*--      GET PARENT FINANCES                            */
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
/*--      GET PARENT FINANCIAL STATEMENTS                */
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
/*--            GET PARENT STUDENTS                      */
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
/*--      GET PARENT REGISTRATION REQUESTS    !!!!!!!!   */
/*-------------------------------------------------------*/

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



/*-------------------------------------------------------*/
/*--      GET PARENT REGISTRATION STUDENT INFO           */
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
/*--      GET TERMS AND CONDITIONS FILES                 */
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
/*--      CHECK IF TERMS AND CONDITIONS ACCEPTED         */
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



/*-------------------------------------------------------*/
/*-------   MARK LINK FOR DELETION                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_markLinkForDeletion(
    in linkPath varchar(500),
    in linkType int,
    in linkTopicID int
)
begin
    if(linkPath in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID)) then
        update Link
        set Link_Marked_For_Deletion=1
        where Link_Path=linkPath AND Link_Type=linkType AND Link_Topic_ID=linkTopicID;

        select 'ok' as RESULT;
    else
        select 'link does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   UNMARK LINK FOR DELETION                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_unMarkLinkForDeletion(
    in linkPath varchar(500),
    in linkType int,
    in linkTopicID int
)
begin
    if(linkPath in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID)) then
        update Link
        set Link_Marked_For_Deletion=0
        where Link_Path=linkPath AND Link_Type=linkType AND Link_Topic_ID=linkTopicID;

        select 'ok' as RESULT;
    else
        select 'link does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   GET TOPIC LINKS MARKED FOR DELETION          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksMarkedForDeletion(
    in topicID int
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Topic_ID=topicID AND Link_Marked_For_Deletion=1;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   GET ALL LINKS MARKED FOR DELETION            */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAllLinksMarkedForDeletion()
begin
    select
        Link_Path,
        Link_Name,
        Link_Topic_ID,
        (select Course.Course_Name from Course
         inner join Course_Topic on Course.Course_ID=Course_Topic.Course_ID
         where Course_Topic_ID=Link_Topic_ID) as Course_Name
    from Link
    where Link_Type=1 AND Link_Marked_For_Deletion=1;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------          APPROVE LINK                          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_approveLink(
    in linkPath varchar(500),
    in linkType int,
    in linkTopicID int
)
begin
    if(linkPath in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID)) then
        update Link
        set Link_Approved=1
        where Link_Path=linkPath AND Link_Type=linkType AND Link_Topic_ID=linkTopicID;

        select 'ok' as RESULT;
    else
        select 'link does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------      GET UNAPPROVED LINKS BY TOPIC             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksByTopicUnapproved(
    in topicID int
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Topic_ID=topicID AND Link_Approved=0 AND Link_Marked_For_Deletion=0;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------      GET ALL UNAPPROVED LINKS                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksUnapproved(
)
begin
    select 
        Link_Path,
        Link_Name,
        Link_Topic_ID,
        (select Course.Course_Name from Course
         inner join Course_Topic on Course.Course_ID=Course_Topic.Course_ID
         where Course_Topic_ID=Link_Topic_ID) as Course_Name,
        (select Course_Topic_Name from Course_Topic where Course_Topic_ID=Link_Topic_ID) as Course_Topic_Name
    from Link
    where Link_Topic_ID in(select Course_Topic_ID from Course_Topic) AND Link_Approved=0 AND Link_Marked_For_Deletion=0;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------      GET APPROVED LINKS BY TOPIC               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksByTopicApproved(
    in topicID int
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Topic_ID=topicID AND Link_Approved=1  AND Link_Marked_For_Deletion=0;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------      GET LINKS BY TOPIC                        */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksByTopic(
    in topicID int
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Topic_ID=topicID AND Link_Type=2;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   GET COURSE ASSIGNMENT LINKS                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getCourseAssignmentLinks(
    in assignmentPath varchar(500)
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Assignment_Path=assignmentPath;
end //
delimiter ;


/*-------------------------------------------------------*/
/*-------   GET HOME SECTION LINKS                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getHomeSectionLinks(
    in linkType int
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Type=linkType;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   SET ADMIN RESOURCE PASSWORD                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_setAdminResourcePassword(
    in adminID int,
    in password varchar(100)
)
begin
    
    if(adminID not in(select Admin_ID from Admin)) then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Admin not found';
    end if;

    if(password='') then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Password was empty';
    end if;
    
    update Admin
    set Admin_Resource_Password=password
    where Admin_ID=adminID;
    
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------   GET ADMIN RESOURCE PASSWORD                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getAdminResourcePassword(
    in adminID int
)
begin
    
    if(adminID not in(select Admin_ID from Admin)) then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Admin not found';
    end if;

    select Admin_Resource_Password as Password from Admin where Admin_ID=adminID;
    
end //
delimiter ;