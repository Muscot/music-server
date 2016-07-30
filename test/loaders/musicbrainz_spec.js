import * as musicbrain from '../../loaders/musicbrainz';
import {expect} from 'chai';
describe('loaders', function() { 

  describe('musicbrainz', function() {

    describe('GET artist', function() {

      it('should return a data from musicbrainz', (done) => {
        
        musicbrain.get('5b11f4ce-a62d-471e-81fc-a69a8278c7da').then((result) => 
        {
            expect(result).to.have.all.keys('mbid', 'albums', 'sources');
            expect(result.mbid).to.be.a('string');
            console.log(result);
            done();
        }).catch((err) =>
        {
           console.log(err.message);
           throw err;
        });

      });

    });

  });

});
