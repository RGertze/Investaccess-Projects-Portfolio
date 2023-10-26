
# go to root directory of project
while [[ $PWD != '/' && ${PWD##*/} != 'nextjs-mongodb' ]]; do cd ..; done

# if the name of the current dir is / exit with error
if [[ $PWD == '/' ]]; then
    echo "Error: Could not find nextjs-mongodb directory"
    exit 1
fi

dockerContainerName="nextjs-mongodb-app-1"

# check if --a is passed as argument
if [[ $1 == "--a" ]]; then
    dockerContainerName="nextjs-mongodb-admin-app-1"
fi


echo "Entering shell of docker container with name $dockerContainerName"


# get id of docker container with name laravel-vuejs-mysql-dev-env-app
containerId=$(docker ps -aqf "name=$dockerContainerName")

# enter shell of docker container with id $containerId using bash
docker exec -it $containerId bash