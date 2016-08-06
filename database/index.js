import {database as config} from '../config';
import Promise from 'bluebird';
import mysql from 'mysql';
import DebugLib from 'debug';

/**
 * Initilize database layer.
 * ==================================
 */
var debug = DebugLib('database');
debug('loaded', config.host, config.user);

// Create connection pool to the mysql database, see config/index.js for settings.
var pool = mysql.createPool(config);

/**
 * Execute a SQL query to the database, and calls the callback with the result. 
 * For INSERT, UPDATE it will return affected_rows etc.
 * 
 * @param {string} sql
 * @param {function} callback, (err, result)
 */
function query(sql, callback) {
    debug(sql);
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection)
                connection.release();

            debug(err.message);
            return callback(err);
        }
        connection.query(sql, function (err, rows) {
            connection.release();
            callback(err, rows);
        });
    });
}

// Make promise of the query function
var queryAsync = Promise.promisify(query);

/**
 *  Returns all the artist in the table.
 *
 * TODO: 
 * - pagination.
 * - use JSON_EXTRACT to filter the result.
 * - use the filter and output from swagger parameter.
 * 
 * @export
 * @returns {promise} Result is a array of serialized json.
 */
export function getArtists() {
    return queryAsync('SELECT json FROM artist').then(function (rows) {
        if (rows.length == 0)
            return;

        return rows;
    });
}

/**
 * Returns a artist if it exist in the database othervise returns undefined.
 * 
 * @export
 * @param {string} mbid
 * @returns {promise} Result will be the serilized json that have been stored in database.
 */
export function getArtist(mbid) {
    return queryAsync('SELECT json FROM artist WHERE mbid = "'+ mbid +'"').then(function (rows) {
        if (rows.length == 0)
            return;

        return rows[0].json;
    });
}

/**
 * Save or update a Artist as a serialized json in artist table, returns affected_rows etc. 
 * If the row have been INSERTED or UPDATED.
 * 
 * @export
 * @param {any} arr
 * @returns {promise} Result will be the serilized json that have been stored in database.
 */
export function saveArtist(arr) {
    var json = JSON.stringify(arr);
    return queryAsync('INSERT INTO artist (mbid, json, created_by, created_at) VALUES ("' + arr.mbid + '", ' + pool.escape(json) + ', 25, now(6)) ON DUPLICATE KEY UPDATE json=' + pool.escape(json) + ', updated_at = now(6), updated_by = 25;').then(function (result) {
        return json;
   });
}