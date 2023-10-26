use SCA_DB_DEV;

alter table Admin
add column Admin_Resource_Password varchar(100) not null;

update Admin
set Admin_Resource_Password='$2b$10$3FiJ4VfFQzO6key/8G3XhOZHzQYXe4M0AjAMLXorZeT2lywippd92';

drop procedure sp_setAdminResourcePassword;
delimiter //
create procedure sp_setAdminResourcePassword(
    in adminID int,
    in password varchar(100)
)
begin
    
    if(adminID not in(select Admin_ID from Admin)) then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Admin not found';
    end if;

    if(password='') then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Password was empty';
    end if;
    
    update Admin
    set Admin_Resource_Password=password
    where Admin_ID=adminID;
    
end //
delimiter ;

drop procedure sp_getAdminResourcePassword;
delimiter //
create procedure sp_getAdminResourcePassword(
    in adminID int
)
begin
    
    if(adminID not in(select Admin_ID from Admin)) then
        signal SQLSTATE '45000' set MESSAGE_TEXT='Admin not found';
    end if;

    select Admin_Resource_Password as Password from Admin where Admin_ID=adminID;
    
end //
delimiter ;