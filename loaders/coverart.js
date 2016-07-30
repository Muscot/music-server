
import * as rp from 'request-promise';
import * as BlueBirdQueue from 'bluebird-queue';
import {parse} from 'url';
import {reduce, first} from 'lodash';

var restApi = 'http://coverartarchive.org';
var userAgent = 'Amivono/0.0.1 ( martin@amivono.com )';

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
        album['image'] = json.images[0].image;
        album['thumbnail'] = json.images[0].thumbnails.large;
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
    var queue = new BlueBirdQueue.default({
      concurrency: 3
    });

    albums.forEach(function(album) {
        queue.add(_getRequest.bind(null, album))
    }, this);

    return queue.start().then((result) => 
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