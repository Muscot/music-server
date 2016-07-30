'use strict';

var _musicbrainz = require('../../loaders/musicbrainz');

var musicbrain = _interopRequireWildcard(_musicbrainz);

var _chai = require('chai');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('loaders', function () {

  describe('musicbrainz', function () {

    describe('GET artist', function () {

      it('should return a data from musicbrainz', function (done) {

        musicbrain.get('5b11f4ce-a62d-471e-81fc-a69a8278c7da').then(function (result) {
          (0, _chai.expect)(result).to.have.all.keys('mbid', 'albums', 'sources');
          (0, _chai.expect)(result.mbid).to.be.a('string');
          console.log(result);
          done();
        }).catch(function (err) {
          console.log(err.message);
          throw err;
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbG9hZGVycy9tdXNpY2JyYWluel9zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0lBQVksVTs7QUFDWjs7OztBQUNBLFNBQVMsU0FBVCxFQUFvQixZQUFXOztBQUU3QixXQUFTLGFBQVQsRUFBd0IsWUFBVzs7QUFFakMsYUFBUyxZQUFULEVBQXVCLFlBQVc7O0FBRWhDLFNBQUcsdUNBQUgsRUFBNEMsVUFBQyxJQUFELEVBQVU7O0FBRXBELG1CQUFXLEdBQVgsQ0FBZSxzQ0FBZixFQUF1RCxJQUF2RCxDQUE0RCxVQUFDLE1BQUQsRUFDNUQ7QUFDSSw0QkFBTyxNQUFQLEVBQWUsRUFBZixDQUFrQixJQUFsQixDQUF1QixHQUF2QixDQUEyQixJQUEzQixDQUFnQyxNQUFoQyxFQUF3QyxRQUF4QyxFQUFrRCxTQUFsRDtBQUNBLDRCQUFPLE9BQU8sSUFBZCxFQUFvQixFQUFwQixDQUF1QixFQUF2QixDQUEwQixDQUExQixDQUE0QixRQUE1QjtBQUNBLGtCQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7QUFDSCxTQU5ELEVBTUcsS0FOSCxDQU1TLFVBQUMsR0FBRCxFQUNUO0FBQ0csa0JBQVEsR0FBUixDQUFZLElBQUksT0FBaEI7QUFDQSxnQkFBTSxHQUFOO0FBQ0YsU0FWRDtBQVlELE9BZEQ7QUFnQkQsS0FsQkQ7QUFvQkQsR0F0QkQ7QUF3QkQsQ0ExQkQiLCJmaWxlIjoibXVzaWNicmFpbnpfc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG11c2ljYnJhaW4gZnJvbSAnLi4vLi4vbG9hZGVycy9tdXNpY2JyYWlueic7XG5pbXBvcnQge2V4cGVjdH0gZnJvbSAnY2hhaSc7XG5kZXNjcmliZSgnbG9hZGVycycsIGZ1bmN0aW9uKCkgeyBcblxuICBkZXNjcmliZSgnbXVzaWNicmFpbnonLCBmdW5jdGlvbigpIHtcblxuICAgIGRlc2NyaWJlKCdHRVQgYXJ0aXN0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgZGF0YSBmcm9tIG11c2ljYnJhaW56JywgKGRvbmUpID0+IHtcbiAgICAgICAgXG4gICAgICAgIG11c2ljYnJhaW4uZ2V0KCc1YjExZjRjZS1hNjJkLTQ3MWUtODFmYy1hNjlhODI3OGM3ZGEnKS50aGVuKChyZXN1bHQpID0+IFxuICAgICAgICB7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0KS50by5oYXZlLmFsbC5rZXlzKCdtYmlkJywgJ2FsYnVtcycsICdzb3VyY2VzJyk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0Lm1iaWQpLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT5cbiAgICAgICAge1xuICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19