
use SCA_DB_DEV;


/*-----------------------------------*/
/*--        CREATE TABLES            */
/*-----------------------------------*/

create table Resource_Topic(     /*   !!!!   */
    Resource_Topic_ID int primary key auto_increment,
    Resource_Topic_Parent int,
    Course_ID int,
    Visible_To_Students bit not null,
    Resource_Topic_Name varchar(200) not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Resource_File(     /*   !!!!   */
    Resource_File_Path varchar(500) primary key,
    Resource_Topic_ID int not null,
    Resource_File_Name varchar(100) not null,
    Resource_File_Date_Added timestamp not null,

    foreign key (Resource_Topic_ID) references Resource_Topic(Resource_Topic_ID)
);



/*-----------------------------------*/
/*--        ADD PROCS                */
/*-----------------------------------*/

delimiter //
create procedure sp_addRootResourceTopic(     /*   !!!!   */
    in topicName varchar(200),
    in visibleToStudents bit
)
begin
    if(topicName not in(select Resource_Topic_Name from Resource_Topic where Resource_Topic_Parent=null) AND topicName!='') then

        insert into Resource_Topic(Resource_Topic_Parent, Course_ID, Visible_To_Students, Resource_Topic_Name)
        values(null, null, visibleToStudents, topicName);

        select 'ok' as RESULT;
    else
        select 'topic already exists' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addSubResourceTopic(     /*   !!!!   */
    in parentTopicID int,
    in topicName varchar(200),
    in courseID int
)
begin
    if(courseID in(select Course_ID from Course) AND parentTopicID in(select Resource_Topic_ID from Resource_Topic) AND topicName!='') then

        insert into Resource_Topic(Resource_Topic_Parent, Course_ID, Visible_To_Students, Resource_Topic_Name)
        values(parentTopicID, courseID, 1, topicName);

        select 'ok' as RESULT;
    else
        select 'parent topic not found, course not found, or topic name is empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addResourceFile(     /*   !!!!   */
    in topicID int,
    in filePath varchar(500),
    in fileName varchar(100)
)
begin
    if(topicID in(select Resource_Topic_ID from Resource_Topic) AND fileName!='' AND filePath!='') then

        insert into Resource_File(Resource_File_Path, Resource_Topic_ID, Resource_File_Name, Resource_File_Date_Added)
        values(filePath, topicID, fileName, current_timestamp());

        select 'ok' as RESULT;
    else
        select 'topic does not exist, or one of the fields was empty' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET ROOT RESOURCE_TOPICS FOR STAFF             !!!!!   */
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
/*--      GET ROOT RESOURCE_TOPICS FOR STUDENTS          !!!!!   */
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
/*--      GET SUB RESOURCE_TOPICS FOR STAFF              !!!!!   */
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
    ) AND Resource_Topic_Parent = parentTopicID;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET SUB RESOURCE_TOPICS FOR STUDENTS              !!!!!   */
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
/*--      GET RESOURCE FILES BY TOPIC                   !!!!!   */
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



