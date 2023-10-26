currDir=$(basename "$PWD")

if [ -d "./back-end/" ]
then
    cd ./back-end/
else
    cd ..
    if [ -d "./back-end/" ]
    then
        cd ./back-end/
    else
        echo dir not found
        exit 2
    fi
fi

rm -rf ./bin
dotnet publish --self-contained true -r linux-x64

rm -rf ../docker-env/publish
cp -r ./bin/Debug/net6.0/linux-x64/publish ../docker-env

cd ../docker-env
docker-compose down
docker-compose build
docker-compose up -d
