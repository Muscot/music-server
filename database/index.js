import * as config from '../config';

var Promise = require("bluebird");
var mysql = require('mysql');
var _ = require('lodash');
var pool = mysql.createPool(config.database);

function query(sql, callback) {
    console.log(sql);
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection)
                connection.release();
            console.log(err);
            return callback(err);
        }
        connection.query(sql, function (err, rows) {
            connection.release();
            callback(err, rows);
        });
    });
}
var queryAsync = Promise.promisify(query);

export function getArtist(mbid) {
    return queryAsync('select json from artist where mbid = "'+ mbid +'"').then(function (rows) {
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