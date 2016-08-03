## Hur vi uppnår ett restAPi som klarar av högbelastning.

#Cache

- **Share promises:** Vi skapar en promise för att hämta data från databasen och de olika loaders (musicbrainz, coverart, wikipedia etc). Denna kan delas mellan request:en, vilket gör att om samma MBID efterfrågas så behöver endast ett request ske till musicbrainz oc det andra loaders.
Detta gör också att vi hjälper databasen att klara av hög belastning. 

- **LRU Cache:** Vi skapar en LRU cache för det mest 5000 använda request:en vilket gör att vi får väldigt snabb responstid.

- **Serialized json:** Vi skickar och cache:ar redan serialiserade json. Vilket gör att webservern endast behöver skicka strängar, detta gör att vi får väldigt hög prestanda från webservern, och vi inte överbelastar CPU med serialisering.

- **Swagger validation:** Vi använder oss av swagger vilket kan validera alla request och response, detta kan konfigureras och slås av eller på beroende på belastning.  

## Hur vi hanterar vi Rate limit ifrån externa API:er

- **Throttle:** För varje loader så har vi möjlighet att konfigurera hur många request per second som får skickas, resten köas upp med en timeout.

- **Retry:** För varje loader så har vi möjlighet att konfigurera hur många gånger som den skall försöka hämta resultatet. Efter varje försök så ökar vi tiden den väntar innan den försöka igen. Detta gör att våra svarstider från vårt RestAPI kan vara långa men endast för nya MBID. Tidigare förfrågningar finns sparat i våran mysql. 


## Live Demo

- http://95.85.24.243:10010/artists
- http://95.85.24.243:10010/artists/5eecaf18-02ec-47af-a4f2-7831db373419
- http://95.85.24.243:10010/artists/ff6e677f-91dd-4986-a174-8db0474b1799
- http://95.85.24.243:10010/artists/7249b899-8db8-43e7-9e6e-22f1e736024e
- http://95.85.24.243:10010/artists/5b11f4ce-a62d-471e-81fc-a69a8278c7da
- http://95.85.24.243:10010/artists/e1f1e33e-2e4c-4d43-b91b-7064068d3283

## Installation

#Installera node.js music-server
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

## Bygg docker image för music-server (optional)
Det finns en Dockerfile så man kan bygga en node.js docker image as music-server
**Du behöver ange vilket ip-nummer som du kör mysql på.**

```
docker build -t music-server:latest .
docker run --name app-container -e MYSQL_HOST=172.17.0.1 -p 10010:10010 -d music-server:latest
```

## Kör music-server utan docker
för att starta servern behöver du bara använda dig av npm start.
```
npm start
```

## Konfiguration

Det finns en konfiguration fil sparad config/index.js där inställningar för databas och loaders finns.
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

Jag kör 2 docker conatiner på en väldigt liten server, så båda delar på 512MB minne, vilket inte räcker för en större
databas, men vi kan ändå se att prestandan ligger runt 600 request per second.  

512MBMemory
1 CoreProcessor
20GBSSD Disk
1TBTransfer

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

V1.0
* Validera mbid
* lägg till en konfiguration parameter för antal items i LRU Cache. 
README.md
- Write the installation documentation.
- Write how to use swagger
- Make so you can download docker images.  
* Make "Not Implementated message" on the other request.
* Add benchmark to package.json.

V2.0
* Bättre readme och installations guide.
* Write the artist list
* Bättre deployment
    - En ide är att använda webpack på serversidan så det skapas en bundle.js.
* Alternativt använda en processmanger (StrongLoop).
* Definiera upp “sources” i swagger.

V3.0 - ideer.
* Kunna konfigurera vilka loaders som skall användas
* Kanske använda TypeScript och skapa interface för loaders. 

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

