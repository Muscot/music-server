## Hur vi uppnår ett restAPi som klarar av högbelastning.

#Cache

- **Share promises:** Vi skapar en promise för att hämta data från databasen och de olika loaders (musicbrainz, coverart, wikipedia etc). Denna kan delas mellan request vilket gör att om samma MBID efterfrågas så behöver endast ett request ske till musicbrainz.
detta gör också att vi hjälper databasen att klara av hög belastning. 

- **LRU Cache:** Vi skapar en LRU cache för det mest 5000 använda requesten vilket gör att vi får väldigt snabb responstid.

- **Serialized json:** Vi skickar och cache:ar redan serialiserade json, vilket gör att webservern endast behöver skicka strängar, detta gör att vi får väldigt hög prestande från webservern, och vi inte överbelastar CPU med serialisering.

- **Swagger validation:** Vi använder oss av swagger vilket kan validera alla request och responses, detta kan configureras slås på och av beroende på belastning.  

## Hur vi hanterar vi ratelimit från externa API:er

- **Throttle:** För varje loader så har vi möjlighet att konfigurera hur många request per second som får skickas, resten köas upp med en timeout.

- **Retry:** För varje loader så har vi möjlighet att konfigurera hur många gånger som den skall försöka hämta resultatet, efter varje försök så ökar vi tiden den väntar innan den försöka igen, detta gör att våra svarstider från vårat RestAPI kan vara långa men edast för nya förfrågningar. Tidigare förfrågningar finns sparat i våran mysql. 

## Installation

#Installera node.js server
```

git clone https://github.com/Muscot/music-server.git music-server
cd music-server
npm install
npm run build

```

#Installera mysql docker

- ** Välj ett root lösenord och byt ut xxx nedan**, vi lägger sen till en www användare i databasen.
- Vi använder mysql 5.7 som har native stöd för att lagra JSON. 

```
docker run --restart=always --name db-container -e MYSQL_ROOT_PASSWORD=xxx -p 3306:3306 -d mysql/mysql-server:latest

```

- Kör sql script finns även sparat under /database/script.sql
- ** Byt gärna ut www lösenord**, och konfigurera sen music-server med lösenordet (se Konfiguration nedan)
- ** Byt gärna ut 'www'@'%' mot 'www'@'192.168.10.190'** I production skall endast ip nummer från webservern vara tillåten att koppla upp sig mot databasen.

```
DROP TABLE IF EXISTS `artist`;

CREATE TABLE `artist` (
  `artist_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mbid` char(36) NOT NULL,
  `json` json NOT NULL,
  `created_by` int(11) unsigned DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`artist_id`),
  UNIQUE KEY `mbid` (`mbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE USER 'www'@'%' IDENTIFIED BY 'ADS547TYDFGHER7652LKHS';
GRANT ALL PRIVILEGES ON music . * TO 'www'@'%';
FLUSH PRIVILEGES;
```


## Konfiguration

Det finns en konfiguration fil sparad config/index.js där instaällningar för databas och loaders finns.
på TODO listan finns att skapa en varsin konfigurations fil för development och production.

```
export var database = 
{
    connectionLimit: 15,
    host: process.env['MYSQL_HOST'] || '192.168.99.100',
    user: 'www',
    password: 'ADS547TYDFGHER7652LKHS',
    database: 'music',
    debug: false,
    dateStrings: true
};

export var musicbrainz = {
        restApi: 'http://musicbrainz.org/ws/2',
        userAgent : 'python-musicbrainz/0.7.3',
        requestsPerSecond: 10, // Up to 10 requests per second
        backOff: 2, // backoff factor if it fails and make a retry, increase the wait time.
        timeOut: 5 * 60 * 1000, // 5 minutes timeout, include alla retries and wait between request.
        maxTries: 10 // try 10 times to retrieve the request if it fails. Increase the time with backoff factor.
    };

export var coverart = {
        restApi: 'http://coverartarchive.org',
        userAgent : 'python-musicbrainz/0.7.3',
        requestsPerSecond: 20, 
        backoff: 2,
        timeout: 5 * 60 * 1000, 
        numberOfTries: 10 
    };

export var wikipedia = {
        restApi: 'https://en.wikipedia.org/w/api.php',
        userAgent : 'Amivono/0.0.1 ( martin@amivono.com )',
        requestsPerSecond: 50, 
        backoff: 2,
        timeout: 5 * 60 * 1000, 
        numberOfTries: 10
    };
```

# Benchmark

Running two docker conatiner on a very small server. 

```
root@docker-music-server:~# ab -n10000 -c100 http://95.85.24.243:10010/artists/5b11f4ce-a62d-471e-81fc-a69a8278c7da
This is ApacheBench, Version 2.3 <$Revision: 1528965 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 95.85.24.243 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        
Server Hostname:        95.85.24.243
Server Port:            10010

Document Path:          /artists/5b11f4ce-a62d-471e-81fc-a69a8278c7da
Document Length:        9077 bytes

Concurrency Level:      100
Time taken for tests:   16.090 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      93150000 bytes
HTML transferred:       90770000 bytes
Requests per second:    621.51 [#/sec] (mean)
Time per request:       160.897 [ms] (mean)
Time per request:       1.609 [ms] (mean, across all concurrent requests)
Transfer rate:          5653.72 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.9      0      33
Processing:    66  160  49.8    139     375
Waiting:       66  160  49.7    138     374
Total:         98  160  50.0    139     385

Percentage of the requests served within a certain time (ms)
  50%    139
  66%    152
  75%    167
  80%    195
  90%    252
  95%    275
  98%    294
  99%    308
 100%    385 (longest request)
```




# TODO

* Add benchmark to package.json
* Write the installation documentation.
* Make the Docker container for nodejs
* Tryit on DO.
* Make Not Implementated message on the other request.
* Bättre deployment
    - En ide är att använda webpack på serversidan så det skapas en bundle.js.
* Alternativt använda en processmanger (StrongLoop) 

V2.0
* Write the artist list


# DOCKER HELPER

## Build the image
docker build -t music-server:latest .

## Run the image
docker run --name app-container -e MYSQL_HOST=172.17.0.1 -p 10010:10010 -d music-server:latest
--restart=always

## Run the mysql docker image
docker run --restart=always --name db-container -e MYSQL_ROOT_PASSWORD=xxx -p 3306:3306 -d mysql/mysql-server:latest

## Publish docker image
docker save music-server:latest | bzip2 | pv | ssh root@95.85.24.243 'bunzip2 | docker load'

