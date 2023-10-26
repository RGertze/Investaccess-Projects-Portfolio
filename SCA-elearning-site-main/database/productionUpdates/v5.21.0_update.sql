/*   source ./database/productionUpdates/v5.21.0_update.sql;   */

use SCA_DB_DEV;

/*-------------------------------------------------------*/
/*-------   CREATE COURSE ASSESSMENT TABLE               */
/*-------------------------------------------------------*/

drop table if exists Student_Assessment_Mark;
drop table if exists Course_Assessment;

create table Course_Assessment(  /*  !!!!  */
    Course_Assessment_ID int primary key auto_increment,
    Course_ID int,
    Course_Assessment_Name varchar(100),
    Course_Assessment_Marks_Available decimal(19,2),
    Course_Assessment_Contribution decimal(19,2),

    foreign key (Course_ID) references Course(Course_ID)
);

/*-------------------------------------------------------*/
/*-------   CREATE STUDENT ASSESSMENT MARK TABLE         */
/*-------------------------------------------------------*/

create table Student_Assessment_Mark(  /*  !!!!  */
    Student_ID int not null,
    Course_Assessment_ID int not null,
    Assessment_Mark decimal(19,2),

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Course_Assessment_ID) references Course_Assessment(Course_Assessment_ID),

    primary key (Student_ID,Course_Assessment_ID)
);

/*-------------------------------------------------------*/
/*-------   ADD COURSE ASSESSMENT PROC                   */
/*-------------------------------------------------------*/

drop procedure sp_addCourseAssessment;
delimiter //
create procedure sp_addCourseAssessment(
    in courseID int,
    in assessmentName varchar(100),
    in marksAvailable decimal(19,2),
    in contributionToTotal decimal(19,2)
)
begin
    if(courseID in(select Course_ID from Course) AND assessmentName!='' AND marksAvailable>0 AND contributionToTotal>0 AND contributionToTotal<101) then

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


/*-------------------------------------------------------*/
/*-------   ADD STUDENT COURSE PROC                      */
/*-------------------------------------------------------*/

drop procedure sp_addStudentCourse;
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


/*-------------------------------------------------------*/
/*-------   ADD STUDENT ASSESSMENT MARK PROC             */
/*-------------------------------------------------------*/

drop procedure sp_addStudentAssessmentMark;
delimiter //
create procedure sp_addStudentAssessmentMark(  /*  !!!!  */
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


/*-------------------------------------------------------*/
/*-------   UPDATE STUDENT ASSESSMENT MARK PROC          */
/*-------------------------------------------------------*/

drop procedure sp_updateStudentAssessmentMark;
delimiter //
create procedure sp_updateStudentAssessmentMark(  /*   !!!!   */
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


/*-------------------------------------------------------*/
/*-------   DELETE COURSE ASSESSMENT                     */
/*-------------------------------------------------------*/

drop procedure sp_deleteCourseAssessment;
delimiter //
create procedure sp_deleteCourseAssessment(  /*    !!!!    */
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


/*-------------------------------------------------------*/
/*-------   GET COURSE ASSESSMENTS               !!!!!!!!!!!!!!!      */
/*-------------------------------------------------------*/

drop procedure sp_getCourseAssessments;
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
/*-------   GET COURSE ASSESSMENT MARKS                  */
/*-------------------------------------------------------*/

drop procedure sp_getAssessmentMarksByCourse;
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









