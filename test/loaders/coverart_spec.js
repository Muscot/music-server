import * as coverart from '../../loaders/coverart';
import {expect} from 'chai';
describe('loaders', function() { 

  describe('coverart', function() {

    describe('GET image urls', function() {

      it('Should return image urls for all the albums', (done) => {
        
        var albums = [
          { 'id': 'f1afec0b-26dd-3db5-9aa1-c91229a74a24',
            'title': 'Bleach',
            'first-release-date': '1989-06-01' },
          { 'id': '9a198646-ff93-3459-b943-f39da399c270',
            'title': 'First Live Show',
            'first-release-date': '2001' }
        ];

        coverart.get(albums).then((result) => 
        {
            result.forEach(function(element) {
              expect(element).to.have.all.keys('id', 'title', 'first-release-date'  ,'image', 'thumbnail');
            }, this);

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
