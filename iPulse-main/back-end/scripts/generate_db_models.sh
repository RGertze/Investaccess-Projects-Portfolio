#   Script to generate IPulse DB Models
#   
#   Removes all cs files in the DB_Models folder
#   Removes IPulseContext.cs file in Helpers folder
#   Generates Models and stores them in DB_Models folder
#   Generates IPulseContext.cs and stores it in Helpers folder
#

cd ..

clear
echo Enter DB username:
read uname
clear
echo Enter DB password:
read pword
clear

conn="server=localhost; port=3306; database=IPulse; user=$uname; password=$pword; Persist Security Info=False; Connect Timeout=300"

echo "Generating IPulse Models..."

echo dotnet-ef dbcontext scaffold --force \"$conn\" Pomelo.EntityFrameworkCore.MySql -o DB_Models | bash

status=$?

if [ $status -eq 0 ] 
then
    echo 'Successfully generated files'

    rm ./Helpers/IPulseContext.cs
    mv ./DB_Models/IPulseContext.cs ./Helpers/
else
    echo 'Failed to generate files'
fi



