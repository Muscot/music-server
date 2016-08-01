
import * as rp from 'request-promise';

var PromiseThrottle = require('promise-throttle');
var Promise = require('bluebird');
var retry = require('bluebird-retry');

var promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 10,          // up to 10 requests per second
    promiseImplementation: Promise  // the Promise library you are using
});

var restApi = 'http://coverartarchive.org';
var userAgent = 'Amivono/0.0.1 ( martin@amivono.com )';
 
/**
 * retrive the information from coverart. 
 * 
 * @param {array} albums collection
 * @param {integer} current index to download images for.
 */
function _getRequest(album)
{
    var restUrl = `${restApi}/release-group/${album.id}`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        console.log("coverart: 200");
        album['image'] = json.images[0].image;
        album['thumbnail'] = json.images[0].thumbnails.large;
        return album;
    }).catch((e) =>
    {
        console.log("coverart:", e.statusCode);
        if (e.statusCode != 404)
            throw e;
 
        return album;
   });
}

/**
 * Get information from coverart this will be added to the structure of our API see swagger
 * defination of Artist.
 * 
 * @export
 * @param {string} albums, an array of albums that include the coverart id.
 * @returns
 */
export function get(albums)
{
    var options = 
    {
        backoff : 2,
        timeout : 10 * 60 * 1000, // 10 minute timeout for all request;
        max_tries : 10
    };

    var requests = [];
    for (var index = 0; index < albums.length; index++) {
        let album = albums[index];

        var p = retry(() => {
                return promiseThrottle.add(_getRequest.bind(this, album));
            }, options);

        requests.push(p);
    }

    return Promise.all(requests).then((result) => 
    {
        var ret = {
            'albums' : result,
            'sources' : {
                'coverart' : {
                    'url' : `${restApi}/release-group/`
                }
             }
        };

        return ret;
    });
}