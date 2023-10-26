
/*  
    Execute file:

    1. cd to dir where file is located.
    2. run command --->  cat db_setup.sql | mysql -u {uname} -p{pw}
       Where {uname} = your username 
       and {pw} = your password 
*/

DROP DATABASE IF EXISTS IPulse;

CREATE DATABASE IF NOT EXISTS IPulse;

USE IPulse;

/*----   USER TABLE DEFINITIONS   ----*/

CREATE TABLE CITY(
    Name PRIMARY KEY
);

CREATE TABLE GENDER(
    Name PRIMARY KEY
);

CREATE TABLE User_Type(
    User_Type_Id INT PRIMARY KEY AUTO_INCREMENT,
    User_Type_Name VARCHAR(100) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

CREATE TABLE User_Account(
    User_Id INT PRIMARY KEY AUTO_INCREMENT,
    User_Type_Id INT NOT NULL,

    Email VARCHAR(100) NOT NULL,
    _Password VARCHAR(100) NOT NULL,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Profile_Pic_Path VARCHAR(500),

    Confirmation_Code VARCHAR(40) NOT NULL,
    IsConfirmed bit not null,
    isActive bit not null,

    Refresh_Token VARCHAR(100),

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (User_Type_Id) REFERENCES User_Type(User_Type_Id)
);

CREATE TABLE Password_Reset_Attempt(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    User_Id INT NOT NULL,

    Confirmation_Code VARCHAR(50) NOT NULL,
    IP_Address VARCHAR(100) NOT NULL,
    Expires TIMESTAMP NOT NULL,

    Confirmed BIT NOT NULL DEFAULT 0,
    Used BIT NOT NULL DEFAULT 0,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);


/*----   DOCTOR TABLE DEFINITIONS   ----*/

CREATE TABLE Doctor_Specialty(
    Specialty_Id INT PRIMARY KEY AUTO_INCREMENT,
    Specialty_Name VARCHAR(100) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

CREATE TABLE Doctor_Profile(
    User_Id INT PRIMARY KEY,
    Specialty_Id INT NOT NULL,

    Nationality VARCHAR(100),
    Practice_Number VARCHAR(100),

    Practice_Name VARCHAR(100),
    Practice_Address VARCHAR(100),
    Practice_City VARCHAR(100),
    Practice_Country VARCHAR(100),
    Practice_Web_Address VARCHAR(200),
    Business_Hours VARCHAR(100),
    Appointment_Price DECIMAL(19,2),

    Secondary_Cellphone VARCHAR(16),
    Secondary_Email VARCHAR(100),

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (User_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Specialty_Id) REFERENCES Doctor_Specialty(Specialty_Id)

);

CREATE TABLE Doctor_Education(
    Doctor_Education_Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Id INT NOT NULL,

    Institute_Name VARCHAR(100) NOT NULL,
    Qualification_Name VARCHAR(100) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE
);

CREATE TABLE Doctor_Work_History(
    Doctor_Work_History_Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Id INT NOT NULL,

    Company_Name VARCHAR(100) NOT NULL,
    Start_Date DATE NOT NULL, 
    End_Date DATE NOT NULL, 
    Role VARCHAR(100) NOT NULL,
    Duties VARCHAR(800) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE
);

CREATE TABLE Doctor_Service_Type(
    Doctor_Service_Type_Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Service_Type_Name VARCHAR(100) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

CREATE TABLE Doctor_Service(
    Doctor_Id INT NOT NULL,
    Doctor_Service_Type_Id INT NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_Service_Type_Id) REFERENCES Doctor_Service_Type(Doctor_Service_Type_Id) ON DELETE CASCADE,

    PRIMARY KEY (Doctor_Id, Doctor_Service_Type_Id)
);

CREATE TABLE Receptionist(
    User_Id INT NOT NULL,
    Doctor_Id INT NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (User_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,

    PRIMARY KEY (User_Id, Doctor_Id)
);

/*----   MEDICAL AID TABLE DEFINITIONS   ----*/

CREATE TABLE Medical_Aid_Scheme(
    Medical_Aid_Scheme_Id INT PRIMARY KEY AUTO_INCREMENT,
    Medical_Aid_Scheme_Name VARCHAR(100) NOT NULL, 

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);


/*----   PATIENT TABLE DEFINITIONS   ----*/

CREATE TABLE Blood_Type(
    Blood_Type_Id INT PRIMARY KEY AUTO_INCREMENT,
    Blood_Type_Name VARCHAR(100)
);

CREATE TABLE Gender(
    Gender_Id INT PRIMARY KEY AUTO_INCREMENT,
    Gender_Name VARCHAR(100)
);

CREATE TABLE Patient_Profile(
    User_Id INT NOT NULL,
    Medical_Aid_Scheme_Id INT NOT NULL,

    ID_Number VARCHAR(11) NOT NULL,
    Member_Number VARCHAR(50),
    Nationality VARCHAR(100),
    Residential_Address VARCHAR(300),
    Postal_Address VARCHAR(200),

    Age INT,
    Gender_Id INT,
    Blood_Type_Id INT,

    Secondary_Cellphone VARCHAR(16),

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (User_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Medical_Aid_Scheme_Id) REFERENCES Medical_Aid_Scheme(Medical_Aid_Scheme_Id),
    FOREIGN KEY (Gender_Id) REFERENCES Gender(Gender_Id),
    FOREIGN KEY (Blood_Type_Id) REFERENCES Blood_Type(Blood_Type_Id),

    PRIMARY KEY (User_Id)
);

CREATE TABLE Patient_Next_Of_Kin(
    Patient_Next_Of_Kin_Id INT PRIMARY KEY AUTO_INCREMENT,
    Patient_Id INT NOT NULL,

    Full_Name VARCHAR(200),
    Cellphone VARCHAR(16),
    Email VARCHAR(100),
    Residential_Address VARCHAR(300),
    Relationship VARCHAR(100),

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE
);

CREATE TABLE General_Health_Summary(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Id INT NOT NULL,
    Patient_Id INT NOT NULL,

    Content JSON,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE
);

/*----   DOCTOR REVIEW TABLES   ----*/
CREATE TABLE Doctor_Review(
    Review_Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Id INT NOT NULL,
    Patient_Id INT NOT NULL,

    Comment VARCHAR(1000),
    Rating DECIMAL(5,2),
    Review_Date DATETIME DEFAULT NOW(),
    
    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE
);

/*----   APPOINTMENT TABLE DEFINITIONS   ----*/

CREATE TABLE Appointment_Slot(
    Slot_Id INT PRIMARY KEY AUTO_INCREMENT,
    Doctor_Id INT NOT NULL,
    Slot_Day INT NOT NULL,
    Start_Time TIME NOT NULL,
    End_Time TIME NOT NULL,

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE
);

CREATE TABLE Appointment(
    Appointment_Id INT PRIMARY KEY AUTO_INCREMENT,
    Slot_Id INT NOT NULL,
    Patient_Id INT NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Description VARCHAR(500),
    Date_Of DATE NOT NULL,
    Status INT NOT NULL,

    Confirmation_Code VARCHAR(40) NOT NULL,

    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Slot_Id) REFERENCES Appointment_Slot(Slot_Id) ON DELETE CASCADE

);


/*----   DOCTOR PATIENT TABLE DEFINITIONS   ----*/

CREATE TABLE Patient_Profile_Access(
    Doctor_Id INT NOT NULL,
    Patient_Id INT NOT NULL,
    Status INT NOT NULL,

    Approval_Code VARCHAR(40) NOT NULL,

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE,

    PRIMARY KEY (Doctor_Id, Patient_Id)
);

CREATE TABLE Patient_Doctor_Type(
    Type_Id INT PRIMARY KEY AUTO_INCREMENT,
    Type_Name VARCHAR(100) NOT NULL,

    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

CREATE TABLE Patient_Doctor(
    Patient_Id INT NOT NULL,
    Doctor_Id INT NOT NULL,
    Type_Id INT NOT NULL,

    Status INT NOT NULL,
    Approval_Code VARCHAR(60) NOT NULL,
    
    Created_By INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (Doctor_Id) REFERENCES Doctor_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Patient_Id) REFERENCES Patient_Profile(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Type_Id) REFERENCES Patient_Doctor_Type(Type_Id),

    PRIMARY KEY (Patient_Id, Doctor_Id)
);


/*----   CHAT TABLE DEFINITIONS   ----*/

CREATE TABLE Direct_Message(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    From_Id INT NOT NULL,
    To_Id INT NOT NULL,

    Date_Sent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    Seen BIT NOT NULL DEFAULT 0,

    Content VARCHAR(1000) NOT NULL,

    Created_By INT,
    Updated_By INT,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),

    FOREIGN KEY (From_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (To_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE
);


/*----   NOTIFICATION TABLE DEFINITIONS   ----*/

CREATE TABLE Notification_Type(
    Type_Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL
);

CREATE TABLE Notification(
    Notification_Id INT PRIMARY KEY AUTO_INCREMENT,
    Type_Id INT NOT NULL,
    User_Id INT NOT NULL,
    Date_Sent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    Seen BIT NOT NULL DEFAULT 0,
    Content JSON NOT NULL,
    
    FOREIGN KEY (Type_Id) REFERENCES Notification_Type(Type_Id) ON DELETE CASCADE,
    FOREIGN KEY (User_Id) REFERENCES User_Account(User_Id) ON DELETE CASCADE
);




/*---------------------- END OF TABLE DEFINITIONS ----------------------*/




/*--- CREATE USER TYPES ---*/

insert into User_Type(User_Type_Name) values('Admin');
insert into User_Type(User_Type_Name) values('Doctor');
insert into User_Type(User_Type_Name) values('Patient');
insert into User_Type(User_Type_Name) values('Receptionist');

/*--- CREATE DEFAULT ADMIN USER ---*/

insert into User_Account(
    User_Id,
    User_Type_Id,
    Email,
    _Password,
    First_Name,
    Last_Name,
    Profile_Pic_Path,
    Confirmation_Code,
    IsConfirmed,
    isActive
)
values(
    1,
    1,
    'admin@gmail.com',
    'pw',
    'admin',
    'administrator',
    '',
    '101',
    1,
    1
);

/*--- CREATE DEFAULT SPECIALTIES ---*/

insert into Doctor_Specialty(Specialty_Name) values('None');
insert into Doctor_Specialty(Specialty_Name) values('Oncologist');
insert into Doctor_Specialty(Specialty_Name) values('Pediatrician');

/*--- CREATE DEFAULT MEDICAL AID SCHEMES ---*/

insert into Medical_Aid_Scheme(Medical_Aid_Scheme_Name) values('Private');
insert into Medical_Aid_Scheme(Medical_Aid_Scheme_Name) values('NHP');

/*--- CREATE DEFAULT GENDERS ---*/

insert into Gender(Gender_Name) values('Male');
insert into Gender(Gender_Name) values('Female');
insert into Gender(Gender_Name) values('Other');

/*--- CREATE DEFAULT BLOOD TYPES ---*/

insert into Blood_Type(Blood_Type_Name) values('A');
insert into Blood_Type(Blood_Type_Name) values('B');
insert into Blood_Type(Blood_Type_Name) values('O');

/*--- CREATE PATIENT DOCTOR TYPES ---*/

insert into Patient_Doctor_Type(Type_Name) values('Family');
insert into Patient_Doctor_Type(Type_Name) values('Pediatrician');
insert into Patient_Doctor_Type(Type_Name) values('OB-GYN');

/*--- CREATE DEFAULT DOCTORS ---*/
insert into User_Account(
    User_Type_Id,
    Email,
    _Password,
    First_Name,
    Last_Name,
    Profile_Pic_Path,
    Confirmation_Code,
    IsConfirmed,
    isActive
)
values(
    2,
    'doc@gmail.com',
    'pw',
    'doctor',
    'proctor',
    '',
    '101',
    1,
    1
); 
insert into Doctor_Profile(
    User_Id,
    Specialty_Id,
    Nationality,
    Practice_Number,
    Practice_Name
)
values(
    2,
    2,
    'Namibian',
    '2002',
    'Legitimate Doctor Inc'
);

/*--- CREATE DEFAULT PATIENTS ---*/
insert into User_Account(
    User_Type_Id,
    Email,
    _Password,
    First_Name,
    Last_Name,
    Profile_Pic_Path,
    Confirmation_Code,
    IsConfirmed,
    isActive
)
values(
    3,
    'patient@gmail.com',
    'pw',
    'Unhealthy',
    'Patient',
    '',
    '101',
    1,
    1
); 
insert into Patient_Profile(
    User_Id,
    Medical_Aid_Scheme_Id,
    ID_Number,
    Member_Number
)
values(
    3,
    2,
    '11111111111',
    '2002'
);

/*--- CREATE DEFAULT NOTIFICATION TYPES ---*/

insert into Notification_Type(Name) values('Message');
insert into Notification_Type(Name) values('Appointment');
insert into Notification_Type(Name) values('Profile Access');