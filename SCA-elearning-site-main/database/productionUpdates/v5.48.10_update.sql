/* source v5.48.10_update.sql;*/

use SCA_DB_DEV;

drop procedure sp_getAllMaterialUnapproved;
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


drop procedure sp_getLinksUnapproved;
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