
/*   source ./database/productionUpdates/v5.18.0_update.sql;   */


use SCA_DB_DEV;


/*-------------------------------------------------------*/
/*--        COURSE STAFF TABLE                           */
/*-------------------------------------------------------*/

create table Course_Staff(
    Course_ID int not null,
    Staff_ID int not null,

    foreign key (Staff_ID) references Staff(Staff_ID),
    foreign key (Course_ID) references Course(Course_ID)
);



/*-------------------------------------------------------*/
/*--     ADD CURRENT STAFF TO COURSE STAFF TABLE         */
/*-------------------------------------------------------*/

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
/*--            ADD COURSE                               */
/*-------------------------------------------------------*/

drop procedure sp_addCourse;
delimiter //
create procedure sp_addCourse(
    in staffID int,
    in courseName varchar(50),
    in courseDesc varchar(100),
    in courseGrade int
)
begin
    if ((staffID in(select Staff_ID from Staff)) AND courseName != '' AND courseDesc != '' AND (courseGrade >= 0 AND courseGrade < 8)) then

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



/*-------------------------------------------------------*/
/*--            ADD COURSE STAFF                         */
/*-------------------------------------------------------*/

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



/*-------------------------------------------------------*/
/*--            DELETE COURSE                            */
/*-------------------------------------------------------*/

drop procedure sp_deleteCourse;
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



/*-------------------------------------------------------*/
/*-------   GET COURSES TAUGHT BY STAFF                  */
/*-------------------------------------------------------*/

drop procedure sp_getCoursesTaughtByStaff;
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

drop procedure sp_getCoursesTaughtByStaffDetailed;
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

drop procedure sp_removeCourseTaught;
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

drop procedure sp_getOtherCourseStaff;
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



