/*  
 Execute file:
 1. cd to dir where file is located.
 2. run command --->  cat db_setup.sql | mysql -u {uname} -p{pw}
 Where {uname} = your username 
 and {pw} = your password 
 */

DROP DATABASE IF EXISTS SCA_ITS;

CREATE DATABASE IF NOT EXISTS SCA_ITS;

USE SCA_ITS;

/*----   USER TABLE DEFINITIONS   ----*/

CREATE TABLE
    User_Type(
        User_Type_Id INT PRIMARY KEY AUTO_INCREMENT,
        User_Type_Name VARCHAR(100) NOT NULL,
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
    );

CREATE TABLE
    User_Account(
        User_Id INT PRIMARY KEY AUTO_INCREMENT,
        User_Type_Id INT NOT NULL,
        /**/
        Email VARCHAR(100) NOT NULL,
        _Password VARCHAR(100) NOT NULL,
        First_Name VARCHAR(100) NOT NULL,
        Last_Name VARCHAR(100) NOT NULL,
        Profile_Pic_Path VARCHAR(500),
        /**/
        Confirmation_Code VARCHAR(40) NOT NULL,
        IsConfirmed bit not null,
        IsActive bit not null,
        IsApproved bit not null,
        /**/
        LastLogin datetime,
        /*  */
        Refresh_Token VARCHAR(100),
        /*  */
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        /*  */
        FOREIGN KEY (User_Type_Id) REFERENCES User_Type(User_Type_Id)
    );

CREATE TABLE
    Contact_Details_Type(
        Type_Id INT PRIMARY KEY AUTO_INCREMENT,
        Type_Name VARCHAR(100) NOT NULL,
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
    );

CREATE TABLE
    Contact_Details(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Type_Id INT NOT NULL,
        Content VARCHAR(100) NOT NULL,
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        FOREIGN KEY (Type_Id) REFERENCES Contact_Details_Type(Type_Id)
    );

CREATE TABLE
    Required_Registration_Document(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        User_Type_Id INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        Description VARCHAR(100),
        /*  */
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        /*  */
        FOREIGN KEY (User_Type_Id) REFERENCES User_Type(User_Type_Id)
    );

/*----   PARENT TABLE DEFINITIONS   ----*/

