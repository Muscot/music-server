import * as musicbrainz from '../../loaders/musicbrainz';
import {expect} from 'chai';
var Promise = require('bluebird');

describe('loaders', function() { 

  describe('musicbrainz', function() {

    describe('VALIDATE mbid', function() {
 
      it('should return ok', (done) => {
        expect(musicbrainz.validate('5b11f4ce-a62d-471e-81fc-a69a8278c7da')).to.be.ok;
        done();
      });

      it('should throw an exception', (done) => {
        expect(musicbrainz.validate.bind(this, '5b114ce-a62d-471e-81fc-a69a278c7da')).to.throw(musicbrainz.BadRequestError);
        expect(musicbrainz.validate.bind(this, '')).to.throw(musicbrainz.BadRequestError);
        expect(musicbrainz.validate.bind(this, '-INVALID---------')).to.throw(musicbrainz.BadRequestError);
        done();
      });

   });

    describe('GET artist from musicbrainz', function() {

      it('should return no artist found', (done) => {
        
        musicbrainz.get('c6027135-3c5b-3246-955b-f5fc2a256dd8').then((result) => 
        {
            expect(result).to.have.all.keys('mbid', 'albums', 'sources');
            expect(result.mbid).to.be.a('string');
        }).catch(musicbrainz.NotFoundError, function (err) {
            expect(err.statusCode).equal(404);
            expect(err.message).to.have.length.above(1);
        }).catch(musicbrainz.RateLimitError, (err) =>
        {
            expect(err.statusCode).equal(503);
            expect(err.message).to.have.length.above(1);
        })
        .catch((err) =>
        {
           throw err;
        }).done(() => done());

      });


      it('should return a valid json', (done) => {
        
        musicbrainz.get('5b11f4ce-a62d-471e-81fc-a69a8278c7da').then((result) => 
        {
            expect(result).to.have.all.keys('mbid', 'albums', 'sources');
            expect(result.mbid).to.be.a('string');
        }).catch(musicbrainz.RateLimitError, (err) =>
        {
            expect(err.statusCode).equal(503);
            expect(err.message).to.have.length.above(1);
        })
        .catch((err) =>
        {
           throw err;
        }).done(() => done());

      });

      it('should return data for all musicbrainz ids (throttle test)', (done) => {

        var ids = [
          '5eecaf18-02ec-47af-a4f2-7831db373419',
          'ff6e677f-91dd-4986-a174-8db0474b1799',
          '7249b899-8db8-43e7-9e6e-22f1e736024e',
          '5b11f4ce-a62d-471e-81fc-a69a8278c7da',
          'e1f1e33e-2e4c-4d43-b91b-7064068d3283'
        ];
        var requests = [];
        for (var index = 0; index < ids.length; index++) {
          let mbid = ids[index];
          requests.push(musicbrainz.get(mbid).then((result) => 
          {
              expect(result).to.have.all.keys('mbid', 'albums', 'sources');
              expect(result.mbid).to.be.a('string');
          }).catch(musicbrainz.RateLimitError, (err) =>
          {
              expect(err.statusCode).equal(503);
              expect(err.message).to.have.length.above(1);
          })
          .catch((err) =>
          {
             throw err;
          }));
        }

        Promise.all(requests).done(() => done());
      });
    });

  });

});
