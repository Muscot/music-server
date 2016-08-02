import * as rp from 'request-promise';
import {parse} from 'url';
import {wikipedia as config} from '../config';
import retry from 'bluebird-retry';
import Promise from 'bluebird';
import PromiseThrottle from 'promise-throttle';
import DebugLib from 'debug';

/**
 * Initilize wikipedia loader.
 * ==================================
 */
var debug = DebugLib('wikipedia');
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
 * Get the description from wikipedia if we got more then one hist from the query we pick the first one,
 * TODO: Add a log/note if we got more than one hit from wikipedia.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getDescription(json)
{
    var pages = json.query.pages;
    return pages[Object.keys(pages)[0]];
}


/**
 * Get the title from a wikipedia url, the last part of the url path.
 * 
 * @param {any} wikipediaUrl
 * @returns
 */
function _getTitleFromUrl(wikipediaUrl)
{
    var path = parse(wikipediaUrl).path.split('/');
    return path[path.length-1];
}
 
/**
 * Get information from musicbrainz this will be added to the structure of our API see swagger
 * defination of Artist.
 * 
 * @export
 * @param {string} wikipediaUrl, url to a wikipedia page, it will parse the name and send it to wikipedia Rest API.
 * @returns
 */
function _getRequest(wikipediaUrl)
{
    var wikipediaTitle = _getTitleFromUrl(wikipediaUrl);
    debug(`${wikipediaTitle} Start request`);

    var restUrl = `${config.restApi}?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${wikipediaTitle}`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': config.userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        var desc = _getDescription(json);
        debug(`${wikipediaTitle} Got response (pageid=${desc.pageid})`);
 
        var ret = {
            title : desc.title,
            description : desc.extract,
            sources : {
                'wikipedia' : {
                    'id' : desc.pageid,
                    'url' : restUrl,
                },
            } 
        };
        return ret;
    }).catch((err) => {
        debug(`${wikipediaTitle} Wait and retry (${err.statusCode})`);
        throw err;
    });;
}


export function get(wikipediaUrl)
{
    return retry(() => {
        return promiseThrottle.add(_getRequest.bind(this, wikipediaUrl));
    }, retryOptions).catch((err) =>

    {
        throw err;
        //if (err.failure.statusCode == 503)
        //    throw new RateLimitError(err.message);
    });
}