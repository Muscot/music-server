export var cache = 
{
    maxSize: 1500 // Number of artists to cache.
};

export var web =
{
    port: process.env.PORT || 10010,
    timeout: 10 * 60 * 1000 // 10 minute
};

export var database = 
{
    connectionLimit: 15,
    host: process.env['MYSQL_HOST'] || '127.0.0.1',
    user: 'www',
    password: 'ADS547TYDFGHER7652LKHS',
    database: 'music',
    debug: false,
    dateStrings: true
};

// I think I got better rate limit with python-musicbrainz/0.7.3 userAgent :-) 
export var musicbrainz = {
        restApi: 'http://musicbrainz.org/ws/2',
        userAgent : 'python-musicbrainz/0.7.3',
        requestsPerSecond: 10, // Up to 10 requests per second
        backOff: 2, // Backoff factor if it fails and make a retry, increase the wait time.
        timeOut: 5 * 60 * 1000, // 5 minutes timeout, include alla retries and wait between request.
        maxTries: 10 // Try 10 times to retrieve the request if it fails. Increase the time with backoff factor.
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
