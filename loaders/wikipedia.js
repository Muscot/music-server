import * as rp from 'request-promise';
import {parse} from 'url';
import {reduce, first} from 'lodash';

var restApi = 'https://en.wikipedia.org/w/api.php';
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


/**
 * Get information from musicbrainz this will be added to the structure of our API see swagger
 * defination of Artist.
 * 
 * @export
 * @param {string} wikipediaUrl, url to a wikipedia page, it will parse the name and send it to wikipedia Rest API.
 * @returns
 */
export function get(wikipediaUrl)
{
    var wikipediaTitle = _getTitleFromUrl(wikipediaUrl);
    var restUrl = `${restApi}?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${wikipediaTitle}`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        var desc = _getDescription(json);
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
    });
}