DROP DATABASE IF EXISTS TestDB;

CREATE DATABASE TestDB;

use TestDB;

CREATE TABLE Category(
    Category_ID int PRIMARY KEY IDENTITY(1,1), 
    Category_Name varchar(20) NOT NULL,
    Category_Description varchar(300),
    Created_At decimal(19,2) NOT NULL
);
CREATE TABLE Item(
    Item_ID int PRIMARY KEY IDENTITY(1,1), 
    Category_ID int NOT NULL,
    Item_Name varchar(20) NOT NULL,
    Item_Description varchar(300),
    Created_At decimal(19,2) NOT NULL,

    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID)
);
