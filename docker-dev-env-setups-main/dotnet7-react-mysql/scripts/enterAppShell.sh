
# go to root directory of project
while [[ $PWD != '/' && ${PWD##*/} != 'dotnet7-react-mysql' ]]; do cd ..; done

# if the name of the current dir is / exit with error
if [[ $PWD == '/' ]]; then
    echo "Error: Could not find root directory"
    exit 1
fi

dockerContainerName="dotnet7-react-mysql-app-1"


echo "Entering shell of docker container with name $dockerContainerName"


# get id of docker container with name laravel-vuejs-mysql-dev-env-app
containerId=$(docker ps -aqf "name=$dockerContainerName")

# enter shell of docker container with id $containerId using bash
docker exec -it $containerId bash