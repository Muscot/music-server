import * as rp from 'request-promise';
import {musicbrainz as config} from '../config';
import {reduce} from 'lodash';
import retry from 'bluebird-retry';
import Promise from 'bluebird';
import PromiseThrottle from 'promise-throttle';
import DebugLib from 'debug';

/**
 * Initilize musicbrainz.
 * ==================================
 */
var debug = DebugLib('musicbrainz');
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
 * Define the errors for musicbrainz.
 * ==================================
 */

/**
 * If throttle and retry do not succed to retrieve the request, fire this error. $
 * default configuration for musicbrainz is 1 request/sec and 10 retries. 
 * @export
 * @param {any} message
 */
export function RateLimitError(message) {
    this.name = "RateLimitError";
    this.statusCode = 503;
    this.message = (message || "");
}
RateLimitError.prototype = Object.create(Error.prototype);


/**
 * Get all the musicbrainz relations with relation type as keys.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getRelations(json)
{
    return reduce(json['relations'], (result, value, key) => {
        result[value.type] = value;
        return result;
    }, {});
}

/**
 * Get all the albums.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getAlbums(json)
{
    var albums = reduce(json['release-groups'], (result, value, key) => {
        if (value['primary-type'] == 'Album')
        {
            result.push({
                'id': value['id'],
                'title': value['title'],
                'first-release-date': value['first-release-date']
            });
        }

        return result;
    }, []);

    //Sort the albums by release dates.
    return albums.sort((a, b) => 
    {
        if (a['first-release-date'] < b['first-release-date'])
            return -1;
        if (a['first-release-date'] > b['first-release-date'])
            return 1;

        return 0;
    });
}

function _getRequest(mbid)
{
    debug(`${mbid} Start request`);
    var restUrl = `${config.restApi}/artist/${mbid}?&fmt=json&inc=url-rels+release-groups`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': config.userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        debug(`${mbid} Got response (${json.name})`);
 
        var ret = {
            mbid : json.id,
            albums : _getAlbums(json),
            sources : {
                'musicbrainz' : {
                    'id' : json.id,
                    'url' : restUrl
                }
            } 
        };

        // add wikipedia if it exists;
        var relations = _getRelations(json);
        if (relations.wikipedia && relations.wikipedia.url)
            ret.sources.musicbrainz['wikipedia'] = relations.wikipedia.url.resource;

        return ret;
    }).catch((err) => {
        debug(`${mbid} Wait and retry (${err.statusCode})`);
        throw err;
    });
};



/**
 * Get information from musicbrainz this will be added to the structure of our API see swagger
 * defination of Artist.
 * 
 * @export
 * @param {any} mbid
 * @returns
 */
export function get(mbid)
{
    return retry(() => {
        return promiseThrottle.add(_getRequest.bind(this, mbid));
    }, retryOptions).catch((err) =>
    {
        if (err.failure.statusCode == 503)
            throw new RateLimitError(err.message);
    });
}