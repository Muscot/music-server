
import * as coverart from '../../loaders/coverart';
import * as musicbrainz from '../../loaders/musicbrainz';
import * as wikipedia from '../../loaders/wikipedia';
import * as database from '../../database';
import LruCache from 'simple-lru-cache';
import {merge} from 'lodash';

// cache to store all pending request so we can share the promises.
var pending = new LruCache({"maxSize":1000});

// cache for the most common result, it's better to just cache the result than promises
// the server will use less memory. We cache the serialized version it will help the CPU alot
// not need to serialize all the responses. 
var cache = new LruCache({"maxSize":5000});

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

function _sendSuccess(res, mbid, result)
{
    cache.set(mbid, result);
    res.set('Content-Type', 'application/json');
    res.send(result);
}

function _sendError(res, mbid, err)
{
    res.set('Content-Type', 'application/json');
    var code = err.statusCode || 500;
    res.status(code).send({
        'status' : code,
        'message' : err.message
    });
}

export function get(req, res, next) {

    var musicbrainzResult, wikipediaResult, coverartResult, finalResult = {};
    var mbid = req.swagger.params.mbid.value;

    // check if we have a cache result for the mbid.
    var cacheResult = cache.get(mbid);
    if (cacheResult)
    {
        _sendSuccess(res, mbid, cacheResult);
        return;
    }

    // check if we have a pending request for the mbid, we can wait for that promise to finished.
    var pendingPromise = pending.get(mbid);
    if (pendingPromise)
    {
        pendingPromise.done((result) => 
        {
            if (result instanceof Error)
                _sendError(res, mbid, result);
            else
                _sendSuccess(res, mbid, result);
        });
    }
    else
    {
        // If we have the result in the database use that. 
        var p = database.getArtist(mbid).then((result) => 
        {
            if (result)
            {
                _sendSuccess(res, mbid, result);
                return result;
            }

            return musicbrainz.get(mbid).then(function(result) {
                musicbrainzResult = result;

                // If we don't have a wikipedia skip the description
                if (result.sources.musicbrainz.wikipedia)
                    return wikipedia.get(result.sources.musicbrainz.wikipedia);
            
                return result;
            }).then(function(result) {
                wikipediaResult = result;
                return coverart.get(musicbrainzResult.albums);
            }).then(function(result) {
                coverartResult = result;
                merge(finalResult, musicbrainzResult, wikipediaResult, coverartResult);
                return database.saveArtist(finalResult);
            }).then(function(result) {
                // send result to the client.
                _sendSuccess(res, mbid, result);
                pending.del(mbid);
                return result;
            }).catch((err) => {
                pending.del(mbid);
                throw err;
            });

        }).catch(musicbrainz.RateLimitError, (err) =>
        {
            _sendError(res, mbid, err);
            return err;
        }).catch((err) => {
            _sendError(res, mbid, err);
            return err;
        });

        pending.set(mbid, p);
    }
}


