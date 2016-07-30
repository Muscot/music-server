import * as wikipedia from '../../loaders/wikipedia';
import {expect} from 'chai';
describe('loaders', function() { 

  describe('wikipedia', function() {

    describe('GET description', function() {

      it('should return artist description from wikipedia', (done) => {
        
        wikipedia.get('http://en.wikipedia.org/wiki/Nirvana_(band)').then((result) => 
        {
            expect(result).to.have.all.keys('title', 'description', 'sources');
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
