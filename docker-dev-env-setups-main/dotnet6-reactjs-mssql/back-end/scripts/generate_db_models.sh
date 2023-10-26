cd ..

conn="Server=localhost; Database=TestDB; User=sa; Password=BCity@123; TrustServerCertificate=True;"

echo "Generating Models..."

echo dotnet-ef dbcontext scaffold --force \"$conn\" Microsoft.EntityFrameworkCore.SqlServer -o DB_Models --data-annotations | bash

status=$?       # get return status




