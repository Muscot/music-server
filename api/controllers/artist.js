
import {cache as config} from '../../config';
import * as coverart from '../../loaders/coverart';
import * as musicbrainz from '../../loaders/musicbrainz';
import * as wikipedia from '../../loaders/wikipedia';
import * as database from '../../database';
import LruCache from 'simple-lru-cache';
import {merge} from 'lodash';

// Cache to store all pending request so we can share the promises.
var pending = new LruCache({"maxSize": 1000});

// cache for the most common result, it's better to just cache the result than promises
// the server will use less memory. We cache the serialized version it will help the CPU alot
// not need to serialize all the responses. 
var cache = new LruCache({"maxSize": config.maxSize});

/**
 * List all the artist that have been saved in the database
 * 
 * TODO:
 * Use share promises for this request so we help the database to handle high traffic. 
 * see the solutions for get method.
 * 
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export function list(req, res, next) {
    database.getArtists().then((result) => 
    {
        var rows = [];
        if (result)
        {
            for (var index = 0; index < result.length; index++) {
                rows.push(result[index].json);
            }
        }
        res.set('Content-Type', 'application/json');
        res.send('[' + rows.join(',') + ']');
    });
}

/**
 * Send success reponses to the client, it's used by ie. DELETE method, 
 * See GeneralResponse swagger definition. 
 * 
 * 
 * @param {any} res
 * @param {any} mbid
 * @param {any} success
 * @param {any} message
 */
function _sendSuccess(res, mbid, message)
{
    res.set('Content-Type', 'application/json');
    res.json({
        'mbid' : mbid,
        'status' : 200,
        'message' : message
    });
}

/**
 * Send a serialized Artist to the client, and store it in LRU Cache. Remove it from pending requests.
 * 
 * @param {object} res Express response.
 * @param {string} mbid The musicbrainz id.
 * @param {string} result The serilized json the is send back to the client. 
 */
function _sendResult(res, mbid, result)
{
    cache.set(mbid, result);
    pending.del(mbid);
    res.set('Content-Type', 'application/json');
    res.send(result);
}

/**
 * 
 * 
 * @param {object} res Express response.
 * @param {string} mbid The musicbrainz id.
 * @param {object} err, Error object with statusCode. 
 */
function _sendError(res, mbid, err)
{
    pending.del(mbid);
    var code = err.statusCode || 500;
    res.set('Content-Type', 'application/json');
    res.status(code).json({
        'mbid' : mbid,
        'status' : code,
        'message' : err.message
    });
}


/**
 * Artists DELETE request for our RestAPI. It's called from swagger middleware.
 * 
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
export function remove(req, res, next) {
    // The request parameter.
    var mbid = req.swagger.params.mbid.value;

    // Check if we got a valid mbid
    try {
        musicbrainz.validate(mbid);  
    } catch (error) {
        _sendError(res, mbid, error);
        return;
    }

    database.deleteArtist(mbid).then((result) => 
    {
        // If the mbid is cached remove it.
        cache.del(mbid);
        // 
        _sendSuccess(res, mbid, `Artist is deleted.`);
    }).catch((err) => {
        _sendError(res, mbid, err);
        return err;
    });
}

/**
 * Artists GET request for our RestAPI. It's called from swagger middleware.
 * 
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
export function get(req, res, next) {

    // store all the external responses to merge them later.
    var musicbrainzResult, wikipediaResult, coverartResult, finalResult = {};

    // The request parameter.
    var mbid = req.swagger.params.mbid.value;
    // Check if we got a valid mbid
    try {
        musicbrainz.validate(mbid);  
    } catch (error) {
        _sendError(res, mbid, error);
        return;
    }

    // Check if we have a cache result for the mbid.
    var cacheResult = cache.get(mbid);
    if (cacheResult)
    {
        _sendResult(res, mbid, cacheResult);
        return;
    }

    // Check if we have a pending request for the mbid, we can wait for that promise to finished.
    var pendingPromise = pending.get(mbid);
    if (pendingPromise)
    {
        pendingPromise.done((result) => 
        {
            if (result instanceof Error)
                _sendError(res, mbid, result);
            else
                _sendResult(res, mbid, result);
        });
    }
    else
    {
        // If we have the result in the database use that. 
        var p = database.getArtist(mbid).then((result) => 
        {
            if (result)
            {
                // We got the result from the database send it to the client.
                _sendResult(res, mbid, result);
                return result;
            }

            // We need to retrieve the result from musicbrainz, wikipedia and coverart
            return musicbrainz.get(mbid).then(function(result) {
                musicbrainzResult = result;

                // If we don't have a wikipedia skip the description
                if (result.sources.musicbrainz.wikipedia)
                    return wikipedia.get(result.sources.musicbrainz.wikipedia);
            
                return result;
            }).then(function(result) {
                wikipediaResult = result;
 
                // continue to retrieve data from coverart
                return coverart.get(musicbrainzResult.albums);
            }).then(function(result) {
                coverartResult = result;
 
                // We got all the results, merge them togheter och store them in database.
                merge(finalResult, musicbrainzResult, wikipediaResult, coverartResult);
                return database.saveArtist(finalResult);
            }).then(function(result) {
                // The final json is stored in database, send it to the client.
                _sendResult(res, mbid, result);
                return result;
            });

        }).catch(musicbrainz.RateLimitError, (err) =>
        {
            // After all retries and throttle we still can get a RateLimit error or the request timeout.
            // send the error to the client.
            _sendError(res, mbid, err);
            return err;
        }).catch((err) => {
            // We got some unknown error, should be logged, so we can handle it with our defined errors, like RateLimit.
            // send the error to the client.
            _sendError(res, mbid, err);
            return err;
        });

        // Add the current promise to pending so other request also can wait for the response.
        pending.set(mbid, p);
    }
}


