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
          done();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbG9hZGVycy9tdXNpY2JyYWluel9zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0lBQVksVTs7QUFDWjs7OztBQUNBLFNBQVMsU0FBVCxFQUFvQixZQUFXOztBQUU3QixXQUFTLGFBQVQsRUFBd0IsWUFBVzs7QUFFakMsYUFBUyxZQUFULEVBQXVCLFlBQVc7O0FBRWhDLFNBQUcsdUNBQUgsRUFBNEMsVUFBQyxJQUFELEVBQVU7O0FBRXBELG1CQUFXLEdBQVgsQ0FBZSxzQ0FBZixFQUF1RCxJQUF2RCxDQUE0RCxVQUFDLE1BQUQsRUFDNUQ7QUFDSSw0QkFBTyxNQUFQLEVBQWUsRUFBZixDQUFrQixJQUFsQixDQUF1QixHQUF2QixDQUEyQixJQUEzQixDQUFnQyxNQUFoQyxFQUF3QyxRQUF4QyxFQUFrRCxTQUFsRDtBQUNBLDRCQUFPLE9BQU8sSUFBZCxFQUFvQixFQUFwQixDQUF1QixFQUF2QixDQUEwQixDQUExQixDQUE0QixRQUE1QjtBQUNBLGtCQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7QUFDSCxTQU5ELEVBTUcsS0FOSCxDQU1TLFVBQUMsR0FBRCxFQUNUO0FBQ0csa0JBQVEsR0FBUixDQUFZLElBQUksT0FBaEI7QUFDQTtBQUNGLFNBVkQ7QUFZRCxPQWREO0FBZ0JELEtBbEJEO0FBb0JELEdBdEJEO0FBd0JELENBMUJEIiwiZmlsZSI6Im11c2ljYnJhaW56X3NwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtdXNpY2JyYWluIGZyb20gJy4uLy4uL2xvYWRlcnMvbXVzaWNicmFpbnonO1xuaW1wb3J0IHtleHBlY3R9IGZyb20gJ2NoYWknO1xuZGVzY3JpYmUoJ2xvYWRlcnMnLCBmdW5jdGlvbigpIHsgXG5cbiAgZGVzY3JpYmUoJ211c2ljYnJhaW56JywgZnVuY3Rpb24oKSB7XG5cbiAgICBkZXNjcmliZSgnR0VUIGFydGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBhIGRhdGEgZnJvbSBtdXNpY2JyYWlueicsIChkb25lKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBtdXNpY2JyYWluLmdldCgnNWIxMWY0Y2UtYTYyZC00NzFlLTgxZmMtYTY5YTgyNzhjN2RhJykudGhlbigocmVzdWx0KSA9PiBcbiAgICAgICAge1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG8uaGF2ZS5hbGwua2V5cygnbWJpZCcsICdhbGJ1bXMnLCAnc291cmNlcycpO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5tYmlkKS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH0pO1xuXG59KTtcbiJdfQ==