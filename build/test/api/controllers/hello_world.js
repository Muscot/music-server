'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function () {

  describe('hello_world', function () {

    describe('GET /hello', function () {

      it('should return a default string', function (done) {

        request(server).get('/hello').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200).end(function (err, res) {
          should.not.exist(err);

          res.body.should.eql('Hello, stranger!');

          done();
        });
      });

      it('should accept a name parameter', function (done) {

        request(server).get('/hello').query({ name: 'Scott' }).set('Accept', 'application/json').expect('Content-Type', /json/).expect(200).end(function (err, res) {
          should.not.exist(err);

          res.body.should.eql('Hello, Scott!');

          done();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvYXBpL2NvbnRyb2xsZXJzL2hlbGxvX3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkO0FBQ0EsSUFBSSxTQUFTLFFBQVEsY0FBUixDQUFiOztBQUVBLFNBQVMsYUFBVCxFQUF3QixZQUFXOztBQUVqQyxXQUFTLGFBQVQsRUFBd0IsWUFBVzs7QUFFakMsYUFBUyxZQUFULEVBQXVCLFlBQVc7O0FBRWhDLFNBQUcsZ0NBQUgsRUFBcUMsVUFBUyxJQUFULEVBQWU7O0FBRWxELGdCQUFRLE1BQVIsRUFDRyxHQURILENBQ08sUUFEUCxFQUVHLEdBRkgsQ0FFTyxRQUZQLEVBRWlCLGtCQUZqQixFQUdHLE1BSEgsQ0FHVSxjQUhWLEVBRzBCLE1BSDFCLEVBSUcsTUFKSCxDQUlVLEdBSlYsRUFLRyxHQUxILENBS08sVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQjtBQUN0QixpQkFBTyxHQUFQLENBQVcsS0FBWCxDQUFpQixHQUFqQjs7QUFFQSxjQUFJLElBQUosQ0FBUyxNQUFULENBQWdCLEdBQWhCLENBQW9CLGtCQUFwQjs7QUFFQTtBQUNELFNBWEg7QUFZRCxPQWREOztBQWdCQSxTQUFHLGdDQUFILEVBQXFDLFVBQVMsSUFBVCxFQUFlOztBQUVsRCxnQkFBUSxNQUFSLEVBQ0csR0FESCxDQUNPLFFBRFAsRUFFRyxLQUZILENBRVMsRUFBRSxNQUFNLE9BQVIsRUFGVCxFQUdHLEdBSEgsQ0FHTyxRQUhQLEVBR2lCLGtCQUhqQixFQUlHLE1BSkgsQ0FJVSxjQUpWLEVBSTBCLE1BSjFCLEVBS0csTUFMSCxDQUtVLEdBTFYsRUFNRyxHQU5ILENBTU8sVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQjtBQUN0QixpQkFBTyxHQUFQLENBQVcsS0FBWCxDQUFpQixHQUFqQjs7QUFFQSxjQUFJLElBQUosQ0FBUyxNQUFULENBQWdCLEdBQWhCLENBQW9CLGVBQXBCOztBQUVBO0FBQ0QsU0FaSDtBQWFELE9BZkQ7QUFpQkQsS0FuQ0Q7QUFxQ0QsR0F2Q0Q7QUF5Q0QsQ0EzQ0QiLCJmaWxlIjoiaGVsbG9fd29ybGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2hvdWxkID0gcmVxdWlyZSgnc2hvdWxkJyk7XG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVydGVzdCcpO1xudmFyIHNlcnZlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2FwcCcpO1xuXG5kZXNjcmliZSgnY29udHJvbGxlcnMnLCBmdW5jdGlvbigpIHtcblxuICBkZXNjcmliZSgnaGVsbG9fd29ybGQnLCBmdW5jdGlvbigpIHtcblxuICAgIGRlc2NyaWJlKCdHRVQgL2hlbGxvJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgZGVmYXVsdCBzdHJpbmcnLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgcmVxdWVzdChzZXJ2ZXIpXG4gICAgICAgICAgLmdldCgnL2hlbGxvJylcbiAgICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gICAgICAgICAgLmV4cGVjdCgnQ29udGVudC1UeXBlJywgL2pzb24vKVxuICAgICAgICAgIC5leHBlY3QoMjAwKVxuICAgICAgICAgIC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgICAgIHNob3VsZC5ub3QuZXhpc3QoZXJyKTtcblxuICAgICAgICAgICAgcmVzLmJvZHkuc2hvdWxkLmVxbCgnSGVsbG8sIHN0cmFuZ2VyIScpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgYSBuYW1lIHBhcmFtZXRlcicsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICByZXF1ZXN0KHNlcnZlcilcbiAgICAgICAgICAuZ2V0KCcvaGVsbG8nKVxuICAgICAgICAgIC5xdWVyeSh7IG5hbWU6ICdTY290dCd9KVxuICAgICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgICAgICAuZXhwZWN0KCdDb250ZW50LVR5cGUnLCAvanNvbi8pXG4gICAgICAgICAgLmV4cGVjdCgyMDApXG4gICAgICAgICAgLmVuZChmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICAgICAgc2hvdWxkLm5vdC5leGlzdChlcnIpO1xuXG4gICAgICAgICAgICByZXMuYm9keS5zaG91bGQuZXFsKCdIZWxsbywgU2NvdHQhJyk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19