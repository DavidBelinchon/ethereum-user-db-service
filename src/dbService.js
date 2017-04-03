/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Auth0, Inc. <support@auth0.com> (http://auth0.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

const Q = require('q'),
    mysql = require('mysql');

module.exports = DbService;

var pool;

function DbService(host, database, user, password) {

    pool = mysql.createPool({
        connectionLimit: 10,
        host: host ? host : 'localhost',
        user: user ? user : 'root',
        password: password ? password : 'my-secret-pw',
        database: database ? database : 'service-users'
    });
}

DbService.prototype.checkIfMobileMappingTableExists = function checkIfMobileMappingTableExists() {
    return promisify("SHOW TABLES LIKE 'mobileMapping';");
}

DbService.prototype.createMobileMappingTable = function createMobileMappingTable() {
    return promisify("CREATE TABLE IF NOT EXISTS mobileMapping (secondaryAddress VARCHAR(100) PRIMARY KEY, registrationToken VARCHAR(256));");
}

DbService.prototype.insertMapping = function insertMapping(secondaryAddress, registrationToken) {
    return promisify("INSERT INTO mobileMapping SET ?", {
        secondaryAddress: secondaryAddress,
        registrationToken: registrationToken
    });
}

DbService.prototype.getMappings = function getMappings() {
    return promisify("SELECT * FROM mobileMapping");
}

DbService.prototype.getMappingByAddress = function getMappingByAddress(secondaryAddress) {
    return promisify("SELECT * FROM mobileMapping WHERE `secondaryAddress` = ?", [secondaryAddress]);
}

DbService.prototype.checkIfUserCredentialsTableExists = function checkIfUserCredentialsTableExists() {
    return promisify("SHOW TABLES LIKE 'userCredentials';");
}

DbService.prototype.createUserCredentialsTable = function createUserCredentialsTable() {
    return promisify("CREATE TABLE IF NOT EXISTS userCredentials (email VARCHAR(100) PRIMARY KEY, primaryAddress VARCHAR(100));");
}

DbService.prototype.insertUserCredential = function insertUserCredential(email, primaryAddress) {
    return promisify("INSERT INTO userCredentials SET ?", {email: email, primaryAddress: primaryAddress});
}

DbService.prototype.getUserCredentials = function getUserCredentials() {
    return promisify("SELECT * FROM userCredentials");
}

DbService.prototype.getUserCredentialsByEmail = function getUserCredentialsByEmail(email) {
    return promisify("SELECT * FROM userCredentials WHERE `email` = ?", [email]);
}

function promisify(query, params) {
    var deferred = Q.defer();
    Q.fcall(function () {
        var callback = function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        }
        if (params) {
            pool.query(query, params, callback);
        } else {
            pool.query(query, callback);
        }
    });
    return deferred.promise;
}
