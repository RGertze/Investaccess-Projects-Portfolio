currDir=$(basename "$PWD")

if [ -d "./moodle-plugins/" ]
then
    cd ./moodle-plugins/
else
    cd ..
    if [ -d "./moodle-plugins/" ]
    then
        cd ./moodle-plugins/
    else
        echo dir not found
        exit 2
    fi
fi

ID=$(docker ps -qf "name=moodle-app")
docker exec -it $ID sh -c "rm -rf /bitnami/moodle/local/sca_its*"

find . -type d -name "sca_its*" -exec docker cp {} $ID:/bitnami/moodle/local/ \;