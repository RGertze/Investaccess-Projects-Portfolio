# get current dir 

currDir=$(basename "$PWD")

# navigate to front-end dir

if [ "$currDir" = "scripts" ] || [ "$currDir" = ".github" ] || [ "$currDir" = ".vscode"] || [ "$currDir" = "back-end"] || [ "$currDir" = "back-end-tests"] || [ "$currDir" = "database"];
then
    cd ../front-end/

elif [ -d "./front-end/" ]
then
    cd ./front-end/

else
    echo dir not found
    exit 2
fi

# install dependencies
npm install

# build
npm run build

# exit if build failed
status=$?       # get return status
if [ $status != 0 ]    # 0 == success
then
    echo 'Build failed'
    exit 2
fi

# remove dist dir in back-end
rm -rf ../back-end/dist

# move new build dir to back-end as dist
mv ./build ../back-end/dist

