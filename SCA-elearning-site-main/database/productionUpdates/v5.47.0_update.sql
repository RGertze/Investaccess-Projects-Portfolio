/* source ./v5.47.0_update.sql; */

use SCA_DB_DEV;

create table Link( /*----   !!   ----*/
    Link_Path varchar(500) not null,
    Link_Name varchar(200) not null,
    Link_Type int not null,
    Link_Topic_ID int,
    Link_Assignment_Path varchar(500),
    Link_Approved bit not null,
    Link_Marked_For_Deletion bit not null,

    primary key(Link_Path, Link_Type, Link_Topic_ID)
);


delimiter //
create procedure sp_addLink( /*----   !!   ----*/ 
    in linkPath varchar(500),
    in linkName varchar(200),
    in linkType int,
    in linkTopicID int,
    in linkAssignmentPath varchar(500)
)
begin
    if(linkPath not in(select Link_Path from Link where Link_Type=linkType AND Link_Topic_ID=linkTopicID) AND linkPath!='' AND linkName!='') then
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

delimiter //
create procedure sp_deleteLink(/*----   !!   ----*/    
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
create procedure sp_deleteAssignmentLink(/*----   !!   ----*/    
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
/*-------   MARK LINK FOR DELETION         !!!!!!!!!!!!! */
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
/*-------   UNMARK LINK FOR DELETION         !!!!!!!!!!!!! */
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
/*-------   GET ALL LINKS MARKED FOR DELETION    !!!!!!! */
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
/*-------          APPROVE LINK            !!!!!!!!!!!!! */
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
/*-------      GET UNAPPROVED LINKS BY TOPIC   !!!!!!!!! */
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
/*-------      GET ALL UNAPPROVED LINKS        !!!!!!!!! */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getLinksUnapproved(
)
begin
    select Link_Path, Link_Name
    from Link
    where Link_Topic_ID in(select Course_Topic_ID from Course_Topic) AND Link_Approved=0  AND Link_Marked_For_Deletion=0;
end //
delimiter ;



/*-------------------------------------------------------*/
/*-------      GET APPROVED LINKS BY TOPIC     !!!!!!!!! */
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
/*-------      GET LINKS BY TOPIC              !!!!!!!!! */
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
/*-------   GET COURSE ASSIGNMENT LINKS            !!!!! */
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