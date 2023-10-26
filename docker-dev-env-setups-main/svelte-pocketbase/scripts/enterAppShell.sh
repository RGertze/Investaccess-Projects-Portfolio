
# go to root directory of project
while [[ $PWD != '/' && ${PWD##*/} != 'svelte-pocketbase' ]]; do cd ..; done

# if the name of the current dir is / exit with error
if [[ $PWD == '/' ]]; then
    echo "Error: Could not find svelte-pocketbase directory"
    exit 1
fi

dockerContainerName="svelte-pocketbase-app-1"

if [[ $1 == "--p" ]]; then
    dockerContainerName="svelte-pocketbase-pocketbase-1"
fi


echo "Entering shell of docker container with name $dockerContainerName"


# get id of docker container with name laravel-vuejs-mysql-dev-env-app
containerId=$(docker ps -aqf "name=$dockerContainerName")

# enter shell of docker container with id $containerId using bash
docker exec -it $containerId bash