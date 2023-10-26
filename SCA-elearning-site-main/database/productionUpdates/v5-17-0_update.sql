
use SCA_DB_DEV;

/*-------------------------------------------------------*/
/*--          CREATE HOME FILE TABLE                     */
/*-------------------------------------------------------*/

create table Home_File(
    Home_File_Path varchar(500) primary key,
    Home_File_Name varchar(100) not null,
    Home_File_Section varchar(100) not null
);

/*-------------------------------------------------------*/
/*--          ADD HOME FILE                              */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_addHomeFile(
    in filePath varchar(500),
    in fileName varchar(100),
    in fileSection varchar(100)
)
begin
    if(filePath not in(select Home_File_Path from Home_File) AND filePath!='' AND fileName!='' AND fileSection!='') then
        insert into Home_File(Home_File_Path, Home_File_Name, Home_File_Section)
        values(filePath, fileName, fileSection);

        select 'ok' as RESULT;
    else
        select 'file already exists or one of the fields were empty' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*--          DELETE HOME FILE                           */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_deleteHomeFile(
    in filePath varchar(500)
)
begin
    if(filePath in(select Home_File_Path from Home_File)) then
        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Home_File
        where Home_File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;

/*-------------------------------------------------------*/
/*--          GET HOME FILES BY SECTION                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getHomeFilesBySection(
    in section varchar(100)
)
begin
    select Home_File_Path, Home_File_Name
    from Home_File
    where Home_File_Section=section;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--          CHECK HOME FILE PATH                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_checkHomeFilePath(
    in filePath varchar(500)
)
begin
    if(filePath in(select Home_File_Path from Home_File)) then
        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
    end if;
end //
delimiter ;
