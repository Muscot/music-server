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
- ** Byt gärna ut www lösenord, och konfigurera sen music-server med lösenordet (se Konfiguration nedan)

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
docker run --restart=always --name app-container -e MYSQL_HOST=192.168.99.100 -p 10010:10010 -d music-server:latest

## Run the mysql docker image
docker run --restart=always --name db-container -e MYSQL_ROOT_PASSWORD=xxx -p 3306:3306 -d mysql/mysql-server:latest

## Publish docker image
docker save music-server:latest | bzip2 | pv | ssh root@95.85.24.243 'bunzip2 | docker load'

