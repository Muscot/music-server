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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbG9hZGVycy93aWtpcGVkaWFfc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztJQUFZLFM7O0FBQ1o7Ozs7QUFDQSxTQUFTLFNBQVQsRUFBb0IsWUFBVzs7QUFFN0IsV0FBUyxXQUFULEVBQXNCLFlBQVc7O0FBRS9CLGFBQVMsaUJBQVQsRUFBNEIsWUFBVzs7QUFFckMsU0FBRyxpREFBSCxFQUFzRCxVQUFDLElBQUQsRUFBVTs7QUFFOUQsa0JBQVUsR0FBVixDQUFjLDZDQUFkLEVBQTZELElBQTdELENBQWtFLFVBQUMsTUFBRCxFQUNsRTtBQUNJLDRCQUFPLE1BQVAsRUFBZSxFQUFmLENBQWtCLElBQWxCLENBQXVCLEdBQXZCLENBQTJCLElBQTNCLENBQWdDLE9BQWhDLEVBQXlDLGFBQXpDLEVBQXdELFNBQXhEO0FBQ0E7QUFDSCxTQUpELEVBSUcsS0FKSCxDQUlTLFVBQUMsR0FBRCxFQUNUO0FBQ0csa0JBQVEsR0FBUixDQUFZLElBQUksT0FBaEI7QUFDQSxnQkFBTSxHQUFOO0FBQ0YsU0FSRDtBQVVELE9BWkQ7QUFjRCxLQWhCRDtBQWtCRCxHQXBCRDtBQXNCRCxDQXhCRCIsImZpbGUiOiJ3aWtpcGVkaWFfc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHdpa2lwZWRpYSBmcm9tICcuLi8uLi9sb2FkZXJzL3dpa2lwZWRpYSc7XG5pbXBvcnQge2V4cGVjdH0gZnJvbSAnY2hhaSc7XG5kZXNjcmliZSgnbG9hZGVycycsIGZ1bmN0aW9uKCkgeyBcblxuICBkZXNjcmliZSgnd2lraXBlZGlhJywgZnVuY3Rpb24oKSB7XG5cbiAgICBkZXNjcmliZSgnR0VUIGRlc2NyaXB0aW9uJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFydGlzdCBkZXNjcmlwdGlvbiBmcm9tIHdpa2lwZWRpYScsIChkb25lKSA9PiB7XG4gICAgICAgIFxuICAgICAgICB3aWtpcGVkaWEuZ2V0KCdodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05pcnZhbmFfKGJhbmQpJykudGhlbigocmVzdWx0KSA9PiBcbiAgICAgICAge1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG8uaGF2ZS5hbGwua2V5cygndGl0bGUnLCAnZGVzY3JpcHRpb24nLCAnc291cmNlcycpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSk7XG4iXX0=