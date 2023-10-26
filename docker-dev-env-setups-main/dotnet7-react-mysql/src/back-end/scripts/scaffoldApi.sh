

# get Model name
echo "Enter Model name: "
read model

# get controller name
echo "Enter controller name: "
read controller


dotnet-aspnet-codegenerator controller -m $model -dc App.Data.DBContext -api -async -name $controller --databaseProvider mysql -outDir Controllers

