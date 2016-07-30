'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = get;

var _requestPromise = require('request-promise');

var rp = _interopRequireWildcard(_requestPromise);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var restApi = 'http://musicbrainz.org/ws/2';
var userAgent = 'Amivono/0.0.1 ( martin@amivono.com )';

/**
 * Get all the musicbrainz relations with relation type as keys.
 * 
 * @param {any} json
 * @returns {array}
 */
function _getRelations(json) {
    return (0, _lodash.reduce)(json['relations'], function (result, value, key) {
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
 * @param {any} mbid
 * @returns
 */
function get(mbid) {
    var restUrl = restApi + '/artist/' + mbid + '?&fmt=json&inc=url-rels+release-groups';
    var options = {
        uri: restUrl,
        headers: {
            'User-Agent': userAgent
        },
        json: true
    };

    return rp.get(options).then(function (json) {
        var relations = _getRelations(json);
        var ret = {
            mbid: json.id,
            albums: _getAlbums(json),
            sources: {
                'musicbrainz': {
                    'id': json.id,
                    'url': restUrl,
                    'relations': {
                        'wikipedia': relations.wikipedia
                    }
                }
            }
        };
        console.log(relations.wikipedia.url.resource);
        return ret;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xvYWRlcnMvbXVzaWNicmFpbnouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUErRGdCLEcsR0FBQSxHOztBQS9EaEI7O0lBQVksRTs7QUFDWjs7OztBQUVBLElBQUksVUFBVSw2QkFBZDtBQUNBLElBQUksWUFBWSxzQ0FBaEI7O0FBR0E7Ozs7OztBQU1BLFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUNBO0FBQ0ksV0FBTyxvQkFBTyxLQUFLLFdBQUwsQ0FBUCxFQUEwQixVQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXdCO0FBQ3JELGVBQU8sTUFBTSxJQUFiLElBQXFCLEtBQXJCO0FBQ0EsZUFBTyxNQUFQO0FBQ0gsS0FITSxFQUdKLEVBSEksQ0FBUDtBQUlIOztBQUVEOzs7Ozs7QUFNQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFDQTtBQUNJLFFBQUksU0FBUyxvQkFBTyxLQUFLLGdCQUFMLENBQVAsRUFBK0IsVUFBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUF3QjtBQUNoRSxZQUFJLE1BQU0sY0FBTixLQUF5QixPQUE3QixFQUNBO0FBQ0ksbUJBQU8sSUFBUCxDQUFZO0FBQ1Isc0JBQU0sTUFBTSxJQUFOLENBREU7QUFFUix5QkFBUyxNQUFNLE9BQU4sQ0FGRDtBQUdSLHNDQUFzQixNQUFNLG9CQUFOO0FBSGQsYUFBWjtBQUtIOztBQUVELGVBQU8sTUFBUDtBQUNILEtBWFksRUFXVixFQVhVLENBQWI7O0FBYUE7QUFDQSxXQUFPLE9BQU8sSUFBUCxDQUFZLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFDbkI7QUFDSSxZQUFJLEVBQUUsb0JBQUYsSUFBMEIsRUFBRSxvQkFBRixDQUE5QixFQUNJLE9BQU8sQ0FBQyxDQUFSO0FBQ0osWUFBSSxFQUFFLG9CQUFGLElBQTBCLEVBQUUsb0JBQUYsQ0FBOUIsRUFDSSxPQUFPLENBQVA7O0FBRUosZUFBTyxDQUFQO0FBQ0gsS0FSTSxDQUFQO0FBU0g7O0FBR0Q7Ozs7Ozs7O0FBUU8sU0FBUyxHQUFULENBQWEsSUFBYixFQUNQO0FBQ0ksUUFBSSxVQUFhLE9BQWIsZ0JBQStCLElBQS9CLDJDQUFKO0FBQ0EsUUFBSSxVQUFVO0FBQ1YsYUFBSyxPQURLO0FBRVYsaUJBQVM7QUFDTCwwQkFBYztBQURULFNBRkM7QUFLVixjQUFNO0FBTEksS0FBZDs7QUFRQSxXQUFPLEdBQUcsR0FBSCxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsQ0FBcUIsVUFBQyxJQUFELEVBQVU7QUFDbEMsWUFBSSxZQUFZLGNBQWMsSUFBZCxDQUFoQjtBQUNBLFlBQUksTUFBTTtBQUNOLGtCQUFPLEtBQUssRUFETjtBQUVOLG9CQUFTLFdBQVcsSUFBWCxDQUZIO0FBR04scUJBQVU7QUFDTiwrQkFBZ0I7QUFDWiwwQkFBTyxLQUFLLEVBREE7QUFFWiwyQkFBUSxPQUZJO0FBR1osaUNBQWM7QUFDVixxQ0FBYyxVQUFVO0FBRGQ7QUFIRjtBQURWO0FBSEosU0FBVjtBQWFBLGdCQUFRLEdBQVIsQ0FBWSxVQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsUUFBcEM7QUFDQSxlQUFPLEdBQVA7QUFDSCxLQWpCTSxDQUFQO0FBa0JIIiwiZmlsZSI6Im11c2ljYnJhaW56LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICdsb2Rhc2gnO1xuXG52YXIgcmVzdEFwaSA9ICdodHRwOi8vbXVzaWNicmFpbnoub3JnL3dzLzInO1xudmFyIHVzZXJBZ2VudCA9ICdBbWl2b25vLzAuMC4xICggbWFydGluQGFtaXZvbm8uY29tICknO1xuXG5cbi8qKlxuICogR2V0IGFsbCB0aGUgbXVzaWNicmFpbnogcmVsYXRpb25zIHdpdGggcmVsYXRpb24gdHlwZSBhcyBrZXlzLlxuICogXG4gKiBAcGFyYW0ge2FueX0ganNvblxuICogQHJldHVybnMge2FycmF5fVxuICovXG5mdW5jdGlvbiBfZ2V0UmVsYXRpb25zKGpzb24pXG57XG4gICAgcmV0dXJuIHJlZHVjZShqc29uWydyZWxhdGlvbnMnXSwgKHJlc3VsdCwgdmFsdWUsIGtleSkgPT4ge1xuICAgICAgICByZXN1bHRbdmFsdWUudHlwZV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCB7fSk7XG59XG5cbi8qKlxuICogR2V0IGFsbCB0aGUgYWxidW1zLlxuICogXG4gKiBAcGFyYW0ge2FueX0ganNvblxuICogQHJldHVybnMge2FycmF5fVxuICovXG5mdW5jdGlvbiBfZ2V0QWxidW1zKGpzb24pXG57XG4gICAgdmFyIGFsYnVtcyA9IHJlZHVjZShqc29uWydyZWxlYXNlLWdyb3VwcyddLCAocmVzdWx0LCB2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZVsncHJpbWFyeS10eXBlJ10gPT0gJ0FsYnVtJylcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICdpZCc6IHZhbHVlWydpZCddLFxuICAgICAgICAgICAgICAgICd0aXRsZSc6IHZhbHVlWyd0aXRsZSddLFxuICAgICAgICAgICAgICAgICdmaXJzdC1yZWxlYXNlLWRhdGUnOiB2YWx1ZVsnZmlyc3QtcmVsZWFzZS1kYXRlJ11cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG5cbiAgICAvL1NvcnQgdGhlIGFsYnVtcyBieSByZWxlYXNlIGRhdGVzLlxuICAgIHJldHVybiBhbGJ1bXMuc29ydCgoYSwgYikgPT4gXG4gICAge1xuICAgICAgICBpZiAoYVsnZmlyc3QtcmVsZWFzZS1kYXRlJ10gPCBiWydmaXJzdC1yZWxlYXNlLWRhdGUnXSlcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFbJ2ZpcnN0LXJlbGVhc2UtZGF0ZSddID4gYlsnZmlyc3QtcmVsZWFzZS1kYXRlJ10pXG4gICAgICAgICAgICByZXR1cm4gMTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIEdldCBpbmZvcm1hdGlvbiBmcm9tIG11c2ljYnJhaW56IHRoaXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgc3RydWN0dXJlIG9mIG91ciBBUEkgc2VlIHN3YWdnZXJcbiAqIGRlZmluYXRpb24gb2YgQXJ0aXN0LlxuICogXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge2FueX0gbWJpZFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldChtYmlkKVxue1xuICAgIHZhciByZXN0VXJsID0gYCR7cmVzdEFwaX0vYXJ0aXN0LyR7bWJpZH0/JmZtdD1qc29uJmluYz11cmwtcmVscytyZWxlYXNlLWdyb3Vwc2A7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHVyaTogcmVzdFVybCxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ1VzZXItQWdlbnQnOiB1c2VyQWdlbnRcbiAgICAgICAgfSxcbiAgICAgICAganNvbjogdHJ1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gcnAuZ2V0KG9wdGlvbnMpLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgdmFyIHJlbGF0aW9ucyA9IF9nZXRSZWxhdGlvbnMoanNvbik7XG4gICAgICAgIHZhciByZXQgPSB7XG4gICAgICAgICAgICBtYmlkIDoganNvbi5pZCxcbiAgICAgICAgICAgIGFsYnVtcyA6IF9nZXRBbGJ1bXMoanNvbiksXG4gICAgICAgICAgICBzb3VyY2VzIDoge1xuICAgICAgICAgICAgICAgICdtdXNpY2JyYWlueicgOiB7XG4gICAgICAgICAgICAgICAgICAgICdpZCcgOiBqc29uLmlkLFxuICAgICAgICAgICAgICAgICAgICAndXJsJyA6IHJlc3RVcmwsXG4gICAgICAgICAgICAgICAgICAgICdyZWxhdGlvbnMnIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpa2lwZWRpYScgOiByZWxhdGlvbnMud2lraXBlZGlhXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2cocmVsYXRpb25zLndpa2lwZWRpYS51cmwucmVzb3VyY2UpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0pO1xufSJdfQ==