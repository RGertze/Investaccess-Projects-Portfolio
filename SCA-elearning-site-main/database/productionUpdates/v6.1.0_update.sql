/* source v6.1.0_update.sql;*/

use SCA_DB_DEV;

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