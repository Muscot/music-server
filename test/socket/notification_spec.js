import * as musicbrainz from '../../loaders/musicbrainz';
import {expect} from 'chai';
import ioc from 'socket.io-client';
import DebugLib from 'debug';
import {log} from '../../socket';

var Promise = require('bluebird');
var server = require('../../app');
var io;

// Must enable musicbrainz debug to test notifications.
describe('socket', function() { 

    before(function (done) {
        io = ioc.connect("http://localhost:10010");
        io.on('connect', () => done());
    });

    describe('log notifications', function() {

      it('Should return debug messages with socket.io', (done) => {
        
        var p1 = new Promise((resolved, rejected) => {
            io.emit('subscribe', '/debug');
            io.on('/debug', (message) => {
                resolved(message);
            });
        });

        Promise.all([p1]).done((message) => 
        {
            expect(message).eql(['subscribe']);
            done();
        });
      });

    });

});
