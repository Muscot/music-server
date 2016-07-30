'use strict';

var _wikipedia = require('../../loaders/wikipedia');

var wikipedia = _interopRequireWildcard(_wikipedia);

var _chai = require('chai');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('loaders', function () {

  describe('wikipedia', function () {

    describe('GET description', function () {

      it('should return artist description from wikipedia', function (done) {

        wikipedia.get('http://en.wikipedia.org/wiki/Nirvana_(band)').then(function (result) {
          (0, _chai.expect)(result).to.have.all.keys('title', 'description', 'sources');
          done();
        }).catch(function (err) {
          console.log(err.message);
          throw err;
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbG9hZGVycy93aWtpcGVkaWFfc3BlYy4xLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0lBQVksUzs7QUFDWjs7OztBQUNBLFNBQVMsU0FBVCxFQUFvQixZQUFXOztBQUU3QixXQUFTLFdBQVQsRUFBc0IsWUFBVzs7QUFFL0IsYUFBUyxpQkFBVCxFQUE0QixZQUFXOztBQUVyQyxTQUFHLGlEQUFILEVBQXNELFVBQUMsSUFBRCxFQUFVOztBQUU5RCxrQkFBVSxHQUFWLENBQWMsNkNBQWQsRUFBNkQsSUFBN0QsQ0FBa0UsVUFBQyxNQUFELEVBQ2xFO0FBQ0ksNEJBQU8sTUFBUCxFQUFlLEVBQWYsQ0FBa0IsSUFBbEIsQ0FBdUIsR0FBdkIsQ0FBMkIsSUFBM0IsQ0FBZ0MsT0FBaEMsRUFBeUMsYUFBekMsRUFBd0QsU0FBeEQ7QUFDQTtBQUNILFNBSkQsRUFJRyxLQUpILENBSVMsVUFBQyxHQUFELEVBQ1Q7QUFDRyxrQkFBUSxHQUFSLENBQVksSUFBSSxPQUFoQjtBQUNBLGdCQUFNLEdBQU47QUFDRixTQVJEO0FBVUQsT0FaRDtBQWNELEtBaEJEO0FBa0JELEdBcEJEO0FBc0JELENBeEJEIiwiZmlsZSI6Indpa2lwZWRpYV9zcGVjLjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3aWtpcGVkaWEgZnJvbSAnLi4vLi4vbG9hZGVycy93aWtpcGVkaWEnO1xuaW1wb3J0IHtleHBlY3R9IGZyb20gJ2NoYWknO1xuZGVzY3JpYmUoJ2xvYWRlcnMnLCBmdW5jdGlvbigpIHsgXG5cbiAgZGVzY3JpYmUoJ3dpa2lwZWRpYScsIGZ1bmN0aW9uKCkge1xuXG4gICAgZGVzY3JpYmUoJ0dFVCBkZXNjcmlwdGlvbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBhcnRpc3QgZGVzY3JpcHRpb24gZnJvbSB3aWtpcGVkaWEnLCAoZG9uZSkgPT4ge1xuICAgICAgICBcbiAgICAgICAgd2lraXBlZGlhLmdldCgnaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OaXJ2YW5hXyhiYW5kKScpLnRoZW4oKHJlc3VsdCkgPT4gXG4gICAgICAgIHtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvLmhhdmUuYWxsLmtleXMoJ3RpdGxlJywgJ2Rlc2NyaXB0aW9uJywgJ3NvdXJjZXMnKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT5cbiAgICAgICAge1xuICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19