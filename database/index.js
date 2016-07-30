import * as config from '../config';

var Promise = require("bluebird");
var mysql = require('mysql');
var _ = require('lodash');
var pool = mysql.createPool(config.database);
var pageSize = 20;

export function NotFoundError(message) {
    this.name = "NotFoundError";
    this.status = 404;
    this.message = (message || "");
}
NotFoundError.prototype = Object.create(Error.prototype);

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

function getQuery(table, params) {
    var sqlWhere = "";
    var sqlColumn = 'json';
    var output = false;
    for (var param in params) {
        
        if (params.hasOwnProperty(param)) {

            if (param == 'page')
                continue;

            if (params[param].value === undefined)
                continue;

            if (param == 'output') {
                output = params[param].value;
                sqlColumn = 'JSON_EXTRACT(json, ' + pool.escape('$.' + params[param].value) + ') as json';
                if (sqlWhere.length > 0)
                    sqlWhere += " and ";
                sqlWhere += 'JSON_CONTAINS_PATH(json, ' + pool.escape('all') + ', ' + pool.escape('$.' + params[param].value) + ') = 1';
                continue;
            }

            if (param == 'filter') {
                var value = params[param].value;
                var parts = value.split('=');
                var col = parts[0].trim();
                var v = parts[1].trim();
                var sqlNot = '';
                if (col.substring(col.length - 1) === '!') {
                    col = col.substring(0, col.length - 1);
                    if (sqlWhere.length > 0)
                        sqlWhere += " and ";

                    sqlWhere += '(JSON_EXTRACT(json, "$.' + col + '")' + " not like " + pool.escape('%' + v + '%') + ' or JSON_CONTAINS_PATH(json, ' + pool.escape('all') + ', ' + pool.escape('$.' + col) + ') = 0)';
                }
                else {
                    if (sqlWhere.length > 0)
                        sqlWhere += " and ";

                    sqlWhere += 'JSON_EXTRACT(json, "$.' + col + '")' + sqlNot + " like " + pool.escape('%' + v + '%');
                }
                continue;
            }
   
            if (sqlWhere.length > 0)
                sqlWhere += " and ";
            else {
                sqlWhere += 'JSON_EXTRACT(json, "$.' + param + '")' + " like " + pool.escape('%' + params[param].value + '%');
            }
        }
    }

    return { 'where': sqlWhere, 'column': sqlColumn, 'output': output };
}

export function getJsonList(table, params, page, callback) {
    if (page === undefined)
        page = 0;

    var offset = pageSize * page;
    var q = getQuery(table, params);
    var sqlWhere = q.where;
    var sqlColumn = q.column;
    if (sqlWhere.length > 0)
        sqlWhere = " where " + sqlWhere;

    var pk = table + '_id';
    return queryAsync('select ' + sqlColumn + ' from ' + table + sqlWhere + ' limit ' + offset + ',' + pageSize).then(function (rows) {
        var ret = [];
        for (var i = 0; i < rows.length; i++) {
            if (q.output)
                ret.push('{"' + pk + '":' + rows[i].pk + ', "' + q.output + '":' + rows[i].json + '}');
            else
                ret.push(rows[i].json);
        }
        return '[' + ret.join(',') + ']';
    });
}

export function getArtist(mbid) {
    return queryAsync('select json from artist where mbid = "'+ mbid +'"').then(function (rows) {
        if (rows.length == 0)
            throw new NotFoundError();

        return rows[0].json;
    });
}

export function saveArtist(arr) {
    var json = JSON.stringify(arr);
    return queryAsync('INSERT INTO artist (mbid, json, created_by, created_at) VALUES ("' + arr.mbid + '", ' + pool.escape(json) + ', 25, now(6)) ON DUPLICATE KEY UPDATE json=' + pool.escape(json) + ', updated_at = now(6), updated_by = 25;').then(function (result) {
        return json;
   });
}

function _insertHistory(table, arr) {

}

function _updateItem(table, arr, callback) {
    var json = JSON.stringify(arr);
    var columns = config.entries[table];
    var setValues = "";
    var pk = table + '_id';
    for (var column in columns) {
        if (columns.hasOwnProperty(column)) {
            if (column !== pk)
                setValues += "," + column + "=" + pool.escape(arr[column]);
        }
    }
    query('UPDATE ' + table + ' SET json = ' + pool.escape(json) + ", updated_at = '" + arr['updated_at'] + "', updated_by=" + arr['updated_by'] + setValues + " where " + pk + " = " + arr[pk], function (err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, json);
    });
}