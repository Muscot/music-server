import * as rp from 'request-promise';
import {coverart as config} from '../config';
import {reduce} from 'lodash';
import retry from 'bluebird-retry';
import Promise from 'bluebird';
import PromiseThrottle from 'promise-throttle';
import DebugLib from 'debug';

/**
 * Initilize coverart.
 * ==================================
 */
var debug = DebugLib('coverart');
debug('loaded', config);

var promiseThrottle = new PromiseThrottle({
    requestsPerSecond: config.requestsPerSecond, 
    promiseImplementation: Promise  // the Promise library you are using
});

var retryOptions = 
{
    backoff : config.backOff,
    timeout : config.timeOut,
    max_tries : config.maxTries
};
 
/**
 * retrive the information from coverart. 
 * 
 * @param {array} albums collection
 * @param {integer} current index to download images for.
 */
function _getRequest(album)
{
    debug(`${album.id} Start request`);
    
    var restUrl = `${config.restApi}/release-group/${album.id}`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': config.userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        debug(`${album.id} Got response (${album.title})`);
        album['image'] = json.images[0].image;
        album['thumbnail'] = json.images[0].thumbnails.large;
        return album;
    }).catch((e) =>
    {
        if (e.statusCode != 404)
        {
            debug(`${album.id} Wait and retry (${err.statusCode})`);
            throw e;
        }
 
        debug(`${album.id} No image exist (${album.title})`);
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
    var requests = [];
    for (var index = 0; index < albums.length; index++) {
        let album = albums[index];

        var p = retry(() => {
                return promiseThrottle.add(_getRequest.bind(this, album));
            }, retryOptions);

        requests.push(p);
    }

    return Promise.all(requests).then((result) => 
    {
        var ret = {
            'albums' : result,
            'sources' : {
                'coverart' : {
                    'url' : `${config.restApi}/release-group/`
                }
             }
        };

        return ret;
    });
}