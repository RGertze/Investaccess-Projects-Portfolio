# until the name of the current dir is laravel-vuejs-mysql-dev-env or root is found move up one dir
while [[ $PWD != '/' && ${PWD##*/} != 'laravel-vuejs-mysql-dev-env' ]]; do cd ..; done

# if the name of the current dir is / exit with error
if [[ $PWD == '/' ]]; then
    echo "Error: Could not find laravel-vuejs-mysql-dev-env directory"
    exit 1
fi

echo "In laravel-vuejs-mysql-dev-env directory"

# get id of docker container with name laravel-vuejs-mysql-dev-env-app
containerId=$(docker ps -aqf "name=laravel-vuejs-mysql-dev-env-app")

docker exec -it $containerId bash -c "chmod -R 777 /app"
