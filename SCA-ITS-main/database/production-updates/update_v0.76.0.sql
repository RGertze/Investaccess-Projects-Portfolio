using SCA_ITS;

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

DROP TABLE Development_Assessment_Grade;

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