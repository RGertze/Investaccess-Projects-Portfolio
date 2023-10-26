
# get Model name
echo "Enter Model name: "
read model

# get model plural name
echo "Enter Model plural name: "
read model_plural

dotnet-aspnet-codegenerator razorpage -m $model -dc App.Data.ApplicationDbContext -udl -outDir Pages/$model_plural --referenceScriptLibraries --databaseProvider sqlite

