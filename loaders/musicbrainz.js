import * as rp from 'request-promise';
import {reduce} from 'lodash';

var restApi = 'http://musicbrainz.org/ws/2';
var userAgent = 'Amivono/0.0.1 ( martin@amivono.com )';


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
    var restUrl = `${restApi}/artist/${mbid}?&fmt=json&inc=url-rels+release-groups`;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': userAgent
        },
        json: true
    };

    return rp.get(options).then((json) => {
        var relations = _getRelations(json);
        var ret = {
            mbid : json.id,
            albums : _getAlbums(json),
            sources : {
                'musicbrainz' : {
                    'id' : json.id,
                    'url' : restUrl,
                    'relations' : {
                        'wikipedia' : relations.wikipedia
                    }
                },
            } 
        };
        console.log(relations.wikipedia.url.resource);
        return ret;
    });
}