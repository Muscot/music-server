import * as database from '../../database';
import {expect} from 'chai';
describe('database', function() { 

    describe('INSERT json to database', function() {

      it('should return a json string', (done) => {
        
        var json = {
            mbid : '5b11f4ce-a62d-0000-81fc-a69a8278c7da', 
            key2 : 'val2' 
        };

        database.saveArtist(json).then((result) => 
        {
            expect(JSON.parse(result)).eql(json);
            done();
        }).catch((err) =>
        {
           console.log(err.message);
           throw err;
        });

      });

    });

    describe('SELECT json from database', function() {

      it('should return a json string', (done) => {
        
        var json = {
            mbid : '5b11f4ce-a62d-0000-81fc-a69a8278c7da', 
            key2 : 'val2' 
        };

        database.getArtist('5b11f4ce-a62d-0000-81fc-a69a8278c7da').then((result) => 
        {
            expect(JSON.parse(result)).eql(json);
            done();
        }).catch((err) =>
        {
           console.log(err.message);
           throw err;
        });
      });
    });
});
