
import * as coverart from '../../loaders/coverart';
import * as musicbrainz from '../../loaders/musicbrainz';
import * as wikipedia from '../../loaders/wikipedia';
import * as database from '../../database';
import {merge} from 'lodash';

var LruCache = require("simple-lru-cache");

// cache to store all pending request so we can share the promises.
var pending = new LruCache({"maxSize":1000});

// cache to store the most common result.
var cache = new LruCache({"maxSize":5000});

export function list(req, res, next) {

    res.json(
    [
        {
            "mbid" :  "5b11f4ce­a62d­471e­81fc­a69a8278c7da" ,
            "description" : "<p><b>Nirvana</b> was an American rock band formed by singer and guitarist Kurt Cobain and bassist Krist Novoselic in Aberdeen, Washington, in 1987. Nirvana went through a succession of drummers, the longest-lasting being Dave Grohl, who joined the band in 1990. Despite releasing only three full-length studio albums in their seven-year career, Nirvana has come to be regarded as one of the most influential and important rock bands of the modern era. Though the band dissolved in 1994, their music continues to maintain a popular following and to inspire and influence modern rock and roll culture.</p>\n<p>In the late 1980s, Nirvana established itself as part of the Seattle grunge scene, releasing its first album, <i>Bleach</i>, for the independent record label Sub Pop in 1989. The band eventually came to develop a sound that relied on dynamic contrasts, often between quiet verses and loud, heavy choruses. After signing to major label DGC Records, Nirvana found unexpected success with \"Smells Like Teen Spirit\", the first single from the band's second album <i>Nevermind</i> (1991). Nirvana's sudden success widely popularized alternative rock as a whole, and the band's frontman Cobain found himself referred to in the media as the \"spokesman of a generation\", with Nirvana being considered the \"flagship band\" of Generation X. In response, Nirvana's third studio album, <i>In Utero</i> (1993), released to critical acclaim, featured an abrasive, less mainstream sound and challenged the group's audience.</p>\n<p>Nirvana's active career ended following the death of Kurt Cobain in 1994, but various posthumous releases have been issued since, overseen by Novoselic, Grohl, and Cobain's widow Courtney Love. Since its debut, the band has sold over 25 million records in the United States alone, and over 75 million records worldwide, making them one of the best-selling bands of all time. Nirvana was inducted into the Rock and Roll Hall of Fame in 2014, in its first year of eligibility.</p>\n<p></p>",  
            "albums" :[
                {
                    "title" : "Nevermind",
                    "id" : "1b022e01­4da6­387b­8658­8678046e4cef",  
                    "image" : "http://coverartarchive.org/release/a146429a­cedc­3ab0­9e41­1aaf5f6cdc2d/3012495605.jpg"
                }
            ]
        }
    ]);    
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


