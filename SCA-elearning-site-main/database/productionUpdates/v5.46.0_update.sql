/*source ./v5.46.0_update.sql;*/
use SCA_DB_DEV; 

delimiter //
create procedure sp_deleteTermsAndConditionsFile( /*----   !!   ----*/    
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