'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = get;

var _requestPromise = require('request-promise');

var rp = _interopRequireWildcard(_requestPromise);

var _url = require('url');

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var restApi = 'https://en.wikipedia.org/w/api.php';
var userAgent = 'Amivono/0.0.1 ( martin@amivono.com )';

/**
 * Get the description from wikipedia if we got more then one hist from the query we pick the first one,
 * TODO: Add a log/note if we got more than one hit from wikipedia.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getDescription(json) {
    var pages = json.query.pages;
    return pages[Object.keys(pages)[0]];
}

/**
 * Get the title from a wikipedia url, the last part of the url path.
 * 
 * @param {any} wikipediaUrl
 * @returns
 */
function _getTitleFromUrl(wikipediaUrl) {
    var path = (0, _url.parse)(wikipediaUrl).path.split('/');
    return path[path.length - 1];
}

/**
 * Get all the albums.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getAlbums(json) {
    var albums = (0, _lodash.reduce)(json['release-groups'], function (result, value, key) {
        if (value['primary-type'] == 'Album') {
            result.push({
                'id': value['id'],
                'title': value['title'],
                'first-release-date': value['first-release-date']
            });
        }

        return result;
    }, []);

    //Sort the albums by release dates.
    return albums.sort(function (a, b) {
        if (a['first-release-date'] < b['first-release-date']) return -1;
        if (a['first-release-date'] > b['first-release-date']) return 1;

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
function get(wikipediaUrl) {
    var wikipediaTitle = _getTitleFromUrl(wikipediaUrl);
    var restUrl = restApi + '?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=' + wikipediaTitle;
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': userAgent
        },
        json: true
    };

    return rp.get(options).then(function (json) {
        var desc = _getDescription(json);
        var ret = {
            title: desc.title,
            description: desc.extract,
            sources: {
                'wikipedia': {
                    'id': desc.pageid,
                    'url': restUrl
                }
            }
        };
        return ret;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xvYWRlcnMvd2lraXBlZGlhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBNEVnQixHLEdBQUEsRzs7QUE1RWhCOztJQUFZLEU7O0FBQ1o7O0FBQ0E7Ozs7QUFFQSxJQUFJLFVBQVUsb0NBQWQ7QUFDQSxJQUFJLFlBQVksc0NBQWhCOztBQUVBOzs7Ozs7O0FBT0EsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQ0E7QUFDSSxRQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBdkI7QUFDQSxXQUFPLE1BQU0sT0FBTyxJQUFQLENBQVksS0FBWixFQUFtQixDQUFuQixDQUFOLENBQVA7QUFDSDs7QUFHRDs7Ozs7O0FBTUEsU0FBUyxnQkFBVCxDQUEwQixZQUExQixFQUNBO0FBQ0ksUUFBSSxPQUFPLGdCQUFNLFlBQU4sRUFBb0IsSUFBcEIsQ0FBeUIsS0FBekIsQ0FBK0IsR0FBL0IsQ0FBWDtBQUNBLFdBQU8sS0FBSyxLQUFLLE1BQUwsR0FBWSxDQUFqQixDQUFQO0FBQ0g7O0FBR0Q7Ozs7OztBQU1BLFNBQVMsVUFBVCxDQUFvQixJQUFwQixFQUNBO0FBQ0ksUUFBSSxTQUFTLG9CQUFPLEtBQUssZ0JBQUwsQ0FBUCxFQUErQixVQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXdCO0FBQ2hFLFlBQUksTUFBTSxjQUFOLEtBQXlCLE9BQTdCLEVBQ0E7QUFDSSxtQkFBTyxJQUFQLENBQVk7QUFDUixzQkFBTSxNQUFNLElBQU4sQ0FERTtBQUVSLHlCQUFTLE1BQU0sT0FBTixDQUZEO0FBR1Isc0NBQXNCLE1BQU0sb0JBQU47QUFIZCxhQUFaO0FBS0g7O0FBRUQsZUFBTyxNQUFQO0FBQ0gsS0FYWSxFQVdWLEVBWFUsQ0FBYjs7QUFhQTtBQUNBLFdBQU8sT0FBTyxJQUFQLENBQVksVUFBQyxDQUFELEVBQUksQ0FBSixFQUNuQjtBQUNJLFlBQUksRUFBRSxvQkFBRixJQUEwQixFQUFFLG9CQUFGLENBQTlCLEVBQ0ksT0FBTyxDQUFDLENBQVI7QUFDSixZQUFJLEVBQUUsb0JBQUYsSUFBMEIsRUFBRSxvQkFBRixDQUE5QixFQUNJLE9BQU8sQ0FBUDs7QUFFSixlQUFPLENBQVA7QUFDSCxLQVJNLENBQVA7QUFTSDs7QUFHRDs7Ozs7Ozs7QUFRTyxTQUFTLEdBQVQsQ0FBYSxZQUFiLEVBQ1A7QUFDSSxRQUFJLGlCQUFpQixpQkFBaUIsWUFBakIsQ0FBckI7QUFDQSxRQUFJLFVBQWEsT0FBYixtRkFBa0csY0FBdEc7QUFDQSxRQUFJLFVBQVU7QUFDVixhQUFLLE9BREs7QUFFVixpQkFBUztBQUNMLDBCQUFjO0FBRFQsU0FGQztBQUtWLGNBQU07QUFMSSxLQUFkOztBQVFBLFdBQU8sR0FBRyxHQUFILENBQU8sT0FBUCxFQUFnQixJQUFoQixDQUFxQixVQUFDLElBQUQsRUFBVTtBQUNsQyxZQUFJLE9BQU8sZ0JBQWdCLElBQWhCLENBQVg7QUFDQSxZQUFJLE1BQU07QUFDTixtQkFBUSxLQUFLLEtBRFA7QUFFTix5QkFBYyxLQUFLLE9BRmI7QUFHTixxQkFBVTtBQUNOLDZCQUFjO0FBQ1YsMEJBQU8sS0FBSyxNQURGO0FBRVYsMkJBQVE7QUFGRTtBQURSO0FBSEosU0FBVjtBQVVBLGVBQU8sR0FBUDtBQUNILEtBYk0sQ0FBUDtBQWNIIiwiZmlsZSI6Indpa2lwZWRpYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQge3BhcnNlfSBmcm9tICd1cmwnO1xuaW1wb3J0IHtyZWR1Y2UsIGZpcnN0fSBmcm9tICdsb2Rhc2gnO1xuXG52YXIgcmVzdEFwaSA9ICdodHRwczovL2VuLndpa2lwZWRpYS5vcmcvdy9hcGkucGhwJztcbnZhciB1c2VyQWdlbnQgPSAnQW1pdm9uby8wLjAuMSAoIG1hcnRpbkBhbWl2b25vLmNvbSApJztcblxuLyoqXG4gKiBHZXQgdGhlIGRlc2NyaXB0aW9uIGZyb20gd2lraXBlZGlhIGlmIHdlIGdvdCBtb3JlIHRoZW4gb25lIGhpc3QgZnJvbSB0aGUgcXVlcnkgd2UgcGljayB0aGUgZmlyc3Qgb25lLFxuICogVE9ETzogQWRkIGEgbG9nL25vdGUgaWYgd2UgZ290IG1vcmUgdGhhbiBvbmUgaGl0IGZyb20gd2lraXBlZGlhLlxuICogXG4gKiBAcGFyYW0ge2FueX0ganNvblxuICogQHJldHVybnMge2FycmF5fVxuICovXG5mdW5jdGlvbiBfZ2V0RGVzY3JpcHRpb24oanNvbilcbntcbiAgICB2YXIgcGFnZXMgPSBqc29uLnF1ZXJ5LnBhZ2VzO1xuICAgIHJldHVybiBwYWdlc1tPYmplY3Qua2V5cyhwYWdlcylbMF1dO1xufVxuXG5cbi8qKlxuICogR2V0IHRoZSB0aXRsZSBmcm9tIGEgd2lraXBlZGlhIHVybCwgdGhlIGxhc3QgcGFydCBvZiB0aGUgdXJsIHBhdGguXG4gKiBcbiAqIEBwYXJhbSB7YW55fSB3aWtpcGVkaWFVcmxcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIF9nZXRUaXRsZUZyb21Vcmwod2lraXBlZGlhVXJsKVxue1xuICAgIHZhciBwYXRoID0gcGFyc2Uod2lraXBlZGlhVXJsKS5wYXRoLnNwbGl0KCcvJyk7XG4gICAgcmV0dXJuIHBhdGhbcGF0aC5sZW5ndGgtMV07XG59XG4gXG5cbi8qKlxuICogR2V0IGFsbCB0aGUgYWxidW1zLlxuICogXG4gKiBAcGFyYW0ge2FueX0ganNvblxuICogQHJldHVybnMge2FycmF5fVxuICovXG5mdW5jdGlvbiBfZ2V0QWxidW1zKGpzb24pXG57XG4gICAgdmFyIGFsYnVtcyA9IHJlZHVjZShqc29uWydyZWxlYXNlLWdyb3VwcyddLCAocmVzdWx0LCB2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZVsncHJpbWFyeS10eXBlJ10gPT0gJ0FsYnVtJylcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICdpZCc6IHZhbHVlWydpZCddLFxuICAgICAgICAgICAgICAgICd0aXRsZSc6IHZhbHVlWyd0aXRsZSddLFxuICAgICAgICAgICAgICAgICdmaXJzdC1yZWxlYXNlLWRhdGUnOiB2YWx1ZVsnZmlyc3QtcmVsZWFzZS1kYXRlJ11cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG5cbiAgICAvL1NvcnQgdGhlIGFsYnVtcyBieSByZWxlYXNlIGRhdGVzLlxuICAgIHJldHVybiBhbGJ1bXMuc29ydCgoYSwgYikgPT4gXG4gICAge1xuICAgICAgICBpZiAoYVsnZmlyc3QtcmVsZWFzZS1kYXRlJ10gPCBiWydmaXJzdC1yZWxlYXNlLWRhdGUnXSlcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFbJ2ZpcnN0LXJlbGVhc2UtZGF0ZSddID4gYlsnZmlyc3QtcmVsZWFzZS1kYXRlJ10pXG4gICAgICAgICAgICByZXR1cm4gMTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIEdldCBpbmZvcm1hdGlvbiBmcm9tIG11c2ljYnJhaW56IHRoaXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgc3RydWN0dXJlIG9mIG91ciBBUEkgc2VlIHN3YWdnZXJcbiAqIGRlZmluYXRpb24gb2YgQXJ0aXN0LlxuICogXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gd2lraXBlZGlhVXJsLCB1cmwgdG8gYSB3aWtpcGVkaWEgcGFnZSwgaXQgd2lsbCBwYXJzZSB0aGUgbmFtZSBhbmQgc2VuZCBpdCB0byB3aWtpcGVkaWEgUmVzdCBBUEkuXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHdpa2lwZWRpYVVybClcbntcbiAgICB2YXIgd2lraXBlZGlhVGl0bGUgPSBfZ2V0VGl0bGVGcm9tVXJsKHdpa2lwZWRpYVVybCk7XG4gICAgdmFyIHJlc3RVcmwgPSBgJHtyZXN0QXBpfT9hY3Rpb249cXVlcnkmZm9ybWF0PWpzb24mcHJvcD1leHRyYWN0cyZleGludHJvPXRydWUmcmVkaXJlY3RzPXRydWUmdGl0bGVzPSR7d2lraXBlZGlhVGl0bGV9YDtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgdXJpOiByZXN0VXJsLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnVXNlci1BZ2VudCc6IHVzZXJBZ2VudFxuICAgICAgICB9LFxuICAgICAgICBqc29uOiB0cnVlXG4gICAgfTtcblxuICAgIHJldHVybiBycC5nZXQob3B0aW9ucykudGhlbigoanNvbikgPT4ge1xuICAgICAgICB2YXIgZGVzYyA9IF9nZXREZXNjcmlwdGlvbihqc29uKTtcbiAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICAgIHRpdGxlIDogZGVzYy50aXRsZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uIDogZGVzYy5leHRyYWN0LFxuICAgICAgICAgICAgc291cmNlcyA6IHtcbiAgICAgICAgICAgICAgICAnd2lraXBlZGlhJyA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2lkJyA6IGRlc2MucGFnZWlkLFxuICAgICAgICAgICAgICAgICAgICAndXJsJyA6IHJlc3RVcmwsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSk7XG59Il19