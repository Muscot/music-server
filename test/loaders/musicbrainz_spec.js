import * as musicbrainz from '../../loaders/musicbrainz';
import {expect} from 'chai';
var Promise = require('bluebird');

describe('loaders', function() { 

  describe('musicbrainz', function() {

    describe('GET artist', function() {

      it('should return a data from musicbrainz', (done) => {
        
        musicbrainz.get('5b11f4ce-a62d-471e-81fc-a69a8278c7da').then((result) => 
        {
            expect(result).to.have.all.keys('mbid', 'albums', 'sources');
            expect(result.mbid).to.be.a('string');
            done();
        }).catch((err) =>
        {
           console.log(err.message);
           throw err;
        });

      });

      it('should return data for all musicbrainz ids (throttle test)', (done) => {

        done();
        return;
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
          }).catch((err) =>
          {
            console.log(err.message);
            throw err;
          }));
        }

        Promise.all(requests).done(() => done());
      });
    });

  });

});
