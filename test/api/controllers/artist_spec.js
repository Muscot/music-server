import {expect} from 'chai';

var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var Promise = require('bluebird');

describe('controllers', function() {

  describe('artist', function() {

    describe('GET /artist/{mbid}', function() {

      it('should return a really great album', function(done) {

        done();
        return;

        request(server)
          .get('/artists/5b11f4ce-a62d-471e-81fc-a69a8278c7da')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            var json = res.body;
            expect(json).to.have.all.keys('mbid', 'title', 'albums', 'description', 'sources');
            done();
          });
      });

      it('should still work with many request throttle and promise share.', function(done) {

          var ids = [
            '5eecaf18-02ec-47af-a4f2-7831db373419',
            'ff6e677f-91dd-4986-a174-8db0474b1799',
            '7249b899-8db8-43e7-9e6e-22f1e736024e',
            '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
            'e1f1e33e-2e4c-4d43-b91b-7064068d3283',
            '5eecaf18-02ec-47af-a4f2-7831db373419',
            'ff6e677f-91dd-4986-a174-8db0474b1799',
            '7249b899-8db8-43e7-9e6e-22f1e736024e',
            '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
            'e1f1e33e-2e4c-4d43-b91b-7064068d3283',
            '5eecaf18-02ec-47af-a4f2-7831db373419',
            'ff6e677f-91dd-4986-a174-8db0474b1799',
            '7249b899-8db8-43e7-9e6e-22f1e736024e',
            '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
            'e1f1e33e-2e4c-4d43-b91b-7064068d3283',
            '5eecaf18-02ec-47af-a4f2-7831db373419',
            'ff6e677f-91dd-4986-a174-8db0474b1799',
            '7249b899-8db8-43e7-9e6e-22f1e736024e',
            '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
            'e1f1e33e-2e4c-4d43-b91b-7064068d3283'
          ];
          var requests = [];

          for (var index = 0; index < ids.length; index++) {
             let mbid = ids[index];
             requests.push(new Promise((resolve, reject) => {
                request(server)
                  .get('/artists/' + mbid)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);
                    var json = res.body;
                    //expect(json).to.have.all.keys('mbid', 'title', 'albums', 'sources');
                    resolve(json);
                  });
             }));
          }

          Promise.all(requests).done(() => done());
        });

      it('should work with cache, test 1000 request', function(done) {

          var requests = [];
          for (var index = 0; index < 1000; index++) {
             let mbid = '5eecaf18-02ec-47af-a4f2-7831db373419';
             requests.push(new Promise((resolve, reject) => {
                request(server)
                  .get('/artists/' + mbid)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    should.not.exist(err);
                    var json = res.body;
                    //expect(json).to.have.all.keys('mbid', 'title', 'albums', 'sources');
                    resolve(json);
                  });
             }));
          }

          Promise.all(requests).done(() => done());
        });









      it('should return 404 (NOT FOUND)', function(done) {

        // disable ratelimit
        //TODO
        done();
        return;

        request(server)
          .get('/artists/--INVALID-ID--')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });

    });

  });

});