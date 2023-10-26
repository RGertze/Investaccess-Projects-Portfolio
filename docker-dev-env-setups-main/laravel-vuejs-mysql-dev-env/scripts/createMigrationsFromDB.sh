# get id of docker container with name laravel-vuejs-mysql-dev-env-app
containerId=$(docker ps -aqf "name=laravel-vuejs-mysql-dev-env-app")

# run unit tests
docker exec -it $containerId bash -c "cd ./back-end && rm -rf ./database/migrations/* && php artisan migrate:generate --squash"
