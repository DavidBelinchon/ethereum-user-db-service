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

const assert = require("chai").assert,
    DbService = require("../src/dbService.js"),
    execSync = require('child_process').execSync,
    TEST_DB_HOST = 'user-db-test',
    TEST_DB_NAME = 'service_users_test',
    TEST_DB_PASSWORD = 'my-secret-pw',
    SAMPLE_SECONDARY_ADDRESS = "0x877A9a6f1CCf643D4e3Cf4DACdaEda43dAE10a7d",
    SAMPLE_REGISTRATION_TOKEN = "InR5cCI6IkpXVCJ9eyJhbGciOiJIUzI1NiIs.oiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9eyJsb2dnZWRJbkFzIj.FSRgCzcmJmMjLiuyu5CSpyHIgzSraSYS8EXBxLN_oWn",
    SAMPLE_SECONDARY_ADDRESS_2 = "0x4DACdaEda43dAE10a7d877A9a6f1CCf643D4e3Cf",
    SAMPLE_REGISTRATION_TOKEN_2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI",
    SAMPLE_EMAIL = "test@test.com",
    SAMPLE_PRIMARY_ADDRESS = "0xf4DACd877A9a63CaEda43dAE10a7df1CCf643D4e",
    SAMPLE_EMAIL_2 = "test2@test2.com",
    SAMPLE_PRIMARY_ADDRESS_2 = "0xd877A9a63CaEdaf4DAC43dAE10a7df1CCf643D4e";

var dbService = new DbService(TEST_DB_HOST, TEST_DB_NAME);

describe("DB - Integration tests", function() {

    it("should create mobile_mapping table and check if this table exists", function() {
        return dbService.createMobileMappingTable().then(function(result){
            return dbService.checkIfMobileMappingTableExists().then(function(checkResult){
                assert.lengthOf(checkResult, 1);
            });
        });
    });
    it("should check if single mobile_mapping is inserted into table", function() {
        return dbService.insertMapping(SAMPLE_SECONDARY_ADDRESS, SAMPLE_REGISTRATION_TOKEN).then(function(result){
            return dbService.getMappingByAddress(SAMPLE_SECONDARY_ADDRESS).then(function(getResult){
                assert.equal(getResult[0].secondaryAddress, SAMPLE_SECONDARY_ADDRESS);
                assert.equal(getResult[0].registrationToken, SAMPLE_REGISTRATION_TOKEN);
            });
        });
    });
    it("should check if there are 2 mobile_mappings inserted into table", function() {
        return dbService.insertMapping(SAMPLE_SECONDARY_ADDRESS_2, SAMPLE_REGISTRATION_TOKEN_2).then(function(result){
            return dbService.getMappings().then(function(getResults){
                assert.lengthOf(getResults, 2);
                //Below asserts are with '||' because order of inserting data is not certain
                assert.equal(getResults[1].secondaryAddress == SAMPLE_SECONDARY_ADDRESS || getResults[1].secondaryAddress == SAMPLE_SECONDARY_ADDRESS_2, true);
                assert.equal(getResults[1].registrationToken == SAMPLE_REGISTRATION_TOKEN || getResults[1].registrationToken == SAMPLE_REGISTRATION_TOKEN_2, true);
            });
        });
    });
    it("should create user_credentials table and check if this table exists", function() {
        return dbService.createUserCredentialsTable().then(function(result){
            return dbService.checkIfUserCredentialsTableExists().then(function(checkResult){
                assert.lengthOf(checkResult, 1);
            });
        });
    });
    it("should check if single user_credential is inserted into table", function() {
        return dbService.insertUserCredential(SAMPLE_EMAIL, SAMPLE_PRIMARY_ADDRESS).then(function(result){
            return dbService.getUserCredentialsByEmail(SAMPLE_EMAIL).then(function(getResult){
                assert.equal(getResult[0].email, SAMPLE_EMAIL);
                assert.equal(getResult[0].primaryAddress, SAMPLE_PRIMARY_ADDRESS);
            });
        });
    });
    it("should check if there are 2 user_credentials inserted into table", function() {
        return dbService.insertUserCredential(SAMPLE_EMAIL_2, SAMPLE_PRIMARY_ADDRESS_2).then(function(result){
            return dbService.getUserCredentials().then(function(getResults){
                assert.lengthOf(getResults, 2);
                //Below asserts are with '||' because order of inserting data is not certain
                assert.equal(getResults[1].email == SAMPLE_EMAIL || getResults[1].email == SAMPLE_EMAIL_2, true);
                assert.equal(getResults[1].primaryAddress == SAMPLE_PRIMARY_ADDRESS || getResults[1].primaryAddress == SAMPLE_PRIMARY_ADDRESS_2, true);
            });
        });
    });
});
