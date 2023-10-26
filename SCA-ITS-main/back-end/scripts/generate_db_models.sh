#   Script to generate IPulse DB Models
#   
#   Removes all cs files in the DB_Models folder
#   Removes IPulseContext.cs file in Helpers folder
#   Generates Models and stores them in DB_Models folder
#   Generates SCA_ITSContext.cs and stores it in Helpers folder
#

cd ..

clear
echo Enter DB username:
read uname
clear
echo Enter DB password:
read pword
clear

conn="server=localhost; port=3307; database=SCA_ITS; user=$uname; password=$pword; Persist Security Info=False; Connect Timeout=300"

echo "Generating Models..."

echo dotnet-ef dbcontext scaffold --force \"$conn\" Pomelo.EntityFrameworkCore.MySql -o DB_Models | bash

status=$?       # get return status

if [ $status -eq 0 ]    # 0 == success
then
    echo 'Successfully generated files'

    rm ./Helpers/SCA_ITSContext.cs
    mv ./DB_Models/SCA_ITSContext.cs ./Helpers/
else
    echo 'Failed to generate files'
fi