CREATE TABLE
    Parent(
        User_Id INT NOT NULL,
        Id_Number VARCHAR(100),
        /*  */
        Employer VARCHAR(200),
        Occupation VARCHAR(200),
        Monthly_Income DECIMAL(19, 2),
        Working_Hours VARCHAR(100),
        Specialist_Skills_Hobbies VARCHAR(3000),
        /*  */
        Telephone_Work VARCHAR(50),
        Telephone_Home VARCHAR(50),
        Fax VARCHAR(50),
        Cell_Number VARCHAR(20),
        /*  */
        Postal_Address VARCHAR(200),
        Residential_Address VARCHAR(1000),
        /*  */
        Marital_Status VARCHAR(50),
        /*  */
        School_Discovery VARCHAR(400),
        Reason_For_School_Selection VARCHAR(1000),
        /**/
        Registration_Stage INT NOT NULL,
        /* 
         ADD_DETAILS = 1
         ADD_OTHER_PARENTS = 2
         ADD_STUDENTS = 3
         ADD_REQUIRED_DOCS = 4
         PAY_REGISTRATION_FEE = 5
         APPROVED = 6
         */
        /**/
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        /**/
        FOREIGN KEY (User_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
        PRIMARY KEY (User_Id)
    );

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

CREATE TABLE
    Parent_Registration_Payment_File(
        File_Path VARCHAR(600) PRIMARY KEY,
        File_Name VARCHAR(500) NOT NULL,
        Parent_Id INT NOT NULL,
        /**/
        FOREIGN KEY (Parent_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE
    );

CREATE TABLE
    Other_Parent(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Main_Parent_Id INT NOT NULL,
        First_Name VARCHAR(100) NOT NULL,
        Last_Name VARCHAR(100) NOT NULL,
        Id_Number VARCHAR(100),
        Employer VARCHAR(200),
        Occupation VARCHAR(200),
        Monthly_Income DECIMAL(19, 2),
        Working_Hours VARCHAR(100),
        Specialist_Skills_Hobbies VARCHAR(3000),
        Telephone_Work VARCHAR(50),
        Telephone_Home VARCHAR(50),
        Fax VARCHAR(50),
        Cell_Number VARCHAR(20),
        Postal_Address VARCHAR(200),
        Residential_Address VARCHAR(1000),
        Marital_Status VARCHAR(50),
        FOREIGN KEY (Main_Parent_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE
    );

CREATE TABLE
    Parent_Registration_File(
        File_Path VARCHAR(500) PRIMARY KEY,
        Required_Id INT NOT NULL,
        User_Id INT NOT NULL,
        Name VARCHAR(200),
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        FOREIGN KEY (User_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE,
        FOREIGN KEY (Required_Id) REFERENCES Required_Registration_Document(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Medical_Condition(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL
    );

/*----   STUDENT TABLE DEFINITIONS   ----*/

CREATE TABLE
    Student(
        Student_Number VARCHAR(150) PRIMARY KEY,
        Parent_Id INT NOT NULL,
        /* general info */
        First_Name VARCHAR(200) NOT NULL,
        Last_Name VARCHAR(100) NOT NULL,
        Grade INT NOT NULL,
        Dob DATE NOT NULL,
        Age INT,
        Gender INT,
        /* 1=Male 2=Female 3=Other */
        Citizenship VARCHAR(100),
        Study_Permit VARCHAR(500),
        Home_Language VARCHAR(100),
        Postal_Address VARCHAR(200),
        Residential_Address VARCHAR(500),
        Telephone_Home VARCHAR(100),
        Telephone_Other VARCHAR(100),
        /* religious info */
        Current_Church VARCHAR(200),
        Current_Church_Address VARCHAR(200),
        Pastor VARCHAR(200),
        Pastor_Telephone VARCHAR(20),
        Father_Confirmation_Date DATE,
        Mother_Confirmation_Date DATE,
        Baptism_Date DATE,
        /* scholastic info */
        Current_Grade INT,
        Last_School_Attended VARCHAR(150),
        Name_Of_Principal VARCHAR(100),
        School_Address VARCHAR(400),
        Students_Strengths TEXT,
        Talents_And_Interests TEXT,
        Learning_Difficulties TEXT,
        Disiplinary_Difficulties TEXT,
        Legal_Difficulties TEXT,
        Academic_Level VARCHAR(100),
        Academic_Failure_Assessment TEXT,
        /* medical info */
        Family_Doctor VARCHAR(200),
        Doctor_Telephone VARCHAR(20),
        Other_Medical_Conditions TEXT,
        General_Hearing_Test_Date DATE,
        General_Vision_Test_Date DATE,
        Tuberculosis_Test_Date DATE,
        Is_Shy BIT,
        Bites_Finger_Nails BIT,
        Sucks_Thumb BIT,
        Has_Excessive_Fears BIT,
        Likes_School BIT,
        Plays_Well_With_Others BIT,
        Eats_Breakfast_Regularly BIT,
        Bedtime VARCHAR(100),
        Rising_Time VARCHAR(100),
        Disability_Due_To_Disease_Or_Accident TEXT,
        Chronic_Medication TEXT,
        /*  */
        Registration_Stage INT NOT NULL,
        /*
         1 = add_basic_details
         2 = add_general_info 
         3 = add_religious_info 
         4 = add_scholastic_info 
         5 = add_medical_details
         6 = add_medical_conditions
         7 = add_other_parents
         8 = add_non_sca_students
         9 = add_required_docs
         10 = occupational_therapy_needed
         11 = diagnostic_test_needed
         12 = approval_requested
         13 = approved
         */
        Rejection_Message TEXT,
        Approval_Requested BIT NOT NULL,
        /**/
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        /**/
        FOREIGN KEY (Parent_Id) REFERENCES Parent(User_Id) ON DELETE CASCADE
    );

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

CREATE TABLE
    Student_Occupational_Therapy_File(
        File_Path VARCHAR(600) PRIMARY KEY,
        File_Name VARCHAR(500) NOT NULL,
        Student_Number VARCHAR(150) NOT NULL,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE
    );

CREATE TABLE
    Non_Sca_Siblings(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Student_Number VARCHAR(150) NOT NULL,
        Name VARCHAR(150) NOT NULL,
        Age INT NOT NULL,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE
    );

CREATE TABLE
    Student_Other_Parent(
        Student_Number VARCHAR(150),
        Parent_Id INT,
        _ INT,
        /*ef core will not generat table without atleast 1 col not used in pk*/
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        FOREIGN KEY (Parent_Id) REFERENCES Other_Parent(Id) ON DELETE CASCADE,
        PRIMARY KEY (Student_Number, Parent_Id)
    );

CREATE TABLE
    Student_Medical_Condition(
        Student_Number VARCHAR(150),
        Medical_Id INT,
        _ INT,
        /*ef core will not generat table without atleast 1 col not used in pk*/
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        FOREIGN KEY (Medical_Id) REFERENCES Medical_Condition(Id) ON DELETE CASCADE,
        PRIMARY KEY (Student_Number, Medical_Id)
    );

CREATE TABLE
    Student_Registration_File(
        File_Path VARCHAR(500) PRIMARY KEY,
        Required_Id INT NOT NULL,
        Student_Number VARCHAR(150) NOT NULL,
        Name VARCHAR(200),
        Created_By INT,
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        Updated_By INT,
        Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        FOREIGN KEY (Required_Id) REFERENCES Required_Registration_Document(Id) ON DELETE CASCADE
    );

/*----   COURSE TABLE DEFINITIONS   ----*/

CREATE TABLE
    Course_Category(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Moodle_Id INT UNIQUE NOT NULL,
        Parent_Category_Id INT NOT NULL,
        /*    0 = Top level category  */
        Name VARCHAR(400) NOT NULL,
        Description TEXT NOT NULL
    );

CREATE TABLE
    Course_Type(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    Course(
        Id VARCHAR(400) PRIMARY KEY,
        Moodle_Id INT NOT NULL,
        Category_Id INT NOT NULL,
        Name VARCHAR(2000) NOT NULL,
        Grade INT NOT NULL,
        Type_Id INT NOT NULL,
        IsPromotional BIT NOT NULL,
        FOREIGN KEY (Category_Id) REFERENCES Course_Category(Moodle_Id) ON DELETE CASCADE,
        FOREIGN KEY (Type_Id) REFERENCES Course_Type(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Course_Staff(
        Course_Id VARCHAR(400),
        Staff_Id INT,
        _ INT,
        /*ef core will not generat table without atleast 1 col not used in pk*/
        FOREIGN KEY (Course_Id) REFERENCES Course(Id) ON DELETE CASCADE,
        FOREIGN KEY (Staff_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
        PRIMARY KEY (Course_Id, Staff_Id)
    );

CREATE TABLE
    Course_Student(
        Course_Id VARCHAR(400),
        Student_Number VARCHAR(150),
        _ INT,
        /*ef core will not generat table without atleast 1 col not used in pk*/
        FOREIGN KEY (Course_Id) REFERENCES Course(Id) ON DELETE CASCADE,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        PRIMARY KEY (Course_Id, Student_Number)
    );

/*----   PROGRESS REPORT TABLE DEFINITIONS   ----*/

CREATE TABLE
    Progress_Report_Template(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(200) NOT NULL,
        Exam_Marks_Available DECIMAL(19, 2) NOT NULL,
        Exam_Weight DECIMAL(19, 2) NOT NULL
    );

CREATE TABLE
    Progress_Report_Category(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Progress_Report_Id INT NOT NULL,
        Name VARCHAR(200) NOT NULL,
        Weight DECIMAL(19, 2) NOT NULL,
        FOREIGN KEY (Progress_Report_Id) REFERENCES Progress_Report_Template(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Progress_Report_Assessment(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Progress_Report_Category_Id INT NOT NULL,
        Name VARCHAR(200) NOT NULL,
        Marks_Available DECIMAL(19, 2) NOT NULL,
        FOREIGN KEY (Progress_Report_Category_Id) REFERENCES Progress_Report_Category(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Course_Progress_Report(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        `Year` YEAR NOT NULL,
        Course_Id VARCHAR(400) NOT NULL,
        Progress_Report_Id INT NOT NULL,
        Number_Of_Terms INT NOT NULL,
        FOREIGN KEY (Progress_Report_Id) REFERENCES Progress_Report_Template(Id) ON DELETE CASCADE,
        FOREIGN KEY (Course_Id) REFERENCES Course(Id) ON DELETE CASCADE,
        UNIQUE (Course_Id, `Year`)
    );

CREATE TABLE
    Student_Progress_Report(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Student_Number VARCHAR(150) NOT NULL,
        Course_Progress_Report_Id INT NOT NULL,
        Exam_Mark DECIMAL(19, 2) NOT NULL,
        FOREIGN KEY (Course_Progress_Report_Id) REFERENCES Course_Progress_Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        UNIQUE (
            Student_Number,
            Course_Progress_Report_Id
        )
    );

CREATE TABLE
    Student_Progress_Report_Assessment(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Student_Progress_Report_Id INT NOT NULL,
        Progress_Report_Assessment_Id INT NOT NULL,
        Term INT NOT NULL,
        Mark DECIMAL(19, 2) NOT NULL DEFAULT 0,
        FOREIGN KEY (Student_Progress_Report_Id) REFERENCES Student_Progress_Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (
            Progress_Report_Assessment_Id
        ) REFERENCES Progress_Report_Assessment(Id) ON DELETE CASCADE,
        UNIQUE (
            Student_Progress_Report_Id,
            Progress_Report_Assessment_Id,
            Term
        )
    );

CREATE TABLE
    Student_Progress_Report_Exam_Mark(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Student_Progress_Report_Id INT NOT NULL,
        Term INT NOT NULL,
        Mark DECIMAL(19, 2) NOT NULL DEFAULT 0,
        FOREIGN KEY (Student_Progress_Report_Id) REFERENCES Student_Progress_Report(Id) ON DELETE CASCADE,
        UNIQUE (
            Student_Progress_Report_Id,
            Term
        )
    );

/*----   REPORT TABLE DEFINITIONS   ----*/

CREATE TABLE
    Report_Group(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        `Year` YEAR NOT NULL,
        Terms INT NOT NULL,
        UNIQUE (`Year`)
    );

CREATE TABLE
    Report_Type(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    Report(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Report_Type_Id INT NOT NULL,
        Report_Group_Id INT NOT NULL,
        Student_Number VARCHAR(150) NOT NULL,
        FOREIGN KEY (Report_Type_Id) REFERENCES Report_Type(Id) ON DELETE CASCADE,
        FOREIGN KEY (Report_Group_Id) REFERENCES Report_Group(Id) ON DELETE CASCADE,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE,
        UNIQUE (
            Student_Number,
            Report_Group_Id
        )
    );

CREATE TABLE
    Primary_Report_Details(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Report_Id INT NOT NULL,
        Days_Absent INT,
        Persona_Brief_Comments VARCHAR(2000),
        Register_Teacher VARCHAR(200),
        FOREIGN KEY (Report_Id) REFERENCES Report(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Pre_Primary_Report_Details(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Report_Id INT NOT NULL,
        Days_Absent INT,
        Register_Teacher VARCHAR(200),
        Dominant_Hand INT,
        Remarks VARCHAR(2000),
        /*
         0 = left
         1 = right
         2 = mixed
         */
        FOREIGN KEY (Report_Id) REFERENCES Report(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Course_Remark(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Report_Id INT NOT NULL,
        Course_Id VARCHAR(400) NOT NULL,
        Remark VARCHAR(1000) NOT NULL,
        Initials VARCHAR(10) NOT NULL,
        FOREIGN KEY (Report_Id) REFERENCES Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (Course_Id) REFERENCES Course(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Persona_Category(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    Persona(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Persona_Category_Id INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        FOREIGN KEY (Persona_Category_Id) REFERENCES Persona_Category(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Persona_Grade(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Report_Id INT NOT NULL,
        Persona_Id INT NOT NULL,
        Term INT NOT NULL,
        Grade VARCHAR(10) NOT NULL,
        FOREIGN KEY (Report_Id) REFERENCES Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (Persona_Id) REFERENCES Persona(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Development_Group(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    Development_Category(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Group_Id INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        FOREIGN KEY (Group_Id) REFERENCES Development_Group(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Development_Assessment(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Category_Id INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        FOREIGN KEY (Category_Id) REFERENCES Development_Category(Id) ON DELETE CASCADE
    );

/* alter here v0.76.0 */

CREATE TABLE
    Pre_Primary_Progress_Report(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        `Year` INT NOT NULL UNIQUE,
        Terms INT NOT NULL
    );

CREATE TABLE
    Student_Pre_Primary_Progress_Report(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Student_Number VARCHAR(150) NOT NULL,
        ProgressReportId INT NOT NULL,
        FOREIGN KEY (ProgressReportId) REFERENCES Pre_Primary_Progress_Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (Student_Number) REFERENCES Student(Student_Number) ON DELETE CASCADE
    );

CREATE TABLE
    Development_Assessment_Grade(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        StudentProgressReportId INT NOT NULL,
        Assessment_Id INT NOT NULL,
        Term INT NOT NULL,
        Grade VARCHAR(10) NOT NULL,
        FOREIGN KEY (StudentProgressReportId) REFERENCES Student_Pre_Primary_Progress_Report(Id) ON DELETE CASCADE,
        FOREIGN KEY (Assessment_Id) REFERENCES Development_Assessment(Id) ON DELETE CASCADE
    );

/* end edit v0.76.0 */

/*----   REPORT GENERATION TABLE DEFINITIONS   ----*/

CREATE TABLE
    Report_Generation_Job(
        Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        Report_Group_Id INT NOT NULL,
        Term INT NULL,
        School_Re_Opens DATE NOT NULL,
        `Status` INT NULL DEFAULT 0,
        /*
         0 = pending
         1 = running
         2 = failed
         3 = successful
         */
        Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (Report_Group_Id) REFERENCES Report_Group(Id) ON DELETE CASCADE
    );

CREATE TABLE
    Generated_Report_File(
        Id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        Job_Id INT NOT NULL,
        Report_Id INT NOT NULL,
        File_Path VARCHAR(500),
        `Status` INT NOT NULL,
        Failure_Message VARCHAR(2000),
        /*
         PENDING = 0,
         RUNNING = 1,
         FAILED = 2,
         SUCCESSFUL = 3
         */
        FOREIGN KEY (Job_Id) REFERENCES Report_Generation_Job(Id) ON DELETE CASCADE,
        FOREIGN KEY (Report_Id) REFERENCES Report(Id) ON DELETE CASCADE
    );

/*----   FINANCIAL TABLE DEFINITIONS   ----*/

CREATE TABLE
    Fees_For_Grade(
        Grade INT PRIMARY KEY,
        Amount DECIMAL(19, 2) NOT NULL DEFAULT 0.0
    );

CREATE TABLE
    Parent_Financial_Statement(
        Parent_Id INT PRIMARY KEY,
        Current_Balance DECIMAL(19, 2) NOT NULL DEFAULT 0.0,
        FOREIGN KEY (Parent_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE
    );

CREATE TABLE
    Statement_Item(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Statement_Id INT NOT NULL,
        Debit_Amount DECIMAL(19, 2) NOT NULL,
        Credit_Amount DECIMAL(19, 2) NOT NULL,
        `Date` DATE NOT NULL,
        Reference VARCHAR(100) NOT NULL,
        Description VARCHAR(700) NOT NULL,
        FOREIGN KEY (Statement_Id) REFERENCES Parent_Financial_Statement(Parent_Id) ON DELETE CASCADE
    );

CREATE TABLE
    Proof_Of_Deposit(
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Parent_Id INT NOT NULL,
        File_Path VARCHAR(500) NOT NULL,
        File_Name VARCHAR(500) NOT NULL,
        Amount DECIMAL(19, 2) NOT NULL,
        Status INT NOT NULL,
        Rejection_Message VARCHAR(3000),
        /*
         1 -- Pending
         2 -- Approved
         3 -- Rejected
         */
        FOREIGN KEY (Parent_Id) REFERENCES Parent_Financial_Statement(Parent_Id) ON DELETE CASCADE
    );

/*----   FILE MANAGEMENT TABLES   ----*/

CREATE TABLE
    File_To_Delete(
        File_Path VARCHAR(700) PRIMARY KEY,
        File_Name VARCHAR(500) NOT NULL,
        Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
    );

/*----   CREATE DEFAULT USER TYPES   ----*/

insert into User_Type(User_Type_Name) values('Admin');

insert into User_Type(User_Type_Name) values('Parent');

insert into User_Type(User_Type_Name) values('Staff');

insert into User_Type(User_Type_Name) values('Student');

/*----   CREATE DEFAULT CONTACT DETAIL TYPES   ----*/

insert into Contact_Details_Type(Type_Name) values('Cell');

insert into Contact_Details_Type(Type_Name) values('Email');

/*----   CREATE DEFAULT REQUIRED REGISTRATION DOCS FOR PARENTS   ----*/

insert into
    Required_Registration_Document(
        User_Type_Id,
        Name,
        Description
    )
values (
        2,
        "Proof of Residence",
        "Document such as a water bill that will provide proof of residence"
    );

insert into
    Required_Registration_Document(
        User_Type_Id,
        Name,
        Description
    )
values (
        2,
        "Certified ID Copy",
        "A copy of your ID that has been stamped and certified by the police"
    );

insert into
    Required_Registration_Document(
        User_Type_Id,
        Name,
        Description
    )
values (
        2,
        "Proof of Registration Fee Payment",
        "A document such as a bank statement proving that the registration fee has been paid"
    );

/*----   CREATE DEFAULT REQUIRED REGISTRATION DOCS FOR STUDENTS   ----*/

insert into
    Required_Registration_Document(
        User_Type_Id,
        Name,
        Description
    )
values (
        4,
        "Latest Report Card",
        "A report card for the previous year or term."
    );

/*----   CREATE DEFAULT MEDICAL CONDITIONS   ----*/

insert into Medical_Condition(Id, Name) values(1, 'Mumps');

insert into Medical_Condition(Id, Name) values(2, 'Diphtheria');

insert into Medical_Condition(Id, Name) values(3, 'Polio');

insert into Medical_Condition(Id, Name) values(4, 'Measles');

insert into Medical_Condition(Id, Name) values(5, 'Scarlet Fever');

insert into Medical_Condition(Id, Name) values(6, 'Convulsions');

insert into
    Medical_Condition(Id, Name)
values (7, 'Speech Difficulty');

insert into Medical_Condition(Id, Name) values(8, 'Poor Vision');

insert into
    Medical_Condition(Id, Name)
values (9, 'Hearing Difficulty');

insert into Medical_Condition(Id, Name) values(10, 'Whooping Cough');

insert into
    Medical_Condition(Id, Name)
values (11, 'Rheumatic Fever');

insert into Medical_Condition(Id, Name) values(12, 'Heart Disease');

insert into Medical_Condition(Id, Name) values(13, 'Asthma');

insert into Medical_Condition(Id, Name) values(14, 'Chicken Pox');

insert into Medical_Condition(Id, Name) values(15, 'Diabetes');

insert into Medical_Condition(Id, Name) values(16, 'Known allergy');

insert into Medical_Condition(Id, Name) values(17, 'Pneumonia');

insert into
    Medical_Condition(Id, Name)
values (
        18,
        'Recurrent Ear Infections'
    );

insert into
    Medical_Condition(Id, Name)
values (
        19,
        'Diagnosed ADD/Hyperactive'
    );

insert into Medical_Condition(Id, Name) values(20, 'Tuberculosis');

insert into Medical_Condition(Id, Name) values(21, 'HIV/AIDS');

insert into Medical_Condition(Id, Name) values(22, 'Hyperglycaemia');

/*----   CREATE DEFAULT USERS   ----*/

insert into
    User_Account(
        User_Type_Id,
        Email,
        _Password,
        First_Name,
        Last_Name,
        Confirmation_Code,
        IsConfirmed,
        IsActive,
        IsApproved
    )
values (
        1,
        'admin@gmail.com',
        'pw',
        'admin',
        'administrator',
        '101',
        1,
        1,
        1
    );

insert into
    User_Account(
        User_Type_Id,
        Email,
        _Password,
        First_Name,
        Last_Name,
        Confirmation_Code,
        IsConfirmed,
        IsActive,
        IsApproved
    )
values (
        2,
        'parent@gmail.com',
        'pw',
        'fidelus',
        'parent',
        '101',
        1,
        1,
        1
    );

insert into
    User_Account(
        User_Type_Id,
        Email,
        _Password,
        First_Name,
        Last_Name,
        Confirmation_Code,
        IsConfirmed,
        IsActive,
        IsApproved
    )
values (
        3,
        'staff@gmail.com',
        'pw',
        'fidelus',
        'staff',
        '101',
        1,
        1,
        1
    );

/* CREATE DEFAULT PARENT PROFILES */

insert into
    Parent(
        User_Id,
        Id_Number,
        Employer,
        Occupation,
        Monthly_Income,
        Working_Hours,
        Specialist_Skills_Hobbies,
        Telephone_Work,
        Telephone_Home,
        Fax,
        Cell_Number,
        Postal_Address,
        Residential_Address,
        Marital_Status,
        Registration_Stage
    )
values (
        2,
        '111111111111',
        'A company',
        'A job',
        15000,
        '8-5',
        'Nothing',
        '061 123 1111',
        '061 123 7777',
        '061 123 2222',
        '081 123 1234',
        'POBOX',
        'Some Str',
        'Married',
        1
    );

/* CREATE DEFAULT PARENT REGISTRATION STATUSES */

INSERT INTO
    Parent_Registration_Status(
        Parent_Id,
        Details_Added,
        Other_Parents_Added,
        Students_Added,
        Required_Docs_Added,
        Registration_Fee_Paid
    )
VALUES (2, 0, 0, 0, 0, 0);

/* CREATE DEFAULT PARENT FINANCIAL STATEMENTS */

insert into
    Parent_Financial_Statement(Parent_Id, Current_Balance)
values(2, 0);

/* CREATE DEFAULT STUDENTS */

insert into
    Student(
        Student_Number,
        Parent_Id,
        First_Name,
        Last_Name,
        Grade,
        Dob,
        Registration_Stage,
        Approval_Requested
    )
values (
        "220038627",
        2,
        "revaldo",
        "gertze",
        3,
        CURDATE(),
        1,
        1
    );

insert into
    Student(
        Student_Number,
        Parent_Id,
        First_Name,
        Last_Name,
        Grade,
        Dob,
        Registration_Stage,
        Approval_Requested
    )
values (
        "1234",
        2,
        "john",
        "adriaans",
        0,
        CURDATE(),
        1,
        1
    );

/* CREATE DEFAULT STUDENT REGISTRATION STATUSES */

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
        "1234",
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

/*----   CREATE DEFAULT COURSE CATEGORIES   ----*/

insert into
    Course_Category(
        Moodle_Id,
        Parent_Category_Id,
        Name,
        Description
    )
values (
        1,
        0,
        "Default_Category",
        "First category"
    );

/*----   CREATE DEFAULT COURSE TYPES   ----*/

insert into Course_Type(Name) values("Core");

insert into Course_Type(Name) values("Vocational");

insert into Course_Type(Name) values("Support");

/*----   CREATE DEFAULT REPORT TYPES   ----*/

insert into Report_Type(Name) values("Primary");

insert into Report_Type(Name) values("Pre-primary");

/*----   CREATE DEFAULT PERSONA CATEGORIES   ----*/

insert into Persona_Category(Name) values("Work habits");

insert into Persona_Category(Name) values("Social Development");

insert into Persona_Category(Name) values("Personal Development");

/*----   CREATE DEFAULT PERSONAS   ----*/

insert into
    Persona(Persona_Category_Id, Name)
values (1, "Follows instructions");

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Completes work quickly and neatly"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Participates well in class/group activities"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (1, "Does not disturb others");

insert into
    Persona(Persona_Category_Id, Name)
values (1, "Takes care of materials");

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Stationery supplies sufficient"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Has appropriate books in class"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Homework is done regularly"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (1, "Reading Interest");

insert into
    Persona(Persona_Category_Id, Name)
values (
        1,
        "Poems and orals ready on time"
    );

insert into
    Persona(Persona_Category_Id, Name)
values(1, "Self-motivation");

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Loyal to your school ethos & culture"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Is courteous and gets along well with others"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Is attentive in class and/or activity"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Interest in extracurricular activities e.g. choir, sports etc"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (2, "Exhibits self-control");

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Shows respect for friends (peers)"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Shows respect for authority"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Responds well to correction"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        2,
        "Able to handle peer pressure"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        3,
        "Able to work independently"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        3,
        "Shows interest & growth in Christian teaching"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        3,
        "Shows growth in areas of Christian character"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        3,
        "Creativity & problem-solving abilities"
    );

insert into
    Persona(Persona_Category_Id, Name)
values (
        3,
        "Achieved Star of the Week Award"
    );

insert into
    Persona(Persona_Category_Id, Name)
values(3, "Responsible");

insert into
    Persona(Persona_Category_Id, Name)
values(3, "Self-esteem");

insert into
    Persona(Persona_Category_Id, Name)
values (3, "GENERAL OVERALL PROGRESS");

/*----   CREATE DEFAULT DEVELOPMENT GROUPS   ----*/

insert into
    Development_Group(Name)
values ("PREPARATORY MATHEMATICS");

insert into Development_Group(Name) values("ARTS");

insert into Development_Group(Name) values("PHYSICAL DEVELOPMENT");

insert into
    Development_Group(Name)
values ("INTELLECTUAL DEVELOPMENT");

insert into Development_Group(Name) values("LANGUAGE DEVELOPMENT");

insert into Development_Group(Name) values("ENVIRONMENTAL LEARNING");

insert into
    Development_Group(Name)
values (
        "RELIGIOUS AND MORAL EDUCATION"
    );

/*----   CREATE DEFAULT DEVELOPMENT CATEGORIES   ----*/

insert into
    Development_Category(Group_Id, Name)
values(1, "Number Concept");

insert into
    Development_Category(Group_Id, Name)
values(1, "Problem Solving");

insert into
    Development_Category(Group_Id, Name)
values(1, "Seriation");

insert into
    Development_Category(Group_Id, Name)
values (1, "Spatial Relations");

insert into
    Development_Category(Group_Id, Name)
values(1, "Measurement");

insert into
    Development_Category(Group_Id, Name)
values(1, "Classification");

insert into
    Development_Category(Group_Id, Name)
values(2, "Overview");

insert into
    Development_Category(Group_Id, Name)
values(3, "BODY AWARENESS");

insert into
    Development_Category(Group_Id, Name)
values (3, "GROSS MOTOR DEVELOPMENT");

insert into
    Development_Category(Group_Id, Name)
values (3, "FINE MUSCLE CONTROL");

insert into
    Development_Category(Group_Id, Name)
values (4, "VISUAL PERCEPTION");

insert into
    Development_Category(Group_Id, Name)
values (4, "AUDITORY PERCEPTION");

insert into
    Development_Category(Group_Id, Name)
values (5, "Listening and Responding");

insert into
    Development_Category(Group_Id, Name)
values (5, "Speech and Communication");

insert into
    Development_Category(Group_Id, Name)
values (5, "Preparatory Reading");

insert into
    Development_Category(Group_Id, Name)
values (5, "Incidental Reading");

insert into
    Development_Category(Group_Id, Name)
values (5, "Preparatory Writing");

insert into
    Development_Category(Group_Id, Name)
values(6, "Overview");

insert into
    Development_Category(Group_Id, Name)
values(7, "Overview");

/*----   CREATE DEFAULT DEVELOPMENT ASSESSMENTS   ----*/

insert into
    Development_Assessment(Category_Id, Name)
values (1, "Count mechanically");

insert into
    Development_Assessment(Category_Id, Name)
values (1, "Identify numerals ");

insert into
    Development_Assessment(Category_Id, Name)
values (2, "Problem solving ability");

insert into
    Development_Assessment(Category_Id, Name)
values (
        3,
        "Ordering first and last /smallest to biggest"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        4,
        "Inside - outside, near - far, left + right"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (5, "Days in sequence");

insert into
    Development_Assessment(Category_Id, Name)
values (
        5,
        "Money: recognise 5c, 10c, and 50c"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (6, "Size, thick, thin");

insert into
    Development_Assessment(Category_Id, Name)
values(6, "Shape");

insert into
    Development_Assessment(Category_Id, Name)
values(6, "Colour");

insert into
    Development_Assessment(Category_Id, Name)
values(7, "Visual Art");

insert into
    Development_Assessment(Category_Id, Name)
values(7, "Music");

insert into
    Development_Assessment(Category_Id, Name)
values(7, "Dance");

insert into
    Development_Assessment(Category_Id, Name)
values(7, "Drama");

insert into
    Development_Assessment(Category_Id, Name)
values(7, "Paint brush");

insert into
    Development_Assessment(Category_Id, Name)
values (
        8,
        "Name & recognise body parts"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        8,
        "Drawing a person with body parts"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (8, "Position in space");

insert into
    Development_Assessment(Category_Id, Name)
values (
        8,
        "Cross Body Line (Lateral mid-line crossing)"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        8,
        "Distinguish Left from Right"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Running");

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Skipping");

insert into
    Development_Assessment(Category_Id, Name)
values (
        9,
        "Crawling/rolling activities"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Balancing");

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Hopping");

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Climbing");

insert into
    Development_Assessment(Category_Id, Name)
values (9, "Ball (throw / catch) ");

insert into
    Development_Assessment(Category_Id, Name)
values(9, "Jumping Jacks");

insert into
    Development_Assessment(Category_Id, Name)
values (
        9,
        "Can maintain a sitting position"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        10,
        "Eye Movement: Control of eye muscles"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        10,
        "Finger muscle control: Finger movement"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (10, "Eye-Hand Co-ordination");

insert into
    Development_Assessment(Category_Id, Name)
values (10, "Eye-Foot Co-ordination");

insert into
    Development_Assessment(Category_Id, Name)
values(10, "Movement");

insert into
    Development_Assessment(Category_Id, Name)
values (10, "Pass on beanbag");

insert into
    Development_Assessment(Category_Id, Name)
values(10, "Shoe Laces");

insert into
    Development_Assessment(Category_Id, Name)
values(10, "Scissor grip");

insert into
    Development_Assessment(Category_Id, Name)
values (
        10,
        "Cuts on the lines & right direction"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(10, "Pencil grip");

insert into
    Development_Assessment(Category_Id, Name)
values(10, "Paint brush");

insert into
    Development_Assessment(Category_Id, Name)
values (
        11,
        "Colour recognition: primary colours"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        11,
        "Sort objects: shape, colour, size"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        11,
        "Recognise: circle, square, triangle, rectangle"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (11, "Numeral recognition:");

insert into
    Development_Assessment(Category_Id, Name)
values (11, "Recognition of own name");

insert into
    Development_Assessment(Category_Id, Name)
values (
        12,
        "Can recognise familiar everyday sounds"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        12,
        "Can identify beginning sounds"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (12, "Can identify end sounds");

insert into
    Development_Assessment(Category_Id, Name)
values (
        12,
        "Can breakup words into sounds (slow talk)"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        12,
        "Can repeat sounds and words"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (13, "Repeat clapping pattern");

insert into
    Development_Assessment(Category_Id, Name)
values (13, "Answer questions");

insert into
    Development_Assessment(Category_Id, Name)
values (
        13,
        "Responds to instructions / greetings"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (
        14,
        "Pronunciation is correct and clear"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(14, "Retell a story");

insert into
    Development_Assessment(Category_Id, Name)
values (14, "Rhymes and songs");

insert into
    Development_Assessment(Category_Id, Name)
values (
        14,
        "Formulates sentences correctly"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (14, "Speaks out loudly");

insert into
    Development_Assessment(Category_Id, Name)
values (15, "Match words to pictures");

insert into
    Development_Assessment(Category_Id, Name)
values (15, "Build 12 piece puzzle");

insert into
    Development_Assessment(Category_Id, Name)
values (
        16,
        "Place pictures in the correct sequence"
    );

insert into
    Development_Assessment(Category_Id, Name)
values (17, "Trace patterns on dots");

insert into
    Development_Assessment(Category_Id, Name)
values (
        17,
        "Trace over name from left to right"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(17, "Write name");

insert into
    Development_Assessment(Category_Id, Name)
values (
        18,
        "General information on themes"
    );

insert into
    Development_Assessment(Category_Id, Name)
values(18, "Health");

insert into
    Development_Assessment(Category_Id, Name)
values(18, "Safety");

insert into
    Development_Assessment(Category_Id, Name)
values(18, "Weather");

insert into
    Development_Assessment(Category_Id, Name)
values (18, "Special occasions");

insert into
    Development_Assessment(Category_Id, Name)
values (19, "Morals and Values");

insert into
    Development_Assessment(Category_Id, Name)
values (19, "Social development");

insert into
    Development_Assessment(Category_Id, Name)
values (19, "Emotional development");

/*----   CREATE DEFAULT GRADE FEES VALUES   ----*/

insert into Fees_For_Grade(Grade, Amount) values(0, 1000);

insert into Fees_For_Grade(Grade, Amount) values(1, 2000);

insert into Fees_For_Grade(Grade, Amount) values(2, 2000);

insert into Fees_For_Grade(Grade, Amount) values(3, 2000);

insert into Fees_For_Grade(Grade, Amount) values(4, 2000);

insert into Fees_For_Grade(Grade, Amount) values(5, 2000);

insert into Fees_For_Grade(Grade, Amount) values(6, 2000);

insert into Fees_For_Grade(Grade, Amount) values(7, 2000);

insert into Fees_For_Grade(Grade, Amount) values(8, 2000);

insert into Fees_For_Grade(Grade, Amount) values(9, 2000);

insert into Fees_For_Grade(Grade, Amount) values(10, 2000);

insert into Fees_For_Grade(Grade, Amount) values(11, 2000);

insert into Fees_For_Grade(Grade, Amount) values(12, 2000);