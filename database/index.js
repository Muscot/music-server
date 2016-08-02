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

var pool = mysql.createPool(config);

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
var queryAsync = Promise.promisify(query);

export function getArtists() {
    return queryAsync('SELECT json FROM artist').then(function (rows) {
        if (rows.length == 0)
            return;

        return rows;
    });
}

export function getArtist(mbid) {
    return queryAsync('SELECT json FROM artist WHERE mbid = "'+ mbid +'"').then(function (rows) {
        if (rows.length == 0)
            return;

        return rows[0].json;
    });
}

export function saveArtist(arr) {
    var json = JSON.stringify(arr);
    return queryAsync('INSERT INTO artist (mbid, json, created_by, created_at) VALUES ("' + arr.mbid + '", ' + pool.escape(json) + ', 25, now(6)) ON DUPLICATE KEY UPDATE json=' + pool.escape(json) + ', updated_at = now(6), updated_by = 25;').then(function (result) {
        return json;
   });
}