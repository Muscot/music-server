# TODO

* Add the config file.
* Add the throttle on wikipedia.
* Add benchmark to package.json
* Write the installation documentation.
* Make the Docker container for nodejs
* Tryit on DO.
* Make Not Implementated message on the other request.

V2.0
* Write the artist list


# DOCKER

## Build the image
docker build -t music-server:latest .

## Run the image
docker run --restart=always --name app-container -e MYSQL_HOST=192.168.99.100 -p 10010:10010 -d music-server:latest

## Run the mysql docker image
docker run --restart=always --name db-container -e MYSQL_ROOT_PASSWORD=ferdnand -p 3306:3306 -d mysql/mysql-server:latest

## Publish docker image
docker save music-server:latest | bzip2 | pv | ssh root@95.85.24.243 'bunzip2 | docker load'

## Upload
tar cpf - cygni | ssh root@95.85.24.243 "tar xpf - -C /root/cygni"

## Download
tar cpf - /some/important/data | ssh user@destination-machine "tar xpf - -C /some/directory/"


# INSTALLATION

1.

